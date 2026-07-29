import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Marquee } from "@/components/ui/Marquee";
import { MediaTabs } from "@/components/ui/MediaTabs";
import { Testimonials } from "@/components/ui/Testimonials";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("home");
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  // Plans, media packages and summit stats are edited on their own pages; the
  // homepage renders them so there is only ever one place to change them.
  const [home, ecosystem, media, summit] = await Promise.all([
    getContent("home"),
    getContent("ecosystem"),
    getContent("media"),
    getContent("summit"),
  ]);

  const plans = ecosystem.plans.items;
  const featured = ecosystem.plans.featuredIndex;

  return (
    <>
      {/* 1 — Hero. Full height, content bottom-anchored and centred. */}
      <section className="hero" style={{ minHeight: "100vh", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.hero.image}
          alt={home.hero.imageAlt}
          className="hero__img"
          fetchPriority="high"
        />
        <div className="hero__wash hero__wash--up" />
        <div
          className="shell"
          style={{
            position: "relative",
            maxWidth: 1180,
            alignSelf: "flex-end",
            textAlign: "center",
            paddingTop: 120,
            paddingBottom: 76,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "7px 15px",
              border: "1px solid var(--accent-line-strong)",
              borderRadius: "var(--r-pill)",
              marginBottom: 26,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--accent-fill)",
              }}
            />
            <span className="eyebrow" style={{ letterSpacing: "0.16em" }}>
              {home.hero.eyebrow}
            </span>
          </div>

          <h1 className="h1" style={{ marginBottom: 22 }}>
            {home.hero.heading}
            <span className="accent-word">{home.hero.accentTail}</span>
          </h1>

          <p
            className="lead measure-640"
            style={{ margin: "0 auto 14px" }}
          >
            {home.hero.lead}
          </p>
          <p className="mono-meta" style={{ margin: "0 auto 38px" }}>
            {home.hero.promise}
          </p>

          <div
            className="row-wrap"
            style={{ gap: 11, justifyContent: "center" }}
          >
            {home.hero.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={`pill ${cta.style === "accent" ? "pill--accent" : "pill--outline"}`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Trusted by. */}
      <section className="tint-band" style={{ padding: "34px 0" }}>
        <div
          className="eyebrow eyebrow--muted center"
          style={{ marginBottom: 26 }}
        >
          {home.trusted.label}
        </div>
        <Marquee logos={home.trusted.logos} />
      </section>

      {/* 3 — 01 / Who we are. */}
      <section className="shell section">
        <div className="grid col2" style={{ alignItems: "start" }}>
          <div>
            <div className="eyebrow mb-22">{home.about.eyebrow}</div>
            <h2 className="h2" style={{ marginBottom: 24 }}>
              {home.about.heading}
            </h2>
            <p className="body" style={{ marginBottom: 16 }}>
              {home.about.body1}
            </p>
            <p className="body" style={{ marginBottom: 34 }}>
              {home.about.body2}
            </p>
            <Link href={home.about.ctaHref} className="pill pill--accent">
              {home.about.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={home.about.image}
              alt={home.about.imageAlt}
              className="ratio-16-10"
              style={{
                display: "block",
                width: "100%",
                objectFit: "cover",
                borderRadius: "var(--r-card)",
              }}
              loading="lazy"
            />
            {home.about.pillars.map((pillar) => (
              <div key={pillar.kicker} className="card">
                <div
                  className="eyebrow eyebrow--tight"
                  style={{ fontWeight: 600, marginBottom: 9 }}
                >
                  {pillar.kicker}
                </div>
                <div
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    color: "var(--ink-88)",
                    textWrap: "pretty",
                  }}
                >
                  {pillar.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel--accent-soft mt-56">
          <div
            className="eyebrow eyebrow--tight"
            style={{ fontWeight: 600, marginBottom: 16 }}
          >
            {home.about.notForTitle}
          </div>
          <div
            className="grid col3"
            style={{ gap: "12px 34px" }}
          >
            {home.about.notFor.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 11,
                  alignItems: "flex-start",
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--ink-78)",
                }}
              >
                <span style={{ color: "var(--accent)", flex: "none" }}>·</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — 02 / Meet the spark. */}
      <section className="shell section section--tight-top">
        <div className="split mb-34">
          <div>
            <div className="eyebrow mb-18">{home.team.eyebrow}</div>
            <h2 className="h2">{home.team.heading}</h2>
          </div>
          <div
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "var(--ink-70)",
              maxWidth: 300,
            }}
          >
            {home.team.note}
          </div>
        </div>

        <div className="grid col4">
          {home.team.members.map((member) => (
            <div key={member.name} className={styles.tile}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.image}
                alt={member.name}
                className={`${styles.tileImg} ratio-3-4`}
                loading="lazy"
              />
              <div className={styles.tileScrim}>
                <div className={styles.tileName}>{member.name}</div>
                <div className={styles.tileRole}>{member.role}</div>
              </div>
              <div className={styles.tileHover}>
                {member.instagram ? (
                  <a
                    href={member.instagram}
                    className={styles.socialCircle}
                    aria-label={`${member.name} on Instagram`}
                  >
                    IG
                  </a>
                ) : null}
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    className={styles.socialCircle}
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    IN
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — 03 / Digital marketplace. */}
      <section className="shell section section--tight-top">
        <div className="panel--feature panel">
          <div className="grid col2 col2--mid" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow mb-18">{home.marketplace.eyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 20 }}>
                {home.marketplace.heading}
              </h2>
              <p className="body" style={{ marginBottom: 28 }}>
                {home.marketplace.body}
              </p>
              <Link
                href={home.marketplace.ctaHref}
                className="pill pill--accent"
              >
                {home.marketplace.ctaLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-12">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className="card"
                  style={{
                    borderColor:
                      index === featured
                        ? "var(--accent-line-strong)"
                        : "var(--line-strong)",
                    background:
                      index === featured
                        ? "rgba(232,163,61,.06)"
                        : "var(--surface)",
                  }}
                >
                  <div
                    className="row"
                    style={{
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 7,
                    }}
                  >
                    <div className="card-title">{plan.name}</div>
                    <div
                      className="eyebrow eyebrow--tight"
                      style={{ letterSpacing: "0.14em" }}
                    >
                      {plan.tag}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: "var(--ink-78)",
                      textWrap: "pretty",
                    }}
                  >
                    {plan.short}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — 04 / Media services. */}
      <section className="shell section section--tight-top">
        <div className="eyebrow mb-18">{home.media.eyebrow}</div>
        <div className="split mb-34">
          <h2 className="h2 measure-620">{home.media.heading}</h2>
          <Link href="/media-services" className="link-underline">
            {home.media.linkLabel}
          </Link>
        </div>
        <MediaTabs
          packages={media.packages.items}
          enquireLabel={home.media.enquireLabel}
        />
      </section>

      {/* 7 — 05 / The Summit. */}
      <section
        className="hero"
        style={{ marginBottom: "var(--section-y)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.summit.image}
          alt={home.summit.imageAlt}
          className="hero__img"
          loading="lazy"
        />
        <div
          className="hero__wash"
          style={{
            background:
              "linear-gradient(100deg, rgba(251,250,248,.95), rgba(251,250,248,.55))",
          }}
        />
        <div
          className="shell"
          style={{ position: "relative", paddingTop: 92, paddingBottom: 92 }}
        >
          <div className="measure-660">
            <div className="eyebrow mb-18">{home.summit.eyebrow}</div>
            <h2 className="h2" style={{ marginBottom: 18 }}>
              {home.summit.heading}
            </h2>
            <p className="body" style={{ color: "var(--ink-84)" }}>
              {home.summit.body}
            </p>
            <div className="row-wrap" style={{ gap: 26, margin: "28px 0 32px" }}>
              {summit.stats.items.slice(0, 4).map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 34,
                      letterSpacing: "-0.03em",
                      color: "var(--accent)",
                    }}
                  >
                    {stat.n}
                  </div>
                  <div className="mono-meta" style={{ marginTop: 4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <Link href={home.summit.ctaHref} className="pill pill--accent">
              {home.summit.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* 8 — 06 / Portfolio. */}
      <section id="portfolio" className="shell section section--tight-top">
        <div className="eyebrow mb-18">{home.portfolio.eyebrow}</div>
        <div className="split mb-34">
          <h2 className="h2">{home.portfolio.heading}</h2>
          <div style={{ fontSize: 14.5, color: "var(--ink-70)" }}>
            {home.portfolio.note}
          </div>
        </div>
        <div className="grid col3">
          {home.portfolio.items.map((item) => {
            const inner = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className={`${styles.tileImg} ratio-4-3`}
                  loading="lazy"
                />
                <div className={styles.workHover}>
                  <div className={styles.workMeta}>{item.meta}</div>
                  <div className={styles.workName}>{item.name}</div>
                  {item.href ? (
                    <span className={styles.workView}>
                      {home.portfolio.viewLabel}
                    </span>
                  ) : null}
                </div>
              </>
            );

            return item.href ? (
              <a key={item.name} href={item.href} className={styles.tile}>
                {inner}
              </a>
            ) : (
              <div key={item.name} className={styles.tile}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9 — Testimonials. */}
      <section className="shell section section--tight-top">
        <Testimonials
          label={home.testimonials.label}
          items={home.testimonials.items}
        />
      </section>

      {/* 10 — 07 / Betaminds Academy. */}
      <section className="shell section section--tight-top">
        <div className="eyebrow mb-18">{home.academy.eyebrow}</div>
        <div className="split mb-34">
          <h2 className="h2 measure-620">{home.academy.heading}</h2>
          <Link href={home.academy.ctaHref} className="pill pill--accent">
            {home.academy.ctaLabel}
          </Link>
        </div>
        <div className="grid col5">
          {home.academy.grid.map((tile) => (
            <div
              key={tile.label}
              className="frame ratio-3-4"
              style={{ borderRadius: 12, border: "1px solid var(--line)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tile.image} alt={tile.label} loading="lazy" />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(23,23,27,.74), transparent 58%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  bottom: 14,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                {tile.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11 — 08 / Final CTA. */}
      <section className="shell section section--tight-top">
        <div
          className="frame"
          style={{
            borderRadius: "var(--r-feature)",
            border: "1px solid var(--line)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={home.finalCta.image}
            alt={home.finalCta.imageAlt}
            loading="lazy"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(251,250,248,.92), rgba(251,250,248,.6))",
            }}
          />
          <div
            style={{
              position: "relative",
              padding: "96px 40px",
              textAlign: "center",
            }}
          >
            <div className="eyebrow mb-22">{home.finalCta.eyebrow}</div>
            <h2
              className="h2 measure-740"
              style={{ margin: "0 auto 26px" }}
            >
              {home.finalCta.heading}
            </h2>
            <Link
              href={home.finalCta.ctaHref}
              className="pill pill--accent pill--lg"
            >
              {home.finalCta.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
