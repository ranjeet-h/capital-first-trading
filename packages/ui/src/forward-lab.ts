// Lab 5: bring the forward-test script's files into the journal and see how the rule is doing on days it was not tuned on.
import rawRates from "../../../data/rates/zerodha-equity.json";
import type { Rates } from "../../core/src/costs";
import { parseForwardLog, type BtSummary } from "../../core/src/forward";
import { resultOf, type Trade } from "../../core/src/journal";
import { computeStats, MIN_TRADES_FOR_TRUST } from "../../core/src/stats";
import { IndexedDbStore } from "../../core/src/store";
import { validateStrategy } from "../../core/src/backtest/engine";
import type { Strategy, StrategyType } from "../../core/src/backtest/types";
import { h, fmtRs, parseNum } from "./util";
import { textField, segmented } from "./field";

const R = rawRates as unknown as Rates;
interface State { strategyName?: string; startDate?: string; lastDay?: string; before?: BtSummary }
interface Preview { trades: Trade[]; fresh: Trade[]; changed: Trade[]; same: number; skipped: { row: number; reason: string }[]; state: State | null }
const same = (a: Trade, b: Trade) => JSON.stringify([a.entry_price_paise, a.entry_qty, a.exits, a.plan.stopPaise, a.costs_paise]) === JSON.stringify([b.entry_price_paise, b.entry_qty, b.exits, b.plan.stopPaise, b.costs_paise]);
const card = (k: string, v: string, sub = "") => h("div", { class: "lab-card" }, h("div", { class: "lab-card-k" }, k), h("div", { class: "lab-card-v" }, v), h("div", { class: "lab-card-s" }, sub));

export class LabForward extends HTMLElement {
  private out!: HTMLElement;
  private prev: Preview | null = null;
  private msg: { text: string; kind: "ok" | "err" } | null = null;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "1"; this.className = "lab-host";
    this.append(h("div", { class: "lab lab-fw" }));
    this.out = this.firstElementChild as HTMLElement;
    this.render();
  }

  private setupNodes?: Node[];
  private type: StrategyType = "breakout";

  /** Steps 1 to 4: everything the reader needs to make the two files, with no folder or repository needed. */
  private setup(): Node[] {
    const symbols = textField("Shares to follow", "RELIANCE, TCS, INFY", { name: "symbols", hint: "Use the NSE symbols, separated by commas. Start with 3 to 10." });
    const capital = textField("Pretend money", "100000", { name: "capital", prefix: "Rs", hint: "Only used to size trades. No real money is used." });
    const start = textField("Start date", new Date().toISOString().slice(0, 10), { name: "start", hint: "Write it as year-month-day. Never change it later." });
    const look = textField("Look-back days", "20", { name: "lb", whole: true }), fast = textField("Quick average days", "20", { name: "fast", whole: true }), slow = textField("Slow average days", "50", { name: "slow", whole: true });
    const params = h("div", { class: "lab-grid" }), err = h("div", { class: "lab-err", role: "alert" });
    const show = () => params.replaceChildren(...(this.type === "breakout" ? [look.root] : this.type === "sma_cross" ? [fast.root, slow.root] : []));
    const seg = segmented<StrategyType>("Which rule?", "fwtype", [["breakout", "Breakout"], ["sma_cross", "Two averages"], ["buy_and_hold", "Buy and hold"]], this.type, (v) => { this.type = v; show(); });
    show();
    const make = () => {
      err.textContent = "";
      const list = symbols.input.value.split(/[ ,]+/).map((x) => x.trim().toUpperCase()).filter(Boolean);
      const cap = parseNum(capital.input.value);
      const st: Strategy = { version: 1, name: this.type === "breakout" ? "Breakout" : this.type === "sma_cross" ? "Two averages" : "Buy and hold", type: this.type, atrPeriod: 14, stopAtr: 2, trailAtr: 3, riskPct: 1, maxPositions: Math.min(5, Math.max(1, list.length)) };
      if (this.type === "breakout") st.lookback = parseNum(look.input.value); if (this.type === "sma_cross") { st.fast = parseNum(fast.input.value); st.slow = parseNum(slow.input.value); }
      const bad = validateStrategy(st);
      if (!list.length || list.some((x) => !/^[A-Z0-9&-]{1,20}$/.test(x))) return void (err.textContent = "Write the share symbols with letters and numbers only, like RELIANCE, TCS.");
      if (!(cap >= 10000)) return void (err.textContent = "Pretend money should be at least Rs 10,000.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start.input.value)) return void (err.textContent = "Write the start date as year-month-day, like 2026-11-12.");
      if (bad.length) return void (err.textContent = bad[0] ?? "");
      save("strategy.json", JSON.stringify(st, null, 2) + "\n");
      save("forward.config.json", JSON.stringify({ strategyFile: "strategy.json", symbols: list, capitalRupees: cap, startDate: start.input.value, dataSource: "csvDir", csvDir: "prices", outDir: "out", slippageBps: 5 }, null, 2) + "\n");
    };
    const dl = (name: string, label: string) => h("a", { class: "lab-btn", href: "downloads/" + name, download: name }, label);
    const li = (...k: (Node | string)[]) => h("li", {}, ...k);
    return [
      h("section", { class: "lab-card-box" }, h("h3", {}, "How it works, in five steps"),
        h("ol", { class: "lab-steps" },
          li(h("strong", {}, "Get the script. "), "It is one small file. You need Node.js, a free program, version 20 or newer. Get it from nodejs.org. To check, type ", h("code", {}, "node --version"), " in a terminal. Put the script in a new folder, for example ", h("code", {}, "forward-test"), "."),
          li(h("strong", {}, "Make your two settings files. "), "Fill in the form below. Save both files in the same folder."),
          li(h("strong", {}, "Add price files. "), "Make a folder called ", h("code", {}, "prices"), " inside it. Add one file per share, named like ", h("code", {}, "RELIANCE.csv"), ". Each file needs daily prices with the columns date, open, high, low, close and volume. Many data sites and charting tools let you save daily prices for a share as a CSV file. Check the site's own rules first. The script tells you if a file is not in the right shape. To try it first, download the sample files below."),
          li(h("strong", {}, "Run it after the market closes. "), "In the terminal, go to your folder and type ", h("code", {}, "node forward-test.mjs --config forward.config.json"), ". Wait until 3:45 pm India time. It writes a folder called ", h("code", {}, "out"), "."),
          li(h("strong", {}, "Bring the results here. "), "Choose the two files from the ", h("code", {}, "out"), " folder in the last box on this page.")),
        h("div", { class: "lab-actions" }, dl("forward-test.mjs", "Download the script"), dl("sample-prices/AAA.csv", "Sample prices: AAA"), dl("sample-prices/BBB.csv", "Sample prices: BBB"), dl("sample-prices/CCC.csv", "Sample prices: CCC")),
        h("p", { class: "lab-note" }, "The sample prices are made up. They only show the file shape. The script will say they are old, which is the safety check working. The script never places an order and never goes online.")),
      h("form", { class: "lab-form lab-card-box", onsubmit: (e: Event) => { e.preventDefault(); make(); } }, h("h3", {}, "Make your settings files"), symbols.root, seg.root, params, h("div", { class: "lab-grid" }, capital.root, start.root), err,
        h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, "Download my two files"),
        h("p", { class: "lab-note" }, "Your browser may ask to allow two downloads. Other settings use safe defaults: risk 1% of your pretend money per trade, a stop-loss 2 ATR below the buy price, and 5 shares held at most.")),
    ];
  }

  private render() {
    const logIn = h("input", { type: "file", accept: ".csv,text/csv", name: "forward-log", "aria-label": "Choose forward_log.csv" });
    const stIn = h("input", { type: "file", accept: ".json,application/json", name: "forward-state", "aria-label": "Choose forward_state.json (optional)" });
    const box = h("section", { class: "lab-card-box" }, h("h3", {}, "Bring in your forward-test files"),
      h("p", { class: "lab-note" }, "Run the forward-test script on your computer. It writes two files. Choose them here. Nothing is sent anywhere."),
      h("div", { class: "lab-field" }, h("label", {}, "The trade log (forward_log.csv)"), logIn),
      h("div", { class: "lab-field" }, h("label", {}, "The state file (forward_state.json), optional"), stIn, h("p", { class: "lab-hint" }, "It adds the comparison with earlier days.")),
      h("div", { class: "lab-actions" }, h("button", { type: "button", class: "lab-btn lab-btn-primary", onclick: () => void this.read(logIn, stIn) }, "Read the files")));
    const kids: Node[] = [h("div", { class: "lab-banner", role: "note" }, h("strong", {}, "Hypothetical trades. No orders were placed."), " Fills are assumed at the next morning's open. Real trading can do worse."), ...(this.setupNodes ??= this.setup()), box];
    if (this.msg) kids.push(h("div", { class: this.msg.kind === "ok" ? "lab-msg lab-msg-ok" : "lab-msg lab-err", role: this.msg.kind === "ok" ? "status" : "alert" }, this.msg.text));
    if (this.prev) kids.push(...this.preview(this.prev));
    this.out.replaceChildren(...kids);
  }

  private async read(logIn: HTMLInputElement, stIn: HTMLInputElement) {
    const lf = logIn.files?.[0]; this.msg = null;
    if (!lf) { this.msg = { text: "Choose the forward_log.csv file first.", kind: "err" }; this.render(); return; }
    try {
      const p = parseForwardLog(await lf.text(), new Date().toISOString());
      let state: State | null = null;
      const sf = stIn.files?.[0]; if (sf) { try { state = JSON.parse(await sf.text()) as State; } catch { this.msg = { text: "The state file could not be read, so the comparison is left out.", kind: "err" }; } }
      const store = new IndexedDbStore(), have = new Map((await store.all("journal")).map((r) => [r.id, r as unknown as Trade]));
      const fresh: Trade[] = [], changed: Trade[] = []; let n = 0;
      for (const t of p.trades) { const o = have.get(t.id); if (!o) fresh.push(t); else if (same(o, t)) n++; else changed.push(t); }
      this.prev = { trades: p.trades, fresh, changed, same: n, skipped: p.skipped, state };
    } catch (e) { this.prev = null; this.msg = { text: (e as Error).message, kind: "err" }; }
    this.render();
  }

  private preview(p: Preview): Node[] {
    const out: Node[] = [];
    const todo = p.fresh.length + p.changed.length;
    const b = h("section", { class: "lab-card-box" }, h("h3", {}, "What is in the file"),
      h("p", {}, `Found ${p.trades.length} ${p.trades.length === 1 ? "trade" : "trades"}: ${p.fresh.length} new, ${p.changed.length} changed since last time, ${p.same} already in your journal.`));
    if (p.skipped.length) b.append(h("div", { class: "lab-conflicts", role: "note" }, h("strong", {}, `${p.skipped.length} ${p.skipped.length === 1 ? "row was" : "rows were"} not read`), h("ul", {}, ...p.skipped.slice(0, 10).map((k) => h("li", {}, `Row ${k.row}: ${k.reason}`)))));
    b.append(h("div", { class: "lab-actions" }, todo ? h("button", { type: "button", class: "lab-btn lab-btn-primary", onclick: () => void this.save() }, `Add ${todo} to my Forward journal`) : h("p", { class: "lab-note" }, "Nothing new to add."), h("button", { type: "button", class: "lab-btn", onclick: () => { this.prev = null; this.render(); } }, "Clear")));
    out.push(b);

    const closed = p.trades.filter((t) => t.exits.length).map((t) => resultOf(t, R)).filter((r) => r.status === "closed");
    const s = computeStats(closed);
    const rows = h("section", { class: "lab-card-box" }, h("h3", {}, "How the rule is doing on new days"));
    rows.append(h("div", { class: "lab-cards lab-cards-4" }, card("Closed trades", String(s.count), s.lowSample ? `Fewer than ${MIN_TRADES_FOR_TRUST}: too few to trust` : ""), card("Win rate", s.count ? (s.winRate * 100).toFixed(0) + "%" : "-"), card("Average R", s.rCount ? s.expectancyR.toFixed(2) : "-", "Profit in units of the risk"), card("Money made", fmtRs(s.netPaise), "After costs")));
    const bf = p.state?.before;
    if (bf) {
      const cell = (v: string) => h("td", {}, v);
      rows.append(h("h4", {}, "Compared with the same rule on earlier days"),
        h("div", { class: "lab-table-wrap" }, h("table", { class: "lab-table" }, h("thead", {}, h("tr", {}, ...["", "Earlier days", "New days"].map((x) => h("th", {}, x)))), h("tbody", {},
          h("tr", {}, h("td", {}, "Days"), cell(bf.period), cell(`${p.state?.startDate ?? "start"} on`)),
          h("tr", {}, h("td", {}, "Closed trades"), cell(String(bf.trades)), cell(String(s.count))),
          h("tr", {}, h("td", {}, "Win rate"), cell(bf.winRatePct === null ? "-" : bf.winRatePct.toFixed(0) + "%"), cell(s.count ? (s.winRate * 100).toFixed(0) + "%" : "-")),
          h("tr", {}, h("td", {}, "Average R"), cell(bf.expectancyR === null ? "-" : bf.expectancyR.toFixed(2)), cell(s.rCount ? s.expectancyR.toFixed(2) : "-")),
          h("tr", {}, h("td", {}, "Money made"), cell(fmtRs(bf.netPaise)), cell(fmtRs(s.netPaise)))))),
        h("p", { class: "lab-note" }, "If the new days look much worse than the earlier days, the earlier result may have been luck or over-fitting. A short test proves little. Thirty trades is a floor, not a verdict."));
    }
    out.push(rows);
    return out;
  }

  private async save() {
    if (!this.prev) return;
    const todo = [...this.prev.fresh, ...this.prev.changed];
    try {
      const store = new IndexedDbStore(), now = new Date().toISOString();
      for (const t of todo) await store.put("journal", { ...t, updated_at: now });
      this.msg = { text: `Added ${todo.length} ${todo.length === 1 ? "trade" : "trades"}. Open the journal and choose Forward at the top to see them.`, kind: "ok" };
      this.prev = null;
    } catch { this.msg = { text: "Could not save to the journal in this browser.", kind: "err" }; }
    this.render();
  }
}

function save(name: string, text: string) { const a = h("a", { href: URL.createObjectURL(new Blob([text], { type: "application/json" })), download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
