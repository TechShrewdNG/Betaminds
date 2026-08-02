import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder photography from the design handoff. Every one of these is a
      // stand-in — see design_handoff_betaminds_site/README.md. Swap for real
      // Betaminds assets (uploaded through /admin/media) at the same crops.
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
