/**
 * Shared form state for `useActionState`.
 *
 * This lives outside the "use server" action module on purpose: a server-action
 * file may only export async functions, so the initial-state constant has to be
 * imported from somewhere else or it arrives as undefined on the client.
 *
 * `values` echoes back what was submitted. React 19 resets uncontrolled inputs
 * once a form action settles, so without this a validation error would wipe
 * everything the visitor typed — on the eight-part questionnaire especially,
 * that would be unforgivable.
 */
export type FormState = {
  status: "idle" | "ok" | "error";
  errors: Record<string, string>;
  values?: Record<string, string>;
  message?: string;
};

export const emptyFormState: FormState = { status: "idle", errors: {} };

/** `state.values` if the form came back with errors, otherwise the fallback. */
export function held(
  state: FormState,
  key: string,
  fallback = "",
): string | undefined {
  const value = state.values?.[key];
  return value === undefined ? fallback || undefined : value;
}
