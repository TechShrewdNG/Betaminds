"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { login, type ActionState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(login, null);
  const next = useSearchParams().get("next") ?? "/admin";

  return (
    <form action={action}>
      <input type="hidden" name="next" value={next} />

      {state ? (
        <div
          className="a-notice"
          data-tone={state.tone}
          role="alert"
          style={{ marginBottom: 16 }}
        >
          {state.message}
        </div>
      ) : null}

      <div className="a-field">
        <label className="a-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="a-input"
          autoComplete="username"
          required
          autoFocus
        />
      </div>

      <div className="a-field">
        <label className="a-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="a-input"
          autoComplete="current-password"
          required
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Submit />
      </div>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="a-btn a-btn--primary"
      disabled={pending}
      style={{ width: "100%" }}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
