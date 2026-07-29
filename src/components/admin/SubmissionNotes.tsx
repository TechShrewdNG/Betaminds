"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveSubmissionNotes, type ActionState } from "@/app/admin/actions";

export function SubmissionNotes({
  id,
  notes,
}: {
  id: string;
  notes: string;
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    saveSubmissionNotes,
    null,
  );

  return (
    <form action={action} className="a-card">
      <input type="hidden" name="id" value={id} />
      <label className="a-label" htmlFor={`notes-${id}`}>
        Internal notes
      </label>
      <textarea
        id={`notes-${id}`}
        name="notes"
        className="a-textarea"
        rows={4}
        defaultValue={notes}
        placeholder="Who picked this up, what was quoted, what happens next."
      />
      <div className="a-row" style={{ marginTop: 10 }}>
        <SaveNotes />
        {state ? (
          <span
            className="a-dim"
            style={{
              fontSize: 12.5,
              color: state.tone === "ok" ? "var(--a-ok)" : "var(--a-danger)",
            }}
            role="status"
          >
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}

function SaveNotes() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="a-btn a-btn--sm" disabled={pending}>
      {pending ? "Saving…" : "Save note"}
    </button>
  );
}
