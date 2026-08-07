import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import {
  publishedProjects,
  projectBySlug,
  projectMeta,
} from "@/lib/projects";

/** Pre-renders every published case study at build time. */
export async function generateStaticParams() {
  const projects = await publishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return pageMetadata(
    {
      title: `${project.name} — ${projectMeta(project)}`,
      description: project.summary,
    },
    `/projects/${project.slug}`,
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, doc, projects] = await Promise.all([
    projectBySlug(slug),
    getContent("projects"),
    publishedProjects(),
  ]);

  if (!project) notFound();
  const { detail } = doc;

  // Wraps around, so the last project points back at the first.
  const position = projects.findIndex((entry) => entry.slug === project.slug);
  const next = projects[(position + 1) % projects.length];

  const sections = [
    { label: detail.challengeLabel, body: project.challenge },
    { label: detail.approachLabel, body: project.approach },
    { label: detail.outcomeLabel, body: project.outcome },
  ].filter((section) => section.body.trim() !== "");

  return (
    <>
      <section className="hero">
        {project.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.heroImage}
            alt={project.name}
            className="hero__img"
            fetchPriority="high"
          />
        ) : null}
        <div className="hero__wash" />
        <div className="shell hero__body">
          <div className="bm-rise" style={{ maxWidth: 820 }}>
            <div className="eyebrow mb-22">{projectMeta(project)}</div>
            <h1 className="h1" style={{ lineHeight: 1, marginBottom: 20 }}>
              {project.name}
            </h1>
            {project.summary ? (
              <p className="lead measure-620">{project.summary}</p>
            ) : null}

            <div className="row-wrap" style={{ gap: 26, marginTop: 32 }}>
              {[
                { label: "Client", value: project.client },
                { label: "Industry", value: project.industry },
                { label: "Service", value: project.service },
                { label: "Year", value: project.year },
              ]
                .filter((fact) => fact.value)
                .map((fact) => (
                  <div key={fact.label}>
                    <div className="eyebrow eyebrow--tight">{fact.label}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: 15,
                        marginTop: 6,
                      }}
                    >
                      {fact.value}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {sections.length > 0 ? (
        <section data-reveal className="shell section" style={{ maxWidth: 820 }}>
          {sections.map((section) => (
            <div key={section.label} style={{ marginBottom: 44 }}>
              <h2 className="h3" style={{ marginBottom: 14 }}>
                {section.label}
              </h2>
              {/* Paragraph breaks come from blank lines in the CMS textarea. */}
              {section.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} className="body" style={{ marginBottom: 14 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </section>
      ) : null}

      {project.results.length > 0 ? (
        <section data-reveal className="shell section section--tight-top">
          <h2 className="h2 mb-34">{detail.resultsLabel}</h2>
          <div className="grid col4">
            {project.results.map((result) => (
              <div
                key={`${result.n}-${result.label}`}
                className="card"
                style={{ borderRadius: 16, padding: "32px 28px" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 40,
                    letterSpacing: "-0.04em",
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}
                >
                  {result.n}
                </div>
                <div className="mono-meta" style={{ fontSize: 11, marginTop: 12 }}>
                  {result.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.gallery.length > 0 ? (
        <section data-reveal className="shell section section--tight-top">
          <h2 className="h2 mb-34">{detail.galleryLabel}</h2>
          <div className="grid col3 carousel-mobile">
            {project.gallery.map((src, index) => (
              <div key={`${src}-${index}`} className="frame ratio-4-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.name}, image ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.quote ? (
        <section data-reveal className="shell section section--tight-top">
          <div className="panel" style={{ padding: "52px 48px", borderRadius: 20 }}>
            <blockquote className="quote" style={{ margin: 0 }}>
              {`“${project.quote}”`}
            </blockquote>
            {project.quoteAuthor ? (
              <div
                className="mono-meta"
                style={{ marginTop: 26 }}
              >
                {project.quoteAuthor}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section data-reveal className="shell section section--tight-top">
        <div className="grid col2 col2--tight">
          {next && next.slug !== project.slug ? (
            <Link
              href={`/projects/${next.slug}`}
              className="panel"
              style={{ display: "block", color: "var(--ink)" }}
            >
              <div className="eyebrow eyebrow--tight mb-18">
                {detail.nextLabel}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                {next.name}
              </div>
              <div className="card-body">{projectMeta(next)}</div>
            </Link>
          ) : null}

          <div className="panel panel--accent">
            <h2 className="h3" style={{ marginBottom: 20 }}>
              {detail.ctaHeading}
            </h2>
            <Link href={detail.ctaHref} className="pill pill--accent">
              {detail.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
