import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const fill = (p: Page, name: string, v: string) => p.locator(`input[name="${name}"]`).fill(v);
const open = async (p: Page) => { await p.goto("/labs/journal.html"); await expect(p.locator("lab-journal .lab-journal")).toBeVisible(); await expect(p.getByRole("tab", { name: "Trades" })).toBeVisible(); };

async function plan(p: Page, sym: string, entry: string, stop: string, qty: string, extra: { target?: string } = {}) {
  await p.getByRole("button", { name: "Plan a new trade" }).click();
  await fill(p, "symbol", sym); await fill(p, "p_entry", entry); await fill(p, "p_stop", stop); await fill(p, "p_qty", qty);
  if (extra.target) await fill(p, "p_target", extra.target);
  await p.getByRole("button", { name: "Save plan" }).click();
  await expect(p.locator(`.lab-trade:has-text("${sym.toUpperCase()}")`).first()).toBeVisible();
}
const card = (p: Page, sym: string) => p.locator(".lab-trade", { hasText: sym }).first();
async function buy(p: Page, sym: string, price: string, qty?: string) {
  await card(p, sym).getByRole("button", { name: "I bought" }).click();
  await fill(p, "b_price", price); if (qty) await fill(p, "b_qty", qty);
  await p.getByRole("button", { name: "Save buy" }).click();
}
async function sell(p: Page, sym: string, price: string, qty?: string) {
  await card(p, sym).getByRole("button", { name: "I sold" }).click();
  await fill(p, "s_price", price); if (qty) await fill(p, "s_qty", qty);
  await p.getByRole("button", { name: "Save sell" }).click();
}

test.describe("trade journal", () => {
  test("empty journal explains what to do first", async ({ page }) => {
    await open(page);
    await expect(page.getByText("No paper trades yet")).toBeVisible();
  });

  test("plan shows the planned loss live and rejects a stop above the entry", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Plan a new trade" }).click();
    await fill(page, "p_entry", "100"); await fill(page, "p_stop", "95"); await fill(page, "p_qty", "100");
    await expect(page.locator(".lab-planrisk")).toContainText("Rs 500.00");
    await fill(page, "symbol", "abc"); await fill(page, "p_stop", "105");
    await page.getByRole("button", { name: "Save plan" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "below the entry" })).toBeVisible();
    await expect(page.locator(".lab-trade")).toHaveCount(0);
  });

  test("full life of a trade: plan, buy, sell in parts, review, dashboard", async ({ page }) => {
    await open(page);
    await plan(page, "tcs", "100", "95", "100", { target: "110" });
    await expect(card(page, "TCS")).toContainText("Planned");
    await buy(page, "TCS", "100");
    await expect(card(page, "TCS")).toContainText("Open");
    await sell(page, "TCS", "105", "40");
    await expect(card(page, "TCS")).toContainText("Open");
    await card(page, "TCS").getByRole("button", { name: "I sold" }).click();
    await fill(page, "s_price", "103");
    await expect(page.locator('input[name="s_qty"]')).toHaveValue("60");
    await page.getByRole("button", { name: "Save sell" }).click();
    await expect(card(page, "TCS")).toContainText("Closed");
    await expect(card(page, "TCS")).toContainText("In R");
    await card(page, "TCS").getByRole("button", { name: "Review this trade" }).click();
    await page.getByRole("button", { name: "Calm" }).click();
    await page.getByLabel("Notes").fill("Waited for the level.");
    await page.getByRole("button", { name: "Save review" }).click();
    await expect(card(page, "TCS")).not.toContainText("Broke the plan");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByText("Too few trades to trust")).toBeVisible();
    await expect(page.locator(".lab-card", { hasText: /^Closed trades/ })).toContainText("1");
    await expect(page.locator(".lab-card", { hasText: /^Plan followed/ })).toContainText("100%");
    await expect(page.locator("svg.lab-chart")).toHaveCount(3);
  });

  test("you cannot sell more than you hold", async ({ page }) => {
    await open(page);
    await plan(page, "abc", "100", "95", "10"); await buy(page, "ABC", "100");
    await sell(page, "ABC", "101", "11");
    await expect(page.getByRole("alert").filter({ hasText: "only have 10 shares left" })).toBeVisible();
  });

  test("changing the plan after buying is allowed but stays visible", async ({ page }) => {
    await open(page);
    await plan(page, "abc", "100", "95", "10"); await buy(page, "ABC", "100");
    await card(page, "ABC").getByRole("button", { name: "Change plan" }).click();
    await expect(page.getByText("saved in the trade's history")).toBeVisible();
    await fill(page, "e_stop", "90");
    await page.getByRole("button", { name: "Save change" }).click();
    await expect(card(page, "ABC")).toContainText("Plan changed after buying");
    await expect(card(page, "ABC")).toContainText("Stop-loss changed from Rs 95.00 to Rs 90.00");
  });

  test("paper, live and other modes are kept apart", async ({ page }) => {
    await open(page);
    await plan(page, "pap", "100", "95", "10");
    await page.getByRole("radio", { name: "Live" }).click();
    await expect(page.locator(".lab-trade")).toHaveCount(0);
    await expect(page.getByText("No live trades yet")).toBeVisible();
    await page.getByRole("radio", { name: "Paper" }).click();
    await expect(card(page, "PAP")).toBeVisible();
  });

  test("everything is still there after a reload (saved on this device)", async ({ page }) => {
    await open(page);
    await plan(page, "keep", "100", "95", "10");
    await page.getByRole("radio", { name: "Live" }).click();
    await expect(page.getByText("No live trades yet")).toBeVisible(); // shown once the choice is saved
    await page.reload();
    await expect(page.getByRole("radio", { name: "Live" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("radio", { name: "Paper" }).click();
    await expect(card(page, "KEEP")).toBeVisible();
  });

  test("delete asks twice", async ({ page }) => {
    await open(page);
    await plan(page, "del", "100", "95", "10");
    const b = card(page, "DEL").getByRole("button", { name: "Delete" });
    await b.click();
    await expect(card(page, "DEL")).toBeVisible();
    await card(page, "DEL").getByRole("button", { name: "Tap again to delete" }).click();
    await expect(page.locator(".lab-trade")).toHaveCount(0);
  });

  test("notes can be added and removed", async ({ page }) => {
    await open(page);
    await page.getByLabel("New note").fill("Week went fine.");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.getByText("Week went fine.")).toBeVisible();
    await page.getByRole("button", { name: "Delete note" }).click();
    await expect(page.getByText("Week went fine.")).toHaveCount(0);
  });

  test("backup: download, wipe, restore with a preview", async ({ page }, info) => {
    await open(page);
    await plan(page, "bak", "100", "95", "10");
    await page.getByRole("tab", { name: "Backup" }).click();
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download backup" }).click();
    const path = info.outputPath("backup.json");
    await (await dl).saveAs(path);
    const file = JSON.parse(readFileSync(path, "utf8"));
    expect(file.format).toBe("cft-backup"); expect(file.data.journal).toHaveLength(1);
    await expect(page.getByText("Backup saved.")).toBeVisible();

    await page.evaluate(() => new Promise<void>((res) => { const r = indexedDB.deleteDatabase("cft-local"); r.onsuccess = () => res(); r.onblocked = () => res(); }));
    await page.reload();
    await expect(page.getByText("No paper trades yet")).toBeVisible();
    await page.getByRole("tab", { name: "Backup" }).click();
    await page.getByLabel("Choose a backup file").setInputFiles(path);
    await expect(page.getByText("would add 1, update 0")).toBeVisible();
    await page.getByRole("button", { name: "Import now" }).click();
    await expect(page.getByText("Done. Added 1")).toBeVisible();
    await page.getByRole("tab", { name: "Trades" }).click();
    await expect(card(page, "BAK")).toBeVisible();
  });

  test("locked backup needs its passphrase and a wrong one is refused kindly", async ({ page }, info) => {
    await open(page);
    await plan(page, "sec", "100", "95", "10");
    await page.getByRole("tab", { name: "Backup" }).click();
    await page.getByLabel("Passphrase (optional)").fill("correct horse");
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download backup" }).click();
    const path = info.outputPath("locked.json");
    await (await dl).saveAs(path);
    expect(readFileSync(path, "utf8")).not.toContain("SEC");
    await page.getByLabel("Choose a backup file").setInputFiles(path);
    await expect(page.getByText("This file is locked")).toBeVisible();
    await page.getByLabel(/Passphrase for the file/).fill("wrong wrong");
    await page.getByLabel("Choose a backup file").setInputFiles(path);
    await expect(page.getByText("Wrong passphrase")).toBeVisible();
    await page.getByLabel(/Passphrase for the file/).fill("correct horse");
    await page.getByLabel("Choose a backup file").setInputFiles(path);
    await expect(page.getByText(/would add 0, update 0, and leave 1/)).toBeVisible();
  });

  test("a file that is not a backup is refused in plain words", async ({ page }, info) => {
    await open(page);
    await page.getByRole("tab", { name: "Backup" }).click();
    const bad = info.outputPath("bad.json"); writeFileSync(bad, '{"hello":1}');
    await page.getByLabel("Choose a backup file").setInputFiles(bad);
    await expect(page.getByText("not a backup file from this book")).toBeVisible();
  });

  test("CSV download has a header and one row per trade", async ({ page }, info) => {
    await open(page);
    await plan(page, "csv", "100", "95", "10");
    await page.getByRole("tab", { name: "Backup" }).click();
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: /spreadsheet/ }).click();
    const path = info.outputPath("t.csv"); await (await dl).saveAs(path);
    const lines = readFileSync(path, "utf8").trim().split("\n");
    expect(lines).toHaveLength(2); expect(lines[1]).toContain("CSV");
  });

  test("daily loss limit lists the days it was broken", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Backup" }).click();
    await fill(page, "limit", "100");
    await page.getByRole("button", { name: "Save limit" }).click();
    await page.getByRole("tab", { name: "Trades" }).click();
    await plan(page, "los", "100", "95", "100"); await buy(page, "LOS", "100"); await sell(page, "LOS", "95");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByText(/over your limit of Rs 100.00/)).toBeVisible();
  });

  test("layout: no sideways scroll and big tap targets", async ({ page }, info) => {
    await open(page);
    await plan(page, "lay", "100", "95", "10");
    await card(page, "LAY").getByRole("button", { name: "I bought" }).click();
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(w[0]).toBeLessThanOrEqual(w[1]!);
    if (info.project.name === "phone") {
      const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".lab-journal button, .lab-journal input:not([type=checkbox]), .lab-journal textarea")]
        .map((e) => ({ n: e.textContent?.trim() || e.getAttribute("name"), h: Math.round(e.getBoundingClientRect().height), f: parseFloat(getComputedStyle(e).fontSize), tag: e.tagName }))
        .filter((x) => x.h && (x.h < 44 || (x.tag !== "BUTTON" && x.f < 16))));
      expect(small).toEqual([]);
    }
  });
});

test("weekly review: shows this week, saves, edits, and survives reload", async ({ page }) => {
  await open(page);
  await page.getByRole("tab", { name: "Weekly review" }).click();
  await expect(page.getByText("This week", { exact: true })).toBeVisible();
  await expect(page.getByText(/No paper trades were closed this week/)).toBeVisible();
  await page.getByRole("button", { name: "Save review" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "at least one line" })).toBeVisible();
  await page.getByLabel("Moved or removed a stop-loss").check();
  await page.getByLabel("What went well?").fill("Waited for my entry");
  await page.getByLabel("One rule for next week").fill("No trades after 2 pm");
  await page.getByRole("button", { name: "Save review" }).click();
  await expect(page.getByText("Review saved.")).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "Weekly review" }).click();
  await expect(page.getByLabel("What went well?")).toHaveValue("Waited for my entry");
  await expect(page.getByLabel("Moved or removed a stop-loss")).toBeChecked();
  await expect(page.getByRole("button", { name: "Update review" })).toBeVisible();
  // earlier week is empty, and the saved one shows under "Earlier reviews" from there
  await page.getByRole("button", { name: "Earlier week" }).click();
  await expect(page.getByText("Last week", { exact: true })).toBeVisible();
  await expect(page.getByLabel("What went well?")).toHaveValue("");
  await expect(page.getByText("Earlier reviews")).toBeVisible();
  await expect(page.getByText("No trades after 2 pm")).toBeVisible();
  await page.getByRole("button", { name: "Later week" }).click();
  await expect(page.getByRole("button", { name: "Later week" })).toBeDisabled();
});

test("weekly review: counts this week's closed trade and is phone friendly", async ({ page }) => {
  await open(page);
  await plan(page, "TCS", "100", "95", "10");
  await buy(page, "TCS", "100");
  await sell(page, "TCS", "110");
  await page.getByRole("tab", { name: "Weekly review" }).click();
  await expect(page.getByText("Trades closed")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const el of await page.locator(".lab-journal button:visible, .lab-journal .lab-check:visible").all()) {
    const b = await el.boundingBox(); expect(b!.height).toBeGreaterThanOrEqual(43.5);
  }
});
