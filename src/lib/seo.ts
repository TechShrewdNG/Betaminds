import type { Metadata } from "next";

/**
 * Metadata builders.
 *
 * Next.js does *not* deep-merge `openGraph` or `twitter` from a parent layout:
 * a page that sets either one replaces the whole object. So every card field a
 * page needs — image included — has to be built here rather than inherited, or
 * pages silently ship without an og:image.
 */

export const SITE_NAME = "Betaminds Africa";

export const DEFAULT_TITLE =
  "Betaminds Africa — We add the spark that makes brands move";

export const DEFAULT_DESCRIPTION =
  "A Lagos creative and digital commerce agency. We build brands, the digital commerce systems behind them, and the people who run both.";

/**
 * The share card, generated from the logo lockup by `npm run icons`. Composed
 * from artwork rather than rendered type, so no font is fetched at build time.
 */
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Betaminds Africa — community for creative professionals",
};

type Seo = { title: string; description: string };

function card(seo: Seo, path: string): Metadata {
  return {
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_NG",
      url: path,
      title: seo.title,
      description: seo.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [OG_IMAGE.url],
    },
  };
}

/** Root layout defaults. Pages override the title, description and URL. */
export function rootMetadata(siteUrl: string): Metadata {
  const seo = { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  return {
    // Makes the relative URLs above resolve absolutely.
    metadataBase: new URL(siteUrl),
    title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    alternates: { canonical: "/" },
    ...card(seo, "/"),
  };
}

/** Per-page metadata, driven by the CMS's "Search & social" fields. */
export function pageMetadata(seo: Seo, path: string): Metadata {
  return {
    // These titles already read as full sentences, so opt out of the
    // "· Betaminds Africa" template rather than doubling the brand name.
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    ...card(seo, path),
  };
}
