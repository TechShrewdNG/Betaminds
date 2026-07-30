"use client";

import { useActionState } from "react";
import styles from "./form.module.css";
import { Honeypot } from "./Field";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { DynamicFields } from "./DynamicForm";
import { submitSummitInterest, submitNewsletter } from "@/app/actions/forms";
import { emptyFormState, held } from "@/lib/form-state";
import type { FormField } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

type Summit = ContentDefaults["summit"];

export function SummitInterestForm({
  interest,
  fields,
}: {
  interest: Summit["interest"];
  fields: FormField[];
}) {
  const [state, action] = useActionState(submitSummitInterest, emptyFormState);

  if (state.status === "ok") {
    return (
      <SuccessPanel
        heading={interest.successHeading}
        body={interest.successBody}
      />
    );
  }

  return (
    <form action={action} className={styles.form} noValidate>
      <FormNotice message={state.message} />
      <DynamicFields fields={fields} state={state} />
      <SubmitButton label={interest.submitLabel} pendingLabel="Registering…" />
    </form>
  );
}

/**
 * Newsletter signup. Stays a hand-written single field rather than going through
 * the dynamic renderer: it's one input inline with its button, and there is
 * nothing about it an editor would want to restructure.
 */
export function NewsletterForm({
  newsletter,
}: {
  newsletter: Summit["newsletter"];
}) {
  const [state, action] = useActionState(submitNewsletter, emptyFormState);

  if (state.status === "ok") {
    return (
      <p
        role="status"
        style={{
          fontSize: 14.5,
          lineHeight: 1.6,
          color: "var(--accent)",
          margin: 0,
        }}
      >
        {newsletter.successMessage}
      </p>
    );
  }

  return (
    <form action={action} noValidate>
      <Honeypot />
      <div className={styles.inline}>
        <div className={styles.field} style={{ flex: 1, minWidth: 150 }}>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            className={styles.input}
            placeholder={newsletter.placeholder}
            autoComplete="email"
            required
            defaultValue={held(state, "email")}
            aria-invalid={state.errors.email ? "true" : undefined}
          />
          {state.errors.email ? (
            <span className={styles.error} role="alert">
              {state.errors.email}
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          className="pill pill--accent pill--sm"
          style={{ padding: "13px 24px" }}
        >
          {newsletter.ctaLabel}
        </button>
      </div>
    </form>
  );
}
