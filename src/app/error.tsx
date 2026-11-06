"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Recoverable render errors. Deliberately says nothing about what broke — the
 * visitor can't act on a stack trace, and `digest` is enough to find it in the
 * server logs.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] render error", error);
  }, [error]);

  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--surface-deep)",
      }}
    >
      <div className="shell" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ maxWidth: 620 }}>
          <div className="eyebrow mb-22">Something went wrong</div>
          <h1 className="h1" style={{ marginBottom: 20 }}>
            That didn&rsquo;t load
            <span className="accent-word">.</span>
          </h1>
          <p className="lead" style={{ maxWidth: 520, marginBottom: 34 }}>
            A hiccup on our side, not yours. Try again — and if it keeps
            happening, tell us and we&rsquo;ll chase it down.
          </p>

          <div className="row-wrap" style={{ gap: 11 }}>
            <button type="button" onClick={reset} className="pill pill--accent">
              Try again
            </button>
            <Link href="/home" className="pill pill--outline">
              Back to the homepage
            </Link>
          </div>

          {error.digest ? (
            <p
              className="mono-meta"
              style={{ marginTop: 34, color: "var(--ink-55)" }}
            >
              Reference {error.digest}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
