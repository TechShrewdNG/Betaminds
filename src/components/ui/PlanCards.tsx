import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

export type Plan = {
  name: string;
  tag: string;
  short: string;
  includes: string[];
};

/**
 * Engagement plans. Every plan lists what it includes up front rather than
 * behind a toggle: the lists are what a visitor is comparing, so hiding them
 * made the three cards look identical and forced a click per plan just to see
 * the difference. The featured plan (Growth by default) still carries the
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
}: {
  plans: Plan[];
  featuredIndex?: number;
  selectLabel?: string;
}) {
  return (
    <div className="grid col3" style={{ alignItems: "stretch" }}>
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

            <div className={styles.planIncludesLabel}>What's included</div>

            <div className={styles.planIncludes}>
              {plan.includes.map((item) => (
                <div key={item} className={styles.planInclude}>
                  <Icon name="check" size={16} className={styles.tickMark} />
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
