"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import type { ContentDefaults } from "@/lib/content/defaults";

type Global = ContentDefaults["global"];

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
    <footer className={styles.footer}>
      <div className={`shell ${styles.top}`}>
        <div>
          {/* Footer uses the full stacked lockup at 156px. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo} alt="Betaminds Africa" className={styles.logo} />
          <p className={styles.tagline}>{brand.tagline}</p>

          {contact.socials.length > 0 ? (
            <div className={styles.socialsBlock}>
              <div className={styles.socialsLabel}>{contact.socialsLabel}</div>
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
                  <Link key={link.label} href={link.href} className={styles.quickLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Envelope flap. Closed it shows a triangular flap over the front face;
          clicking it opens to the back face with the contact details. */}
      <div className={`shell ${styles.envelopeShell}`}>
        <button
          type="button"
          className={styles.envelope}
          data-open={open ? "true" : "false"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.flap} aria-hidden="true" />

          <span className={styles.envelopeBody}>
            <span className={styles.hint}>
              {open ? footer.flapHintOpen : footer.flapHintClosed}
            </span>

            {open ? (
              <span className={styles.back}>
                <span className={styles.flapQuote}>{footer.flapBack}</span>
                <span className={styles.backGrid}>
                  {contact.rows.map((row) => (
                    <span key={row.label} className={styles.backItem}>
                      <span className={styles.backLabel}>{row.label}</span>
                      <span className={styles.backValue}>{row.value}</span>
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              <span className={styles.flapQuote}>{footer.flapFront}</span>
            )}
          </span>
        </button>

        {/* A real link, outside the button — nesting one inside would be invalid
            markup and unreachable by keyboard. */}
        {open ? (
          <div className={styles.flapCta}>
            <Link href={footer.flapCtaHref} className="pill pill--accent pill--sm">
              {footer.flapCtaLabel}
            </Link>
          </div>
        ) : null}
      </div>

      <div className={styles.legal}>
        <div className={`shell ${styles.legalRow}`}>
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
    </footer>
  );
}
