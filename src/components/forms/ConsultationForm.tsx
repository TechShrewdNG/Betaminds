"use client";

import { useActionState } from "react";
import styles from "./form.module.css";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { DynamicGroups } from "./DynamicForm";
import { submitConsultation } from "@/app/actions/forms";
import { emptyFormState } from "@/lib/form-state";
import type { FormGroup } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Questionnaire = ContentDefaults["ecosystem"]["questionnaire"];

/**
 * The discovery questionnaire. Its fields, labels, types and options all come
 * from the CMS (Digital Ecosystem → Discovery questionnaire), resolved
 * server-side and validated against the same definitions.
 */
export function ConsultationForm({
  questionnaire,
  groups,
}: {
  questionnaire: Questionnaire;
  groups: FormGroup[];
}) {
  const [state, action] = useActionState(submitConsultation, emptyFormState);

  if (state.status === "ok") {
    return (
      <SuccessPanel
        heading={questionnaire.successHeading}
        body={questionnaire.successBody}
      >
        {questionnaire.schedulingUrl ? (
          <a
            href={questionnaire.schedulingUrl}
            className="pill pill--accent"
            target="_blank"
            rel="noreferrer"
          >
            Pick a time on our calendar →
          </a>
        ) : null}
      </SuccessPanel>
    );
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <DynamicGroups groups={groups} state={state} />
      <SubmitButton
        label={questionnaire.submitLabel}
        pendingLabel="Submitting…"
      />
    </form>
  );
}
