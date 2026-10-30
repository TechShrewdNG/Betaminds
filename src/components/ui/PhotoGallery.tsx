"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ui.module.css";
import { Icon } from "./Icon";

export type GalleryItem = { src: string; alt: string };

/**
 * A self-advancing strip of event photos — portrait tiles rather than a
 * fixed-size grid, so it reads as real photography and keeps working as a
 * batch grows instead of leaving an awkward half-empty row. Click any tile
 * to open it full-size in a lightbox, with the same scroll-lock and
 * Escape-to-close pattern as the course detail dialog (SchoolTabs).
 *
 * Auto-scroll uses the same `scrollLeft`-driven native-scroll mechanism as
 * Marquee and ImageCarousel — see Marquee's comment for why a CSS
 * `transform` animation isn't used instead.
 */
export function PhotoGallery({ items }: { items: GalleryItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The lightbox is portalled to <body>, which needs a client mount first.
  useEffect(() => setMounted(true), []);

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

    const speed = 30; // px/s — a touch slower than the press strip; these tiles are bigger.
    let last = performance.now();
    let raf = 0;
    // Tracked separately from `track.scrollLeft`, which the browser rounds
    // to a whole pixel on both read and write — see ImageCarousel's comment.
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

  // While the lightbox is open: Escape and the arrow keys, and freeze the
  // page behind it (fixing the body is what actually stops iOS Safari from
  // scrolling the page behind a fixed overlay).
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") {
        setOpenIndex((index) => (index === null ? index : (index + 1) % items.length));
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((index) =>
          index === null ? index : (index - 1 + items.length) % items.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflowY = "scroll";

    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflowY = prev.overflowY;
      window.scrollTo(0, scrollY);
    };
  }, [openIndex, items.length]);

  if (items.length === 0) return null;

  const run = items.length > 1 ? [...items, ...items] : items;
  const open = openIndex !== null ? items[openIndex] : null;

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };
  const prev = () =>
    setOpenIndex((index) => (index === null ? index : (index - 1 + items.length) % items.length));
  const next = () =>
    setOpenIndex((index) => (index === null ? index : (index + 1) % items.length));

  return (
    <>
      <div
        className={styles.gallery}
        ref={trackRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <div className={`${styles.galleryTrack} bm-marquee-track`}>
          {run.map((item, index) => {
            const duplicate = index >= items.length;
            return (
              <button
                key={`${item.src}-${index}`}
                type="button"
                className={styles.galleryTile}
                aria-hidden={duplicate ? "true" : undefined}
                tabIndex={duplicate ? -1 : undefined}
                onClick={() => setOpenIndex(index % items.length)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} loading={duplicate ? "lazy" : undefined} />
              </button>
            );
          })}
        </div>
      </div>

      {mounted && open
        ? createPortal(
            <div
              className={styles.modalBack}
              role="dialog"
              aria-modal="true"
              aria-label={open.alt}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpenIndex(null);
              }}
            >
              <div className={styles.lightbox}>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.modalClose}
                  aria-label="Close"
                  onClick={() => setOpenIndex(null)}
                >
                  <Icon name="close" size={17} />
                </button>

                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                      aria-label="Previous photo"
                      onClick={prev}
                    >
                      <Icon name="arrow-right" size={20} className={styles.lightboxPrevIcon} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                      aria-label="Next photo"
                      onClick={next}
                    >
                      <Icon name="arrow-right" size={20} />
                    </button>
                  </>
                ) : null}

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={open.src} alt={open.alt} className={styles.lightboxImg} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
