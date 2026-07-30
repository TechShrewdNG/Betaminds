"use client";

import { useEffect } from "react";

/**
 * Last resort: an error thrown in the root layout itself. This replaces the
 * whole document, so it has to supply `<html>` and `<body>` — and it can't rely
 * on globals.css having loaded, hence the inline styling.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#FBFAF8",
          color: "#17171B",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 10.5,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8A5A0F",
            }}
          >
            Betaminds Africa
          </p>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: 30,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            The site is having a moment.
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(23,23,27,.82)",
            }}
          >
            Please try again shortly, or email{" "}
            <a href="mailto:hello@betaminds.africa" style={{ color: "#8A5A0F" }}>
              hello@betaminds.africa
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "15px 26px",
              borderRadius: 100,
              border: 0,
              background: "#E8A33D",
              color: "#1A1206",
              fontFamily: "inherit",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: 28, fontSize: 12, color: "rgba(23,23,27,.55)" }}>
              Reference {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
