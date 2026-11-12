// Made-up but realistic daily prices. Trends, falls and sideways stretches; calm and wild spells; fat tails; gaps;
// a 20% daily limit; and some shares that stop trading. Same seed gives the same data.
import { rng } from "./rng";
import type { Bar, Series } from "./types";

const NAMES = ["ALPHA", "BRAVO", "CEDAR", "DELTA", "EMBER", "FALCON", "GLACIER", "HARBOR", "IVORY", "JASPER", "KESTREL", "LOTUS", "MAPLE", "NOVA", "ORBIT", "PRISM", "QUARTZ", "RIVER", "SUMMIT", "TIDAL"];

export function tradingDays(startYear: number, count: number): string[] {
  const out: string[] = []; const d = new Date(Date.UTC(startYear, 0, 1));
  while (out.length < count) { const w = d.getUTCDay(); if (w !== 0 && w !== 6) out.push(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() + 1); }
  return out;
}

export function generateUniverse(seed: number, tickers = 12, years = 8): Series[] {
  const days = tradingDays(2015, Math.round(years * 252));
  const out: Series[] = [];
  for (let k = 0; k < tickers; k++) {
    const r = rng(seed * 1000 + k * 7919 + 1);
    const delistAt = r.next() < 0.2 ? Math.floor(days.length * (0.4 + 0.5 * r.next())) : -1;
    let price = 20000 + Math.floor(r.next() * 180000); // Rs 200 to Rs 2,000, in paise
    let regime = 2, left = 0, vol = 0.012;
    const bars: Bar[] = [], regimes: number[] = [];
    for (let i = 0; i < days.length; i++) {
      if (delistAt >= 0 && i > delistAt) break;
      if (left <= 0) { regime = Math.floor(r.next() * 3); left = 40 + Math.floor(r.next() * 160); } left--;
      const drift = regime === 0 ? 0.0009 : regime === 1 ? -0.0008 : 0;
      vol = Math.min(0.045, Math.max(0.006, 0.94 * vol + 0.06 * 0.013 + 0.004 * Math.abs(r.normal()))); // calm and wild spells
      const fat = r.next() < 0.03 ? 3 : 1; // now and then a much bigger day
      const dying = delistAt >= 0 && i > delistAt - 25 ? -0.09 : 0;
      const gap = Math.max(-0.1, Math.min(0.1, r.normal() * vol * 0.6 + (fat === 3 ? r.normal() * vol : 0)));
      const open = Math.max(100, Math.round(price * Math.exp(gap)));
      let ret = drift + dying + r.normal() * vol * fat;
      let close = Math.round(open * Math.exp(ret));
      const lo = Math.round(price * 0.8), hi = Math.round(price * 1.2); // daily price limit
      close = Math.min(hi, Math.max(lo, Math.max(100, close)));
      const spread = vol * (0.4 + r.next());
      const high = Math.min(hi, Math.round(Math.max(open, close) * (1 + spread * r.next())));
      const low = Math.max(lo, Math.max(50, Math.round(Math.min(open, close) * (1 - spread * r.next()))));
      bars.push({ d: days[i]!, o: Math.min(hi, Math.max(lo, open)), h: Math.max(high, open, close), l: Math.min(low, open, close), c: close, v: Math.round(100000 + r.next() * 900000) });
      regimes.push(regime); price = close;
    }
    const b0 = bars; // keep the open inside the high and low after clipping
    for (const b of b0) { b.h = Math.max(b.h, b.o, b.c); b.l = Math.min(b.l, b.o, b.c); }
    out.push({ symbol: NAMES[k % NAMES.length]! + (k >= NAMES.length ? String(Math.floor(k / NAMES.length)) : ""), bars, delisted: delistAt >= 0, regimes });
  }
  return out;
}
