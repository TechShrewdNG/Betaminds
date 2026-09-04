import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedProjects, projectMeta } from "@/lib/projects";
import { IndexHero, IndexTags } from "@/components/ui/IndexHero";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("projects");
  return pageMetadata(seo, "/projects");
}

export default async function ProjectsPage() {
  const [doc, projects] = await Promise.all([
    getContent("projects"),
    publishedProjects(),
  ]);
  const { index } = doc;

  // The newest published project supplies the hero photograph, and the archive
  // itself supplies the rail — no new CMS fields for either.
  const featured = projects[0];
  const industries = [
    ...new Set(projects.map((project) => project.industry).filter(Boolean)),
  ];

  return (
    <>
      <IndexHero
        image={featured?.heroImage || featured?.image}
        eyebrow={index.eyebrow}
        heading={index.heading}
        accentTail={index.accentTail}
        lead={index.lead}
        rail={<IndexTags label="Industries" items={industries} />}
      />

      <section data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          {projects.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", padding: "72px 32px" }}>
              <p className="body measure-520" style={{ margin: "0 auto 26px" }}>
                {index.emptyMessage}
              </p>
              <Link href="/lets-work" className="pill pill--accent">
                Let&rsquo;s work →
              </Link>
            </div>
          ) : (
            <div className="grid col3 carousel-mobile" data-stagger>
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className={styles.tile}
                >
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.name}
                      className={`${styles.tileImg} ratio-4-3`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="ratio-4-3" style={{ background: "var(--surface-alt)" }} />
                  )}
                  <div className={styles.workHover}>
                    <div className={styles.workMeta}>{projectMeta(project)}</div>
                    <div className={styles.workName}>{project.name}</div>
                    <span className={styles.workView}>{index.readLabel}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
