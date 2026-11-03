"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePickerModal } from "./ImagePicker";

/** Minimal escaping for a value going inside an HTML attribute we build by hand. */
const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
  // Where the caret was before a picker modal opened. Opening the modal
  // moves focus (and keyboard/Escape handling) onto it, which loses the
  // field's own selection — the other toolbar buttons avoid that entirely by
  // finishing synchronously inside the click (see the onMouseDown
  // preventDefault below), but a picker's own pick happens later, after the
  // visitor has clicked around inside the modal.
  const savedRange = useRef<Range | null>(null);
  const [pickingImage, setPickingImage] = useState(false);
  const [buildingGallery, setBuildingGallery] = useState(false);
  const [pickingForGallery, setPickingForGallery] = useState(false);
  const [galleryDraft, setGalleryDraft] = useState<string[]>([]);

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

  const saveSelection = () => {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    // Only keep it if it's actually inside this field — a stray selection
    // elsewhere on the page shouldn't become where the image lands.
    if (range && ref.current?.contains(range.commonAncestorContainer)) {
      savedRange.current = range.cloneRange();
    } else {
      savedRange.current = null;
    }
  };

  /** Inserts raw HTML at the caret, restoring it first if a modal moved focus away. */
  const insertHtml = (html: string) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const selection = window.getSelection();
    if (selection && savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const insertImage = (url: string) => {
    insertHtml(`<img src="${escapeAttr(url)}" alt="" loading="lazy" />`);
    setPickingImage(false);
  };

  const insertGallery = () => {
    if (galleryDraft.length === 0) return;
    const imgs = galleryDraft
      .map((url) => `<img src="${escapeAttr(url)}" alt="" loading="lazy" />`)
      .join("");
    insertHtml(`<div class="rt-gallery">${imgs}</div>`);
    setGalleryDraft([]);
    setBuildingGallery(false);
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
        <span className="a-rte-sep" aria-hidden="true" />
        <button
          type="button"
          className="a-rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            saveSelection();
            setPickingImage(true);
          }}
          aria-label="Insert image"
        >
          Image
        </button>
        <button
          type="button"
          className="a-rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            saveSelection();
            setBuildingGallery(true);
          }}
          aria-label="Insert image gallery"
        >
          Gallery
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

      {pickingImage ? (
        <ImagePickerModal
          current=""
          onPick={insertImage}
          onClose={() => setPickingImage(false)}
          media="image"
        />
      ) : null}

      {buildingGallery ? (
        <div
          className="a-modal-back"
          role="dialog"
          aria-modal="true"
          aria-label="Build an image gallery"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setBuildingGallery(false);
              setGalleryDraft([]);
            }
          }}
        >
          <div className="a-modal">
            <div className="a-modal-head">
              <strong style={{ fontSize: 15 }}>
                Image gallery
                {galleryDraft.length > 0 ? ` (${galleryDraft.length})` : ""}
              </strong>
              <div className="a-row">
                <button
                  type="button"
                  className="a-btn a-btn--sm"
                  onClick={() => setPickingForGallery(true)}
                >
                  + Add image
                </button>
                <button
                  type="button"
                  className="a-btn a-btn--ghost"
                  onClick={() => {
                    setBuildingGallery(false);
                    setGalleryDraft([]);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="a-modal-body">
              {galleryDraft.length === 0 ? (
                <div className="a-empty">
                  Add two or more images, then insert them as a gallery at the
                  cursor.
                </div>
              ) : (
                <div className="a-grid a-grid-4">
                  {galleryDraft.map((url, index) => (
                    <div key={`${url}-${index}`}>
                      <div className="a-thumb" style={{ cursor: "default" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" />
                      </div>
                      <button
                        type="button"
                        className="a-btn a-btn--ghost a-btn--sm"
                        style={{ marginTop: 5, width: "100%" }}
                        onClick={() =>
                          setGalleryDraft((draft) => draft.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="a-btn a-btn--primary"
                  disabled={galleryDraft.length === 0}
                  onClick={insertGallery}
                >
                  Insert gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {pickingForGallery ? (
        <ImagePickerModal
          current=""
          onPick={(url) => setGalleryDraft((draft) => [...draft, url])}
          onClose={() => setPickingForGallery(false)}
          media="image"
        />
      ) : null}
    </div>
  );
}
