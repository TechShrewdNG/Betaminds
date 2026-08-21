"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";
import type { MediaPackage } from "./MediaTabs";

/**
 * Media Services page: seven click-to-expand packages, one open at a time.
 *
 * Set as hairline-ruled rows rather than bordered cards, with the index as a
 * large outlined numeral in the margin. Seven identical bordered boxes each
 * carrying an identical gold pill made the page read as one repeated unit and
 * spent the accent on every row; the numeral does the structural work now and
 * the enquiry is a text link, leaving the gold for something that matters.
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
  // First package opens on load: with the panels genuinely collapsing now,
  // a closed-by-default list left the page as seven titles and nothing else.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.pkgList}>
      {packages.map((pkg, index) => {
        const isOpen = open === index;
        return (
          <div
            key={pkg.label}
            className={styles.pkgRow}
            data-open={isOpen ? "true" : "false"}
          >
            <button
              type="button"
              className={styles.expandButton}
              aria-expanded={isOpen}
              aria-controls={`package-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className={styles.pkgNum} aria-hidden="true">
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
                className={styles.pkgLink}
              >
                {enquirePrefix} {pkg.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
