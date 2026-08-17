import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PackageCards } from "@/components/ui/PackageCards";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("media");
  return pageMetadata(seo, "/media-services");
}

export default async function MediaServicesPage() {
  const media = await getContent("media");

  return (
    <>
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.hero.image}
          alt={media.hero.imageAlt}
          className="hero__img"
          fetchPriority="high"
        />
        <div className="hero__wash" />
        <div className="shell hero__body" style={{ paddingBottom: 90 }}>
          <div className="bm-rise" style={{ maxWidth: 800 }}>
            <div className="eyebrow mb-22">{media.hero.eyebrow}</div>
            <h1 className="h1" style={{ lineHeight: 1, marginBottom: 20 }}>
              {media.hero.heading}
              <span className="accent-word">{media.hero.accentTail}</span>
            </h1>
            <p className="lead measure-620">{media.hero.lead}</p>
          </div>
        </div>
      </section>

      <section data-reveal className="band band--ruled">
        <div className="shell section">
          <PackageCards
            packages={media.packages.items}
            deliverablesLabel={media.packages.deliverablesLabel}
            enquirePrefix={media.packages.enquirePrefix}
          />
        </div>
      </section>
    </>
  );
}
