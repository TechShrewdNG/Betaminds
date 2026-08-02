import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";
import { ACCEPTED_TYPES, maxBytesFor } from "@/lib/media";

/**
 * Issues short-lived tokens so the browser can upload straight to Vercel Blob.
 *
 * Uploads deliberately do *not* pass through a server action. Vercel caps a
 * serverless function's request body at ~4.5 MB — a limit `bodySizeLimit`
 * can't raise — so routing a background video through one could never work,
 * however generous our own size cap was. Going browser → Blob sidesteps the
 * function entirely, and the file never occupies our compute.
 *
 * The token is what needs guarding, then: only a signed-in admin gets one, and
 * it's scoped to the content types and size we allow.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Runs before every upload — this is the authorisation point.
        const session = await getSession();
        if (!session) throw new Error("Not signed in.");

        // The client tells us what it's about to send so the token can be
        // scoped to it; Blob enforces both for us.
        let contentType = "";
        try {
          contentType = JSON.parse(clientPayload ?? "{}").contentType ?? "";
        } catch {
          // Malformed payload — fall through to the check below.
        }
        if (!ACCEPTED_TYPES.includes(contentType)) {
          throw new Error("That file type isn't supported.");
        }

        return {
          allowedContentTypes: [contentType],
          maximumSizeInBytes: maxBytesFor(contentType),
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // The database row is written by `registerUpload` once the browser
        // confirms the upload, so there's nothing to do here. Blob can't reach
        // localhost anyway, and relying on this hook would make uploads work
        // in production but silently not in development.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be authorised.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
