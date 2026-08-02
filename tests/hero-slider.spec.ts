import { test, expect } from "@playwright/test";

const slider = "[aria-roledescription='carousel']";

test.describe("homepage opening slider", () => {
  test("is the first thing on the page and fills the viewport", async ({
    page,
  }) => {
    await page.goto("/");
    const region = page.locator(slider);
    await expect(region).toBeVisible();

    // It opens the page: only the sticky header sits above it.
    const headerBottom = await page
      .locator("header")
      .evaluate((node) => node.getBoundingClientRect().bottom);
    const top = await region.evaluate(
      (node) => node.getBoundingClientRect().top,
    );
    expect(top).toBeLessThanOrEqual(headerBottom + 1);

    // And it fills what's left of the screen, controls included.
    const rect = await region.evaluate((node) =>
      node.getBoundingClientRect().toJSON(),
    );
    const viewport = page.viewportSize()!.height;
    expect(rect.height).toBeGreaterThanOrEqual(viewport - headerBottom - 2);
    expect(rect.bottom).toBeLessThanOrEqual(viewport + 1);

    await expect(
      page.getByRole("button", { name: "Next slide" }),
    ).toBeInViewport();
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
