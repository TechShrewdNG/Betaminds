import { getContent, defaults } from "@/lib/content";

/**
 * Case-study projects.
 *
 * Entries are content, so nothing here trusts their shape: an entry without a
 * slug or a name can't have a page, and duplicate slugs would make one of them
 * unreachable. Both are dropped rather than rendered broken.
 */

export type Project = {
  slug: string;
  name: string;
  industry: string;
  service: string;
  year: string;
  client: string;
  image: string;
  heroImage: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  results: { n: string; label: string }[];
  gallery: string[];
  video: string;
  quote: string;
  quoteAuthor: string;
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

function normalise(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const name = str(item.name);
  // Fall back to the name so an entry someone forgot to slug is still reachable.
  const slug = slugify(str(item.slug) || name);
  if (!slug || !name) return null;

  const results = Array.isArray(item.results)
    ? item.results
        .map((entry) => {
          const row = (entry ?? {}) as Record<string, unknown>;
          return { n: str(row.n), label: str(row.label) };
        })
        .filter((row) => row.n !== "" || row.label !== "")
    : [];

  return {
    slug,
    name,
    industry: str(item.industry),
    service: str(item.service),
    year: str(item.year),
    client: str(item.client) || name,
    image: str(item.image),
    heroImage: str(item.heroImage) || str(item.image),
    summary: str(item.summary),
    challenge: str(item.challenge),
    approach: str(item.approach),
    outcome: str(item.outcome),
    results,
    gallery: Array.isArray(item.gallery) ? item.gallery.filter(str) : [],
    video: str(item.video),
    quote: str(item.quote),
    quoteAuthor: str(item.quoteAuthor),
    // Absent means published — an editor adding a row shouldn't have to opt in.
    published: item.published !== false,
  };
}

function normaliseAll(raw: unknown): Project[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const projects: Project[] = [];

  for (const entry of raw) {
    const project = normalise(entry);
    if (!project || seen.has(project.slug)) continue;
    seen.add(project.slug);
    projects.push(project);
  }

  return projects;
}

/** Everything an editor has entered, including unpublished drafts. */
export async function allProjects(): Promise<Project[]> {
  const doc = await getContent("projects");
  const projects = normaliseAll(doc.list.items);
  // An emptied list would leave the projects pages blank; fall back to the
  // handoff entries, as the rest of the content layer does.
  return projects.length > 0
    ? projects
    : normaliseAll(defaults.projects.list.items);
}

/** What the public site shows. */
export async function publishedProjects(): Promise<Project[]> {
  return (await allProjects()).filter((project) => project.published);
}

export async function projectBySlug(slug: string): Promise<Project | null> {
  const projects = await publishedProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

/** "Industry · Service", skipping either half if it's blank. */
export const projectMeta = (project: Project) =>
  [project.industry, project.service].filter(Boolean).join(" · ");
