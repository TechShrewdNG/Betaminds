"use client";

import { useEffect, useRef } from "react";
import styles from "./ui.module.css";

export type CarouselItem = { src: string; alt: string; href?: string };

/**
 * A self-advancing strip of cover photos — several tiles wide, continuously
 * scrolling, each one a link straight out to the story it's the cover of.
 * The Press section's whole content: no caption, no separate text row, just
 * the image and a "read more" badge riding on top of it.
 *
 * Same `scrollLeft`-driven native-scroll mechanism as Marquee and
 * StatementBand (see Marquee's comment for why: a transform-animated
 * element is what once let a compositor layer escape `overflow: hidden`
 * and stretch the page on iOS).
 */
export function ImageCarousel({
  items,
  readLabel,
}: {
  items: CarouselItem[];
  readLabel?: string;
}) {
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
    if (!track || items.length < 2) return;

    const speed = 34; // px/s — matches Marquee's pace for a strip this size.
    let last = performance.now();
    let raf = 0;
    // Tracked separately from `track.scrollLeft`, which the browser rounds
    // to a whole pixel on both read and write — accumulating against the
    // rounded readback can round back down to the same integer every frame
    // and never move, depending on speed and refresh rate.
    let position = track.scrollLeft;

    function step(now: number) {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (track && !pausedRef.current && !reducedRef.current) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          position += speed * dt;
          if (position >= half) position -= half;
          track.scrollLeft = position;
        }
      }
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  if (items.length === 0) return null;

  // A single image just sits still — nothing to cycle to, and duplicating
  // it would only add a seam to scroll through.
  const run = items.length > 1 ? [...items, ...items] : items;

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className={styles.pressCarousel}
      ref={trackRef}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className={`${styles.pressCarouselTrack} bm-marquee-track`}>
        {run.map((item, index) => {
          const duplicate = index >= items.length;
          return (
            <a
              key={`${item.src}-${index}`}
              href={item.href || undefined}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.pressCarouselSlide}
              aria-hidden={duplicate ? "true" : undefined}
              tabIndex={duplicate ? -1 : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading={duplicate ? "lazy" : undefined} />
              <span className={styles.pressCarouselWash} aria-hidden="true" />
              {readLabel ? (
                <span className={styles.pressCarouselBadge}>
                  {readLabel} <span aria-hidden="true">→</span>
                </span>
              ) : null}
            </a>
          );
        })}
      </div>
    </div>
  );
}
