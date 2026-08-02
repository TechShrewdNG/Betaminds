import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/digital-ecosystem",
  "/media-services",
  "/academy",
  "/summit",
  "/lets-work",
  "/portfolio",
];

for (const route of ROUTES) {
  test(`${route} renders, and has no horizontal overflow at mobile width`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    // Exactly one h1 per page. Deliberately a count rather than a visibility
    // check: the homepage's opening slider rotates, so its h1 — the first
    // slide's — is only on screen some of the time.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main, body").first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement;
      return scrollWidth - clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("unknown routes 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("launch chrome is served", async ({ request, baseURL }) => {
  const robots = await request.get(`${baseURL}/robots.txt`);
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Disallow: /admin");

  const sitemap = await request.get(`${baseURL}/sitemap.xml`);
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("<urlset");
});
