import { test, expect } from "@playwright/test";

test.describe("project brief form (/lets-work)", () => {
  test("rejects an empty submission with field errors", async ({ page }) => {
    await page.goto("/lets-work");
    const submit = page.getByRole("button", { name: /send|submit/i });
    await submit.click();

    // Required fields: name, email, project. All three should be flagged.
    await expect(page.locator('[name="name"][aria-invalid="true"]')).toBeVisible();
    await expect(page.locator('[name="email"][aria-invalid="true"]')).toBeVisible();
    await expect(
      page.locator('[name="project"][aria-invalid="true"]'),
    ).toBeVisible();
  });

  test("holds values across a failed submit", async ({ page }) => {
    await page.goto("/lets-work");
    await page.locator('[name="name"]').fill("Ada Test");
    await page.locator('[name="company"]').fill("Test Co");
    // Leave email and project empty so the submit still fails validation.
    await page.getByRole("button", { name: /send|submit/i }).click();

    await expect(page.locator('[name="name"]')).toHaveValue("Ada Test");
    await expect(page.locator('[name="company"]')).toHaveValue("Test Co");
  });

  test("succeeds with valid data", async ({ page }) => {
    await page.goto("/lets-work");
    await page.locator('[name="name"]').fill("Ada Test");
    await page.locator('[name="email"]').fill(`ada.${Date.now()}@example.com`);
    await page
      .locator('[name="project"]')
      .fill("A test project brief submitted by the Playwright suite.");
    await page.getByRole("button", { name: /send|submit/i }).click();

    // The form is replaced by a success panel on ok — the name field should
    // no longer be on the page.
    await expect(page.locator('[name="name"]')).toHaveCount(0);
  });
});
