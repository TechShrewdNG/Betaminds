import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

const consultation = z.object({
  _hp: honeypot,

  // 1. Contact & brand
  email,
  brandName: required("Brand name", 160),
  phone: required("Phone", 60),
  website: required("Website or social", 400),

  // 2. Where is your brand based?
  address1: optional(240),
  city: optional(120),
  region: optional(120),
  country: required("Country", 120),

  // 3. About your business
  sells: optional(120),
  industry: optional(160),
  yearsTrading: required("How long you've been in business", 120),
  channel: optional(120),
  reach: optional(120),

  // 4. Current digital presence
  marketplaces: optional(600),
  paidAds: optional(600),
  brandAssets: optional(600),

  // 5. Team & decision-making
  teamStructure: required("Team structure", 600),
  internalOrOutsource: optional(600),
  whoElseDecides: optional(400),
  budgetAuthority: optional(200),

  // 6. Why now?
  whyNow: required("Why now", 2000),

  // 7. Engagement details
  plan: required("Partnership plan", 120),
  startDate: required("Ideal start date", 120),
  budget: required("Budget", 120),

  // 8. Just one more
  howHeard: optional(400),
});

const academy = z.object({
  _hp: honeypot,
  name: required("Your name", 160),
  email,
  phone: optional(60),
  course: required("Course", 160),
  format: optional(120),
  background: optional(3000),
});

const summit = z.object({
  _hp: honeypot,
  name: required("Your name", 160),
  email,
  organisation: optional(200),
  role: optional(160),
  /** attend · speak · sponsor · volunteer */
  interest: required("How you'd like to take part", 120),
  message: optional(3000),
});

const newsletter = z.object({
  _hp: honeypot,
  email,
});

type Digest = { name: string; email: string; summary: string };

const truncate = (value: string, max = 180) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

const definitions = {
  brief: {
    schema: brief,
    digest: (d: z.infer<typeof brief>): Digest => ({
      name: d.name,
      email: d.email,
      summary: truncate(d.need || d.project),
    }),
  },
  consultation: {
    schema: consultation,
    digest: (d: z.infer<typeof consultation>): Digest => ({
      name: d.brandName,
      email: d.email,
      summary: truncate(`${d.plan} · ${d.budget} · ${d.whyNow}`),
    }),
  },
  academy: {
    schema: academy,
    digest: (d: z.infer<typeof academy>): Digest => ({
      name: d.name,
      email: d.email,
      summary: truncate([d.course, d.format].filter(Boolean).join(" · ")),
    }),
  },
  summit: {
    schema: summit,
    digest: (d: z.infer<typeof summit>): Digest => ({
      name: d.name,
      email: d.email,
      summary: truncate(
        [d.interest, d.organisation].filter(Boolean).join(" · "),
      ),
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
  SubmissionKind,
  { schema: z.ZodTypeAny; digest: (data: never) => Digest }
>;

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
  const definition = definitions[kind];
  if (!definition) return { ok: false, errors: {}, message: "Unknown form." };

  const parsed = definition.schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      errors[key] ??= issue.message;
    }
    // The honeypot only trips for bots; don't show it as a field error.
    if (errors._hp) {
      delete errors._hp;
      return { ok: true };
    }
    return {
      ok: false,
      errors,
      message: "Please check the highlighted fields.",
    };
  }

  const data = parsed.data as Record<string, unknown>;
  delete data._hp;
  const digest = (definition.digest as (d: unknown) => Digest)(data);

  // Newsletter signups are idempotent — re-subscribing shouldn't pile up rows.
  if (kind === "newsletter") {
    const existing = await prisma.submission.findFirst({
      where: { kind, email: digest.email },
    });
    if (existing) return { ok: true };
  }

  await prisma.submission.create({
    data: {
      kind,
      name: digest.name,
      email: digest.email,
      summary: digest.summary,
      data: JSON.stringify(data),
    },
  });

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

/** Field ordering for the CSV export and the detail view. */
export function orderedEntries(
  kind: string,
  data: Record<string, unknown>,
): [string, string][] {
  const definition = definitions[kind as SubmissionKind];
  const known = definition
    ? Object.keys((definition.schema as z.ZodObject<z.ZodRawShape>).shape)
    : [];
  const keys = [
    ...known.filter((k) => k !== "_hp" && k in data),
    ...Object.keys(data).filter((k) => k !== "_hp" && !known.includes(k)),
  ];
  return keys.map((key) => [key, String(data[key] ?? "")]);
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

export const fieldLabel = (key: string) =>
  LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const csvCell = (value: string) =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export function toCsv(rows: SubmissionRow[]): string {
  // One flat sheet across kinds: the union of every field that appears.
  const dynamic: string[] = [];
  for (const row of rows) {
    for (const [key] of orderedEntries(row.kind, row.data)) {
      if (!dynamic.includes(key)) dynamic.push(key);
    }
  }

  const header = ["Received", "Type", "Status", "Notes", ...dynamic.map(fieldLabel)];
  const lines = [header.map(csvCell).join(",")];

  for (const row of rows) {
    const values = Object.fromEntries(orderedEntries(row.kind, row.data));
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
