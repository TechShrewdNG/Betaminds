"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { DynamicFields } from "./DynamicForm";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { submitBrief } from "@/app/actions/forms";
import { emptyFormState } from "@/lib/form-state";
import type { FormField } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Form = ContentDefaults["work"]["form"];

export function BriefForm({
  form,
  fields,
}: {
  form: Form;
  fields: FormField[];
}) {
  const [state, action] = useActionState(submitBrief, emptyFormState);
  // Media Services and the homepage tabs link here with ?need=<package>, so the
  // visitor doesn't have to retype what they just clicked.
  const need = useSearchParams().get("need") ?? "";

  if (state.status === "ok") {
    return (
      <SuccessPanel heading={form.successHeading} body={form.successBody} />
    );
  }

  // The deep-linked need rides in as an initial "held" value, the same channel
  // used to restore input after a validation failure — so once the visitor has
  // submitted once, their own answer wins over the query string.
  const seeded =
    need && state.status === "idle"
      ? { ...state, values: { need } }
      : state;

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <DynamicFields fields={fields} state={seeded} />
      <SubmitButton label={form.submitLabel} pendingLabel="Sending…" />
    </form>
  );
}
