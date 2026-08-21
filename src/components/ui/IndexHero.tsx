import type { ReactNode } from "react";
import styles from "./ui.module.css";

/**
 * The opening band for an index page — Projects, Blog, Media Services.
 *
 * These three pages all opened the same way and just as emptily: eyebrow,
 * heading, a two-line lead, and then nothing. Measured at 1440px the Projects
 * and Blog heroes were 388px tall with the entire right half blank, which made
 * three of the site's eight pages introduce themselves with a void.
 *
 * Two things fix that, both from content the page already has. A photograph
 * behind the copy, using the same wash the case studies and Media Services
 * already use, so the index pages stop being the odd ones out. And a rail down
 * the right — counts, dates, a contents list — which is what the empty half was
 * always missing: something to actually read.
 */
export function IndexHero({
  image,
  imageAlt = "",
  eyebrow,
  heading,
  accentTail,
  lead,
  rail,
}: {
  image?: string;
  imageAlt?: string;
  eyebrow: string;
  heading: string;
  accentTail?: string;
  lead: string;
  rail?: ReactNode;
}) {
  return (
    <section className="hero">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={imageAlt} className="hero__img" fetchPriority="high" />
      ) : null}
      <div className="hero__wash" />
      <div className="shell hero__body">
        <div className={styles.idxGrid}>
          <div className="bm-rise">
            <div className="eyebrow mb-22">{eyebrow}</div>
            <h1 className="h1" style={{ marginBottom: 20 }}>
              {heading}
              {accentTail ? (
                <span className="accent-word">{accentTail}</span>
              ) : null}
            </h1>
            <p className="lead measure-620">{lead}</p>
          </div>
          {rail ? <div className={styles.idxRail}>{rail}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** Figures down the rail — a count, a span of years, a date. */
export function IndexFacts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className={styles.idxGroup}>
      {items.map((item) => (
        <div key={item.label} className={styles.idxFact}>
          {/* A count sets at display scale; a date or a phrase would overrun
              the rail there, so anything longer than a figure steps down. */}
          <div
            className={styles.idxFactValue}
            data-long={item.value.length > 4 ? "true" : undefined}
          >
            {item.value}
          </div>
          <div className={styles.idxFactLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * A labelled set of tags — the industries an archive covers, say.
 *
 * Counts are the obvious thing to put in a rail and the wrong thing here: with
 * one industry and one service per project, "case studies", "industries" and
 * "services" all rendered the same figure, so the rail read as three copies of
 * one number. Naming the sectors says more and cannot collapse.
 */
export function IndexTags({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.idxGroup}>
      <div className={styles.idxRailLabel}>{label}</div>
      <div className={styles.idxTags}>
        {items.map((item) => (
          <span key={item} className={styles.idxTag}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A contents list down the rail, for a page that is one long list. */
export function IndexContents({
  label,
  items,
}: {
  label: string;
  items: { href: string; text: string }[];
}) {
  return (
    // Desktop only. The rail exists to fill the hero's empty right column;
    // stacked on a phone there is no empty column, and the index turns into a
    // seven-item list you scroll past to reach the seven-item list itself.
    <div className={styles.idxContents}>
      <div className={styles.idxRailLabel}>{label}</div>
      <ol className={styles.idxList}>
        {items.map((item, index) => (
          <li key={item.href}>
            <a href={item.href} className={styles.idxLink}>
              <span className={styles.idxLinkNum} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
