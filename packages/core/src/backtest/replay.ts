// Two read-only views of a finished test: how trades did in each kind of market, and the prices around one trade.
import type { BtTrade, Series } from "./types";

export const REGIME_LABEL = ["Rising market", "Falling market", "Sideways market"] as const;
export interface RegimeRow { regime: number; label: string; trades: number; wins: number; netPaise: number; avgR: number | null }
/** Group trades by the kind of market the share was in on the day the trade began. Only made-up prices carry these labels. */
export function regimeBreakdown(trades: BtTrade[], universe: Series[]): RegimeRow[] | null {
  if (!universe.length || universe.some((s) => !s.regimes)) return null;
  const by = new Map(universe.map((s) => [s.symbol, s] as const));
  const rows: RegimeRow[] = REGIME_LABEL.map((label, regime) => ({ regime, label, trades: 0, wins: 0, netPaise: 0, avgR: null }));
  const rs: number[][] = [[], [], []];
  for (const t of trades) {
    const s = by.get(t.symbol); if (!s) continue;
    const i = s.bars.findIndex((b) => b.d === t.entryDay), g = i >= 0 ? s.regimes![i] : undefined;
    if (g === undefined || !rows[g]) continue;
    const r = rows[g]!; r.trades++; if (t.netPaise > 0) r.wins++; r.netPaise += t.netPaise; rs[g]!.push(t.r);
  }
  rows.forEach((r, g) => { r.avgR = rs[g]!.length ? rs[g]!.reduce((a, b) => a + b, 0) / rs[g]!.length : null; });
  return rows;
}

export interface TradeView { bars: Series["bars"]; entryIdx: number; exitIdx: number }
/** The days around one trade, with a little before and after so you can see what led to it. */
export function tradeWindow(s: Series, t: BtTrade, pad = 20): TradeView | null {
  const a = s.bars.findIndex((b) => b.d === t.entryDay);
  let z = -1; s.bars.forEach((b, i) => { if (b.d <= t.exitDay) z = i; });
  if (a < 0 || z < a) return null;
  const from = Math.max(0, a - pad), to = Math.min(s.bars.length - 1, z + pad);
  return { bars: s.bars.slice(from, to + 1), entryIdx: a - from, exitIdx: z - from };
}
