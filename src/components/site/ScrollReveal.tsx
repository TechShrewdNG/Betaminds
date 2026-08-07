"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Progressive-enhancement scroll reveal.
 *
 * Adds `.bm-rise` (globals.css) to every `[data-reveal]` element as it enters
 * the viewport, once. Sections stay fully visible unless this effect actually
 * runs and tags `<html>` with `.js-reveal` first — see the matching CSS gate
 * in globals.css — so nothing on the page depends on JS for content to be
 * visible.
 *
 * Re-runs per route: this mounts once in the site layout, which persists
 * across client-side navigations, so without watching the pathname a second
 * page's sections would never get observed.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not(.bm-rise)",
    );
    if (targets.length === 0) return;

    document.documentElement.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("bm-rise");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
