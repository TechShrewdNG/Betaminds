"use client";

import { useActionState } from "react";
import styles from "./form.module.css";
import { Field, Honeypot, SelectField, TextareaField } from "./Field";
import { SubmitButton, FormNotice, SuccessPanel } from "./parts";
import { submitConsultation } from "@/app/actions/forms";
import { emptyFormState, held } from "@/lib/form-state";
import type { ContentDefaults } from "@/lib/content/defaults";

type Questionnaire = ContentDefaults["ecosystem"]["questionnaire"];

/**
 * The eight-part discovery questionnaire from structure.txt, in full and in
 * order. Starred fields there are the required ones here; the same list is
 * enforced server-side in lib/submissions.ts.
 */
export function ConsultationForm({
  questionnaire,
  planNames,
}: {
  questionnaire: Questionnaire;
  planNames: string[];
}) {
  const [state, action] = useActionState(submitConsultation, emptyFormState);
  const e = state.errors;

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
      <Honeypot />

      <Group n={1} title="Contact & brand">
        <div className={styles.pair}>
          <Field
            name="email"
            type="email"
            label="Email"
            placeholder="you@brand.com"
            autoComplete="email"
            required
            error={e.email}
            defaultValue={held(state, "email")}
          />
          <Field
            name="brandName"
            label="Brand name"
            autoComplete="organization"
            required
            error={e.brandName}
            defaultValue={held(state, "brandName")}
          />
          <Field
            name="phone"
            type="tel"
            label="Phone"
            autoComplete="tel"
            required
            error={e.phone}
            defaultValue={held(state, "phone")}
          />
          <Field
            name="website"
            label="Website / social media"
            placeholder="brand.com or @brand"
            required
            error={e.website}
            defaultValue={held(state, "website")}
          />
        </div>
      </Group>

      <Group n={2} title="Where is your brand based?">
        <div className={styles.pair}>
          <Field
            name="address1"
            label="Address line 1"
            autoComplete="address-line1"
            error={e.address1}
            defaultValue={held(state, "address1")}
          />
          <Field
            name="city"
            label="City"
            autoComplete="address-level2"
            error={e.city}
            defaultValue={held(state, "city")}
          />
          <Field
            name="region"
            label="State / province / region"
            autoComplete="address-level1"
            error={e.region}
            defaultValue={held(state, "region")}
          />
          <Field
            name="country"
            label="Country"
            autoComplete="country-name"
            required
            error={e.country}
            defaultValue={held(state, "country")}
          />
        </div>
      </Group>

      <Group n={3} title="About your business">
        <div className={styles.pair}>
          <SelectField
            name="sells"
            label="What does your brand sell?"
            options={["Products", "Services", "Both"]}
            error={e.sells}
            defaultValue={held(state, "sells")}
          />
          <Field
            name="industry"
            label="Industry / category"
            error={e.industry}
            defaultValue={held(state, "industry")}
          />
          <Field
            name="yearsTrading"
            label="How long have you been in business?"
            placeholder="e.g. 3 years"
            required
            error={e.yearsTrading}
            defaultValue={held(state, "yearsTrading")}
          />
          <SelectField
            name="channel"
            label="Do you sell online, offline, or both?"
            options={["Online", "Offline", "Both"]}
            error={e.channel}
            defaultValue={held(state, "channel")}
          />
          <SelectField
            name="reach"
            label="Do you sell locally, nationally, or across borders?"
            options={["Locally", "Nationally", "Across borders"]}
            error={e.reach}
            defaultValue={held(state, "reach")}
          />
        </div>
      </Group>

      <Group n={4} title="Current digital presence">
        <TextareaField
          name="marketplaces"
          label="Marketplaces you currently sell through"
          placeholder="Jumia, Instagram Shop, WhatsApp Business…"
          rows={2}
          error={e.marketplaces}
          defaultValue={held(state, "marketplaces")}
        />
        <TextareaField
          name="paidAds"
          label="Do you currently run paid ads anywhere?"
          rows={2}
          error={e.paidAds}
          defaultValue={held(state, "paidAds")}
        />
        <TextareaField
          name="brandAssets"
          label="Existing brand assets"
          placeholder="Logo, guidelines, product photos…"
          rows={2}
          error={e.brandAssets}
          defaultValue={held(state, "brandAssets")}
        />
      </Group>

      <Group n={5} title="Team & decision-making">
        <TextareaField
          name="teamStructure"
          label="What is your team's structure?"
          rows={2}
          required
          error={e.teamStructure}
          defaultValue={held(state, "teamStructure")}
        />
        <SelectField
          name="internalOrOutsource"
          label="Internal team we'd work alongside, or fully outsourcing?"
          options={[
            "We have an internal team",
            "Fully outsourcing to you",
            "A mix of both",
          ]}
          error={e.internalOrOutsource}
          defaultValue={held(state, "internalOrOutsource")}
        />
        <div className={styles.pair}>
          <Field
            name="whoElseDecides"
            label="Who else is involved in this decision?"
            placeholder="Just me / a co-founder / a team"
            error={e.whoElseDecides}
            defaultValue={held(state, "whoElseDecides")}
          />
          <SelectField
            name="budgetAuthority"
            label="Are you the sole decision-maker for budget approval?"
            options={["Yes", "No", "Shared"]}
            error={e.budgetAuthority}
            defaultValue={held(state, "budgetAuthority")}
          />
        </div>
      </Group>

      <Group n={6} title="Why now?">
        <TextareaField
          name="whyNow"
          label="What's prompting you to reach out now?"
          placeholder="A launch, a rebrand, stalled sales…"
          rows={3}
          required
          error={e.whyNow}
          defaultValue={held(state, "whyNow")}
        />
      </Group>

      <Group n={7} title="Engagement details">
        <SelectField
          name="plan"
          label="What partnership plan are you interested in?"
          options={[...planNames, "Not sure yet. Recommend one."]}
          required
          error={e.plan}
          defaultValue={held(state, "plan")}
        />
        <div className={styles.pair}>
          <Field
            name="startDate"
            type="date"
            label="Ideal services start date"
            required
            error={e.startDate}
            defaultValue={held(state, "startDate")}
          />
          <Field
            name="budget"
            label="What is your budget?"
            placeholder="Range is fine"
            required
            error={e.budget}
            defaultValue={held(state, "budget")}
          />
        </div>
      </Group>

      <Group n={8} title="Just one more">
        <Field
          name="howHeard"
          label="How did you hear about us?"
          error={e.howHeard}
          defaultValue={held(state, "howHeard")}
        />
      </Group>

      <SubmitButton label={questionnaire.submitLabel} pendingLabel="Submitting…" />
    </form>
  );
}

function Group({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={styles.group} style={{ margin: 0 }}>
      <legend className={styles.groupHead} style={{ padding: 0 }}>
        <span className={styles.groupNumber} aria-hidden="true">
          {n}
        </span>
        <span className={styles.groupTitle}>{title}</span>
      </legend>
      <div className={styles.form}>{children}</div>
    </fieldset>
  );
}
