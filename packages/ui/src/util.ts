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

let uid = 0;
export const nextId = (p: string) => `${p}-${++uid}`;
