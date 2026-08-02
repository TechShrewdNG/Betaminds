import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getContent, getGlobal } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { HeroSlider } from "@/components/ui/HeroSlider";
import styles from "./splash.module.css";

/**
 * The splash screen: what a visitor lands on before the site itself.
 *
 * Deliberately outside the (site) route group, so it gets none of the chrome —
 * no header, no nav, no footer. Just the logo and the slider, as asked.
 *
 * It's the way into the site: the logo and every slide's buttons link onward.
 * There's no separate "skip" control, because a slide with no buttons would
 * otherwise be a dead end — the logo always is one.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("home");
  return pageMetadata(seo, "/");
}

export default async function SplashPage() {
  const [home, global] = await Promise.all([getContent("home"), getGlobal()]);
  const slider = home.heroSlider;

  // Switching the slider off in the CMS turns the splash off with it: there
  // would be nothing left to show, so `/` becomes the homepage instead.
  if (!slider?.enabled || slider.slides.length === 0) {
    redirect("/home");
  }

  return (
    <main className={styles.splash}>
      <Link
        href="/home"
        className={styles.brand}
        aria-label="Betaminds Africa, enter the site"
      >
        <span className={styles.mark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={global.brand.logo} alt="" />
        </span>
        <span className={styles.lockup}>
          <span className={styles.wordmark}>{global.brand.wordmark}</span>
          <span className={styles.wordmarkSub}>{global.brand.wordmarkSub}</span>
        </span>
      </Link>

      <HeroSlider
        slides={slider.slides}
        autoplay={slider.autoplay}
        interval={slider.interval}
        fullViewport
      />
    </main>
  );
}
