"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { uploadImage } from "@/app/admin/actions";

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
  /** Uploads a file, adds it to the in-memory library, and returns its URL. */
  upload: (file: File) => Promise<{ url: string } | { error: string }>;
};

const MediaContext = createContext<MediaContextValue | null>(null);

export function MediaProvider({
  initialAssets,
  children,
}: {
  initialAssets: Asset[];
  children: React.ReactNode;
}) {
  const [assets, setAssets] = useState(initialAssets);

  const upload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    if (!result.ok) return { error: result.message };
    // Newest first, matching the media library's ordering.
    setAssets((current) => [result.asset, ...current]);
    return { url: result.asset.url };
  }, []);

  const value = useMemo(() => ({ assets, upload }), [assets, upload]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const value = useContext(MediaContext);
  if (!value) throw new Error("useMedia must be used inside a MediaProvider.");
  return value;
}
