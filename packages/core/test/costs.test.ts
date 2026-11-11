import { describe, it, expect } from "vitest";
import rates from "../../../data/rates/zerodha-equity.json";
import { computeCosts, ratesAreStale, type Rates, type TradeInput } from "../src/costs";

const R = rates as unknown as Rates;
const rs = (n: number) => Math.round(n * 100);
const line = (r: ReturnType<typeof computeCosts>, k: string) => r.lines.find((l) => l.key === k)!.paise;

describe("costs: hand-computed examples (rates read 2026-11-11)", () => {
  it("delivery Rs 5,000 flat round trip", () => {
    const r = computeCosts(R, { buyPricePaise: rs(500), sellPricePaise: rs(500), quantity: 10, product: "cnc", exchange: "NSE" });
    expect(line(r, "stt")).toBe(rs(10));
    expect(line(r, "stamp")).toBe(100); // 0.75 rounds to Rs 1
    expect(line(r, "exchange")).toBe(31);
    expect(line(r, "sebi")).toBe(1);
    expect(line(r, "gst")).toBe(6);
    expect(line(r, "dp")).toBe(1534);
    expect(r.totalPaise).toBe(2672);
  });
  it("delivery Rs 50,000 flat round trip", () => {
    const r = computeCosts(R, { buyPricePaise: rs(500), sellPricePaise: rs(500), quantity: 100, product: "cnc", exchange: "NSE" });
    expect(r.totalPaise).toBe(12708);
  });
  it("intraday Rs 50,000 flat round trip (brokerage 0.03% = Rs 15 per order)", () => {
    const r = computeCosts(R, { buyPricePaise: rs(500), sellPricePaise: rs(500), quantity: 100, product: "mis", exchange: "NSE" });
    expect(line(r, "brokerage")).toBe(rs(30));
    expect(line(r, "dp")).toBe(0);
  });
  it("intraday brokerage is capped at Rs 20 per order", () => {
    const r = computeCosts(R, { buyPricePaise: rs(1000), sellPricePaise: rs(1000), quantity: 100, product: "mis", exchange: "NSE" });
    expect(line(r, "brokerage")).toBe(rs(40));
  });
});

describe("costs: invariants", () => {
  const cases: TradeInput[] = [];
  for (const product of ["cnc", "mis"] as const)
    for (const exchange of ["NSE", "BSE"] as const)
      for (const [b, s, q] of [[rs(100), rs(103), 7], [rs(2500), rs(2450), 3], [rs(15), rs(15.5), 900], [rs(1), rs(1.01), 1]])
        cases.push({ buyPricePaise: b!, sellPricePaise: s!, quantity: q!, product, exchange });
  it("total equals sum of lines, all lines non-negative integers", () => {
    for (const c of cases) {
      const r = computeCosts(R, c);
      expect(r.totalPaise).toBe(r.lines.reduce((a, l) => a + l.paise, 0));
      for (const l of r.lines) { expect(Number.isInteger(l.paise)).toBe(true); expect(l.paise).toBeGreaterThanOrEqual(0); }
    }
  });
  it("net P&L at break-even price is not negative, one paisa lower is", () => {
    for (const c of cases) {
      const r = computeCosts(R, c);
      const at = computeCosts(R, { ...c, sellPricePaise: r.breakEvenPricePaise });
      expect(at.netPnlPaise).toBeGreaterThanOrEqual(0);
      if (r.breakEvenPricePaise > c.buyPricePaise) {
        const below = computeCosts(R, { ...c, sellPricePaise: r.breakEvenPricePaise - 1 });
        expect(below.netPnlPaise).toBeLessThan(0);
      }
    }
  });
  it("rejects bad input", () => {
    expect(() => computeCosts(R, { buyPricePaise: 0, sellPricePaise: 100, quantity: 1, product: "cnc", exchange: "NSE" })).toThrow();
    expect(() => computeCosts(R, { buyPricePaise: 100, sellPricePaise: 100, quantity: 1.5, product: "cnc", exchange: "NSE" })).toThrow();
  });
});

describe("staleness", () => {
  it("flags rates past the review window", () => {
    expect(ratesAreStale(R, new Date("2026-12-01"))).toBe(false);
    expect(ratesAreStale(R, new Date("2027-03-01"))).toBe(true);
  });
});

// Golden cases: Zerodha official calculator, screenshot supplied by the owner, 2026-11-11.
// The official calculator does NOT include the DP charge, so dpCharge is false to compare like with like.
describe("costs: golden vs Zerodha official calculator (2026-11-11)", () => {
  const base = { buyPricePaise: rs(1000), sellPricePaise: rs(1100), quantity: 400, exchange: "NSE" as const, dpCharge: false };
  it("intraday NSE 1000 -> 1100 x 400", () => {
    const r = computeCosts(R, { ...base, product: "mis" });
    expect(line(r, "brokerage")).toBe(rs(40));
    expect(line(r, "stt")).toBe(rs(110));
    expect(line(r, "exchange")).toBe(rs(25.79));
    expect(line(r, "gst")).toBe(rs(11.99));
    expect(line(r, "sebi")).toBe(rs(0.84));
    expect(line(r, "stamp")).toBe(rs(12));
    expect(r.totalPaise).toBe(rs(200.62));
    expect(r.netPnlPaise).toBe(rs(39799.38));
  });
  it("delivery NSE 1000 -> 1100 x 400", () => {
    const r = computeCosts(R, { ...base, product: "cnc" });
    expect(line(r, "brokerage")).toBe(0);
    expect(line(r, "stt")).toBe(rs(840));
    expect(line(r, "exchange")).toBe(rs(25.79));
    expect(line(r, "gst")).toBe(rs(4.79));
    expect(line(r, "sebi")).toBe(rs(0.84));
    expect(line(r, "stamp")).toBe(rs(60));
    expect(r.totalPaise).toBe(rs(931.42));
    expect(r.netPnlPaise).toBe(rs(39068.58));
  });
});

// More golden cases from the same calculator (owner screenshots, 2026-11-11).
describe("costs: golden, BSE, ties and small trades", () => {
  it("intraday BSE 1000 -> 1100 x 400", () => {
    const r = computeCosts(R, { buyPricePaise: rs(1000), sellPricePaise: rs(1100), quantity: 400, product: "mis", exchange: "BSE" });
    expect(line(r, "exchange")).toBe(rs(31.5));
    expect(line(r, "gst")).toBe(rs(13.02));
    expect(r.totalPaise).toBe(rs(207.36));
    expect(r.netPnlPaise).toBe(rs(39792.64));
  });
  it("delivery BSE 1000 -> 1100 x 400 (no DP, like the calculator)", () => {
    const r = computeCosts(R, { buyPricePaise: rs(1000), sellPricePaise: rs(1100), quantity: 400, product: "cnc", exchange: "BSE", dpCharge: false });
    expect(line(r, "gst")).toBe(rs(5.82));
    expect(r.totalPaise).toBe(rs(938.16));
    expect(r.netPnlPaise).toBe(rs(39061.84));
  });
  it("intraday NSE 2500 -> 2400 x 100: brokerage cap, stamp 7.5 rounds to 8", () => {
    const r = computeCosts(R, { buyPricePaise: rs(2500), sellPricePaise: rs(2400), quantity: 100, product: "mis", exchange: "NSE" });
    expect(line(r, "brokerage")).toBe(rs(40));
    expect(line(r, "stt")).toBe(rs(60));
    expect(line(r, "exchange")).toBe(rs(15.04));
    expect(line(r, "gst")).toBe(rs(10));
    expect(line(r, "sebi")).toBe(rs(0.49));
    expect(line(r, "stamp")).toBe(rs(8));
    expect(r.totalPaise).toBe(rs(133.53));
    expect(r.netPnlPaise).toBe(-rs(10133.53));
  });
  it("delivery NSE 97.35 -> 98.10 x 37: tiny trade", () => {
    const r = computeCosts(R, { buyPricePaise: 9735, sellPricePaise: 9810, quantity: 37, product: "cnc", exchange: "NSE", dpCharge: false });
    expect(line(r, "stt")).toBe(rs(7));
    expect(line(r, "exchange")).toBe(rs(0.22));
    expect(line(r, "gst")).toBe(rs(0.04));
    expect(line(r, "sebi")).toBe(rs(0.01));
    expect(line(r, "stamp")).toBe(rs(1));
    expect(r.totalPaise).toBe(rs(8.27));
    expect(r.netPnlPaise).toBe(rs(19.48));
  });
  it("intraday NSE 15.5 -> 15.2 x 900: brokerage tie 4.185 -> 4.18", () => {
    const r = computeCosts(R, { buyPricePaise: 1550, sellPricePaise: 1520, quantity: 900, product: "mis", exchange: "NSE" });
    expect(line(r, "brokerage")).toBe(rs(8.28));
    expect(line(r, "stt")).toBe(rs(3));
    expect(line(r, "exchange")).toBe(rs(0.85));
    expect(line(r, "gst")).toBe(rs(1.65));
    expect(line(r, "sebi")).toBe(rs(0.03));
    expect(line(r, "stamp")).toBe(0);
    expect(r.totalPaise).toBe(rs(13.81));
    expect(r.netPnlPaise).toBe(-rs(283.81));
  });
});
