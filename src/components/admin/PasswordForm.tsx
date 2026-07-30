"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, type ActionState } from "@/app/admin/actions";

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(
    changePassword,
    null,
  );

  return (
    <form action={action}>
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
        <label className="a-label" htmlFor="current">
          Current password
        </label>
        <input
          id="current"
          name="current"
          type="password"
          className="a-input"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="a-field">
        <label className="a-label" htmlFor="next">
          New password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          className="a-input"
          autoComplete="new-password"
          minLength={10}
          required
        />
        <p className="a-help">At least 10 characters.</p>
      </div>

      <div className="a-field">
        <label className="a-label" htmlFor="confirm">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          className="a-input"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </div>

      <div style={{ marginTop: 18 }}>
        <Submit />
      </div>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="a-btn a-btn--primary" disabled={pending}>
      {pending ? "Changing…" : "Change password"}
    </button>
  );
}
