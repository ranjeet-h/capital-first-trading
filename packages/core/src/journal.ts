// Trade journal records. Money is whole paise. One record per position; partial exits are child rows.
import { computeCosts, type Exchange, type Product, type Rates } from "./costs";
import type { StoredRecord } from "./store";

export type Mode = "paper" | "live" | "forward" | "backtest" | "kite_demo";
export const MODES: Mode[] = ["paper", "live", "forward", "backtest", "kite_demo"];

export interface Plan {
  entryPaise: number; stopPaise: number; targetPaise?: number; qty: number;
  setup: string; thesis: string; checklistOk: boolean;
}
export interface Exit { at: string; qty: number; pricePaise: number }
export interface Amendment { at: string; field: string; from: unknown; to: unknown }

export interface Trade extends StoredRecord {
  entry_type: "trade";
  mode: Mode; symbol: string; exchange: Exchange; product: Product;
  planned_at: string;
  plan: Plan;
  /** True when a planned field was changed after the position was opened. Kept visible on purpose. */
  amended_after_entry: boolean;
  amendments: Amendment[];
  opened_at?: string; entry_price_paise?: number; entry_qty?: number;
  exits: Exit[];
  /** Real costs from the contract note. When absent, costs are estimated from the rates file. */
  costs_paise?: number;
  followed_plan?: boolean;
  emotions: string[]; tags: string[]; notes: string;
  mae_paise?: number; mfe_paise?: number;
}
export interface Note extends StoredRecord { entry_type: "note"; at: string; text: string; tags: string[] }
export type Entry = Trade | Note;
export type Status = "planned" | "open" | "closed";

const isInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n);

export function validatePlan(p: Plan): string[] {
  const e: string[] = [];
  if (!isInt(p.entryPaise) || p.entryPaise <= 0) e.push("Enter a planned entry price above zero.");
  if (!isInt(p.stopPaise) || p.stopPaise <= 0) e.push("Enter a stop-loss price above zero.");
  else if (isInt(p.entryPaise) && p.stopPaise >= p.entryPaise) e.push("The stop-loss must be below the entry price (long trades only).");
  if (p.targetPaise !== undefined && (!isInt(p.targetPaise) || p.targetPaise <= p.entryPaise)) e.push("The target must be above the entry price.");
  if (!isInt(p.qty) || p.qty <= 0) e.push("Enter a whole number of shares.");
  return e;
}

export function newTrade(id: string, now: string, f: { mode: Mode; symbol: string; exchange: Exchange; product: Product; plan: Plan; tags?: string[] }): Trade {
  const errs = validatePlan(f.plan);
  if (errs.length) throw new Error(errs[0]);
  if (!f.symbol.trim()) throw new Error("Enter the stock symbol.");
  return {
    id, updated_at: now, entry_type: "trade", mode: f.mode, symbol: f.symbol.trim().toUpperCase(), exchange: f.exchange, product: f.product,
    planned_at: now, plan: { ...f.plan }, amended_after_entry: false, amendments: [], exits: [], emotions: [], tags: f.tags ?? [], notes: "",
  };
}

export const statusOf = (t: Trade): Status => {
  if (t.opened_at === undefined) return "planned";
  const out = t.exits.reduce((s, x) => s + x.qty, 0);
  return out >= (t.entry_qty ?? 0) ? "closed" : "open";
};

export function recordEntry(t: Trade, now: string, f: { at: string; pricePaise: number; qty: number }): Trade {
  if (t.opened_at !== undefined) throw new Error("This trade already has an entry.");
  if (!isInt(f.pricePaise) || f.pricePaise <= 0) throw new Error("Enter the price you actually paid.");
  if (!isInt(f.qty) || f.qty <= 0) throw new Error("Enter a whole number of shares.");
  return { ...t, updated_at: now, opened_at: f.at, entry_price_paise: f.pricePaise, entry_qty: f.qty };
}

export function addExit(t: Trade, now: string, x: Exit): Trade {
  if (statusOf(t) !== "open") throw new Error("There is no open position to sell.");
  if (!isInt(x.pricePaise) || x.pricePaise <= 0) throw new Error("Enter the price you sold at.");
  const left = (t.entry_qty ?? 0) - t.exits.reduce((s, e) => s + e.qty, 0);
  if (!isInt(x.qty) || x.qty <= 0) throw new Error("Enter a whole number of shares.");
  if (x.qty > left) throw new Error(`You only have ${left} shares left to sell.`);
  return { ...t, updated_at: now, exits: [...t.exits, { ...x }] };
}

const PLAN_FIELDS: (keyof Plan)[] = ["entryPaise", "stopPaise", "targetPaise", "qty", "setup", "thesis", "checklistOk"];
/** Change the plan. Before entry it is free. After entry each change is logged and the trade is flagged. */
export function amendPlan(t: Trade, now: string, changes: Partial<Plan>): Trade {
  const plan = { ...t.plan, ...changes };
  const errs = validatePlan(plan);
  if (errs.length) throw new Error(errs[0]);
  const log: Amendment[] = [];
  for (const k of PLAN_FIELDS) if (k in changes && t.plan[k] !== plan[k]) log.push({ at: now, field: k, from: t.plan[k], to: plan[k] });
  if (!log.length) return t;
  const after = t.opened_at !== undefined;
  return { ...t, updated_at: now, plan, amended_after_entry: t.amended_after_entry || after, amendments: after ? [...t.amendments, ...log] : t.amendments };
}

export function newNote(id: string, now: string, text: string, tags: string[] = []): Note {
  if (!text.trim()) throw new Error("Write something first.");
  return { id, updated_at: now, entry_type: "note", at: now, text: text.trim(), tags };
}

/** Soft delete: keeps a marker so the delete survives a merge from a backup. */
export const tombstone = <T extends Entry>(e: T, now: string): T => ({ ...e, updated_at: now, deleted: true });

export interface Result {
  id: string; mode: Mode; status: Status; closedAt?: string;
  grossPaise: number; costsPaise: number; netPaise: number;
  plannedRiskPaise: number; r: number;
  followedPlan?: boolean; amended: boolean;
}

export function resultOf(t: Trade, rates: Rates): Result {
  const plannedRiskPaise = (t.plan.entryPaise - t.plan.stopPaise) * t.plan.qty;
  const status = statusOf(t);
  let gross = 0, estCosts = 0;
  const entry = t.entry_price_paise ?? 0;
  t.exits.forEach((x, i) => {
    gross += (x.pricePaise - entry) * x.qty;
    estCosts += computeCosts(rates, { buyPricePaise: entry, sellPricePaise: x.pricePaise, quantity: x.qty, product: t.product, exchange: t.exchange, dpCharge: t.product === "cnc" && i === 0 }).totalPaise;
  });
  const costsPaise = t.costs_paise ?? estCosts;
  const netPaise = gross - costsPaise;
  return {
    id: t.id, mode: t.mode, status, closedAt: status === "closed" ? t.exits[t.exits.length - 1]!.at : undefined,
    grossPaise: gross, costsPaise, netPaise, plannedRiskPaise, r: plannedRiskPaise > 0 ? netPaise / plannedRiskPaise : 0,
    followedPlan: t.followed_plan, amended: t.amended_after_entry,
  };
}
