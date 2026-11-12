import type { Result } from "../journal";
import { computeStats, type Stats } from "../stats";
import type { RunResult } from "./types";

export interface Summary {
  stats: Stats; startPaise: number; endPaise: number; returnPct: number; cagr: number | null;
  maxDrawdownPct: number; maxDrawdownDays: number; exposure: number; years: number;
}
export function summarise(run: RunResult, capitalPaise: number): Summary {
  const results: Result[] = run.trades.map((t, i) => ({ id: String(i), mode: "backtest", status: "closed", closedAt: t.exitDay, grossPaise: t.grossPaise, costsPaise: t.costsPaise, netPaise: t.netPaise, plannedRiskPaise: t.plannedRiskPaise, r: t.r, amended: false }));
  const stats = computeStats(results);
  const eq = run.equity, end = eq.length ? eq[eq.length - 1]!.v : capitalPaise;
  let peak = capitalPaise, dd = 0, ddDays = 0, cur = 0;
  for (const p of eq) { if (p.v >= peak) { peak = p.v; cur = 0; } else { cur++; ddDays = Math.max(ddDays, cur); dd = Math.max(dd, (peak - p.v) / peak); } }
  const years = eq.length / 252;
  return { stats, startPaise: capitalPaise, endPaise: end, returnPct: (end / capitalPaise - 1) * 100, cagr: years >= 1 && end > 0 ? (Math.pow(end / capitalPaise, 1 / years) - 1) * 100 : null, maxDrawdownPct: dd * 100, maxDrawdownDays: ddDays, exposure: run.exposure, years };
}
