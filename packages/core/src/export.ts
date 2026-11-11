import type { Rates } from "./costs";
import { resultOf, type Trade } from "./journal";

const q = (v: string | number | undefined) => { const s = v === undefined ? "" : String(v); return /[",\n\r]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"` : s; };
const rs = (p: number | undefined) => (p === undefined ? "" : (p / 100).toFixed(2));

export const CSV_HEADER = ["trade_id", "mode", "symbol", "exchange", "product", "status", "planned_at", "setup", "plan_entry", "plan_stop", "plan_target", "plan_qty", "planned_risk", "opened_at", "entry_price", "entry_qty", "closed_at", "exit_avg_price", "gross_pnl", "costs", "net_pnl", "r_multiple", "followed_plan", "amended_after_entry", "emotions", "tags", "notes"];

/** One row per trade, amounts in rupees, ready for a spreadsheet. Text that could run as a formula is made safe. */
export function tradesToCsv(trades: Trade[], rates: Rates): string {
  const rows = trades.filter((t) => !t.deleted).map((t) => {
    const r = resultOf(t, rates);
    const sold = t.exits.reduce((s, x) => s + x.qty, 0);
    const avg = sold ? t.exits.reduce((s, x) => s + x.qty * x.pricePaise, 0) / sold : undefined;
    return [t.id, t.mode, t.symbol, t.exchange, t.product, r.status, t.planned_at, t.plan.setup, rs(t.plan.entryPaise), rs(t.plan.stopPaise), rs(t.plan.targetPaise), t.plan.qty, rs(r.plannedRiskPaise),
      t.opened_at, rs(t.entry_price_paise), t.entry_qty, r.closedAt, avg === undefined ? "" : (avg / 100).toFixed(2), t.exits.length ? rs(r.grossPaise) : "", t.exits.length ? rs(r.costsPaise) : "", t.exits.length ? rs(r.netPaise) : "",
      r.status === "closed" ? r.r.toFixed(2) : "", t.followed_plan === undefined ? "" : t.followed_plan ? "yes" : "no", t.amended_after_entry ? "yes" : "no", t.emotions.join("; "), t.tags.join("; "), t.notes].map(q).join(",");
  });
  return [CSV_HEADER.join(","), ...rows].join("\n") + "\n";
}
