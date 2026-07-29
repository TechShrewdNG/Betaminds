"use client";

import { useActionState } from "react";
import styles from "./form.module.css";
import { Field, Honeypot, SelectField, TextareaField } from "./Field";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { submitSummitInterest, submitNewsletter } from "@/app/actions/forms";
import { emptyFormState, held } from "@/lib/form-state";
import type { ContentDefaults } from "@/lib/content/defaults";

type Summit = ContentDefaults["summit"];

const INTERESTS = [
  "Attend",
  "Speak",
  "Sponsor or partner",
  "Volunteer",
  "Exhibit",
];

export function SummitInterestForm({
  interest,
}: {
  interest: Summit["interest"];
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
          name="organisation"
          label="Organisation"
          autoComplete="organization"
          error={state.errors.organisation}
          defaultValue={held(state, "organisation")}
        />
        <Field
          name="role"
          label="Role"
          autoComplete="organization-title"
          error={state.errors.role}
          defaultValue={held(state, "role")}
        />
      </div>

      <SelectField
        name="interest"
        label="How would you like to take part?"
        options={INTERESTS}
        required
        error={state.errors.interest}
        defaultValue={held(state, "interest")}
      />

      <TextareaField
        name="message"
        label="Anything else?"
        rows={3}
        error={state.errors.message}
        defaultValue={held(state, "message")}
      />

      <SubmitButton label={interest.submitLabel} pendingLabel="Registering…" />
    </form>
  );
}

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
        <SubmitNewsletter label={newsletter.ctaLabel} />
      </div>
    </form>
  );
}

function SubmitNewsletter({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="pill pill--accent pill--sm"
      style={{ padding: "13px 24px" }}
    >
      {label}
    </button>
  );
}
