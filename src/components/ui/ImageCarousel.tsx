"use client";

import { useEffect, useRef } from "react";
import styles from "./ui.module.css";

export type CarouselItem = { src: string; alt: string; href?: string };

/**
 * A self-advancing strip of full-bleed images, sized like a single cover
 * (see `.magCover` in ui.module.css) but cycling through several — the
 * Press section's answer to the Magazine's static cover-plus-button, for a
 * set of covers with no one "the" cover among them.
 *
 * Same `scrollLeft`-driven native-scroll mechanism as Marquee and
 * StatementBand (see Marquee's comment for why: a transform-animated
 * element is what once let a compositor layer escape `overflow: hidden`
 * and stretch the page on iOS). Each slide is full container width rather
 * than Marquee's narrow logo slots, so it reads as a slow-advancing
 * slideshow instead of a scrolling ticker.
 */
export function ImageCarousel({ items }: { items: CarouselItem[] }) {
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

    const speed = 26; // px/s — slow enough to read as a slideshow, not a blur.
    let last = performance.now();
    let raf = 0;
    // Tracked separately from `track.scrollLeft`, which the browser rounds
    // to a whole pixel on both read and write — at this speed the per-frame
    // delta is under half a pixel, so accumulating against the rounded
    // readback instead of this would round back down to the same integer
    // every frame and never move at all.
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
          const image = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.alt}
              loading={duplicate ? "lazy" : undefined}
            />
          );
          return item.href ? (
            <a
              key={`${item.src}-${index}`}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.pressCarouselSlide}
              aria-hidden={duplicate ? "true" : undefined}
              tabIndex={duplicate ? -1 : undefined}
            >
              {image}
            </a>
          ) : (
            <div
              key={`${item.src}-${index}`}
              className={styles.pressCarouselSlide}
              aria-hidden={duplicate ? "true" : undefined}
            >
              {image}
            </div>
          );
        })}
      </div>
    </div>
  );
}
