import Link from "next/link";
import styles from "./ui.module.css";

export type Plan = {
  name: string;
  tag: string;
  short: string;
  /** Optional closing line — who the package suits. */
  bestFor?: string;
};

/**
 * Engagement plans. The featured plan (Growth by default) still carries the
 * accent border and tint. Each card's CTA jumps to the questionnaire with
 * `?plan=<name>`, which ConsultationForm reads to pre-select the matching
 * option in its own Plan field.
 *
 * No longer a client component — with the accordion gone there is no state.
 */
export function PlanCards({
  plans,
  featuredIndex = 1,
  selectLabel = "Select Plan",
  bestForLabel = "Best for",
  columns = 3,
  ctaHref = (plan) =>
    `/digital-ecosystem?plan=${encodeURIComponent(plan.name)}#book`,
}: {
  plans: Plan[];
  featuredIndex?: number;
  selectLabel?: string;
  bestForLabel?: string;
  /** PR runs two of these side by side; the plans grid runs three. */
  columns?: 2 | 3;
  ctaHref?: (plan: Plan) => string;
}) {
  return (
    // Stretched cards need every card to fill its height, which whichever
    // block follows the head does with margin-top: auto (see .planHead + …
    // in ui.module.css). Where the cards differ a lot — the PR pair, one with
    // a "best for" line and one without — that auto margin opens a void
    // inside the shorter card instead, so those sit at natural height.
    <div
      className={`grid col${columns}`}
      style={{ alignItems: columns === 2 ? "start" : "stretch" }}
    >
      {plans.map((plan, index) => {
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

            {plan.bestFor ? (
              <div className={styles.planBestFor}>
                <span className={styles.planBestForLabel}>{bestForLabel}</span>
                {plan.bestFor}
              </div>
            ) : null}

            <div className={styles.planCta}>
              <Link href={ctaHref(plan)} className="pill pill--accent pill--sm">
                {selectLabel}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
