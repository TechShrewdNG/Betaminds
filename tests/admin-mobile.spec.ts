import { test, expect } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };

const ADMIN_PAGES = [
  "/admin",
  "/admin/submissions",
  "/admin/media",
  "/admin/content/home",
  "/admin/account",
];

test.describe("admin on mobile", () => {
  test.skip(
    !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
    "ADMIN_EMAIL/ADMIN_PASSWORD not set",
  );

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/admin$/);
  });

  test("the nav is behind a hamburger, and the toggle closes it again", async ({
    page,
  }) => {
    const nav = page.getByLabel("Admin");
    await expect(nav).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(nav).toBeVisible();

    // The toggle stays reachable over the open drawer — it's the close button.
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toBeInViewport();
    await close.click();
    await expect(nav).toBeHidden();
  });

  test("choosing a page navigates and dismisses the drawer", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByLabel("Admin");
    await nav.getByRole("link", { name: "Homepage" }).click();

    await expect(page).toHaveURL(/\/admin\/content\/home$/);
    await expect(nav).toBeHidden();
  });

  test("no admin page overflows sideways", async ({ page }) => {
    for (const path of ADMIN_PAGES) {
      await page.goto(path);
      const overflow = await page.evaluate(() => {
        const { scrollWidth, clientWidth } = document.documentElement;
        return scrollWidth - clientWidth;
      });
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });

  test("the sidebar is simply present on desktop, with no hamburger", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/admin");

    await expect(page.getByLabel("Admin")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });
});
