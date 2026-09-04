import { test, expect } from "@playwright/test";

test.describe("admin auth", () => {
  test("unauthenticated visitor is redirected to login", async ({ page }) => {
    await page.goto("/admin/submissions");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("wrong password is rejected", async ({ page }) => {
    test.skip(!process.env.ADMIN_EMAIL, "ADMIN_EMAIL not set");

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("correct credentials sign in and reach the dashboard", async ({
    page,
  }) => {
    test.skip(
      !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
      "ADMIN_EMAIL/ADMIN_PASSWORD not set",
    );

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin$/);

    // A signed-in visitor hitting /admin/login again is bounced to the
    // dashboard rather than shown the form.
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin$/);
  });
});
