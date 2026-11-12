// The backtest engine. Rules that keep it honest:
//  - (Demo only) "same_close" peeks at tomorrow's close and buys only the winners. It is the mistake, not a feature.
//  - A signal is read at the close of day t. The order fills at the OPEN of day t+1 (never the same bar).
//  - A stop is checked against the day's low. If the day opens below the stop, you get the open, not the stop.
//  - A trailing stop moves at the close and counts from the next day.
//  - Every sale pays the real Zerodha costs (delivery). Optional slippage on each side. No borrowed money.
import { computeCosts, type Rates } from "../costs";
import { atr, highestBefore, sma } from "./indicators";
import type { BtTrade, Config, RunResult, Series, Strategy } from "./types";

interface Pos { symbol: string; qty: number; entry: number; stop: number; initialStop: number; entryDay: string; atrAtSignal: number }
interface Pend { symbol: string; atr: number }

export function validateStrategy(s: Strategy): string[] {
  const e: string[] = [];
  if (s.version !== 1) e.push("Unknown strategy version.");
  if (!["buy_and_hold", "sma_cross", "breakout"].includes(s.type)) e.push("Unknown strategy type.");
  const pos = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n > 0;
  if (s.type === "sma_cross") { if (!pos(s.fast) || !pos(s.slow) || s.fast! >= s.slow!) e.push("The fast average must be shorter than the slow one."); }
  if (s.type === "breakout" && (!Number.isInteger(s.lookback) || s.lookback! < 2)) e.push("Look-back must be a whole number of days, at least 2.");
  if (s.type !== "buy_and_hold") { if (!pos(s.stopAtr)) e.push("The stop distance must be above zero."); if (!pos(s.riskPct) || s.riskPct > 5) e.push("Risk per trade must be above 0 and at most 5 percent."); }
  if (!Number.isInteger(s.maxPositions) || s.maxPositions < 1) e.push("Open positions must be at least 1.");
  return e;
}

export function runBacktest(rates: Rates, universe: Series[], s: Strategy, cfg: Config): RunResult {
  const errs = validateStrategy(s); if (errs.length) throw new Error(errs[0]);
  const days = [...new Set(universe.flatMap((x) => x.bars.map((b) => b.d)))].sort();
  const lo = cfg.from ? days.findIndex((d) => d >= cfg.from!) : 0;
  let hi = cfg.to ? days.length - 1 : days.length - 1; if (cfg.to) { hi = -1; days.forEach((d, i) => { if (d <= cfg.to!) hi = i; }); }
  if (lo < 0 || hi < lo) return { trades: [], equity: [], skipped: [], exposure: 0 };

  const S = universe.map((u) => {
    const idx = new Map(u.bars.map((b, i) => [b.d, i] as const));
    return { u, idx, atr: atr(u.bars, s.atrPeriod), fast: s.type === "sma_cross" ? sma(u.bars.map((b) => b.c), s.fast!) : [], slow: s.type === "sma_cross" ? sma(u.bars.map((b) => b.c), s.slow!) : [], hh: s.type === "breakout" ? highestBefore(u.bars, s.lookback!) : [] };
  });
  const slip = (p: number, side: 1 | -1) => Math.max(1, Math.round(p * (1 + (side * cfg.slippageBps) / 10000)));

  let cash = cfg.capitalPaise, expo = 0;
  const pos = new Map<string, Pos>(), pend: Pend[] = [], pendExit = new Set<string>();
  const trades: BtTrade[] = [], skipped: RunResult["skipped"] = [], equity: RunResult["equity"] = [];

  const close = (p: Pos, day: string, px: number, why: BtTrade["exitReason"]) => {
    const sell = slip(px, -1);
    const costs = Math.round(computeCosts(rates, { buyPricePaise: p.entry, sellPricePaise: sell, quantity: p.qty, product: "cnc", exchange: "NSE", dpCharge: true }).totalPaise * cfg.costMult);
    const gross = (sell - p.entry) * p.qty, risk = (p.entry - p.initialStop) * p.qty;
    cash += sell * p.qty - costs;
    trades.push({ symbol: p.symbol, entryDay: p.entryDay, exitDay: day, entryPaise: p.entry, exitPaise: sell, qty: p.qty, stopPaise: p.initialStop, grossPaise: gross, costsPaise: costs, netPaise: gross - costs, plannedRiskPaise: risk, r: risk > 0 ? (gross - costs) / risk : 0, exitReason: why });
    pos.delete(p.symbol);
  };
  const equityNow = (di: number) => { let v = cash; for (const p of pos.values()) { const x = S.find((q) => q.u.symbol === p.symbol)!; const i = x.idx.get(days[di]!); const last = i !== undefined ? x.u.bars[i]!.c : x.u.bars[x.u.bars.length - 1]!.c; v += p.qty * last; } return v; };
  const open = (symbol: string, day: string, px: number, atrV: number) => {
    const fill = slip(px, 1), eq = equityNow(daysIndex(day));
    let qty: number, stop: number;
    if (s.type === "buy_and_hold") { qty = Math.floor(cash / Math.max(1, universe.length - pos.size) / fill); stop = 1; }
    else {
      stop = Math.max(1, Math.round(fill - s.stopAtr * atrV));
      if (stop >= fill) { skipped.push({ d: day, symbol, why: "The stop would not be below the price." }); return; }
      qty = Math.floor(((eq * s.riskPct) / 100) / (fill - stop));
      qty = Math.min(qty, Math.floor(eq / s.maxPositions / fill)); // no bigger than an equal share of your money
    }
    qty = Math.min(qty, Math.floor(cash / fill));
    if (qty < 1) { skipped.push({ d: day, symbol, why: "Not enough money for even one share within your limits." }); return; }
    cash -= qty * fill; pos.set(symbol, { symbol, qty, entry: fill, stop, initialStop: stop, entryDay: day, atrAtSignal: atrV });
  };
  const dayIdx = new Map(days.map((d, i) => [d, i] as const)); const daysIndex = (d: string) => dayIdx.get(d)!;

  for (let di = lo; di <= hi; di++) {
    const day = days[di]!;
    // 1) Orders made on yesterday's close fill at today's open.
    for (const p of [...pos.values()]) if (pendExit.has(p.symbol)) { const x = S.find((q) => q.u.symbol === p.symbol)!, i = x.idx.get(day); if (i !== undefined) { close(p, day, x.u.bars[i]!.o, "signal"); pendExit.delete(p.symbol); } }
    for (const o of pend.splice(0)) { const x = S.find((q) => q.u.symbol === o.symbol)!, i = x.idx.get(day); if (i !== undefined && !pos.has(o.symbol)) open(o.symbol, day, x.u.bars[i]!.o, o.atr); }
    // 2) Stops. A day that opens below the stop gets the open.
    for (const p of [...pos.values()]) {
      const x = S.find((q) => q.u.symbol === p.symbol)!, i = x.idx.get(day);
      if (i === undefined) { if (x.u.delisted && day > x.u.bars[x.u.bars.length - 1]!.d) close(p, day, x.u.bars[x.u.bars.length - 1]!.c, "delisted"); continue; }
      const b = x.u.bars[i]!;
      if (s.type !== "buy_and_hold" && b.l <= p.stop) close(p, day, Math.min(b.o, p.stop), "stop");
    }
    // 3) End of day: move trailing stops, then read signals for tomorrow.
    for (const x of S) {
      const i = x.idx.get(day); if (i === undefined) continue; const b = x.u.bars[i]!, held = pos.get(x.u.symbol);
      if (held && s.type === "breakout" && s.trailAtr && !isNaN(x.atr[i]!)) held.stop = Math.max(held.stop, Math.round(b.c - s.trailAtr * x.atr[i]!));
      if (held && s.type === "sma_cross" && !isNaN(x.slow[i]!) && x.fast[i]! < x.slow[i]!) { if (cfg.fillAt === "same_close") close(held, day, b.c, "signal"); else pendExit.add(x.u.symbol); }
      if (held || pend.some((o) => o.symbol === x.u.symbol)) continue;
      let signal = false;
      if (s.type === "buy_and_hold") signal = di === lo;
      else if (s.type === "sma_cross") signal = i > 0 && !isNaN(x.slow[i - 1]!) && x.fast[i - 1]! <= x.slow[i - 1]! && x.fast[i]! > x.slow[i]!;
      else signal = !isNaN(x.hh[i]!) && b.c > x.hh[i]!;
      if (!signal || isNaN(x.atr[i]!) && s.type !== "buy_and_hold") continue;
      if (pos.size + pend.length >= s.maxPositions) { skipped.push({ d: day, symbol: x.u.symbol, why: "Already holding the most positions you allow." }); continue; }
      if (cfg.fillAt === "same_close") { const tomorrow = x.u.bars[i + 1]; if (tomorrow && tomorrow.c > b.c) open(x.u.symbol, day, b.c, x.atr[i]!); } // peeking: only buys that tomorrow proves right
      else pend.push({ symbol: x.u.symbol, atr: x.atr[i]! });
    }
    if (pos.size) expo++;
    equity.push({ d: day, v: equityNow(di) });
  }
  for (const p of [...pos.values()]) { const x = S.find((q) => q.u.symbol === p.symbol)!; const i = (() => { let k = -1; x.u.bars.forEach((b, j) => { if (b.d <= days[hi]!) k = j; }); return k; })(); close(p, days[hi]!, x.u.bars[Math.max(0, i)]!.c, "end"); }
  if (equity.length) equity[equity.length - 1]!.v = cash;
  return { trades, equity, skipped, exposure: equity.length ? expo / equity.length : 0 };
}
