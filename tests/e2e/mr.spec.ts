import { test, expect } from "@playwright/test";

const chapter = "/mr/00-start-here/01-what-trading-is-and-is-not/index.html";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {}
  });
});

test("switcher appears on a deep English page and keeps the path", async ({ page }) => {
  await page.goto("/00-start-here/01-what-trading-is-and-is-not/index.html");
  const sw = page.locator(".cft-lang-switch");
  await expect(sw).toBeVisible();
  await expect(sw).toContainText("English");
  const mr = sw.locator('a[hreflang="mr"]');
  await expect(mr).toHaveAttribute("href", "/mr/00-start-here/01-what-trading-is-and-is-not/index.html");
  await mr.click();
  await expect(page).toHaveURL(/\/mr\/00-start-here\/01-what-trading-is-and-is-not\/index\.html$/);
  await expect(page.locator(".cft-lang-switch")).toContainText("मराठी");
  await expect(page.locator('.cft-lang-switch a[hreflang="en"]')).toHaveAttribute(
    "href",
    "/00-start-here/01-what-trading-is-and-is-not/index.html",
  );
});

test("Marathi front page is translated and marked draft", async ({ page }) => {
  await page.goto("/mr/index.html");
  await expect(page.locator("main")).toHaveAttribute("data-page-lang", "mr");
  await expect(page.locator("main h1").first()).toHaveText("भांडवल-प्रथम ट्रेडिंग");
  await expect(page.locator(".cft-lang-notice")).toContainText("मसुदा भाषांतर");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  const manifest = await page.request.get("/mr/manifest.webmanifest");
  expect(await manifest.text()).toContain("भांडवल-प्रथम");
});

test("T0.1 quiz is Marathi, the disclaimer is Marathi, and Devanagari digits work", async ({ page }) => {
  await page.goto(chapter);
  await expect(page.locator("main")).toHaveAttribute("data-page-lang", "mr");
  await expect(page.locator("main")).toHaveAttribute("data-quiz-lang", "mr");
  await expect(page.locator(".cft-disclaimer")).toHaveText("फक्त शिक्षणासाठी. हा गुंतवणुकीचा सल्ला नाही.");
  await expect(page.locator(".cft-quiz .cft-box-title")).toHaveText("क्विझ");
  await expect(page.locator(".cft-q").first()).toContainText("काल्पनिक मित्र");

  const numeric = page.locator(".cft-q").filter({ has: page.locator("input.cft-num") }).first();
  await numeric.locator("input.cft-num").fill("८५.७");
  await numeric.getByRole("button", { name: "तपासा" }).click();
  await expect(numeric.locator(".cft-feedback.cft-ok")).toBeVisible();
  await expect(numeric.locator(".cft-feedback")).toContainText("85.7");
});

// Fallback pages are covered by tests/i18n/assemble.test.ts: every chapter is translated now,
// so no chapter page falls back. The lab page below still shows the English wrapper.

test("labs index is translated; a lab page keeps English with a calmer notice", async ({ page }) => {
  await page.goto("/mr/labs/index.html");
  await expect(page.locator("main")).toHaveAttribute("data-page-lang", "mr");
  await expect(page.locator("main h1").first()).toHaveText("प्रयोगशाळा");

  await page.goto("/mr/labs/cost-calculator.html");
  await expect(page.locator("main")).toHaveAttribute("data-page-lang", "en");
  await expect(page.locator(".cft-lang-notice")).toContainText("हे साधन सध्या इंग्रजीत आहे.");
  await expect(page.locator('main div[lang="en"]')).toHaveCount(1);
});

test("no horizontal scroll, 44px quiz buttons and 16px inputs", async ({ page }) => {
  await page.goto(chapter);
  await expect(page.locator(".cft-quiz")).toBeVisible();
  const noScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noScroll).toBe(true);
  const btn = page.locator(".cft-quiz .cft-btn").first();
  const box = await btn.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  const input = page.locator("input.cft-num").first();
  await expect(input).toBeVisible();
  const fontSize = await input.evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(16);
});

test("translated headings have Devanagari ids and the search index has Marathi", async ({ page }) => {
  await page.goto(chapter);
  const id = await page.locator("main h2").first().getAttribute("id");
  expect(id).toBeTruthy();
  expect(id ?? "").toMatch(/[^\x00-\x7F]/);
  const index = await page.request.get("/mr/searchindex.js");
  expect(await index.text()).toContain("भांडवल");
});

test("hreflang links point both ways for translated pages", async ({ page }) => {
  await page.goto(chapter);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await page.goto("/00-start-here/01-what-trading-is-and-is-not/index.html");
  await expect(page.locator('link[rel="alternate"][hreflang="mr"]')).toHaveCount(1);
});

test("the Marathi book loads offline under its mr/ service-worker scope", async ({ page, context }) => {
  await page.goto("/mr/index.html");
  await expect(page.locator("main h1").first()).toHaveText("भांडवल-प्रथम ट्रेडिंग");
  await page.evaluate(async () => {
    if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
  });
  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page.locator("main h1").first()).toHaveText("भांडवल-प्रथम ट्रेडिंग");
  } finally {
    await context.setOffline(false);
  }
});
