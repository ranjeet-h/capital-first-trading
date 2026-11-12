// Every experiment by name, as plain data in and plain data out, so it can run in a Web Worker or on the page itself.
import type { Rates } from "../costs";
import { splitTest, walkForward, lookAheadDemo, survivorshipDemo, costSensitivity, overfitDemo, monteCarlo } from "./experiments";
import { regimeBreakdown } from "./replay";
import type { BtTrade, Config, Series, Strategy } from "./types";

export type ExpKey = "split" | "lookahead" | "survivor" | "cost" | "overfit" | "walk" | "mc" | "regime";
export interface ExpArgs { rates: Rates; universe: Series[]; strategy: Strategy; cfg: Config; seed: number; trades: BtTrade[] }

export function computeExperiment(key: ExpKey, a: ExpArgs): unknown {
  switch (key) {
    case "split": return splitTest(a.rates, a.universe, a.strategy, a.cfg);
    case "lookahead": return lookAheadDemo(a.rates, a.universe, a.strategy, a.cfg);
    case "survivor": return survivorshipDemo(a.rates, a.universe, a.strategy, a.cfg);
    case "cost": return costSensitivity(a.rates, a.universe, a.strategy, a.cfg);
    case "overfit": return overfitDemo(a.rates, a.universe, a.strategy, a.cfg);
    case "walk": return walkForward(a.rates, a.universe, a.strategy, a.cfg);
    case "mc": return monteCarlo(a.trades, a.cfg.capitalPaise, a.seed);
    case "regime": return { rows: regimeBreakdown(a.trades, a.universe) };
  }
}
