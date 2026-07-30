import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The CMS is behind auth anyway, but there's no reason to have crawlers
      // knocking on it. /uploads stays crawlable so photography can be indexed.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
