import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { getContent, getSectionOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedProjects } from "@/lib/projects";
import { PackageCards } from "@/components/ui/PackageCards";
import { IndexHero, IndexContents } from "@/components/ui/IndexHero";
import { ProjectTile } from "@/components/ui/ProjectTile";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("media");
  return pageMetadata(seo, "/media-services");
}

export default async function MediaServicesPage() {
  const [media, projects, order] = await Promise.all([
    getContent("media"),
    publishedProjects(),
    getSectionOrder("media"),
  ]);
  const proof = projects.slice(0, 3);

  const sections: Record<string, ReactNode> = {
    hero: (
      <IndexHero
        image={media.hero.image}
        imageAlt={media.hero.imageAlt}
        eyebrow={media.hero.eyebrow}
        heading={media.hero.heading}
        accentTail={media.hero.accentTail}
        lead={media.hero.lead}
        rail={
          <IndexContents
            hideOnMobile
            label={media.packages.contentsLabel}
            items={media.packages.items.map((pkg, index) => ({
              href: `#pkg-${index}`,
              text: pkg.label,
            }))}
          />
        }
      />
    ),
    packages: (
      <section data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <PackageCards
            packages={media.packages.items}
            deliverablesLabel={media.packages.deliverablesLabel}
            enquirePrefix={media.packages.enquirePrefix}
            rateCardLabel={media.packages.rateCardLabel}
          />
        </div>
      </section>
    ),
    // Proof. The page was a hero and a price list and nothing else — seven
    // claims about the work with none of the work anywhere in sight. These
    // are the published case studies, newest first.
    proof:
      proof.length > 0 ? (
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
                <ProjectTile key={project.key} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null,
  };

  return (
    <>
      {order.map((key) => (
        <Fragment key={key}>{sections[key] ?? null}</Fragment>
      ))}
    </>
  );
}
