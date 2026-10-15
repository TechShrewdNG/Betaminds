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
/**
 * Cards inside a revealed section come in one after another rather than as one
 * block. The delay is set per child as a custom property so the CSS keeps the
 * timing, and it's capped so a ten-card grid doesn't leave the last item
 * waiting noticeably after the visitor has already read the rest.
 */
function revealChildren(section: HTMLElement) {
  const groups = section.querySelectorAll<HTMLElement>("[data-stagger]");
  groups.forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return;
      child.style.setProperty("--bm-delay", `${Math.min(index, 7) * 70}ms`);
      child.classList.add("bm-stagger");
    });
  });
}

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
          revealChildren(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // threshold: 0 fires as soon as any part of a section enters — using a
      // fraction of the section's own height instead (e.g. 0.15) meant a
      // section taller than the viewport could stay invisible for a very
      // long stretch of scrolling after it was already on screen, which on
      // the tallest sections read as content (in one case, a form) that
      // "isn't showing". rootMargin still shrinks the trigger point in from
      // the viewport's own edges, not the target's, so it behaves the same
      // regardless of how tall the section is.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
