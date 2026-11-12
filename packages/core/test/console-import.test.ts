import { describe, it, expect } from "vitest";
import { parseTradebook, rupeesToPaise, splitCsvLine } from "../src/console-import";
import { resultOf } from "../src/journal";
import { computeStats } from "../src/stats";
import { readFileSync } from "node:fs";
import type { Rates } from "../src/costs";

const R = JSON.parse(readFileSync("data/rates/zerodha-equity.json", "utf8")) as Rates;
const H = "symbol,isin,trade_date,exchange,segment,series,trade_type,auction,quantity,price,trade_id,order_id,order_execution_time";
const NOW = "2026-01-01T00:00:00.000Z";
const line = (sym: string, day: string, time: string, side: string, qty: number, price: string, id: string, seg = "EQ", ex = "NSE") =>
  `${sym},INE000,${day},${ex},${seg},EQ,${side},false,${qty},${price},${id},o${id},${day}T${time}`;

describe("Zerodha tradebook import", () => {
  it("reads amounts exactly", () => {
    expect(rupeesToPaise("1,234.5")).toBe(123450);
    expect(rupeesToPaise("99")).toBe(9900);
    expect(rupeesToPaise("abc")).toBeNull();
    expect(splitCsvLine('a,"b,c",d')).toEqual(["a", "b,c", "d"]);
  });
  it("pairs a buy and a sell into one closed same-day trade", () => {
    const p = parseTradebook([H, line("INFY", "2026-03-02", "09:20:00", "buy", 10, "100.00", "1"), line("INFY", "2026-03-02", "14:00:00", "sell", 10, "105.00", "2")].join("\n"), NOW);
    expect(p.skipped).toEqual([]);
    expect(p.trades).toHaveLength(1);
    const t = p.trades[0]!;
    expect(t.mode).toBe("live"); expect(t.product).toBe("mis"); expect(t.entry_price_paise).toBe(10000); expect(t.exits[0]!.pricePaise).toBe(10500);
    const r = resultOf(t, R);
    expect(r.grossPaise).toBe(5000); expect(r.plannedRiskPaise).toBe(0); expect(r.r).toBe(0); expect(r.status).toBe("closed");
  });
  it("averages several buys and records partial sells as exits; held over days is delivery", () => {
    const p = parseTradebook([H,
      line("TCS", "2026-03-02", "10:00:00", "buy", 10, "100.00", "1"), line("TCS", "2026-03-03", "10:00:00", "buy", 30, "200.00", "2"),
      line("TCS", "2026-03-05", "10:00:00", "sell", 15, "210.00", "3"), line("TCS", "2026-03-06", "10:00:00", "sell", 25, "190.00", "4")].join("\n"), NOW);
    const t = p.trades[0]!;
    expect(t.entry_qty).toBe(40); expect(t.entry_price_paise).toBe(17500); expect(t.exits).toHaveLength(2); expect(t.product).toBe("cnc");
  });
  it("leaves an unsold position open and starts a new position after going flat", () => {
    const p = parseTradebook([H,
      line("A", "2026-03-02", "10:00:00", "buy", 5, "10", "1"), line("A", "2026-03-02", "11:00:00", "sell", 5, "11", "2"),
      line("A", "2026-03-03", "10:00:00", "buy", 7, "12", "3")].join("\n"), NOW);
    expect(p.trades).toHaveLength(2);
    expect(p.trades[1]!.exits).toHaveLength(0);
    expect(p.trades.map((t) => t.id)).toEqual(["tb-NSE-A-1", "tb-NSE-A-3"]);
  });
  it("reports unsupported rows with their row numbers instead of guessing", () => {
    const p = parseTradebook([H,
      line("B", "2026-03-02", "09:30:00", "sell", 5, "10", "1"),            // row 2: short
      line("NIFTY", "2026-03-02", "09:30:00", "buy", 50, "10", "2", "FO"),    // row 3: derivative
      line("C", "2026-03-02", "09:30:00", "buy", 0, "10", "3"),               // row 4: bad qty
      line("D", "2026-03-02", "09:30:00", "buy", 5, "ten", "4"),              // row 5: bad price
      line("E", "2026-03-02", "09:30:00", "buy", 5, "10", "5")].join("\n"), NOW);
    expect(p.skipped.map((s) => s.row)).toEqual([2, 3, 4, 5]);
    expect(p.trades).toHaveLength(1);
  });
  it("refuses a file that is not a tradebook", () => {
    expect(() => parseTradebook("a,b\n1,2", NOW)).toThrow(/Missing columns/);
    expect(() => parseTradebook("", NOW)).toThrow(/empty/);
  });
  it("keeps imported trades out of the R figures but in the money figures", () => {
    const p = parseTradebook([H, line("INFY", "2026-03-02", "09:20:00", "buy", 10, "100.00", "1"), line("INFY", "2026-03-02", "14:00:00", "sell", 10, "105.00", "2")].join("\n"), NOW);
    const s = computeStats(p.trades.map((t) => resultOf(t, R)));
    expect(s.count).toBe(1); expect(s.rCount).toBe(0); expect(s.expectancyR).toBe(0); expect(s.rHistogram.reduce((a, b) => a + b.count, 0)).toBe(0);
    expect(s.grossPaise).toBe(5000);
  });
});
