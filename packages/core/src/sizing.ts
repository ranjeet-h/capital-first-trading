// Lab 1 engine: position size for a long, cash-segment trade. Integer paise throughout.
import { computeCosts, type Exchange, type Product, type Rates } from "./costs";

export interface SizingInput {
  capitalPaise: number;
  riskPercent: number;           // e.g. 1 means 1%
  entryPaise: number;
  stopPaise: number;             // must be below entry
  targetPaise?: number;
  product: Product;
  exchange: Exchange;
  maxPositionPercent: number;    // concentration cap, e.g. 25
  includeCosts: boolean;
  slippagePercent?: number;      // adverse move on the stop exit
}

export type Binding = "risk" | "concentration" | "cash" | "none";
export interface SizingResult {
  ok: boolean;
  errors: string[];
  shares: number;
  positionPaise: number;
  positionPercent: number;
  riskBudgetPaise: number;
  lossPerSharePaise: number;     // entry - effective stop exit (after slippage)
  plannedLossPaise: number;      // shares x lossPerShare
  costsAtStopPaise: number;
  trueLossPaise: number;         // planned loss + costs, if the stop is hit
  binding: Binding;
  rewardToRisk?: number;
  warnings: string[];
}

const empty = (errors: string[]): SizingResult => ({
  ok: false, errors, shares: 0, positionPaise: 0, positionPercent: 0, riskBudgetPaise: 0,
  lossPerSharePaise: 0, plannedLossPaise: 0, costsAtStopPaise: 0, trueLossPaise: 0, binding: "none", warnings: [],
});

export function validateSizing(i: SizingInput): string[] {
  const e: string[] = [];
  const pos = (n: number) => Number.isFinite(n) && n > 0;
  if (!pos(i.capitalPaise)) e.push("Capital must be more than zero.");
  if (!pos(i.riskPercent)) e.push("Risk per trade must be more than zero.");
  if (!pos(i.entryPaise)) e.push("Entry price must be more than zero.");
  if (!pos(i.stopPaise)) e.push("Stop-loss price must be more than zero.");
  if (pos(i.entryPaise) && pos(i.stopPaise) && i.stopPaise >= i.entryPaise)
    e.push("For a long trade, the stop-loss must be below the entry price.");
  if (!pos(i.maxPositionPercent)) e.push("Maximum position size must be more than zero.");
  if (i.targetPaise !== undefined && i.targetPaise <= i.entryPaise) e.push("The target must be above the entry price.");
  return e;
}

function costsAtStop(r: Rates, i: SizingInput, shares: number, exitPaise: number): number {
  if (!i.includeCosts || shares < 1) return 0;
  return computeCosts(r, { buyPricePaise: i.entryPaise, sellPricePaise: Math.max(1, exitPaise), quantity: shares, product: i.product, exchange: i.exchange, dpCharge: i.product === "cnc" }).totalPaise;
}

export function sizePosition(rates: Rates, i: SizingInput): SizingResult {
  const errors = validateSizing(i);
  if (errors.length) return empty(errors);
  const warnings: string[] = [];
  const budget = Math.floor((i.capitalPaise * i.riskPercent) / 100);
  const slip = Math.round((i.stopPaise * (i.slippagePercent ?? 0)) / 100);
  const exitPaise = i.stopPaise - slip;
  const lossPerShare = i.entryPaise - exitPaise;
  const cashCap = Math.floor(i.capitalPaise / i.entryPaise);
  const concCap = Math.floor((i.capitalPaise * i.maxPositionPercent) / 100 / i.entryPaise);
  let riskShares = Math.floor(budget / lossPerShare);
  // Costs make the true loss bigger, so shrink until planned loss + costs fits the budget.
  while (riskShares > 0 && riskShares * lossPerShare + costsAtStop(rates, i, riskShares, exitPaise) > budget) riskShares--;
  const shares = Math.max(0, Math.min(riskShares, concCap, cashCap));
  const binding: Binding = shares === 0 ? "none" : shares === riskShares ? "risk" : shares === concCap && concCap <= cashCap ? "concentration" : "cash";
  const cost = costsAtStop(rates, i, shares, exitPaise);
  const planned = shares * lossPerShare;
  const position = shares * i.entryPaise;
  if (shares === 0) warnings.push("The risk budget is smaller than the loss on a single share. Zero shares fit these rules.");
  if (i.riskPercent > 5) warnings.push("Risk per trade above 5% is very high.");
  else if (i.riskPercent > 2) warnings.push("Risk per trade above 2% is higher than most rule sets allow.");
  if (shares > 0 && i.includeCosts && cost * 20 > budget) warnings.push("Costs are more than 5% of your risk budget.");
  let rr: number | undefined;
  if (i.targetPaise !== undefined && lossPerShare > 0) {
    rr = (i.targetPaise - i.entryPaise) / lossPerShare;
    if (rr < 1.5) warnings.push("Reward to risk is below 1.5.");
  }
  return {
    ok: true, errors: [], shares, positionPaise: position,
    positionPercent: (position / i.capitalPaise) * 100, riskBudgetPaise: budget,
    lossPerSharePaise: lossPerShare, plannedLossPaise: planned, costsAtStopPaise: cost,
    trueLossPaise: planned + cost, binding, rewardToRisk: rr, warnings,
  };
}
