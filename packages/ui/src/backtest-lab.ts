// Lab 4: the strategy tester. It runs a simple rule on made-up prices, with real costs, and shows why backtests lie.
import rawRates from "../../../data/rates/zerodha-equity.json";
import type { Rates } from "../../core/src/costs";
import { generateUniverse } from "../../core/src/backtest/synth";
import { runBacktest, validateStrategy } from "../../core/src/backtest/engine";
import { summarise, type Summary } from "../../core/src/backtest/metrics";
import type { splitTest, walkForward, lookAheadDemo, survivorshipDemo, costSensitivity, overfitDemo, monteCarlo } from "../../core/src/backtest/experiments";
import { computeExperiment, type ExpArgs, type ExpKey } from "../../core/src/backtest/compute";
import { tradeWindow, type RegimeRow } from "../../core/src/backtest/replay";
import { DEFAULT_CONFIG, type Config, type RunResult, type Series, type Strategy, type StrategyType } from "../../core/src/backtest/types";
import { parseBarsCsv, checkSeries } from "../../core/src/forward";
import { IndexedDbStore } from "../../core/src/store";
import type { Trade } from "../../core/src/journal";
import { h, fmtRs, fmtInt, parseNum } from "./util";
import { textField, segmented } from "./field";
import { lineChart } from "./journal-lab";

const R = rawRates as unknown as Rates;
const TYPE_LABEL: [StrategyType, string][] = [["breakout", "Breakout"], ["sma_cross", "Two averages"], ["buy_and_hold", "Buy and hold"]];
const TYPE_HELP: Record<StrategyType, string> = {
  breakout: "Buy when the price closes above its highest price of the last N days. Sell when a trailing stop-loss is hit.",
  sma_cross: "Buy when the quick average rises above the slow average. Sell when it falls back below.",
  buy_and_hold: "Buy everything on day one and never sell. This is the yardstick to beat.",
};
const hash = (s: string) => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0; return (x >>> 0).toString(36); };
const pct = (n: number) => n.toFixed(1) + "%";

export class LabBacktest extends HTMLElement {
  private out!: HTMLElement;
  private universe: Series[] = [];
  private real: Series[] | null = null;
  private realNote!: HTMLElement;
  private last: { run: RunResult; strategy: Strategy; cfg: Config; seed: number } | null = null;
  private type: StrategyType = "breakout";

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "1"; this.className = "lab-host";
    const root = h("div", { class: "lab lab-bt" });
    this.append(root);
    const seed = textField("Seed", "11", { name: "seed", whole: true, hint: "The same seed always makes the same made-up prices." });
    const years = textField("Years of prices", "8", { name: "years", whole: true, hint: "2 to 10." });
    const shares = textField("Number of shares", "16", { name: "shares", whole: true, hint: "4 to 30." });
    const capital = textField("Starting money", "100000", { name: "capital", prefix: "Rs", hint: "Pretend money." });
    const risk = textField("Risk per trade", "1", { name: "risk", suffix: "%", hint: "Of your money, at most 5." });
    const maxPos = textField("Most shares held at once", "5", { name: "maxpos", whole: true });
    const look = textField("Look-back days", "20", { name: "lookback", whole: true, hint: "Breakout: how far back to look for the high." });
    const stopAtr = textField("Stop-loss distance", "2", { name: "stopatr", hint: "In ATR, the usual daily swing." });
    const trail = textField("Trailing stop distance", "3", { name: "trail", hint: "In ATR." });
    const fast = textField("Quick average days", "20", { name: "fast", whole: true });
    const slow = textField("Slow average days", "50", { name: "slow", whole: true });
    const slip = textField("Slippage each side", "5", { name: "slip", suffix: "bps", hint: "100 bps is 1%. Real orders rarely fill at the exact price." });
    this.realNote = h("p", { class: "lab-note", role: "status" });
    const files = h("input", { type: "file", id: "bt-files", name: "pricefiles", accept: ".csv,text/csv", multiple: true, onchange: () => void this.loadFiles(files) });
    const err = h("div", { class: "lab-err", role: "alert" });
    const params = h("div", { class: "lab-grid" });
    const showParams = () => { params.replaceChildren(...(this.type === "breakout" ? [look.root, trail.root] : this.type === "sma_cross" ? [fast.root, slow.root] : []), ...(this.type === "buy_and_hold" ? [] : [stopAtr.root, risk.root, maxPos.root])); help.textContent = TYPE_HELP[this.type]; };
    const help = h("p", { class: "lab-note" });
    const seg = segmented<StrategyType>("Which rule?", "btype", TYPE_LABEL, this.type, (v) => { this.type = v; showParams(); });
    showParams();
    this.out = h("div", { "aria-live": "polite" });

    const form = h("form", { class: "lab-form lab-card-box", onsubmit: (ev: Event) => { ev.preventDefault(); err.textContent = ""; void this.go(() => this.run()); } },
      h("h3", {}, "Set up a test"), seg.root, help, params,
      h("div", { class: "lab-grid" }, capital.root, slip.root),
      h("details", { class: "lab-more" }, h("summary", {}, "Prices: made-up or your own"), h("div", { class: "lab-grid" }, seed.root, shares.root, years.root),
        h("div", { class: "lab-field" }, h("label", { for: "bt-files" }, "Or use your own price files"), files, h("p", { class: "lab-hint" }, "One CSV file per share, named like RELIANCE.csv, with date, open, high, low, close and volume. They stay on this device. Real prices make the made-up settings above unused."), this.realNote)),
      err, h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, "Run the test"));
    root.append(h("div", { class: "lab-banner", role: "note" }, h("strong", {}, "Hypothetical backtest. Not live results."), " The prices are made up by a computer unless you choose your own files. No order is ever placed."), form, this.out);

    const num = (f: { input: HTMLInputElement }) => parseNum(f.input.value);
    this.run = () => {
      const s = Math.round(num(seed)), y = Math.round(num(years)), n = Math.round(num(shares)), cap = num(capital) * 100;
      if (!(cap >= 10000_00 && cap <= 10_00_00_000_00)) throw new Error("Starting money must be from Rs 10,000 to Rs 10 crore.");
      const strategy: Strategy = { version: 1, name: TYPE_LABEL.find((t) => t[0] === this.type)![1], type: this.type, atrPeriod: 14, stopAtr: num(stopAtr), riskPct: this.type === "buy_and_hold" ? 1 : num(risk), maxPositions: this.type === "buy_and_hold" ? (this.real?.length ?? n) : Math.round(num(maxPos)),
        ...(this.type === "breakout" ? { lookback: Math.round(num(look)), trailAtr: num(trail) } : this.type === "sma_cross" ? { fast: Math.round(num(fast)), slow: Math.round(num(slow)) } : {}) };
      const bad = validateStrategy(strategy); if (bad.length) throw new Error(bad[0]);
      const cfg: Config = { ...DEFAULT_CONFIG, capitalPaise: Math.round(cap), slippageBps: Math.max(0, num(slip) || 0) };
      if (!this.real) { if (!(y >= 2 && y <= 10)) throw new Error("Years of prices must be from 2 to 10."); if (!(n >= 4 && n <= 30)) throw new Error("Number of shares must be from 4 to 30."); }
      this.universe = this.real ?? generateUniverse(s, n, y);
      const run = runBacktest(R, this.universe, strategy, cfg);
      this.last = { run, strategy, cfg, seed: s };
      this.show();
    };
    this.errBox = err;
  }
  private run!: () => void;
  private errBox!: HTMLElement;
  private async loadFiles(input: HTMLInputElement) {
    const fl = [...(input.files ?? [])]; this.real = null; this.realNote.textContent = "";
    if (!fl.length) return;
    const series: Series[] = [], bad: string[] = [];
    for (const f of fl) {
      const sym = f.name.replace(/\.csv$/i, "").toUpperCase(), r = parseBarsCsv(sym, await f.text());
      const probs = [...r.problems, ...(r.series.bars.length ? checkSeries(r.series, r.series.bars[r.series.bars.length - 1]!.d).filter((p) => !p.why.startsWith("The newest")) : [])];
      if (probs.length || r.series.bars.length < 200) bad.push(`${f.name}: ${probs[0]?.why ?? "Fewer than 200 days of prices."}`); else series.push(r.series);
    }
    if (bad.length) { this.realNote.className = "lab-err"; this.realNote.setAttribute("role", "alert"); this.realNote.textContent = `Not used. ${bad.slice(0, 3).join(" ")}`; return; }
    this.real = series; this.realNote.className = "lab-note"; this.realNote.setAttribute("role", "status");
    this.realNote.textContent = `Using your prices: ${series.length} ${series.length === 1 ? "share" : "shares"}, ${series[0]!.bars[0]!.d} to ${series[0]!.bars[series[0]!.bars.length - 1]!.d}. Clear the choice to go back to made-up prices.`;
  }
  private async go(f: () => void) {
    this.out.replaceChildren(h("p", { class: "lab-note", role: "status" }, "Working…"));
    await new Promise((r) => setTimeout(r, 30));
    try { f(); } catch (e) { this.out.replaceChildren(); this.errBox.textContent = (e as Error).message; }
  }

  private cards(m: Summary): HTMLElement {
    const c = (k: string, v: string, s = "") => h("div", { class: "lab-card" }, h("div", { class: "lab-card-k" }, k), h("div", { class: "lab-card-v" }, v), h("div", { class: "lab-card-s" }, s));
    const st = m.stats;
    return h("div", { class: "lab-cards lab-cards-4" },
      c("Money at the end", fmtRs(m.endPaise), `Started with ${fmtRs(m.startPaise)}`),
      c("Result", pct(m.returnPct), m.cagr === null ? "Too short for a yearly rate" : `${pct(m.cagr)} a year`),
      c("Trades", fmtInt(st.count), st.count ? `${st.wins} won, ${st.losses} lost` : "The rule never fired"),
      c("Costs paid", fmtRs(st.costsPaise), st.costShareOfGrossProfit !== null ? `${(st.costShareOfGrossProfit * 100).toFixed(1)}% of gross winnings` : ""),
      c("Biggest drop", pct(m.maxDrawdownPct), `Longest stretch below a high: ${fmtInt(m.maxDrawdownDays)} days`),
      c("Win rate", st.count ? (st.winRate * 100).toFixed(0) + "%" : "n/a", "Winning often is not the same as making money"),
      c("Profit factor", st.profitFactor === null ? "n/a" : st.profitFactor.toFixed(2), "Total won divided by total lost"),
      c("In the market", (m.exposure * 100).toFixed(0) + "% of days", "Money sitting in cash earns nothing here"));
  }

  private show() {
    const { run, cfg } = this.last!, m = summarise(run, cfg.capitalPaise);
    const o = this.out; o.replaceChildren();
    o.append(h("h3", {}, "Result"), this.cards(m));
    if (m.stats.count < 30) o.append(h("div", { class: "lab-conflicts", role: "note" }, h("strong", {}, "Too few trades to trust this"), h("p", {}, `Only ${m.stats.count} trades. Below 30, luck can look like skill.`)));
    if (run.equity.length > 1) o.append(h("div", { class: "lab-charts" }, lineChart("Money over time (after costs)", run.equity.map((e) => e.v / 100))));
    if (run.skipped.length) o.append(h("p", { class: "lab-note" }, `${run.skipped.length} signals were skipped, for example: ${run.skipped[0]!.why}`));
    o.append(this.replay(), this.experiments());
    o.append(h("section", { class: "lab-card-box" }, h("h3", {}, "Keep these trades"), h("p", { class: "lab-note" }, "Adds every trade of this test to your journal under Backtest. They stay apart from your paper and live trades."),
      h("button", { type: "button", class: "lab-btn", disabled: run.trades.length === 0, onclick: (ev: Event) => void this.toJournal(ev.currentTarget as HTMLButtonElement) }, "Add to my journal")));
  }

  private worker: Worker | null | undefined;
  /** Runs an experiment in a Web Worker when the browser allows it, and on the page itself when it does not. */
  private compute<T>(key: ExpKey): Promise<T> {
    const { strategy, cfg, seed, run } = this.last!, args: ExpArgs = { rates: R, universe: this.universe, strategy, cfg, seed, trades: run.trades };
    const direct = () => computeExperiment(key, args) as T;
    if (this.worker === undefined) { try { this.worker = new Worker("bt-worker.js"); } catch { this.worker = null; } }
    const w = this.worker; if (!w) return Promise.resolve().then(direct);
    return new Promise<T>((ok, no) => {
      const id = ++this.jobs, onMsg = (e: MessageEvent<{ id: number; result?: T; error?: string }>) => {
        if (e.data.id !== id) return; w.removeEventListener("message", onMsg); w.removeEventListener("error", onErr);
        e.data.error ? no(new Error(e.data.error)) : ok(e.data.result as T);
      }, onErr = () => { w.removeEventListener("message", onMsg); w.removeEventListener("error", onErr); this.worker = null; try { ok(direct()); } catch (x) { no(x); } };
      w.addEventListener("message", onMsg); w.addEventListener("error", onErr); w.postMessage({ id, key, args });
    });
  }
  private jobs = 0;

  private experiments(): HTMLElement {
    const box = h("section", { class: "lab-card-box lab-exps" }, h("h3", {}, "Why backtests lie: try these"), h("p", { class: "lab-note" }, "Each experiment changes one thing. Read what it shows before you trust any backtest."));
    const mk = <T,>(title: string, why: string, key: ExpKey, show: (into: HTMLElement, r: T) => void) => {
      const into = h("div", { class: "lab-exp-out", "aria-live": "polite" });
      const d = h("details", { class: "lab-exp" }, h("summary", {}, title), h("p", { class: "lab-note" }, why), h("button", { type: "button", class: "lab-btn", onclick: () => {
        into.replaceChildren(h("p", { class: "lab-note", role: "status" }, "Working…"));
        this.compute<T>(key).then((r) => show(into, r)).catch((e) => into.replaceChildren(h("p", { class: "lab-err" }, (e as Error).message)));
      } }, "Run this"), into);
      return d;
    };
    const { strategy } = this.last!, u = () => this.universe;
    const tbl = (head: string[], rows: string[][]) => h("table", { class: "lab-table" }, h("thead", {}, h("tr", {}, ...head.map((x, i) => h("th", { class: i ? "lab-num" : "" }, x)))), h("tbody", {}, ...rows.map((r) => h("tr", {}, ...r.map((x, i) => (i ? h("td", { class: "lab-num" }, x) : h("th", { scope: "row" }, x)))))));
    const row = (name: string, m: Summary) => [name, fmtRs(m.stats.netPaise), pct(m.maxDrawdownPct), fmtInt(m.stats.count)];
    box.append(
      mk<ReturnType<typeof splitTest>>("1. Test on days the rule has never seen", "The first 70% of the days is where you learn. The last 30% is the honest test. The second row is the number to believe.", "split", (into, t) => {
        into.replaceChildren(tbl(["Period", "Profit after costs", "Biggest drop", "Trades"], [row(`Learning (to ${t.split.lastInSample})`, t.inSample), row(`Never seen (from ${t.split.firstOut})`, t.outOfSample)]),
          h("p", { class: "lab-note" }, "A rule that looks great while learning and poor on days it has not seen was probably fitted to the past."));
      }),
      mk<ReturnType<typeof lookAheadDemo>>("2. Peeking at the future", "Cheating on purpose: the rule buys at the same close it saw, and only when tomorrow turns out higher. Nobody can do this in real life.", "lookahead", (into, t) => {
        into.replaceChildren(tbl(["Rule", "Profit after costs", "Biggest drop", "Trades"], [row("Honest: buy at the next open", t.honest), row("Peeking", t.peeking)]), h("p", { class: "lab-note" }, "If a result looks too good, check whether it quietly used information from the future."));
      }),
      mk<ReturnType<typeof survivorshipDemo>>("3. Shares that disappeared", "Real markets have shares that were delisted. Lists of today's shares leave them out. Here, buy and hold on everything versus only the shares that survived.", "survivor", (into, t) => {
        into.replaceChildren(tbl(["List", "Money at the end", "Biggest drop", "Shares"], [["All shares, including " + t.delistedCount + " that vanished", fmtRs(t.everything.endPaise), pct(t.everything.maxDrawdownPct), fmtInt(u().length)], ["Only the survivors", fmtRs(t.survivorsOnly.endPaise), pct(t.survivorsOnly.maxDrawdownPct), fmtInt(u().length - t.delistedCount)]]),
          h("p", { class: "lab-note" }, t.delistedCount ? "Testing only on shares that still exist makes the past look kinder than it was." : "No share vanished in these prices, so both rows match. Real lists of old shares are never this tidy."));
      }),
      mk<ReturnType<typeof costSensitivity>>("4. What if costs are higher?", "Slide the costs from nothing to three times the real ones. Many rules that trade often stop working once costs are real.", "cost", (into, c) => {
        into.replaceChildren(tbl(["Costs", "Costs paid", "Profit after costs"], c.map((x) => [x.mult === 0 ? "None" : x.mult === 1 ? "Real costs" : `${x.mult} times real`, fmtRs(x.costsPaise), fmtRs(x.netPaise)])));
      }),
      mk<ReturnType<typeof overfitDemo>>("5. Trying many settings (overfitting)", "This tries 25 breakout settings on the learning days, keeps the best, then tests only that one on days it has not seen.", "overfit", (into, t) => {
        into.replaceChildren(tbl(["", "Profit after costs"], [[`Average of all ${t.combos} settings, learning days`, fmtRs(Math.round(t.averageInSamplePaise))], [`Best setting (look-back ${t.best.lookback}, stop ${t.best.stopAtr}), learning days`, fmtRs(t.best.netPaise)], ["The same best setting, days it never saw", fmtRs(t.bestOut.stats.netPaise)]]),
          h("p", { class: "lab-note" }, `You tried ${t.combos} settings. The more you try, the more likely the best one is just lucky.`));
      }),
      mk<ReturnType<typeof walkForward>>("6. Walk-forward: learn, then test, again and again", "The days are cut into five slices. It learns the best setting on the slices so far, then tests only that setting on the next slice. This is the fairest picture of a rule that gets tuned.", "walk", (into, w) => {
        if (!w.folds.length) { into.replaceChildren(h("p", { class: "lab-note" }, "There are too few days for this test. Use at least about three years of prices.")); return; }
        into.replaceChildren(tbl(["Tested on, and the setting used", "Learned", "Test result"], w.folds.map((f) => [`${f.testFrom.slice(0, 7)} to ${f.testTo.slice(0, 7)}. Look-back ${f.lookback}, stop ${f.stopAtr}.`, fmtRs(f.trainPaise), fmtRs(f.testPaise)])),
          h("p", {}, h("strong", {}, `All test slices together: ${fmtRs(w.totalTestPaise)} from ${w.totalTestTrades} trades.`)),
          h("p", { class: "lab-note" }, "Only the last column counts. If it is far below the learned column, the tuning found luck, not an edge."));
      }),
      mk<ReturnType<typeof monteCarlo>>("7. The same trades in a different order", "Shuffle the order of your trades 1,000 times. The trades are the same, only their luck of order changes. See how bad a run of bad luck can get.", "mc", (into, t) => {
        into.replaceChildren(t.runs === 0 ? h("p", { class: "lab-note" }, "No trades to shuffle.") : tbl(["After 1,000 shuffles", ""], [["A typical biggest drop", pct(t.medianDrawdownPct)], ["A bad-luck biggest drop (1 time in 20)", pct(t.p95DrawdownPct)], ["A bad-luck losing streak (1 time in 20)", fmtInt(t.p95LosingStreak) + " trades"], [`Chance of losing ${t.ruinAtPct}% of your money`, (t.ruinChance * 100).toFixed(1) + "%"]]));
      }),
      mk<{ rows: RegimeRow[] | null }>("8. Does it work in every kind of market?", "The made-up prices run through rising, falling and sideways stretches. This groups your trades by the kind of market they began in.", "regime", (into, t) => {
        if (!t.rows) { into.replaceChildren(h("p", { class: "lab-note" }, "Your own price files carry no market labels, so this view is only for made-up prices.")); return; }
        into.replaceChildren(tbl(["Market", "Won", "Profit", "Average R"], t.rows.map((r) => [r.label.replace(" market", ""), r.trades ? `${r.wins} of ${r.trades}` : "none", fmtRs(r.netPaise), r.avgR === null ? "n/a" : r.avgR.toFixed(2)])),
          h("p", { class: "lab-note" }, "A rule often makes its money in one kind of market and gives it back in another. Read each row, not just the total."));
      }));
    return box;
  }

  private replay(): HTMLElement {
    const { run } = this.last!, box = h("section", { class: "lab-card-box" }, h("h3", {}, "Look at one trade"), h("p", { class: "lab-note" }, "Pick a trade to see the prices around it, where you got in, where the stop was, and where you got out."));
    if (!run.trades.length) { box.append(h("p", { class: "lab-note" }, "There are no trades to look at.")); return box; }
    const sel = h("select", { id: "bt-trade", name: "tradepick", "aria-label": "Trade to look at" }, ...run.trades.map((t, i) => h("option", { value: String(i) }, `${t.symbol}, ${t.entryDay} to ${t.exitDay}, ${t.netPaise >= 0 ? "won" : "lost"} ${fmtRs(Math.abs(t.netPaise))}`)));
    const view = h("div", { class: "lab-replay" });
    const draw = () => {
      const t = run.trades[Number(sel.value)]!, s = this.universe.find((x) => x.symbol === t.symbol), v = s && tradeWindow(s, t);
      if (!v) { view.replaceChildren(h("p", { class: "lab-note" }, "No prices to show for this trade.")); return; }
      const W = 600, H = 240, pad = 8, lo = Math.min(...v.bars.map((b) => b.l), t.stopPaise), hi = Math.max(...v.bars.map((b) => b.h)), span = Math.max(1, hi - lo);
      const X = (i: number) => pad + (i * (W - 2 * pad)) / Math.max(1, v.bars.length - 1), Y = (p: number) => H - pad - ((p - lo) * (H - 2 * pad)) / span;
      const line = v.bars.map((b, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(b.c).toFixed(1)}`).join(" ");
      const svg = `<svg class="lab-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Closing prices around the trade. Entry day ${t.entryDay}, exit day ${t.exitDay}.">`
        + `<path d="${line}" fill="none" stroke="currentColor" stroke-width="2"/>`
        + `<line x1="${pad}" x2="${W - pad}" y1="${Y(t.stopPaise).toFixed(1)}" y2="${Y(t.stopPaise).toFixed(1)}" stroke="#c0392b" stroke-dasharray="5 4"/>`
        + `<line x1="${X(v.entryIdx).toFixed(1)}" x2="${X(v.entryIdx).toFixed(1)}" y1="${pad}" y2="${H - pad}" stroke="#2e8b57" stroke-width="2"/>`
        + `<line x1="${X(v.exitIdx).toFixed(1)}" x2="${X(v.exitIdx).toFixed(1)}" y1="${pad}" y2="${H - pad}" stroke="#c0392b" stroke-width="2"/></svg>`;
      const wrap = h("div", { class: "lab-charts" }); wrap.innerHTML = svg;
      view.replaceChildren(wrap, h("ul", { class: "lab-legend" }, h("li", {}, `Green line: bought ${t.qty} shares at ${fmtRs(t.entryPaise)} on ${t.entryDay}.`), h("li", {}, "Red dashed line: the first stop-loss at " + fmtRs(t.stopPaise) + "."), h("li", {}, `Red line: sold at ${fmtRs(t.exitPaise)} on ${t.exitDay} (${{ stop: "the stop was hit", signal: "the rule said sell", delisted: "the share stopped trading", end: "the test ended" }[t.exitReason]}).`), h("li", {}, `Result after costs: ${fmtRs(t.netPaise)}, which is ${t.r.toFixed(2)} times the money risked.`)));
    };
    sel.addEventListener("change", draw); box.append(h("div", { class: "lab-field" }, h("label", { for: "bt-trade" }, "Trade"), sel), view); draw();
    return box;
  }

  private async toJournal(btn: HTMLButtonElement) {
    const { run, strategy, cfg, seed } = this.last!;
    const tag = hash(JSON.stringify([strategy, cfg, seed, this.universe.length]));
    const now = new Date().toISOString(), at = (d: string, t: string) => new Date(`${d}T${t}+05:30`).toISOString();
    try {
      const store = new IndexedDbStore();
      for (let i = 0; i < run.trades.length; i++) {
        const t = run.trades[i]!;
        const rec: Trade = { id: `bt-${tag}-${i + 1}`, updated_at: now, entry_type: "trade", mode: "backtest", symbol: t.symbol, exchange: "NSE", product: "cnc", planned_at: at(t.entryDay, "09:15:00"),
          plan: { entryPaise: t.entryPaise, stopPaise: t.stopPaise, qty: t.qty, setup: strategy.name, thesis: this.real ? "Hypothetical backtest on price files chosen by the reader." : `Hypothetical backtest on made-up prices (seed ${seed}).`, checklistOk: false },
          amended_after_entry: false, amendments: [], opened_at: at(t.entryDay, "09:15:00"), entry_price_paise: t.entryPaise, entry_qty: t.qty, exits: [{ at: at(t.exitDay, "15:30:00"), qty: t.qty, pricePaise: t.exitPaise }],
          costs_paise: t.costsPaise, emotions: [], tags: ["backtest"], notes: "" };
        await store.put("journal", rec);
      }
      btn.replaceWith(h("p", { class: "lab-msg lab-msg-ok", role: "status" }, `Added ${run.trades.length} trades. Open the journal and choose Backtest at the top to see them.`));
    } catch { btn.after(h("p", { class: "lab-err", role: "alert" }, "Could not save to the journal in this browser.")); }
  }
}
