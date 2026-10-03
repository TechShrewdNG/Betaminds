import { test, expect } from "@playwright/test";

// `/` is the splash screen and gets its own spec; these are the content pages.
const ROUTES = [
  "/home",
  "/digital-ecosystem",
  "/media-services",
  "/pr",
  "/academy",
  "/summit",
  "/lets-work",
  "/projects",
  "/blog",
];

for (const route of ROUTES) {
  test(`${route} renders, and has no horizontal overflow at mobile width`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1").first()).toBeVisible();

    const overflow = await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement;
      return scrollWidth - clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

/**
 * The document's scroll width is not a strong enough guarantee.
 *
 * A page can measure zero overflow in Chromium and still scroll sideways on
 * iOS, because the two engines disagree about what an over-wide element may
 * escape. Chromium honours `overflow-x: clip` and `contain: paint` on an
 * ancestor; WebKit lets a compositor-promoted descendant — anything carrying
 * an animated transform — paint straight through both. That disagreement is
 * exactly what put a sideways scroll on /home that nothing here could
 * reproduce.
 *
 * So rather than trusting the total, this asserts the shape that holds in
 * both engines: an element wider than the screen is allowed only inside a
 * real scroll container. Those are the mobile carousels, they clip everywhere,
 * and the visitor can actually reach what is inside them. Anything else wide
 * enough to stick out is a bug even when the engine under test hides it.
 */
for (const width of [390, 428]) {
  for (const route of ROUTES) {
    test(`${route} keeps every over-wide element inside a scroller at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      // The reveal and stagger animations settle into their final widths.
      await page.waitForTimeout(900);

      const escaping = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;

        // Walk no further than <main>: the page-level guards above it are the
        // very ones WebKit declines to apply, so crediting them would let the
        // bug back in.
        const insideScroller = (el: Element) => {
          let parent = el.parentElement;
          while (parent && parent.tagName !== "MAIN" && parent !== document.body) {
            const { overflowX } = getComputedStyle(parent);
            // Only a container the visitor can actually scroll counts.
            // `hidden`, `clip` and `contain: paint` are deliberately not
            // credited: they are what WebKit ignored, and a band that hides
            // half its own content is not carrying it either.
            if (overflowX === "auto" || overflowX === "scroll") return true;
            parent = parent.parentElement;
          }
          return false;
        };

        return Array.from(document.querySelectorAll("body *"))
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            // Sub-pixel rounding puts honest full-bleed blocks a hair over.
            return (
              (rect.width > viewport + 1 || rect.right > viewport + 1) &&
              !insideScroller(el)
            );
          })
          .map((el) => {
            const name = (el.className || "").toString().trim().split(/\s+/)[0];
            const rect = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()}${name ? `.${name}` : ""} (${Math.round(rect.width)}px wide, right edge ${Math.round(rect.right)})`;
          });
      });

      expect(escaping, escaping.join("\n")).toEqual([]);
    });
  }
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
