import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import { SchoolTabs } from "@/components/ui/SchoolTabs";
import { Accordion } from "@/components/ui/Accordion";
import { AcademyForm } from "@/components/forms/AcademyForm";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("academy");
  return { title: seo.title, description: seo.description };
}

export default async function AcademyPage() {
  const academy = await getContent("academy");
  const courseNames = academy.courses.schools.flatMap((school) =>
    school.courses.map((course) => course.name),
  );

  return (
    <>
      <section
        style={{
          background: "var(--surface-deep)",
          borderBottom: "1px solid rgba(23,23,27,.07)",
        }}
      >
        <div
          className="shell grid col2 col2--mid"
          style={{
            paddingTop: 110,
            paddingBottom: 90,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow mb-22">{academy.hero.eyebrow}</div>
            <h1 className="h1" style={{ marginBottom: 18 }}>
              {academy.hero.heading}
            </h1>
            <p
              className="quote"
              style={{
                lineHeight: 1.24,
                color: "rgba(23,23,27,.92)",
                margin: "0 0 22px",
                textWrap: "balance",
              }}
            >
              {academy.hero.subhead}
            </p>
            <p
              className="body measure-520"
              style={{ marginBottom: 26 }}
            >
              {academy.hero.lead}
            </p>

            <div className="eyebrow eyebrow--muted eyebrow--tight" style={{ marginBottom: 12 }}>
              {academy.hero.formatsLabel}
            </div>
            <div className="row-wrap" style={{ gap: 7, marginBottom: 32 }}>
              {academy.hero.formats.map((format) => (
                <span
                  key={format}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "var(--r-pill)",
                    border: "1px solid rgba(23,23,27,.16)",
                    fontSize: 13,
                    color: "var(--ink-90)",
                  }}
                >
                  {format}
                </span>
              ))}
            </div>

            <a href={academy.hero.ctaHref} className="pill pill--accent pill--lg">
              {academy.hero.ctaLabel}
            </a>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={academy.hero.image}
            alt={academy.hero.imageAlt}
            className="ratio-4-5"
            style={{
              display: "block",
              width: "100%",
              objectFit: "cover",
              borderRadius: "var(--r-panel)",
              border: "1px solid var(--line)",
            }}
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Courses, tabbed by school. */}
      <section className="shell section">
        <SchoolTabs
          heading={academy.courses.heading}
          schools={academy.courses.schools}
          certificateLabel={academy.courses.certificateLabel}
          enrolLabel={academy.courses.enrolLabel}
        />
      </section>

      {/* Why the Academy, beside the choice-to-employment pathway. */}
      <section className="shell section section--tight-top">
        <div className="grid col2 col2--tight">
          <div className="panel">
            <h2 className="h3" style={{ marginBottom: 22 }}>
              {academy.why.heading}
            </h2>
            <div className="grid" style={{ gap: 10 }}>
              {academy.why.items.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 15.5,
                    lineHeight: 1.55,
                    color: "var(--ink-88)",
                  }}
                >
                  <span style={{ color: "var(--accent)", flex: "none" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="panel panel--accent">
            <h2 className="h3" style={{ marginBottom: 22 }}>
              {academy.pathway.heading}
            </h2>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {academy.pathway.steps.map((step, index) => {
                const last = index === academy.pathway.steps.length - 1;
                return (
                  <li
                    key={step}
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: last
                          ? "var(--accent-fill)"
                          : "rgba(232,163,61,.4)",
                        flex: "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 15.5,
                        color: last ? "var(--accent)" : "var(--ink-90)",
                        padding: "9px 0",
                      }}
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Statistics. */}
      <section className="shell section section--tight-top">
        <h2 className="h2 measure-520 mb-34">{academy.stats.heading}</h2>
        <div className="grid col4">
          {academy.stats.items.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ borderRadius: 16, padding: "32px 28px" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 44,
                  letterSpacing: "-0.04em",
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {stat.n}
              </div>
              <div
                className="mono-meta"
                style={{ fontSize: 11, marginTop: 12 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student quotes. */}
      <section className="shell section section--tight-top">
        <div className="grid col2 col2--tight">
          {academy.quotes.items.map((item) => (
            <div
              key={item.name}
              className="panel"
              style={{ padding: "36px 34px" }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: 21,
                  lineHeight: 1.4,
                  letterSpacing: "-0.015em",
                  margin: "0 0 24px",
                  textWrap: "pretty",
                }}
              >
                {`“${item.quote}”`}
              </blockquote>
              <div className="row" style={{ gap: 13 }}>
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    width={42}
                    height={42}
                    className="avatar"
                    style={{ width: 42, height: 42 }}
                    loading="lazy"
                  />
                ) : null}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--ink-70)",
                      marginTop: 2,
                    }}
                  >
                    {item.course}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ. */}
      <section
        className="shell section section--tight-top"
        style={{ maxWidth: 900 }}
      >
        <h2 className="h2" style={{ marginBottom: 30 }}>
          {academy.faq.heading}
        </h2>
        <Accordion items={academy.faq.items} />
      </section>

      {/* Partners and Creative Foundations. */}
      <section className="shell section section--tight-top">
        <div className="grid col2 col2--tight">
          <div className="panel" style={{ padding: "44px 40px" }}>
            <div className="eyebrow eyebrow--tight mb-18">
              {academy.partners.eyebrow}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              {academy.partners.heading}
            </div>
            <div className="grid col3" style={{ gap: 10 }}>
              {academy.partners.logos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  style={{
                    height: 56,
                    border: logo.logo
                      ? "1px solid var(--line)"
                      : "1px dashed rgba(23,23,27,.14)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: 9.5,
                    letterSpacing: "0.1em",
                    color: "var(--ink-50)",
                    textTransform: "uppercase",
                    background: logo.logo ? "var(--surface)" : "transparent",
                  }}
                >
                  {logo.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      style={{
                        maxWidth: "82%",
                        maxHeight: "70%",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />
                  ) : (
                    logo.name
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="panel panel--accent"
            style={{ padding: "44px 40px" }}
          >
            <div className="eyebrow eyebrow--tight mb-18">
              {academy.foundation.eyebrow}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 24,
                letterSpacing: "-0.02em",
                marginBottom: 14,
                textWrap: "balance",
              }}
            >
              {academy.foundation.heading}
            </div>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.64,
                color: "var(--ink-84)",
                margin: "0 0 20px",
                textWrap: "pretty",
              }}
            >
              {academy.foundation.body}
            </p>
            <div className="grid" style={{ gap: 9 }}>
              {academy.foundation.points.map((point) => (
                <div
                  key={point}
                  style={{
                    display: "flex",
                    gap: 11,
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--ink-88)",
                  }}
                >
                  <span style={{ color: "var(--accent)", flex: "none" }}>·</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application form. */}
      <section
        id="apply"
        className="shell section section--tight-top"
        style={{ maxWidth: 760 }}
      >
        <div className="panel">
          <h2 className="h2" style={{ marginBottom: 12 }}>
            {academy.apply.heading}
          </h2>
          <p className="body" style={{ fontSize: 15.5, marginBottom: 28 }}>
            {academy.apply.body}
          </p>
          <Suspense fallback={null}>
            <AcademyForm
              apply={academy.apply}
              courses={courseNames}
              formats={academy.hero.formats}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
