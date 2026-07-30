"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./form.module.css";

/**
 * Form controls.
 *
 * These hold their own value in React state rather than relying on the DOM's
 * `defaultValue`. React 19 resets an uncontrolled form once its action settles,
 * and while a text input's `defaultValue` survives that, a `<select>` reverts to
 * its first option — so a dropdown the visitor had chosen would silently clear
 * itself every time another field failed validation. Controlled state survives
 * the re-render, so nothing is lost.
 *
 * `defaultValue` still seeds the initial render, which is how deep links
 * (?need=…, ?course=…) and the server's echoed values arrive.
 */

type Common = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
};

function useFieldIds(name: string, error?: string) {
  const base = useId();
  const id = `${base}-${name}`;
  return { id, errorId: error ? `${id}-error` : undefined };
}

/**
 * Keeps a control's DOM value in step with React state after a form reset.
 *
 * React 19 resets the form once its action settles. On the re-render React only
 * writes a `value` prop that *changed*, so a control whose state was already
 * correct never gets re-asserted and silently keeps the browser's reset value.
 * This bites `<select>` hardest: a chosen option reverts to the placeholder, and
 * the next submit sends nothing for a field the visitor had answered.
 */
function useResetGuard<T extends HTMLElement & { value: string }>(value: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (ref.current && ref.current.value !== value) ref.current.value = value;
  });
  return ref;
}

function Label({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {label}
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

function ErrorText({ id, error }: { id?: string; error?: string }) {
  if (!error) return null;
  return (
    <span id={id} className={styles.error} role="alert">
      {error}
    </span>
  );
}

export function Field({
  type = "text",
  ...props
}: Common & { type?: "text" | "email" | "tel" | "url" | "date" }) {
  const { name, label, error, required, placeholder, defaultValue, autoComplete } =
    props;
  const { id, errorId } = useFieldIds(name, error);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useResetGuard<HTMLInputElement>(value);

  return (
    <div className={styles.field}>
      <Label htmlFor={id} label={label} required={required} />
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      />
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

export function TextareaField({
  rows = 4,
  ...props
}: Common & { rows?: number }) {
  const { name, label, error, required, placeholder, defaultValue } = props;
  const { id, errorId } = useFieldIds(name, error);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useResetGuard<HTMLTextAreaElement>(value);

  return (
    <div className={styles.field}>
      <Label htmlFor={id} label={label} required={required} />
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        className={styles.textarea}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      />
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

export function SelectField({
  options,
  ...props
}: Common & { options: string[] }) {
  const { name, label, error, required, defaultValue, placeholder } = props;
  const { id, errorId } = useFieldIds(name, error);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useResetGuard<HTMLSelectElement>(value);

  return (
    <div className={styles.field}>
      <Label htmlFor={id} label={label} required={required} />
      <select
        ref={ref}
        id={id}
        name={name}
        className={styles.select}
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      >
        {/* The placeholder stays selectable. A select whose only selected option
            is disabled has no selection at all, so the browser omits it from the
            submission — an untouched required dropdown would silently disappear
            rather than fail validation with its own message. Emptiness is
            rejected server-side. */}
        <option value="">{placeholder ?? "Select one"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

/** Bot trap. Anything typed in here rejects the submission server-side. */
export function Honeypot() {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor="_hp">Leave this field empty</label>
      <input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
