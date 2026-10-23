"use client";

import { useEffect, useRef } from "react";

/**
 * A small WYSIWYG editor for post bodies, built on `contentEditable` rather
 * than a dependency — the rest of the admin is hand-rolled the same way.
 *
 * Uncontrolled by design: the DOM owns the content once mounted, and `value`
 * only seeds it on first render. Re-syncing `innerHTML` from React state on
 * every keystroke (the "controlled" approach) would reset the caret to the
 * start of the field after each character, since the browser — not React —
 * is the one mutating the DOM here.
 *
 * Paste is forced to plain text. `contentEditable` otherwise accepts
 * whatever markup the clipboard carries (styles, stray script-bearing markup
 * from a compromised source, etc.), and the only HTML this field should ever
 * hold is what the toolbar below produces.
 */
export function RichTextField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef(value);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initial.current;
    // Seeded once, deliberately — see the component comment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const link = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  };

  return (
    <div className="a-field">
      <label className="a-label">{label}</label>

      <div className="a-rte-toolbar" role="toolbar" aria-label={`${label} formatting`}>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")} aria-label="Bold">
          <strong>B</strong>
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")} aria-label="Italic">
          <em>i</em>
        </button>
        <span className="a-rte-sep" aria-hidden="true" />
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "h2")} aria-label="Heading 2">
          H2
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "h3")} aria-label="Heading 3">
          H3
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "p")} aria-label="Paragraph">
          ¶
        </button>
        <span className="a-rte-sep" aria-hidden="true" />
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")} aria-label="Bullet list">
          • List
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertOrderedList")} aria-label="Numbered list">
          1. List
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("formatBlock", "blockquote")} aria-label="Quote">
          “ Quote
        </button>
        <span className="a-rte-sep" aria-hidden="true" />
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={link} aria-label="Link">
          Link
        </button>
        <button type="button" className="a-rte-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("removeFormat")} aria-label="Clear formatting">
          Clear
        </button>
      </div>

      <div
        ref={ref}
        className="a-rte-editable"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={(event) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
          emit();
        }}
      />

      {help ? <p className="a-help">{help}</p> : null}
    </div>
  );
}
