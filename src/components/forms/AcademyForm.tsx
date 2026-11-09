"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { DynamicGroups } from "./DynamicForm";
import { submitAcademyApplication } from "@/app/actions/forms";
import { emptyFormState } from "@/lib/form-state";
import { flattenGroups, type FormGroup } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Apply = ContentDefaults["academy"]["apply"];

export function AcademyForm({
  apply,
  groups,
  presetCourse,
  courseScope = "schools",
}: {
  apply: Apply;
  groups: FormGroup[];
  /** Forces the course selection, bypassing the ?course= query param — used
   *  when the form is embedded in a course's own detail modal. */
  presetCourse?: string;
  /** Which course list `groups` was built from — carried to the server as a
   *  hidden field so re-validation on submit resolves the "course" field's
   *  options the same way the page did. Without this, submitting from the
   *  crash-course modal always failed: the server re-resolved the form with
   *  the default (school courses) scope, whose options never included the
   *  crash course the visitor actually picked. */
  courseScope?: "schools" | "crash";
}) {
  const [state, action] = useActionState(
    submitAcademyApplication,
    emptyFormState,
  );

  // Course cards link here with ?course=<name>. Only honour it if the value is
  // actually one of the offered options.
  const requested = useSearchParams().get("course") ?? "";
  const courseField = flattenGroups(groups).find(
    (field) => field.key === "course",
  );
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
      {courseScope === "crash" ? (
        <input type="hidden" name="_courseScope" value="crash" />
      ) : null}
      <DynamicGroups groups={groups} state={seeded} />
      <SubmitButton label={apply.submitLabel} pendingLabel="Submitting…" />
    </form>
  );
}
