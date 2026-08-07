"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveContent, type ActionState } from "@/app/admin/actions";
import type { DocSchema, Field, Fields } from "@/lib/content/schema";
import { ImageField, ImagesField } from "./ImagePicker";

type Data = Record<string, unknown>;
type Path = (string | number)[];

/* -- immutable path helpers ------------------------------------------------ */

function getAt(source: unknown, path: Path): unknown {
  return path.reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    return (value as Record<string | number, unknown>)[key];
  }, source);
}

/** Returns a copy of `source` with `path` set to `value`. */
function setAt(source: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [key, ...rest] = path;

  if (typeof key === "number") {
    const array = Array.isArray(source) ? [...source] : [];
    array[key] = setAt(array[key], rest, value);
    return array;
  }

  const object =
    source && typeof source === "object" && !Array.isArray(source)
      ? { ...(source as Data) }
      : {};
  object[key] = setAt(object[key], rest, value);
  return object;
}

/** A fresh, empty row for a repeater, shaped by its field schema. */
function blankItem(fields: Fields): Data {
  const item: Data = {};
  for (const [key, field] of Object.entries(fields)) {
    switch (field.kind) {
      case "list":
      case "images":
        item[key] = [];
        break;
      case "repeater":
        item[key] = [];
        break;
      case "group":
        item[key] = blankItem(field.fields);
        break;
      case "number":
        item[key] = 0;
        break;
      case "boolean":
        item[key] = false;
        break;
      case "select":
        item[key] = field.options[0] ?? "";
        break;
      default:
        item[key] = "";
    }
  }
  return item;
}

/* -- editor ---------------------------------------------------------------- */

export function ContentEditor({
  schema,
  initial,
}: {
  schema: DocSchema;
  initial: Data;
}) {
  const [doc, setDoc] = useState<Data>(initial);
  const [dirty, setDirty] = useState(false);
  const [state, action] = useActionState<ActionState, FormData>(
    saveContent,
    null,
  );
  const [open, setOpen] = useState<string[]>(
    // Open the first section so the page isn't a wall of closed rows.
    schema.sections[0] ? [schema.sections[0].key] : [],
  );

  // A successful save means what's on screen is what's stored.
  useEffect(() => {
    if (state?.tone === "ok") setDirty(false);
  }, [state]);

  const update = (path: Path, value: unknown) => {
    setDoc((current) => setAt(current, path, value) as Data);
    setDirty(true);
  };

  const toggle = (key: string) =>
    setOpen((current) =>
      current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key],
    );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={schema.id} />
      <input type="hidden" name="payload" value={JSON.stringify(doc)} />

      {state ? (
        <div
          className="a-notice"
          data-tone={state.tone}
          role="status"
          style={{ marginBottom: 16 }}
        >
          {state.message}
        </div>
      ) : null}

      {schema.sections.map((section) => {
        const isOpen = open.includes(section.key);
        return (
          <div className="a-section" key={section.key}>
            <button
              type="button"
              className="a-section-head"
              aria-expanded={isOpen}
              onClick={() => toggle(section.key)}
            >
              <span>
                <span className="a-section-title">{section.title}</span>
                {section.note ? (
                  <span className="a-section-note" style={{ display: "block" }}>
                    {section.note}
                  </span>
                ) : null}
              </span>
              <span className="a-sign" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="a-section-body">
                <FieldSet
                  fields={section.fields}
                  path={[section.key]}
                  doc={doc}
                  update={update}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="a-savebar">
        <span className="a-dim" style={{ fontSize: 12.5 }}>
          {dirty
            ? "Unsaved changes."
            : state?.tone === "ok"
              ? "All changes saved."
              : "No changes yet."}
        </span>
        <SaveButton />
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="a-btn a-btn--primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

/* -- field rendering ------------------------------------------------------- */

function FieldSet({
  fields,
  path,
  doc,
  update,
}: {
  fields: Fields;
  path: Path;
  doc: Data;
  update: (path: Path, value: unknown) => void;
}) {
  return (
    <>
      {Object.entries(fields).map(([key, field]) => (
        <FieldView
          key={key}
          field={field}
          path={[...path, key]}
          doc={doc}
          update={update}
        />
      ))}
    </>
  );
}

function FieldView({
  field,
  path,
  doc,
  update,
}: {
  field: Field;
  path: Path;
  doc: Data;
  update: (path: Path, value: unknown) => void;
}) {
  const raw = getAt(doc, path);

  switch (field.kind) {
    case "text":
      return (
        <div className="a-field">
          <label className="a-label">{field.label}</label>
          <input
            className={`a-input ${field.mono ? "a-input--mono" : ""}`}
            value={typeof raw === "string" ? raw : ""}
            onChange={(event) => update(path, event.target.value)}
          />
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "textarea":
      return (
        <div className="a-field">
          <label className="a-label">{field.label}</label>
          <textarea
            className="a-textarea"
            rows={field.rows ?? 3}
            value={typeof raw === "string" ? raw : ""}
            onChange={(event) => update(path, event.target.value)}
          />
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "number":
      return (
        <div className="a-field">
          <label className="a-label">{field.label}</label>
          <input
            className="a-input"
            type="number"
            value={typeof raw === "number" ? raw : 0}
            onChange={(event) => update(path, Number(event.target.value))}
          />
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "boolean":
      return (
        <div className="a-field">
          <label
            className="a-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={raw === true}
              onChange={(event) => update(path, event.target.checked)}
            />
            {field.label}
          </label>
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "select":
      return (
        <div className="a-field">
          <label className="a-label">{field.label}</label>
          <select
            className="a-select"
            value={typeof raw === "string" ? raw : ""}
            onChange={(event) => update(path, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "image":
      return (
        <ImageField
          label={field.label}
          help={field.help}
          ratio={field.ratio}
          value={typeof raw === "string" ? raw : ""}
          onChange={(url) => update(path, url)}
        />
      );

    case "video":
      return (
        <ImageField
          label={field.label}
          help={field.help}
          media="video"
          value={typeof raw === "string" ? raw : ""}
          onChange={(url) => update(path, url)}
        />
      );

    case "images":
      return (
        <ImagesField
          label={field.label}
          help={field.help}
          value={Array.isArray(raw) ? (raw as string[]) : []}
          onChange={(urls) => update(path, urls)}
        />
      );

    case "list":
      return (
        <StringList
          field={field}
          value={Array.isArray(raw) ? (raw as string[]) : []}
          onChange={(next) => update(path, next)}
        />
      );

    case "group":
      return (
        <div className="a-field">
          <label className="a-label">{field.label}</label>
          <div className="a-nest" style={{ marginTop: 4 }}>
            <FieldSet
              fields={field.fields}
              path={path}
              doc={doc}
              update={update}
            />
          </div>
          {field.help ? <p className="a-help">{field.help}</p> : null}
        </div>
      );

    case "repeater":
      return (
        <Repeater
          field={field}
          path={path}
          items={Array.isArray(raw) ? (raw as Data[]) : []}
          doc={doc}
          update={update}
        />
      );
  }
}

function StringList({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="a-field">
      <label className="a-label">{field.label}</label>
      {field.help ? <p className="a-help" style={{ marginBottom: 6 }}>{field.help}</p> : null}

      {value.map((item, index) => (
        <div className="a-listrow" key={index}>
          <textarea
            className="a-textarea"
            rows={item.length > 80 ? 2 : 1}
            style={{ minHeight: 38 }}
            value={item}
            placeholder={field.placeholder}
            onChange={(event) => {
              const next = [...value];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="a-btn a-btn--ghost a-btn--sm"
            onClick={() => move(index, index - 1)}
            disabled={index === 0}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="a-btn a-btn--ghost a-btn--sm"
            onClick={() => move(index, index + 1)}
            disabled={index === value.length - 1}
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            className="a-btn a-btn--ghost a-btn--sm"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}

      <div style={{ marginTop: 9 }}>
        <button
          type="button"
          className="a-btn a-btn--sm"
          onClick={() => onChange([...value, ""])}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

function Repeater({
  field,
  path,
  items,
  doc,
  update,
}: {
  field: Extract<Field, { kind: "repeater" }>;
  path: Path;
  items: Data[];
  doc: Data;
  update: (path: Path, value: unknown) => void;
}) {
  const [collapsed, setCollapsed] = useState<number[]>([]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(path, next);
  };

  return (
    <div className="a-field">
      <label className="a-label">
        {field.label}{" "}
        <span className="a-dim" style={{ fontWeight: 400 }}>
          ({items.length})
        </span>
      </label>
      {field.help ? <p className="a-help">{field.help}</p> : null}

      {items.map((item, index) => {
        const isCollapsed = collapsed.includes(index);
        const title =
          String(item?.[field.titleKey] ?? "").trim() ||
          `${field.itemLabel} ${index + 1}`;

        return (
          <div className="a-item" key={index}>
            <div className="a-item-head">
              <span className="a-item-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="a-item-title">{title}</span>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${field.itemLabel} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${field.itemLabel} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() =>
                  setCollapsed((current) =>
                    isCollapsed
                      ? current.filter((i) => i !== index)
                      : [...current, index],
                  )
                }
                aria-expanded={!isCollapsed}
              >
                {isCollapsed ? "Edit" : "Hide"}
              </button>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                style={{ color: "var(--a-danger)" }}
                onClick={() => {
                  if (
                    !window.confirm(
                      `Delete "${title}"? This can't be undone once you save.`,
                    )
                  ) {
                    return;
                  }
                  update(
                    path,
                    items.filter((_, i) => i !== index),
                  );
                  setCollapsed([]);
                }}
                aria-label={`Delete ${field.itemLabel}`}
              >
                Delete
              </button>
            </div>

            {isCollapsed ? null : (
              <div className="a-item-body">
                <FieldSet
                  fields={field.fields}
                  path={[...path, index]}
                  doc={doc}
                  update={update}
                />
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 11 }}>
        <button
          type="button"
          className="a-btn a-btn--sm"
          onClick={() => update(path, [...items, blankItem(field.fields)])}
        >
          + Add {field.itemLabel.toLowerCase()}
        </button>
      </div>
    </div>
  );
}
