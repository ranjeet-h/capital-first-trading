// Forward-test script. Run once a day after the market closes. It reads end-of-day price files, logs what a fixed rule would have done, and places no orders.
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, openSync, closeSync, unlinkSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import type { Rates } from "../../packages/core/src/costs";
import ratesJson from "../../data/rates/zerodha-equity.json";
import { parseBarsCsv, checkSeries, runForward, toLog, marketIsFinished, strategyHash, type Problem, type ForwardConfig } from "../../packages/core/src/forward";
import { validateStrategy } from "../../packages/core/src/backtest/engine";
import type { Strategy } from "../../packages/core/src/backtest/types";

export interface Raw { strategyFile: string; symbols: string[]; capitalRupees: number; startDate: string; dataSource: "csvDir"; csvDir: string; outDir: string; slippageBps?: number }

const fail = (say: (s: string) => void, msg: string) => { say("Stopped: " + msg); return 1; };

export function runCli(argv: string[], now: Date, say: (s: string) => void = console.log, rates?: Rates): number {
  const ci = argv.indexOf("--config"), configPath = ci >= 0 ? argv[ci + 1] : undefined;
  if (!configPath) return fail(say, "Tell me the config file: npm run forward -- --config forward.config.json");
  const rebuild = argv.includes("--rebuild");
  let raw: Raw, strategy: Strategy;
  const base = dirname(resolve(configPath));
  try { raw = JSON.parse(readFileSync(configPath, "utf8")) as Raw; } catch { return fail(say, `Could not read the config file ${configPath}.`); }
  if (raw.dataSource !== "csvDir") return fail(say, 'dataSource must be "csvDir". Downloading prices is not built in. Save one file per share (SYMBOL.csv) in a folder and point csvDir at it.');
  try { strategy = JSON.parse(readFileSync(resolve(base, raw.strategyFile), "utf8")) as Strategy; } catch { return fail(say, "Could not read the strategy file."); }
  const bad = validateStrategy(strategy); if (bad.length) return fail(say, "The strategy file is not valid: " + bad[0]);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.startDate) || !Array.isArray(raw.symbols) || !raw.symbols.length || !(raw.capitalRupees > 0)) return fail(say, "The config needs startDate (YYYY-MM-DD), symbols and capitalRupees.");

  const out = resolve(base, raw.outDir), csvDir = resolve(base, raw.csvDir), log = join(out, "forward_log.csv"), statePath = join(out, "forward_state.json"), warnPath = join(out, "forward_warnings.log"), lockPath = join(out, "forward.lock");
  mkdirSync(out, { recursive: true });
  try { closeSync(openSync(lockPath, "wx")); } catch { return fail(say, "Another run is in progress (forward.lock exists). If you are sure none is, delete that file."); }
  try {
    const warn = (ps: Problem[]) => { appendFileSync(warnPath, ps.map((p) => `${now.toISOString()} ${p.symbol}${p.day ? " " + p.day : ""}: ${p.why}`).join("\n") + "\n"); ps.slice(0, 8).forEach((p) => say(`  ${p.symbol}${p.day ? " " + p.day : ""}: ${p.why}`)); };
    const hash = strategyHash(strategy);
    let prev: { strategyHash: string; startDate: string } | null = null;
    if (existsSync(statePath) && !rebuild) {
      try { prev = JSON.parse(readFileSync(statePath, "utf8")); if (!prev || typeof prev.strategyHash !== "string") throw 0; }
      catch { return fail(say, "forward_state.json is damaged. Nothing was changed. Run again with --rebuild to build it again from your price files."); }
      if (prev.strategyHash !== hash || prev.startDate !== raw.startDate) return fail(say, "The rule or the start date is different from the one this test began with. A forward test must keep one rule. Use a new outDir for a new test.");
    }
    const problems: Problem[] = [], universe = [];
    for (const sym of raw.symbols) {
      const f = join(csvDir, sym + ".csv");
      if (!existsSync(f)) { problems.push({ symbol: sym, why: "No price file found." }); continue; }
      const r = parseBarsCsv(sym, readFileSync(f, "utf8")); problems.push(...r.problems); universe.push(r.series);
    }
    const latest = universe.flatMap((u) => u.bars.map((b) => b.d)).sort().pop() ?? "";
    for (const u of universe) problems.push(...checkSeries(u, latest));
    if (!latest) problems.push({ symbol: "all", why: "No prices were found." });
    if (problems.length) { warn(problems); return fail(say, `${problems.length} problem(s) with the price data. No trades were logged today.`) ; }
    if (!marketIsFinished(now, latest)) return fail(say, `The market closing bar for ${latest} may not be complete. Run again after 15:45 India time.`);
    const age = (now.getTime() - new Date(latest + "T00:00:00Z").getTime()) / 86400000;
    if (age > 5) { warn([{ symbol: "all", day: latest, why: "The newest price is more than 5 days old." }]); return fail(say, "The price files look stale. No trades were logged today."); }

    const cfg: ForwardConfig = { strategy, startDate: raw.startDate, capitalPaise: Math.round(raw.capitalRupees * 100), slippageBps: raw.slippageBps, symbols: raw.symbols, source: "csvDir" };
    const res = runForward(rates ?? (ratesJson as unknown as Rates), universe, cfg);
    writeFileSync(log, toLog(res, "csvDir"));
    writeFileSync(statePath, JSON.stringify({ version: 1, strategyHash: hash, strategyName: strategy.name, startDate: raw.startDate, lastDay: res.lastDay, source: "csvDir", open: res.open.map((t) => ({ symbol: t.symbol, entryDay: t.entryDay, entryPaise: t.entryPaise, qty: t.qty, stopPaise: t.stopPaise })), before: res.before }, null, 2) + "\n");
    say(`Done. Prices to ${res.lastDay}. Closed trades: ${res.closed.length}. Open now: ${res.open.length}.`);
    for (const t of res.open) say(`  open: ${t.symbol} ${t.qty} shares from ${t.entryDay}`);
    say("These are hypothetical. No order was placed anywhere.");
    return 0;
  } finally { try { unlinkSync(lockPath); } catch { /* already gone */ } }
}
