import { expect, test } from "@playwright/test";

test("customer can browse catalogue and switch locale", async ({ page }) => {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Explore Machines" }).click();
  await expect(page).toHaveURL(/\/en\/shop/);
  await expect(page.getByText("ZJ9000E-D4 Direct Drive Lockstitch")).toBeVisible();
  await page.goto("/hi");
  await expect(page.getByText("मशीनें देखें")).toBeVisible();
});

test("mobile header keeps every essential action visible without horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Checked in the mobile browser project.");
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });

  const header = page.locator("header");
  await expect(header.locator('input[aria-label="Search catalogue"]:visible')).toBeVisible();
  await expect(header.locator('select[aria-label="Language"]:visible')).toBeVisible();
  await expect(header.locator('a[aria-label="Saved machines"]:visible')).toBeVisible();
  await expect(header.locator('a[aria-label="Call Sunil Silai Machine"]:visible')).toBeVisible();
  await expect(header.locator('button[aria-label="Toggle menu"]:visible')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
