import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getGlobal } from "@/lib/content";

/**
 * Chrome for the six public routes. The prototype's preview toolbar and `device`
 * state are deliberately absent — the handoff says not to ship them; real media
 * queries in globals.css do that job.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getGlobal();

  return (
    <>
      <Header brand={global.brand} nav={global.nav} />
      <main id="main">{children}</main>
      <Footer
        brand={global.brand}
        footer={global.footer}
        contact={global.contact}
      />
    </>
  );
}
