import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaults, type ContentDefaults, type DocId } from "./defaults";

export { defaults, DOC_IDS, type DocId } from "./defaults";
export * from "./schema";

const TAG = "content";

type Plain = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Overlay saved content on top of the defaults.
 *
 * Objects merge key by key so a field the editor never touched keeps its handoff
 * copy. Arrays replace wholesale — a repeater is the editor's list, so removing
 * an item has to actually remove it rather than fall back to a default row.
 */
function merge<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(base) || Array.isArray(patch)) return patch as T;
  if (isPlainObject(base) && isPlainObject(patch)) {
    const out: Plain = { ...base };
    for (const [key, value] of Object.entries(patch)) {
      out[key] = key in base ? merge((base as Plain)[key], value) : value;
    }
    return out as T;
  }
  return patch as T;
}

/**
 * Strips the legacy "01 / " index prefix off section eyebrows.
 *
 * The numbering was removed from the defaults, but a document saved in the
 * admin stores its own copy of every field it holds, so any page an editor had
 * already saved kept serving the numbered wording no matter what the defaults
 * said. Rather than leave that stranded until someone retypes eight fields by
 * hand, the prefix is treated as a formatting artefact and dropped on read.
 *
 * Scoped to keys literally named `eyebrow` so it can only ever touch a section
 * label — body copy that happens to start with a number is left alone.
 */
const INDEX_PREFIX = /^\s*\d{1,2}\s*\/\s*/;

function stripSectionNumbering<T>(value: T): T {
  if (typeof value === "string") return value as T;
  if (Array.isArray(value)) return value.map(stripSectionNumbering) as T;
  if (!isPlainObject(value)) return value;

  const out: Plain = {};
  for (const [key, v] of Object.entries(value)) {
    out[key] =
      key === "eyebrow" && typeof v === "string"
        ? v.replace(INDEX_PREFIX, "")
        : stripSectionNumbering(v);
  }
  return out as T;
}

function parse(raw: string | null | undefined): unknown {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    // A hand-edited row shouldn't take the site down; fall back to defaults.
    return undefined;
  }
}

async function readDoc(id: string): Promise<unknown> {
  try {
    const row = await prisma.document.findUnique({ where: { id } });
    return parse(row?.data);
  } catch (error) {
    // The database may not exist yet — a production build often runs before
    // `prisma db push`. Falling back to the defaults means the build still
    // produces the site as designed instead of failing outright.
    console.warn(`[content] could not read "${id}", using defaults.`, error);
    return undefined;
  }
}

const readDocCached = unstable_cache(readDoc, ["content-doc"], { tags: [TAG] });

/**
 * Puts back any nav entry the defaults define that a saved menu is missing.
 *
 * Arrays replace wholesale on merge — deliberately, so removing a repeater row
 * actually removes it. The navigation is the one array where that rule bites:
 * a menu saved in the admin is a frozen copy of the routes that existed the day
 * it was saved, so adding a page to the site leaves it unreachable from every
 * menu until someone retypes the row by hand. That is how /pr shipped with no
 * way to get to it.
 *
 * Matching is on href, so an editor's own ordering, renaming and extra links
 * all survive — a missing route is appended after its neighbour in the
 * defaults, or at the end.
 *
 * The trade-off, stated plainly: a default route cannot be deleted from the
 * menu in the admin, because this puts it back. Say the word and the schema
 * grows a "hidden" toggle for that; until it does, the defaults decide which
 * routes exist and the CMS decides what they are called and in what order.
 */
type NavItem = { label: string; href: string };

function withMissingRoutes(saved: unknown): unknown {
  if (!isPlainObject(saved)) return saved;
  const nav = saved.nav;
  if (!isPlainObject(nav) || !Array.isArray(nav.items)) return saved;

  const items = nav.items as NavItem[];
  const hrefs = new Set(
    items.map((item) => (isPlainObject(item) ? String(item.href ?? "") : "")),
  );
  const fallback = defaults.global.nav.items as readonly NavItem[];
  if (fallback.every((item) => hrefs.has(item.href))) return saved;

  const merged = [...items];
  for (const [index, item] of fallback.entries()) {
    if (hrefs.has(item.href)) continue;
    // Slot it in beside whichever neighbour the saved menu still has, so a new
    // route lands where the defaults put it rather than always at the end.
    const before = fallback[index - 1]?.href;
    const at = before ? merged.findIndex((m) => m.href === before) : -1;
    if (at === -1) merged.push({ ...item });
    else merged.splice(at + 1, 0, { ...item });
  }

  return { ...saved, nav: { ...nav, items: merged } };
}

/** Content for one document, defaults merged with whatever the admin saved. */
export async function getContent<K extends DocId>(
  id: K,
): Promise<ContentDefaults[K]> {
  const saved = await readDocCached(id);
  const patched = id === "global" ? withMissingRoutes(saved) : saved;
  return stripSectionNumbering(merge(defaults[id], patched));
}

/** Site-wide chrome. Every page needs it, so it gets its own helper. */
export function getGlobal() {
  return getContent("global");
}

/** The raw saved patch for a document — used by the admin form, not the site. */
export async function getRawDoc(id: string): Promise<Plain> {
  const saved = await readDoc(id);
  return isPlainObject(saved) ? saved : {};
}

/** Defaults merged with the saved patch, for pre-filling the admin form. */
export async function getMergedDoc(id: DocId): Promise<Plain> {
  const saved = await readDoc(id);
  // Normalised here too, so the admin form shows the same wording the site
  // serves rather than re-saving the stale numbering straight back in.
  return stripSectionNumbering(merge(defaults[id], saved)) as Plain;
}

export async function saveDoc(id: DocId, data: Plain, updatedBy?: string) {
  const serialised = JSON.stringify(data);
  await prisma.document.upsert({
    where: { id },
    create: { id, data: serialised, updatedBy },
    update: { data: serialised, updatedBy },
  });
  revalidateTag(TAG);
}

export function revalidateContent() {
  revalidateTag(TAG);
}
