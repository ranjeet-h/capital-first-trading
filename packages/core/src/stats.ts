// Statistics over closed trades. Every number here can be checked by hand from the trade list.
import type { Result } from "./journal";

export const MIN_TRADES_FOR_TRUST = 30;

export interface Stats {
  count: number; wins: number; losses: number; winRate: number;
  grossPaise: number; costsPaise: number; netPaise: number;
  avgWinPaise: number; avgLossPaise: number; payoff: number | null;
  expectancyPaise: number; expectancyR: number;
  profitFactor: number | null;
  equity: number[]; drawdown: number[]; maxDrawdownPaise: number;
  maxWinStreak: number; maxLossStreak: number;
  planAdherence: number | null; amendedCount: number;
  costShareOfGrossProfit: number | null;
  rHistogram: { from: number; to: number; count: number }[];
  lowSample: boolean;
}

/** Closed trades only, oldest first. Callers filter by mode first: modes are never blended. */
export function computeStats(results: Result[]): Stats {
  const closed = results.filter((r) => r.status === "closed").sort((a, b) => (a.closedAt! < b.closedAt! ? -1 : a.closedAt! > b.closedAt! ? 1 : 0));
  const n = closed.length;
  const wins = closed.filter((r) => r.netPaise > 0), losses = closed.filter((r) => r.netPaise < 0);
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const net = sum(closed.map((r) => r.netPaise));
  const winSum = sum(wins.map((r) => r.netPaise)), lossSum = sum(losses.map((r) => r.netPaise));
  const avgWin = wins.length ? winSum / wins.length : 0, avgLoss = losses.length ? lossSum / losses.length : 0;

  const equity: number[] = [], drawdown: number[] = [];
  let run = 0, peak = 0, maxDd = 0;
  for (const r of closed) { run += r.netPaise; equity.push(run); peak = Math.max(peak, run); drawdown.push(peak - run); maxDd = Math.max(maxDd, peak - run); }

  let w = 0, l = 0, maxW = 0, maxL = 0;
  for (const r of closed) {
    if (r.netPaise > 0) { w++; l = 0; } else if (r.netPaise < 0) { l++; w = 0; } else { w = 0; l = 0; }
    maxW = Math.max(maxW, w); maxL = Math.max(maxL, l);
  }

  const known = closed.filter((r) => r.followedPlan !== undefined);
  const grossWins = sum(closed.filter((r) => r.grossPaise > 0).map((r) => r.grossPaise));
  const totalCosts = sum(closed.map((r) => r.costsPaise));

  // R histogram in whole-R buckets from -3 to +3; anything beyond lands in the end buckets.
  const rHistogram = Array.from({ length: 7 }, (_, i) => ({ from: i - 3, to: i - 2, count: 0 }));
  for (const r of closed) rHistogram[Math.min(6, Math.max(0, Math.floor(r.r) + 3))]!.count++;

  return {
    count: n, wins: wins.length, losses: losses.length, winRate: n ? wins.length / n : 0,
    grossPaise: sum(closed.map((r) => r.grossPaise)), costsPaise: totalCosts, netPaise: net,
    avgWinPaise: avgWin, avgLossPaise: avgLoss, payoff: avgLoss < 0 ? avgWin / -avgLoss : null,
    expectancyPaise: n ? net / n : 0, expectancyR: n ? sum(closed.map((r) => r.r)) / n : 0,
    profitFactor: lossSum < 0 ? winSum / -lossSum : null,
    equity, drawdown, maxDrawdownPaise: maxDd, maxWinStreak: maxW, maxLossStreak: maxL,
    planAdherence: known.length ? known.filter((r) => r.followedPlan).length / known.length : null,
    amendedCount: closed.filter((r) => r.amended).length,
    costShareOfGrossProfit: grossWins > 0 ? totalCosts / grossWins : null,
    rHistogram, lowSample: n < MIN_TRADES_FOR_TRUST,
  };
}

/** Days (YYYY-MM-DD of the close) whose combined net loss went past the daily limit you set. */
export function lossLimitBreaches(results: Result[], dailyLimitPaise: number): { day: string; lossPaise: number }[] {
  const byDay = new Map<string, number>();
  for (const r of results) if (r.status === "closed") { const d = r.closedAt!.slice(0, 10); byDay.set(d, (byDay.get(d) ?? 0) + r.netPaise); }
  return [...byDay].filter(([, v]) => -v > dailyLimitPaise).map(([day, v]) => ({ day, lossPaise: -v })).sort((a, b) => (a.day < b.day ? -1 : 1));
}
