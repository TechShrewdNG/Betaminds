"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  requireSession,
  verifyCredentials,
} from "@/lib/auth";
import { saveDoc, revalidateContent, DOC_IDS, type DocId } from "@/lib/content";
import { remove } from "@/lib/storage";
import { ACCEPTED_TYPES, maxBytesFor } from "@/lib/media";
import { STATUSES } from "@/lib/submissions";

export type ActionState = { tone: "ok" | "error"; message: string } | null;

/* -- auth ------------------------------------------------------------------ */

export async function login(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { tone: "error", message: "Enter your email and password." };
  }

  const session = await verifyCredentials(email, password);
  if (!session) {
    return { tone: "error", message: "Those details don't match an account." };
  }

  await createSession(session);
  // Only allow same-app destinations, so ?next= can't be used to bounce
  // someone off-site after a successful login.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) {
    return {
      tone: "error",
      message: "Use at least 10 characters for the new password.",
    };
  }
  if (next !== confirm) {
    return { tone: "error", message: "The new passwords don't match." };
  }

  const ok = await verifyCredentials(session.email, current);
  if (!ok) {
    return { tone: "error", message: "Your current password is wrong." };
  }

  await prisma.adminUser.update({
    where: { id: session.userId },
    data: { passwordHash: await hashPassword(next) },
  });

  return { tone: "ok", message: "Password changed." };
}

/* -- content --------------------------------------------------------------- */

/**
 * Save one content document.
 *
 * The editor keeps the whole document in client state and posts it as JSON, so
 * repeaters, nesting and deletions all round-trip without having to encode
 * structure into form field names.
 */
export async function saveContent(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const id = String(formData.get("id") ?? "");
  const payload = String(formData.get("payload") ?? "");

  if (!DOC_IDS.includes(id as DocId)) {
    return { tone: "error", message: "Unknown page." };
  }

  let data: unknown;
  try {
    data = JSON.parse(payload);
  } catch {
    return { tone: "error", message: "Couldn't read the submitted content." };
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { tone: "error", message: "Couldn't read the submitted content." };
  }

  await saveDoc(id as DocId, data as Record<string, unknown>, session.email);
  revalidatePath("/", "layout");

  return { tone: "ok", message: "Saved. The live site is updated." };
}

/* -- media ----------------------------------------------------------------- */

export type UploadResult =
  | {
      ok: true;
      asset: {
        id: string;
        url: string;
        filename: string;
        alt: string;
        width: number | null;
        height: number | null;
      };
    }
  | { ok: false; message: string };

/**
 * Records an upload the browser has already sent straight to Vercel Blob.
 *
 * The bytes never reach us — see src/app/api/media/upload/route.ts for why —
 * so this only writes the row. Everything it's told is re-checked: the token
 * endpoint gates who may upload, but nothing stops a signed-in admin posting a
 * different URL here afterwards.
 */
export async function registerUpload(input: {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
}): Promise<UploadResult> {
  await requireSession();

  if (!ACCEPTED_TYPES.includes(input.mimeType)) {
    return { ok: false, message: "That file type isn't supported." };
  }
  if (input.size > maxBytesFor(input.mimeType)) {
    return { ok: false, message: "That file is too large." };
  }
  // Only ever our own store, so this can't be pointed at somewhere arbitrary.
  if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(input.url)) {
    return { ok: false, message: "That upload URL isn't recognised." };
  }

  try {
    const asset = await prisma.mediaAsset.create({
      data: {
        url: input.url,
        filename: input.filename,
        mimeType: input.mimeType,
        size: input.size,
        width: input.width,
        height: input.height,
      },
    });
    revalidatePath("/admin/media");
    return {
      ok: true,
      asset: {
        id: asset.id,
        url: asset.url,
        filename: asset.filename,
        alt: asset.alt,
        width: asset.width,
        height: asset.height,
      },
    };
  } catch (error) {
    console.error("[media] could not record upload", error);
    return { ok: false, message: "Upload failed. Please try again." };
  }
}

export async function updateImageAlt(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").slice(0, 300);

  await prisma.mediaAsset.update({ where: { id }, data: { alt } });
  revalidatePath("/admin/media");
}

export async function deleteImage(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  // The file goes, but any page still pointing at this URL keeps its reference —
  // that shows up as a broken image rather than silently blanking the page, which
  // is the more honest failure.
  await prisma.mediaAsset.delete({ where: { id } });
  await remove(asset.url);
  revalidatePath("/admin/media");
  revalidateContent();
}

/* -- submissions ----------------------------------------------------------- */

export async function setSubmissionStatus(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;

  await prisma.submission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin");
}

export async function saveSubmissionNotes(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);

  await prisma.submission.update({ where: { id }, data: { notes } });
  revalidatePath(`/admin/submissions/${id}`);
  return { tone: "ok", message: "Note saved." };
}

export async function deleteSubmission(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  await prisma.submission.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  redirect("/admin/submissions");
}
