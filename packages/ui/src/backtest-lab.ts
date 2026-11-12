// Lab 4: the strategy tester. It runs a simple rule on made-up prices, with real costs, and shows why backtests lie.
import rawRates from "../../../data/rates/zerodha-equity.json";
import type { Rates } from "../../core/src/costs";
import { generateUniverse } from "../../core/src/backtest/synth";
import { runBacktest, validateStrategy } from "../../core/src/backtest/engine";
import { summarise, type Summary } from "../../core/src/backtest/metrics";
import { splitTest, lookAheadDemo, survivorshipDemo, costSensitivity, overfitDemo, monteCarlo } from "../../core/src/backtest/experiments";
import { DEFAULT_CONFIG, type Config, type RunResult, type Series, type Strategy, type StrategyType } from "../../core/src/backtest/types";
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
      h("details", { class: "lab-more" }, h("summary", {}, "Made-up prices"), h("div", { class: "lab-grid" }, seed.root, shares.root, years.root)),
      err, h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, "Run the test"));
    root.append(h("div", { class: "lab-banner", role: "note" }, h("strong", {}, "Hypothetical backtest. Not live results."), " The prices are made up by a computer. No real share is involved."), form, this.out);

    const num = (f: { input: HTMLInputElement }) => parseNum(f.input.value);
    this.run = () => {
      const s = Math.round(num(seed)), y = Math.round(num(years)), n = Math.round(num(shares)), cap = num(capital) * 100;
      if (!(y >= 2 && y <= 10)) throw new Error("Years of prices must be from 2 to 10.");
      if (!(n >= 4 && n <= 30)) throw new Error("Number of shares must be from 4 to 30.");
      if (!(cap >= 10000_00 && cap <= 10_00_00_000_00)) throw new Error("Starting money must be from Rs 10,000 to Rs 10 crore.");
      const strategy: Strategy = { version: 1, name: TYPE_LABEL.find((t) => t[0] === this.type)![1], type: this.type, atrPeriod: 14, stopAtr: num(stopAtr), riskPct: this.type === "buy_and_hold" ? 1 : num(risk), maxPositions: this.type === "buy_and_hold" ? n : Math.round(num(maxPos)),
        ...(this.type === "breakout" ? { lookback: Math.round(num(look)), trailAtr: num(trail) } : this.type === "sma_cross" ? { fast: Math.round(num(fast)), slow: Math.round(num(slow)) } : {}) };
      const bad = validateStrategy(strategy); if (bad.length) throw new Error(bad[0]);
      const cfg: Config = { ...DEFAULT_CONFIG, capitalPaise: Math.round(cap), slippageBps: Math.max(0, num(slip) || 0) };
      this.universe = generateUniverse(s, n, y);
      const run = runBacktest(R, this.universe, strategy, cfg);
      this.last = { run, strategy, cfg, seed: s };
      this.show();
    };
    this.errBox = err;
  }
  private run!: () => void;
  private errBox!: HTMLElement;
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
    o.append(this.experiments());
    o.append(h("section", { class: "lab-card-box" }, h("h3", {}, "Keep these trades"), h("p", { class: "lab-note" }, "Adds every trade of this test to your journal under Backtest. They stay apart from your paper and live trades."),
      h("button", { type: "button", class: "lab-btn", disabled: run.trades.length === 0, onclick: (ev: Event) => void this.toJournal(ev.currentTarget as HTMLButtonElement) }, "Add to my journal")));
  }

  private experiments(): HTMLElement {
    const box = h("section", { class: "lab-card-box lab-exps" }, h("h3", {}, "Why backtests lie: try these"), h("p", { class: "lab-note" }, "Each experiment changes one thing. Read what it shows before you trust any backtest."));
    const mk = (title: string, why: string, fn: (into: HTMLElement) => void) => {
      const into = h("div", { class: "lab-exp-out", "aria-live": "polite" });
      const d = h("details", { class: "lab-exp" }, h("summary", {}, title), h("p", { class: "lab-note" }, why), h("button", { type: "button", class: "lab-btn", onclick: () => { into.replaceChildren(h("p", { class: "lab-note", role: "status" }, "Working…")); setTimeout(() => { try { fn(into); } catch (e) { into.replaceChildren(h("p", { class: "lab-err" }, (e as Error).message)); } }, 30); } }, "Run this"), into);
      return d;
    };
    const { strategy, cfg } = this.last!, u = () => this.universe;
    const tbl = (head: string[], rows: string[][]) => h("table", { class: "lab-table" }, h("thead", {}, h("tr", {}, ...head.map((x, i) => h("th", { class: i ? "lab-num" : "" }, x)))), h("tbody", {}, ...rows.map((r) => h("tr", {}, ...r.map((x, i) => (i ? h("td", { class: "lab-num" }, x) : h("th", { scope: "row" }, x)))))));
    const row = (name: string, m: Summary) => [name, fmtRs(m.stats.netPaise), pct(m.maxDrawdownPct), fmtInt(m.stats.count)];
    box.append(
      mk("1. Test on days the rule has never seen", "The first 70% of the days is where you learn. The last 30% is the honest test. The second row is the number to believe.", (into) => {
        const t = splitTest(R, u(), strategy, cfg);
        into.replaceChildren(tbl(["Period", "Profit after costs", "Biggest drop", "Trades"], [row(`Learning (to ${t.split.lastInSample})`, t.inSample), row(`Never seen (from ${t.split.firstOut})`, t.outOfSample)]),
          h("p", { class: "lab-note" }, "A rule that looks great while learning and poor on days it has not seen was probably fitted to the past."));
      }),
      mk("2. Peeking at the future", "Cheating on purpose: the rule buys at the same close it saw, and only when tomorrow turns out higher. Nobody can do this in real life.", (into) => {
        const t = lookAheadDemo(R, u(), strategy, cfg);
        into.replaceChildren(tbl(["Rule", "Profit after costs", "Biggest drop", "Trades"], [row("Honest: buy at the next open", t.honest), row("Peeking", t.peeking)]), h("p", { class: "lab-note" }, "If a result looks too good, check whether it quietly used information from the future."));
      }),
      mk("3. Shares that disappeared", "Real markets have shares that were delisted. Lists of today's shares leave them out. Here, buy and hold on everything versus only the shares that survived.", (into) => {
        const t = survivorshipDemo(R, u(), strategy, cfg);
        into.replaceChildren(tbl(["List", "Money at the end", "Biggest drop", "Shares"], [["All shares, including " + t.delistedCount + " that vanished", fmtRs(t.everything.endPaise), pct(t.everything.maxDrawdownPct), fmtInt(u().length)], ["Only the survivors", fmtRs(t.survivorsOnly.endPaise), pct(t.survivorsOnly.maxDrawdownPct), fmtInt(u().length - t.delistedCount)]]),
          h("p", { class: "lab-note" }, "Testing only on shares that still exist makes the past look kinder than it was."));
      }),
      mk("4. What if costs are higher?", "Slide the costs from nothing to three times the real ones. Many rules that trade often stop working once costs are real.", (into) => {
        const c = costSensitivity(R, u(), strategy, cfg);
        into.replaceChildren(tbl(["Costs", "Costs paid", "Profit after costs"], c.map((x) => [x.mult === 0 ? "None" : x.mult === 1 ? "Real costs" : `${x.mult} times real`, fmtRs(x.costsPaise), fmtRs(x.netPaise)])));
      }),
      mk("5. Trying many settings (overfitting)", "This tries 25 breakout settings on the learning days, keeps the best, then tests only that one on days it has not seen.", (into) => {
        const t = overfitDemo(R, u(), strategy, cfg);
        into.replaceChildren(tbl(["", "Profit after costs"], [[`Average of all ${t.combos} settings, learning days`, fmtRs(Math.round(t.averageInSamplePaise))], [`Best setting (look-back ${t.best.lookback}, stop ${t.best.stopAtr}), learning days`, fmtRs(t.best.netPaise)], ["The same best setting, days it never saw", fmtRs(t.bestOut.stats.netPaise)]]),
          h("p", { class: "lab-note" }, `You tried ${t.combos} settings. The more you try, the more likely the best one is just lucky.`));
      }),
      mk("6. The same trades in a different order", "Shuffle the order of your trades 1,000 times. The trades are the same, only their luck of order changes. See how bad a run of bad luck can get.", (into) => {
        const t = monteCarlo(this.last!.run.trades, cfg.capitalPaise, this.last!.seed);
        into.replaceChildren(t.runs === 0 ? h("p", { class: "lab-note" }, "No trades to shuffle.") : tbl(["After 1,000 shuffles", ""], [["A typical biggest drop", pct(t.medianDrawdownPct)], ["A bad-luck biggest drop (1 time in 20)", pct(t.p95DrawdownPct)], ["A bad-luck losing streak (1 time in 20)", fmtInt(t.p95LosingStreak) + " trades"], [`Chance of losing ${t.ruinAtPct}% of your money`, (t.ruinChance * 100).toFixed(1) + "%"]]));
      }));
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
          plan: { entryPaise: t.entryPaise, stopPaise: t.stopPaise, qty: t.qty, setup: strategy.name, thesis: `Hypothetical backtest on made-up prices (seed ${seed}).`, checklistOk: false },
          amended_after_entry: false, amendments: [], opened_at: at(t.entryDay, "09:15:00"), entry_price_paise: t.entryPaise, entry_qty: t.qty, exits: [{ at: at(t.exitDay, "15:30:00"), qty: t.qty, pricePaise: t.exitPaise }],
          costs_paise: t.costsPaise, emotions: [], tags: ["backtest"], notes: "" };
        await store.put("journal", rec);
      }
      btn.replaceWith(h("p", { class: "lab-msg lab-msg-ok", role: "status" }, `Added ${run.trades.length} trades. Open the journal and choose Backtest at the top to see them.`));
    } catch { btn.after(h("p", { class: "lab-err", role: "alert" }, "Could not save to the journal in this browser.")); }
  }
}
