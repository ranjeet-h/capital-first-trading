// Lab 5: bring the forward-test script's files into the journal and see how the rule is doing on days it was not tuned on.
import rawRates from "../../../data/rates/zerodha-equity.json";
import type { Rates } from "../../core/src/costs";
import { parseForwardLog, type BtSummary } from "../../core/src/forward";
import { resultOf, type Trade } from "../../core/src/journal";
import { computeStats, MIN_TRADES_FOR_TRUST } from "../../core/src/stats";
import { IndexedDbStore } from "../../core/src/store";
import { h, fmtRs } from "./util";

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

  private render() {
    const logIn = h("input", { type: "file", accept: ".csv,text/csv", name: "forward-log", "aria-label": "Choose forward_log.csv" });
    const stIn = h("input", { type: "file", accept: ".json,application/json", name: "forward-state", "aria-label": "Choose forward_state.json (optional)" });
    const box = h("section", { class: "lab-card-box" }, h("h3", {}, "Bring in your forward-test files"),
      h("p", { class: "lab-note" }, "Run the forward-test script on your computer. It writes two files. Choose them here. Nothing is sent anywhere."),
      h("div", { class: "lab-field" }, h("label", {}, "The trade log (forward_log.csv)"), logIn),
      h("div", { class: "lab-field" }, h("label", {}, "The state file (forward_state.json), optional"), stIn, h("p", { class: "lab-hint" }, "It adds the comparison with earlier days.")),
      h("div", { class: "lab-actions" }, h("button", { type: "button", class: "lab-btn lab-btn-primary", onclick: () => void this.read(logIn, stIn) }, "Read the files")));
    const kids: Node[] = [h("div", { class: "lab-banner", role: "note" }, h("strong", {}, "Hypothetical trades. No orders were placed."), " Fills are assumed at the next morning's open. Real trading can do worse."), box];
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
