import { getContent, defaults } from "@/lib/content";

/**
 * Blog posts.
 *
 * Entries are content, so nothing here trusts their shape: an entry without a
 * slug or a title can't have a page, and duplicate slugs would make one of
 * them unreachable. Both are dropped rather than rendered broken.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  body: string;
  author: string;
  date: string;
  published: boolean;
};

/** URL-safe segment. Mirrors what the admin's help text tells editors to type. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function normalise(raw: unknown): Post | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const title = str(item.title);
  // Fall back to the title so an entry someone forgot to slug is still reachable.
  const slug = slugify(str(item.slug) || title);
  if (!slug || !title) return null;

  return {
    slug,
    title,
    excerpt: str(item.excerpt),
    coverImage: str(item.coverImage),
    body: str(item.body),
    author: str(item.author),
    date: str(item.date),
    // Absent means published — an editor adding a row shouldn't have to opt in.
    published: item.published !== false,
  };
}

function normaliseAll(raw: unknown): Post[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const posts: Post[] = [];

  for (const entry of raw) {
    const post = normalise(entry);
    if (!post || seen.has(post.slug)) continue;
    seen.add(post.slug);
    posts.push(post);
  }

  return posts;
}

/** Everything an editor has entered, including unpublished drafts. */
export async function allPosts(): Promise<Post[]> {
  const doc = await getContent("blog");
  const posts = normaliseAll(doc.list.items);
  // An emptied list would leave the blog pages blank; fall back to the
  // handoff entries, as the rest of the content layer does.
  return posts.length > 0 ? posts : normaliseAll(defaults.blog.list.items);
}

/** What the public site shows. */
export async function publishedPosts(): Promise<Post[]> {
  return (await allPosts()).filter((post) => post.published);
}

export async function postBySlug(slug: string): Promise<Post | null> {
  const posts = await publishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

/** "Author · Date", skipping either half if it's blank. */
export const postMeta = (post: Post) =>
  [post.author, post.date].filter(Boolean).join(" · ");
