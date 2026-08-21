import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedPosts, postMeta } from "@/lib/blog";
import styles from "@/components/ui/ui.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("blog");
  return pageMetadata(seo, "/blog");
}

export default async function BlogPage() {
  const [doc, posts] = await Promise.all([
    getContent("blog"),
    publishedPosts(),
  ]);
  const { index } = doc;

  return (
    <>
      <section
        style={{
          background: "var(--surface-deep)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="shell bm-rise" style={{ paddingTop: 130, paddingBottom: 72 }}>
          <div className="eyebrow mb-22">{index.eyebrow}</div>
          <h1 className="h1" style={{ marginBottom: 20 }}>
            {index.heading}
            <span className="accent-word">{index.accentTail}</span>
          </h1>
          <p className="lead measure-620">{index.lead}</p>
        </div>
      </section>

      <section data-reveal className="band band--ruled">
        <div className="shell section">
          {posts.length === 0 ? (
            <div
              className="panel"
              style={{ textAlign: "center", padding: "72px 32px" }}
            >
              <p className="body measure-520" style={{ margin: "0 auto 26px" }}>
                {index.emptyMessage}
              </p>
              <Link href="/lets-work" className="pill pill--accent">
                Let&rsquo;s work →
              </Link>
            </div>
          ) : (
            <div className="grid col3 carousel-mobile">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.tile}
                >
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
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
                    <div className={styles.workMeta}>{postMeta(post)}</div>
                    <div className={styles.workName}>{post.title}</div>
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
