import styles from "./ui.module.css";

/**
 * A scrolling band of brand statements, set at display scale on ink.
 *
 * Alternate lines are outlined rather than filled, so the strip has texture
 * instead of reading as one long shout. Two identical runs sit side by side and
 * the track translates exactly -50%, which is what makes the loop seamless —
 * the second run is `aria-hidden` so a screen reader hears the lines once.
 *
 * Deliberately used once per page at most. It is a punctuation mark; a second
 * one on the same page turns it into wallpaper.
 */
export function StatementBand({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;

  const run = (hidden: boolean) => (
    <div className={styles.stmtRun} aria-hidden={hidden ? "true" : undefined}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={styles.stmtItem}>
          <span
            className={styles.stmtWord}
            data-style={i % 2 === 0 ? "solid" : "hollow"}
          >
            {line}
          </span>
          <span className={styles.stmtDot} aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={`band--ink ${styles.stmtBand}`}>
      <div className={`${styles.stmtTrack} bm-marquee-track`}>
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
