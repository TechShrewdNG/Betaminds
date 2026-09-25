"use client";

import styles from "./form.module.css";
import { Field, Honeypot, SelectField, TextareaField } from "./Field";
import type { FormField, FormGroup } from "@/lib/forms/definition";
import { autocompleteFor } from "@/lib/forms/autocomplete";
import { held, type FormState } from "@/lib/form-state";

/**
 * Renders a form from CMS-defined field definitions.
 *
 * One renderer for the discovery questionnaire, the Academy application and the
 * Summit interest form, so a new field added in the admin appears on the site
 * without a code change.
 */

function FieldControl({
  field,
  state,
}: {
  field: FormField;
  state: FormState;
}) {
  const shared = {
    name: field.key,
    label: field.label,
    required: field.required,
    error: state.errors[field.key],
    placeholder: field.placeholder || undefined,
    defaultValue: held(state, field.key),
    autoComplete: autocompleteFor(field),
  };

  if (field.type === "textarea") {
    return <TextareaField {...shared} rows={3} />;
  }

  if (field.type === "select") {
    const options = field.options;
    // A select with nothing to choose from is worse than a text box.
    if (options.length === 0) return <Field {...shared} type="text" />;
    return <SelectField {...shared} options={options} />;
  }

  return <Field {...shared} type={field.type} />;
}

/**
 * Lays fields out in rows, pairing consecutive half-width fields so they sit
 * side by side. A lone half-width field just spans the row.
 */
function FieldRows({
  fields,
  state,
}: {
  fields: FormField[];
  state: FormState;
}) {
  const rows: FormField[][] = [];

  for (const field of fields) {
    const previous = rows[rows.length - 1];
    const canPair =
      field.width === "half" &&
      previous?.length === 1 &&
      previous[0].width === "half";

    if (canPair) previous.push(field);
    else rows.push([field]);
  }

  return (
    <>
      {rows.map((row, index) =>
        row.length === 2 ? (
          <div className={styles.pair} key={`${row[0].key}-${index}`}>
            {row.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                state={state}
              />
            ))}
          </div>
        ) : (
          <FieldControl
            key={row[0].key}
            field={row[0]}
            state={state}
          />
        ),
      )}
    </>
  );
}

/** A flat list of fields — used by the Academy and Summit forms. */
export function DynamicFields({
  fields,
  state,
}: {
  fields: FormField[];
  state: FormState;
}) {
  return (
    <>
      <Honeypot />
      <FieldRows fields={fields} state={state} />
    </>
  );
}

/** Numbered groups — used by the eight-part discovery questionnaire. */
export function DynamicGroups({
  groups,
  state,
}: {
  groups: FormGroup[];
  state: FormState;
}) {
  return (
    <>
      <Honeypot />
      {groups.map((group, index) => (
        <fieldset
          key={group.title || index}
          className={styles.group}
          style={{ margin: 0 }}
        >
          <legend className={styles.groupHead} style={{ padding: 0 }}>
            <span className={styles.groupNumber} aria-hidden="true">
              {index + 1}
            </span>
            <span className={styles.groupTitle}>{group.title}</span>
          </legend>
          <div className={styles.form}>
            <FieldRows
              fields={group.fields}
              state={state}
            />
          </div>
        </fieldset>
      ))}
    </>
  );
}
