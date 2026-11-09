"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ui.module.css";

/**
 * Just the fields the grid and its filter actually use — kept separate from
 * `@/lib/blog`'s `Post` so this stays a plain client component with no
 * import of that server-side module (it pulls in Prisma).
 */
export type BlogGridPost = {
  slug: string;
  title: string;
  coverImage: string;
  author: string;
  date: string;
  category: string;
};

/** "Author · Date", skipping either half if it's blank. Mirrors lib/blog.ts's postMeta. */
const meta = (post: BlogGridPost) =>
  [post.author, post.date].filter(Boolean).join(" · ");

const norm = (value: string) => value.trim().toLowerCase();

/**
 * The blog index's post grid, with a category filter above it.
 *
 * Filter pills come from `categories` (the admin-managed list, in the order
 * entered) rather than being scanned off the posts themselves, so the studio
 * controls which names appear and in what order. A category with nothing
 * published under it is left out — a pill that always shows zero posts is
 * worse than one less pill. Matching against a post's own `category` is
 * case/whitespace-insensitive, so "brand" and "Brand " both count.
 */
export function BlogGrid({
  posts,
  categories,
  readLabel,
  allLabel = "All",
}: {
  posts: BlogGridPost[];
  categories: string[];
  readLabel: string;
  allLabel?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const availableCategories = useMemo(
    () =>
      categories.filter((category) =>
        posts.some((post) => norm(post.category) === norm(category)),
      ),
    [categories, posts],
  );

  const visible = useMemo(
    () =>
      active
        ? posts.filter((post) => norm(post.category) === norm(active))
        : posts,
    [posts, active],
  );

  return (
    <>
      {availableCategories.length > 0 ? (
        <div
          className="row-wrap mb-34"
          style={{ gap: 9 }}
          role="group"
          aria-label="Filter posts by category"
        >
          <button
            type="button"
            className={`pill pill--sm ${active === null ? "pill--accent" : "pill--outline"}`}
            onClick={() => setActive(null)}
            aria-pressed={active === null}
          >
            {allLabel}
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`pill pill--sm ${active === category ? "pill--accent" : "pill--outline"}`}
              onClick={() => setActive(category)}
              aria-pressed={active === category}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid col3 carousel-mobile">
        {visible.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.tile}>
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
              <div className={styles.workMeta}>{meta(post)}</div>
              <div className={styles.workName}>{post.title}</div>
              <span className={styles.workView}>{readLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
