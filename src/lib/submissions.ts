import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyStudio, autoReply } from "@/lib/notify";
import { resolveForm, type DynamicKind } from "@/lib/forms/resolve";
import { parseWithFields } from "@/lib/forms/validate";
import { labelMap, type FormField } from "@/lib/forms/definition";

/**
 * Everything the public site can submit.
 *
 * Each kind declares a Zod schema plus a `digest` that pulls the name, email and
 * one-line summary out onto their own columns, so the admin inbox can list and
 * search submissions without unpacking JSON.
 */

export const SUBMISSION_KINDS = [
  "brief",
  "consultation",
  "academy",
  "summit",
  "newsletter",
] as const;

export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export const KIND_LABEL: Record<SubmissionKind, string> = {
  brief: "Project brief",
  consultation: "Discovery consultation",
  academy: "Academy application",
  summit: "Summit interest",
  newsletter: "Newsletter",
};

export const STATUSES = ["new", "read", "replied", "archived"] as const;
export type SubmissionStatus = (typeof STATUSES)[number];

/* -- field helpers --------------------------------------------------------- */

const required = (label: string, max = 2000) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optional = (max = 2000) => z.string().trim().max(max).optional().default("");

const email = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(320)
  .email("That doesn't look like an email address.");

/**
 * Honeypot. A real person never sees this field, so anything in it is a bot.
 * Named innocuously because that's the point.
 */
const honeypot = z
  .string()
  .max(0, "Submission rejected.")
  .optional()
  .default("");

/* -- schemas --------------------------------------------------------------- */

const brief = z.object({
  _hp: honeypot,
  name: required("Your name", 160),
  email,
  company: optional(160),
  need: optional(400),
  project: required("Project details", 5000),
});

const newsletter = z.object({
  _hp: honeypot,
  email,
});

type Digest = { name: string; email: string; summary: string };

const truncate = (value: string, max = 180) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

/**
 * Forms whose shape is fixed in code.
 *
 * The other three (consultation, academy, summit) have CMS-defined fields, so
 * their validation is built at request time from the stored definitions — see
 * lib/forms/validate.ts.
 */
const definitions = {
  brief: {
    schema: brief,
    digest: (d: z.infer<typeof brief>): Digest => ({
      name: d.name,
      email: d.email,
      summary: truncate(d.need || d.project),
    }),
  },
  newsletter: {
    schema: newsletter,
    digest: (d: z.infer<typeof newsletter>): Digest => ({
      name: "",
      email: d.email,
      summary: "Summit newsletter",
    }),
  },
} satisfies Record<
  StaticKind,
  { schema: z.ZodObject<z.ZodRawShape>; digest: (data: never) => Digest }
>;

const DYNAMIC_KINDS = ["consultation", "academy", "summit"] as const;

type StaticKind = Exclude<SubmissionKind, DynamicKind>;

export const isDynamicKind = (kind: string): kind is DynamicKind =>
  (DYNAMIC_KINDS as readonly string[]).includes(kind);

/**
 * Derives the name, email and summary columns without knowing any field keys.
 *
 * Editors can rename or reorder fields, so this reads the field *types* rather
 * than hardcoding "email" or "brandName" the way the static digests can.
 */
function digestFromFields(
  fields: FormField[],
  data: Record<string, string>,
): Digest {
  const value = (key: string) => (data[key] ?? "").trim();

  const emailKey =
    fields.find((field) => field.type === "email" && value(field.key))?.key ??
    "email";
  const email = value(emailKey);

  const nameKey =
    ["name", "brandName", "fullName", "company", "organisation"].find((key) =>
      value(key),
    ) ??
    fields.find(
      (field) =>
        field.type === "text" && field.key !== emailKey && value(field.key),
    )?.key;
  const name = nameKey ? value(nameKey) : "";

  // A one-line preview for the inbox: the chosen options first (required ones
  // lead, since those are the questions that matter), then the first long
  // answer. The detail view carries everything.
  const selects = [
    ...fields.filter((f) => f.type === "select" && f.required),
    ...fields.filter((f) => f.type === "select" && !f.required),
  ]
    .map((field) => value(field.key))
    .filter(Boolean);

  const firstLong = fields.find(
    (field) => field.type === "textarea" && value(field.key),
  );

  const parts = selects.slice(0, 2);
  if (firstLong) parts.push(value(firstLong.key));

  return { name, email, summary: truncate(parts.join(" · ")) };
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string>; message?: string };

/**
 * Validate and store one submission.
 *
 * Returns field-level errors rather than throwing, so a form can render them
 * inline next to the inputs that caused them.
 */
export async function submit(
  kind: SubmissionKind,
  raw: Record<string, unknown>,
): Promise<SubmitResult> {
  let data: Record<string, string>;
  let digest: Digest;
  let order: string[];
  let labels: Record<string, string>;

  if (isDynamicKind(kind)) {
    // Validated against the same definitions the page rendered from, so a field
    // the studio added in the admin is accepted, and one they removed is not.
    const { fields } = await resolveForm(kind);
    const outcome = parseWithFields(fields, raw);

    if (!outcome.ok) {
      // A tripped honeypot is a bot; look successful and store nothing.
      if (outcome.botDetected) return { ok: true };
      return {
        ok: false,
        errors: outcome.errors,
        message: "Please check the highlighted fields.",
      };
    }

    data = outcome.data;
    digest = digestFromFields(fields, data);
    order = fields.map((field) => field.key);
    labels = labelMap(fields);
  } else {
    const definition = definitions[kind as StaticKind];
    if (!definition) return { ok: false, errors: {}, message: "Unknown form." };

    const parsed = definition.schema.safeParse(raw);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "_");
        errors[key] ??= issue.message;
      }
      if (errors._hp) return { ok: true };
      return {
        ok: false,
        errors,
        message: "Please check the highlighted fields.",
      };
    }

    data = parsed.data as Record<string, string>;
    delete data._hp;
    digest = (definition.digest as (d: unknown) => Digest)(data);
    order = Object.keys(definition.schema.shape);
    labels = {};
  }

  // Newsletter signups are idempotent — re-subscribing shouldn't pile up rows.
  if (kind === "newsletter") {
    const existing = await prisma.submission.findFirst({
      where: { kind, email: digest.email },
    });
    if (existing) return { ok: true };
  }

  const row = await prisma.submission.create({
    data: {
      kind,
      name: digest.name,
      email: digest.email,
      summary: digest.summary,
      data: JSON.stringify(data),
    },
  });

  // The enquiry is safely stored by this point, so mail is best-effort: a
  // provider outage must never turn into a failed submission for the visitor.
  const notification = {
    id: row.id,
    kindLabel: KIND_LABEL[kind],
    entries: orderedEntries(data, order).map(
      ([key, value]) => [fieldLabel(key, labels), value] as [string, string],
    ),
    name: digest.name,
    email: digest.email,
  };

  await Promise.allSettled([
    notifyStudio(notification),
    autoReply(notification),
  ]);

  return { ok: true };
}

/* -- reading (admin) ------------------------------------------------------- */

export type SubmissionRow = {
  id: string;
  kind: string;
  name: string;
  email: string;
  summary: string;
  status: string;
  notes: string;
  createdAt: Date;
  data: Record<string, unknown>;
};

const parseData = (raw: string): Record<string, unknown> => {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
};

export async function listSubmissions(filter: {
  kind?: string;
  status?: string;
  query?: string;
}): Promise<SubmissionRow[]> {
  const where: Record<string, unknown> = {};
  if (filter.kind && filter.kind !== "all") where.kind = filter.kind;
  if (filter.status && filter.status !== "all") where.status = filter.status;
  if (filter.query?.trim()) {
    const q = filter.query.trim();
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { summary: { contains: q } },
    ];
  }

  const rows = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return rows.map((row) => ({ ...row, data: parseData(row.data) }));
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  const row = await prisma.submission.findUnique({ where: { id } });
  return row ? { ...row, data: parseData(row.data) } : null;
}

export async function countsByStatus() {
  const grouped = await prisma.submission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const out: Record<string, number> = { new: 0, read: 0, replied: 0, archived: 0 };
  for (const g of grouped) out[g.status] = g._count._all;
  return out;
}

export async function countsByKind() {
  const grouped = await prisma.submission.groupBy({
    by: ["kind"],
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const g of grouped) out[g.kind] = g._count._all;
  return out;
}

/**
 * How one submission's answers are displayed: known fields in their defined
 * order, then anything else that's stored.
 *
 * The "anything else" case matters — a submission collected before an editor
 * removed a field still has that answer, and dropping it silently would lose
 * somebody's enquiry detail.
 */
export function orderedEntries(
  data: Record<string, unknown>,
  order: string[],
): [string, string][] {
  const known = order.filter((key) => key !== "_hp" && key in data);
  const extra = Object.keys(data).filter(
    (key) => key !== "_hp" && !order.includes(key),
  );
  return [...known, ...extra].map((key) => [key, String(data[key] ?? "")]);
}

export type DisplaySchema = { order: string[]; labels: Record<string, string> };

/**
 * Field order and labels for one kind, for the inbox and the CSV export.
 *
 * For CMS-defined forms these come from the current definitions, so renaming a
 * question renames it everywhere. Historical answers under keys that no longer
 * exist fall back to a humanised key.
 */
export async function displaySchema(kind: string): Promise<DisplaySchema> {
  if (isDynamicKind(kind)) {
    try {
      const { fields } = await resolveForm(kind);
      return {
        order: fields.map((field) => field.key),
        labels: labelMap(fields),
      };
    } catch {
      return { order: [], labels: {} };
    }
  }

  const definition = definitions[kind as StaticKind];
  return {
    order: definition ? Object.keys(definition.schema.shape) : [],
    labels: {},
  };
}

/** Display schemas for every kind present in `rows`, resolved once. */
export async function displaySchemas(
  kinds: string[],
): Promise<Map<string, DisplaySchema>> {
  const unique = [...new Set(kinds)];
  const resolved = await Promise.all(unique.map(displaySchema));
  return new Map(unique.map((kind, index) => [kind, resolved[index]]));
}

const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Brand / company",
  need: "What they need",
  project: "Project",
  brandName: "Brand name",
  website: "Website / social",
  address1: "Address",
  city: "City",
  region: "State / region",
  country: "Country",
  sells: "Sells",
  industry: "Industry",
  yearsTrading: "Years trading",
  channel: "Sells online / offline",
  reach: "Reach",
  marketplaces: "Marketplaces",
  paidAds: "Paid ads",
  brandAssets: "Brand assets",
  teamStructure: "Team structure",
  internalOrOutsource: "Internal team or outsourcing",
  whoElseDecides: "Who else decides",
  budgetAuthority: "Budget authority",
  whyNow: "Why now",
  plan: "Partnership plan",
  startDate: "Ideal start date",
  budget: "Budget",
  howHeard: "How they heard about us",
  course: "Course",
  format: "Preferred format",
  background: "Background",
  organisation: "Organisation",
  role: "Role",
  interest: "Interest",
  message: "Message",
};

export const fieldLabel = (key: string, labels: Record<string, string> = {}) =>
  labels[key] ??
  LABELS[key] ??
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const csvCell = (value: string) =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export async function toCsv(rows: SubmissionRow[]): Promise<string> {
  const schemas = await displaySchemas(rows.map((row) => row.kind));
  const schemaFor = (kind: string) =>
    schemas.get(kind) ?? { order: [], labels: {} };

  // One flat sheet across kinds: the union of every field that appears.
  const dynamic: string[] = [];
  const labels: Record<string, string> = {};
  for (const row of rows) {
    const schema = schemaFor(row.kind);
    Object.assign(labels, schema.labels);
    for (const [key] of orderedEntries(row.data, schema.order)) {
      if (!dynamic.includes(key)) dynamic.push(key);
    }
  }

  const header = [
    "Received",
    "Type",
    "Status",
    "Notes",
    ...dynamic.map((key) => fieldLabel(key, labels)),
  ];
  const lines = [header.map(csvCell).join(",")];

  for (const row of rows) {
    const values = Object.fromEntries(
      orderedEntries(row.data, schemaFor(row.kind).order),
    );
    lines.push(
      [
        row.createdAt.toISOString(),
        KIND_LABEL[row.kind as SubmissionKind] ?? row.kind,
        row.status,
        row.notes,
        ...dynamic.map((key) => String(values[key] ?? "")),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  return `${lines.join("\r\n")}\r\n`;
}
