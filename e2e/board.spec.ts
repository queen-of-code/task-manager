import { expect, test } from "@playwright/test";

test("loads board and creates a card", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "task-manager" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Idea" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Won't do" })).toBeVisible();

  await page.getByRole("button", { name: "Add card to Idea" }).click();
  await page.getByLabel("New card title").fill("E2E smoke card");
  await page.getByRole("button", { name: "Add card" }).click();

  await expect(page.getByText("E2E smoke card")).toBeVisible();
});
