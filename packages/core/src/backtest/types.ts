export interface Bar { d: string; o: number; h: number; l: number; c: number; v: number } // prices in paise
export interface Series { symbol: string; bars: Bar[]; /** True when the share stopped trading before the data ends. */ delisted: boolean; regimes?: number[] }

export type StrategyType = "buy_and_hold" | "sma_cross" | "breakout";
/** strategy_v1: a plain description of a rule set. It is data, never code. */
export interface Strategy {
  version: 1; name: string; type: StrategyType;
  fast?: number; slow?: number;          // sma_cross
  lookback?: number;                     // breakout: highest high of the last N days
  atrPeriod: number; stopAtr: number;    // first stop-loss = entry minus this many ATRs
  trailAtr?: number;                     // trailing stop distance in ATRs (breakout)
  riskPct: number;                       // percent of money risked per trade
  maxPositions: number;
}
export interface Config {
  capitalPaise: number;
  slippageBps: number;                   // each side
  costMult: number;                      // 1 = the real Zerodha costs
  fillAt: "next_open" | "same_close";    // same_close is the look-ahead mistake, for the demo only
  from?: string; to?: string;            // trade only inside this window (indicators still use earlier data)
}
export interface BtTrade {
  symbol: string; entryDay: string; exitDay: string; entryPaise: number; exitPaise: number; qty: number;
  stopPaise: number; grossPaise: number; costsPaise: number; netPaise: number; plannedRiskPaise: number; r: number;
  exitReason: "stop" | "signal" | "delisted" | "end";
}
export interface RunResult { trades: BtTrade[]; equity: { d: string; v: number }[]; skipped: { d: string; symbol: string; why: string }[]; exposure: number }
export const DEFAULT_CONFIG: Config = { capitalPaise: 10_000_000, slippageBps: 5, costMult: 1, fillAt: "next_open" };
