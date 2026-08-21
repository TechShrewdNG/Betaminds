import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedProjects, projectMeta } from "@/lib/projects";
import { PackageCards } from "@/components/ui/PackageCards";
import { IndexHero, IndexContents } from "@/components/ui/IndexHero";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("media");
  return pageMetadata(seo, "/media-services");
}

export default async function MediaServicesPage() {
  const [media, projects] = await Promise.all([
    getContent("media"),
    publishedProjects(),
  ]);
  const proof = projects.slice(0, 3);

  return (
    <>
      <IndexHero
        image={media.hero.image}
        imageAlt={media.hero.imageAlt}
        eyebrow={media.hero.eyebrow}
        heading={media.hero.heading}
        accentTail={media.hero.accentTail}
        lead={media.hero.lead}
        rail={
          <IndexContents
            label={media.packages.contentsLabel}
            items={media.packages.items.map((pkg, index) => ({
              href: `#pkg-${index}`,
              text: pkg.label,
            }))}
          />
        }
      />

      <section data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <PackageCards
            packages={media.packages.items}
            deliverablesLabel={media.packages.deliverablesLabel}
            enquirePrefix={media.packages.enquirePrefix}
          />
        </div>
      </section>

      {/* Proof. The page was a hero and a price list and nothing else — seven
          claims about the work with none of the work anywhere in sight. These
          are the published case studies, newest first. */}
      {proof.length > 0 ? (
        <section data-reveal className="band band--ruled">
          <div className="shell section">
            <div className="split mb-34">
              <h2 className="h2">{media.proof.heading}</h2>
              <Link href="/projects" className={styles.pkgLink}>
                {media.proof.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid col3 carousel-mobile" data-stagger>
              {proof.map((project) => (
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
                    <div
                      className="ratio-4-3"
                      style={{ background: "var(--surface-alt)" }}
                    />
                  )}
                  <div className={styles.workHover}>
                    <div className={styles.workMeta}>{projectMeta(project)}</div>
                    <div className={styles.workName}>{project.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
