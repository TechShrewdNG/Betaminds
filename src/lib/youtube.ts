/**
 * Extracts an 11-character YouTube video ID from whatever shape of URL
 * someone actually pastes — `watch?v=`, `youtu.be/`, `embed/`, `shorts/` —
 * or a bare ID typed directly. Returns "" when nothing recognisable is
 * found, so callers can filter an unparseable row the same way they
 * already filter an empty one.
 */
export function youtubeId(input: string): string {
  const value = input.trim();
  if (!value) return "";
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1, 12);
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v.slice(0, 11);
      const match = /\/(?:embed|shorts)\/([\w-]{11})/.exec(url.pathname);
      if (match) return match[1];
    }
  } catch {
    // Not a URL — fall through to "".
  }
  return "";
}
