"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";

export type MediaPackage = {
  label: string;
  blurb: string;
  items: string[];
};

/**
 * Homepage section 04: tab across the media packages, showing the selected
 * package's blurb and numbered deliverable list.
 */
export function MediaTabs({
  packages,
  enquireLabel,
}: {
  packages: MediaPackage[];
  enquireLabel: string;
}) {
  const [active, setActive] = useState(0);
  const current = packages[active] ?? packages[0];
  if (!current) return null;

  return (
    <>
      <div className={styles.tabRow} role="tablist" aria-label="Media packages">
        {packages.map((pkg, index) => (
          <button
            key={pkg.label}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls="media-panel"
            className={styles.tabOutline}
            onClick={() => setActive(index)}
          >
            {pkg.label}
          </button>
        ))}
      </div>

      <div
        id="media-panel"
        role="tabpanel"
        className="panel grid col2 col2--mid"
        style={{ padding: "38px 40px" }}
      >
        <div>
          <h3 className="h3" style={{ marginBottom: 12 }}>
            {current.label}
          </h3>
          <p
            className="body"
            style={{ fontSize: 16, lineHeight: 1.66, marginBottom: 26 }}
          >
            {current.blurb}
          </p>
          <Link
            href={`/lets-work?need=${encodeURIComponent(current.label)}`}
            className="pill pill--accent-outline"
          >
            {enquireLabel}
          </Link>
        </div>

        <div className="hairline-stack" style={{ borderRadius: 12 }}>
          {current.items.map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "15px 18px",
                fontSize: 14.5,
                lineHeight: 1.55,
                color: "var(--ink-88)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: 10,
                  color: "var(--accent)",
                  paddingTop: 4,
                  flex: "none",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
