import { NextResponse } from "next/server";
import { handleUploadPresigned } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { ACCEPTED_TYPES, maxBytesFor } from "@/lib/media";

/**
 * Authorises browser-to-Blob uploads.
 *
 * Uploads deliberately do *not* pass through a server action. Vercel caps a
 * serverless function's request body at ~4.5 MB — a limit `bodySizeLimit`
 * can't raise — so routing a background video through one could never work,
 * however generous our own size cap was. Going browser → Blob sidesteps the
 * function entirely, and the file never occupies our compute.
 *
 * This uses the *presigned* flow rather than `handleUpload`. Our Blob store
 * authenticates with OIDC (it injects BLOB_STORE_ID, not a read-write token),
 * and `handleUpload` mints client tokens which the SDK will only derive from a
 * read-write token. `issueSignedToken` resolves credentials the general way,
 * so it works with the OIDC identity the deployment already has — no
 * long-lived secret to store.
 *
 * The signed token is what needs guarding, then: only a signed-in admin gets
 * one, and it's scoped to a single pathname, the content type, and the size we
 * allow, all of which Blob itself enforces.
 */
export async function POST(request: Request) {
  const body = await request.json();

  try {
    const result = await handleUploadPresigned({
      request,
      body,
      getSignedToken: async (pathname, clientPayload, multipart) => {
        // Runs before every upload — this is the authorisation point.
        const session = await getSession();
        if (!session) throw new Error("Not signed in.");

        // The client declares what it's about to send so the token can be
        // scoped to it; Blob rejects anything that doesn't match.
        let contentType = "";
        try {
          contentType = JSON.parse(clientPayload ?? "{}").contentType ?? "";
        } catch {
          // Malformed payload — the check below rejects it.
        }
        if (!ACCEPTED_TYPES.includes(contentType)) {
          throw new Error("That file type isn't supported.");
        }

        const maximumSizeInBytes = maxBytesFor(contentType);
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: [contentType],
          maximumSizeInBytes,
        });

        return {
          token,
          urlOptions: {
            allowedContentTypes: [contentType],
            maximumSizeInBytes,
            addRandomSuffix: false,
            // `pathname` already carries a random suffix of our own, so a
            // repeat upload is a genuine overwrite rather than a collision.
            allowOverwrite: true,
            multipart,
          },
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload could not be authorised.";
    console.error("[media] upload authorisation failed", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
