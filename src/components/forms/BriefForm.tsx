"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { Field, Honeypot, TextareaField } from "./Field";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { submitBrief } from "@/app/actions/forms";
import { emptyFormState, held } from "@/lib/form-state";
import type { ContentDefaults } from "@/lib/content/defaults";

type Form = ContentDefaults["work"]["form"];

export function BriefForm({ form }: { form: Form }) {
  const [state, action] = useActionState(submitBrief, emptyFormState);
  // Media Services and the homepage tabs link here with ?need=<package>, so the
  // visitor doesn't have to retype what they just clicked.
  const need = useSearchParams().get("need") ?? "";

  if (state.status === "ok") {
    return (
      <SuccessPanel heading={form.successHeading} body={form.successBody} />
    );
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <Honeypot />

      <Field
        name="name"
        label={form.labels.name}
        placeholder={form.hints.name}
        autoComplete="name"
        required
        error={state.errors.name}
        defaultValue={held(state, "name")}
      />
      <Field
        name="email"
        type="email"
        label={form.labels.email}
        placeholder={form.hints.email}
        autoComplete="email"
        required
        error={state.errors.email}
        defaultValue={held(state, "email")}
      />
      <Field
        name="company"
        label={form.labels.company}
        placeholder={form.hints.company}
        autoComplete="organization"
        error={state.errors.company}
        defaultValue={held(state, "company")}
      />
      <Field
        name="need"
        label={form.labels.need}
        placeholder={form.hints.need}
        defaultValue={held(state, "need", need)}
        error={state.errors.need}
      />
      <TextareaField
        name="project"
        label={form.labels.project}
        placeholder={form.hints.project}
        rows={5}
        required
        error={state.errors.project}
        defaultValue={held(state, "project")}
      />

      <SubmitButton label={form.submitLabel} pendingLabel="Sending…" />
    </form>
  );
}
