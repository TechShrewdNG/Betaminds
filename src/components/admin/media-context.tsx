"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { upload as blobUpload } from "@vercel/blob/client";
import { registerUpload } from "@/app/admin/actions";
import {
  extensionFor,
  isVideoType,
  rejectReason,
  slugifyName,
} from "@/lib/media";

export type Asset = {
  id: string;
  url: string;
  filename: string;
  alt: string;
  width: number | null;
  height: number | null;
};

type MediaContextValue = {
  assets: Asset[];
  /**
   * Uploads a file, adds it to the in-memory library, and returns its URL.
   * `onProgress` reports 0-100; a 64 MB video on a slow connection is a long
   * wait to spend looking at a button that just says "Uploading…".
   */
  upload: (
    file: File,
    onProgress?: (percentage: number) => void,
  ) => Promise<{ url: string } | { error: string }>;
};

const MediaContext = createContext<MediaContextValue | null>(null);

/**
 * Reads an asset's pixel dimensions in the browser.
 *
 * These used to come from sharp, server-side, back when the bytes passed
 * through us. They're a nicety in the media library, so anything that fails to
 * decode just reports nothing rather than failing the upload.
 */
async function measure(
  file: File,
): Promise<{ width: number | null; height: number | null }> {
  const none = { width: null, height: null };
  if (isVideoType(file.type) || file.type === "image/svg+xml") return none;

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    return { width: image.naturalWidth, height: image.naturalHeight };
  } catch {
    return none;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function MediaProvider({
  initialAssets,
  children,
}: {
  initialAssets: Asset[];
  children: React.ReactNode;
}) {
  const [assets, setAssets] = useState(initialAssets);

  const upload = useCallback(async (
    file: File,
    onProgress?: (percentage: number) => void,
  ) => {
    // Checked here for a quick, specific message; the token endpoint and
    // `registerUpload` both re-check, since neither trusts the browser.
    const rejected = rejectReason(file);
    if (rejected) return { error: rejected };

    const filename = `${slugifyName(file.name)}-${crypto
      .randomUUID()
      .slice(0, 8)}.${extensionFor(file.type)}`;

    try {
      // Straight from the browser to Blob: a serverless function can only
      // accept ~4.5 MB of request body, which no background video fits in.
      const blob = await blobUpload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/media/upload",
        contentType: file.type,
        clientPayload: JSON.stringify({ contentType: file.type }),
        // Video is big enough to be worth splitting into parts that upload in
        // parallel and retry individually, rather than losing 60 MB to one
        // dropped connection.
        multipart: isVideoType(file.type),
        onUploadProgress: onProgress
          ? ({ percentage }) => onProgress(percentage)
          : undefined,
      });

      const size = await measure(file);
      const result = await registerUpload({
        url: blob.url,
        filename,
        mimeType: file.type,
        size: file.size,
        width: size.width,
        height: size.height,
      });
      if (!result.ok) return { error: result.message };

      // Newest first, matching the media library's ordering.
      setAssets((current) => [result.asset, ...current]);
      return { url: result.asset.url };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      return { error: message };
    }
  }, []);

  const value = useMemo(() => ({ assets, upload }), [assets, upload]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const value = useContext(MediaContext);
  if (!value) throw new Error("useMedia must be used inside a MediaProvider.");
  return value;
}
