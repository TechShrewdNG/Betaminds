import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedPosts, postBySlug, postMeta } from "@/lib/blog";

/** Pre-renders every published post at build time. */
export async function generateStaticParams() {
  const posts = await publishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await postBySlug(slug);
  if (!post) return { title: "Post not found" };

  return pageMetadata(
    { title: post.title, description: post.excerpt },
    `/blog/${post.slug}`,
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, doc, posts] = await Promise.all([
    postBySlug(slug),
    getContent("blog"),
    publishedPosts(),
  ]);

  if (!post) notFound();
  const { detail } = doc;

  // Wraps around, so the last post points back at the first.
  const position = posts.findIndex((entry) => entry.slug === post.slug);
  const next = posts[(position + 1) % posts.length];

  return (
    <>
      <section className="hero">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="hero__img"
            fetchPriority="high"
          />
        ) : null}
        <div className="hero__wash" />
        <div className="shell hero__body">
          <div className="bm-rise" style={{ maxWidth: 820 }}>
            <Link
              href="/blog"
              className="eyebrow eyebrow--tight mb-22"
              style={{ display: "inline-block" }}
            >
              ← {detail.backLabel}
            </Link>
            <h1 className="h1" style={{ lineHeight: 1.02, marginBottom: 20 }}>
              {post.title}
            </h1>
            {postMeta(post) ? (
              <p className="lead measure-620">{postMeta(post)}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section data-reveal className="band band--ruled">
        <div className="shell section col-820">
          {post.excerpt ? (
            <p
              className="quote"
              style={{
                lineHeight: 1.4,
                color: "var(--ink-94)",
                margin: "0 0 34px",
                textWrap: "pretty",
              }}
            >
              {post.excerpt}
            </p>
          ) : null}
          {/* Paragraph breaks come from blank lines in the CMS textarea. */}
          {post.body.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index} className="body" style={{ marginBottom: 18 }}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section data-reveal className="band band--ink band--ruled">
        <div className="shell section">
          <div className="grid col2 col2--tight">
            {next && next.slug !== post.slug ? (
              <Link
                href={`/blog/${next.slug}`}
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
                  {next.title}
                </div>
                <div className="card-body">{postMeta(next)}</div>
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
        </div>
      </section>
    </>
  );
}
