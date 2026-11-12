// Forward test: run a fixed rule on real end-of-day prices after the fact, one day at a time, and log what it would have done.
// It places no orders. The same engine as the strategy tester is used, so the two can never disagree.
import type { Rates } from "./costs";
import { rupeesToPaise, splitCsvLine } from "./console-import";
import type { Trade } from "./journal";
import { runBacktest, validateStrategy } from "./backtest/engine";
import { summarise } from "./backtest/metrics";
import { DEFAULT_CONFIG, type Bar, type BtTrade, type Series, type Strategy } from "./backtest/types";

export interface ForwardConfig { strategy: Strategy; startDate: string; capitalPaise: number; slippageBps?: number; symbols: string[]; source: string }
export interface Problem { symbol: string; day?: string; why: string }
export interface BtSummary { period: string; trades: number; winRatePct: number | null; expectancyR: number | null; netPaise: number }
export interface ForwardResult { closed: BtTrade[]; open: BtTrade[]; lastDay: string; before: BtSummary; strategyHash: string }

/** A short fixed fingerprint of text (FNV-1a), so a row can say which rule made it. */
export function hashText(s: string): string {
  let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}
export const strategyHash = (s: Strategy) => hashText(JSON.stringify(s));

/** Read one share's price file: date,open,high,low,close,volume with rupee prices. Bad rows are reported, never guessed. */
export function parseBarsCsv(symbol: string, csv: string): { series: Series; problems: Problem[] } {
  const problems: Problem[] = [], bars: Bar[] = [];
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  const head = splitCsvLine(lines[0] ?? "").map((x) => x.toLowerCase());
  const col = (n: string) => head.indexOf(n);
  const ix = ["date", "open", "high", "low", "close", "volume"].map(col);
  if (ix.some((i) => i < 0)) { problems.push({ symbol, why: "The file needs the columns date, open, high, low, close, volume." }); return { series: { symbol, bars, delisted: false }, problems }; }
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i]!), d = f[ix[0]!] ?? "";
    const p = [1, 2, 3, 4].map((k) => rupeesToPaise(f[ix[k]!] ?? "")), v = Number(f[ix[5]!]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || p.some((x) => x === null || x <= 0) || !Number.isFinite(v)) { problems.push({ symbol, day: d, why: `Row ${i + 1} is not a clean price row.` }); continue; }
    bars.push({ d, o: p[0]!, h: p[1]!, l: p[2]!, c: p[3]!, v });
  }
  bars.sort((a, b) => (a.d < b.d ? -1 : 1));
  return { series: { symbol, bars, delisted: false }, problems };
}

/** Checks that make the script stop instead of trading on bad data. */
export function checkSeries(s: Series, latestDay: string): Problem[] {
  const out: Problem[] = [];
  if (!s.bars.length) return [{ symbol: s.symbol, why: "No prices at all." }];
  s.bars.forEach((b, i) => {
    if (b.h < Math.max(b.o, b.c, b.l) || b.l > Math.min(b.o, b.c, b.h)) out.push({ symbol: s.symbol, day: b.d, why: "High and low do not fit the open and close." });
    if (b.v === 0) out.push({ symbol: s.symbol, day: b.d, why: "No shares traded that day." });
    if (i && Math.abs(b.c / s.bars[i - 1]!.c - 1) > 0.2) out.push({ symbol: s.symbol, day: b.d, why: "The price moved more than 20% in one day. Check for a split or a bonus." });
    if (i && b.d === s.bars[i - 1]!.d) out.push({ symbol: s.symbol, day: b.d, why: "The same day appears twice." });
  });
  const last = s.bars[s.bars.length - 1]!.d;
  if (last < latestDay) out.push({ symbol: s.symbol, day: last, why: `The newest price is ${last}, but other shares go to ${latestDay}.` });
  return out;
}

/** Indian market time. The cash market closes at 15:30; wait 15 minutes more so the closing bar is complete. */
export function marketIsFinished(now: Date, lastBarDay: string): boolean {
  const ist = new Date(now.getTime() + 330 * 60000), day = ist.toISOString().slice(0, 10), mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return !(lastBarDay >= day && mins < 15 * 60 + 45);
}

export function runForward(rates: Rates, universe: Series[], cfg: ForwardConfig): ForwardResult {
  const errs = validateStrategy(cfg.strategy); if (errs.length) throw new Error(errs[0]);
  const base = { ...DEFAULT_CONFIG, capitalPaise: cfg.capitalPaise, slippageBps: cfg.slippageBps ?? DEFAULT_CONFIG.slippageBps };
  const days = [...new Set(universe.flatMap((u) => u.bars.map((b) => b.d)))].sort();
  const lastDay = days[days.length - 1] ?? cfg.startDate;
  const now = runBacktest(rates, universe, cfg.strategy, { ...base, from: cfg.startDate });
  const back = days.filter((d) => d < cfg.startDate);
  const bt = back.length ? runBacktest(rates, universe, cfg.strategy, { ...base, to: back[back.length - 1] }) : null;
  const s = bt ? summarise(bt, cfg.capitalPaise) : null;
  const before: BtSummary = { period: back.length ? `${back[0]} to ${back[back.length - 1]}` : "no earlier prices", trades: bt?.trades.length ?? 0, winRatePct: s && s.stats.count ? s.stats.winRate * 100 : null, expectancyR: s && s.stats.rCount ? s.stats.expectancyR : null, netPaise: bt ? bt.trades.reduce((a, t) => a + t.netPaise, 0) : 0 };
  return { closed: now.trades.filter((t) => t.exitReason !== "end"), open: now.trades.filter((t) => t.exitReason === "end"), lastDay, before, strategyHash: strategyHash(cfg.strategy) };
}

const rs = (p: number) => (p / 100).toFixed(2);
export const LOG_HEADER = ["trade_id", "mode", "symbol", "exchange", "product", "status", "opened_at", "entry_price", "entry_qty", "plan_stop", "closed_at", "exit_price", "costs", "net_pnl", "r_multiple", "exit_reason", "strategy_hash", "data_source"];
export const tradeId = (hash: string, t: BtTrade) => `fw-${hash}-${t.symbol}-${t.entryDay}`;

/** The log is rebuilt from scratch every run, so the same prices always give the same bytes. */
export function toLog(res: ForwardResult, source: string): string {
  const rows = [...res.closed.map((t) => [t, "closed"] as const), ...res.open.map((t) => [t, "open"] as const)].sort((a, b) => (a[0].entryDay + a[0].symbol < b[0].entryDay + b[0].symbol ? -1 : 1));
  const q = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [LOG_HEADER.join(","), ...rows.map(([t, st]) => [tradeId(res.strategyHash, t), "forward", t.symbol, "NSE", "cnc", st, t.entryDay, rs(t.entryPaise), t.qty, rs(t.stopPaise), st === "closed" ? t.exitDay : "", st === "closed" ? rs(t.exitPaise) : "", st === "closed" ? rs(t.costsPaise) : "", st === "closed" ? rs(t.netPaise) : "", st === "closed" ? t.r.toFixed(2) : "", st === "closed" ? t.exitReason : "", res.strategyHash, source].map((x) => q(String(x))).join(","))].join("\n") + "\n";
}

export interface LogParse { trades: Trade[]; skipped: { row: number; reason: string }[] }
/** Read forward_log.csv back into journal trades (mode forward). */
export function parseForwardLog(csv: string, now: string): LogParse {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) throw new Error("The file is empty.");
  const head = splitCsvLine(lines[0]!), need = ["trade_id", "symbol", "entry_price", "entry_qty", "opened_at"];
  const miss = need.filter((c) => !head.includes(c));
  if (miss.length) throw new Error("This does not look like a forward-test log. Missing columns: " + miss.join(", ") + ".");
  const trades: Trade[] = [], skipped: LogParse["skipped"] = [];
  const at = (d: string, t: string) => new Date(`${d}T${t}+05:30`).toISOString();
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i]!), g = (n: string) => f[head.indexOf(n)] ?? "";
    const entry = rupeesToPaise(g("entry_price")), stop = rupeesToPaise(g("plan_stop")), qty = Number(g("entry_qty")), od = g("opened_at"), cd = g("closed_at");
    if (!g("trade_id") || !g("symbol") || entry === null || stop === null || !Number.isInteger(qty) || qty <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(od)) { skipped.push({ row: i + 1, reason: "This row is missing a price, a quantity or a date." }); continue; }
    const exit = rupeesToPaise(g("exit_price")), costs = rupeesToPaise(g("costs")) ?? 0;
    if (cd && exit === null) { skipped.push({ row: i + 1, reason: "This row has a close date but no exit price." }); continue; }
    trades.push({ id: g("trade_id"), updated_at: now, entry_type: "trade", mode: "forward", symbol: g("symbol"), exchange: "NSE", product: "cnc", planned_at: at(od, "09:15:00"),
      plan: { entryPaise: entry, stopPaise: stop, qty, setup: "Forward test", thesis: `Hypothetical trade from the forward-test script (rule ${g("strategy_hash")}).`, checklistOk: false },
      amended_after_entry: false, amendments: [], opened_at: at(od, "09:15:00"), entry_price_paise: entry, entry_qty: qty,
      exits: cd && exit !== null ? [{ at: at(cd, "15:30:00"), qty, pricePaise: exit }] : [], costs_paise: costs, emotions: [], tags: ["forward"], notes: "" });
  }
  return { trades, skipped };
}
