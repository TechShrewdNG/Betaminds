import { z } from "zod";
import type { FormField } from "./definition";

/**
 * Builds a Zod schema from CMS-defined field definitions.
 *
 * The rules that used to be hardcoded per form now come from the definitions:
 * `required` drives the presence check, and `type` drives the format check. The
 * honeypot is always added, whatever the form.
 */

const MAX_LENGTH: Record<FormField["type"], number> = {
  text: 400,
  email: 320,
  tel: 60,
  date: 40,
  url: 500,
  textarea: 5000,
  select: 200,
};

function fieldSchema(field: FormField): z.ZodTypeAny {
  const max = MAX_LENGTH[field.type];

  // Length and presence first, while this is still a ZodString. A `.refine()`
  // returns ZodEffects, which no longer exposes `.min()`/`.max()` — calling them
  // afterwards throws at request time rather than failing to compile.
  const base = z.string().trim().max(max, `${field.label} is too long.`);
  let schema: z.ZodTypeAny = field.required
    ? base.min(1, `${field.label} is required.`)
    : base;

  // Format checks are written to pass on "" so they only apply to an answer that
  // was actually given; presence is the required check's job.
  if (field.type === "email") {
    schema = schema.refine(
      (value) =>
        value === "" || z.string().email().safeParse(value).success,
      { message: "That doesn't look like an email address." },
    );
  }

  if (field.type === "url") {
    schema = schema.refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      { message: `${field.label} should be a full URL.` },
    );
  }

  if (field.type === "select" && field.options.length > 0) {
    // Guards against a tampered payload naming an option that isn't offered.
    schema = schema.refine(
      (value) => value === "" || field.options.includes(value),
      { message: `Choose one of the listed options for ${field.label}.` },
    );
  }

  return field.required ? schema : schema.optional().default("");
}

/** Anything in the honeypot means a bot; a real person never sees the input. */
const honeypot = z.string().max(0, "Submission rejected.").optional().default("");

export function buildSchema(fields: FormField[]) {
  const shape: z.ZodRawShape = { _hp: honeypot };
  for (const field of fields) {
    shape[field.key] = fieldSchema(field);
  }
  return z.object(shape);
}

export type ParseOutcome =
  | { ok: true; data: Record<string, string> }
  | { ok: false; errors: Record<string, string>; botDetected: boolean };

export function parseWithFields(
  fields: FormField[],
  raw: Record<string, unknown>,
): ParseOutcome {
  // Fill in absent keys as empty strings and drop anything not defined, so a
  // field missing from the payload fails with its own "is required" message
  // rather than Zod's bare "Required", and stray keys can't reach the database.
  const input: Record<string, unknown> = { _hp: raw._hp ?? "" };
  for (const field of fields) {
    input[field.key] = raw[field.key] ?? "";
  }

  const parsed = buildSchema(fields).safeParse(input);

  if (parsed.success) {
    const data = { ...(parsed.data as Record<string, string>) };
    delete data._hp;
    return { ok: true, data };
  }

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "_");
    errors[key] ??= issue.message;
  }

  if (errors._hp) return { ok: false, errors: {}, botDetected: true };
  return { ok: false, errors, botDetected: false };
}
