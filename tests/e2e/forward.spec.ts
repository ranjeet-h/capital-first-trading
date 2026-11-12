import { test, expect, type Page } from "@playwright/test";

const LOG = "tools/forward-test/sample/expected_forward_log.csv", STATE = "tools/forward-test/sample/expected_forward_state.json";
const open = async (p: Page) => { await p.goto("/labs/forward-test.html"); await expect(p.locator("lab-forward .lab-fw")).toBeVisible(); };
const read = async (p: Page, state = true) => { await p.locator('input[name="forward-log"]').setInputFiles(LOG); if (state) await p.locator('input[name="forward-state"]').setInputFiles(STATE); await p.getByRole("button", { name: "Read the files" }).click(); };

test.describe("Forward test importer", () => {
  test("says plainly the trades are hypothetical", async ({ page }) => {
    await open(page);
    await expect(page.getByText("Hypothetical trades. No orders were placed.")).toBeVisible();
  });
  test("asks for the log file first", async ({ page }) => {
    await open(page); await page.getByRole("button", { name: "Read the files" }).click();
    await expect(page.getByRole("alert")).toContainText("Choose the forward_log.csv file first");
  });
  test("previews, compares with earlier days, imports, and never makes copies", async ({ page }) => {
    await open(page); await read(page);
    await expect(page.getByText(/Found 14 trades: 14 new, 0 changed since last time, 0 already/)).toBeVisible();
    await expect(page.getByText("Compared with the same rule on earlier days")).toBeVisible();
    await expect(page.getByText("Fewer than 30: too few to trust")).toBeVisible();
    await page.getByRole("button", { name: "Add 14 to my Forward journal" }).click();
    await expect(page.getByText("Added 14 trades.")).toBeVisible();
    await read(page);
    await expect(page.getByText(/14 already in your journal/)).toBeVisible();
    await expect(page.getByText("Nothing new to add.")).toBeVisible();
  });
  test("the trades show up in the journal under Forward only", async ({ page }) => {
    await open(page); await read(page, false);
    await page.getByRole("button", { name: /Add 14/ }).click(); await expect(page.getByText("Added 14 trades.")).toBeVisible();
    await page.goto("/labs/journal.html"); await expect(page.locator("lab-journal .lab")).toBeVisible();
    await page.getByRole("radio", { name: "Forward" }).click();
    await expect(page.locator("lab-journal").getByText("CCC").first()).toBeVisible();
    await page.getByRole("radio", { name: "Live" }).click();
    await expect(page.locator("lab-journal").getByText("CCC")).toHaveCount(0);
  });
  test("a wrong file gets a plain message", async ({ page }) => {
    await open(page);
    await page.locator('input[name="forward-log"]').setInputFiles({ name: "x.csv", mimeType: "text/csv", buffer: Buffer.from("a,b\n1,2\n") });
    await page.getByRole("button", { name: "Read the files" }).click();
    await expect(page.getByRole("alert")).toContainText("Missing columns");
  });
  test("fits the screen with big enough controls", async ({ page }) => {
    await open(page); await read(page);
    await expect(page.getByText("Compared with the same rule")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const b of await page.locator("lab-forward .lab-btn").all()) { const box = await b.boundingBox(); if (box) expect(box.height).toBeGreaterThanOrEqual(43.5); }
    for (const i of await page.locator("lab-forward input:not([type=file])").all()) expect(await i.evaluate((e) => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  });
});
