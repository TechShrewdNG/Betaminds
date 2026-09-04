import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
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
      <ScrollReveal />
      {/* Off screen until focused. The sticky header carries eight nav links
          plus a CTA, so without this a keyboard or screen-reader user tabs
          through ten controls before reaching the page on every route. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header brand={global.brand} nav={global.nav} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer
        brand={global.brand}
        footer={global.footer}
        contact={global.contact}
      />
      <WhatsAppButton
        enabled={global.whatsapp.enabled}
        number={global.whatsapp.number}
        message={global.whatsapp.message}
      />
    </>
  );
}
