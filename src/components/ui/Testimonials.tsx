"use client";

import { useState } from "react";
import styles from "./ui.module.css";

export type Testimonial = {
  quote: string;
  name: string;
  company: string;
  image: string;
};

export function Testimonials({
  label,
  items,
}: {
  label: string;
  items: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;

  const current = items[index % items.length];
  const step = (delta: number) =>
    setIndex((value) => (value + delta + items.length) % items.length);

  return (
    <div className="panel" style={{ padding: "52px 48px", borderRadius: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 26 }}>
        {label}
      </div>

      {/* Each piece is keyed on index so it remounts and crossfades in
          separately, instead of the quote and byline just snapping to the
          next testimonial. The prev/next buttons stay unkeyed so clicking
          one repeatedly doesn't remount it out from under the visitor's
          focus. */}
      <blockquote
        key={index}
        className={`quote ${styles.testiFade}`}
        style={{ margin: "0 0 30px" }}
        aria-live="polite"
      >
        {`“${current.quote}”`}
      </blockquote>

      <div className={styles.testiFoot}>
        <div key={index} className={`${styles.testiWho} ${styles.testiFade}`}>
          {current.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image}
              alt=""
              width={46}
              height={46}
              className="avatar"
              style={{ width: 46, height: 46 }}
            />
          ) : null}
          <div>
            <div className={styles.testiName}>{current.name}</div>
            <div className={styles.testiCompany}>{current.company}</div>
          </div>
        </div>

        {items.length > 1 ? (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.round}
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.round}
              onClick={() => step(1)}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
