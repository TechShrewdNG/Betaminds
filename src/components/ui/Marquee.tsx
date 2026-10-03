"use client";

import { useEffect, useRef } from "react";
import styles from "./ui.module.css";

export type LogoItem = { name: string; logo?: string; href?: string };

/**
 * Infinite client-logo strip.
 *
 * Driven by `scrollLeft` on a real `overflow-x: auto` track, not a CSS
 * `transform` animation — a wide, continuously-transformed element is exactly
 * the shape that let WebKit paint straight through `overflow: hidden`,
 * `position: relative` and `contain: paint` alike and stretch the document on
 * iOS (see the comment on `.marquee` in ui.module.css for the full history).
 * Native scrolling doesn't promote a compositor layer the same way, so it
 * sidesteps that bug class entirely instead of fighting it, and it means a
 * visitor can drag the strip themselves on a touch screen.
 *
 * The track is duplicated so scrolling past the first half can jump back to
 * 0 unnoticed, which is what makes the loop seamless. `prefers-reduced-motion`
 * stops the auto-advance; hovering or touching the strip pauses it so a
 * visitor can actually read a name they spotted.
 *
 * A logo with an `href` becomes a link (the summit page's participant strip
 * uses this; the homepage's "Trusted by" strip doesn't set one, so those stay
 * plain). The duplicate half of the track is `aria-hidden`, but `aria-hidden`
 * alone doesn't pull an element out of tab order — only `tabIndex={-1}` does —
 * so a hidden duplicate here also gets that, or a keyboard visitor would tab
 * through invisible copies of every link.
 */
export function Marquee({ logos }: { logos: LogoItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = query.matches;
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 34; // px/s — a constant pace reads evenly regardless of how many logos a page has.
    let last = performance.now();
    let raf = 0;

    function step(now: number) {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (track && !pausedRef.current && !reducedRef.current) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          let next = track.scrollLeft + speed * dt;
          if (next >= half) next -= half;
          track.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (logos.length === 0) return null;
  const track = [...logos, ...logos];

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className={styles.marquee}
      ref={trackRef}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className={`${styles.marqueeTrack} bm-marquee-track`}>
        {track.map((logo, index) => {
          const duplicate = index >= logos.length;
          const className = `${styles.logoSlot} ${logo.logo ? styles["logoSlot--filled"] : ""}`;
          const content = logo.logo ? (
            // Not lazy — this sits inside the marquee's own horizontal
            // scroller, where native lazy-loading's on-screen heuristic
            // isn't built around a nested horizontal scroll container. See
            // the matching comment on the team grid in home/page.tsx.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.logo} alt={logo.name} />
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
