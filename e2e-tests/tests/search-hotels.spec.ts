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

test("Should show hotel search results", async({page})=> {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Dream Here...").fill("Denver");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in Denver")).toBeVisible();
  await expect(page.getByText("Danish has a hotel that is very very good")).toBeVisible();
});

test("needs to show hotel detail", async({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Dream Here...").fill("Denver");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Danish Hotel").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", {name: "Reserve Now"})).toBeVisible();
});