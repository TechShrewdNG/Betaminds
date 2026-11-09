"use client";

import { useFormStatus } from "react-dom";
import styles from "./form.module.css";

export function SubmitButton({
  label,
  pendingLabel = "Sending…",
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className={styles.submitRow}>
      <button
        type="submit"
        className="pill pill--accent"
        disabled={pending}
        style={pending ? { opacity: 0.7, cursor: "progress" } : undefined}
      >
        {pending ? pendingLabel : label}
      </button>
      {pending ? (
        <span className={styles.pending} role="status">
          Don&rsquo;t refresh — we&rsquo;re saving your details.
        </span>
      ) : null}
    </div>
  );
}

export function FormNotice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className={styles.notice} role="alert">
      {message}
    </div>
  );
}

export function SuccessPanel({
  heading,
  body,
  /** True when `body` is admin-authored HTML from a rich text field — see
   *  AcademyForm, the one caller that currently sets this. Every other
   *  caller's success body is still plain text, rendered as before. */
  bodyIsHtml,
  children,
}: {
  heading: string;
  body: string;
  bodyIsHtml?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.success} role="status">
      <h3 className={styles.successHeading}>{heading}</h3>
      {bodyIsHtml ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
      ) : (
        <p className={styles.successBody}>{body}</p>
      )}
      {children ? <div className={styles.successActions}>{children}</div> : null}
    </div>
  );
}
