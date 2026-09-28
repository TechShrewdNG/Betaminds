import styles from "./ui.module.css";

export type LogoItem = { name: string; logo?: string; href?: string };

/**
 * Infinite client-logo strip. The track is duplicated so the -50% translate
 * loops seamlessly; `prefers-reduced-motion` stops it (see globals.css).
 *
 * A logo with an `href` becomes a link (the summit page's participant strip
 * uses this; the homepage's "Trusted by" strip doesn't set one, so those stay
 * plain). The duplicate half of the track is `aria-hidden`, but `aria-hidden`
 * alone doesn't pull an element out of tab order — only `tabIndex={-1}` does —
 * so a hidden duplicate here also gets that, or a keyboard visitor would tab
 * through invisible copies of every link.
 */
export function Marquee({ logos }: { logos: LogoItem[] }) {
  if (logos.length === 0) return null;
  const track = [...logos, ...logos];

  return (
    <div className={styles.marquee}>
      <div className={`${styles.marqueeTrack} bm-marquee-track`}>
        {track.map((logo, index) => {
          const duplicate = index >= logos.length;
          const className = `${styles.logoSlot} ${logo.logo ? styles["logoSlot--filled"] : ""}`;
          const content = logo.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.logo} alt={logo.name} loading="lazy" />
          ) : (
            logo.name
          );

          return logo.href ? (
            <a
              key={`${logo.name}-${index}`}
              href={logo.href}
              target="_blank"
              rel="noreferrer noopener"
              className={className}
              aria-hidden={duplicate ? "true" : undefined}
              tabIndex={duplicate ? -1 : undefined}
            >
              {content}
            </a>
          ) : (
            <div
              key={`${logo.name}-${index}`}
              className={className}
              aria-hidden={duplicate ? "true" : undefined}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
