import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { publishedProjects, projectMeta } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { Marquee } from "@/components/ui/Marquee";
import { MediaTabs } from "@/components/ui/MediaTabs";
import { Testimonials } from "@/components/ui/Testimonials";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PromoVideo } from "@/components/ui/PromoVideo";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("home");
  return pageMetadata(seo, "/home");
}

/** Mission / vision / why-us, one logo colour each so the mark's palette shows
 *  up in the page rather than only in the header. */
const PILLAR_ICONS: IconName[] = ["strategy", "spark", "users"];
const PILLAR_TONES = ["blue", "orange", "green"] as const;

export default async function HomePage() {
  // Plans, media packages and summit stats are edited on their own pages; the
  // homepage renders them so there is only ever one place to change them.
  const [home, ecosystem, media, summit, projects] = await Promise.all([
    getContent("home"),
    getContent("ecosystem"),
    getContent("media"),
    getContent("summit"),
    publishedProjects(),
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
          className="shell bm-rise"
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
      <section data-reveal className="tint-band" style={{ padding: "34px 0" }}>
        <div
          className="eyebrow eyebrow--muted center"
          style={{ marginBottom: 26 }}
        >
          {home.trusted.label}
        </div>
        <Marquee logos={home.trusted.logos} />
      </section>

      {/* 3 — 01 / Who we are. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="grid col2" style={{ alignItems: "start" }}>
            <div>
              <div className="section-name mb-22">{home.about.eyebrow}</div>
              <h2 className="section-lede" style={{ marginBottom: 26 }}>
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

            {/* The portrait pairs with the intro copy — at 16:10 in this
                column it lands within a few pixels of the text block's own
                height, so the two columns finish together. The pillars used to
                stack under it here, which made this side twice as tall as the
                copy and left a large hole beside the CTA. */}
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
          </div>

          <div className="grid col3 mt-40" data-stagger>
            {home.about.pillars.map((pillar, index) => (
              <div
                key={pillar.kicker}
                className="card"
                style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <span
                  className="icon-chip icon-chip--sm"
                  data-tone={PILLAR_TONES[index % PILLAR_TONES.length]}
                >
                  <Icon name={PILLAR_ICONS[index] ?? "spark"} size={17} />
                </span>
                <div>
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
              </div>
            ))}
          </div>

          {/* Native <details>: keyboard- and screen-reader-operable with no
              client state, and it degrades to just being open if JS never
              loads — this list still reads fine either way. */}
          <details className={`panel--accent-soft mt-56 ${styles.notForDrop}`}>
            <summary className={styles.notForSummary}>
              <span
                className="eyebrow eyebrow--tight"
                style={{ fontWeight: 600 }}
              >
                {home.about.notForTitle}
              </span>
              <Icon name="arrow-right" size={15} className={styles.notForChevron} />
            </summary>
            <div
              className="grid col3"
              style={{ gap: "12px 34px", marginTop: 16 }}
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
          </details>
        </div>
      </section>

      {/* 4 — 02 / Meet the spark. */}
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <div className="mb-34">
            <div className="section-name mb-18">{home.team.eyebrow}</div>
            <h2 className="section-lede">{home.team.heading}</h2>
          </div>

          <div className={styles.teamGrid}>
            {home.team.members.map((member, index) => (
              <div
                key={member.name}
                className={`${styles.tile} ${index === 0 ? styles.tileFeatured : ""}`}
              >
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
        </div>
      </section>

      {/* 5 — 03 / Digital marketplace. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="panel--feature panel">
            <div className="grid col2 col2--mid" style={{ alignItems: "center" }}>
              <div>
                <div className="section-name mb-18">{home.marketplace.eyebrow}</div>
                <h2 className="section-lede" style={{ marginBottom: 22 }}>
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
        </div>
      </section>

      {/* 6 — 04 / Media services. */}
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <div className="section-name mb-18">{home.media.eyebrow}</div>
          <div className="split mb-34">
            <h2 className="section-lede measure-620">{home.media.heading}</h2>
            <Link href="/media-services" className="link-underline">
              {home.media.linkLabel}
            </Link>
          </div>
          <MediaTabs
            packages={media.packages.items}
            enquireLabel={home.media.enquireLabel}
          />
        </div>
      </section>

      {/* 7 — 05 / The Summit. */}
      <section data-reveal         className="hero"
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
            <div className="section-name mb-18">{home.summit.eyebrow}</div>
            <h2 className="section-lede" style={{ marginBottom: 20 }}>
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

      {/* 8 — Projects. */}
      <section data-reveal id="projects" className="band band--ruled">
        <div className="shell section">
          <div className="section-name mb-18">{home.portfolio.eyebrow}</div>
          <div className="split mb-34">
            <h2 className="section-lede">{home.portfolio.heading}</h2>
            <div className="row-wrap" style={{ gap: 20, alignItems: "baseline" }}>
              <div style={{ fontSize: 14.5, color: "var(--ink-70)" }}>
                {home.portfolio.note}
              </div>
              <Link href="/projects" className="link-underline">
                {home.portfolio.allLinkLabel}
              </Link>
            </div>
          </div>
          <div className="grid col3 carousel-mobile">
            {projects.slice(0, home.portfolio.limit).map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={styles.tile}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.name}
                  className={`${styles.tileImg} ratio-4-3`}
                  loading="lazy"
                />
                <div className={styles.workHover}>
                  <div className={styles.workMeta}>{projectMeta(project)}</div>
                  <div className={styles.workName}>{project.name}</div>
                  <span className={styles.workView}>
                    {home.portfolio.viewLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — Testimonials. */}
      <section data-reveal className="band band--alt">
        <div className="shell section">
          <Testimonials
            label={home.testimonials.label}
            items={home.testimonials.items}
          />
        </div>
      </section>

      {/* 10 — 07 / Betaminds Academy. */}
      <section data-reveal className="band band--accent band--ruled">
        <div className="shell section">
          <div className="section-name mb-18">{home.academy.eyebrow}</div>
          <div className="split mb-34">
            <h2 className="section-lede measure-620">{home.academy.heading}</h2>
            <Link href={home.academy.ctaHref} className="pill pill--accent">
              {home.academy.ctaLabel}
            </Link>
          </div>
          <div className="grid col5 carousel-mobile" data-peek="small">
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
        </div>
      </section>

      {/* Commercials — Digital Marketplace and Academy, side by side. Each
          quietly skips itself until a video is uploaded, so an empty pair
          collapses the whole section rather than showing two empty frames. */}
      {home.commercials.marketplace.video || home.commercials.academy.video ? (
        <section data-reveal className="band band--alt band--ruled">
          <div className="shell section">
            <div className="mb-40">
              <div className="section-name mb-18">{home.commercials.eyebrow}</div>
              <h2 className="section-lede">{home.commercials.heading}</h2>
            </div>
            <div className="grid col2">
              {home.commercials.marketplace.video ? (
                <PromoVideo
                  video={home.commercials.marketplace.video}
                  poster={home.commercials.marketplace.poster}
                  posterAlt={home.commercials.marketplace.posterAlt}
                  label={home.commercials.marketplace.label}
                />
              ) : null}
              {home.commercials.academy.video ? (
                <PromoVideo
                  video={home.commercials.academy.video}
                  poster={home.commercials.academy.poster}
                  posterAlt={home.commercials.academy.posterAlt}
                  label={home.commercials.academy.label}
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 11 — 08 / Final CTA. */}
      <section data-reveal className="band band--ruled">
        <div className="shell section">
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
              <div className="section-name mb-22">{home.finalCta.eyebrow}</div>
              <h2
                className="section-lede measure-740"
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
        </div>
      </section>
    </>
  );
}
