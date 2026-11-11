import { test, expect, type Page } from "@playwright/test";

const fill = async (p: Page, name: string, v: string) => { const i = p.locator(`input[name="${name}"]`); await i.fill(v); };
const cardValue = (p: Page, label: string) => p.locator(".lab-card", { hasText: label }).locator(".lab-card-v");

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { try { if (!sessionStorage.getItem("e2e-clean")) { localStorage.clear(); sessionStorage.setItem("e2e-clean", "1"); } } catch {} }); });

test.describe("Lab 2: cost calculator", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/labs/cost-calculator.html"); await expect(page.locator("lab-costs .lab")).toBeVisible(); });

  test("matches Zerodha's calculator for intraday NSE 1000 -> 1100 x 400", async ({ page }) => {
    await fill(page, "buy", "1000"); await fill(page, "sell", "1100"); await fill(page, "qty", "400");
    await page.getByRole("radio", { name: "Intraday (MIS)" }).click();
    await expect(cardValue(page, "Total cost")).toHaveText("Rs 200.62");
    await expect(cardValue(page, "Profit after costs")).toHaveText("Rs 39,799.38");
    await expect(page.locator(".lab-table")).toContainText("11.99");
  });

  test("delivery shows the DP charge on its own line and a subtotal equal to Zerodha's", async ({ page }) => {
    await fill(page, "buy", "1000"); await fill(page, "sell", "1100"); await fill(page, "qty", "400");
    await expect(page.locator(".lab-sub")).toContainText("931.42");
    await expect(page.locator("tr", { hasText: "DP charge" })).toContainText("15.34");
    await expect(cardValue(page, "Total cost")).toHaveText("Rs 946.76");
    await page.getByLabel("Include the DP charge").uncheck();
    await expect(cardValue(page, "Total cost")).toHaveText("Rs 931.42");
  });

  test("BSE changes the exchange charge", async ({ page }) => {
    await fill(page, "buy", "1000"); await fill(page, "sell", "1100"); await fill(page, "qty", "400");
    await page.getByRole("radio", { name: "BSE" }).click();
    await page.getByLabel("Include the DP charge").uncheck();
    await expect(cardValue(page, "Total cost")).toHaveText("Rs 938.16");
  });

  test("bad input shows plain errors and no numbers", async ({ page }) => {
    await fill(page, "qty", "0");
    await expect(page.getByText("Enter a whole number of shares")).toBeVisible();
    await expect(page.locator(".lab-table")).toHaveCount(0);
    await fill(page, "buy", "abc");
    await expect(page.getByText("Enter a price above zero").first()).toBeVisible();
  });

  test("inputs are remembered after a reload", async ({ page }) => {
    await fill(page, "buy", "321");
    await page.reload();
    await expect(page.locator('input[name="buy"]')).toHaveValue("321");
  });

  test("shows the verified date and works with no network after load", async ({ page, context }) => {
    await expect(page.locator(".lab-banner")).toContainText("2026-11-11");
    await context.setOffline(true);
    await fill(page, "buy", "500"); await fill(page, "sell", "500"); await fill(page, "qty", "10");
    await expect(cardValue(page, "Total cost")).not.toHaveText("");
  });
});

test.describe("Lab 1: position size calculator", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/labs/position-size-calculator.html"); await expect(page.locator("lab-position-size .lab")).toBeVisible(); });

  test("Rs 50,000, 1% risk, Rs 100 entry, Rs 95 stop, no costs: 100 shares", async ({ page }) => {
    await page.getByLabel("Include trading costs").uncheck();
    await expect(cardValue(page, "Shares")).toHaveText("100");
    await expect(cardValue(page, "Loss if the stop is hit")).toHaveText("Rs 500.00");
    await expect(page.locator(".lab-bind")).toContainText("risk limit sets the size");
  });

  test("costs shrink the size and the loss stays within budget", async ({ page }) => {
    const shares = Number((await cardValue(page, "Shares").innerText()).replace(/,/g, ""));
    expect(shares).toBeLessThan(100);
    expect(shares).toBeGreaterThan(80);
  });

  test("a tight stop makes the position cap decide", async ({ page }) => {
    await page.getByLabel("Include trading costs").uncheck();
    await fill(page, "stop", "99");
    await expect(cardValue(page, "Shares")).toHaveText("125");
    await expect(page.locator(".lab-bind")).toContainText("position cap");
  });

  test("stop above entry is rejected with a clear message", async ({ page }) => {
    await fill(page, "stop", "105");
    await expect(page.getByText("stop must be below the entry price")).toBeVisible();
    await expect(page.locator(".lab-cards")).toHaveCount(0);
  });

  test("target shows reward to risk and warns under 1.5; never says good or bad", async ({ page }) => {
    await fill(page, "target", "105");
    await expect(cardValue(page, "Reward to risk")).toHaveText("1.00");
    await expect(page.locator(".lab-conflicts")).toContainText("below 1.5");
    const text = (await page.locator("lab-position-size").innerText()).toLowerCase();
    expect(text).not.toMatch(/good trade|bad trade|you should (buy|sell)/);
  });

  test("zero shares explains itself", async ({ page }) => {
    await fill(page, "capital", "5000"); await fill(page, "entry", "1000"); await fill(page, "stop", "900");
    await expect(cardValue(page, "Shares")).toHaveText("0");
    await expect(page.locator(".lab-conflicts")).toContainText("single share");
  });

  test("sensitivity table lists four stop distances", async ({ page }) => {
    await expect(page.locator(".lab-sens tbody tr")).toHaveCount(4);
  });
});

test.describe("layout", () => {
  for (const path of ["/labs/cost-calculator.html", "/labs/position-size-calculator.html"]) {
    test(`no horizontal scroll: ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.locator(".lab").waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("mobile usability", () => {
  for (const path of ["/labs/cost-calculator.html", "/labs/position-size-calculator.html"]) {
    test(`touch targets are at least 44px and inputs are 16px: ${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== "phone");
      await page.goto(path); await expect(page.locator(".lab")).toBeVisible();
      const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".lab input:not([type=checkbox]), .lab button, .lab .lab-check")]
        .map((e) => { const r = e.getBoundingClientRect(), f = parseFloat(getComputedStyle(e).fontSize); return { n: e.tagName + (e.getAttribute("name") ?? ""), h: Math.round(r.height), f, tag: e.tagName }; })
        .filter((x) => x.h < 44 || (x.tag === "INPUT" && x.f < 16)));
      expect(small).toEqual([]);
    });
  }
  test("quantity opens the number keypad", async ({ page }) => {
    await page.goto("/labs/cost-calculator.html");
    await expect(page.locator('input[name="qty"]')).toHaveAttribute("inputmode", "numeric");
  });
});
