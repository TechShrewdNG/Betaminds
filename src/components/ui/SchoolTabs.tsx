"use client";

import { Suspense, useEffect, useState } from "react";
import styles from "./ui.module.css";
import { AcademyForm } from "@/components/forms/AcademyForm";
import type { FormField } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

export type Course = {
  name: string;
  weeks: string;
  mode: string;
  description?: string;
};
export type School = { name: string; courses: Course[] };
type Apply = ContentDefaults["academy"]["apply"];

export function SchoolTabs({
  heading,
  schools,
  certificateLabel,
  enrolLabel,
  apply,
  fields,
}: {
  heading: string;
  schools: School[];
  certificateLabel: string;
  enrolLabel: string;
  apply: Apply;
  fields: FormField[];
}) {
  const [active, setActive] = useState(0);
  const [openCourse, setOpenCourse] = useState<Course | null>(null);
  const current = schools[active] ?? schools[0];

  useEffect(() => {
    if (!openCourse) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCourse(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCourse]);

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
          <button
            key={course.name}
            type="button"
            className={styles.courseCard}
            onClick={() => setOpenCourse(course)}
          >
            <div className={styles.courseCardName}>{course.name}</div>
            <div className="row-wrap" style={{ gap: 6 }}>
              <Chip>{course.weeks}</Chip>
              <Chip>{course.mode}</Chip>
              <Chip accent>{certificateLabel}</Chip>
            </div>
            <span className={styles.courseCardCta}>{enrolLabel} →</span>
          </button>
        ))}
      </div>

      {openCourse ? (
        <div
          className={styles.modalBack}
          role="dialog"
          aria-modal="true"
          aria-label={openCourse.name}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpenCourse(null);
          }}
        >
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close"
              onClick={() => setOpenCourse(null)}
            >
              ×
            </button>

            <div className={styles.modalName}>{openCourse.name}</div>
            {openCourse.description ? (
              <p className={styles.modalDescription}>
                {openCourse.description}
              </p>
            ) : null}
            <div className="row-wrap" style={{ gap: 6, marginBottom: 28 }}>
              <Chip>{openCourse.weeks}</Chip>
              <Chip>{openCourse.mode}</Chip>
              <Chip accent>{certificateLabel}</Chip>
            </div>

            <div className={styles.modalDivider} />

            <h3 className={styles.modalFormHeading}>{apply.heading}</h3>
            <p className={styles.modalFormBody}>{apply.body}</p>
            <Suspense fallback={null}>
              <AcademyForm
                apply={apply}
                fields={fields}
                presetCourse={openCourse.name}
              />
            </Suspense>
          </div>
        </div>
      ) : null}
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
