import { expect, test } from "@playwright/test";

test("customer can browse catalogue and switch locale", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Explore Machines" }).click();
  await expect(page).toHaveURL(/\/en\/shop/);
  await expect(page.getByText("ZJ9000E-D4 Direct Drive Lockstitch")).toBeVisible();
  await page.goto("/hi");
  await expect(page.getByText("मशीनें देखें")).toBeVisible();
});
