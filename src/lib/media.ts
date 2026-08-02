/**
 * Whether a stored asset URL points at video rather than a still.
 *
 * Keyed off the extension because that's all the client has: `MediaAsset.url`
 * is what reaches the admin previews and the hero slider, and `put()` always
 * writes a known extension (see EXT in lib/storage.ts). Kept free of
 * `server-only` so client components can use it too.
 */
const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov)(?:[?#]|$)/i;

export const isVideoUrl = (url: string) => VIDEO_EXT.test(url);
