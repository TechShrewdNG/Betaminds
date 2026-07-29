"use client";

import { useId } from "react";
import styles from "./form.module.css";

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

export function Field({
  type = "text",
  ...props
}: Common & { type?: "text" | "email" | "tel" | "url" | "date" }) {
  const { name, label, error, required, placeholder, defaultValue, autoComplete } =
    props;
  const { id, errorId } = useFieldIds(name, error);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      />
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function TextareaField({
  rows = 4,
  ...props
}: Common & { rows?: number }) {
  const { name, label, error, required, placeholder, defaultValue } = props;
  const { id, errorId } = useFieldIds(name, error);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        className={styles.textarea}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      />
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function SelectField({
  options,
  ...props
}: Common & { options: string[] }) {
  const { name, label, error, required, defaultValue, placeholder } = props;
  const { id, errorId } = useFieldIds(name, error);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <select
        id={id}
        name={name}
        className={styles.select}
        defaultValue={defaultValue ?? ""}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      >
        <option value="" disabled={required}>
          {placeholder ?? "Select one"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
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
