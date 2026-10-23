import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { getContent, getSectionOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PlanCards } from "@/components/ui/PlanCards";
import { IndexHero, IndexContents } from "@/components/ui/IndexHero";
import { SplitText } from "@/components/ui/SplitText";
import { Icon } from "@/components/ui/Icon";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("pr");
  return pageMetadata(seo, "/pr");
}

export default async function PrPage() {
  const [pr, order] = await Promise.all([
    getContent("pr"),
    getSectionOrder("pr"),
  ]);

  // Magazine and billboards show as soon as there's a heading and lead
  // worth reading — the cover, PDF link, and photographs each appear
  // independently once uploaded, instead of gating the whole section. Press
  // is pure photos, so it has nothing to show until at least one is set.
  const pressWithCover = pr.press.items.filter((item) => item.cover !== "");
  const billboards = pr.billboards.images.filter((src) => src !== "");

  const sections: Record<string, ReactNode> = {};

  sections.hero = (
      <IndexHero
        image={pr.hero.image}
        imageAlt={pr.hero.imageAlt}
        eyebrow={pr.hero.eyebrow}
        heading={pr.hero.heading}
        accentTail={pr.hero.accentTail}
        lead={pr.hero.lead}
        cta={
          <Link href={pr.hero.ctaHref} className="pill pill--accent pill--lg">
            {pr.hero.ctaLabel}
          </Link>
        }
        rail={
          <IndexContents
            hideOnMobile
            label="In this page"
            items={[
              { href: "#packages", text: pr.packages.heading },
              { href: "#events", text: pr.event.heading },
              { href: "#magazine", text: pr.magazine.eyebrow },
              ...(pressWithCover.length > 0
                ? [{ href: "#press", text: pr.press.heading }]
                : []),
              { href: "#billboards", text: pr.billboards.heading },
            ]}
          />
        }
      />
  );

  // Overview — what PR covers, in brief, before the packages that price it.
  sections.services = (
      <section data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <h2 className="h2 mb-28">{pr.services.heading}</h2>
          <div className="grid col2 col2--tight mb-34">
            {pr.services.items.map((item) => (
              <div key={item} className={styles.prDeliverable}>
                <Icon name="check" size={16} className={styles.tickMark} />
                {item}
              </div>
            ))}
          </div>
          <p className="body measure-620" style={{ marginBottom: 16 }}>
            {pr.services.body1}
          </p>
          <p className="body measure-620" style={{ margin: 0 }}>
            {pr.services.body2}
          </p>
        </div>
      </section>
  );

  // Monthly retainers, set as the Digital Marketplace plans are.
  sections.packages = (
      <section id="packages" data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <h2 className="h2 mb-18">
            <SplitText text={pr.packages.heading} />
          </h2>
          <p className="body measure-620 mb-34">{pr.packages.lead}</p>
          <PlanCards
            plans={pr.packages.items}
            featuredIndex={pr.packages.featuredIndex}
            selectLabel={pr.packages.selectLabel}
            bestForLabel={pr.packages.bestForLabel}
            deliverablesLabel={pr.packages.deliverablesLabel}
            ctaHref={(plan) =>
              `/lets-work?need=${encodeURIComponent(`PR — ${plan.name}`)}`
            }
          />
        </div>
      </section>
  );

  // Event PR and coverage.
  sections.event = (
      <section id="events" data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow mb-22">{pr.event.eyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 16 }}>
                <SplitText text={pr.event.heading} />
              </h2>
              <p className="body measure-520" style={{ marginBottom: 28 }}>
                {pr.event.body}
              </p>
              <Link
                href={pr.event.ctaHref}
                className="pill pill--accent pill--lg"
              >
                {pr.event.ctaLabel}
              </Link>
            </div>

            <div className="panel" style={{ padding: "36px 34px" }}>
              <div className="grid" style={{ gap: 2 }} data-stagger>
                {pr.event.items.map((item) => (
                  <div key={item} className={styles.prDeliverable}>
                    <Icon name="check" size={16} className={styles.tickMark} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  );

  // The Pinnacle Magazine. The cover and the download button only appear
  // once they've been uploaded — the heading, body and gallery show either way.
  sections.magazine = (
      <section id="magazine" data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <div className={styles.magGrid}>
            <div className={styles.magCover}>
              {pr.magazine.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pr.magazine.cover}
                  alt={pr.magazine.coverAlt}
                  className="bm-settle"
                  loading="lazy"
                />
              ) : (
                <div className={styles.emptyTile} style={{ position: "absolute", inset: 0 }}>
                  Cover coming soon
                </div>
              )}
            </div>

            <div>
              <div className="eyebrow mb-22">{pr.magazine.eyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 16 }}>
                <SplitText text={pr.magazine.heading} />
              </h2>
              <p className="body measure-520" style={{ marginBottom: 30 }}>
                {pr.magazine.body}
              </p>
              {pr.magazine.pdf ? (
                <a
                  href={pr.magazine.pdf}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="pill pill--accent pill--lg"
                >
                  {pr.magazine.ctaLabel}
                </a>
              ) : null}
            </div>
          </div>

          {pr.magazine.gallery.length > 0 ? (
            <div
              className="mt-40"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                background: "var(--line)",
              }}
            >
              {pr.magazine.gallery.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${pr.magazine.heading} gallery image ${index + 1}`}
                  className="ratio-1-1"
                  style={{ display: "block", width: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
  );

  // Press features. Just the cover photos, scrolling on their own — no
  // headline text, no separate link row. Each cover is the whole story:
  // click it (or the "read more" badge riding on it) to open the
  // publication. An item with no cover uploaded yet has nothing to show, so
  // the section stays hidden until at least one does.
  sections.press =
    pressWithCover.length > 0 ? (
        <section id="press" data-reveal className="band band--ruled">
          <div className="shell section">
            <ImageCarousel
              items={pressWithCover.map((item) => ({
                src: item.cover,
                alt: item.title,
                href: item.href || undefined,
              }))}
              readLabel={pr.press.readLabel}
            />
          </div>
        </section>
  ) : null;

  // Billboards. Landscape, and deliberately without links. The section
  // itself always shows — the grid becomes a placeholder until real
  // photographs are uploaded, instead of the heading vanishing with it.
  sections.billboards = (
      <section
        id="billboards"
        data-reveal
        className="band band--alt band--ruled"
      >
        <div className="shell section">
          <h2 className="h2 mb-18">
            <SplitText text={pr.billboards.heading} />
          </h2>
          <p className="body measure-620 mb-34">{pr.billboards.lead}</p>

          {billboards.length > 0 ? (
            <div className={styles.boardGrid} data-stagger>
              {billboards.map((src, index) => (
                <div key={`${src}-${index}`} className={styles.board}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${pr.billboards.heading}, ${index + 1}`}
                    className="bm-settle"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.boardGrid}>
              {[0, 1].map((index) => (
                <div key={index} className={styles.board}>
                  <div className={styles.emptyTile} style={{ position: "absolute", inset: 0 }}>
                    Photographs coming soon
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
  );

  return (
    <>
      {order.map((key) => (
        <Fragment key={key}>{sections[key] ?? null}</Fragment>
      ))}
    </>
  );
}
