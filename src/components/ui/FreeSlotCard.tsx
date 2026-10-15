"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

/**
 * The monthly free-consultation offer.
 *
 * This is the strongest hook on the page and used to sit in a quiet panel
 * beside the booking-fee note, where it read as a footnote. It now carries the
 * section on its own: a live pulse, a real countdown to the next slot, and the
 * accent wash moving behind it.
 *
 * The countdown is genuinely live rather than decorative — it names the next
 * first working day of the month and counts down to it, so the offer reads as
 * something with a clock on it instead of a standing claim.
 */

/** First working day (Mon–Fri) of the month containing `from`, at 09:00. */
function firstWorkingDay(year: number, month: number) {
  const date = new Date(year, month, 1, 9, 0, 0, 0);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

/** The next slot: this month's if it hasn't passed, otherwise next month's. */
function nextSlot(now: Date) {
  const thisMonth = firstWorkingDay(now.getFullYear(), now.getMonth());
  if (thisMonth.getTime() > now.getTime()) return thisMonth;
  return firstWorkingDay(now.getFullYear(), now.getMonth() + 1);
}

type Remaining = { days: number; hours: number; minutes: number; label: string };

function remainingUntil(target: Date, now: Date): Remaining {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const minutes = Math.floor(ms / 60000);
  return {
    days: Math.floor(minutes / 1440),
    hours: Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
    label: target.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
  };
}

export function FreeSlotCard({
  label,
  heading,
  body,
  ctaLabel = "Claim the free slot",
  ctaHref = "#book",
}: {
  label: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  // Rendered only after mount: the server has no idea what "now" is for this
  // visitor, and rendering a countdown on both sides guarantees a mismatch.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setRemaining(remainingUntil(nextSlot(now), now));
    };
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.freeSlot}>
      <span className={styles.freeSlotGlow} aria-hidden="true" />

      <div className={styles.freeSlotInner}>
        <div className={styles.freeSlotCopy}>
          <div className={styles.freeSlotLabel}>
            <span className={styles.freeSlotPulse} aria-hidden="true" />
            {label}
          </div>

          <h3 className={styles.freeSlotHeading}>{heading}</h3>
          <p className={styles.freeSlotBody}>{body}</p>

          <Link href={ctaHref} className={`pill pill--accent ${styles.freeSlotCta}`}>
            {ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {remaining ? (
          <div className={styles.freeSlotCountdown}>
            <div className={styles.freeSlotCountLabel}>Next slot opens in</div>
            <div className={styles.freeSlotUnits}>
              <Unit value={remaining.days} caption={remaining.days === 1 ? "day" : "days"} />
              <Unit value={remaining.hours} caption={remaining.hours === 1 ? "hour" : "hours"} />
              <Unit value={remaining.minutes} caption={remaining.minutes === 1 ? "min" : "mins"} />
            </div>
            <div className={styles.freeSlotWhen}>
              <Icon name="calendar" size={15} />
              {remaining.label}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Unit({ value, caption }: { value: number; caption: string }) {
  return (
    <div className={styles.freeSlotUnit}>
      <span className={styles.freeSlotNum}>{String(value).padStart(2, "0")}</span>
      <span className={styles.freeSlotCaption}>{caption}</span>
    </div>
  );
}
