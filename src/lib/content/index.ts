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

/** Content for one document, defaults merged with whatever the admin saved. */
export async function getContent<K extends DocId>(
  id: K,
): Promise<ContentDefaults[K]> {
  const saved = await readDocCached(id);
  return merge(defaults[id], saved);
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
  return merge(defaults[id], saved) as Plain;
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
