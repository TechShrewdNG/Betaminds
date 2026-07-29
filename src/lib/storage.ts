import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink, stat, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Image storage.
 *
 * Files are written outside `public/` and served by the route handler at
 * src/app/uploads/[...path]/route.ts. That matters: `next start` snapshots the
 * contents of `public/` when it boots, so anything the CMS writes there after a
 * build 404s until the server restarts. A route handler reads from disk per
 * request, so a freshly uploaded image is live immediately.
 *
 * On a platform with an ephemeral filesystem (Vercel's default, for one) swap
 * the body of `put`/`remove`/`read` for a blob store — nothing else in the app
 * sees more than the returned public URL.
 */

const ACCEPTED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/gif",
]);

const MAX_BYTES = 10 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  gif: "image/gif",
};

export type StoredImage = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
};

export function uploadDir() {
  const configured = process.env.UPLOAD_DIR || ".data/uploads";
  return path.isAbsolute(configured)
    ? configured
    : path.join(process.cwd(), configured);
}

/** Turn a filename into something safe and recognisable in the media library. */
function slugify(name: string) {
  return (
    path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

export class UploadError extends Error {}

export async function put(file: File): Promise<StoredImage> {
  if (!ACCEPTED.has(file.type)) {
    throw new UploadError(
      `${file.type || "That file type"} isn't supported. Use JPEG, PNG, WebP, AVIF, GIF or SVG.`,
    );
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("That image is over 10 MB. Please compress it first.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT[file.type] ?? "bin";
  const filename = `${slugify(file.name)}-${randomUUID().slice(0, 8)}.${ext}`;

  let width: number | null = null;
  let height: number | null = null;
  if (file.type !== "image/svg+xml") {
    try {
      const meta = await sharp(buffer).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      // Dimensions are a nicety in the media library, not a reason to fail.
    }
  }

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType: file.type,
    size: file.size,
    width,
    height,
  };
}

export async function remove(url: string) {
  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(uploadDir(), path.basename(url)));
  } catch {
    // Already gone. Removing the database row is what matters.
  }
}

export type ReadResult = { body: Buffer; contentType: string; size: number };

/** Read one stored image by filename, for the /uploads route handler. */
export async function read(filename: string): Promise<ReadResult | null> {
  // Reject anything that isn't a bare filename: no traversal, no nesting.
  if (!/^[A-Za-z0-9._-]+$/.test(filename) || filename.includes("..")) {
    return null;
  }

  const target = path.join(uploadDir(), filename);
  try {
    const info = await stat(target);
    if (!info.isFile()) return null;
    const ext = path.extname(filename).slice(1).toLowerCase();
    return {
      body: await readFile(target),
      contentType: MIME[ext] ?? "application/octet-stream",
      size: info.size,
    };
  } catch {
    return null;
  }
}
