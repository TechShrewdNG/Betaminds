import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedProjects, projectMeta } from "@/lib/projects";
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

  return (
    <>
      <section
        style={{
          background: "var(--surface-deep)",
          borderBottom: "1px solid rgba(23,23,27,.07)",
        }}
      >
        <div
          className="shell"
          style={{ paddingTop: 130, paddingBottom: 72 }}
        >
          <div className="eyebrow mb-22">{index.eyebrow}</div>
          <h1 className="h1" style={{ marginBottom: 20 }}>
            {index.heading}
            <span className="accent-word">{index.accentTail}</span>
          </h1>
          <p className="lead measure-620">{index.lead}</p>
        </div>
      </section>

      <section className="shell section">
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
          <div className="grid col3">
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
      </section>
    </>
  );
}
