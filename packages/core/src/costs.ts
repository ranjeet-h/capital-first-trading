// Lab 2 engine: Zerodha equity cash-segment charges. All money is integer paise.
export type Product = "cnc" | "mis";
export type Exchange = "NSE" | "BSE";

export interface Rates {
  id: string; source: string; verifiedOn: string; reviewEveryDays: number;
  brokerage: { cnc: { type: "zero" }; mis: { type: "lower_of"; flatPaise: number; percentPerCrore: number } };
  sttPerCrore: Record<Product, { buy: number; sell: number }>;
  exchangePerCrore: Record<Exchange, number>;
  ipftPerCrore: Record<Exchange, number>;
  sebiPerCrore: number;
  stampPerCrore: Record<Product, number>;
  gstPercent: number;
  dpSellPaise: { total: number };
}

export interface TradeInput {
  buyPricePaise: number; sellPricePaise: number; quantity: number;
  product: Product; exchange: Exchange;
  /** Charge DP fee on the sell (delivery sells). Default true for cnc, never for mis. */
  dpCharge?: boolean;
}

export interface CostLine { key: string; label: string; paise: number }
export interface CostResult {
  buyValuePaise: number; sellValuePaise: number;
  lines: CostLine[]; totalPaise: number;
  grossPnlPaise: number; netPnlPaise: number;
  breakEvenPricePaise: number; breakEvenPercent: number;
}

// This engine mirrors the arithmetic of Zerodha's own calculator script (zerodha.com/static/js/brokerage.js,
// read 2026-11-11) so results match it to the paisa: each charge is rounded to 2 decimals with JavaScript's
// toFixed rules, STT and stamp duty are rounded to whole rupees, and the DP charge is shown separately.
const CRORE = 10_000_000;
const f2 = (x: number) => parseFloat(x.toFixed(2));
const toPaise = (rupees: number) => Math.round(rupees * 100);

function brokerageForOrder(r: Rates, product: Product, valueRs: number): number {
  if (product === "cnc") return 0;
  const b = r.brokerage.mis;
  const pctPart = valueRs * (b.percentPerCrore / CRORE);
  return pctPart > b.flatPaise / 100 ? b.flatPaise / 100 : f2(pctPart);
}

function costLines(r: Rates, t: TradeInput): CostLine[] {
  const bp = t.buyPricePaise / 100, sp = t.sellPricePaise / 100, qty = t.quantity;
  const buyV = bp * qty, sellV = sp * qty;
  const turnover = f2((bp + sp) * qty);
  const brokerage = f2(brokerageForOrder(r, t.product, buyV) + brokerageForOrder(r, t.product, sellV));
  const sb = r.sttPerCrore[t.product].buy / CRORE, ss = r.sttPerCrore[t.product].sell / CRORE;
  const stt = Math.round(f2(sb === ss ? turnover * ss : buyV * sb + sellV * ss));
  const sebi = f2(turnover * (r.sebiPerCrore / CRORE));
  const exch = f2(f2(turnover * (r.exchangePerCrore[t.exchange] / CRORE)) + (r.ipftPerCrore[t.exchange] ? f2(turnover * (r.ipftPerCrore[t.exchange] / CRORE)) : 0));
  const gst = f2((r.gstPercent / 100) * (brokerage + exch + sebi));
  const stamp = Math.round(f2(buyV * (r.stampPerCrore[t.product] / CRORE)));
  const dp = (t.dpCharge ?? t.product === "cnc") ? r.dpSellPaise.total : 0;
  return [
    { key: "brokerage", label: "Brokerage", paise: toPaise(brokerage) },
    { key: "stt", label: "STT", paise: toPaise(stt) },
    { key: "exchange", label: "Exchange transaction charge", paise: toPaise(exch) },
    { key: "sebi", label: "SEBI charge", paise: toPaise(sebi) },
    { key: "stamp", label: "Stamp duty", paise: toPaise(stamp) },
    { key: "gst", label: "GST", paise: toPaise(gst) },
    { key: "dp", label: "DP charge (on sell)", paise: dp },
  ];
}
const sum = (lines: CostLine[]) => lines.reduce((s, l) => s + l.paise, 0);

export function computeCosts(r: Rates, t: TradeInput): CostResult {
  if (![t.buyPricePaise, t.sellPricePaise, t.quantity].every((n) => Number.isInteger(n) && n > 0))
    throw new RangeError("prices (paise) and quantity must be positive integers");
  const buy = t.buyPricePaise * t.quantity, sell = t.sellPricePaise * t.quantity;
  const lines = costLines(r, t);
  const totalPaise = sum(lines);
  const grossPnlPaise = sell - buy;
  // Break-even: smallest sell price (paise) whose net P&L is >= 0 for the same quantity.
  let be = t.buyPricePaise;
  while (sum(costLines(r, { ...t, sellPricePaise: be })) > (be - t.buyPricePaise) * t.quantity) be++;
  return {
    buyValuePaise: buy, sellValuePaise: sell, lines, totalPaise, grossPnlPaise,
    netPnlPaise: grossPnlPaise - totalPaise, breakEvenPricePaise: be,
    breakEvenPercent: ((be - t.buyPricePaise) / t.buyPricePaise) * 100,
  };
}

/** Staleness check used by the build and the UI banner. */
export function ratesAreStale(r: Pick<Rates, "verifiedOn" | "reviewEveryDays">, today: Date): boolean {
  const days = (today.getTime() - new Date(r.verifiedOn + "T00:00:00Z").getTime()) / 86_400_000;
  return days > r.reviewEveryDays;
}
