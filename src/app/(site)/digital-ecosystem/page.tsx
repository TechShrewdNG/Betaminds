import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PlanCards } from "@/components/ui/PlanCards";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { resolveForm } from "@/lib/forms/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("ecosystem");
  return pageMetadata(seo, "/digital-ecosystem");
}

export default async function EcosystemPage() {
  const eco = await getContent("ecosystem");
  // The form's fields come from the CMS. The outline beside it is generated from
  // the same definitions, so the two can't drift apart.
  const { groups } = await resolveForm("consultation");

  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={eco.hero.image}
          alt={eco.hero.imageAlt}
          className="hero__img"
          fetchPriority="high"
        />
        <div className="hero__wash" />
        <div className="shell hero__body">
          <div style={{ maxWidth: 820 }}>
            <div className="eyebrow mb-22">{eco.hero.eyebrow}</div>
            <h1 className="h1" style={{ lineHeight: 1, marginBottom: 18 }}>
              {eco.hero.heading}
            </h1>
            <div
              className="quote accent-word"
              style={{ marginBottom: 24 }}
            >
              {eco.hero.accentLine}
            </div>
            <p className="lead measure-660" style={{ marginBottom: 34 }}>
              {eco.hero.lead}
            </p>
            <a href={eco.hero.ctaHref} className="pill pill--accent pill--lg">
              {eco.hero.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Our Digital Commerce Solution — capability cards. */}
      <section className="shell section">
        <h2 className="h2 measure-620" style={{ marginBottom: 16 }}>
          {eco.solution.heading}
        </h2>
        <p
          className="body measure-620"
          style={{ marginBottom: 44, color: "var(--ink-78)" }}
        >
          {eco.solution.body}
        </p>
        <div className="grid col3">
          {eco.solution.items.map((item, index) => (
            <div
              key={item.name}
              className="card"
              style={{ padding: "26px 26px 28px" }}
            >
              <div
                className="eyebrow eyebrow--tight"
                style={{ marginBottom: 14 }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                className="card-title"
                style={{ marginBottom: 8, textWrap: "balance" }}
              >
                {item.name}
              </div>
              <div className="card-body">{item.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Engagement plans. */}
      <section className="shell section section--tight-top">
        <h2 className="h2 mb-34">{eco.plans.heading}</h2>
        <PlanCards
          plans={eco.plans.items}
          featuredIndex={eco.plans.featuredIndex}
          selectLabel={eco.plans.selectLabel}
        />
      </section>

      {/* Booking notes: paid session credited to the package, monthly free slot. */}
      <section className="shell section section--tight-top">
        <div className="grid col2 col2--tight">
          <div className="panel" style={{ borderRadius: 16, padding: "34px 34px 36px" }}>
            <div className="eyebrow eyebrow--tight mb-18">
              {eco.notes.paidLabel}
            </div>
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.66,
                color: "var(--ink-84)",
                textWrap: "pretty",
              }}
            >
              {eco.notes.paidBody}
            </div>
          </div>

          <div
            className="panel panel--accent"
            style={{
              borderRadius: 16,
              padding: "34px 34px 36px",
              borderColor: "rgba(232,163,61,.3)",
              background:
                "linear-gradient(140deg, rgba(232,163,61,.09), transparent 70%)",
            }}
          >
            <div className="eyebrow eyebrow--tight mb-18">
              {eco.notes.freeLabel}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              {eco.notes.freeHeading}
            </div>
            <div
              style={{
                fontSize: 15.5,
                lineHeight: 1.64,
                color: "var(--ink-84)",
                textWrap: "pretty",
              }}
            >
              {eco.notes.freeBody}
            </div>
          </div>
        </div>
      </section>

      {/* Before you book — the questionnaire, live. */}
      <section id="book" className="shell section section--tight-top">
        <div className="panel" style={{ borderRadius: 20, padding: "52px 44px" }}>
          <div className="grid col2 col2--mid">
            <div>
              <div className="eyebrow eyebrow--tight mb-18">
                {eco.questionnaire.eyebrow}
              </div>
              <h2 className="h2" style={{ marginBottom: 18 }}>
                {eco.questionnaire.heading}
              </h2>
              <p
                className="body"
                style={{ fontSize: 16, marginBottom: 26, color: "var(--ink-80)" }}
              >
                {eco.questionnaire.body}
              </p>

              <div className="grid gap-12" style={{ marginBottom: 30 }}>
                {eco.questionnaire.steps.map((step, index) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: "var(--ink-86)",
                    }}
                  >
                    <span
                      style={{
                        width: 23,
                        height: 23,
                        borderRadius: "50%",
                        border: "1px solid rgba(232,163,61,.5)",
                        color: "var(--accent)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                      }}
                    >
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>

              <div className="hairline-stack" style={{ alignSelf: "start" }}>
                {(groups ?? []).map((group, index) => (
                  <div key={group.title} style={{ padding: "16px 20px" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 13.5,
                        marginBottom: 6,
                      }}
                    >
                      {index + 1}. {group.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: "var(--ink-70)",
                        textWrap: "pretty",
                      }}
                    >
                      {group.fields.map((field) => field.label).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Suspense fallback={null}>
                <ConsultationForm
                  questionnaire={eco.questionnaire}
                  groups={groups ?? []}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
