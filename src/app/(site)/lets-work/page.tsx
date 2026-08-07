import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getContent, getGlobal } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { BriefForm } from "@/components/forms/BriefForm";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("work");
  return pageMetadata(seo, "/lets-work");
}

export default async function LetsWorkPage() {
  const [work, global] = await Promise.all([getContent("work"), getGlobal()]);

  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.hero.image}
          alt={work.hero.imageAlt}
          className="hero__img"
          fetchPriority="high"
        />
        <div
          className="hero__wash"
          style={{
            background:
              "linear-gradient(110deg, rgba(251,250,248,.95), rgba(251,250,248,.62))",
          }}
        />
        <div className="shell hero__body">
          <div className="bm-rise" style={{ maxWidth: 760 }}>
            <div className="eyebrow mb-22">{work.hero.eyebrow}</div>
            <h1 className="h1" style={{ lineHeight: 1, marginBottom: 20 }}>
              {work.hero.heading}
            </h1>
            <p
              className="lead"
              style={{ maxWidth: 560, marginBottom: 34 }}
            >
              {work.hero.lead}
            </p>
            <Link href={work.hero.ctaHref} className="pill pill--accent pill--lg">
              {work.hero.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section data-reveal className="shell section">
        <div className="grid col2 col2--tight">
          {/* Office address, email, website, phone, and the social icons. */}
          <div className="grid gap-14" style={{ alignContent: "start" }}>
            <div className="hairline-stack" style={{ borderRadius: "var(--r-panel)" }}>
              {global.contact.rows.map((row) => (
                <div key={row.label} style={{ padding: "24px 28px" }}>
                  <div className="eyebrow eyebrow--tight" style={{ marginBottom: 8 }}>
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 16,
                      color: "var(--ink-94)",
                      lineHeight: 1.5,
                      textWrap: "pretty",
                    }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="panel" style={{ padding: "26px 28px" }}>
              <div
                className="eyebrow eyebrow--muted eyebrow--tight"
                style={{ marginBottom: 16 }}
              >
                {global.contact.socialsLabel}
              </div>
              <div className="row-wrap" style={{ gap: 9 }}>
                {global.contact.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid rgba(23,23,27,.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "var(--ink-90)",
                    }}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: "40px 38px" }}>
            <h2 className="h3" style={{ marginBottom: 8 }}>
              {work.form.heading}
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--ink-74)",
                margin: "0 0 28px",
              }}
            >
              {work.form.body}
            </p>
            <Suspense fallback={null}>
              <BriefForm form={work.form} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
