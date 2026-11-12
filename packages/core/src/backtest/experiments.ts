// The guided experiments: each one changes a single thing so you can see what it does.
import type { Rates } from "../costs";
import { runBacktest } from "./engine";
import { summarise, type Summary } from "./metrics";
import { rng } from "./rng";
import type { BtTrade, Config, RunResult, Series, Strategy } from "./types";

const run = (r: Rates, u: Series[], s: Strategy, c: Config) => { const x = runBacktest(r, u, s, c); return { x, m: summarise(x, c.capitalPaise) }; };

/** First 70% of the days to learn from, last 30% as the honest test. Never shuffled. */
export function splitDays(u: Series[], frac = 0.7) {
  const days = [...new Set(u.flatMap((s) => s.bars.map((b) => b.d)))].sort();
  const cut = Math.floor(days.length * frac);
  return { firstDay: days[0]!, lastInSample: days[cut - 1]!, firstOut: days[cut]!, lastDay: days[days.length - 1]! };
}
export function splitTest(r: Rates, u: Series[], s: Strategy, c: Config) {
  const sp = splitDays(u);
  return { split: sp, inSample: run(r, u, s, { ...c, to: sp.lastInSample }).m, outOfSample: run(r, u, s, { ...c, from: sp.firstOut }).m };
}
export function lookAheadDemo(r: Rates, u: Series[], s: Strategy, c: Config) {
  return { honest: run(r, u, s, { ...c, fillAt: "next_open" }).m, peeking: run(r, u, s, { ...c, fillAt: "same_close" }).m };
}
/** Buy and hold, because a share that vanishes hurts most when you simply hold it. */
export function survivorshipDemo(r: Rates, u: Series[], _s: Strategy, c: Config) {
  const hold = (list: Series[]): Strategy => ({ version: 1, name: "Buy and hold", type: "buy_and_hold", atrPeriod: 14, stopAtr: 1, riskPct: 1, maxPositions: Math.max(1, list.length) });
  const all = u, alive = u.filter((x) => !x.delisted);
  return { everything: run(r, all, hold(all), c).m, survivorsOnly: run(r, alive, hold(alive), c).m, delistedCount: all.length - alive.length };
}
export function costSensitivity(r: Rates, u: Series[], s: Strategy, c: Config, mults = [0, 1, 2, 3]) {
  return mults.map((m) => { const x = run(r, u, s, { ...c, costMult: m }); return { mult: m, netPaise: x.m.stats.netPaise, costsPaise: x.m.stats.costsPaise, endPaise: x.m.endPaise }; });
}
export interface GridCell { lookback: number; stopAtr: number; netPaise: number }
/** Try many settings on the learning period, keep the best, then see how that "best" does on the test period. */
export function overfitDemo(r: Rates, u: Series[], base: Strategy, c: Config, lookbacks = [10, 20, 30, 40, 55], stops = [1, 1.5, 2, 2.5, 3]) {
  const sp = splitDays(u), grid: GridCell[] = [];
  for (const lookback of lookbacks) for (const stopAtr of stops) grid.push({ lookback, stopAtr, netPaise: run(r, u, { ...base, type: "breakout", lookback, stopAtr }, { ...c, to: sp.lastInSample }).m.stats.netPaise });
  const best = grid.reduce((a, b) => (b.netPaise > a.netPaise ? b : a));
  const out = run(r, u, { ...base, type: "breakout", lookback: best.lookback, stopAtr: best.stopAtr }, { ...c, from: sp.firstOut }).m;
  const avgIn = grid.reduce((a, g) => a + g.netPaise, 0) / grid.length;
  return { grid, best, combos: grid.length, averageInSamplePaise: avgIn, bestOut: out, lookbacks, stops };
}
export interface MonteCarlo { runs: number; medianDrawdownPct: number; p95DrawdownPct: number; p95LosingStreak: number; ruinChance: number; ruinAtPct: number }
/** Shuffle the order of the same trades many times. The trades do not change, only their luck of order. */
export function monteCarlo(trades: BtTrade[], capitalPaise: number, seed: number, runs = 1000, ruinAtPct = 50): MonteCarlo {
  const g = rng(seed), pnl = trades.map((t) => t.netPaise);
  if (!pnl.length) return { runs: 0, medianDrawdownPct: 0, p95DrawdownPct: 0, p95LosingStreak: 0, ruinChance: 0, ruinAtPct };
  const dds: number[] = [], streaks: number[] = []; let ruin = 0;
  for (let k = 0; k < runs; k++) {
    const a = pnl.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(g.next() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
    let eq = capitalPaise, peak = eq, dd = 0, l = 0, ml = 0;
    for (const x of a) { eq += x; peak = Math.max(peak, eq); dd = Math.max(dd, (peak - eq) / peak); if (x < 0) { l++; ml = Math.max(ml, l); } else l = 0; }
    dds.push(dd * 100); streaks.push(ml); if (dd * 100 >= ruinAtPct) ruin++;
  }
  const q = (xs: number[], p: number) => { const s = xs.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]!; };
  return { runs, medianDrawdownPct: q(dds, 0.5), p95DrawdownPct: q(dds, 0.95), p95LosingStreak: q(streaks, 0.95), ruinChance: ruin / runs, ruinAtPct };
}
export type { Summary, RunResult };
