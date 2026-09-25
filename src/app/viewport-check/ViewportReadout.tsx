"use client";

import { useEffect, useRef, useState } from "react";

type Row = { label: string; value: string; flag?: boolean };

/**
 * Measures the page the way the browser actually laid it out, and names what
 * is wrong rather than only reporting a total.
 *
 * The first version reported the homepage's scroll width, which proved there
 * was real overflow but not where it came from. This one walks the homepage
 * inside the iframe and lists the elements whose right edge passes the
 * viewport, widest first, with their classes — the culprit by name, measured
 * on the device that actually shows the bug.
 *
 * It polls rather than relying on the iframe's load event, which did not fire
 * usefully on iOS and left the whole table missing.
 */
export function ViewportReadout() {
  const [rows, setRows] = useState<Row[]>([]);
  const [frame, setFrame] = useState<Row[]>([]);
  const [offenders, setOffenders] = useState<Row[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const read = () => {
      const de = document.documentElement;
      const vv = window.visualViewport;
      const layout = de.clientWidth;
      const visual = vv ? Math.round(vv.width) : layout;
      const scale = vv ? +vv.scale.toFixed(3) : 1;

      setRows([
        { label: "layout viewport", value: String(layout) },
        {
          label: "visual viewport",
          value: String(visual),
          flag: Math.abs(visual - layout) > 2,
        },
        { label: "scale", value: String(scale), flag: scale !== 1 },
        {
          label: "this page scrollWidth",
          value: String(de.scrollWidth),
          flag: de.scrollWidth > layout + 1,
        },
      ]);
    };
    read();
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    return () => {
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
    };
  }, []);

  // Poll: the load event proved unreliable here, and the reveal animations
  // need a moment to run before the page settles at its final width anyway.
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (tries > 12) window.clearInterval(id);

      const doc = iframeRef.current?.contentDocument;
      const win = iframeRef.current?.contentWindow;
      if (!doc || !win || doc.readyState !== "complete") return;

      const de = doc.documentElement;
      const width = de.clientWidth;
      if (!width) return;

      const header = doc.querySelector("header");
      const main = doc.querySelector("main");
      const w = (el: Element | null) =>
        el ? String(Math.round(el.getBoundingClientRect().width)) : "—";

      setFrame([
        { label: "homepage viewport", value: String(width) },
        {
          label: "homepage scrollWidth",
          value: String(de.scrollWidth),
          flag: de.scrollWidth > width + 1,
        },
        { label: "header width", value: w(header) },
        { label: "main width", value: w(main), flag: w(header) !== w(main) },
      ]);

      // Everything sticking out past the right edge, widest overhang first.
      const over: { name: string; right: number; w: number }[] = [];
      for (const el of Array.from(doc.querySelectorAll("body *"))) {
        const r = el.getBoundingClientRect();
        if (r.right <= width + 1) continue;
        const cls = (el.className || "").toString().replace(/\s+/g, " ").trim();
        over.push({
          name: `${el.tagName.toLowerCase()}${cls ? "." + cls.split(" ").slice(0, 2).join(".") : ""}`,
          right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
      over.sort((a, b) => b.right - a.right);

      // The document only grows to whatever reaches furthest, so name that one
      // outright rather than leaving a list to interpret.
      const widest = over[0];
      const culprit: Row[] =
        widest && de.scrollWidth > width + 1
          ? [
              {
                label: "▶ CULPRIT",
                value: widest.name.slice(0, 40),
                flag: true,
              },
            ]
          : [];

      setOffenders([
        ...culprit,
        ...(over.length === 0
          ? [{ label: "nothing past the right edge", value: "clean" }]
          : over.slice(0, 6).map((o) => ({
              label: o.name.slice(0, 44),
              value: `right ${o.right} · w ${o.w}`,
              flag: o.right >= de.scrollWidth - 2,
            }))),
      ]);
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  const table = (title: string, data: Row[]) =>
    data.length === 0 ? null : (
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ font: "600 15px/1.3 system-ui", margin: "0 0 8px" }}>{title}</h2>
        <div style={{ display: "grid", gap: 1, background: "#ddd", border: "1px solid #ddd" }}>
          {data.map((r, i) => (
            <div
              key={r.label + i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "9px 11px",
                background: r.flag ? "#ffe9e6" : "#fff",
              }}
            >
              <span style={{ font: "500 12.5px/1.4 system-ui", color: "#555", wordBreak: "break-all" }}>
                {r.label}
              </span>
              <span
                style={{
                  font: "600 12.5px/1.4 ui-monospace, monospace",
                  textAlign: "right",
                  whiteSpace: "nowrap",
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
      <h1 style={{ font: "700 20px/1.2 system-ui", margin: "0 0 6px" }}>Viewport check</h1>
      <p style={{ font: "400 13px/1.5 system-ui", color: "#555", margin: "0 0 20px" }}>
        Wait five seconds for the tables to fill, then screenshot the whole page.
        Items in the last table are normal when they are clipped — the one that
        matters is whichever <em>right</em> equals the homepage scrollWidth
        above. If that scrollWidth matches the homepage viewport, nothing is
        wrong.
      </p>

      {table("This device", rows)}
      {table("The homepage, measured", frame)}
      {table("Sticking out past the right edge", offenders)}

      <iframe
        ref={iframeRef}
        src="/home"
        title="homepage under test"
        style={{ width: "100%", height: 260, border: "1px solid #ddd" }}
      />
    </main>
  );
}
