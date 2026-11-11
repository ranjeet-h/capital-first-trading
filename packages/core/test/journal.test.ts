import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import type { Rates } from "../src/costs";
import { newTrade, recordEntry, addExit, amendPlan, statusOf, resultOf, validatePlan, newNote, tombstone, type Trade } from "../src/journal";
import { computeStats, lossLimitBreaches } from "../src/stats";

const rates = JSON.parse(readFileSync("data/rates/zerodha-equity.json", "utf8")) as Rates;
const P = (rs: number) => Math.round(rs * 100);
const plan = { entryPaise: P(100), stopPaise: P(95), qty: 100, setup: "breakout", thesis: "t", checklistOk: true };

function closed(i: number, qty: number, entry: number, exit: number, stop: number, costsRs: number, day: string, followed = true): Trade {
  let t = newTrade("t" + i, "2026-03-01T09:00:00Z", { mode: "paper", symbol: "abc", exchange: "NSE", product: "cnc", plan: { ...plan, entryPaise: P(entry), stopPaise: P(stop), qty } });
  t = recordEntry(t, "x", { at: day + "T09:20:00Z", pricePaise: P(entry), qty });
  t = addExit(t, "x", { at: day + "T14:00:00Z", qty, pricePaise: P(exit) });
  return { ...t, costs_paise: P(costsRs), followed_plan: followed };
}

describe("plan and life of a trade", () => {
  it("rejects bad plans in plain words", () => {
    expect(validatePlan({ ...plan, stopPaise: P(100) })[0]).toContain("below the entry");
    expect(validatePlan({ ...plan, qty: 1.5 })[0]).toContain("whole number");
    expect(validatePlan({ ...plan, targetPaise: P(90) })[0]).toContain("above the entry");
    expect(validatePlan(plan)).toEqual([]);
  });
  it("moves planned -> open -> closed, and blocks over-selling", () => {
    let t = newTrade("a", "n", { mode: "live", symbol: " tcs ", exchange: "NSE", product: "cnc", plan });
    expect(t.symbol).toBe("TCS"); expect(statusOf(t)).toBe("planned");
    t = recordEntry(t, "n", { at: "2026-03-02T09:20:00Z", pricePaise: P(101), qty: 100 }); expect(statusOf(t)).toBe("open");
    t = addExit(t, "n", { at: "2026-03-02T11:00:00Z", qty: 40, pricePaise: P(105) }); expect(statusOf(t)).toBe("open");
    expect(() => addExit(t, "n", { at: "z", qty: 61, pricePaise: P(106) })).toThrow("only have 60");
    t = addExit(t, "n", { at: "2026-03-02T14:00:00Z", qty: 60, pricePaise: P(103) }); expect(statusOf(t)).toBe("closed");
    expect(() => addExit(t, "n", { at: "z", qty: 1, pricePaise: P(1) })).toThrow("no open position");
  });
  it("partial exits: gross P&L is the sum over exits", () => {
    let t = newTrade("a", "n", { mode: "live", symbol: "X", exchange: "NSE", product: "mis", plan });
    t = recordEntry(t, "n", { at: "2026-03-02T09:20:00Z", pricePaise: P(100), qty: 100 });
    t = addExit(t, "n", { at: "2026-03-02T11:00:00Z", qty: 40, pricePaise: P(105) });
    t = addExit(t, "n", { at: "2026-03-02T14:00:00Z", qty: 60, pricePaise: P(98) });
    t = { ...t, costs_paise: 0 };
    expect(resultOf(t, rates).grossPaise).toBe(P(40 * 5 - 60 * 2)); // 200 - 120 = 80
  });
  it("amending the plan: free before entry, logged and flagged after", () => {
    let t = newTrade("a", "n", { mode: "paper", symbol: "X", exchange: "NSE", product: "cnc", plan });
    t = amendPlan(t, "n1", { stopPaise: P(94) });
    expect(t.amended_after_entry).toBe(false); expect(t.amendments).toEqual([]);
    t = recordEntry(t, "n2", { at: "2026-03-02T09:20:00Z", pricePaise: P(100), qty: 100 });
    t = amendPlan(t, "n3", { stopPaise: P(90) });
    expect(t.amended_after_entry).toBe(true);
    expect(t.amendments).toEqual([{ at: "n3", field: "stopPaise", from: P(94), to: P(90) }]);
    expect(amendPlan(t, "n4", { stopPaise: P(90) })).toBe(t); // no real change, no log
    expect(() => amendPlan(t, "n5", { stopPaise: P(100) })).toThrow("below the entry");
  });
  it("estimates costs with the same engine as Lab 2 when none are typed in", () => {
    let t = newTrade("a", "n", { mode: "live", symbol: "X", exchange: "NSE", product: "cnc", plan: { ...plan, entryPaise: P(1000), stopPaise: P(950), qty: 400 } });
    t = recordEntry(t, "n", { at: "2026-03-02T09:20:00Z", pricePaise: P(1000), qty: 400 });
    t = addExit(t, "n", { at: "2026-03-03T09:20:00Z", qty: 400, pricePaise: P(1100) });
    expect(resultOf(t, rates).costsPaise).toBe(94676); // Rs 946.76, matches Zerodha's calculator incl. DP
  });
  it("notes and tombstones", () => {
    expect(() => newNote("n", "t", "  ")).toThrow();
    const n = newNote("n", "t", " felt rushed ");
    expect(n.text).toBe("felt rushed");
    expect(tombstone(n, "t2")).toMatchObject({ deleted: true, updated_at: "t2" });
  });
});

describe("stats: 10 hand-computed trades", () => {
  // qty, entry, exit, stop, costs Rs, day. Net Rs: 980, -520, 490, -510, 295, -205, 392, -208, 194, -206
  const rows: [number, number, number, number, number, number][] = [
    [100, 100, 110, 95, 20, 1], [100, 100, 95, 95, 20, 2], [50, 200, 210, 190, 10, 3], [50, 200, 190, 190, 10, 4], [10, 1000, 1030, 980, 5, 5],
    [10, 1000, 980, 980, 5, 6], [200, 50, 52, 49, 8, 7], [200, 50, 49, 49, 8, 8], [20, 500, 510, 490, 6, 9], [20, 500, 490, 490, 6, 10],
  ];
  const results = rows.map((r, i) => resultOf(closed(i + 1, r[0], r[1], r[2], r[3], r[4], `2026-03-${String(r[5]).padStart(2, "0")}`, i !== 3), rates));
  const s = computeStats(results);

  it("counts, win rate, totals", () => {
    expect([s.count, s.wins, s.losses, s.winRate]).toEqual([10, 5, 5, 0.5]);
    expect(s.netPaise).toBe(P(702)); expect(s.costsPaise).toBe(P(98)); expect(s.grossPaise).toBe(P(800));
  });
  it("averages, payoff, expectancy, profit factor", () => {
    expect(s.avgWinPaise).toBeCloseTo(P(470.2), 6); expect(s.avgLossPaise).toBeCloseTo(-P(329.8), 6);
    expect(s.payoff).toBeCloseTo(470.2 / 329.8, 9);
    expect(s.expectancyPaise).toBeCloseTo(P(70.2), 6);
    expect(s.profitFactor).toBeCloseTo(2351 / 1649, 9);
    expect(s.expectancyR).toBeCloseTo((1.96 - 1.04 + 0.98 - 1.02 + 1.475 - 1.025 + 1.96 - 1.04 + 0.97 - 1.03) / 10, 9);
  });
  it("equity curve and max drawdown", () => {
    expect(s.equity.map((x) => x / 100)).toEqual([980, 460, 950, 440, 735, 530, 922, 714, 908, 702]);
    expect(s.maxDrawdownPaise).toBe(P(540));
  });
  it("adherence, amended count, cost share, low-sample warning, R histogram", () => {
    expect(s.planAdherence).toBeCloseTo(0.9, 9);
    expect(s.amendedCount).toBe(0);
    expect(s.costShareOfGrossProfit).toBeCloseTo(98 / 2400, 9); // gross wins 1000+500+300+400+200
    expect(s.lowSample).toBe(true);
    expect(s.rHistogram.reduce((a, b) => a + b.count, 0)).toBe(10);
  });
  it("streaks and daily-loss breaches", () => {
    const r = (net: number, day: string) => ({ id: day + net, mode: "paper" as const, status: "closed" as const, closedAt: day + "T10:00:00Z", grossPaise: net, costsPaise: 0, netPaise: net, plannedRiskPaise: 100, r: net / 100, amended: false });
    const rs = [r(5, "2026-04-01"), r(5, "2026-04-02"), r(5, "2026-04-03"), r(-3, "2026-04-04"), r(-4, "2026-04-04"), r(-1, "2026-04-05")];
    const st = computeStats(rs);
    expect([st.maxWinStreak, st.maxLossStreak]).toEqual([3, 3]);
    expect(lossLimitBreaches(rs, 6)).toEqual([{ day: "2026-04-04", lossPaise: 7 }]);
    expect(lossLimitBreaches(rs, 7)).toEqual([]);
  });
  it("empty and no-loss cases do not divide by zero", () => {
    const e = computeStats([]);
    expect([e.count, e.winRate, e.payoff, e.profitFactor, e.planAdherence, e.maxDrawdownPaise]).toEqual([0, 0, null, null, null, 0]);
  });
});

import { tradesToCsv, CSV_HEADER } from "../src/export";
describe("csv export", () => {
  it("has one row per live trade, rupees with 2 decimals, and neutralises formulas", () => {
    const t = { ...closed(1, 100, 100, 110, 95, 20, "2026-03-01"), notes: "=HYPERLINK(\"x\"), \"quoted\"" };
    const gone = { ...closed(2, 10, 100, 100, 95, 0, "2026-03-02"), deleted: true };
    const lines = tradesToCsv([t, gone], rates).trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(CSV_HEADER.join(","));
    expect(lines[1]).toContain(",980.00,1.96,yes,no,");
    expect(lines[1]).toContain('"\'=HYPERLINK(""x""), ""quoted"""');
  });
});

import { weekOf, newReview, reviewId, weekResults, localDay } from "../src/journal";
describe("weekly review", () => {
  it("finds Monday to Sunday for any day", () => {
    expect(weekOf(new Date(2026, 10, 11))).toEqual({ start: "2026-11-09", end: "2026-11-15" }); // a Wednesday
    expect(weekOf(new Date(2026, 10, 15))).toEqual({ start: "2026-11-09", end: "2026-11-15" }); // Sunday
    expect(weekOf(new Date(2026, 10, 16))).toEqual({ start: "2026-11-16", end: "2026-11-22" }); // next Monday
    expect(weekOf(new Date(2026, 0, 1))).toEqual({ start: "2025-12-29", end: "2026-01-04" });    // across a year
  });
  it("uses a fixed id per mode and week, so saving again edits the same review", () => {
    const a = newReview("t1", { mode: "paper", week_start: "2026-11-09", week_end: "2026-11-15", rules_broken: [], went_well: " ok ", to_change: "", rule_next: "" });
    const b = newReview("t2", { mode: "paper", week_start: "2026-11-09", week_end: "2026-11-15", rules_broken: [], went_well: "better", to_change: "", rule_next: "" });
    expect(a.id).toBe(reviewId("paper", "2026-11-09")); expect(b.id).toBe(a.id); expect(a.went_well).toBe("ok");
    expect(newReview("t", { mode: "live", week_start: "2026-11-09", week_end: "2026-11-15", rules_broken: [], went_well: "x", to_change: "", rule_next: "" }).id).not.toBe(a.id);
  });
  it("refuses an empty review", () => {
    expect(() => newReview("t", { mode: "paper", week_start: "a", week_end: "b", rules_broken: [], went_well: " ", to_change: "", rule_next: "" })).toThrow("at least one line");
  });
  it("keeps only trades closed inside the week", () => {
    const mk = (i: number, d: string) => resultOf(closed(i, 10, 100, 110, 95, 1, d), rates);
    const day = (iso: string) => localDay(iso);
    const rs = [mk(1, "2026-11-08"), mk(2, "2026-11-10"), mk(3, "2026-11-12")];
    const inWeek = weekResults(rs, "2026-11-09", "2026-11-15");
    expect(inWeek.map((r) => r.id)).toEqual(["t2", "t3"]);
    expect(day("2026-11-10T14:00:00Z").length).toBe(10);
  });
});
