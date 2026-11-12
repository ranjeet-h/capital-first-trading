import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import type { Rates } from "../src/costs";
import { parseBarsCsv, checkSeries, runForward, toLog, parseForwardLog, marketIsFinished, strategyHash, type ForwardConfig } from "../src/forward";
import { runBacktest } from "../src/backtest/engine";
import { generateUniverse } from "../src/backtest/synth";
import { DEFAULT_CONFIG, type Strategy } from "../src/backtest/types";

const rates = JSON.parse(readFileSync("data/rates/zerodha-equity.json", "utf8")) as Rates;
const strategy: Strategy = { version: 1, name: "Breakout", type: "breakout", lookback: 20, atrPeriod: 14, stopAtr: 2, trailAtr: 3, riskPct: 1, maxPositions: 5 };
const universe = generateUniverse(7, 4, 3);
const cfg = (startDate: string): ForwardConfig => ({ strategy, startDate, capitalPaise: 5_000_000, symbols: universe.map((u) => u.symbol), source: "test" });
const mid = universe[0]!.bars[Math.floor(universe[0]!.bars.length / 2)]!.d;

describe("forward test", () => {
  it("gives the same trades as the strategy tester for the same prices (parity)", () => {
    const f = runForward(rates, universe, cfg(mid));
    const b = runBacktest(rates, universe, strategy, { ...DEFAULT_CONFIG, capitalPaise: 5_000_000, from: mid });
    expect([...f.closed, ...f.open]).toEqual(b.trades);
  });
  it("is repeatable: the same prices give the same log bytes", () => {
    expect(toLog(runForward(rates, universe, cfg(mid)), "test")).toBe(toLog(runForward(rates, universe, cfg(mid)), "test"));
  });
  it("catching up on missed days equals running daily", () => {
    const cut = (n: number) => universe.map((u) => ({ ...u, delisted: n === 0 ? u.delisted : false, bars: u.bars.slice(0, u.bars.length - n) }));
    const daily = runForward(rates, cut(0), cfg(mid)), caught = runForward(rates, universe, cfg(mid));
    expect(toLog(caught, "t")).toBe(toLog(daily, "t"));
    // the log for a shorter history is a prefix in time: every closed trade there also closed the same way here
    const early = runForward(rates, cut(40), cfg(mid));
    for (const t of early.closed) expect(daily.closed.find((x) => x.symbol === t.symbol && x.entryDay === t.entryDay)?.exitDay).toBe(t.exitDay);
  });
  it("compares only to earlier days, never the same days", () => {
    const f = runForward(rates, universe, cfg(mid));
    expect(f.before.period.endsWith(universe[0]!.bars[universe[0]!.bars.findIndex((b) => b.d === mid) - 1]!.d)).toBe(true);
  });
  it("log round-trips into forward-mode journal trades", () => {
    const f = runForward(rates, universe, cfg(mid)), log = toLog(f, "test");
    const p = parseForwardLog(log, "2026-01-01T00:00:00Z");
    expect(p.skipped).toEqual([]);
    expect(p.trades).toHaveLength(f.closed.length + f.open.length);
    expect(p.trades.every((t) => t.mode === "forward")).toBe(true);
    expect(new Set(p.trades.map((t) => t.id)).size).toBe(p.trades.length);
    expect(p.trades[0]!.id).toContain(strategyHash(strategy));
  });
  it("rejects a log with missing columns and skips bad rows", () => {
    expect(() => parseForwardLog("a,b\n1,2\n", "n")).toThrow(/Missing columns/);
    const p = parseForwardLog("trade_id,symbol,entry_price,entry_qty,opened_at\nx,AAA,abc,1,2026-01-01\n", "n");
    expect(p.trades).toHaveLength(0); expect(p.skipped[0]!.row).toBe(2);
  });
});

describe("fail closed checks", () => {
  const csv = (rows: string[]) => "date,open,high,low,close,volume\n" + rows.join("\n");
  it("reads clean rows into paise and reports bad ones", () => {
    const r = parseBarsCsv("AAA", csv(["2026-01-01,100,101,99,100.5,1000", "2026-01-02,x,1,1,1,1"]));
    expect(r.series.bars).toEqual([{ d: "2026-01-01", o: 10000, h: 10100, l: 9900, c: 10050, v: 1000 }]);
    expect(r.problems).toHaveLength(1);
  });
  it("flags inconsistent bars, zero volume, big jumps and stale data", () => {
    const s = parseBarsCsv("AAA", csv(["2026-01-01,100,101,99,100,1000", "2026-01-02,100,90,99,100,0", "2026-01-05,200,201,199,200,1000"])).series;
    const why = checkSeries(s, "2026-01-09").map((p) => p.why).join("|");
    expect(why).toMatch(/High and low/); expect(why).toMatch(/No shares/); expect(why).toMatch(/20%/); expect(why).toMatch(/newest price/);
  });
  it("a file without the right columns is a problem", () => {
    expect(parseBarsCsv("AAA", "a,b\n1,2").problems).toHaveLength(1);
  });
  it("refuses before the closing bar is complete (IST)", () => {
    expect(marketIsFinished(new Date("2026-11-10T09:00:00Z"), "2026-11-10")).toBe(false); // 14:30 IST
    expect(marketIsFinished(new Date("2026-11-10T10:30:00Z"), "2026-11-10")).toBe(true);  // 16:00 IST
    expect(marketIsFinished(new Date("2026-11-10T04:00:00Z"), "2026-11-09")).toBe(true);  // yesterday's bar is complete
  });
});
