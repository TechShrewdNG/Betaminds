import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/ui/ui.module.css";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Accordion } from "@/components/ui/Accordion";
import {
  SummitInterestForm,
  NewsletterForm,
} from "@/components/forms/SummitForms";
import { resolveForm } from "@/lib/forms/resolve";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("summit");
  return pageMetadata(seo, "/summit");
}

export default async function SummitPage() {
  const summit = await getContent("summit");
  const { fields: interestFields } = await resolveForm("summit");

  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={summit.hero.image}
          alt={summit.hero.imageAlt}
          className="hero__img"
          fetchPriority="high"
        />
        <div
          className="hero__wash"
          style={{
            background:
              "linear-gradient(115deg, rgba(var(--scrim-rgb),.95), rgba(var(--scrim-rgb),.55))",
          }}
        />
        <div className="shell hero__body">
          <div className="bm-rise" style={{ maxWidth: 860 }}>
            <div className="eyebrow mb-22">{summit.hero.eyebrow}</div>
            <h1 className="h1" style={{ lineHeight: 1, marginBottom: 22 }}>
              {summit.hero.heading}
              <span className="accent-word">{summit.hero.accentTail}</span>
            </h1>
            <p
              className="lead"
              style={{ maxWidth: 680, color: "var(--ink-86)" }}
            >
              {summit.hero.lead}
            </p>

            <div className="row-wrap" style={{ gap: 12, margin: "32px 0 34px" }}>
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: 12,
                  border: "1px solid var(--line-input)",
                  background: "rgba(var(--wash-rgb),.03)",
                }}
              >
                <div
                  className="eyebrow eyebrow--tight"
                  style={{ fontSize: 9.5, marginBottom: 5 }}
                >
                  {summit.hero.nextLabel}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {summit.hero.nextDetail}
                </div>
              </div>
            </div>

            <div className="row-wrap" style={{ gap: 11 }}>
              <a href="#interest" className="pill pill--accent pill--lg">
                {summit.hero.ctaPrimary}
              </a>
              {summit.hero.deckUrl ? (
                <a
                  href={summit.hero.deckUrl}
                  className="pill pill--outline pill--lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  {summit.hero.ctaSecondary}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* A movement, not a conference. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--mid">
            <div>
              <h2 className="h2" style={{ marginBottom: 20 }}>
                {summit.movement.heading}
              </h2>
              <p className="body" style={{ marginBottom: 16 }}>
                {summit.movement.body1}
              </p>
              <p className="body">{summit.movement.body2}</p>
            </div>

            <div className="panel panel--accent" style={{ padding: "34px 32px" }}>
              <div className="eyebrow eyebrow--tight mb-18">
                {summit.movement.missionLabel}
              </div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.66,
                  color: "var(--ink-88)",
                  margin: 0,
                  textWrap: "pretty",
                }}
              >
                {summit.movement.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event highlights. */}
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <div className={styles.statRow} data-stagger>
            {summit.stats.items.map((stat) => {
              // Split a trailing +, %, K or x onto its own span so the unit
              // can carry the accent while the figure stays ink.
              const m = /^(.*?)([+%KkMx]*)$/.exec(stat.n) ?? [];
              return (
                <div key={stat.label}>
                  <div className={styles.statNum}>
                    {m[1] ?? stat.n}
                    {m[2] ? <span className={styles.statUnit}>{m[2]}</span> : null}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why attend? */}
      <section data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <h2 className="h2" style={{ marginBottom: 32 }}>
            {summit.why.heading}
          </h2>
          <div className="grid col3">
            {summit.why.items.map((item, index) => (
              <div
                key={item.title}
                className="card"
                style={{ borderRadius: 16, padding: "30px 28px" }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "var(--accent-tint)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--accent)",
                    marginBottom: 18,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 18,
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                    textWrap: "balance",
                  }}
                >
                  {item.title}
                </div>
                <div className="card-body" style={{ color: "var(--ink-76)" }}>
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editions and galleries. */}
      <section data-reveal className="band band--ink band--alt band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight">
            {summit.editions.items.map((edition) => (
              <div
                key={edition.edition}
                className="panel"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div style={{ padding: "28px 30px 22px" }}>
                  <div className="eyebrow eyebrow--tight" style={{ marginBottom: 12 }}>
                    {edition.edition}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 21,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                      textWrap: "balance",
                    }}
                  >
                    {edition.theme}
                  </div>
                  <div style={{ fontSize: 14.5, color: "var(--ink-74)" }}>
                    {edition.date} · {edition.venue}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    background: "var(--line)",
                  }}
                >
                  {edition.gallery.map((src, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt={`${edition.edition} gallery image ${index + 1}`}
                      className="ratio-1-1"
                      style={{
                        display: "block",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className="panel mt-14"
            style={{
              borderRadius: 16,
              padding: "26px 30px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div className="eyebrow eyebrow--tight">{summit.press.label}</div>
            <div className="row-wrap" style={{ gap: 10 }}>
              {summit.press.items.map((item) => {
                const chip = (
                  <span
                    style={{
                      padding: "10px 18px",
                      border: "1px dashed rgba(var(--wash-rgb),.2)",
                      borderRadius: 8,
                      fontSize: 13.5,
                      color: "var(--ink-84)",
                      display: "inline-block",
                    }}
                  >
                    {item.name}
                  </span>
                );
                return item.href ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {chip}
                  </a>
                ) : (
                  <span key={item.name}>{chip}</span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Agenda beside success stories. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--mid">
            <div>
              <h2 className="h2" style={{ marginBottom: 28 }}>
                {summit.agenda.heading}
              </h2>
              <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {summit.agenda.steps.map((step, index) => (
                  <li
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "11px 0",
                      borderBottom: "1px solid var(--line-soft)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                        fontSize: 10,
                        color: "var(--accent)",
                        flex: "none",
                        width: 22,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 15.5, color: "var(--ink-90)" }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-14" style={{ alignContent: "start" }}>
              {summit.stories.items.map((story) => (
                <div
                  key={story.name}
                  className="card"
                  style={{ borderRadius: 16, padding: 30 }}
                >
                  <div
                    style={{
                      color: "var(--accent)",
                      fontSize: 13,
                      letterSpacing: "0.2em",
                      marginBottom: 14,
                    }}
                    aria-label="Five out of five"
                  >
                    ★★★★★
                  </div>
                  <blockquote
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                      fontSize: 19,
                      lineHeight: 1.42,
                      letterSpacing: "-0.015em",
                      margin: "0 0 18px",
                      textWrap: "pretty",
                    }}
                  >
                    {`“${story.quote}”`}
                  </blockquote>
                  <div className="row" style={{ gap: 12 }}>
                    {story.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.image}
                        alt=""
                        width={38}
                        height={38}
                        className="avatar"
                        style={{ width: 38, height: 38 }}
                        loading="lazy"
                      />
                    ) : null}
                    <div style={{ fontSize: 13, color: "var(--ink-76)" }}>
                      {story.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ. */}
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section" style={{ maxWidth: 900 }}>
          <h2 className="h2" style={{ marginBottom: 30 }}>
            {summit.faq.heading}
          </h2>
          <Accordion items={summit.faq.items} />
        </div>
      </section>

      {/* Sponsorship, registration note and newsletter. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight">
            <div
              className="panel panel--accent"
              style={{
                padding: "44px 40px",
                borderColor: "rgba(232,163,61,.3)",
                background:
                  "linear-gradient(145deg, rgba(232,163,61,.1), transparent 70%)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 28,
                  lineHeight: 1.12,
                  letterSpacing: "-0.025em",
                  margin: "0 0 14px",
                  textWrap: "balance",
                }}
              >
                {summit.sponsor.heading}
              </h3>
              <p
                style={{
                  fontSize: 15.5,
                  lineHeight: 1.64,
                  color: "var(--ink-84)",
                  margin: "0 0 26px",
                  textWrap: "pretty",
                }}
              >
                {summit.sponsor.body}
              </p>
              <div className="row-wrap" style={{ gap: 10 }}>
                {summit.hero.deckUrl ? (
                  <a
                    href={summit.hero.deckUrl}
                    className="pill pill--accent pill--sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {summit.sponsor.ctaPrimary}
                  </a>
                ) : null}
                <Link
                  href={summit.sponsor.ctaSecondaryHref}
                  className="pill pill--outline pill--sm"
                >
                  {summit.sponsor.ctaSecondary}
                </Link>
              </div>
            </div>

            <div className="grid gap-14">
              <div className="panel" style={{ padding: "30px 32px" }}>
                <div className="eyebrow eyebrow--tight" style={{ marginBottom: 10 }}>
                  {summit.register.label}
                </div>
                <div
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    color: "var(--ink-84)",
                    textWrap: "pretty",
                  }}
                >
                  {summit.register.body}
                </div>
              </div>

              <div className="panel" style={{ padding: "30px 32px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 19,
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                  }}
                >
                  {summit.newsletter.heading}
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: "var(--ink-76)",
                    marginBottom: 18,
                  }}
                >
                  {summit.newsletter.body}
                </div>
                <NewsletterForm newsletter={summit.newsletter} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register interest. No data-reveal: same reasoning as the other two
          form sections — a tall or growing form shouldn't be gated behind
          a scroll threshold that can lag well behind it being on screen. */}
      <section id="interest" className="band band--alt band--ruled">
        <div className="shell section" style={{ maxWidth: 760 }}>
          <div className="panel">
            <h2 className="h2" style={{ marginBottom: 12 }}>
              {summit.interest.heading}
            </h2>
            <p className="body" style={{ fontSize: 15.5, marginBottom: 28 }}>
              {summit.interest.body}
            </p>
            <SummitInterestForm
              interest={summit.interest}
              fields={interestFields}
            />
          </div>
        </div>
      </section>
    </>
  );
}
