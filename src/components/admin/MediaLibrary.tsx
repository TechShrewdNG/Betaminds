"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "./media-context";
import { isVideoUrl } from "@/lib/media";
import { deleteImage, updateImageAlt } from "@/app/admin/actions";

type Row = {
  id: string;
  url: string;
  filename: string;
  alt: string;
  width: number | null;
  height: number | null;
  size: number;
  createdAt: string;
};

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function MediaLibrary({ assets }: { assets: Row[] }) {
  const { upload } = useMedia();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const result = await upload(file);
      if ("error" in result) {
        setError(result.error);
        break;
      }
      uploaded += 1;
    }
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
    // The grid below is server-rendered, so refresh to pick up the new rows.
    if (uploaded > 0) router.refresh();
  }

  return (
    <>
      <div className="a-card" style={{ marginBottom: 18 }}>
        <div className="a-row">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => handleFiles(event.target.files)}
          />
          <button
            type="button"
            className="a-btn a-btn--primary"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
          >
            {busy ? "Uploading…" : "Upload images"}
          </button>
          <span className="a-dim" style={{ fontSize: 12.5 }}>
            JPEG, PNG, WebP, AVIF, GIF or SVG. Up to 10 MB each.
          </span>
        </div>
        {error ? (
          <div className="a-notice" data-tone="error" style={{ marginTop: 12 }}>
            {error}
          </div>
        ) : null}
      </div>

      {assets.length === 0 ? (
        <div className="a-card a-empty">
          Nothing here yet. Every image on the site is currently a placeholder
          from the design handoff — upload the real photography to replace them.
        </div>
      ) : (
        <div className="a-grid a-grid-3">
          {assets.map((asset) => (
            <div className="a-card" key={asset.id} style={{ padding: 12 }}>
              <div className="a-thumb" style={{ cursor: "default" }}>
                {isVideoUrl(asset.url) ? (
                  <video src={asset.url} muted playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt={asset.alt || asset.filename} />
                )}
              </div>

              <div className="a-thumb-meta" style={{ marginTop: 8 }}>
                <strong>{asset.filename}</strong>
                <br />
                {asset.width && asset.height
                  ? `${asset.width}×${asset.height} · `
                  : ""}
                {formatBytes(asset.size)}
              </div>

              <form action={updateImageAlt} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={asset.id} />
                <label className="a-label" htmlFor={`alt-${asset.id}`}>
                  Image description
                </label>
                <input
                  id={`alt-${asset.id}`}
                  name="alt"
                  className="a-input"
                  defaultValue={asset.alt}
                  placeholder="What the photo shows"
                />
                <div className="a-row" style={{ marginTop: 8 }}>
                  <button type="submit" className="a-btn a-btn--sm">
                    Save
                  </button>
                </div>
              </form>

              <form
                action={deleteImage}
                style={{ marginTop: 8 }}
                onSubmit={(event) => {
                  if (
                    !window.confirm(
                      `Delete ${asset.filename}? Any page still using it will show a broken image.`,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={asset.id} />
                <button
                  type="submit"
                  className="a-btn a-btn--sm a-btn--danger"
                  style={{ width: "100%" }}
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
