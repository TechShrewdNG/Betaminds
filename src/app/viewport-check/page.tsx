import type { Metadata } from "next";
import { ViewportReadout } from "./ViewportReadout";

/**
 * A throwaway diagnostic page.
 *
 * The site renders correctly under every width and device profile available
 * here, so the layout problem reported on a real iPhone cannot be reproduced
 * from this end. This page reports what that phone actually measures — layout
 * viewport against visual viewport, page zoom, and the real widths of the
 * header and main — which is the difference between diagnosing the bug and
 * guessing at it.
 *
 * Deliberately outside the (site) route group: no header, no footer, no
 * stylesheet beyond what is inline here, so nothing on this page can influence
 * what it measures. Delete once the cause is known.
 */
export const metadata: Metadata = {
  title: "Viewport check",
  robots: { index: false, follow: false },
};

export default function ViewportCheckPage() {
  return <ViewportReadout />;
}
