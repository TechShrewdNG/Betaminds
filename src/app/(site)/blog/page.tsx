import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publishedPosts } from "@/lib/blog";
import { IndexHero, IndexFacts } from "@/components/ui/IndexHero";
import { BlogGrid } from "@/components/ui/BlogGrid";

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

  // Newest post supplies the hero photograph; the archive supplies the rail.
  const latest = posts[0];

  return (
    <>
      <IndexHero
        image={latest?.coverImage}
        eyebrow={index.eyebrow}
        heading={index.heading}
        accentTail={index.accentTail}
        lead={index.lead}
        rail={
          posts.length > 0 ? (
            <IndexFacts
              items={[
                { value: String(posts.length), label: "Posts" },
                { value: latest?.date ?? "", label: "Latest" },
              ].filter((item) => item.value !== "")}
            />
          ) : null
        }
      />

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
            <BlogGrid
              posts={posts}
              categories={doc.categories.items.filter(Boolean)}
              readLabel={index.readLabel}
            />
          )}
        </div>
      </section>
    </>
  );
}
