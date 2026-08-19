"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ui.module.css";
import { Icon, type IconName } from "./Icon";
import { AcademyForm } from "@/components/forms/AcademyForm";
import type { FormField } from "@/lib/forms/definition";
import type { ContentDefaults } from "@/lib/content/defaults";

export type Course = {
  name: string;
  duration: string;
  mode: string;
  description?: string;
  icon?: string;
};

/** Courses are CMS content, so an unknown or empty icon falls back rather
 *  than rendering nothing. */
const COURSE_ICONS: IconName[] = [
  "camera", "video", "pen", "film", "sparkle", "megaphone",
  "layout", "code", "cpu", "search", "chart", "share",
  "identity", "strategy", "spark",
];

const courseIcon = (course: Course): IconName =>
  COURSE_ICONS.includes(course.icon as IconName)
    ? (course.icon as IconName)
    : "spark";
export type School = {
  name: string;
  image?: string;
  imageAlt?: string;
  courses: Course[];
};
type Apply = ContentDefaults["academy"]["apply"];
type CrashCourses = ContentDefaults["academy"]["crashCourses"];

export function SchoolTabs({
  heading,
  schools,
  certificateLabel,
  enrolLabel,
  apply,
  fields,
  crash,
}: {
  heading: string;
  schools: School[];
  certificateLabel: string;
  enrolLabel: string;
  apply: Apply;
  fields: FormField[];
  /** Short, standalone sessions shown in their own row below the schools —
   *  not a school of their own, so they skip the tab track entirely. */
  crash?: CrashCourses;
}) {
  const [active, setActive] = useState(0);
  const [openCourse, setOpenCourse] = useState<Course | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const current = schools[active] ?? schools[0];

  // The dialog is portalled to <body>, which needs a client mount first —
  // document doesn't exist while this renders on the server.
  useEffect(() => setMounted(true), []);

  // While the dialog is open, close on Escape and freeze the page behind it.
  // Without the scroll lock the wheel kept driving the page underneath, so the
  // dialog read as an unscrollable frame pinned over a moving background.
  useEffect(() => {
    if (!openCourse) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenCourse(null);
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog, and hand it back to the card that opened it
    // on close — otherwise keyboard focus is left stranded at the top of the
    // document behind the overlay.
    const opener = openerRef.current;
    closeRef.current?.focus();

    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
    };
    // Fixing the body is what actually stops iOS Safari from scrolling the
    // page behind the dialog; the offset keeps the visitor's place.
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflowY = "scroll";

    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflowY = prev.overflowY;
      window.scrollTo(0, scrollY);
      opener?.focus();
    };
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

      {current?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={current.name}
          src={current.image}
          alt={current.imageAlt || current.name}
          className={`${styles.schoolBanner} ratio-16-9`}
          loading="lazy"
        />
      ) : null}

      <div id="courses-panel" role="tabpanel" className="grid col3 carousel-mobile">
        {(current?.courses ?? []).map((course) => (
          <button
            key={course.name}
            type="button"
            className={styles.courseCard}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setOpenCourse(course);
            }}
          >
            <span className={styles.courseIcon}>
              <Icon name={courseIcon(course)} size={22} />
            </span>
            <div className={styles.courseCardName}>{course.name}</div>
            <div className="row-wrap" style={{ gap: 6 }}>
              <Chip>{course.duration}</Chip>
              <Chip>{course.mode}</Chip>
              <Chip accent>{certificateLabel}</Chip>
            </div>
            <span className={styles.courseCardCta}>{enrolLabel} →</span>
          </button>
        ))}
      </div>

      {crash && crash.items.length > 0 ? (
        <div className={styles.crashSection}>
          <div className={styles.crashHeading}>{crash.heading}</div>
          {crash.body ? <p className={styles.crashBody}>{crash.body}</p> : null}
          <div className="grid col2 col2--tight">
            {crash.items.map((item) => (
              <button
                key={item.name}
                type="button"
                className={styles.crashCard}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setOpenCourse(item);
                }}
              >
                <span className={styles.crashIcon}>
                  <Icon name={courseIcon(item)} size={19} />
                </span>
                <span className={styles.crashMain}>
                  <span className={styles.crashName}>{item.name}</span>
                  <span className={styles.crashMeta}>
                    {item.duration} · {item.mode}
                  </span>
                </span>
                <Icon name="arrow-right" size={16} className={styles.crashArrow} />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Portalled to <body> on purpose. The scroll-reveal animation leaves a
          transform on the enclosing <section>, and a transformed ancestor
          becomes the containing block for position:fixed — which pinned the
          dialog inside that section instead of the viewport, so it read as a
          framed panel with the page scrolling past it. */}
      {mounted && openCourse
        ? createPortal(
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
            <div className={styles.modalHead}>
              <span className={styles.modalIcon}>
                <Icon name={courseIcon(openCourse)} size={22} />
              </span>
              <div className={styles.modalName}>{openCourse.name}</div>
              <button
                ref={closeRef}
                type="button"
                className={styles.modalClose}
                aria-label="Close"
                onClick={() => setOpenCourse(null)}
              >
                <Icon name="close" size={17} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {openCourse.description ? (
                <p className={styles.modalDescription}>
                  {openCourse.description}
                </p>
              ) : null}
              <div className="row-wrap" style={{ gap: 6, marginBottom: 28 }}>
                <Chip>{openCourse.duration}</Chip>
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
        </div>,
            document.body,
          )
        : null}
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
