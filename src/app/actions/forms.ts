"use server";

import { submit, type SubmissionKind } from "@/lib/submissions";
import type { FormState } from "@/lib/form-state";

function toObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

async function handle(
  kind: SubmissionKind,
  formData: FormData,
): Promise<FormState> {
  const values = toObject(formData);
  delete values._hp;

  try {
    const result = await submit(kind, toObject(formData));
    if (result.ok) return { status: "ok", errors: {} };
    return {
      status: "error",
      errors: result.errors,
      values,
      message: result.message,
    };
  } catch (error) {
    console.error(`[${kind}] submission failed`, error);
    return {
      status: "error",
      errors: {},
      values,
      message:
        "Something went wrong on our side. Please try again, or email us directly.",
    };
  }
}

export async function submitBrief(_: FormState, formData: FormData) {
  return handle("brief", formData);
}

export async function submitConsultation(_: FormState, formData: FormData) {
  return handle("consultation", formData);
}

export async function submitAcademyApplication(
  _: FormState,
  formData: FormData,
) {
  return handle("academy", formData);
}

export async function submitSummitInterest(_: FormState, formData: FormData) {
  return handle("summit", formData);
}

export async function submitNewsletter(_: FormState, formData: FormData) {
  return handle("newsletter", formData);
}
