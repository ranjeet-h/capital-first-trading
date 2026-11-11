import { describe, it, expect } from "vitest";
import rates from "../../../data/rates/zerodha-equity.json";
import type { Rates } from "../src/costs";
import { sizePosition, type SizingInput } from "../src/sizing";

const R = rates as unknown as Rates;
const rs = (n: number) => Math.round(n * 100);
const base: SizingInput = { capitalPaise: rs(50000), riskPercent: 1, entryPaise: rs(100), stopPaise: rs(95), product: "cnc", exchange: "NSE", maxPositionPercent: 25, includeCosts: false };

describe("sizing", () => {
  it("risk-limited case: 100 shares, loss Rs 500", () => {
    const r = sizePosition(R, base);
    expect(r.shares).toBe(100);
    expect(r.plannedLossPaise).toBe(rs(500));
    expect(r.binding).toBe("risk");
  });
  it("concentration binds on a tight stop", () => {
    const r = sizePosition(R, { ...base, stopPaise: rs(99) });
    expect(r.shares).toBe(125);
    expect(r.binding).toBe("concentration");
  });
  it("costs shrink the position so true loss stays inside the budget", () => {
    const r = sizePosition(R, { ...base, includeCosts: true });
    expect(r.shares).toBeLessThan(100);
    expect(r.trueLossPaise).toBeLessThanOrEqual(r.riskBudgetPaise);
  });
  it("rejects stop at or above entry", () => {
    expect(sizePosition(R, { ...base, stopPaise: rs(100) }).ok).toBe(false);
    expect(sizePosition(R, { ...base, stopPaise: rs(105) }).errors[0]).toMatch(/below the entry/);
  });
  it("risk budget smaller than one share's loss gives zero shares with a reason", () => {
    const r = sizePosition(R, { ...base, capitalPaise: rs(5000), entryPaise: rs(1000), stopPaise: rs(900), riskPercent: 1 });
    expect(r.shares).toBe(0);
    expect(r.warnings[0]).toMatch(/single share/);
  });
  it("reward to risk and warnings", () => {
    const r = sizePosition(R, { ...base, targetPaise: rs(105), riskPercent: 3 });
    expect(r.rewardToRisk).toBe(1);
    expect(r.warnings.join(" ")).toMatch(/1.5/);
    expect(r.warnings.join(" ")).toMatch(/2%/);
  });
  it("property: shares x loss <= budget and position <= capital for many inputs", () => {
    let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let n = 0; n < 500; n++) {
      const entry = rs(1 + rnd() * 3000), stop = Math.max(1, Math.floor(entry * (0.5 + rnd() * 0.49)));
      const i: SizingInput = { ...base, capitalPaise: rs(10000 + rnd() * 990000), riskPercent: 0.25 + rnd() * 4, entryPaise: entry, stopPaise: stop, includeCosts: rnd() > 0.5, product: rnd() > 0.5 ? "cnc" : "mis", exchange: rnd() > 0.5 ? "NSE" : "BSE" };
      const r = sizePosition(R, i);
      if (!r.ok) continue;
      expect(r.trueLossPaise).toBeLessThanOrEqual(r.riskBudgetPaise);
      expect(r.positionPaise).toBeLessThanOrEqual(i.capitalPaise);
    }
  });
});
