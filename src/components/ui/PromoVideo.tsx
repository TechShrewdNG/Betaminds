"use client";

import { useState } from "react";
import styles from "./ui.module.css";

/**
 * A click-to-play promo video: poster image with a play button until the
 * visitor asks for it, then a real `<video controls>` with sound.
 *
 * Deliberately not autoplay-muted like the hero slider's background loops —
 * these are commercials, not ambient footage, so the point is the visitor
 * chooses to watch (and hear) one. That sidesteps autoplay-permission
 * inconsistencies across browsers too.
 */
export function PromoVideo({
  video,
  poster,
  posterAlt = "",
  label,
  heading,
  body,
  aspect = "16 / 9",
}: {
  video: string;
  poster?: string;
  posterAlt?: string;
  label?: string;
  heading?: string;
  body?: string;
  aspect?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!video) return null;

  return (
    <div className={styles.promo}>
      {label || heading || body ? (
        <div className={styles.promoCopy}>
          {label ? <div className="eyebrow eyebrow--tight mb-18">{label}</div> : null}
          {heading ? <h3 className={styles.promoHeading}>{heading}</h3> : null}
          {body ? <p className={styles.promoBody}>{body}</p> : null}
        </div>
      ) : null}

      <div className={styles.promoFrame} style={{ aspectRatio: aspect }}>
        {playing ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={styles.promoVideo}
            src={video}
            poster={poster || undefined}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <button
            type="button"
            className={styles.promoPoster}
            onClick={() => setPlaying(true)}
            aria-label={heading ? `Play: ${heading}` : "Play video"}
          >
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt={posterAlt}
                className={styles.promoPosterImg}
                loading="lazy"
              />
            ) : null}
            <span className={styles.promoPlay}>
              {/* A solid triangle, not one of Icon's uniform-stroke glyphs —
                  play buttons read as filled everywhere, and a thin outline
                  here would look like it's missing rather than deliberate. */}
              <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
                <path d="M1 1.5v15l14-7.5-14-7.5z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
