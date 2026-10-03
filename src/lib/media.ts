/**
 * Media rules shared by the browser and the server.
 *
 * Deliberately free of `server-only`: the upload flow runs in the browser
 * (files go straight from the visitor's machine to Vercel Blob, see
 * src/app/api/media/upload/route.ts for why), so the same limits have to be
 * enforceable on both sides.
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/gif",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
] as const;

/**
 * Documents. Just PDF for now — the magazine and press publications are things
 * a reader opens, not something the site renders, so there is nothing to gain
 * from accepting a second format.
 */
export const ACCEPTED_DOC_TYPES = ["application/pdf"] as const;

export const ACCEPTED_TYPES: readonly string[] = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
  ...ACCEPTED_DOC_TYPES,
];

/**
 * Video gets a bigger allowance than stills — a few seconds of background
 * footage doesn't fit in 10 MB. Anything longer than this belongs on a CDN
 * with its URL pasted in instead.
 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 64 * 1024 * 1024;
/** A magazine issue is a lot of pages of print-quality artwork. */
export const MAX_DOC_BYTES = 48 * 1024 * 1024;

export const isVideoType = (mimeType: string) => mimeType.startsWith("video/");
export const isDocType = (mimeType: string) =>
  (ACCEPTED_DOC_TYPES as readonly string[]).includes(mimeType);

export const maxBytesFor = (mimeType: string) => {
  if (isVideoType(mimeType)) return MAX_VIDEO_BYTES;
  if (isDocType(mimeType)) return MAX_DOC_BYTES;
  return MAX_IMAGE_BYTES;
};

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

export const extensionFor = (mimeType: string) => EXT[mimeType] ?? "bin";

/** Turn a filename into something safe and recognisable in the media library. */
export function slugifyName(name: string) {
  const base = name.replace(/\.[^.]+$/, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file"
  );
}

/**
 * Whether a stored asset URL points at video rather than a still.
 *
 * Keyed off the extension because that's all the client has: `MediaAsset.url`
 * is what reaches the admin previews and the hero slider.
 */
const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov)(?:[?#]|$)/i;
const DOC_EXT = /\.pdf(?:[?#]|$)/i;

export const isVideoUrl = (url: string) => VIDEO_EXT.test(url);
export const isDocUrl = (url: string) => DOC_EXT.test(url);

/**
 * Which kind of thing a stored URL points at.
 *
 * The pickers used to ask "is this a video?" and treat everything else as an
 * image, which put PDFs into the image grid as broken thumbnails the moment a
 * third kind existed.
 */
export const mediaKindOf = (url: string): "image" | "video" | "doc" =>
  isVideoUrl(url) ? "video" : isDocUrl(url) ? "doc" : "image";

/** The `accept` attribute for a file input, per media kind. */
export const ACCEPT_ATTR = {
  image: ACCEPTED_IMAGE_TYPES.join(","),
  video: ACCEPTED_VIDEO_TYPES.join(","),
  doc: ACCEPTED_DOC_TYPES.join(","),
  both: ACCEPTED_TYPES.join(","),
} as const;

export function rejectReason(file: {
  type: string;
  size: number;
}): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.type || "That file type"} isn't supported. Use JPEG, PNG, WebP, AVIF, GIF or SVG for pictures, MP4, WebM, OGG or MOV for video, or PDF for a document.`;
  }
  if (file.size > maxBytesFor(file.type)) {
    if (isVideoType(file.type))
      return "That video is over 64 MB. Compress it, or host it elsewhere and paste the URL instead.";
    if (isDocType(file.type))
      return "That PDF is over 48 MB. Compress it, or host it elsewhere and paste the URL instead.";
    return "That image is over 10 MB. Please compress it first.";
  }
  return null;
}
