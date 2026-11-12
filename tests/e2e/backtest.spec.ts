import { test, expect, type Page } from "@playwright/test";

const open = async (p: Page) => { await p.goto("/labs/strategy-tester.html"); await expect(p.locator("lab-backtest .lab-bt")).toBeVisible(); };
const run = async (p: Page) => { await p.getByRole("button", { name: "Run the test" }).click(); await expect(p.getByRole("heading", { name: "Result" })).toBeVisible(); };
const cardValue = (p: Page, k: string) => p.locator(".lab-card").filter({ has: p.getByText(k, { exact: true }) }).locator(".lab-card-v");

test.describe("Strategy tester", () => {
  test("says plainly that it is hypothetical, and runs the default test", async ({ page }) => {
    await open(page);
    await expect(page.getByText("Hypothetical backtest. Not live results.")).toBeVisible();
    await run(page);
    await expect(cardValue(page, "Money at the end")).toContainText("Rs");
    await expect(page.locator("lab-backtest svg.lab-chart").first()).toBeVisible();
  });
  test("the same seed gives the same answer; another seed does not", async ({ page }) => {
    await open(page); await run(page);
    const a = await cardValue(page, "Money at the end").innerText();
    await page.getByRole("button", { name: "Run the test" }).click(); await expect(page.getByText("Working…")).toHaveCount(0);
    expect(await cardValue(page, "Money at the end").innerText()).toBe(a);
    await page.getByText("Made-up prices", { exact: true }).click();
    await page.locator('input[name="seed"]').fill("12");
    await page.getByRole("button", { name: "Run the test" }).click();
    await expect(cardValue(page, "Money at the end")).not.toHaveText(a);
  });
  test("bad settings get a plain message and no result", async ({ page }) => {
    await open(page);
    await page.getByRole("radio", { name: "Two averages" }).click();
    await page.locator('input[name="fast"]').fill("60");
    await page.getByRole("button", { name: "Run the test" }).click();
    await expect(page.getByText("The fast average must be shorter than the slow one.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Result" })).toHaveCount(0);
  });
  test("every experiment runs and explains itself", async ({ page }) => {
    await open(page); await run(page);
    const names = [/^1\. Test on days/, /^2\. Peeking/, /^3\. Shares that disappeared/, /^4\. What if costs/, /^5\. Trying many settings/, /^6\. The same trades/];
    for (const n of names) {
      const d = page.locator("details.lab-exp").filter({ has: page.locator("summary", { hasText: n }) });
      await d.locator("summary").click();
      await d.getByRole("button", { name: "Run this" }).click();
      await expect(d.locator("table")).toBeVisible({ timeout: 15_000 });
    }
    await expect(page.getByText("Never seen (from")).toBeVisible();
  });
  test("keeps the trades in the journal under Backtest, without duplicates", async ({ page }) => {
    await open(page); await run(page);
    await page.getByRole("button", { name: "Add to my journal" }).click();
    await expect(page.getByText(/^Added \d+ trades\./)).toBeVisible();
    await page.goto("/labs/journal.html");
    await page.getByRole("radio", { name: "Backtest" }).click();
    await page.getByRole("tab", { name: "Dashboard" }).click();
    const n = await page.locator(".lab-card").filter({ has: page.getByText("Closed trades", { exact: true }) }).locator(".lab-card-v").innerText();
    expect(Number(n.replace(/,/g, ""))).toBeGreaterThan(0);
    await page.goto("/labs/strategy-tester.html"); await run(page);
    await page.getByRole("button", { name: "Add to my journal" }).click();
    await expect(page.getByText(/^Added \d+ trades\./)).toBeVisible();
    await page.goto("/labs/journal.html");
    await page.getByRole("radio", { name: "Backtest" }).click();
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.locator(".lab-card").filter({ has: page.getByText("Closed trades", { exact: true }) }).locator(".lab-card-v")).toHaveText(n);
  });
  test("works on a phone: no sideways scroll, big tap targets", async ({ page }) => {
    await open(page); await run(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const b of await page.locator("lab-backtest .lab-btn, lab-backtest .lab-seg-btn").all()) { const box = await b.boundingBox(); if (box) expect(box.height).toBeGreaterThanOrEqual(43.5); }
  });
});
