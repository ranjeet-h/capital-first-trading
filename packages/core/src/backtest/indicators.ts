import type { Bar } from "./types";
const NA = NaN;
export function sma(x: number[], n: number): number[] {
  const out = new Array<number>(x.length).fill(NA); let s = 0;
  for (let i = 0; i < x.length; i++) { s += x[i]!; if (i >= n) s -= x[i - n]!; if (i >= n - 1) out[i] = s / n; }
  return out;
}
/** Average true range: the plain average of the last n true ranges. */
export function atr(b: Bar[], n: number): number[] {
  const tr = b.map((x, i) => (i === 0 ? x.h - x.l : Math.max(x.h - x.l, Math.abs(x.h - b[i - 1]!.c), Math.abs(x.l - b[i - 1]!.c))));
  return sma(tr, n);
}
/** Highest high of the n days BEFORE each day (today is not included). */
export function highestBefore(b: Bar[], n: number): number[] {
  return b.map((_, i) => { if (i < n) return NA; let m = 0; for (let k = i - n; k < i; k++) m = Math.max(m, b[k]!.h); return m; });
}
