import { NextResponse } from "next/server";
import { read } from "@/lib/storage";

/**
 * Serves CMS-uploaded images.
 *
 * These deliberately don't live in `public/`: `next start` reads that directory
 * once at boot, so an image uploaded after the build wouldn't be served until a
 * restart. Reading from disk per request means a new upload is live at once.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Uploads are stored flat, so a nested path is never valid.
  if (segments.length !== 1) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await read(segments[0]);
  if (!file) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      // Filenames carry a random suffix, so a given URL's bytes never change.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
