"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The admin's responsive shell.
 *
 * Above 900px this is the plain two-column grid it always was. Below it, the
 * sidebar becomes a drawer behind a hamburger — the nav is long enough
 * (dashboard, submissions, media, every content document, account) that
 * stacking it above the page pushed the actual work off the screen.
 *
 * The sidebar markup itself is passed in from the server layout, so the nav
 * and its submission count stay server-rendered; only the open/closed state
 * lives here.
 */
export function AdminShell({
  brand,
  sidebar,
  children,
}: {
  brand: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tapping a nav link should navigate *and* get the drawer out of the way.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="a-shell" data-nav-open={open ? "true" : "false"}>
      <div className="a-topbar">
        <button
          type="button"
          className="a-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="a-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="a-burger-box" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        {brand}
      </div>

      {/* Tapping outside the open drawer closes it. Hidden from the a11y tree:
          Escape and the toggle already cover keyboard and screen-reader users. */}
      <div
        className="a-scrim"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className="a-side" id="a-nav">
        {sidebar}
      </aside>

      <main className="a-main">{children}</main>
    </div>
  );
}
