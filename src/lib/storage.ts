import "server-only";
import { randomUUID } from "node:crypto";
import { put as blobPut, del as blobDel } from "@vercel/blob";
import path from "node:path";
import sharp from "sharp";

/**
 * Image storage: Vercel Blob. Nothing else in the app sees more than the
 * public URL `put()` returns, stored as-is on the MediaAsset row.
 *
 * Needs a Blob store connected to the project (Vercel dashboard → Storage →
 * Create Database → Blob), which injects BLOB_READ_WRITE_TOKEN the same way
 * the Postgres integration injects DATABASE_URL.
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

export type StoredImage = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
};

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

  const blob = await blobPut(filename, buffer, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    filename,
    mimeType: file.type,
    size: file.size,
    width,
    height,
  };
}

export async function remove(url: string) {
  try {
    await blobDel(url);
  } catch {
    // Already gone. Removing the database row is what matters.
  }
}
