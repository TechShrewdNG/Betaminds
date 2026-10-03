"use client";

import { useEffect, useRef } from "react";
import styles from "./ui.module.css";

/**
 * A scrolling band of brand statements, set at display scale on ink.
 *
 * Driven by `scrollLeft` on a real `overflow-x: auto` track, the same
 * mechanism as the client-logo Marquee — see that component's comment for
 * why: a wide, continuously-`transform`-animated element is what once let a
 * compositor-promoted layer escape `overflow: hidden` and stretch the
 * document on iOS, and native scrolling was never part of that bug class.
 * This used to stay wrapped-and-still under 640px instead, as the one
 * element still using the transform-animation approach on a phone; moving it
 * to the same scroll-driven mechanism the marquee uses means it can just
 * keep sliding at every width like everything else on the page does.
 *
 * Alternate lines are outlined rather than filled, so the strip has texture
 * instead of reading as one long shout. Two identical runs sit side by side
 * and the track scrolls exactly to the first run's width before jumping
 * back to 0, which is what makes the loop seamless — the second run is
 * `aria-hidden` so a screen reader hears the lines once.
 *
 * Deliberately used once per page at most. It is a punctuation mark; a second
 * one on the same page turns it into wallpaper.
 */
export function StatementBand({ lines }: { lines: string[] }) {
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

    const speed = 40; // px/s
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
    <section
      className={`band--ink ${styles.stmtBand}`}
      ref={trackRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
    >
      <div className={`${styles.stmtTrack} bm-marquee-track`}>
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
