import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('should allow user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  //get the signin
  await page.getByRole("link", { name: "Sign-In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Signed In Successfully!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow user to register", async ({ page })=> {
  const randoEmail = `test_register_${Math.floor(Math.random()* 50000) + 10000}@testing.com`
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign-In" }).click();
  await page.getByRole("link", { name: "Create Account" }).click();
  await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName")
  await page.locator("[name=lastName]").fill("test_lastName")
  await page.locator("[name=email]").fill(randoEmail)
  await page.locator("[name=password]").fill("password321")
  await page.locator("[name=confirmPassword]").fill("password321")

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("You Are Registered!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
