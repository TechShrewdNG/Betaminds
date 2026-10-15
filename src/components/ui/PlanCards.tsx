import Link from "next/link";
import styles from "./ui.module.css";
import { Icon } from "./Icon";

export type Plan = {
  name: string;
  tag: string;
  short: string;
  /** Optional. e.g. "3 months" — shown beside the tag when set. */
  duration?: string;
  /** Optional, collapsed by default — the full deliverables list. */
  items?: string[];
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
  deliverablesLabel = "What's included",
  columns = 3,
  ctaHref = (plan) =>
    `/digital-ecosystem?plan=${encodeURIComponent(plan.name)}#book`,
}: {
  plans: Plan[];
  featuredIndex?: number;
  selectLabel?: string;
  bestForLabel?: string;
  deliverablesLabel?: string;
  /** PR runs two of these side by side; the plans grid runs three. */
  columns?: 2 | 3;
  ctaHref?: (plan: Plan) => string;
}) {
  return (
    // Natural height, not stretched — a card's deliverables list is a
    // <details> a visitor opens one at a time, and stretching every card in
    // the row to match whichever one is open would yank the others taller
    // around it. The auto margin on whichever block follows the head (see
    // .planHead + … in ui.module.css) already closes the gap for a shorter
    // card without it.
    <div className={`grid col${columns}`} style={{ alignItems: "start" }}>
      {plans.map((plan, index) => {
        return (
          <div
            key={plan.name}
            className={styles.planCard}
            data-featured={index === featuredIndex ? "true" : "false"}
          >
            <div className={styles.planHead}>
              <div className={styles.planTag}>
                {plan.tag}
                {plan.duration ? (
                  <span className={styles.planDuration}> · {plan.duration}</span>
                ) : null}
              </div>
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planShort}>{plan.short}</div>
            </div>

            {plan.items && plan.items.length > 0 ? (
              <details className={styles.planDetails}>
                <summary className={styles.planDetailsSummary}>
                  <span>{deliverablesLabel}</span>
                  <Icon
                    name="arrow-right"
                    size={15}
                    className={styles.planDetailsChevron}
                  />
                </summary>
                <div className={styles.planDetailsBody}>
                  {plan.items.map((item) => (
                    <div key={item} className={styles.prDeliverable}>
                      <Icon name="check" size={16} className={styles.tickMark} />
                      {item}
                    </div>
                  ))}
                </div>
              </details>
            ) : null}

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
