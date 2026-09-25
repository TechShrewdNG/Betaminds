import styles from "./ui.module.css";

/**
 * Renders CMS copy with `*marked phrases*` drawn as a gold marker sweep, and
 * `_underlined phrases_` given a tapering gold rule.
 *
 * The marking lives in the text itself so an editor controls emphasis without
 * a developer — the alternative was a separate "which words to highlight"
 * field, which drifts out of sync with the copy the moment either is edited.
 *
 * Unmatched or stray delimiters are left as literal characters rather than
 * swallowed: copy containing a genuine asterisk should survive untouched.
 */
const PATTERN = /(\*[^*\n]+\*|_[^_\n]+_)/g;

export function MarkedText({ children }: { children: string }) {
  const parts = children.split(PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className={styles.markSweep}>
              {part.slice(1, -1)}
            </span>
          );
        }
        if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) {
          return (
            <span key={i} className={styles.markRule}>
              {part.slice(1, -1)}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}
