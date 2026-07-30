"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";
import type { MediaPackage } from "./MediaTabs";

/**
 * Media Services page: seven click-to-expand cards. Only one is open at a time,
 * matching the prototype's single `openCard` index.
 */
export function PackageCards({
  packages,
  deliverablesLabel,
  enquirePrefix,
}: {
  packages: MediaPackage[];
  deliverablesLabel: string;
  enquirePrefix: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-12">
      {packages.map((pkg, index) => {
        const isOpen = open === index;
        return (
          <div
            key={pkg.label}
            className={styles.expandCard}
            data-open={isOpen ? "true" : "false"}
          >
            <button
              type="button"
              className={styles.expandButton}
              aria-expanded={isOpen}
              aria-controls={`package-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className={styles.expandIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.expandMain}>
                <span className={styles.expandTitle}>{pkg.label}</span>
                <span className={styles.expandBlurb}>{pkg.blurb}</span>
              </span>
              <span className={styles.expandSign} aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div
              id={`package-${index}`}
              className={styles.expandPanel}
              hidden={!isOpen}
            >
              <div
                className="eyebrow eyebrow--muted eyebrow--tight"
                style={{ marginBottom: 14 }}
              >
                {deliverablesLabel}
              </div>
              <div className={styles.deliverables}>
                {pkg.items.map((item) => (
                  <div key={item} className={styles.tick}>
                    <span className={styles.tickMark} aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href={`/lets-work?need=${encodeURIComponent(pkg.label)}`}
                className="pill pill--accent pill--sm"
                style={{ alignSelf: "flex-start" }}
              >
                {enquirePrefix} {pkg.label}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
