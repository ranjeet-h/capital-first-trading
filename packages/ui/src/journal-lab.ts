import rawRates from "../../../data/rates/zerodha-equity.json";
import type { Rates, Exchange, Product } from "../../core/src/costs";
import { IndexedDbStore, type Store, type StoredRecord } from "../../core/src/store";
import { MODES, newTrade, newNote, recordEntry, addExit, amendPlan, statusOf, resultOf, tombstone, validatePlan, weekOf, weekResults, newReview, reviewId, REVIEW_RULES, type Mode, type Trade, type Note, type Review, type Result } from "../../core/src/journal";
import { computeStats, lossLimitBreaches, MIN_TRADES_FOR_TRUST, type Stats } from "../../core/src/stats";
import { tradesToCsv } from "../../core/src/export";
import { exportBackup, encryptBackup, decryptBackup, parseBackup, previewImport, importBackup, BackupError, type BackupFile } from "../../core/src/backup";
import { h, svg, fmtRs, fmtInt, parseRupees, parseNum, draft, type JournalDraft } from "./util";
import { textField, segmented, checkbox } from "./field";

const R = rawRates as unknown as Rates;
const MODE_LABEL: Record<Mode, string> = { paper: "Paper", live: "Live", forward: "Forward", backtest: "Backtest", kite_demo: "Demo" };
const MODE_NAME: Record<Mode, string> = { paper: "paper", live: "live", forward: "forward-test", backtest: "backtest", kite_demo: "Kite demo" };
const EMOTIONS = ["Calm", "Confident", "Anxious", "Greedy", "Fearful", "Bored", "Angry", "Rushed"];
const SETUPS = ["Breakout", "Pullback", "Support bounce", "Trend follow", "Gap", "Other"];
const SETTINGS_ID = "settings";
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
const nowIso = () => new Date().toISOString();
const localInput = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const fromLocal = (v: string) => new Date(v).toISOString();
const dateText = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
const DAY = 86_400_000;

interface Settings extends StoredRecord { mode: Mode; dailyLossPaise?: number }
type Tab = "trades" | "dashboard" | "review" | "backup";

export class LabJournal extends HTMLElement {
  private store!: Store;
  private tab: Tab = "trades";
  private settings: Settings = { id: SETTINGS_ID, updated_at: nowIso(), mode: "paper" };
  private trades: Trade[] = [];
  private notes: Note[] = [];
  private reviews: Review[] = [];
  private weekShift = 0; // weeks back from this week
  private reviewMsg = "";
  private draft: JournalDraft | null = null;
  private body!: HTMLElement;
  private tabs!: HTMLElement;
  private banner!: HTMLElement;
  private modeBox!: HTMLElement;
  private planOpen = false;
  private backupMsg: { text: string; kind: "ok" | "err" } | null = null;
  private pending: { file: BackupFile; preview: { added: number; updated: number; kept: number } } | null = null;
  private lastBackup: number | undefined;
  private openPanel = new Map<string, string>(); // trade id -> which panel is open

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "1";
    this.className = "lab-host";
    const root = h("div", { class: "lab lab-journal" });
    this.append(root);
    try { this.store = new IndexedDbStore(); } catch { root.append(h("p", { class: "lab-err" }, "This browser cannot save data on your device, so the journal is unavailable. Try another browser.")); return; }
    this.banner = h("div", { class: "lab-banner", hidden: true });
    this.modeBox = h("div", {});
    this.tabs = h("div", { class: "lab-tabs", role: "tablist", "aria-label": "Journal sections" });
    this.body = h("div", { class: "lab-jbody", role: "tabpanel" });
    root.append(this.banner, this.modeBox, this.tabs, this.body);
    this.draft = draft.get(); draft.clear(); if (this.draft) { this.planOpen = true; }
    this.load().then(() => this.render()).catch(() => { this.body.replaceChildren(h("p", { class: "lab-err" }, "Could not open your saved journal. Try reloading the page.")); });
  }

  private async load() {
    const rows = (await this.store.all("journal")).filter((r) => !r.deleted) as unknown as (Trade | Note | Review)[];
    this.trades = rows.filter((r): r is Trade => r.entry_type === "trade").sort((a, b) => (a.planned_at < b.planned_at ? 1 : -1));
    this.notes = rows.filter((r): r is Note => r.entry_type === "note").sort((a, b) => (a.at < b.at ? 1 : -1));
    this.reviews = rows.filter((r): r is Review => r.entry_type === "review");
    const s = await this.store.get("settings", SETTINGS_ID);
    if (s) this.settings = s as Settings;
    this.lastBackup = (await this.store.getMeta("lastBackupAt")) as number | undefined;
  }
  private async save(rec: StoredRecord, coll = "journal") { await this.store.put(coll, rec); await this.load(); this.render(); }
  private async saveSettings(patch: Partial<Settings>) { this.settings = { ...this.settings, ...patch, updated_at: nowIso() }; await this.store.put("settings", this.settings); }

  // ---------- shell ----------
  private render() {
    this.modeBox.replaceChildren(segmented<Mode>("Which trades are you looking at?", "jmode", MODES.map((m) => [m, MODE_LABEL[m]]), this.settings.mode, (m) => { void this.saveSettings({ mode: m }).then(() => this.render()); }).root,
      h("p", { class: "lab-hint lab-modehint" }, "Each kind is kept apart. Paper, live and test results are never added together."));
    this.tabs.replaceChildren(...(["trades", "dashboard", "review", "backup"] as Tab[]).map((t) =>
      h("button", { type: "button", role: "tab", class: "lab-tab", "aria-selected": String(t === this.tab), onclick: () => { this.tab = t; this.render(); } }, { trades: "Trades", dashboard: "Dashboard", review: "Weekly review", backup: "Backup" }[t])));
    this.renderBanner();
    this.body.replaceChildren(...(this.tab === "trades" ? this.tradesView() : this.tab === "dashboard" ? this.dashboardView() : this.tab === "review" ? this.reviewView() : this.backupView()));
  }

  private renderBanner() {
    const n = this.trades.length + this.notes.length + this.reviews.length;
    const age = this.lastBackup === undefined ? undefined : Date.now() - this.lastBackup;
    const due = n >= 3 && (age === undefined || age > 7 * DAY);
    this.banner.hidden = !due;
    this.banner.className = "lab-banner lab-banner-warn";
    this.banner.replaceChildren(age === undefined ? "You have not made a backup yet. If this browser's data is cleared, your journal is gone. " : "Your last backup is over a week old. ",
      h("button", { type: "button", class: "lab-link", onclick: () => { this.tab = "backup"; this.render(); } }, "Back up now"));
  }

  // ---------- trades ----------
  private inMode() { return this.trades.filter((t) => t.mode === this.settings.mode); }

  private tradesView(): HTMLElement[] {
    const list = this.inMode();
    const out: HTMLElement[] = [h("button", { type: "button", class: "lab-btn lab-btn-primary", "aria-expanded": String(this.planOpen), onclick: () => { this.planOpen = !this.planOpen; if (!this.planOpen) this.dropDraft(); this.render(); } }, this.planOpen ? "Close the plan form" : "Plan a new trade")];
    if (this.planOpen) out.push(this.planForm());
    if (!list.length && !this.planOpen) out.push(h("p", { class: "lab-empty" }, `No ${MODE_NAME[this.settings.mode]} trades yet. Start with a plan: write down your entry, your stop-loss and your reason before you buy.`));
    for (const t of list) out.push(this.tradeCard(t));
    out.push(this.notesBox());
    return out;
  }

  private dropDraft() { this.draft = null; draft.clear(); }

  private planForm(): HTMLElement {
    const dr = this.draft;
    const f = {
      symbol: textField("Stock symbol", "", { name: "symbol", hint: "For example RELIANCE" }),
      entry: textField("Planned entry price", dr?.entry ?? "", { name: "p_entry", prefix: "Rs", hint: "Where you plan to buy" }),
      stop: textField("Stop-loss price", dr?.stop ?? "", { name: "p_stop", prefix: "Rs", hint: "Where you will get out if wrong" }),
      target: textField("Target price", dr?.target ?? "", { name: "p_target", prefix: "Rs", hint: "Optional", optional: true }),
      qty: textField("Quantity", dr?.qty ?? "", { name: "p_qty", suffix: "shares", hint: "Whole shares", whole: true }),
    };
    f.symbol.input.inputMode = "text"; f.symbol.input.autocapitalize = "characters";
    const exch = segmented<Exchange>("Exchange", "p_exch", [["NSE", "NSE"], ["BSE", "BSE"]], dr?.exchange === "BSE" ? "BSE" : "NSE", () => {});
    const prod = segmented<Product>("Product", "p_prod", [["cnc", "Delivery (CNC)"], ["mis", "Intraday (MIS)"]], dr?.product === "mis" ? "mis" : "cnc", () => {});
    const setupId = "setup-list";
    const setup = h("input", { type: "text", name: "setup", list: setupId, autocomplete: "off", placeholder: "Pick or type" });
    const thesis = h("textarea", { name: "thesis", rows: 3, placeholder: "Why this trade? What would prove you wrong?" });
    const check = checkbox("I checked my rules before planning this trade", false, () => {});
    const risk = h("p", { class: "lab-planrisk", "aria-live": "polite" });
    const err = h("div", { class: "lab-err", role: "alert" });
    const upd = () => {
      const e = parseRupees(f.entry.input.value), s = parseRupees(f.stop.input.value), q = parseNum(f.qty.input.value);
      risk.textContent = e > 0 && s > 0 && q > 0 && e > s ? `If the stop is hit you lose about ${fmtRs((e - s) * q)} before costs.` : "";
    };
    [f.entry, f.stop, f.qty].forEach((x) => x.input.addEventListener("input", upd));
    const submit = () => {
      err.textContent = "";
      const e = parseRupees(f.entry.input.value), s = parseRupees(f.stop.input.value), q = parseNum(f.qty.input.value);
      const tv = f.target.input.value.trim();
      const t = tv === "" ? undefined : parseRupees(tv);
      const plan = { entryPaise: e, stopPaise: s, targetPaise: t, qty: q, setup: setup.value.trim(), thesis: thesis.value.trim(), checklistOk: check.input.checked };
      const bad = validatePlan(plan as never);
      if (!f.symbol.input.value.trim()) bad.unshift("Enter the stock symbol.");
      if (bad.length) { err.textContent = bad[0]!; return; }
      try {
        const tr = newTrade(uid(), nowIso(), { mode: this.settings.mode, symbol: f.symbol.input.value, exchange: exch.get(), product: prod.get(), plan });
        this.planOpen = false; this.dropDraft(); void this.save(tr);
      } catch (x) { err.textContent = (x as Error).message; }
    };
    upd();
    return h("form", { class: "lab-form lab-card-box", onsubmit: (ev: Event) => { ev.preventDefault(); submit(); } },
      h("h3", {}, "Plan"),
      dr ? h("div", { class: "lab-banner", role: "status" }, dr.from === "size" ? "Filled in from the position size calculator. " : "Filled in from the cost calculator. ", dr.from === "costs" ? "Add your stop-loss below. " : "", "Check every number before you save.") : null,
      h("div", { class: "lab-grid" }, f.symbol.root, exch.root, prod.root, f.entry.root, f.stop.root, f.target.root, f.qty.root,
        h("div", { class: "lab-field" }, h("label", { for: "jn-setup" }, "Setup"), (setup.id = "jn-setup", setup), h("datalist", { id: setupId }, ...SETUPS.map((s) => h("option", { value: s })))),
        h("div", { class: "lab-field lab-wide" }, h("label", { for: "jn-thesis" }, "Your reason"), (thesis.id = "jn-thesis", thesis))),
      check.root, risk, err,
      h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, "Save plan"));
  }

  private tradeCard(t: Trade): HTMLElement {
    const r = resultOf(t, R), st = statusOf(t);
    const kv = (k: string, v: string, tone = "") => h("div", { class: "lab-kv" }, h("span", { class: "lab-k" }, k), h("span", { class: "lab-v" + tone }, v));
    const tone = (n: number) => (n > 0 ? " lab-pos" : n < 0 ? " lab-neg" : "");
    const facts: HTMLElement[] = [kv("Planned entry", fmtRs(t.plan.entryPaise)), kv("Stop-loss", fmtRs(t.plan.stopPaise)), kv("Target", t.plan.targetPaise ? fmtRs(t.plan.targetPaise) : "none"), kv("Quantity", fmtInt(t.plan.qty)), kv("Planned loss", fmtRs(r.plannedRiskPaise))];
    if (t.opened_at) facts.push(kv("Bought", `${fmtInt(t.entry_qty!)} at ${fmtRs(t.entry_price_paise!)}`));
    if (t.exits.length) facts.push(kv("Profit after costs", fmtRs(r.netPaise), tone(r.netPaise)), kv("In R", (r.r >= 0 ? "+" : "") + r.r.toFixed(2) + " R", tone(r.netPaise)));
    const open = this.openPanel.get(t.id);
    const toggle = (name: string, label: string, primary = false) => h("button", { type: "button", class: "lab-btn" + (primary ? " lab-btn-primary" : ""), "aria-expanded": String(open === name), onclick: () => { open === name ? this.openPanel.delete(t.id) : this.openPanel.set(t.id, name); this.render(); } }, label);
    const actions: HTMLElement[] = [];
    if (st === "planned") actions.push(toggle("buy", "I bought", true));
    if (st === "open") actions.push(toggle("sell", "I sold", true));
    if (st !== "closed") actions.push(toggle("edit", "Change plan"));
    if (st === "closed" || t.exits.length) actions.push(toggle("review", t.followed_plan === undefined ? "Review this trade" : "Edit review", st === "closed" && t.followed_plan === undefined));
    actions.push(this.deleteButton(t));
    const badges = [h("span", { class: `lab-badge lab-badge-${st}` }, { planned: "Planned", open: "Open", closed: "Closed" }[st])];
    if (t.amended_after_entry) badges.push(h("span", { class: "lab-badge lab-badge-warn", title: "The plan was changed after you bought" }, "Plan changed after buying"));
    if (t.followed_plan === false) badges.push(h("span", { class: "lab-badge lab-badge-warn" }, "Broke the plan"));
    const card = h("article", { class: "lab-trade", "data-id": t.id, "data-status": st },
      h("header", {}, h("h3", {}, `${t.symbol} `, h("small", {}, `${t.exchange} · ${t.product === "cnc" ? "Delivery" : "Intraday"}`)), h("div", { class: "lab-badges" }, ...badges)),
      h("div", { class: "lab-kvs" }, ...facts),
      t.plan.thesis ? h("p", { class: "lab-thesis" }, `"${t.plan.thesis}"`) : null,
      t.amendments.length ? h("ul", { class: "lab-amend" }, ...t.amendments.map((a) => h("li", {}, `${dateText(a.at)}: ${fieldName(a.field)} changed from ${fmtVal(a.field, a.from)} to ${fmtVal(a.field, a.to)}`))) : null,
      h("div", { class: "lab-actions" }, ...actions));
    if (open) card.append(this.panel(t, open));
    return card;
  }

  private deleteButton(t: Trade): HTMLElement {
    const b = h("button", { type: "button", class: "lab-btn lab-btn-quiet", onclick: () => {
      if (b.dataset.sure) void this.save(tombstone(t, nowIso()));
      else { b.dataset.sure = "1"; b.textContent = "Tap again to delete"; b.classList.add("lab-btn-danger"); setTimeout(() => { delete b.dataset.sure; b.textContent = "Delete"; b.classList.remove("lab-btn-danger"); }, 4000); }
    } }, "Delete");
    return b;
  }

  private panel(t: Trade, kind: string): HTMLElement {
    const err = h("div", { class: "lab-err", role: "alert" });
    const done = () => { this.openPanel.delete(t.id); };
    const form = (title: string, fields: HTMLElement[], label: string, onSubmit: () => Trade | void, extra: (HTMLElement | null)[] = []) =>
      h("form", { class: "lab-form lab-panel", onsubmit: (ev: Event) => { ev.preventDefault(); err.textContent = ""; try { const r = onSubmit(); if (r) { done(); void this.save(r); } } catch (x) { err.textContent = (x as Error).message; } } },
        h("h4", {}, title), h("div", { class: "lab-grid" }, ...fields), ...extra, err, h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, label));
    const when = (label = "When") => { const i = h("input", { type: "datetime-local", name: "when", value: localInput() }); return { i, root: h("div", { class: "lab-field" }, h("label", { for: "jn-when-" + t.id + kind }, label), (i.id = "jn-when-" + t.id + kind, i)) }; };

    if (kind === "buy") {
      const p = textField("Price you paid", "", { name: "b_price", prefix: "Rs", hint: "Per share" }), q = textField("Shares bought", String(t.plan.qty), { name: "b_qty", whole: true, suffix: "shares" }), w = when("When you bought");
      return form("Record your buy", [p.root, q.root, w.root], "Save buy", () => {
        const pr = parseRupees(p.input.value), qty = parseNum(q.input.value);
        return recordEntry(t, nowIso(), { at: fromLocal(w.i.value), pricePaise: pr, qty });
      });
    }
    if (kind === "sell") {
      const left = (t.entry_qty ?? 0) - t.exits.reduce((s, e) => s + e.qty, 0);
      const p = textField("Price you sold at", "", { name: "s_price", prefix: "Rs", hint: "Per share" }), q = textField("Shares sold", String(left), { name: "s_qty", whole: true, suffix: "shares", hint: `${left} left to sell` }), w = when("When you sold");
      return form("Record your sell", [p.root, q.root, w.root], "Save sell", () => addExit(t, nowIso(), { at: fromLocal(w.i.value), qty: parseNum(q.input.value), pricePaise: parseRupees(p.input.value) }));
    }
    if (kind === "edit") {
      const s = textField("New stop-loss", (t.plan.stopPaise / 100).toString(), { name: "e_stop", prefix: "Rs" }), g = textField("New target", t.plan.targetPaise ? (t.plan.targetPaise / 100).toString() : "", { name: "e_target", prefix: "Rs", optional: true });
      const warn = t.opened_at ? h("p", { class: "lab-note" }, "You already bought. A change is saved in the trade's history and marked so you can see it later.") : null;
      return form("Change the plan", [s.root, g.root], "Save change", () => {
        const tv = g.input.value.trim();
        return amendPlan(t, nowIso(), { stopPaise: parseRupees(s.input.value), targetPaise: tv === "" ? undefined : parseRupees(tv) });
      }, [warn]);
    }
    // review
    const followed = segmented<"yes" | "no">("Did you follow your plan?", "r_follow", [["yes", "Yes"], ["no", "No"]], t.followed_plan === false ? "no" : "yes", () => {});
    const emo = new Set(t.emotions);
    const chips = h("div", { class: "lab-chips", role: "group", "aria-label": "How did you feel?" }, ...EMOTIONS.map((e) => { const b = h("button", { type: "button", class: "lab-chip", "aria-pressed": String(emo.has(e)), onclick: () => { emo.has(e) ? emo.delete(e) : emo.add(e); b.setAttribute("aria-pressed", String(emo.has(e))); } }, e); return b; }));
    const notes = h("textarea", { name: "notes", rows: 3, placeholder: "What happened? What would you do differently?", value: t.notes });
    const costs = textField("Real costs from your contract note", t.costs_paise !== undefined ? (t.costs_paise / 100).toString() : "", { name: "r_costs", prefix: "Rs", hint: "Optional. Leave blank to use the estimate.", optional: true });
    return form("Review", [h("div", { class: "lab-field lab-wide" }, h("span", { class: "lab-label" }, "How did you feel?"), chips), followed.root, costs.root, h("div", { class: "lab-field lab-wide" }, h("label", { for: "jn-notes-" + t.id }, "Notes"), (notes.id = "jn-notes-" + t.id, notes))], "Save review", () => {
      const cv = costs.input.value.trim();
      const c = cv === "" ? undefined : parseRupees(cv);
      if (c !== undefined && Number.isNaN(c)) throw new Error("Enter the costs as a number, or leave it blank.");
      return { ...t, updated_at: nowIso(), followed_plan: followed.get() === "yes", emotions: [...emo], notes: notes.value.trim(), costs_paise: c };
    });
  }

  private notesBox(): HTMLElement {
    const ta = h("textarea", { rows: 2, name: "note", placeholder: "A thought, a lesson, how the week went…", "aria-label": "New note" });
    const err = h("div", { class: "lab-err", role: "alert" });
    return h("section", { class: "lab-notes" }, h("h3", {}, "Notes"),
      h("form", { class: "lab-form", onsubmit: (ev: Event) => { ev.preventDefault(); try { const n = newNote(uid(), nowIso(), ta.value); void this.save(n); } catch (x) { err.textContent = (x as Error).message; } } }, ta, err, h("button", { type: "submit", class: "lab-btn" }, "Add note")),
      ...this.notes.map((n) => h("div", { class: "lab-note-item" }, h("time", {}, dateText(n.at)), h("p", {}, n.text), h("button", { type: "button", class: "lab-btn lab-btn-quiet", onclick: () => void this.save(tombstone(n, nowIso())) }, "Delete note"))));
  }

  // ---------- dashboard ----------
  private results(): Result[] { return this.inMode().map((t) => resultOf(t, R)); }

  private dashboardView(): HTMLElement[] {
    const results = this.results(), s = computeStats(results);
    if (s.count === 0) return [h("p", { class: "lab-empty" }, `Nothing to show yet. The dashboard fills in as you close ${MODE_NAME[this.settings.mode]} trades.`)];
    const out: HTMLElement[] = [];
    if (s.lowSample) out.push(h("div", { class: "lab-conflicts", role: "note" }, h("strong", {}, "Too few trades to trust these numbers"), h("p", {}, `You have ${s.count} closed ${s.count === 1 ? "trade" : "trades"}. Below ${MIN_TRADES_FOR_TRUST}, luck can look like skill. Treat the figures below as a first look, not proof.`)));
    const card = (k: string, v: string, sub = "") => h("div", { class: "lab-card" }, h("div", { class: "lab-card-k" }, k), h("div", { class: "lab-card-v" }, v), h("div", { class: "lab-card-s" }, sub));
    out.push(h("div", { class: "lab-cards lab-cards-4" },
      card("Closed trades", fmtInt(s.count), `${s.wins} won, ${s.losses} lost`),
      card("Win rate", (s.winRate * 100).toFixed(0) + "%", "Winning is not the same as making money"),
      card("Profit after costs", fmtRs(s.netPaise), `Costs paid: ${fmtRs(s.costsPaise)}`),
      card("Average trade", fmtRs(Math.round(s.expectancyPaise)), `${s.expectancyR >= 0 ? "+" : ""}${s.expectancyR.toFixed(2)} R per trade`),
      card("Average win vs loss", s.payoff === null ? "n/a" : s.payoff.toFixed(2), `Win ${fmtRs(Math.round(s.avgWinPaise))} · Loss ${fmtRs(Math.round(s.avgLossPaise))}`),
      card("Profit factor", s.profitFactor === null ? "n/a" : s.profitFactor.toFixed(2), "Total won divided by total lost"),
      card("Biggest drop", fmtRs(s.maxDrawdownPaise), "From a high point to a low point"),
      card("Plan followed", s.planAdherence === null ? "n/a" : (s.planAdherence * 100).toFixed(0) + "%", s.amendedCount ? `${s.amendedCount} had the plan changed after buying` : "Review closed trades to fill this")));
    out.push(h("p", { class: "lab-note" }, `Longest run of wins: ${s.maxWinStreak}. Longest run of losses: ${s.maxLossStreak}. ${s.costShareOfGrossProfit !== null ? `Costs took ${(s.costShareOfGrossProfit * 100).toFixed(1)}% of your gross winnings.` : ""}`));
    out.push(h("div", { class: "lab-charts" }, lineChart("Money over time (after costs)", s.equity), lineChart("Drop from the highest point", s.drawdown.map((x) => -x), true), histogram(s)));
    const lim = this.settings.dailyLossPaise;
    if (lim) { const b = lossLimitBreaches(results, lim); out.push(h("section", { class: "lab-limit" }, h("h3", {}, "Daily loss limit"), b.length ? h("ul", {}, ...b.map((x) => h("li", {}, `${x.day}: lost ${fmtRs(x.lossPaise)}, over your limit of ${fmtRs(lim)}`))) : h("p", {}, `You stayed within your limit of ${fmtRs(lim)} a day.`))); }
    return out;
  }

  // ---------- weekly review ----------
  private reviewView(): HTMLElement[] {
    const mode = this.settings.mode;
    const base = new Date(); base.setDate(base.getDate() - 7 * this.weekShift);
    const wk = weekOf(base), id = reviewId(mode, wk.start);
    const saved = this.reviews.find((r) => r.id === id);
    const range = (a: string, b: string) => { const f = (x: string) => new Date(x + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }); return `${f(a)} to ${f(b)}`; };
    const out: HTMLElement[] = [];
    out.push(h("div", { class: "lab-weeknav" },
      h("button", { type: "button", class: "lab-btn", onclick: () => { this.weekShift++; this.reviewMsg = ""; this.render(); } }, "Earlier week"),
      h("div", { class: "lab-weeklabel", "aria-live": "polite" }, h("strong", {}, this.weekShift === 0 ? "This week" : this.weekShift === 1 ? "Last week" : `${this.weekShift} weeks ago`), h("span", {}, range(wk.start, wk.end))),
      h("button", { type: "button", class: "lab-btn", disabled: this.weekShift === 0, onclick: () => { this.weekShift--; this.reviewMsg = ""; this.render(); } }, "Later week")));

    const week = weekResults(this.results(), wk.start, wk.end), s = computeStats(week);
    const card = (k: string, v: string, sub = "") => h("div", { class: "lab-card" }, h("div", { class: "lab-card-k" }, k), h("div", { class: "lab-card-v" }, v), h("div", { class: "lab-card-s" }, sub));
    if (s.count === 0) out.push(h("p", { class: "lab-empty" }, `No ${MODE_NAME[mode]} trades were closed this week. You can still write a review below.`));
    else {
      const worst = week.reduce((a, b) => (b.netPaise < a.netPaise ? b : a));
      out.push(h("div", { class: "lab-cards lab-cards-4" },
        card("Trades closed", fmtInt(s.count), `${s.wins} won, ${s.losses} lost`),
        card("Profit after costs", fmtRs(s.netPaise), `Costs paid: ${fmtRs(s.costsPaise)}`),
        card("Plan followed", s.planAdherence === null ? "n/a" : (s.planAdherence * 100).toFixed(0) + "%", s.planAdherence === null ? "Review your closed trades first" : "Of trades you reviewed"),
        card("Biggest loss", worst.netPaise < 0 ? fmtRs(worst.netPaise) : "none", worst.netPaise < 0 ? "One trade, after costs" : "No losing trade this week")));
    }

    const rules = new Set(saved?.rules_broken ?? []);
    const checks = REVIEW_RULES.map((r) => { const c = checkbox(r, rules.has(r), (v) => (v ? rules.add(r) : rules.delete(r))); return c.root; });
    const area = (label: string, name: string, val: string, ph: string) => { const id2 = `rv-${name}`; return h("div", { class: "lab-field" }, h("label", { for: id2 }, label), h("textarea", { id: id2, name, rows: 3, placeholder: ph }, val)); };
    const ww = area("What went well?", "went_well", saved?.went_well ?? "", "Something you did right, even if you lost money");
    const tc = area("What do you want to change?", "to_change", saved?.to_change ?? "", "One habit that cost you this week");
    const rn = area("One rule for next week", "rule_next", saved?.rule_next ?? "", "A single rule you can keep. For example: no trades after 2 pm");
    const err = h("div", { class: "lab-err", role: "alert" });
    const val = (el: HTMLElement) => (el.querySelector("textarea") as HTMLTextAreaElement).value;
    out.push(h("form", { class: "lab-form lab-card-box lab-stack", onsubmit: (ev: Event) => {
      ev.preventDefault();
      try { const r = newReview(nowIso(), { mode, week_start: wk.start, week_end: wk.end, rules_broken: [...rules], went_well: val(ww), to_change: val(tc), rule_next: val(rn) }); this.reviewMsg = "Review saved."; void this.save(r); }
      catch (x) { err.textContent = (x as Error).message; }
    } },
      h("h3", {}, "Your review"),
      h("fieldset", { class: "lab-fieldset" }, h("legend", {}, "Did you break any of these rules?"), ...checks),
      ww, tc, rn, err,
      h("button", { type: "submit", class: "lab-btn lab-btn-primary" }, saved ? "Update review" : "Save review"),
      h("div", { class: "lab-msg lab-msg-ok", role: "status", hidden: !this.reviewMsg }, this.reviewMsg)));

    const past = this.reviews.filter((r) => r.mode === mode && r.id !== id).sort((a, b) => (a.week_start < b.week_start ? 1 : -1));
    if (past.length) out.push(h("section", { class: "lab-notes" }, h("h3", {}, "Earlier reviews"), ...past.map((r) => h("div", { class: "lab-note-item" },
      h("time", {}, range(r.week_start, r.week_end)),
      r.rules_broken.length ? h("p", {}, h("strong", {}, "Rules broken: "), r.rules_broken.join(", ")) : null,
      r.went_well ? h("p", {}, h("strong", {}, "Went well: "), r.went_well) : null,
      r.to_change ? h("p", {}, h("strong", {}, "To change: "), r.to_change) : null,
      r.rule_next ? h("p", {}, h("strong", {}, "Rule: "), r.rule_next) : null,
      h("button", { type: "button", class: "lab-btn lab-btn-quiet", onclick: () => void this.save(tombstone(r, nowIso())) }, "Delete review")))));
    return out;
  }

  // ---------- backup ----------
  private backupView(): HTMLElement[] {
    const out: HTMLElement[] = [];
    const msg = h("div", { class: this.backupMsg ? `lab-msg lab-msg-${this.backupMsg.kind}` : "", role: "status" }, this.backupMsg?.text ?? "");
    const lim = textField("Daily loss limit", this.settings.dailyLossPaise ? (this.settings.dailyLossPaise / 100).toString() : "", { name: "limit", prefix: "Rs", hint: "Optional. The dashboard lists days you went past it.", optional: true });
    const limErr = h("div", { class: "lab-err", role: "alert" });
    out.push(h("form", { class: "lab-form lab-card-box", onsubmit: (ev: Event) => { ev.preventDefault(); const v = lim.input.value.trim(); const p = v === "" ? undefined : parseRupees(v); if (p !== undefined && !(p > 0)) { limErr.textContent = "Enter an amount above zero, or leave it blank."; return; } limErr.textContent = ""; void this.saveSettings({ dailyLossPaise: p }).then(() => { this.backupMsg = { text: "Saved.", kind: "ok" }; this.render(); }); } },
      h("h3", {}, "Your limit"), h("div", { class: "lab-grid" }, lim.root), limErr, h("button", { type: "submit", class: "lab-btn" }, "Save limit")));

    const pass = h("input", { type: "password", name: "pass", autocomplete: "new-password", "aria-label": "Passphrase (optional)", placeholder: "Passphrase (optional)" });
    const share = typeof navigator.share === "function";
    out.push(h("section", { class: "lab-card-box" },
      h("h3", {}, "Back up"), h("p", { class: "lab-note" }, this.lastBackup ? `Last backup: ${dateText(new Date(this.lastBackup).toISOString())}.` : "You have not made a backup yet."),
      h("div", { class: "lab-field" }, h("label", {}, "Lock the file with a passphrase"), pass, h("div", { class: "lab-hint" }, "If you set one, you need it to open the file. There is no way to recover it.")),
      h("div", { class: "lab-actions" },
        h("button", { type: "button", class: "lab-btn lab-btn-primary", onclick: () => void this.doExport(pass.value, false) }, "Download backup"),
        share ? h("button", { type: "button", class: "lab-btn", onclick: () => void this.doExport(pass.value, true) }, "Share backup") : null,
        h("button", { type: "button", class: "lab-btn", onclick: () => this.doCsv() }, "Download for spreadsheet (CSV)"))));

    const file = h("input", { type: "file", accept: ".json,application/json", "aria-label": "Choose a backup file", onchange: () => void this.pickFile(file, ipass.value) });
    const ipass = h("input", { type: "password", name: "ipass", autocomplete: "off", "aria-label": "Passphrase for the file (if it has one)", placeholder: "Passphrase, if the file is locked" });
    const imp = h("section", { class: "lab-card-box" }, h("h3", {}, "Restore from a backup"), h("p", { class: "lab-note" }, "Importing adds what is missing and keeps the newer copy of anything that exists on both sides. It never deletes your data."),
      h("div", { class: "lab-field" }, ipass), h("div", { class: "lab-field" }, file));
    if (this.pending) {
      const p = this.pending.preview;
      imp.append(h("div", { class: "lab-msg lab-msg-ok" }, `This file would add ${p.added}, update ${p.updated}, and leave ${p.kept} as they are.`),
        h("div", { class: "lab-actions" }, h("button", { type: "button", class: "lab-btn lab-btn-primary", onclick: () => void this.confirmImport() }, "Import now"), h("button", { type: "button", class: "lab-btn", onclick: () => { this.pending = null; this.render(); } }, "Cancel")));
    }
    out.push(imp, msg);
    return out;
  }

  private async doExport(pass: string, share: boolean) {
    try {
      const file = await exportBackup(this.store);
      const locked = pass !== "" ? await encryptBackup(file, pass) : null;
      const text = JSON.stringify(locked ?? file, null, 2);
      const name = `capital-first-journal-${new Date().toISOString().slice(0, 10)}${locked ? "-locked" : ""}.json`;
      const blob = new Blob([text], { type: "application/json" });
      if (share) {
        const f = new File([blob], name, { type: "application/json" });
        if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: "Journal backup" }); else throw new Error("Sharing files is not supported here. Use Download instead.");
      } else download(blob, name);
      this.lastBackup = Date.now(); await this.store.setMeta("lastBackupAt", this.lastBackup);
      this.backupMsg = { text: locked ? "Locked backup saved. Keep your passphrase safe." : "Backup saved.", kind: "ok" };
    } catch (e) { if ((e as Error).name !== "AbortError") this.backupMsg = { text: (e as Error).message, kind: "err" }; }
    this.render();
  }
  private doCsv() { download(new Blob([tradesToCsv(this.trades, R)], { type: "text/csv" }), `capital-first-trades-${new Date().toISOString().slice(0, 10)}.csv`); this.backupMsg = { text: "Spreadsheet file saved.", kind: "ok" }; this.render(); }

  private async pickFile(input: HTMLInputElement, pass: string) {
    const f = input.files?.[0]; if (!f) return;
    try {
      const raw = JSON.parse(await f.text());
      let file: BackupFile;
      if (raw?.format === "cft-backup-encrypted") { if (!pass) throw new BackupError("This file is locked. Type its passphrase above, then choose the file again."); file = await decryptBackup(raw, pass); }
      else file = parseBackup(raw);
      this.pending = { file, preview: await previewImport(this.store, file) }; this.backupMsg = null;
    } catch (e) { this.pending = null; this.backupMsg = { text: e instanceof BackupError ? e.message : "This file could not be read as a backup.", kind: "err" }; }
    this.render();
  }
  private async confirmImport() {
    if (!this.pending) return;
    const r = await importBackup(this.store, this.pending.file); this.pending = null;
    await this.load(); this.backupMsg = { text: `Done. Added ${r.added}, updated ${r.updated}.`, kind: "ok" }; this.render();
  }
}

function download(blob: Blob, name: string) { const a = h("a", { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
const fieldName = (f: string) => ({ stopPaise: "Stop-loss", targetPaise: "Target", entryPaise: "Entry", qty: "Quantity", setup: "Setup", thesis: "Reason", checklistOk: "Rules check" } as Record<string, string>)[f] ?? f;
const fmtVal = (f: string, v: unknown) => (f.endsWith("Paise") ? (typeof v === "number" ? fmtRs(v) : "none") : String(v ?? "none"));

function lineChart(title: string, values: number[], loss = false): HTMLElement {
  const W = 600, H = 170, pad = 8;
  const lo = Math.min(0, ...values), hi = Math.max(0, ...values), span = hi - lo || 1;
  const x = (i: number) => pad + (values.length === 1 ? (W - 2 * pad) / 2 : (i * (W - 2 * pad)) / (values.length - 1));
  const y = (v: number) => pad + ((hi - v) / span) * (H - 2 * pad);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = values[values.length - 1]!;
  const el = svg("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${title}. Ends at ${fmtRs(last)}.`, class: "lab-chart" },
    svg("line", { x1: pad, x2: W - pad, y1: y(0), y2: y(0), class: "lab-axis" }),
    svg("polygon", { points: `${x(0).toFixed(1)},${y(0).toFixed(1)} ${pts} ${x(values.length - 1).toFixed(1)},${y(0).toFixed(1)}`, class: loss ? "lab-area-loss" : "lab-area" }),
    svg("polyline", { points: pts, class: loss ? "lab-line lab-line-loss" : "lab-line", fill: "none" }),
    ...values.map((v, i) => svg("circle", { cx: x(i), cy: y(v), r: 3, class: loss ? "lab-dot lab-dot-loss" : "lab-dot" })));
  return h("figure", { class: "lab-fig" }, h("figcaption", {}, title), el as unknown as Node, h("div", { class: "lab-hint" }, `Highest ${fmtRs(Math.round(Math.max(...values)))} · Lowest ${fmtRs(Math.round(Math.min(...values)))} · Now ${fmtRs(Math.round(last))}`));
}

function histogram(s: Stats): HTMLElement {
  const W = 600, H = 170, pad = 8, bw = (W - 2 * pad) / s.rHistogram.length, max = Math.max(1, ...s.rHistogram.map((b) => b.count));
  const label = (b: { from: number; to: number }, i: number) => (i === 0 ? "<-2" : i === 6 ? "3+" : String(b.from));
  const el = svg("svg", { viewBox: `0 0 ${W} ${H + 30}`, role: "img", "aria-label": "How many trades ended at each R result", class: "lab-chart" },
    ...s.rHistogram.flatMap((b, i) => {
      const bh = (b.count / max) * (H - 55);
      return [svg("rect", { x: pad + i * bw + 4, y: H - 14 - bh, width: bw - 8, height: bh, class: b.to <= 0 ? "lab-bar-neg" : "lab-bar-pos" }),
        (() => { const t = svg("text", { x: pad + i * bw + bw / 2, y: H + 14, "text-anchor": "middle", class: "lab-tick" }); t.textContent = label(b, i); return t; })(),
        (() => { const t = svg("text", { x: pad + i * bw + bw / 2, y: H - 18 - bh, "text-anchor": "middle", class: "lab-tick" }); t.textContent = b.count ? String(b.count) : ""; return t; })()];
    }));
  return h("figure", { class: "lab-fig" }, h("figcaption", {}, "Results in R (1 R = the loss you planned)"), el as unknown as Node, h("div", { class: "lab-hint" }, "A bar labelled 1 means trades that ended between 1 R and 2 R."));
}
