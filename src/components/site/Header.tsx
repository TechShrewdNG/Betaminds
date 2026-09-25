"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import type { ContentDefaults } from "@/lib/content/defaults";

type Global = ContentDefaults["global"];

/**
 * Per-route wordmark override: the header reads as "Betaminds <Section>"
 * instead of "Betaminds Africa" while on that section. Keyed by path prefix,
 * checked longest-first isn't needed while there's only one entry, but the
 * lookup is written to support more without restructuring it.
 */
const WORDMARK_OVERRIDES: Record<string, string> = {
  "/academy": "Academy",
};

function wordmarkSubFor(pathname: string, fallback: string) {
  const match = Object.keys(WORDMARK_OVERRIDES).find((prefix) =>
    pathname.startsWith(prefix),
  );
  return match ? WORDMARK_OVERRIDES[match] : fallback;
}

export function Header({
  brand,
  nav,
}: {
  brand: Global["brand"];
  nav: Global["nav"];
}) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent on load, solid on hover — plus solid once scrolled, so the nav
  // stays readable over content rather than only over the hero wash.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change means the menu's job is done.
  useEffect(() => setMenuOpen(false), [pathname]);

  const isSolid = solid || scrolled || menuOpen;

  return (
    <header
      className={`${styles.header} ${isSolid ? styles.solid : ""}`}
      onMouseEnter={() => setSolid(true)}
      onMouseLeave={() => setSolid(false)}
    >
      <div className={styles.bar}>
        <Link href="/home" className={styles.brand} aria-label="Betaminds Africa, home">
          <span className={styles.mark}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" />
          </span>
          <span className={styles.lockup}>
            <span className={styles.wordmark}>{brand.wordmark}</span>
            <span className={styles.wordmarkSub}>
              {wordmarkSubFor(pathname, brand.wordmarkSub)}
            </span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {nav.items.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <Link href={nav.ctaHref} className={`pill pill--accent ${styles.cta}`}>
            {nav.ctaLabel}
          </Link>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={styles.menu}
        data-open={menuOpen ? "true" : "false"}
      >
        {nav.items.map((item) => (
          <Link key={item.href} href={item.href} className={styles.menuLink}>
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
