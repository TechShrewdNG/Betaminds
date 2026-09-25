import "server-only";
import { del as blobDel } from "@vercel/blob";

/**
 * Media storage: Vercel Blob.
 *
 * Uploads don't go through here — the browser sends them straight to Blob (see
 * src/app/api/media/upload/route.ts for why), so the only server-side
 * operation left is deletion. Nothing in the app sees more than the public URL
 * stored on the MediaAsset row.
 *
 * Needs a Blob store connected to the project (Vercel dashboard → Storage →
 * Create Database → Blob), which injects BLOB_READ_WRITE_TOKEN the same way
 * the Postgres integration injects DATABASE_URL.
 */
export async function remove(url: string) {
  try {
    await blobDel(url);
  } catch {
    // Already gone. Removing the database row is what matters.
  }
}
