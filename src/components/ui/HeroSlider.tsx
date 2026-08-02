"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { isVideoUrl } from "@/lib/media";
import styles from "./ui.module.css";

export type HeroSlide = {
  eyebrow: string;
  heading: string;
  body: string;
  video: string;
  image: string;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The full-screen opening slider.
 *
 * Each slide is a background video (or a still, when there's no video) under a
 * wash, with the copy and buttons over it. Only the active slide's video is
 * mounted: a homepage that downloads four videos at once isn't worth the
 * polish, and a background loop restarting when you return to its slide costs
 * nothing.
 *
 * Motion is opt-out in both directions — `prefers-reduced-motion` stops the
 * autoplay timer *and* the video, since a looping background is exactly the
 * kind of movement that setting is asking us to stop.
 */
export function HeroSlider({
  slides,
  autoplay,
  interval,
  /** 0-100. How strongly the wash tints the picture or video behind the copy. */
  overlay = 50,
  /**
   * True on the splash screen, which has no site header above it, so the
   * slider gets the whole viewport rather than what's left under one.
   */
  fullViewport = false,
}: {
  slides: HeroSlide[];
  autoplay: boolean;
  interval: number;
  overlay?: number;
  fullViewport?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const region = useRef<HTMLElement>(null);

  // Read after mount: the server has no way to know, and rendering a different
  // first frame than the client would be a hydration mismatch.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const count = slides.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const rotating = autoplay && !paused && !reducedMotion && count > 1;

  useEffect(() => {
    if (!rotating) return;
    const ms = Math.max(2, interval || 7) * 1000;
    const timer = window.setTimeout(() => go(index + 1), ms);
    return () => window.clearTimeout(timer);
  }, [rotating, index, interval, go]);

  // Arrow keys, but only while the slider actually has focus — hijacking them
  // for the whole page would break ordinary scrolling.
  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  if (count === 0) return null;

  return (
    <section
      ref={region}
      className={styles.slider}
      data-full={fullViewport ? "true" : "false"}
      style={
        {
          "--wash": Math.min(100, Math.max(0, overlay)) / 100,
        } as React.CSSProperties
      }
      aria-roledescription="carousel"
      aria-label="Featured"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        const showVideo = isVideoUrl(slide.video) && !reducedMotion;

        return (
          <div
            key={i}
            className={styles.slide}
            data-active={active ? "true" : "false"}
            aria-hidden={active ? undefined : "true"}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            // An inactive slide is faded out but still in the layout, so its
            // links have to be taken out of the tab order explicitly.
            inert={!active}
          >
            {showVideo && active ? (
              <video
                className={styles.slideMedia}
                src={slide.video}
                poster={slide.image || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : slide.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.slideMedia}
                src={slide.image}
                alt={slide.imageAlt}
                fetchPriority={i === 0 ? "high" : "low"}
              />
            ) : null}

            <div className={styles.slideWash} />

            <div className={`shell ${styles.slideBody}`}>
              {slide.eyebrow ? (
                <div className={styles.slideEyebrow}>
                  <span className={styles.slideDot} />
                  <span className="eyebrow" style={{ letterSpacing: "0.16em" }}>
                    {slide.eyebrow}
                  </span>
                </div>
              ) : null}

              {/* Only the opening slide is the document's h1. Giving every
                  slide one would put three h1s on the homepage, and making it
                  follow the active slide would rewrite the outline every time
                  a timer fires — worse for a screen reader than a fixed one. */}
              {i === 0 ? (
                <h1 className="h1" style={{ marginBottom: 20 }}>
                  {slide.heading}
                </h1>
              ) : (
                <p className="h1" style={{ marginBottom: 20 }}>
                  {slide.heading}
                </p>
              )}

              {slide.body ? (
                <p className="lead measure-640" style={{ margin: "0 auto 34px" }}>
                  {slide.body}
                </p>
              ) : null}

              <div
                className="row-wrap"
                style={{ gap: 11, justifyContent: "center" }}
              >
                {slide.primaryLabel && slide.primaryHref ? (
                  <Link href={slide.primaryHref} className="pill pill--accent">
                    {slide.primaryLabel}
                  </Link>
                ) : null}
                {slide.secondaryLabel && slide.secondaryHref ? (
                  <Link
                    href={slide.secondaryHref}
                    className="pill pill--outline"
                  >
                    {slide.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 ? (
        <div className={`shell ${styles.sliderControls}`}>
          <button
            type="button"
            className={styles.sliderArrow}
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
          >
            <span aria-hidden="true">←</span>
          </button>

          <p className={styles.sliderCount} aria-live="polite">
            <span className={styles.sliderCountNow}>{pad(index + 1)}</span>
            <span aria-hidden="true"> / {pad(count)}</span>
            <span className="sr-only">of {count}</span>
          </p>

          <button
            type="button"
            className={styles.sliderArrow}
            onClick={() => go(index + 1)}
            aria-label="Next slide"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
