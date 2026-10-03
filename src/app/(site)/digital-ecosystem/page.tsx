import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PlanCards } from "@/components/ui/PlanCards";
import { FreeSlotCard } from "@/components/ui/FreeSlotCard";
import { PromoVideo } from "@/components/ui/PromoVideo";
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
          <div className="bm-rise" style={{ maxWidth: 820 }}>
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

      {/* Commercial — video only, so this quietly skips itself until one is
          uploaded. */}
      {eco.promo.video ? (
        <section data-reveal className="band band--ruled">
          <div className="shell section col-920">
            <PromoVideo
              video={eco.promo.video}
              poster={eco.promo.poster}
              posterAlt={eco.promo.posterAlt}
              label={eco.promo.label}
              heading={eco.promo.heading}
              body={eco.promo.body}
            />
          </div>
        </section>
      ) : null}

      {/* Engagement plans — bundled packages, not the standalone-capability
          grid this page used to lead with. */}
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <h2 className="h2 mb-18">{eco.plans.heading}</h2>
          <p className="body measure-620 mb-34">{eco.plans.lead}</p>
          <PlanCards
            plans={eco.plans.items}
            featuredIndex={eco.plans.featuredIndex}
            selectLabel={eco.plans.selectLabel}
          />
        </div>
      </section>

      {/* Booking notes. The free slot is the strongest hook on the page, so it
          leads the section at full width with a live countdown; the booking-fee
          note sits under it as the supporting detail it actually is. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <FreeSlotCard
            label={eco.notes.freeLabel}
            heading={eco.notes.freeHeading}
            body={eco.notes.freeBody}
          />

          <div
            className="panel mt-40"
            style={{ borderRadius: 16, padding: "30px 34px 32px" }}
          >
            <div className="eyebrow eyebrow--tight mb-18">
              {eco.notes.paidLabel}
            </div>
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.66,
                color: "var(--ink-84)",
                textWrap: "pretty",
                maxWidth: "68ch",
              }}
            >
              {eco.notes.paidBody}
            </div>
          </div>
        </div>
      </section>

      {/* Before you book — the questionnaire, live. No data-reveal here: this
          section is several viewports tall, so the scroll-reveal threshold
          wouldn't clear until well after it's on screen, making the form
          look like it isn't there while the visitor scrolls through it. */}
      <section id="book" className="band band--alt band--ruled">
        <div className="shell section">
          <div className="panel" style={{ borderRadius: 20, padding: "52px 44px" }}>
            <div className="grid col2 col2--mid">
              <div className="sticky-col">
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
                          border: "1px solid rgba(var(--accent-rgb),.5)",
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
        </div>
      </section>
    </>
  );
}
