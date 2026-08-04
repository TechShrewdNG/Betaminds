"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";

export type Plan = {
  name: string;
  tag: string;
  short: string;
  includes: string[];
};

/**
 * Engagement plans. The featured plan (Growth by default) starts expanded and
 * carries the accent border and tint. Each card's CTA jumps down to the
 * questionnaire with `?plan=<name>`, which ConsultationForm reads to
 * pre-select the matching option in its own Plan field.
 */
export function PlanCards({
  plans,
  featuredIndex = 1,
  selectLabel = "Select Plan",
}: {
  plans: Plan[];
  featuredIndex?: number;
  selectLabel?: string;
}) {
  const [open, setOpen] = useState<number | null>(featuredIndex);

  return (
    <div className="grid col3" style={{ alignItems: "stretch" }}>
      {plans.map((plan, index) => {
        const isOpen = open === index;
        return (
          <div
            key={plan.name}
            className={styles.planCard}
            data-featured={index === featuredIndex ? "true" : "false"}
          >
            <div className={styles.planHead}>
              <div className={styles.planTag}>{plan.tag}</div>
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planShort}>{plan.short}</div>
            </div>

            <button
              type="button"
              className={styles.planToggle}
              aria-expanded={isOpen}
              aria-controls={`plan-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {isOpen ? "What's included" : "See what's included"}
              <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>

            <div
              id={`plan-${index}`}
              className={styles.planIncludes}
              hidden={!isOpen}
            >
              {plan.includes.map((item) => (
                <div key={item} className={styles.planInclude}>
                  <span className={styles.tickMark} aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className={styles.planCta}>
              <Link
                href={`/digital-ecosystem?plan=${encodeURIComponent(plan.name)}#book`}
                className="pill pill--accent pill--sm"
              >
                {selectLabel}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
