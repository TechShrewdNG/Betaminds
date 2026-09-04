/**
 * The site's canonical origin.
 *
 * Used for `metadataBase` (so Open Graph and canonical URLs resolve absolutely),
 * the sitemap and robots.txt. Set SITE_URL in the environment per deployment;
 * Vercel's VERCEL_PROJECT_PRODUCTION_URL is picked up automatically on preview
 * and production builds.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "https://betaminds.africa";
}

export const SITE_URL = resolveSiteUrl();

/** The public routes, in navigation order. */
export const PUBLIC_ROUTES = [
  // `/` is the splash screen and `/home` the homepage proper. Both are
  // indexable: the splash is the entry point, the homepage carries the copy.
  { path: "/", doc: "home", priority: 1 },
  { path: "/home", doc: "home", priority: 0.9 },
  { path: "/digital-ecosystem", doc: "ecosystem", priority: 0.9 },
  { path: "/media-services", doc: "media", priority: 0.9 },
  { path: "/academy", doc: "academy", priority: 0.9 },
  { path: "/summit", doc: "summit", priority: 0.8 },
  { path: "/projects", doc: "projects", priority: 0.8 },
  { path: "/blog", doc: "blog", priority: 0.8 },
  { path: "/lets-work", doc: "work", priority: 0.8 },
] as const;
