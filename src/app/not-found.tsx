import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getGlobal } from "@/lib/content";

// Next emits `noindex` for not-found pages on its own, so this only needs the
// title — declaring robots here would just duplicate the tag.
export const metadata = {
  title: "Page not found",
};

/**
 * 404 for anything outside the six routes.
 *
 * Root-level `not-found` renders outside the (site) group, so it pulls in the
 * header and footer itself — a dead end without navigation is a worse dead end.
 */
export default async function NotFound() {
  const global = await getGlobal();

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />

      <main
        id="main"
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "62vh",
          background: "var(--surface-deep)",
        }}
      >
        <div className="shell" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div style={{ maxWidth: 660 }}>
            <div className="eyebrow mb-22">Error 404</div>
            <h1 className="h1" style={{ marginBottom: 20 }}>
              This page has wandered off
              <span className="accent-word">.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 520, marginBottom: 34 }}>
              The link may be old, or the address slightly off. Everything we do
              is one of the six pages below.
            </p>

            <div className="row-wrap" style={{ gap: 11 }}>
              <Link href="/" className="pill pill--accent">
                Back to the homepage
              </Link>
              <Link href="/lets-work" className="pill pill--outline">
                Get in touch
              </Link>
            </div>

            <div
              className="row-wrap"
              style={{ gap: "10px 24px", marginTop: 44 }}
            >
              {global.nav.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ fontSize: 14.5, color: "var(--ink-84)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer
        brand={global.brand}
        footer={global.footer}
        contact={global.contact}
      />
    </>
  );
}
