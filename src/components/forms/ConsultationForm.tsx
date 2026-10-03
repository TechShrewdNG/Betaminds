"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./form.module.css";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { DynamicGroups } from "./DynamicForm";
import { submitConsultation } from "@/app/actions/forms";
import { emptyFormState } from "@/lib/form-state";
import { flattenGroups, type FormGroup } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Questionnaire = ContentDefaults["ecosystem"]["questionnaire"];

/**
 * The discovery questionnaire. Its fields, labels, types and options all come
 * from the CMS (Digital Marketplace → Discovery questionnaire), resolved
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

  // Plan cards link here with ?plan=<name>. Only honour it if the value is
  // actually one of the offered options.
  const requested = useSearchParams().get("plan") ?? "";
  const planField = flattenGroups(groups).find((field) => field.key === "plan");
  const preselect = planField?.options.includes(requested) ? requested : "";

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

  // The deep-linked plan rides in as an initial "held" value, which is the
  // same channel used to restore input after a validation failure — so once
  // the visitor has submitted once, their own choice wins over the query
  // string.
  const seeded =
    preselect && state.status === "idle"
      ? { ...state, values: { plan: preselect } }
      : state;

  return (
    // Keyed on the deep-linked plan: clicking a different "Select Plan" card
    // is a same-route navigation, which re-renders this form in place rather
    // than remounting it — without a key change, the <select>'s uncontrolled
    // defaultValue would only ever apply once, on first mount.
    <form key={preselect} action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <DynamicGroups groups={groups} state={seeded} />
      <SubmitButton
        label={questionnaire.submitLabel}
        pendingLabel="Submitting…"
      />
    </form>
  );
}
