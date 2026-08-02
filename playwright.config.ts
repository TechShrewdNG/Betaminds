import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

// Loads .env the same way Next.js itself does, so ADMIN_EMAIL/ADMIN_PASSWORD
// (used by admin-auth.spec.ts) reach this process too — the webServer child
// process gets them from Next's own loading, but this config file and the
// test files run in a separate process that doesn't.
loadEnvConfig(process.cwd());

/**
 * Runs against a production build (`next build && next start`), matching how
 * this app has actually been verified all along — not `next dev`, which
 * behaves differently enough (slower first paint, different error overlays)
 * that a dev-server-only pass has missed real issues before.
 *
 * Needs a real Postgres reachable at DATABASE_URL with the schema pushed and
 * an admin seeded (`npm run setup`) before the suite runs — see
 * tests/README.md.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Set only when the environment provides a pre-fetched Chromium
        // binary at a fixed path instead of the one `playwright install`
        // would otherwise download.
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
