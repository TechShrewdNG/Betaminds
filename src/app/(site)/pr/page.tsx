import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PlanCards } from "@/components/ui/PlanCards";
import { IndexHero, IndexContents } from "@/components/ui/IndexHero";
import { SplitText } from "@/components/ui/SplitText";
import { Icon } from "@/components/ui/Icon";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("pr");
  return pageMetadata(seo, "/pr");
}

export default async function PrPage() {
  const pr = await getContent("pr");

  // Each of the showcase sections is only worth a band once there is something
  // in it. A magazine with no PDF is a button that goes nowhere, and an empty
  // billboard grid is a heading over a gap.
  const magazineReady = pr.magazine.cover !== "" && pr.magazine.pdf !== "";
  const press = pr.press.items.filter((item) => item.cover !== "");
  const billboards = pr.billboards.images.filter((src) => src !== "");

  return (
    <>
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
              { href: "#special", text: pr.special.heading },
              { href: "#events", text: pr.event.heading },
              ...(magazineReady
                ? [{ href: "#magazine", text: pr.magazine.eyebrow }]
                : []),
              ...(press.length > 0
                ? [{ href: "#press", text: pr.press.heading }]
                : []),
              ...(billboards.length > 0
                ? [{ href: "#billboards", text: pr.billboards.heading }]
                : []),
            ]}
          />
        }
      />

      {/* Monthly retainers, set as the Digital Marketplace plans are. */}
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
            ctaHref={(plan) =>
              `/lets-work?need=${encodeURIComponent(`PR — ${plan.name}`)}`
            }
          />
        </div>
      </section>

      {/* The launch package and executive PR, which are not monthly. */}
      <section id="special" data-reveal className="band band--ruled">
        <div className="shell section">
          <h2 className="h2 mb-18">
            <SplitText text={pr.special.heading} />
          </h2>
          <p className="body measure-620 mb-34">{pr.special.lead}</p>
          <PlanCards
            plans={pr.special.items}
            featuredIndex={-1}
            columns={2}
            selectLabel={pr.packages.selectLabel}
            bestForLabel={pr.packages.bestForLabel}
            ctaHref={(plan) =>
              `/lets-work?need=${encodeURIComponent(`PR — ${plan.name}`)}`
            }
          />
        </div>
      </section>

      {/* Event PR and coverage. */}
      <section id="events" data-reveal className="band band--alt band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow mb-22">{pr.event.eyebrow}</div>
              <h2 className="h2" style={{ marginBottom: 16 }}>
                <SplitText text={pr.event.heading} />
              </h2>
              <p className="body measure-520" style={{ margin: 0 }}>
                {pr.event.body}
              </p>
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

      {/* The Pinnacle Magazine. */}
      {magazineReady ? (
        <section id="magazine" data-reveal className="band band--ink band--ruled">
          <div className="shell section">
            <div className={styles.magGrid}>
              <div className={styles.magCover}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pr.magazine.cover}
                  alt={pr.magazine.coverAlt}
                  className="bm-settle"
                  loading="lazy"
                />
              </div>

              <div>
                <div className="eyebrow mb-22">{pr.magazine.eyebrow}</div>
                <h2 className="h2" style={{ marginBottom: 16 }}>
                  <SplitText text={pr.magazine.heading} />
                </h2>
                <p className="body measure-520" style={{ marginBottom: 30 }}>
                  {pr.magazine.body}
                </p>
                <a
                  href={pr.magazine.pdf}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="pill pill--accent pill--lg"
                >
                  {pr.magazine.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Press features. */}
      {press.length > 0 ? (
        <section id="press" data-reveal className="band band--ruled">
          <div className="shell section">
            <h2 className="h2 mb-18">
              <SplitText text={pr.press.heading} />
            </h2>
            <p className="body measure-620 mb-34">{pr.press.lead}</p>

            <div className="grid col4 carousel-mobile" data-stagger>
              {press.map((item, index) => (
                <div key={`${item.title}-${index}`} className={styles.pressCard}>
                  <div className={styles.pressCover}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="bm-settle"
                      loading="lazy"
                    />
                  </div>
                  {item.title ? (
                    <div className={styles.pressTitle}>{item.title}</div>
                  ) : null}
                  {/* No link, no button — the cover still earns its place as
                      evidence, but a dead CTA would not. */}
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={styles.pkgLink}
                    >
                      {pr.press.readLabel} <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Billboards. Landscape, and deliberately without links. */}
      {billboards.length > 0 ? (
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
          </div>
        </section>
      ) : null}
    </>
  );
}
