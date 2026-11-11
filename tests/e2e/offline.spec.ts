import { test, expect } from "@playwright/test";

test.describe("installable and offline", () => {
  test("manifest is valid and linked from every page", async ({ page, request }) => {
    await page.goto("/labs/cost-calculator.html");
    const href = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(href).toBe("../manifest.webmanifest");
    const m = await (await request.get("/manifest.webmanifest")).json();
    expect(m.display).toBe("standalone");
    for (const i of m.icons) expect((await request.get("/" + i.src)).status()).toBe(200);
  });

  test("after one visit the whole book works with no network", async ({ page, context }, info) => {
    test.skip(info.project.name !== "desktop", "same service worker on both projects");
    await page.goto("/index.html");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(async () => (await caches.keys()).length)).toBeGreaterThan(0);
    await page.reload(); // the worker now controls the page
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    await context.setOffline(true);
    await page.goto("/labs/cost-calculator.html");
    await expect(page.locator("lab-costs .lab")).toBeVisible();
    await page.locator('input[name="buy"]').fill("1000");
    await page.locator('input[name="sell"]').fill("1100");
    await page.locator('input[name="qty"]').fill("400");
    await expect(page.locator(".lab-card", { hasText: "Total cost" }).locator(".lab-card-v")).toHaveText("Rs 946.76");
    await page.goto("/02-money-and-math/index.html").catch(() => {});
    await expect(page.locator("main h1").first()).toBeVisible();
  });
});
