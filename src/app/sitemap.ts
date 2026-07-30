import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";

/**
 * Sitemap for the six public routes.
 *
 * `lastModified` comes from when the page's content document was last saved in
 * the CMS, so editing copy updates the sitemap without a redeploy. Pages nobody
 * has edited fall back to the build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallback = new Date();

  let edited = new Map<string, Date>();
  try {
    const documents = await prisma.document.findMany({
      select: { id: true, updatedAt: true },
    });
    edited = new Map(documents.map((d) => [d.id, d.updatedAt]));
  } catch {
    // No database yet (a build can run before `prisma db push`). The sitemap is
    // still correct, it just can't be precise about dates.
  }

  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: edited.get(route.doc) ?? fallback,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
