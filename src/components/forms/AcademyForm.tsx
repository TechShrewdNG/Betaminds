"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { DynamicFields } from "./DynamicForm";
import { submitAcademyApplication } from "@/app/actions/forms";
import { emptyFormState } from "@/lib/form-state";
import type { FormField } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Apply = ContentDefaults["academy"]["apply"];

export function AcademyForm({
  apply,
  fields,
  presetCourse,
}: {
  apply: Apply;
  fields: FormField[];
  /** Forces the course selection, bypassing the ?course= query param — used
   *  when the form is embedded in a course's own detail modal. */
  presetCourse?: string;
}) {
  const [state, action] = useActionState(
    submitAcademyApplication,
    emptyFormState,
  );

  // Course cards link here with ?course=<name>. Only honour it if the value is
  // actually one of the offered options.
  const requested = useSearchParams().get("course") ?? "";
  const courseField = fields.find((field) => field.key === "course");
  const queryPreselect = courseField?.options.includes(requested)
    ? requested
    : "";
  const preselect = presetCourse ?? queryPreselect;

  if (state.status === "ok") {
    return (
      <SuccessPanel heading={apply.successHeading} body={apply.successBody} />
    );
  }

  // The deep-linked course rides in as an initial "held" value, which is the
  // same channel used to restore input after a validation failure — so once the
  // visitor has submitted once, their own choice wins over the query string.
  const seeded =
    preselect && state.status === "idle"
      ? { ...state, values: { course: preselect } }
      : state;

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <DynamicFields fields={fields} state={seeded} />
      <SubmitButton label={apply.submitLabel} pendingLabel="Submitting…" />
    </form>
  );
}
