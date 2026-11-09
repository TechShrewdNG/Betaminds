"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Splits "500+" into 500 and "+", or "12.5K" into 12.5 and "K". */
function parse(value: string) {
  const match = /^(\D*)([\d.,]+)(.*)$/.exec(value.trim());
  if (!match) return null;
  const digits = match[2].replace(/,/g, "");
  const number = Number(digits);
  if (!Number.isFinite(number)) return null;
  return {
    prefix: match[1],
    number,
    suffix: match[3],
    // "12.5" counts in tenths; "500" counts whole.
    decimals: digits.includes(".") ? digits.split(".")[1].length : 0,
    // Preserve a thousands separator the editor typed.
    grouped: match[2].includes(","),
  };
}

/**
 * A statistic that counts up the first time it is scrolled into view.
 *
 * The stats are set as display numerals — the largest figures on the page —
 * and they were the one place where a number arriving felt more truthful than
 * a number simply being there.
 *
 * Renders the final value as text on the server, so the figure is correct
 * before hydration, for a crawler, with JS off, and under reduced motion. The
 * animation only ever replaces a value that is already right.
 */
export function Counter({
  value,
  duration = 1100,
}: {
  value: string;
  duration?: number;
}) {
  // Memoised deliberately: this object is an effect dependency, and recomputing
  // it every render made each setDisplay tear down the observer and restart the
  // count from zero, so the figure crawled and never arrived.
  const parsed = useMemo(() => parse(value), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!parsed) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const format = (n: number) => {
          const fixed = n.toFixed(parsed.decimals);
          return parsed.grouped
            ? Number(fixed).toLocaleString("en-US", {
                minimumFractionDigits: parsed.decimals,
                maximumFractionDigits: parsed.decimals,
              })
            : fixed;
        };

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // Same easing as the reveal curve, so the count settles the way
          // everything else on the page does.
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(format(parsed.number * eased));
          // Hand back to the server-rendered value at the end rather than a
          // formatted copy of it, so the figure on screen is always the one
          // the editor typed.
          if (t < 1) frameRef.current = requestAnimationFrame(step);
          else setDisplay(null);
        };
        frameRef.current = requestAnimationFrame(step);
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [parsed, duration]);

  // Anything that isn't a number ("Ongoing", "24/7") renders untouched.
  if (!parsed) return <>{value}</>;

  return (
    <span ref={ref}>
      {display === null ? (
        value
      ) : (
        <>
          {parsed.prefix}
          {display}
          {parsed.suffix}
        </>
      )}
    </span>
  );
}
