"use client";

import { useEffect, useRef, useState } from "react";
import { useMedia } from "./media-context";
import { isVideoUrl } from "@/lib/media";

export type MediaKind = "image" | "video";

/** Wording and file-input filter, so one picker serves both media kinds. */
const COPY = {
  image: { noun: "image", accept: "image/*", empty: "No image" },
  video: { noun: "video", accept: "video/*", empty: "No video" },
} as const;

/**
 * Modal image browser: pick from what's already uploaded, upload something new,
 * or paste a URL (the seeded content uses remote placeholder photography, and
 * being able to paste a URL keeps that workable).
 */
export function ImagePickerModal({
  current,
  onPick,
  onClose,
  media = "image",
}: {
  current: string;
  onPick: (url: string) => void;
  onClose: () => void;
  /** Which half of the library to browse and upload into. */
  media?: MediaKind;
}) {
  const { assets: allAssets, upload } = useMedia();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState(
    current && !allAssets.some((asset) => asset.url === current) ? current : "",
  );
  const fileInput = useRef<HTMLInputElement>(null);

  // Picking a background video shouldn't mean scrolling past every still, and
  // vice versa.
  const assets = allAssets.filter(
    (asset) => isVideoUrl(asset.url) === (media === "video"),
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const result = await upload(file);
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    onPick(result.url);
    onClose();
  }

  return (
    <div
      className="a-modal-back"
      role="dialog"
      aria-modal="true"
      aria-label={`Choose ${COPY[media].noun === "image" ? "an" : "a"} ${COPY[media].noun}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="a-modal">
        <div className="a-modal-head">
          <strong style={{ fontSize: 15 }}>
            Choose {COPY[media].noun === "image" ? "an" : "a"} {COPY[media].noun}
          </strong>
          <div className="a-row">
            <button
              type="button"
              className="a-btn a-btn--sm"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
            >
              {busy ? "Uploading…" : "Upload new"}
            </button>
            <button type="button" className="a-btn a-btn--ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="a-modal-body">
          <input
            ref={fileInput}
            type="file"
            accept={COPY[media].accept}
            hidden
            onChange={(event) => handleFiles(event.target.files)}
          />

          {error ? (
            <div
              className="a-notice"
              data-tone="error"
              style={{ marginBottom: 14 }}
            >
              {error}
            </div>
          ) : null}

          <div className="a-field" style={{ marginBottom: 20 }}>
            <label className="a-label">Or use {COPY[media].noun === "image" ? "an" : "a"} {COPY[media].noun} URL</label>
            <div className="a-row">
              <input
                className="a-input"
                style={{ flex: 1, minWidth: 220 }}
                value={manual}
                placeholder="https://…"
                onChange={(event) => setManual(event.target.value)}
              />
              <button
                type="button"
                className="a-btn"
                disabled={!manual.trim()}
                onClick={() => {
                  onPick(manual.trim());
                  onClose();
                }}
              >
                Use URL
              </button>
            </div>
            <p className="a-help">
              Remote hosts must be allow-listed in <code>next.config.ts</code>.
              images.pexels.com already is, for the placeholder photography.
            </p>
          </div>

          {assets.length === 0 ? (
            <div className="a-empty">
              Nothing uploaded yet. Use <strong>Upload new</strong> to add your
              first image.
            </div>
          ) : (
            <div className="a-grid a-grid-4">
              {assets.map((asset) => (
                <div key={asset.id}>
                  <button
                    type="button"
                    className="a-thumb"
                    data-selected={asset.url === current ? "true" : "false"}
                    onClick={() => {
                      onPick(asset.url);
                      onClose();
                    }}
                  >
                    {isVideoUrl(asset.url) ? (
                      <video
                        src={asset.url}
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset.url} alt={asset.alt || asset.filename} />
                    )}
                  </button>
                  <div className="a-thumb-meta">{asset.filename}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Thumbnail plus Choose / Remove controls, for a single image or video field. */
export function ImageField({
  label,
  help,
  ratio,
  value,
  onChange,
  media = "image",
}: {
  label: string;
  help?: string;
  ratio?: string;
  value: string;
  onChange: (url: string) => void;
  media?: MediaKind;
}) {
  const [open, setOpen] = useState(false);
  const noun = COPY[media].noun;

  return (
    <div className="a-field">
      <label className="a-label">{label}</label>
      <div className="a-preview">
        <div
          className="a-preview-box"
          style={ratio ? { aspectRatio: ratio } : undefined}
        >
          {value ? (
            isVideoUrl(value) ? (
              <video src={value} muted playsInline preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" />
            )
          ) : (
            <span className="a-preview-empty">{COPY[media].empty}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="a-row">
            <button
              type="button"
              className="a-btn a-btn--sm"
              onClick={() => setOpen(true)}
            >
              {value
                ? "Replace"
                : `Choose ${noun === "image" ? "an" : "a"} ${noun}`}
            </button>
            {value ? (
              <button
                type="button"
                className="a-btn a-btn--sm a-btn--ghost"
                onClick={() => onChange("")}
              >
                Remove
              </button>
            ) : null}
          </div>
          {value ? (
            <p className="a-help" style={{ wordBreak: "break-all" }}>
              {value}
            </p>
          ) : null}
          {help ? <p className="a-help">{help}</p> : null}
          {ratio ? <p className="a-help">Crop: {ratio}</p> : null}
        </div>
      </div>

      {open ? (
        <ImagePickerModal
          current={value}
          onPick={onChange}
          onClose={() => setOpen(false)}
          media={media}
        />
      ) : null}
    </div>
  );
}

/** A gallery: an ordered list of image URLs. */
export function ImagesField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="a-field">
      <label className="a-label">
        {label}{" "}
        <span className="a-dim" style={{ fontWeight: 400 }}>
          ({value.length})
        </span>
      </label>
      {help ? <p className="a-help" style={{ marginBottom: 8 }}>{help}</p> : null}

      <div className="a-grid a-grid-4">
        {value.map((url, index) => (
          <div key={`${url}-${index}`}>
            <div className="a-thumb" style={{ cursor: "default" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </div>
            <div className="a-row" style={{ gap: 4, marginTop: 5 }}>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label="Move earlier"
              >
                ←
              </button>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() => move(index, index + 1)}
                disabled={index === value.length - 1}
                aria-label="Move later"
              >
                →
              </button>
              <button
                type="button"
                className="a-btn a-btn--ghost a-btn--sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="a-btn a-btn--sm"
          onClick={() => setOpen(true)}
        >
          + Add image
        </button>
      </div>

      {open ? (
        <ImagePickerModal
          current=""
          onPick={(url) => onChange([...value, url])}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
