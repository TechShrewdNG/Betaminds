import styles from "./ui.module.css";

export type LogoItem = { name: string; logo?: string };

/**
 * Infinite client-logo strip. The track is duplicated so the -50% translate
 * loops seamlessly; `prefers-reduced-motion` stops it (see globals.css).
 */
export function Marquee({ logos }: { logos: LogoItem[] }) {
  if (logos.length === 0) return null;
  const track = [...logos, ...logos];

  return (
    <div className={styles.marquee}>
      <div className={`${styles.marqueeTrack} bm-marquee-track`}>
        {track.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className={`${styles.logoSlot} ${logo.logo ? styles["logoSlot--filled"] : ""}`}
            aria-hidden={index >= logos.length ? "true" : undefined}
          >
            {logo.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.logo} alt={logo.name} loading="lazy" />
            ) : (
              logo.name
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
