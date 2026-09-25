"use client";

import { useEffect, useState } from "react";

type Row = { label: string; value: string; flag?: boolean };

/**
 * Measures the page the way the browser actually laid it out, and says plainly
 * which numbers disagree.
 *
 * The three that matter:
 *  - layout vs visual viewport: if these differ the page is zoomed, and fixed
 *    chrome will stretch while in-flow content stays narrow — the exact shape
 *    of the reported bug.
 *  - document scroll width vs layout viewport: if this is wider, something is
 *    genuinely overflowing sideways.
 *  - header vs main width, read from the live site in an iframe, which is what
 *    "the header is full width and the content is not" would look like in
 *    numbers.
 */
export function ViewportReadout() {
  const [rows, setRows] = useState<Row[]>([]);
  const [frame, setFrame] = useState<Row[]>([]);

  useEffect(() => {
    const read = () => {
      const de = document.documentElement;
      const vv = window.visualViewport;
      const layout = de.clientWidth;
      const visual = vv ? Math.round(vv.width) : layout;
      const scale = vv ? +vv.scale.toFixed(3) : 1;
      const meta = document
        .querySelector('meta[name="viewport"]')
        ?.getAttribute("content");

      setRows([
        { label: "window.innerWidth", value: String(window.innerWidth) },
        { label: "layout viewport", value: String(layout) },
        {
          label: "visual viewport",
          value: String(visual),
          flag: Math.abs(visual - layout) > 2,
        },
        { label: "visualViewport.scale", value: String(scale), flag: scale !== 1 },
        { label: "devicePixelRatio", value: String(window.devicePixelRatio) },
        { label: "screen.width", value: String(window.screen.width) },
        {
          label: "document scrollWidth",
          value: String(de.scrollWidth),
          flag: de.scrollWidth > layout + 1,
        },
        { label: "viewport meta", value: meta ?? "(missing)", flag: !meta },
        { label: "user agent", value: navigator.userAgent },
      ]);
    };

    read();
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    window.visualViewport?.addEventListener("scroll", read);
    return () => {
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("scroll", read);
    };
  }, []);

  // Measure the real homepage inside an iframe sized to this viewport, so the
  // header/main comparison comes from the actual page rather than this one.
  const onFrameLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const doc = event.currentTarget.contentDocument;
      if (!doc) return;
      const w = (sel: string) => {
        const el = doc.querySelector(sel);
        return el ? String(Math.round(el.getBoundingClientRect().width)) : "—";
      };
      const header = w("header");
      const main = w("main");
      setFrame([
        { label: "iframe width", value: String(Math.round(event.currentTarget.getBoundingClientRect().width)) },
        { label: "page header width", value: header },
        { label: "page main width", value: main, flag: header !== main },
        { label: "page scrollWidth", value: String(doc.documentElement.scrollWidth) },
      ]);
    } catch {
      setFrame([{ label: "iframe", value: "could not read (blocked)" }]);
    }
  };

  const table = (title: string, data: Row[]) => (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ font: "600 15px/1.3 system-ui", margin: "0 0 10px" }}>{title}</h2>
      <div style={{ display: "grid", gap: 1, background: "#ddd", border: "1px solid #ddd" }}>
        {data.map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 12px",
              background: r.flag ? "#ffe9e6" : "#fff",
            }}
          >
            <span style={{ font: "500 13px/1.4 system-ui", color: "#555" }}>
              {r.label}
            </span>
            <span
              style={{
                font: "600 13px/1.4 ui-monospace, monospace",
                textAlign: "right",
                wordBreak: "break-word",
                color: r.flag ? "#b3261e" : "#111",
              }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto", background: "#fff" }}>
      <h1 style={{ font: "700 20px/1.2 system-ui", margin: "0 0 6px" }}>
        Viewport check
      </h1>
      <p style={{ font: "400 13px/1.5 system-ui", color: "#555", margin: "0 0 22px" }}>
        Anything highlighted is a number that disagrees with the others.
        Screenshot this whole page.
      </p>

      {table("This device", rows)}
      {frame.length > 0 ? table("The homepage, measured", frame) : null}

      <iframe
        src="/home"
        title="homepage under test"
        onLoad={onFrameLoad}
        style={{ width: "100%", height: 320, border: "1px solid #ddd" }}
      />
    </main>
  );
}
