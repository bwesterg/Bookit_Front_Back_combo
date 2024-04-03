import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async({ page })=> {
  await page.goto(UI_URL);

  //get the signin
  await page.getByRole("link", { name: "Sign-In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Signed In Successfully!")).toBeVisible();
});

test("hopefully, users can add a hotel", async ({page}) => {
  await page.goto(`${UI_URL}/add-hotel`)

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="state"]').fill("Test State");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("testing 123 for description");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("Spartan").click();
  await page.getByLabel("Wifi Included").check();
  await page.getByLabel("Air Conditioning").check();
  await page.locator('[name="adultCount"]').fill("3");
  await page.locator('[name="childCount"]').fill("1");
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "test-image1.webp"),
    path.join(__dirname, "files", "test-image2.webp"),
  ])

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("Danish Hotel")).toBeVisible();
  await expect(page.getByText("a good boy")).toBeVisible();
  await expect(page.getByText("Denver, CO, USA")).toBeVisible();
  await expect(page.getByText("$502 per night")).toBeVisible();
  await expect(page.getByText("8 adults, 2 children")).toBeVisible();
  // await expect(page.getByText("3 out of 5 stars")).toBeVisible();

  await expect(page.getByRole("link", { name: "Edit" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  await page.getByRole("link", { name: "Edit" }).first().click();
  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue('Danish Hotel');
  await page.locator('[name="name"]').fill("UPDATED Danish Hotel UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Updated")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue("UPDATED Danish Hotel UPDATED");
  await page.locator('[name="name"]').fill("Danish Hotel");
  await page.getByRole("button", { name: "Save" }).click();
});