import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getContent, getGlobal } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { BriefForm } from "@/components/forms/BriefForm";
import { IndexHero, IndexContents } from "@/components/ui/IndexHero";
import { contactHref, withDestination } from "@/lib/contact";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("work");
  return pageMetadata(seo, "/lets-work");
}

/**
 * A contact row's value, linked when it is something you can act on.
 * Falls back to plain text for a street address.
 */
function ContactValue({ value }: { value: string }) {
  const href = contactHref(value);
  const style = {
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    fontSize: 16,
    color: "var(--ink-94)",
    lineHeight: 1.5,
    textWrap: "pretty",
  } as const;

  if (!href) return <div style={style}>{value}</div>;

  return (
    <a
      href={href}
      className="contact-link"
      style={style}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      {value}
    </a>
  );
}

export default async function LetsWorkPage() {
  const [work, global] = await Promise.all([getContent("work"), getGlobal()]);
  const socials = withDestination(global.contact.socials);

  return (
    <>
      <IndexHero
        image={work.hero.image}
        imageAlt={work.hero.imageAlt}
        eyebrow={work.hero.eyebrow}
        heading={work.hero.heading}
        lead={work.hero.lead}
        cta={
          <Link href={work.hero.ctaHref} className="pill pill--accent pill--lg">
            {work.hero.ctaLabel}
          </Link>
        }
        rail={
          work.hero.steps.length > 0 ? (
            <IndexContents
              label={work.hero.stepsLabel}
              items={work.hero.steps.map((step) => ({ text: step }))}
            />
          ) : null
        }
      />

      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight">
            {/* Office address, email, website, phone, and the social icons. */}
            <div className="grid gap-14" style={{ alignContent: "start" }}>
              <div className="hairline-stack" style={{ borderRadius: "var(--r-panel)" }}>
                {global.contact.rows.map((row) => (
                  <div key={row.label} style={{ padding: "24px 28px" }}>
                    <div className="eyebrow eyebrow--tight" style={{ marginBottom: 8 }}>
                      {row.label}
                    </div>
                    <ContactValue value={row.value} />
                  </div>
                ))}
              </div>

              {socials.length > 0 ? (
              <div className="panel" style={{ padding: "26px 28px" }}>
                <div
                  className="eyebrow eyebrow--muted eyebrow--tight"
                  style={{ marginBottom: 16 }}
                >
                  {global.contact.socialsLabel}
                </div>
                <div className="row-wrap" style={{ gap: 9 }}>
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "1px solid var(--line-input)",
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
              ) : null}
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
        </div>
      </section>
    </>
  );
}
