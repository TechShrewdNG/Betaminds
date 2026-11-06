/**
 * Inline SVG icon set.
 *
 * Deliberately hand-rolled rather than an icon package: the handoff wants the
 * site self-hosted with no CDN or runtime font fetch, and a dependency would
 * ship far more glyphs than the six pages use. Every path is drawn on a 24×24
 * grid with a 1.7 stroke so the whole set reads at one weight.
 *
 * Icons are decorative unless given a `title`, in which case they are exposed
 * to assistive tech — the default is aria-hidden so a labelled control does not
 * get announced twice.
 */

export type IconName =
  | "check"
  | "arrow-right"
  | "camera"
  | "video"
  | "pen"
  | "film"
  | "sparkle"
  | "megaphone"
  | "layout"
  | "code"
  | "cpu"
  | "search"
  | "mail"
  | "phone"
  | "pin"
  | "globe"
  | "identity"
  | "strategy"
  | "cart"
  | "card"
  | "chart"
  | "share"
  | "users"
  | "calendar"
  | "clock"
  | "spark"
  | "close";

/** Path data only — every icon shares the same stroke treatment below. */
const PATHS: Record<IconName, string> = {
  check: "M4.5 12.5l5 5 10-11",
  "arrow-right": "M4 12h15M13 6l6 6-6 6",
  camera:
    "M3 8.5A2.5 2.5 0 015.5 6h1.7l1.3-2h6l1.3 2h1.7A2.5 2.5 0 0121 8.5v9A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5v-9zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  video: "M3 7.5A2.5 2.5 0 015.5 5h7A2.5 2.5 0 0115 7.5v9A2.5 2.5 0 0112.5 19h-7A2.5 2.5 0 013 16.5v-9zM15 10.5l6-3.5v10l-6-3.5",
  pen: "M4 20h4L20 8a2.5 2.5 0 00-3.5-3.5L4.5 16.5 4 20zM15 6l3 3",
  film: "M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11zM3 9h4M3 15h4M17 9h4M17 15h4M10 9.5l4.5 2.5-4.5 2.5v-5z",
  sparkle:
    "M12 3l1.9 5.4L19 10.5l-5.1 2.1L12 18l-1.9-5.4L5 10.5l5.1-2.1L12 3zM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z",
  megaphone:
    "M4 10.5v3a2 2 0 002 2h1l2.5 4.5 2.5-1-2-3.5L20 19V5L10 9.5H6a2 2 0 00-2 1z",
  layout: "M3.5 5.5A2 2 0 015.5 3.5h13a2 2 0 012 2v13a2 2 0 01-2 2h-13a2 2 0 01-2-2v-13zM3.5 9h17M9 9v11.5",
  code: "M8.5 7.5L3.5 12l5 4.5M15.5 7.5l5 4.5-5 4.5M13.5 4l-3 16",
  cpu: "M7 7h10v10H7V7zM4.5 9.5h2.5M4.5 14.5h2.5M17 9.5h2.5M17 14.5h2.5M9.5 4.5V7M14.5 4.5V7M9.5 17v2.5M14.5 17v2.5",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM16.2 16.2L21 21",
  mail: "M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9zM3.5 7.8l8.5 5.7 8.5-5.7",
  phone:
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.7a2 2 0 012-2.2z",
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3.5 12h17M12 3a14 14 0 000 18 14 14 0 000-18z",
  identity: "M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11zM9.5 11a2 2 0 104 0 2 2 0 00-4 0zM7.5 16.5c.8-1.6 2.4-2.5 4.5-2.5s3.7.9 4.5 2.5",
  strategy: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  cart: "M3 4.5h2.5l2.2 10.5h9.6l2.2-7.5H7M9.5 20a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM17 20a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z",
  card: "M3 8A2.5 2.5 0 015.5 5.5h13A2.5 2.5 0 0121 8v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16V8zM3 10.5h18M6.5 15h3",
  chart: "M4 20V4M4 20h16M8 20v-6M12.5 20V9M17 20v-8",
  share: "M8 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM10.2 10.2l5.1-2.6M10.2 13.8l5.1 2.6",
  users:
    "M9 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.9-3 3.4-4.5 6.5-4.5s5.6 1.5 6.5 4.5M16 5.6a3.5 3.5 0 010 6.8M18 15.6c2 .7 3.2 2 3.7 4.4",
  calendar:
    "M4 8A2.5 2.5 0 016.5 5.5h11A2.5 2.5 0 0120 8v9.5a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5V8zM4 10.5h16M8.5 3.5v4M15.5 3.5v4",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5.3l3.4 2",
  close: "M6 6l12 12M18 6L6 18",
  spark: "M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4L12 20.5l-2.4-6.6L3 11.5l6.6-2.4L12 2.5z",
};

export function Icon({
  name,
  size = 20,
  title,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  /** Supply only when the icon is the sole label for its control. */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none", ...style }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}
