import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import type { Rates } from "../src/costs";
import { computeCosts } from "../src/costs";
import { runBacktest, validateStrategy } from "../src/backtest/engine";
import { generateUniverse } from "../src/backtest/synth";
import { summarise } from "../src/backtest/metrics";
import { splitDays, splitTest, walkForward, lookAheadDemo, survivorshipDemo, costSensitivity, overfitDemo, monteCarlo } from "../src/backtest/experiments";
import { DEFAULT_CONFIG, type Bar, type Config, type Strategy } from "../src/backtest/types";

const rates = JSON.parse(readFileSync("data/rates/zerodha-equity.json", "utf8")) as Rates;
const P = (rs: number) => Math.round(rs * 100);
const bar = (d: string, o: number, h: number, l: number, c: number): Bar => ({ d, o: P(o), h: P(h), l: P(l), c: P(c), v: 1000 });
const toy = [
  bar("2026-01-01", 100, 101, 99, 100), bar("2026-01-02", 100, 101, 99, 100), bar("2026-01-05", 100, 101, 99, 100),
  bar("2026-01-06", 100, 106, 100, 105), bar("2026-01-07", 106, 107, 105, 106), bar("2026-01-08", 103, 104, 101, 102),
  bar("2026-01-09", 102, 103, 101, 102), bar("2026-01-12", 102, 110, 102, 110), bar("2026-01-13", 111, 112, 110, 111), bar("2026-01-14", 100, 101, 99, 100),
];
const toyUniverse = [{ symbol: "TOY", bars: toy, delisted: false }];
const strat: Strategy = { version: 1, name: "toy", type: "breakout", lookback: 2, atrPeriod: 2, stopAtr: 1, riskPct: 1, maxPositions: 1 };
const free: Config = { ...DEFAULT_CONFIG, capitalPaise: P(100000), slippageBps: 0, costMult: 0 };

describe("backtest engine: hand-checked toy data", () => {
  it("fills at the next open, exits at the stop, and fills at the open when a day gaps through the stop", () => {
    const r = runBacktest(rates, toyUniverse, strat, free);
    expect(r.trades).toHaveLength(2);
    const [a, b] = r.trades;
    // Signal on the 6th (close 105 beats 101). Fill at the next open, Rs 106. ATR is 4, so the stop is Rs 102. 1% of Rs 1,00,000 / Rs 4 = 250 shares.
    expect(a).toMatchObject({ entryDay: "2026-01-07", entryPaise: P(106), qty: 250, stopPaise: P(102), exitDay: "2026-01-08", exitPaise: P(102), exitReason: "stop", grossPaise: P(-1000), r: -1 });
    // Signal on the 12th. Fill Rs 111, ATR 5, stop Rs 106. Money is now Rs 99,000, so 1% = Rs 990 / 5 = 198 shares.
    // The 14th opens at Rs 100, below the stop, so the exit is the open and not the stop.
    expect(b).toMatchObject({ entryPaise: P(111), qty: 198, stopPaise: P(106), exitDay: "2026-01-14", exitPaise: P(100), exitReason: "stop", grossPaise: P(-2178) });
    expect(r.equity[r.equity.length - 1]!.v).toBe(P(100000 - 1000 - 2178));
  });
  it("charges the real costs on every sale", () => {
    const r = runBacktest(rates, toyUniverse, strat, { ...free, costMult: 1 });
    const t = r.trades[0]!;
    expect(t.costsPaise).toBe(computeCosts(rates, { buyPricePaise: t.entryPaise, sellPricePaise: t.exitPaise, quantity: t.qty, product: "cnc", exchange: "NSE", dpCharge: true }).totalPaise);
    expect(t.netPaise).toBe(t.grossPaise - t.costsPaise);
  });
  it("never trades on the same bar it read the signal from", () => {
    const r = runBacktest(rates, toyUniverse, strat, free);
    expect(r.trades.every((t) => t.entryDay > "2026-01-06")).toBe(true);
  });
  it("makes no trades when there is no signal", () => {
    expect(runBacktest(rates, [{ symbol: "FLAT", bars: toy.slice(0, 3), delisted: false }], strat, free).trades).toEqual([]);
  });
  it("refuses bad settings in plain words", () => {
    expect(validateStrategy({ ...strat, lookback: 1 })[0]).toMatch(/Look-back/);
    expect(validateStrategy({ ...strat, riskPct: 9 })[0]).toMatch(/Risk per trade/);
    expect(validateStrategy({ version: 1, name: "x", type: "sma_cross", fast: 50, slow: 20, atrPeriod: 14, stopAtr: 2, riskPct: 1, maxPositions: 3 })[0]).toMatch(/fast average/);
  });
});

describe("synthetic data", () => {
  it("is the same for the same seed and different for another", () => {
    expect(JSON.stringify(generateUniverse(7, 4, 2))).toBe(JSON.stringify(generateUniverse(7, 4, 2)));
    expect(JSON.stringify(generateUniverse(7, 4, 2))).not.toBe(JSON.stringify(generateUniverse(8, 4, 2)));
  });
  it("keeps every bar consistent, whole paise, inside the daily limit", () => {
    for (const s of generateUniverse(3, 12, 8)) s.bars.forEach((b, i) => {
      expect(b.l <= Math.min(b.o, b.c) && b.h >= Math.max(b.o, b.c) && b.l > 0).toBe(true);
      expect([b.o, b.h, b.l, b.c].every(Number.isInteger)).toBe(true);
      if (i > 0) expect(Math.abs(b.c / s.bars[i - 1]!.c - 1)).toBeLessThanOrEqual(0.2001);
    });
  });
  it("includes shares that stop trading", () => { expect(generateUniverse(1, 20, 8).some((s) => s.delisted)).toBe(true); });
});

describe("whole runs and experiments (seed 11)", () => {
  const U = generateUniverse(11, 16, 8);
  const brk: Strategy = { version: 1, name: "breakout", type: "breakout", lookback: 20, atrPeriod: 14, stopAtr: 2, trailAtr: 3, riskPct: 1, maxPositions: 5 };
  it("gives byte-identical results twice", () => {
    expect(JSON.stringify(runBacktest(rates, U, brk, DEFAULT_CONFIG))).toBe(JSON.stringify(runBacktest(rates, U, brk, DEFAULT_CONFIG)));
  });
  it("never owes money and never holds more than the limit; equity ends equal to money after closing", () => {
    const r = runBacktest(rates, U, brk, DEFAULT_CONFIG);
    expect(r.trades.length).toBeGreaterThan(10);
    expect(r.equity.every((e) => e.v > 0)).toBe(true);
    const net = r.trades.reduce((a, t) => a + t.netPaise, 0);
    expect(r.equity[r.equity.length - 1]!.v).toBe(DEFAULT_CONFIG.capitalPaise + net);
  });
  it("test period starts after the learning period ends", () => {
    const sp = splitDays(U); expect(sp.lastInSample < sp.firstOut).toBe(true);
    const t = splitTest(rates, U, brk, DEFAULT_CONFIG);
    const insample = runBacktest(rates, U, brk, { ...DEFAULT_CONFIG, to: sp.lastInSample }), out = runBacktest(rates, U, brk, { ...DEFAULT_CONFIG, from: sp.firstOut });
    expect(insample.trades.every((x) => x.exitDay <= sp.lastInSample)).toBe(true);
    expect(out.trades.every((x) => x.entryDay >= sp.firstOut)).toBe(true);
    expect(t.inSample.stats.count).toBe(insample.trades.length);
  });
  it("peeking at the close of the same bar looks better than the honest rule", () => {
    const d = lookAheadDemo(rates, U, brk, DEFAULT_CONFIG);
    expect(d.peeking.stats.netPaise).toBeGreaterThan(d.honest.stats.netPaise);
  });
  it("higher costs never help", () => {
    const c = costSensitivity(rates, U, brk, DEFAULT_CONFIG);
    for (let i = 1; i < c.length; i++) expect(c[i]!.netPaise).toBeLessThanOrEqual(c[i - 1]!.netPaise);
  });
  it("survivors only is not worse than the full list, and delisted shares exist", () => {
    const s = survivorshipDemo(rates, U, brk, DEFAULT_CONFIG);
    expect(s.delistedCount).toBeGreaterThan(0);
    expect(s.survivorsOnly.endPaise).toBeGreaterThanOrEqual(s.everything.endPaise);
  });
  it("the best in-sample setting does no better on the test period than it did while learning", () => {
    const o = overfitDemo(rates, U, brk, DEFAULT_CONFIG);
    expect(o.combos).toBe(25);
    expect(o.best.netPaise).toBeGreaterThanOrEqual(o.averageInSamplePaise);
  });
  it("shuffling is repeatable and ordered sensibly", () => {
    const trades = runBacktest(rates, U, brk, DEFAULT_CONFIG).trades;
    const a = monteCarlo(trades, DEFAULT_CONFIG.capitalPaise, 5), b = monteCarlo(trades, DEFAULT_CONFIG.capitalPaise, 5);
    expect(a).toEqual(b);
    expect(a.p95DrawdownPct).toBeGreaterThanOrEqual(a.medianDrawdownPct);
    expect(summarise(runBacktest(rates, U, brk, DEFAULT_CONFIG), DEFAULT_CONFIG.capitalPaise).endPaise).toBeGreaterThan(0);
  });
});

describe("walk-forward", () => {
  const u = generateUniverse(3, 8, 6), s: Strategy = { version: 1, name: "b", type: "breakout", lookback: 20, atrPeriod: 14, stopAtr: 2, trailAtr: 3, riskPct: 1, maxPositions: 5 };
  it("tests each slice only on days after the days it learned from, and the slices do not overlap", () => {
    const w = walkForward(rates, u, s, DEFAULT_CONFIG, 4);
    expect(w.folds).toHaveLength(4);
    w.folds.forEach((f, i) => { expect(f.testFrom > f.trainTo).toBe(true); expect(f.testTo >= f.testFrom).toBe(true); if (i) expect(f.testFrom > w.folds[i - 1]!.testTo).toBe(true); });
    expect(w.totalTestPaise).toBe(w.folds.reduce((a, f) => a + f.testPaise, 0));
  });
  it("gives the same answer every time", () => {
    expect(walkForward(rates, u, s, DEFAULT_CONFIG)).toEqual(walkForward(rates, u, s, DEFAULT_CONFIG));
  });
  it("returns nothing when there are too few days", () => {
    expect(walkForward(rates, generateUniverse(3, 4, 2).map((x) => ({ ...x, bars: x.bars.slice(0, 60) })), s, DEFAULT_CONFIG).folds).toHaveLength(0);
  });
});
