/**
 * Form field definitions as content.
 *
 * Field labels, types, options and required-ness live in the CMS rather than in
 * the components, so the studio can rename a question, add an option or add a
 * whole field without a developer. The same definitions drive three things:
 * rendering (components/forms/DynamicForm.tsx), validation
 * (lib/forms/validate.ts) and the labels in the admin inbox.
 *
 * The `key` is the stable identifier — it becomes the input's `name` and the key
 * in the stored submission. Renaming a *label* is free; changing a `key` orphans
 * the answers already stored under the old one.
 */

export const FIELD_TYPES = [
  "text",
  "email",
  "tel",
  "date",
  "url",
  "textarea",
  "select",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export type FormField = {
  key: string;
  label: string;
  type: FieldType;
  /** Newline- or comma-free entries; only meaningful for `select`. */
  options: string[];
  required: boolean;
  placeholder: string;
  /** "full" spans the row; "half" pairs up with the next half-width field. */
  width: "full" | "half";
};

export type FormGroup = {
  title: string;
  fields: FormField[];
};

/** A blank field, used when the admin adds a row to a fields repeater. */
export const BLANK_FIELD: FormField = {
  key: "",
  label: "",
  type: "text",
  options: [],
  required: false,
  placeholder: "",
  width: "full",
};

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

/**
 * Coerces whatever is stored into usable field definitions.
 *
 * Content comes from a database row an editor can shape, so nothing here trusts
 * the type: a field missing a key or label is dropped rather than rendered as a
 * broken input, and an unknown type falls back to a plain text box.
 */
export function normaliseFields(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const fields: FormField[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Partial<FormField>;

    if (!isNonEmpty(candidate.key) || !isNonEmpty(candidate.label)) continue;

    const key = candidate.key.trim();
    // Duplicate keys would silently overwrite each other on submit.
    if (seen.has(key)) continue;
    seen.add(key);

    const type = (FIELD_TYPES as readonly string[]).includes(
      candidate.type as string,
    )
      ? (candidate.type as FieldType)
      : "text";

    const options = Array.isArray(candidate.options)
      ? candidate.options.filter(isNonEmpty).map((option) => option.trim())
      : [];

    fields.push({
      key,
      label: candidate.label.trim(),
      // A select with no options can't be answered; treat it as a text field.
      type: type === "select" && options.length === 0 ? "text" : type,
      options,
      required: candidate.required === true,
      placeholder: isNonEmpty(candidate.placeholder)
        ? candidate.placeholder
        : "",
      width: candidate.width === "half" ? "half" : "full",
    });
  }

  return fields;
}

export function normaliseGroups(raw: unknown): FormGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const candidate = (item ?? {}) as { title?: unknown; fields?: unknown };
      return {
        title: isNonEmpty(candidate.title) ? candidate.title.trim() : "",
        fields: normaliseFields(candidate.fields),
      };
    })
    .filter((group) => group.fields.length > 0);
}

export const flattenGroups = (groups: FormGroup[]): FormField[] =>
  groups.flatMap((group) => group.fields);

/** Label lookup for the admin inbox, keyed by the stored field key. */
export const labelMap = (fields: FormField[]): Record<string, string> =>
  Object.fromEntries(fields.map((field) => [field.key, field.label]));
