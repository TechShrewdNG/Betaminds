"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { Field, Honeypot, SelectField, TextareaField } from "./Field";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { submitAcademyApplication } from "@/app/actions/forms";
import { emptyFormState, held } from "@/lib/form-state";
import type { ContentDefaults } from "@/lib/content/defaults";

type Apply = ContentDefaults["academy"]["apply"];

export function AcademyForm({
  apply,
  courses,
  formats,
}: {
  apply: Apply;
  courses: string[];
  formats: string[];
}) {
  const [state, action] = useActionState(
    submitAcademyApplication,
    emptyFormState,
  );
  // Course cards link here with ?course=<name>.
  const preselected = useSearchParams().get("course") ?? "";
  const course = courses.includes(preselected) ? preselected : "";

  if (state.status === "ok") {
    return <SuccessPanel heading={apply.successHeading} body={apply.successBody} />;
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <Honeypot />

      <div className={styles.pair}>
        <Field
          name="name"
          label="Your name"
          autoComplete="name"
          required
          error={state.errors.name}
          defaultValue={held(state, "name")}
        />
        <Field
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
          error={state.errors.email}
          defaultValue={held(state, "email")}
        />
        <Field
          name="phone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          error={state.errors.phone}
          defaultValue={held(state, "phone")}
        />
        <SelectField
          name="format"
          label="Preferred format"
          options={formats}
          error={state.errors.format}
          defaultValue={held(state, "format")}
        />
      </div>

      <SelectField
        name="course"
        label="Which course?"
        options={courses}
        defaultValue={held(state, "course", course)}
        required
        error={state.errors.course}
      />

      <TextareaField
        name="background"
        label="Tell us about your background"
        placeholder="Where you are now, and what you want to be doing."
        rows={4}
        error={state.errors.background}
        defaultValue={held(state, "background")}
      />

      <SubmitButton label={apply.submitLabel} pendingLabel="Submitting…" />
    </form>
  );
}
