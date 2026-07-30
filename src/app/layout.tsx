import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

// next/font downloads and self-hosts these at build time, which is what the
// handoff asks for ("Self-host in production").
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = rootMetadata(SITE_URL);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
