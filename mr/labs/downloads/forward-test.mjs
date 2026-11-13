// tools/forward-test/cli.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, openSync, closeSync, unlinkSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

// data/rates/zerodha-equity.json
var zerodha_equity_default = {
  id: "zerodha_equity_cash_v1",
  source: "https://zerodha.com/charges",
  verifiedOn: "2026-11-11",
  reviewEveryDays: 90,
  notes: "Read from zerodha.com/charges and from the calculator script https://zerodha.com/static/js/brokerage.js on 2026-11-11. NSE exchange charge is 0.00297% plus IPFT 0.0001% (together the 0.00307% shown on the charges page). Calculator rounds each charge to 2 decimals (JS toFixed), STT and stamp duty to whole rupees (Math.round), and leaves out the DP charge. Verified against 7 official-calculator screenshots. Rates per crore are rupees per Rs 1,00,00,000 of turnover.",
  brokerage: {
    cnc: {
      type: "zero"
    },
    mis: {
      type: "lower_of",
      flatPaise: 2e3,
      percentPerCrore: 3e3
    }
  },
  sttPerCrore: {
    cnc: {
      buy: 1e4,
      sell: 1e4
    },
    mis: {
      buy: 0,
      sell: 2500
    }
  },
  exchangePerCrore: {
    NSE: 297,
    BSE: 375
  },
  sebiPerCrore: 10,
  stampPerCrore: {
    cnc: 1500,
    mis: 300
  },
  gstPercent: 18,
  dpSellPaise: {
    cdsl: 350,
    broker: 950,
    gst: 234,
    total: 1534
  },
  minPaisePerContractNote: 1,
  ipftPerCrore: {
    NSE: 10,
    BSE: 0
  }
};

// packages/core/src/console-import.ts
function splitCsvLine(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}
function rupeesToPaise(s) {
  const m = /^(\d+)(?:\.(\d{1,2})\d*)?$/.exec(s.replace(/,/g, "").trim());
  if (!m) return null;
  const frac = (m[2] ?? "").padEnd(2, "0");
  return Number(m[1]) * 100 + Number(frac);
}

// packages/core/src/costs.ts
var CRORE = 1e7;
var f2 = (x) => parseFloat(x.toFixed(2));
var toPaise = (rupees) => Math.round(rupees * 100);
function brokerageForOrder(r, product, valueRs) {
  if (product === "cnc") return 0;
  const b = r.brokerage.mis;
  const pctPart = valueRs * (b.percentPerCrore / CRORE);
  return pctPart > b.flatPaise / 100 ? b.flatPaise / 100 : f2(pctPart);
}
function costLines(r, t) {
  const bp = t.buyPricePaise / 100, sp = t.sellPricePaise / 100, qty = t.quantity;
  const buyV = bp * qty, sellV = sp * qty;
  const turnover = f2((bp + sp) * qty);
  const brokerage = f2(brokerageForOrder(r, t.product, buyV) + brokerageForOrder(r, t.product, sellV));
  const sb = r.sttPerCrore[t.product].buy / CRORE, ss = r.sttPerCrore[t.product].sell / CRORE;
  const stt = Math.round(f2(sb === ss ? turnover * ss : buyV * sb + sellV * ss));
  const sebi = f2(turnover * (r.sebiPerCrore / CRORE));
  const exch = f2(f2(turnover * (r.exchangePerCrore[t.exchange] / CRORE)) + (r.ipftPerCrore[t.exchange] ? f2(turnover * (r.ipftPerCrore[t.exchange] / CRORE)) : 0));
  const gst = f2(r.gstPercent / 100 * (brokerage + exch + sebi));
  const stamp = Math.round(f2(buyV * (r.stampPerCrore[t.product] / CRORE)));
  const dp = t.dpCharge ?? t.product === "cnc" ? r.dpSellPaise.total : 0;
  return [
    { key: "brokerage", label: "Brokerage", paise: toPaise(brokerage) },
    { key: "stt", label: "STT", paise: toPaise(stt) },
    { key: "exchange", label: "Exchange transaction charge", paise: toPaise(exch) },
    { key: "sebi", label: "SEBI charge", paise: toPaise(sebi) },
    { key: "stamp", label: "Stamp duty", paise: toPaise(stamp) },
    { key: "gst", label: "GST", paise: toPaise(gst) },
    { key: "dp", label: "DP charge (on sell)", paise: dp }
  ];
}
var sum = (lines) => lines.reduce((s, l) => s + l.paise, 0);
function computeCosts(r, t) {
  if (![t.buyPricePaise, t.sellPricePaise, t.quantity].every((n) => Number.isInteger(n) && n > 0))
    throw new RangeError("prices (paise) and quantity must be positive integers");
  const buy = t.buyPricePaise * t.quantity, sell = t.sellPricePaise * t.quantity;
  const lines = costLines(r, t);
  const totalPaise = sum(lines);
  const grossPnlPaise = sell - buy;
  let be = t.buyPricePaise;
  while (sum(costLines(r, { ...t, sellPricePaise: be })) > (be - t.buyPricePaise) * t.quantity) be++;
  return {
    buyValuePaise: buy,
    sellValuePaise: sell,
    lines,
    totalPaise,
    grossPnlPaise,
    netPnlPaise: grossPnlPaise - totalPaise,
    breakEvenPricePaise: be,
    breakEvenPercent: (be - t.buyPricePaise) / t.buyPricePaise * 100
  };
}

// packages/core/src/backtest/indicators.ts
var NA = NaN;
function sma(x, n) {
  const out = new Array(x.length).fill(NA);
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    s += x[i];
    if (i >= n) s -= x[i - n];
    if (i >= n - 1) out[i] = s / n;
  }
  return out;
}
function atr(b, n) {
  const tr = b.map((x, i) => i === 0 ? x.h - x.l : Math.max(x.h - x.l, Math.abs(x.h - b[i - 1].c), Math.abs(x.l - b[i - 1].c)));
  return sma(tr, n);
}
function highestBefore(b, n) {
  return b.map((_, i) => {
    if (i < n) return NA;
    let m = 0;
    for (let k = i - n; k < i; k++) m = Math.max(m, b[k].h);
    return m;
  });
}

// packages/core/src/backtest/engine.ts
function validateStrategy(s) {
  const e = [];
  if (s.version !== 1) e.push("Unknown strategy version.");
  if (!["buy_and_hold", "sma_cross", "breakout"].includes(s.type)) e.push("Unknown strategy type.");
  const pos = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;
  if (s.type === "sma_cross") {
    if (!pos(s.fast) || !pos(s.slow) || s.fast >= s.slow) e.push("The fast average must be shorter than the slow one.");
  }
  if (s.type === "breakout" && (!Number.isInteger(s.lookback) || s.lookback < 2)) e.push("Look-back must be a whole number of days, at least 2.");
  if (s.type !== "buy_and_hold") {
    if (!pos(s.stopAtr)) e.push("The stop distance must be above zero.");
    if (!pos(s.riskPct) || s.riskPct > 5) e.push("Risk per trade must be above 0 and at most 5 percent.");
  }
  if (!Number.isInteger(s.maxPositions) || s.maxPositions < 1) e.push("Open positions must be at least 1.");
  return e;
}
function runBacktest(rates, universe, s, cfg) {
  const errs = validateStrategy(s);
  if (errs.length) throw new Error(errs[0]);
  const days = [...new Set(universe.flatMap((x) => x.bars.map((b) => b.d)))].sort();
  const lo = cfg.from ? days.findIndex((d) => d >= cfg.from) : 0;
  let hi = cfg.to ? days.length - 1 : days.length - 1;
  if (cfg.to) {
    hi = -1;
    days.forEach((d, i) => {
      if (d <= cfg.to) hi = i;
    });
  }
  if (lo < 0 || hi < lo) return { trades: [], equity: [], skipped: [], exposure: 0 };
  const S = universe.map((u) => {
    const idx = new Map(u.bars.map((b, i) => [b.d, i]));
    return { u, idx, atr: atr(u.bars, s.atrPeriod), fast: s.type === "sma_cross" ? sma(u.bars.map((b) => b.c), s.fast) : [], slow: s.type === "sma_cross" ? sma(u.bars.map((b) => b.c), s.slow) : [], hh: s.type === "breakout" ? highestBefore(u.bars, s.lookback) : [] };
  });
  const slip = (p, side) => Math.max(1, Math.round(p * (1 + side * cfg.slippageBps / 1e4)));
  let cash = cfg.capitalPaise, expo = 0;
  const pos = /* @__PURE__ */ new Map(), pend = [], pendExit = /* @__PURE__ */ new Set();
  const trades = [], skipped = [], equity = [];
  const close = (p, day, px, why) => {
    const sell = slip(px, -1);
    const costs = Math.round(computeCosts(rates, { buyPricePaise: p.entry, sellPricePaise: sell, quantity: p.qty, product: "cnc", exchange: "NSE", dpCharge: true }).totalPaise * cfg.costMult);
    const gross = (sell - p.entry) * p.qty, risk = (p.entry - p.initialStop) * p.qty;
    cash += sell * p.qty - costs;
    trades.push({ symbol: p.symbol, entryDay: p.entryDay, exitDay: day, entryPaise: p.entry, exitPaise: sell, qty: p.qty, stopPaise: p.initialStop, grossPaise: gross, costsPaise: costs, netPaise: gross - costs, plannedRiskPaise: risk, r: risk > 0 ? (gross - costs) / risk : 0, exitReason: why });
    pos.delete(p.symbol);
  };
  const equityNow = (di) => {
    let v = cash;
    for (const p of pos.values()) {
      const x = S.find((q) => q.u.symbol === p.symbol);
      const i = x.idx.get(days[di]);
      const last = i !== void 0 ? x.u.bars[i].c : x.u.bars[x.u.bars.length - 1].c;
      v += p.qty * last;
    }
    return v;
  };
  const open = (symbol, day, px, atrV) => {
    const fill = slip(px, 1), eq = equityNow(daysIndex(day));
    let qty, stop;
    if (s.type === "buy_and_hold") {
      qty = Math.floor(cash / Math.max(1, universe.length - pos.size) / fill);
      stop = 1;
    } else {
      stop = Math.max(1, Math.round(fill - s.stopAtr * atrV));
      if (stop >= fill) {
        skipped.push({ d: day, symbol, why: "The stop would not be below the price." });
        return;
      }
      qty = Math.floor(eq * s.riskPct / 100 / (fill - stop));
      qty = Math.min(qty, Math.floor(eq / s.maxPositions / fill));
    }
    qty = Math.min(qty, Math.floor(cash / fill));
    if (qty < 1) {
      skipped.push({ d: day, symbol, why: "Not enough money for even one share within your limits." });
      return;
    }
    cash -= qty * fill;
    pos.set(symbol, { symbol, qty, entry: fill, stop, initialStop: stop, entryDay: day, atrAtSignal: atrV });
  };
  const dayIdx = new Map(days.map((d, i) => [d, i]));
  const daysIndex = (d) => dayIdx.get(d);
  for (let di = lo; di <= hi; di++) {
    const day = days[di];
    for (const p of [...pos.values()]) if (pendExit.has(p.symbol)) {
      const x = S.find((q) => q.u.symbol === p.symbol), i = x.idx.get(day);
      if (i !== void 0) {
        close(p, day, x.u.bars[i].o, "signal");
        pendExit.delete(p.symbol);
      }
    }
    for (const o of pend.splice(0)) {
      const x = S.find((q) => q.u.symbol === o.symbol), i = x.idx.get(day);
      if (i !== void 0 && !pos.has(o.symbol)) open(o.symbol, day, x.u.bars[i].o, o.atr);
    }
    for (const p of [...pos.values()]) {
      const x = S.find((q) => q.u.symbol === p.symbol), i = x.idx.get(day);
      if (i === void 0) {
        if (x.u.delisted && day > x.u.bars[x.u.bars.length - 1].d) close(p, day, x.u.bars[x.u.bars.length - 1].c, "delisted");
        continue;
      }
      const b = x.u.bars[i];
      if (s.type !== "buy_and_hold" && b.l <= p.stop) close(p, day, Math.min(b.o, p.stop), "stop");
    }
    for (const x of S) {
      const i = x.idx.get(day);
      if (i === void 0) continue;
      const b = x.u.bars[i], held = pos.get(x.u.symbol);
      if (held && s.type === "breakout" && s.trailAtr && !isNaN(x.atr[i])) held.stop = Math.max(held.stop, Math.round(b.c - s.trailAtr * x.atr[i]));
      if (held && s.type === "sma_cross" && !isNaN(x.slow[i]) && x.fast[i] < x.slow[i]) {
        if (cfg.fillAt === "same_close") close(held, day, b.c, "signal");
        else pendExit.add(x.u.symbol);
      }
      if (held || pend.some((o) => o.symbol === x.u.symbol)) continue;
      let signal = false;
      if (s.type === "buy_and_hold") signal = di === lo;
      else if (s.type === "sma_cross") signal = i > 0 && !isNaN(x.slow[i - 1]) && x.fast[i - 1] <= x.slow[i - 1] && x.fast[i] > x.slow[i];
      else signal = !isNaN(x.hh[i]) && b.c > x.hh[i];
      if (!signal || isNaN(x.atr[i]) && s.type !== "buy_and_hold") continue;
      if (pos.size + pend.length >= s.maxPositions) {
        skipped.push({ d: day, symbol: x.u.symbol, why: "Already holding the most positions you allow." });
        continue;
      }
      if (cfg.fillAt === "same_close") {
        const tomorrow = x.u.bars[i + 1];
        if (tomorrow && tomorrow.c > b.c) open(x.u.symbol, day, b.c, x.atr[i]);
      } else pend.push({ symbol: x.u.symbol, atr: x.atr[i] });
    }
    if (pos.size) expo++;
    equity.push({ d: day, v: equityNow(di) });
  }
  const pending = [...pend.map((o) => ({ symbol: o.symbol, action: "buy" })), ...[...pendExit].map((symbol) => ({ symbol, action: "sell" }))].sort((a, b) => a.symbol < b.symbol ? -1 : 1);
  for (const p of [...pos.values()]) {
    const x = S.find((q) => q.u.symbol === p.symbol);
    const i = (() => {
      let k = -1;
      x.u.bars.forEach((b, j) => {
        if (b.d <= days[hi]) k = j;
      });
      return k;
    })();
    close(p, days[hi], x.u.bars[Math.max(0, i)].c, "end");
  }
  if (equity.length) equity[equity.length - 1].v = cash;
  return { trades, equity, skipped, exposure: equity.length ? expo / equity.length : 0, pending };
}

// packages/core/src/stats.ts
var MIN_TRADES_FOR_TRUST = 30;
function computeStats(results) {
  const closed = results.filter((r) => r.status === "closed").sort((a, b) => a.closedAt < b.closedAt ? -1 : a.closedAt > b.closedAt ? 1 : 0);
  const n = closed.length;
  const wins = closed.filter((r) => r.netPaise > 0), losses = closed.filter((r) => r.netPaise < 0);
  const sum2 = (xs) => xs.reduce((a, b) => a + b, 0);
  const net = sum2(closed.map((r) => r.netPaise));
  const winSum = sum2(wins.map((r) => r.netPaise)), lossSum = sum2(losses.map((r) => r.netPaise));
  const avgWin = wins.length ? winSum / wins.length : 0, avgLoss = losses.length ? lossSum / losses.length : 0;
  const equity = [], drawdown = [];
  let run = 0, peak = 0, maxDd = 0;
  for (const r of closed) {
    run += r.netPaise;
    equity.push(run);
    peak = Math.max(peak, run);
    drawdown.push(peak - run);
    maxDd = Math.max(maxDd, peak - run);
  }
  let w = 0, l = 0, maxW = 0, maxL = 0;
  for (const r of closed) {
    if (r.netPaise > 0) {
      w++;
      l = 0;
    } else if (r.netPaise < 0) {
      l++;
      w = 0;
    } else {
      w = 0;
      l = 0;
    }
    maxW = Math.max(maxW, w);
    maxL = Math.max(maxL, l);
  }
  const known = closed.filter((r) => r.followedPlan !== void 0);
  const grossWins = sum2(closed.filter((r) => r.grossPaise > 0).map((r) => r.grossPaise));
  const totalCosts = sum2(closed.map((r) => r.costsPaise));
  const rHistogram = Array.from({ length: 7 }, (_, i) => ({ from: i - 3, to: i - 2, count: 0 }));
  const withR = closed.filter((r) => r.plannedRiskPaise > 0);
  for (const r of withR) rHistogram[Math.min(6, Math.max(0, Math.floor(r.r) + 3))].count++;
  return {
    count: n,
    wins: wins.length,
    losses: losses.length,
    winRate: n ? wins.length / n : 0,
    grossPaise: sum2(closed.map((r) => r.grossPaise)),
    costsPaise: totalCosts,
    netPaise: net,
    avgWinPaise: avgWin,
    avgLossPaise: avgLoss,
    payoff: avgLoss < 0 ? avgWin / -avgLoss : null,
    expectancyPaise: n ? net / n : 0,
    expectancyR: withR.length ? sum2(withR.map((r) => r.r)) / withR.length : 0,
    rCount: withR.length,
    profitFactor: lossSum < 0 ? winSum / -lossSum : null,
    equity,
    drawdown,
    maxDrawdownPaise: maxDd,
    maxWinStreak: maxW,
    maxLossStreak: maxL,
    planAdherence: known.length ? known.filter((r) => r.followedPlan).length / known.length : null,
    amendedCount: closed.filter((r) => r.amended).length,
    costShareOfGrossProfit: grossWins > 0 ? totalCosts / grossWins : null,
    rHistogram,
    lowSample: n < MIN_TRADES_FOR_TRUST
  };
}

// packages/core/src/backtest/metrics.ts
function summarise(run, capitalPaise) {
  const results = run.trades.map((t, i) => ({ id: String(i), mode: "backtest", status: "closed", closedAt: t.exitDay, grossPaise: t.grossPaise, costsPaise: t.costsPaise, netPaise: t.netPaise, plannedRiskPaise: t.plannedRiskPaise, r: t.r, amended: false }));
  const stats = computeStats(results);
  const eq = run.equity, end = eq.length ? eq[eq.length - 1].v : capitalPaise;
  let peak = capitalPaise, dd = 0, ddDays = 0, cur = 0;
  for (const p of eq) {
    if (p.v >= peak) {
      peak = p.v;
      cur = 0;
    } else {
      cur++;
      ddDays = Math.max(ddDays, cur);
      dd = Math.max(dd, (peak - p.v) / peak);
    }
  }
  const years = eq.length / 252;
  return { stats, startPaise: capitalPaise, endPaise: end, returnPct: (end / capitalPaise - 1) * 100, cagr: years >= 1 && end > 0 ? (Math.pow(end / capitalPaise, 1 / years) - 1) * 100 : null, maxDrawdownPct: dd * 100, maxDrawdownDays: ddDays, exposure: run.exposure, years };
}

// packages/core/src/backtest/types.ts
var DEFAULT_CONFIG = { capitalPaise: 1e7, slippageBps: 5, costMult: 1, fillAt: "next_open" };

// packages/core/src/forward.ts
function hashText(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
var strategyHash = (s) => hashText(JSON.stringify(s));
var MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function normDate(x) {
  const t = x.trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{1,2})[-/ ](\d{1,2})[-/ ](\d{4})$/.exec(t);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  m = /^(\d{1,2})[-/ ]([A-Za-z]{3})[A-Za-z]*[-/ ](\d{4})$/.exec(t);
  const mo = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  return m && mo >= 0 ? `${m[3]}-${String(mo + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
}
var ALIASES = {
  date: ["date", "timestamp", "trade date", "datetime"],
  open: ["open", "open price", "opening price"],
  high: ["high", "high price"],
  low: ["low", "low price"],
  close: ["close", "close price", "closing price", "last price", "ltp"],
  volume: ["volume", "total traded quantity", "shares traded", "traded quantity", "ttl trd qnty", "qty"]
};
var cleanHead = (x) => x.toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
function parseBarsCsv(symbol, csv) {
  const problems = [], bars = [];
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim() !== "");
  const head = splitCsvLine(lines[0] ?? "").map(cleanHead);
  const ix = ["date", "open", "high", "low", "close", "volume"].map((k) => head.findIndex((h) => ALIASES[k].includes(h)));
  if (ix.some((i) => i < 0)) {
    problems.push({ symbol, why: "The file needs the columns date, open, high, low, close and volume (or the same names NSE uses)." });
    return { series: { symbol, bars, delisted: false }, problems };
  }
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i]), d = normDate(f[ix[0]] ?? "");
    const p = [1, 2, 3, 4].map((k) => rupeesToPaise(f[ix[k]] ?? "")), v = Number((f[ix[5]] ?? "").replace(/,/g, ""));
    if (!d || p.some((x) => x === null || x <= 0) || !Number.isFinite(v)) {
      problems.push({ symbol, day: f[ix[0]], why: `Row ${i + 1} is not a clean price row.` });
      continue;
    }
    bars.push({ d, o: p[0], h: p[1], l: p[2], c: p[3], v });
  }
  bars.sort((a, b) => a.d < b.d ? -1 : 1);
  return { series: { symbol, bars, delisted: false }, problems };
}
var SPLITS = [[0.5, "1/2"], [2 / 3, "2/3"], [1 / 3, "1/3"], [0.25, "1/4"], [0.2, "1/5"], [0.1, "1/10"]];
function splitLike(ratio) {
  const hit = SPLITS.find(([r]) => Math.abs(ratio / r - 1) < 0.03);
  return hit ? hit[1] : null;
}
function checkSeries(s, latestDay) {
  const out = [];
  if (!s.bars.length) return [{ symbol: s.symbol, why: "No prices at all." }];
  s.bars.forEach((b, i) => {
    if (b.h < Math.max(b.o, b.c, b.l) || b.l > Math.min(b.o, b.c, b.h)) out.push({ symbol: s.symbol, day: b.d, why: "High and low do not fit the open and close." });
    if (b.v === 0) out.push({ symbol: s.symbol, day: b.d, why: "No shares traded that day." });
    if (i && Math.abs(b.c / s.bars[i - 1].c - 1) > 0.2) out.push({ symbol: s.symbol, day: b.d, why: "The price moved more than 20% in one day. Check for a split or a bonus." });
    if (i) {
      const k = splitLike(b.c / s.bars[i - 1].c);
      if (k) out.push({ symbol: s.symbol, day: b.d, why: `The price fell to about ${k} of the day before. That looks like a split or a bonus. Use prices that are adjusted for it.` });
    }
    if (i && b.d === s.bars[i - 1].d) out.push({ symbol: s.symbol, day: b.d, why: "The same day appears twice." });
  });
  const last = s.bars[s.bars.length - 1].d;
  if (last < latestDay) out.push({ symbol: s.symbol, day: last, why: `The newest price is ${last}, but other shares go to ${latestDay}.` });
  return out;
}
function marketIsFinished(now, lastBarDay) {
  const ist = new Date(now.getTime() + 330 * 6e4), day = ist.toISOString().slice(0, 10), mins = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return !(lastBarDay >= day && mins < 15 * 60 + 45);
}
function runForward(rates, universe, cfg) {
  const errs = validateStrategy(cfg.strategy);
  if (errs.length) throw new Error(errs[0]);
  const base = { ...DEFAULT_CONFIG, capitalPaise: cfg.capitalPaise, slippageBps: cfg.slippageBps ?? DEFAULT_CONFIG.slippageBps };
  const days = [...new Set(universe.flatMap((u) => u.bars.map((b) => b.d)))].sort();
  const lastDay = days[days.length - 1] ?? cfg.startDate;
  const now = runBacktest(rates, universe, cfg.strategy, { ...base, from: cfg.startDate });
  const back = days.filter((d) => d < cfg.startDate);
  const bt = back.length ? runBacktest(rates, universe, cfg.strategy, { ...base, to: back[back.length - 1] }) : null;
  const s = bt ? summarise(bt, cfg.capitalPaise) : null;
  const before = { period: back.length ? `${back[0]} to ${back[back.length - 1]}` : "no earlier prices", trades: bt?.trades.length ?? 0, winRatePct: s && s.stats.count ? s.stats.winRate * 100 : null, expectancyR: s && s.stats.rCount ? s.stats.expectancyR : null, netPaise: bt ? bt.trades.reduce((a, t) => a + t.netPaise, 0) : 0 };
  return { closed: now.trades.filter((t) => t.exitReason !== "end"), pending: now.pending ?? [], open: now.trades.filter((t) => t.exitReason === "end"), lastDay, before, strategyHash: strategyHash(cfg.strategy) };
}
var rs = (p) => (p / 100).toFixed(2);
var LOG_HEADER = ["trade_id", "mode", "symbol", "exchange", "product", "status", "opened_at", "entry_price", "entry_qty", "plan_stop", "closed_at", "exit_price", "costs", "net_pnl", "r_multiple", "exit_reason", "strategy_hash", "data_source"];
var tradeId = (hash, t) => `fw-${hash}-${t.symbol}-${t.entryDay}`;
function toLog(res, source) {
  const rows = [...res.closed.map((t) => [t, "closed"]), ...res.open.map((t) => [t, "open"])].sort((a, b) => a[0].entryDay + a[0].symbol < b[0].entryDay + b[0].symbol ? -1 : 1);
  const q = (v) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  return [LOG_HEADER.join(","), ...rows.map(([t, st]) => [tradeId(res.strategyHash, t), "forward", t.symbol, "NSE", "cnc", st, t.entryDay, rs(t.entryPaise), t.qty, rs(t.stopPaise), st === "closed" ? t.exitDay : "", st === "closed" ? rs(t.exitPaise) : "", st === "closed" ? rs(t.costsPaise) : "", st === "closed" ? rs(t.netPaise) : "", st === "closed" ? t.r.toFixed(2) : "", st === "closed" ? t.exitReason : "", res.strategyHash, source].map((x) => q(String(x))).join(","))].join("\n") + "\n";
}
var PENDING_HEADER = ["symbol", "action", "for_day", "note"];
function toPending(res, nextDay) {
  return [PENDING_HEADER.join(","), ...res.pending.map((o) => [o.symbol, o.action, nextDay, o.action === "buy" ? "Would buy at the next open" : "Would sell at the next open"].join(","))].join("\n") + "\n";
}
function nextTradingDay(after, closed = []) {
  const d = /* @__PURE__ */ new Date(after + "T00:00:00Z");
  do
    d.setUTCDate(d.getUTCDate() + 1);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6 || closed.includes(d.toISOString().slice(0, 10)));
  return d.toISOString().slice(0, 10);
}

// data/facts/nse-holidays-2026.json
var nse_holidays_2026_default = [
  {
    id: "nse_equity_weekday_holidays_2026",
    value: ["2026-01-15", "2026-01-26", "2026-03-03", "2026-03-26", "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28", "2026-06-26", "2026-09-14", "2026-10-02", "2026-10-20", "2026-11-10", "2026-11-24", "2026-12-25"],
    unit: "weekday dates when the NSE equity segment is closed in 2026",
    sourceUrl: "https://www.bajajbroking.in/nse-holidays",
    sourceName: "Bajaj Broking NSE holiday list 2026 (one source only; not yet checked against NSE's own circular)",
    verifiedOn: "2026-11-12",
    reviewEveryDays: 30,
    notes: "Used only to word a message and to name the next trading day. It never skips a data check. Another site lists 16 days and one lists 15, so compare with NSE's circular before relying on it."
  }
];

// tools/forward-test/cli.ts
var fail = (say, msg) => {
  say("Stopped: " + msg);
  return 1;
};
function runCli(argv, now, say = console.log, rates) {
  const ci = argv.indexOf("--config"), configPath = ci >= 0 ? argv[ci + 1] : void 0;
  if (!configPath) return fail(say, "Tell me the config file: npm run forward -- --config forward.config.json");
  const rebuild = argv.includes("--rebuild");
  let raw, strategy;
  const base = dirname(resolve(configPath));
  try {
    raw = JSON.parse(readFileSync(configPath, "utf8"));
  } catch {
    return fail(say, `Could not read the config file ${configPath}.`);
  }
  if (raw.dataSource !== "csvDir") return fail(say, 'dataSource must be "csvDir". Downloading prices is not built in. Save one file per share (SYMBOL.csv) in a folder and point csvDir at it.');
  try {
    strategy = JSON.parse(readFileSync(resolve(base, raw.strategyFile), "utf8"));
  } catch {
    return fail(say, "Could not read the strategy file.");
  }
  const bad = validateStrategy(strategy);
  if (bad.length) return fail(say, "The strategy file is not valid: " + bad[0]);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.startDate) || !Array.isArray(raw.symbols) || !raw.symbols.length || !(raw.capitalRupees > 0)) return fail(say, "The config needs startDate (YYYY-MM-DD), symbols and capitalRupees.");
  const out = resolve(base, raw.outDir), csvDir = resolve(base, raw.csvDir), log = join(out, "forward_log.csv"), statePath = join(out, "forward_state.json"), warnPath = join(out, "forward_warnings.log"), lockPath = join(out, "forward.lock");
  mkdirSync(out, { recursive: true });
  try {
    closeSync(openSync(lockPath, "wx"));
  } catch {
    return fail(say, "Another run is in progress (forward.lock exists). If you are sure none is, delete that file.");
  }
  try {
    const warn = (ps) => {
      appendFileSync(warnPath, ps.map((p) => `${now.toISOString()} ${p.symbol}${p.day ? " " + p.day : ""}: ${p.why}`).join("\n") + "\n");
      ps.slice(0, 8).forEach((p) => say(`  ${p.symbol}${p.day ? " " + p.day : ""}: ${p.why}`));
    };
    const hash = strategyHash(strategy);
    let prev = null;
    if (existsSync(statePath) && !rebuild) {
      try {
        prev = JSON.parse(readFileSync(statePath, "utf8"));
        if (!prev || typeof prev.strategyHash !== "string") throw 0;
      } catch {
        return fail(say, "forward_state.json is damaged. Nothing was changed. Run again with --rebuild to build it again from your price files.");
      }
      if (prev.strategyHash !== hash || prev.startDate !== raw.startDate) return fail(say, "The rule or the start date is different from the one this test began with. A forward test must keep one rule. Use a new outDir for a new test.");
    }
    const problems = [], universe = [];
    for (const sym of raw.symbols) {
      const f = join(csvDir, sym + ".csv");
      if (!existsSync(f)) {
        problems.push({ symbol: sym, why: "No price file found." });
        continue;
      }
      const r = parseBarsCsv(sym, readFileSync(f, "utf8"));
      problems.push(...r.problems);
      universe.push(r.series);
    }
    const latest = universe.flatMap((u) => u.bars.map((b) => b.d)).sort().pop() ?? "";
    for (const u of universe) problems.push(...checkSeries(u, latest));
    if (!latest) problems.push({ symbol: "all", why: "No prices were found." });
    if (problems.length) {
      warn(problems);
      return fail(say, `${problems.length} problem(s) with the price data. No trades were logged today.`);
    }
    if (!marketIsFinished(now, latest)) return fail(say, `The market closing bar for ${latest} may not be complete. Run again after 15:45 India time.`);
    const age = (now.getTime() - (/* @__PURE__ */ new Date(latest + "T00:00:00Z")).getTime()) / 864e5;
    if (age > 5) {
      warn([{ symbol: "all", day: latest, why: "The newest price is more than 5 days old." }]);
      return fail(say, "The price files look stale. No trades were logged today.");
    }
    const cfg = { strategy, startDate: raw.startDate, capitalPaise: Math.round(raw.capitalRupees * 100), slippageBps: raw.slippageBps, symbols: raw.symbols, source: "csvDir" };
    const res = runForward(rates ?? zerodha_equity_default, universe, cfg);
    writeFileSync(log, toLog(res, "csvDir"));
    const next = nextTradingDay(res.lastDay, nse_holidays_2026_default[0].value);
    writeFileSync(join(out, "forward_pending.csv"), toPending(res, next));
    writeFileSync(statePath, JSON.stringify({ version: 1, strategyHash: hash, strategyName: strategy.name, startDate: raw.startDate, lastDay: res.lastDay, source: "csvDir", open: res.open.map((t) => ({ symbol: t.symbol, entryDay: t.entryDay, entryPaise: t.entryPaise, qty: t.qty, stopPaise: t.stopPaise })), before: res.before }, null, 2) + "\n");
    say(`Done. Prices to ${res.lastDay}. Closed trades: ${res.closed.length}. Open now: ${res.open.length}.`);
    for (const t of res.open) say(`  open: ${t.symbol} ${t.qty} shares from ${t.entryDay}`);
    for (const o of res.pending) say(`  for ${next}: would ${o.action} ${o.symbol} at the open`);
    say(`The next trading day is ${next} (from a holiday list that has one source; check it against NSE).`);
    say("These are hypothetical. No order was placed anywhere.");
    return 0;
  } finally {
    try {
      unlinkSync(lockPath);
    } catch {
    }
  }
}

// tools/forward-test/main.ts
process.exit(runCli(process.argv.slice(2), /* @__PURE__ */ new Date()));
