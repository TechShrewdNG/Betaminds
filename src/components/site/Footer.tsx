"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./Footer.module.css";
import type { ContentDefaults } from "@/lib/content/defaults";

type Global = ContentDefaults["global"];

/** Contact rows are CMS content, so the icon is chosen from the row's own
 *  label rather than a fixed index — reordering or renaming a row in the
 *  admin still gets a sensible mark, and anything unrecognised gets a pin. */
function contactIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("mail") || l.includes("email")) return "mail";
  if (l.includes("phone") || l.includes("tel")) return "phone";
  if (l.includes("web") || l.includes("site")) return "globe";
  return "pin";
}

export function Footer({
  brand,
  footer,
  contact,
}: {
  brand: Global["brand"];
  footer: Global["footer"];
  contact: Global["contact"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <footer className={`band--ink ${styles.footer}`}>
      {/* Envelope flap. Closed it's just a teaser; clicking it opens to reveal
          the whole footer — brand, quick links, contact details, legal — as
          the "letter" inside. The button stays text-only (just the flap, hint
          and quote) since a <button> can't legally contain links; everything
          interactive lives in the sibling panel below, styled to read as one
          continuous card with the button above it. */}
      <div className={`shell ${styles.envelopeShell}`}>
        <button
          type="button"
          className={styles.envelope}
          data-open={open ? "true" : "false"}
          aria-expanded={open}
          aria-controls="footer-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.flap} aria-hidden="true" />

          <span className={styles.envelopeBody}>
            <span className={styles.hint}>
              {open ? footer.flapHintOpen : footer.flapHintClosed}
            </span>
            <span className={styles.flapQuote}>
              {open ? footer.flapBack : footer.flapFront}
            </span>
          </span>
        </button>

        {open ? (
          <div id="footer-panel" className={styles.panel}>
            <div className={styles.top}>
              <div>
                {/* Footer uses the full stacked lockup at 156px. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt="Betaminds Africa"
                  className={styles.logo}
                />
                <p className={styles.tagline}>{brand.tagline}</p>

                {contact.socials.length > 0 ? (
                  <div className={styles.socialsBlock}>
                    <div className={styles.socialsLabel}>
                      {contact.socialsLabel}
                    </div>
                    <div className={styles.socials}>
                      {contact.socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          className={styles.socialLink}
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.columns}>
                {footer.columns.map((column) => (
                  <div key={column.title}>
                    <div className={styles.columnTitle}>{column.title}</div>
                    <div className={styles.columnLinks}>
                      {column.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className={styles.quickLink}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.backGrid}>
              {contact.rows.map((row) => (
                <div key={row.label} className={styles.backItem}>
                  <div className={styles.backLabel}>
                    <Icon name={contactIcon(row.label)} size={13} />
                    {row.label}
                  </div>
                  <div className={styles.backValue}>{row.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.flapCta}>
              <Link href={footer.flapCtaHref} className="pill pill--accent pill--sm">
                {footer.flapCtaLabel}
              </Link>
            </div>

            <div className={styles.legalRow}>
              <div>{footer.copyright}</div>
              <div className={styles.legalLinks}>
                {footer.legalLinks.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
