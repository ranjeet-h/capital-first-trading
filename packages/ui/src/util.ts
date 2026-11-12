// Shared helpers for lab custom elements: DOM, Indian-rupee formatting, safe storage.
type Child = Node | string | null | undefined | false;
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K, props: Record<string, unknown> = {}, ...kids: Child[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") e.className = String(v);
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v as EventListener);
    else if (k in e && k !== "list") (e as unknown as Record<string, unknown>)[k] = v;
    else e.setAttribute(k, String(v));
  }
  for (const c of kids) if (c) e.append(c);
  return e;
}
export const svg = (tag: string, attrs: Record<string, string | number> = {}, ...kids: Node[]) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  e.append(...kids);
  return e;
};

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
/** paise -> "1,23,456.78" (no symbol). */
export const fmtInr = (paise: number) => (paise < 0 ? "-" : "") + inr.format(Math.abs(paise) / 100);
export const fmtRs = (paise: number) => (paise < 0 ? "-Rs " : "Rs ") + inr.format(Math.abs(paise) / 100);
export const fmtInt = (n: number) => inr0.format(n);
export const fmtPct = (n: number, d = 2) => n.toFixed(d) + "%";

/** "1,250.50" -> 125050 paise. Returns NaN for blank or invalid input (never guesses). */
export function parseRupees(text: string): number {
  const t = text.replace(/,/g, "").replace(/^Rs\.?\s*/i, "").trim();
  if (!/^\d*\.?\d{0,2}$/.test(t) || t === "" || t === ".") return NaN;
  return Math.round(parseFloat(t) * 100);
}
export const parseNum = (text: string): number => {
  const t = text.replace(/,/g, "").trim();
  return /^\d*\.?\d+$/.test(t) ? parseFloat(t) : NaN;
};

export const store = {
  get(key: string): Record<string, string> | null {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  set(key: string, val: Record<string, string>) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* private mode: fine */ }
  },
};

/** A hand-off from a calculator to the journal's plan form. Lives in this browser only; the journal clears it once used. */
export const DRAFT_KEY = "cft-journal-draft-v1";
export interface JournalDraft { from: "size" | "costs"; entry?: string; stop?: string; target?: string; qty?: string; product?: string; exchange?: string }
export const draft = {
  get(): JournalDraft | null { const d = store.get(DRAFT_KEY) as JournalDraft | null; return d && (d.from === "size" || d.from === "costs") ? d : null; },
  set(d: JournalDraft) { store.set(DRAFT_KEY, d as unknown as Record<string, string>); },
  clear() { try { localStorage.removeItem(DRAFT_KEY); } catch { /* fine */ } },
};

let uid = 0;
export const nextId = (p: string) => `${p}-${++uid}`;
