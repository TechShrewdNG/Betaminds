import { test, expect } from "@playwright/test";

const slider = "[aria-roledescription='carousel']";

test.describe("splash screen at /", () => {
  test("fills the whole viewport, with no site chrome", async ({ page }) => {
    await page.goto("/");
    const region = page.locator(slider);
    await expect(region).toBeVisible();

    // No header, no nav, no footer — the splash is deliberately bare.
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(page.locator("nav")).toHaveCount(0);

    // The slider starts at the very top and covers the screen, controls included.
    const rect = await region.evaluate((node) =>
      node.getBoundingClientRect().toJSON(),
    );
    const viewport = page.viewportSize()!.height;
    expect(rect.top).toBeLessThanOrEqual(1);
    expect(rect.height).toBeGreaterThanOrEqual(viewport - 2);

    await expect(
      page.getByRole("button", { name: "Next slide" }),
    ).toBeInViewport();
  });

  test("shows the logo, and it leads into the site", async ({ page }) => {
    await page.goto("/");
    const brand = page.getByRole("link", {
      name: /Betaminds Africa, enter the site/i,
    });
    await expect(brand).toBeVisible();

    // Top right, per the design.
    const [box, width] = await Promise.all([
      brand.boundingBox(),
      page.evaluate(() => window.innerWidth),
    ]);
    expect(box!.x).toBeGreaterThan(width / 2);
    expect(box!.y).toBeLessThan(120);

    await brand.click();
    await expect(page).toHaveURL(/\/home$/);
    // And the site's chrome is back on the other side.
    await expect(page.locator("header")).toHaveCount(1);
  });

  test("shows one slide at a time and the arrows change it", async ({
    page,
  }) => {
    await page.goto("/");
    const active = page.locator(`${slider} [data-active='true']`);
    await expect(active).toHaveCount(1);

    const first = await active.locator(".h1").innerText();
    await page.getByRole("button", { name: "Next slide" }).click();

    await expect
      .poll(async () => active.locator(".h1").innerText())
      .not.toBe(first);
    await expect(active).toHaveCount(1);

    // And back again.
    await page.getByRole("button", { name: "Previous slide" }).click();
    await expect.poll(async () => active.locator(".h1").innerText()).toBe(first);
  });

  test("only the visible slide is reachable by keyboard", async ({ page }) => {
    await page.goto("/");
    // Links inside inert (non-active) slides must not be focusable.
    const hiddenLinks = page.locator(
      `${slider} [data-active='false'] a:visible`,
    );
    expect(await hiddenLinks.count()).toBe(0);
  });

  test("does not autoplay when the visitor asks for reduced motion", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const active = page.locator(`${slider} [data-active='true']`);
    const first = await active.locator(".h1").innerText();

    // Comfortably longer than the seeded 7s interval.
    await page.waitForTimeout(9000);
    expect(await active.locator(".h1").innerText()).toBe(first);

    await context.close();
  });
});
