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

/**
 * Keeps a group of radio/checkbox inputs in step with React state after a
 * form reset, the same problem `useResetGuard` solves for a single control —
 * see that function's comment. A native form reset touches every input in
 * the group directly, so each one needs re-asserting, not just one node.
 */
function useGroupResetGuard(sync: (container: HTMLDivElement) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) sync(ref.current);
  });
  return ref;
}

const slugify = (value: string, index: number) =>
  `opt${index}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`;

/** A single-choice question rendered as visible options rather than a dropdown. */
export function RadioGroupField({
  options,
  ...props
}: Common & { options: string[] }) {
  const { name, label, error, required, defaultValue } = props;
  const { id, errorId } = useFieldIds(name, error);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useGroupResetGuard((container) => {
    container
      .querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach((input) => {
        const shouldBeChecked = input.value === value;
        if (input.checked !== shouldBeChecked) input.checked = shouldBeChecked;
      });
  });

  return (
    <fieldset className={`${styles.field} ${styles.fieldset}`}>
      <legend className={styles.label} id={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>
      <div
        ref={ref}
        className={styles.optionGroup}
        role="radiogroup"
        aria-labelledby={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      >
        {options.map((option, index) => {
          const optionId = `${id}-${slugify(option, index)}`;
          return (
            <label key={option} className={styles.option} htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option}
                required={required}
                checked={value === option}
                onChange={() => setValue(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      <ErrorText id={errorId} error={error} />
    </fieldset>
  );
}

/**
 * A "select all that apply" question. Submitted as one comma-joined string
 * under a single field key, via a hidden input, so it fits the same
 * one-string-per-answer model as every other field — a set of checkboxes
 * sharing one `name` would instead arrive as several same-named form fields,
 * clobbering down to the last one by the time it reaches a plain object.
 */
export function CheckboxGroupField({
  options,
  ...props
}: Common & { options: string[] }) {
  const { name, label, error, required, defaultValue } = props;
  const { id, errorId } = useFieldIds(name, error);
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        (defaultValue ?? "")
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
  );
  const value = Array.from(selected).join(", ");
  const hiddenRef = useResetGuard<HTMLInputElement>(value);
  const ref = useGroupResetGuard((container) => {
    container
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((input) => {
        const shouldBeChecked = selected.has(input.value);
        if (input.checked !== shouldBeChecked) input.checked = shouldBeChecked;
      });
  });

  function toggle(option: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }

  return (
    <fieldset className={`${styles.field} ${styles.fieldset}`}>
      <legend className={styles.label} id={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={value} />
      <div
        ref={ref}
        className={styles.optionGroup}
        role="group"
        aria-labelledby={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      >
        {options.map((option, index) => {
          const optionId = `${id}-${slugify(option, index)}`;
          return (
            <label key={option} className={styles.option} htmlFor={optionId}>
              <input
                id={optionId}
                type="checkbox"
                value={option}
                checked={selected.has(option)}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      <ErrorText id={errorId} error={error} />
    </fieldset>
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
