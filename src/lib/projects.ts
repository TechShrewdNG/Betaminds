import { getContent, defaults } from "@/lib/content";

/**
 * Case-study projects.
 *
 * There is no longer a page per project — a tile on the grid opens the PDF
 * uploaded for it instead. `key` exists only so React and the de-duplication
 * below have a stable identity per entry; it is derived from the name, not
 * editable, and never appears in a URL.
 *
 * Entries are content, so nothing here trusts their shape: an entry without a
 * name can't have a tile, and two entries that reduce to the same key would
 * make one of them invisible. Both are dropped rather than rendered broken.
 */

export type Project = {
  key: string;
  name: string;
  industry: string;
  service: string;
  year: string;
  client: string;
  image: string;
  heroImage: string;
  pdf: string;
  published: boolean;
};

/** Collision-safe internal identifier. Never shown or linked to. */
function keyify(value: string) {
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
  const key = keyify(name);
  if (!key || !name) return null;

  return {
    key,
    name,
    industry: str(item.industry),
    service: str(item.service),
    year: str(item.year),
    client: str(item.client) || name,
    image: str(item.image),
    heroImage: str(item.heroImage) || str(item.image),
    pdf: str(item.pdf),
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
    if (!project || seen.has(project.key)) continue;
    seen.add(project.key);
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

/** "Industry · Service", skipping either half if it's blank. */
export const projectMeta = (project: Project) =>
  [project.industry, project.service].filter(Boolean).join(" · ");
