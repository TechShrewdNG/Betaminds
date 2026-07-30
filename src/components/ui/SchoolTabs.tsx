"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";

export type Course = { name: string; weeks: string; mode: string };
export type School = { name: string; courses: Course[] };

export function SchoolTabs({
  heading,
  schools,
  certificateLabel,
  enrolLabel,
}: {
  heading: string;
  schools: School[];
  certificateLabel: string;
  enrolLabel: string;
}) {
  const [active, setActive] = useState(0);
  const current = schools[active] ?? schools[0];

  return (
    <>
      <div className="split mb-34">
        <h2 className="h2">{heading}</h2>
        <div className={styles.tabTrack} role="tablist" aria-label="Schools">
          {schools.map((school, index) => (
            <button
              key={school.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="courses-panel"
              className={styles.tab}
              onClick={() => setActive(index)}
            >
              {school.name}
            </button>
          ))}
        </div>
      </div>

      <div id="courses-panel" role="tabpanel" className="grid col3">
        {(current?.courses ?? []).map((course) => (
          <div
            key={course.name}
            className="card"
            style={{
              borderRadius: 16,
              padding: "26px 26px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 19,
                letterSpacing: "-0.02em",
              }}
            >
              {course.name}
            </div>
            <div className="row-wrap" style={{ gap: 6 }}>
              <Chip>{course.weeks}</Chip>
              <Chip>{course.mode}</Chip>
              <Chip accent>{certificateLabel}</Chip>
            </div>
            <Link
              href={`/academy?course=${encodeURIComponent(course.name)}#apply`}
              className="pill pill--accent-outline pill--sm"
              style={{ alignSelf: "flex-start" }}
            >
              {enrolLabel}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "var(--r-pill)",
        background: accent ? "var(--accent-tint)" : "rgba(23,23,27,.06)",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: 11.5,
        color: accent ? "var(--accent)" : "var(--ink-84)",
      }}
    >
      {children}
    </span>
  );
}
