// Read a Zerodha Console tradebook (CSV) and turn it into journal trades. Long positions in cash shares only.
import type { Exchange, Product } from "./costs";
import type { Trade } from "./journal";

export interface ImportRow { row: number; symbol: string; exchange: Exchange; at: string; side: "buy" | "sell"; qty: number; pricePaise: number; tradeId: string }
export interface Skipped { row: number; reason: string }
export interface ConsoleParse { rows: ImportRow[]; skipped: Skipped[]; trades: Trade[] }

/** Split one CSV line, honouring double quotes. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = []; let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur); return out.map((x) => x.trim());
}
const norm = (s: string) => s.toLowerCase().replace(/^﻿/, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const REQUIRED = ["symbol", "trade_date", "trade_type", "quantity", "price"];

/** Rupees text to whole paise, or null when it is not a clean amount with at most two decimals. */
export function rupeesToPaise(s: string): number | null {
  const m = /^(\d+)(?:\.(\d{1,2})\d*)?$/.exec(s.replace(/,/g, "").trim());
  if (!m) return null;
  const frac = (m[2] ?? "").padEnd(2, "0");
  return Number(m[1]) * 100 + Number(frac);
}

export function parseTradebook(csv: string, now: string): ConsoleParse {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) throw new Error("The file is empty.");
  const head = splitCsvLine(lines[0]!).map(norm);
  const miss = REQUIRED.filter((c) => !head.includes(c));
  if (miss.length) throw new Error("This does not look like a Zerodha tradebook. Missing columns: " + miss.join(", ") + ".");
  const col = (name: string) => head.indexOf(name);
  const rows: ImportRow[] = [], skipped: Skipped[] = [];

  lines.slice(1).forEach((line, i) => {
    const row = i + 2, c = splitCsvLine(line), get = (n: string) => (col(n) >= 0 ? c[col(n)] ?? "" : "");
    const seg = get("segment").toUpperCase();
    if (seg && seg !== "EQ") { skipped.push({ row, reason: `Segment ${seg} is not supported. Only cash shares (EQ) can be imported.` }); return; }
    const side = get("trade_type").toLowerCase();
    if (side !== "buy" && side !== "sell") { skipped.push({ row, reason: "The trade type is not buy or sell." }); return; }
    const qty = Number(get("quantity")), price = rupeesToPaise(get("price"));
    if (!Number.isInteger(qty) || qty <= 0) { skipped.push({ row, reason: "The quantity is not a whole number above zero." }); return; }
    if (price === null || price <= 0) { skipped.push({ row, reason: "The price could not be read." }); return; }
    const exch = get("exchange").toUpperCase();
    if (exch !== "NSE" && exch !== "BSE") { skipped.push({ row, reason: "The exchange is not NSE or BSE." }); return; }
    const when = get("order_execution_time") || get("trade_date");
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(when) ? when + "T12:00:00" : when);
    if (isNaN(d.getTime())) { skipped.push({ row, reason: "The date could not be read." }); return; }
    rows.push({ row, symbol: get("symbol").toUpperCase(), exchange: exch, at: d.toISOString(), side, qty, pricePaise: price, tradeId: get("trade_id") || `r${row}` });
  });

  // Group by share and exchange, oldest first, then walk the fills: flat -> open -> flat is one position.
  const groups = new Map<string, ImportRow[]>();
  for (const r of rows) { const k = r.exchange + ":" + r.symbol; (groups.get(k) ?? groups.set(k, []).get(k)!).push(r); }
  const trades: Trade[] = [];
  for (const g of groups.values()) {
    g.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.side === b.side ? 0 : a.side === "buy" ? -1 : 1));
    let cur: { buys: ImportRow[]; exits: { at: string; qty: number; pricePaise: number }[]; held: number } | null = null;
    const close = () => { if (cur) { trades.push(build(cur.buys, cur.exits, now)); cur = null; } };
    for (const r of g) {
      if (r.side === "buy") { cur ??= { buys: [], exits: [], held: 0 }; cur.buys.push(r); cur.held += r.qty; continue; }
      if (!cur) { skipped.push({ row: r.row, reason: `Sold ${r.symbol} without a matching buy in this file. Short selling and older holdings cannot be imported.` }); continue; }
      if (r.qty > cur.held) { skipped.push({ row: r.row, reason: `Sold more ${r.symbol} than was bought in this file.` }); continue; }
      cur.exits.push({ at: r.at, qty: r.qty, pricePaise: r.pricePaise }); cur.held -= r.qty;
      if (cur.held === 0) close();
    }
    close();
  }
  trades.sort((a, b) => (a.opened_at! < b.opened_at! ? -1 : 1));
  skipped.sort((a, b) => a.row - b.row);
  return { rows, skipped, trades };
}

function build(buys: ImportRow[], exits: { at: string; qty: number; pricePaise: number }[], now: string): Trade {
  const qty = buys.reduce((s, b) => s + b.qty, 0);
  const cost = buys.reduce((s, b) => s + b.qty * b.pricePaise, 0);
  const avg = Math.round(cost / qty), first = buys[0]!;
  const sameDay = exits.length > 0 && exits.reduce((s, x) => s + x.qty, 0) === qty && new Date(first.at).toDateString() === new Date(exits[exits.length - 1]!.at).toDateString();
  const product: Product = sameDay ? "mis" : "cnc";
  return {
    id: `tb-${first.exchange}-${first.symbol}-${first.tradeId}`, updated_at: now, entry_type: "trade", mode: "live", symbol: first.symbol, exchange: first.exchange, product,
    planned_at: first.at, plan: { entryPaise: avg, stopPaise: avg, qty, setup: "Imported", thesis: "Imported from a Zerodha tradebook. No plan was written before this trade.", checklistOk: false },
    amended_after_entry: false, amendments: [], opened_at: first.at, entry_price_paise: avg, entry_qty: qty, exits: exits.map((x) => ({ ...x })),
    emotions: [], tags: ["imported"], notes: "",
  };
}
