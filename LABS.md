# Five Labs: Detailed Specifications

Status: DRAFT for owner review. Written 2026-11-11. Nothing is built yet.
Parent plan: [PLAN.md](PLAN.md). Read its constraints (section 3) first; they apply to every lab.

**Provisional values warning.** Every charge, rate and format below was gathered from a web search on 2026-11-11 and is **not verified** against the official page. The coding agent must verify each against the source, record it in `data/facts.json` with `verifiedOn`, and only then use it. Worked examples marked *(provisional)* must be recomputed from verified values.

## 0. Shared rules for all labs

- Pure logic lives in `packages/core` (no DOM). UI lives in `packages/ui`. The same core code is used by the UI, the tests and the Lab 5 script.
- All money is computed in **paise as integers** internally (or a decimal library); display rounds to 2 decimals. Never floating-point rupees for totals. Rounding rules are explicit and tested (see Lab 2).
- Each lab works offline, on 360 px width, keyboard-only, and stores state through the shared storage layer (PLAN.md 5.5).
- Each lab shows: inputs, the formula in words, step-by-step working with rupee figures, the result, and a "what this ignores" note.
- Every lab has: a worked example preloaded, a Reset button, an Export (CSV/JSON) button, and a "Used in chapters" list.
- Labs never call a broker or any network API at runtime.
- Dependencies between labs: Lab 2 (costs) is used by Labs 1, 4, 5. Lab 1 (sizing) is used by Labs 4, 5. Lab 3 (journal) is the shared record format for Labs 4, 5. **Build order (decided 2026-11-11): app shell and book first; Labs 2 and 1 (money core) and Tracks 0-2 content; then the Lab 3 journal MVP, started only after the owner approves pausing book work; then the remaining book tracks, Lab 4, and Lab 5.** Lab 3 should still keep manual entry of shares, risk and costs as a fallback beside the Lab 1/2 auto-fill, so the schema never depends on the other labs.

---

## Lab 1: Position-size calculator

**Purpose.** Turn "how much am I willing to lose" into "how many shares", before the trade, including costs and the cash limit.

**Used in chapters.** Position sizing; stop-loss distance; risk limits; the Rs 2-3k reality check; every strategy chapter.

### Inputs
| Input | Notes |
|---|---|
| Account capital (Rs) | Default Rs 50,000; accepts Rs 10,000 to Rs 10,00,000 |
| Risk per trade (%) | Default 1%; warns above 2%; hard note above 5% |
| Entry price (Rs) | Planned entry |
| Stop-loss price (Rs) | Must be below entry for a long; error otherwise |
| Product | CNC (delivery) by default; MIS shown only as a labelled comparison |
| Max position as % of capital | Default 25% (concentration cap, configurable) |
| Include costs | On by default (uses Lab 2 engine) |
| Slippage buffer (%) | Optional adverse move on exit; default 0 |
| Open risk already taken today/week | Optional; feeds the limit check |
| Daily / weekly / monthly loss limits (Rs) | Optional; from the risk-limits chapter defaults |

Long-only for v1 (cash-segment delivery). No short selling, no leverage, no F&O.

### Formulas (shown on screen)
1. Risk budget = capital x risk%.
2. Risk per share = entry - stop.
3. Raw shares = risk budget / risk per share, rounded **down**.
4. Cash cap shares = floor(capital / entry). Concentration cap shares = floor(capital x max position% / entry).
5. Shares = min(raw, cash cap, concentration cap). The tool states which cap bound.
6. Planned loss at stop = shares x risk per share.
7. True loss at stop = planned loss + round-trip costs at the stop price (+ slippage buffer if set).
8. Reward-to-risk R for a target price (optional) and break-even win rate = 1 / (1 + R).
9. Remaining daily/weekly/monthly limit after this trade, with a clear "do not trade" state if the trade would breach a limit.

### Worked examples (preload these)
1. **Standard.** Capital Rs 50,000, risk 1% = Rs 500. Entry Rs 250, stop Rs 240, risk per share Rs 10, shares = 500 / 10 = 50, position Rs 12,500 (25% of capital, exactly at the 25% cap), planned loss Rs 500.
2. **Small account.** Capital Rs 10,000, risk 1% = Rs 100. Same entry and stop: 100 / 10 = 10 shares, position Rs 2,500. Shows that a Rs 100 risk gives a small position.
3. **Tight stop, cash cap binds.** Capital Rs 10,000, entry Rs 250, stop Rs 248 (Rs 2 per share). Raw = 100 / 2 = 50 shares = Rs 12,500, more than the account. Cash cap = floor(10,000 / 250) = 40 shares; with a 25% cap it is 10 shares. The tool explains that a tighter stop does not mean a bigger position, and that very tight stops get hit by normal noise.
4. **Costs included *(provisional)*.** Example 1 at the stop: sell 50 x Rs 240 = Rs 12,000. Delivery costs on Rs 12,500 buy and Rs 12,000 sell are about Rs 42.60 (mostly Rs 24.50 STT and the Rs 15.34 DP charge). True loss at the stop is about Rs 542.60, i.e. 1.09% of capital, not 1.00%.
5. **R and break-even.** Target Rs 270: reward Rs 20, R = 2, break-even win rate = 1 / 3 = 33.3% before costs. Show how costs raise the break-even.

### Outputs and UI
- Result card: shares, position value, % of capital, planned loss, true loss, the binding constraint.
- A bar/ladder visual: entry, stop, target on a price axis; risk and reward zones shaded (not red/green only; pattern fills).
- "Sensitivity" strip: how shares change for stop distances Rs 2, 5, 10, 20.
- A "Reject" panel listing reasons a trade fails the rules (exceeds limit, position too concentrated, R below 1.5, stop above entry, costs over 5% of risk). Wording is neutral: the lab reports rule conflicts, it never says "good trade".
- Save-to-journal button: creates a planned trade (planned fields only) in Lab 3.

### Edge cases (must have tests)
Stop equal to or above entry; zero or negative inputs; entry below Rs 1; risk budget smaller than one share's risk (result 0 shares with an explanation); fractional results; Indian number formatting; extremely wide stops; costs larger than the risk budget; limits already exhausted.

### Acceptance criteria
- All five worked examples reproduce exactly (examples 4 recomputed from verified rates).
- Property test: for any valid input, `shares x riskPerShare <= riskBudget` and `shares x entry <= capital`.
- Costs match Lab 2 for the same trade.
- A user can complete the flow on a phone in under 30 seconds.
- No result is ever phrased as a recommendation.

---

## Lab 2: Cost calculator

**Purpose.** Show the true cost of a trade and the price move needed just to break even, using current published Zerodha charges.

**Used in chapters.** Costs; taxes; small-account economics; intraday risk case study; backtest realism.

### Scope
Equity cash segment on NSE and BSE: **delivery (CNC)** and **intraday (MIS)**. F&O and other segments are out of scope for v1, shown only as a "not covered here" note.

### Inputs
Buy price, sell price, quantity (or buy and sell values), product (CNC/MIS), exchange (NSE/BSE), and optionally a "trade is a sell-only leg" mode for DP charges when selling existing holdings.

### Charge model *(verified 2026-11-11 against zerodha.com/charges and the official calculator script; re-check every 90 days)*
| Component | Delivery (CNC) | Intraday (MIS) |
|---|---|---|
| Brokerage | Rs 0 | Lower of Rs 20 or 0.03% of turnover, per executed order |
| STT | 0.1% on buy and sell | 0.025% on sell only |
| Exchange transaction charge (NSE equity) | 0.00307% of turnover (0.00297% exchange + 0.0001% IPFT, each rounded to 2 decimals separately) | same |
| SEBI charge | Rs 10 per crore | Rs 10 per crore |
| Stamp duty | 0.015% on buy | 0.003% on buy |
| GST | 18% of (brokerage + SEBI charge + exchange transaction charge) | same |
| DP charge on sell | Rs 15.34 per scrip per day on sale, including GST (Rs 3.5 CDSL + Rs 9.5 Zerodha + GST) | none |

Verified facts (2026-11-11, read from https://zerodha.com/static/js/brokerage.js and checked against seven calculator screenshots):
- Rates live in `data/rates/zerodha-equity.json` (NSE 297 and IPFT 10 per crore, BSE 375 and IPFT 0), read by `packages/core/src/costs.ts`. The cost labs show the verified date and a stale warning after 90 days.
- Rounding: each charge is rounded to 2 decimals on its own (`f2`); STT and stamp duty use `Math.round` to whole rupees; GST = 18% of (brokerage + exchange + SEBI) after those roundings. MIS brokerage is the lower of Rs 20 or 0.03% per leg.
- The official calculator does **not** include the DP charge. Lab 2 shows the Rs 15.34 DP charge on delivery sells as a separate line, charged once on the first sell of a position, so totals match Zerodha's calculator plus a clearly labelled extra.

### Rounding and precision
Follow the official calculator's rounding (decide by comparing outputs; document the rule in the code). All intermediate values in paise or decimals. The lab shows each component to 2 decimals and a total that equals the sum of the displayed components (no off-by-one-paisa mismatch). Test this.

### Worked examples (preload; recompute from verified rates) *(provisional)*
1. **Delivery, Rs 5,000 buy and Rs 5,000 sell (no price change).** STT Rs 10.00, stamp Rs 0.75, exchange Rs 0.30, SEBI Rs 0.01, GST Rs 0.06, DP Rs 15.34, brokerage Rs 0. **Total about Rs 26.45, i.e. 0.53% of the Rs 5,000 position.** The price must rise about 0.53% just to break even. Lesson: on tiny trades the fixed DP charge dominates.
2. **Delivery, Rs 50,000 buy and sell.** STT Rs 100.00, stamp Rs 7.50, exchange Rs 2.97, SEBI Rs 0.10, GST Rs 0.55, DP Rs 15.34. **Total about Rs 126.46, i.e. 0.25% of the position.**
3. **Intraday, Rs 50,000 buy and sell.** Brokerage Rs 15 + Rs 15 (0.03% is below Rs 20), STT Rs 12.50, exchange Rs 2.97, SEBI Rs 0.10, stamp Rs 1.50, GST about Rs 5.95. **Total about Rs 53.02, i.e. 0.11%**, but doing this daily multiplies it: 250 days x Rs 53 is about Rs 13,000 a year on a Rs 50,000 account (26%) before any profit. Lesson used in the intraday risk case study.
4. **Cost drag on a strategy.** 10 round trips a month at the Rs 50,000 delivery figure is about Rs 1,265 a month, about 2.5% of capital, before taxes on gains. Feeds Lab 4's cost sensitivity.

### Outputs and UI
- Itemised table with the verified rate shown beside each line and the formula in words.
- Break-even price and break-even % move.
- "Cost as % of risk budget": ties to Lab 1.
- A comparison toggle: CNC vs MIS for the same trade.
- **Provenance banner:** "Rates verified on <date> from <source link>". If any fact is past its review window, show a prominent stale warning and still compute, labelled "may be outdated".
- Tax is **not** included in the per-trade total. A separate, clearly labelled estimate panel (optional, v1.1) may show capital-gains tax once the tax chapter is verified. Do not ship tax numbers unverified.
- "Compare to official calculator" link opens Zerodha's calculator in a new tab (online only; the lab itself never needs it).

### Acceptance criteria
- Golden tests: at least 12 trades (mixed CNC/MIS, small and large, NSE/BSE) match Zerodha's official calculator to the paisa, results recorded with date in the test file.
- Totals equal the sum of displayed lines in every case.
- Rates are read only from `data/facts.json`; changing a rate there changes results with no code change.
- Build fails if a cost fact is past its review window.
- Works fully offline.

---

## Lab 3: Trade journal and statistics dashboard

**Purpose.** Record each trade decision before and after it happens so the owner can judge both the strategy and their own discipline.

**Used in chapters.** Journaling; expectancy and drawdown; psychology; gates G4, G6; receives data from Labs 1, 4 and 5.

### Open item
The owner's original CSV header was cut off in the pasted brief. The field list below is **proposed**. If the owner supplies the original, replace it and keep the version number.

### Record: one row per trade (CSV schema `journal_v1`)
Planned (filled **before** entry; locked after entry is recorded):
`trade_id, mode (paper|live|forward|backtest|kite_demo), plan_date, symbol, side (long), setup_name, strategy_version, checklist_passed (Y/N), checklist_items (semi-colon list), thesis (why this trade), plan_entry, plan_stop, plan_exit_rule (text), plan_shares, plan_risk_inr, plan_risk_pct_of_capital, plan_r_multiple_target, capital_at_plan, emotion_before (tag), market_context (text)`

Executed (after):
`entry_date, entry_price, shares, entry_costs_inr, exit_date, exit_price, exit_reason (stop|trailing_stop|rule_exit|time|discretionary|error), exit_costs_inr, slippage_entry_inr, slippage_exit_inr`

Derived (computed, not typed): `gross_pnl_inr, total_costs_inr, net_pnl_inr, r_multiple, holding_days, plan_followed (Y/N, user-set with reason), rule_breaks (tags), emotion_after (tag), lesson (text)`

Rules: planned fields lock at entry (editable only with a visible "amended after entry" flag), because the point is comparing plan with outcome. `trade_id` is stable and unique (UUID or `<mode>-<date>-<symbol>-<n>`) so re-imports dedupe. Money stored in paise internally, exported as rupees with two decimals.

### Features
1. **Plan form** that pulls from Lab 1 (shares, risk) and Lab 2 (costs), with a pre-trade checklist the owner configures (default items from the strategy chapter).
2. **Execution form** to complete a trade; supports partial exits as multiple exit rows linked by `trade_id`.
3. **Import:** `journal_v1` CSV (Lab 5, Lab 4 export, backups) with a preview and conflict table before merge. **Optional importer** for Zerodha Console tradebook CSV for real trades (columns to be verified against a current export). Imported real trades are labelled `live`.
4. **Export:** CSV and full JSON backup.
5. **Filters:** by mode, date range, setup, symbol. Paper, forward, backtest and live results are **never blended by default**; the dashboard shows the mode in a visible label on every chart and number.
6. **Review prompts:** weekly review form (what went well, rule breaks, one change to make).

### Replaces the spreadsheet; sharing across devices without a server
The journal is a full in-app tool (forms, charts, statistics), not a CSV you edit by hand. CSV export stays only as an escape hatch (for Excel, or to keep an independent copy). Every record also carries `updated_at` (UTC timestamp) and `device_id` (random id created per install).

- **Backup and transfer:** one-tap export of a versioned JSON backup (or CSV). On phones and tablets use the Web Share sheet where supported (AirDrop, WhatsApp to self, email, Files, Google Drive, iCloud Drive); on desktop a normal download. Import accepts the same file on any device.
- **Merge, not overwrite:** importing a backup from another device merges by `trade_id`. If both devices changed the same trade, the newer `updated_at` wins and the older version is kept in a per-trade history; a conflict screen lists every difference before anything changes. Deleted trades are recorded as tombstones so a deletion is not undone by an old import.
- **Optional auto-save to a synced folder (desktop Chromium only):** with the File System Access API the owner can pick a folder inside iCloud Drive, Google Drive or Dropbox; the app writes the backup there after each change. This is not available on iOS Safari or Firefox, so it is an extra, never a requirement, and the app must say clearly where it does not work.
- **Honest limits:** this is manual or folder-based sync, not live sync. Two devices edited at once offline will need the merge screen. The app shows "last backup" and "last imported from <device>" and reminds the owner to back up (default every 14 days, and after every 10 new trades).
- **Privacy:** nothing is uploaded by the app. Backups contain trade data; the app offers optional passphrase encryption of the backup file (Web Crypto, AES-GCM) before it goes to any cloud folder or message.

Acceptance additions: export on device A, import on device B, edit on both, merge produces the expected result per fixtures; tombstones tested; encrypted backup round-trips and fails cleanly with a wrong passphrase.

### Dashboard statistics (all computed in `packages/core`, each with a plain-language tooltip and a "limitations" note)
- Trade count, win rate, average win, average loss, payoff ratio.
- **Expectancy** in rupees and in R per trade = (win rate x average win) - (loss rate x average loss).
- Profit factor = gross profit / gross loss (shows "undefined" with no losses).
- Equity curve (net of costs), drawdown curve, **max drawdown** in rupees and %, longest drawdown duration.
- Longest winning and losing streaks.
- **Plan adherence %** and a list of rule breaks by category (the discipline metric).
- Cost drag: gross vs net P&L.
- Daily/weekly/monthly P&L against the configured loss limits; **limit-breach log**; "trading stop" state banner after a breach.
- Confidence note: below 30 trades show "too few trades to conclude anything" and widen with a bootstrap confidence band on expectancy. Sharpe ratio optional, off by default, with its limitations stated.
- Distribution histogram of R-multiples.

### Edge cases
Open trades excluded from realised stats but shown in open-risk; trades spanning splits flagged; zero-loss and zero-win datasets; very large imports (10,000 rows) stay responsive; timezone is IST everywhere; duplicate imports; malformed CSV rows reported with row numbers, never silently dropped.

### Acceptance criteria
- Round trip: export CSV, wipe the app, import, and statistics match exactly.
- Hand-computed fixtures for 10 sample trades match every statistic to the paisa.
- Importing the Lab 5 sample output and a Lab 4 export succeeds with no manual edits.
- Mode separation: a unit test proves backtest and live rows never appear in the same aggregate unless the user selects both.
- Planned-field lock works and amendments are flagged.
- Usable offline on a phone; entering a plan takes under 60 seconds.

---

## Lab 4: Backtester with costs, walk-forward and out-of-sample splits

**Purpose.** Show how a rule-based strategy would have behaved on past data, including costs, and teach why backtests lie.

**Used in chapters.** Testing track; strategy chapter; gate G5.

### Data
1. **Bundled synthetic data (default).** A seeded generator (`data/synthetic/`) producing daily OHLCV for about 30 fictional tickers over about 10 years: regime switching (uptrend, downtrend, range), volatility clustering, fat-tailed returns, overnight gaps, circuit-limit clipping, a few corporate actions (splits), and **delisted tickers** (for the survivorship demo). Output is deterministic from a seed; the seed is displayed and exportable. Shipped as compressed JSON (a few MB). Reason: no licence risk and bias demos can be planted deliberately.
2. **User-imported real data** through source adapters:
   - Yahoo Finance CSV (`Date, Open, High, Low, Close, Adj Close, Volume`; NSE symbols end in `.NS`).
   - NSE bhavcopy-style files (UDiFF-era column names such as `TckrSymb, OpnPric, HghPric, LwPric, ClsPric, TtlTradgVol`; **verify current layout and NSE terms before documenting as supported**).
   - Generic CSV with a column-mapping screen (map date, OHLC, volume; choose date format; choose adjusted or unadjusted).
   Adapters live in `packages/core/adapters/`, each with fixtures and tests, and are selected by sniffing headers with manual override.
3. **In-app "Get your data" guide** per source: where to download, which file to choose, what the columns mean, how to name files, known pitfalls (unadjusted splits, missing days, stale symbols), and the licence notice (personal use only; the app never uploads or redistributes your files).
4. Import validation: sorted dates, duplicate dates, gaps over N days, zero or negative prices, OHLC consistency (low <= open,close <= high), suspicious jumps over 20% without a flagged split, volume zero. Errors listed with row numbers; the owner chooses fix or exclude.

Imported data is stored in IndexedDB, local only, with size shown and a delete button.

### Engine rules (the realism contract)
- **Timing:** a signal is evaluated on the close of day t using data up to and including t. The order fills at the **open of day t+1**. Never same-bar fills.
- **Stops:** checked against the day's low (long). If the open gaps below the stop, the fill is at the **open**, not at the stop price (gap risk is modelled). Trailing stops update at the close and apply from the next day.
- **Costs:** every fill goes through the Lab 2 engine (CNC by default). Optional slippage: fixed basis points or a fraction of ATR, each side.
- **Sizing:** every entry uses the Lab 1 rules (risk %, cash cap, concentration cap). No leverage. Max concurrent positions configurable. If cash is insufficient the signal is skipped and logged.
- **Universe and data:** warm-up period for indicators; missing bars skip the day; delisted symbols stop trading at their last bar (loss realised at the last price, configurable).
- **Determinism:** same data, same config, same seed gives the same result. Every run saves a manifest (data hash, strategy JSON, parameters, engine version).
- Runs in a Web Worker; progress bar; cancel button.

### Strategy interface
Strategies are **declarative JSON** (`strategy_v1`) so Lab 4 and the Lab 5 script share one definition:
```
{ "id", "version", "name",
  "indicators": [ {"name":"sma","period":50}, {"name":"donchianHigh","period":55}, {"name":"atr","period":14} ],
  "entry": { "all": [ {"close">"donchianHigh[1]"}, {"close">"sma50"} ] },
  "stop": { "type":"atr", "multiple":2.5 },
  "exit": { "type":"trailing_atr", "multiple":3 },
  "sizing": { "riskPct":1 },
  "filters": { "minPrice":50, "minAvgTurnoverInr":5e7 } }
```
Exact expression grammar is defined in M5 with a parser, schema and tests; no `eval`. Built-ins shipped: (1) buy-and-hold benchmark, (2) moving-average crossover, (3) N-day breakout with ATR stop and trailing exit (the book's Track 6 strategy is finalised in M6 and replaces/extends this). Custom JSON can be pasted by the owner.

### Experiments (each is a guided "lab bench" with explanation)
1. **Split testing:** in-sample / out-of-sample (default 70/30 by time, never shuffled). Result tables side by side with a clear "out-of-sample is the honest number" note.
2. **Walk-forward:** rolling train/test windows (default 3 years train, 1 year test); parameters chosen on train, evaluated only on the following test window; stitched out-of-sample equity curve.
3. **Look-ahead bias demo:** toggle "peek": signal uses the same bar's close to fill at that close, or uses future data. Show the inflated result next to the honest one.
4. **Survivorship bias demo:** run on survivors only vs the full universe including delisted tickers; show the difference.
5. **Overfitting demo:** parameter grid search on in-sample data (heat map of results), then the "best" parameters on out-of-sample. Show the collapse, and the number of combinations tried.
6. **Cost and slippage sensitivity:** slider from 0 to 3x the verified costs; net result and break-even cost level.
7. **Trade-order Monte Carlo:** resample or shuffle the trade sequence 1,000+ times; show distribution of max drawdown and longest losing streak, the probability of ruin for the chosen risk %. Feeds the streak-simulator chapter and gate G4.
8. **Regime view:** results split by synthetic regime to show a trend strategy loses in ranges.

### Metrics (each with limitations tooltip)
Trades, win rate, average win/loss, payoff ratio, expectancy (Rs and R), profit factor, CAGR, max drawdown (Rs, %), drawdown duration, longest losing streak, exposure %, gross vs net, cost drag, benchmark comparison, Sharpe (risk-free configurable, default 0, labelled as a weak metric for skewed returns). Every results page carries the banner: **"Hypothetical backtest. Not live results."**

### Outputs
Equity curve, drawdown curve, trade list (exportable as `journal_v1` with mode `backtest`), per-trade chart replay (candles with entry, stop, exit marks), run history with comparison of two runs.

### Edge cases
No trades generated; one trade; all losers; split-adjusted vs unadjusted mismatch; data starting after the warm-up; identical open and stop; symbols with sparse data; extreme gaps hitting circuit limits; very long runs on phones (chunked in worker); changing the seed.

### Acceptance criteria
- Hand-verified fixture: a 20-bar toy dataset with a known entry, gap-through-stop, trailing exit and costs reproduces exact trade P&L.
- Bias demos produce the expected ordering on the bundled seed (honest result is lower than look-ahead result; survivors-only is higher than full universe; the best in-sample parameters underperform out-of-sample). Seed chosen and documented so this is stable.
- Same config and seed produce byte-identical results in two runs and across Chrome, Safari (WebKit) and Firefox.
- 5 years of daily data on one symbol backtests in under 1 s on a mid-range phone; 30 symbols in under 10 s with a progress bar.
- Imports Yahoo CSV and generic CSV fixtures successfully; bad files give row-level errors.
- Walk-forward windows never overlap train and test (tested).
- No data leaves the device.

---

## Lab 5: Forward-test script and importer

**Purpose.** Test a fixed strategy on **unseen real prices** by logging hypothetical trades day by day. It places no orders and holds no credentials. This is the honest check that a backtest cannot give.

**Used in chapters.** Testing track (paper and forward testing); gate G6.

### Two parts
1. **`tools/forward-test/`: a Node/TypeScript command-line script** the owner runs on their laptop once per trading day after market close (about a minute). It imports `packages/core` so strategy logic is identical to Lab 4.
2. **`<lab-forward-import>` in the app:** imports the script's output into the Lab 3 journal and shows forward-test statistics. The app itself stays offline.

### Script behaviour
Command: `npm run forward -- --config forward.config.json`

Config: strategy file (`strategy_v1` JSON, same as Lab 4), watchlist of symbols (default 10 liquid large-cap NSE symbols the owner chooses), capital for sizing (a hypothetical figure, e.g. Rs 50,000), data source (`yahoo` or `csvDir`), output directory, risk limits.

Daily run:
1. Load `forward_state.json` (open hypothetical positions, pending orders, last processed date).
2. Fetch end-of-day bars for the watchlist since the last processed date (`yahoo-finance2` with `.NS` symbols, or read files from `csvDir` through the Lab 4 adapters).
3. For each new trading day in order (so missed days are backfilled): fill pending entries at that day's **open**; evaluate stops and trailing exits using the day's high and low (gap through stop fills at open); apply costs and slippage via Lab 2/Lab 4 rules; evaluate entry signals on that day's close and create **pending orders for the next open**; apply risk limits (daily/weekly/monthly, max positions) and skip with a logged reason if breached.
4. Append rows to `forward_log.csv` in `journal_v1` format with `mode=forward`; rewrite `forward_state.json`; append warnings to `forward_warnings.log`.
5. Print a short summary: new fills, exits, pending orders for tomorrow, open positions, limit status.

Properties:
- **Idempotent:** running twice for the same day gives identical files. Reruns never duplicate trade ids.
- **Fail closed:** if data is missing, stale (last bar older than expected), or fails sanity checks (jump over 20%, zero volume, OHLC inconsistent), the script logs a warning, takes **no** new hypothetical trades that day, and exits with a non-zero code.
- **No orders, no broker libraries, no credentials, no network except the chosen data fetch.** A unit test asserts the dependency list contains no broker SDK.
- Corporate actions: Yahoo data is split-adjusted but price-history changes after a split; the script detects discontinuities against stored prior closes, flags the symbol, and pauses it until the owner reviews.
- Market calendar: trading days come from the verified holiday list in the facts registry plus "no new bar" detection; weekends and holidays are no-ops.
- Time: runs only after the cash market close (IST) plus a safety margin, otherwise refuses with an explanation (a half-day's incomplete data must not be treated as a close). Close time and hours come from the facts registry.
- Reproducible: output records strategy JSON hash and data source for each row.

Scheduling guide (documented, optional): macOS `launchd`, Linux cron, Windows Task Scheduler, plus "just run it by hand". Not required.

### Importer in the app
Drag/drop or file picker for `forward_log.csv` and `forward_state.json`; preview with new/duplicate/changed counts; merge into Lab 3 with `mode=forward`; dashboard view comparing forward results to the backtest of the **same strategy and period overlap** (never the whole history), with a note that fills at next open are an assumption that real trading may not achieve.

### Honesty notes (shown in the UI)
Hypothetical fills at the next open assume the order executes at the open price; real fills differ (spread, queue position, gaps). Yahoo data is not exchange-official and can have errors or revisions. A short forward test proves little; 30 trades is a floor, not a verdict.

### Edge cases
Missed week then run; symbol delisted or renamed; partial data for some symbols; day with no signals; clock or timezone differences on the laptop; a corrupted state file (script refuses and offers to rebuild from the log); two runs in parallel (lock file).

### Acceptance criteria
- On a recorded fixture of 10 trading days of bars, the script produces a log byte-identical to the committed expected output.
- Re-running the same day changes nothing; backfilling a skipped day yields the same result as having run daily.
- Parity test: for the same bars and strategy JSON, the script's trades equal Lab 4's trades for that period.
- Failure tests: stale data, bad OHLC, network failure, corrupted state all fail closed with clear messages.
- Importer merges the sample output into the journal with no manual edits and no duplicates on re-import.
- Runs for 5 consecutive real trading days on the owner's machine without manual intervention (M7 acceptance).
- No credentials, no broker packages, no order endpoints anywhere in the repo (checked by a local `make check` grep).

---

## Cross-lab test matrix

| Concern | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| Golden/hand-checked fixtures | yes | yes (vs official calculator) | yes | yes | yes |
| Property tests | yes | totals = sum of lines | stats invariants | determinism | idempotence |
| Offline e2e | yes | yes | yes | yes | importer only |
| Mobile 360 px | yes | yes | yes | yes | yes |
| Facts freshness check | uses L2 | owns it | no | uses L2 | uses L2 and calendar |
| No network at runtime | yes | yes | yes | yes | data fetch only (script) |

## Suggested order of work for the coding agent
1. M0 scaffold, storage, backup, PWA. **Done.**
2. M1 **(done)**: `core/costs` + Lab 2 (golden tests against the official calculator first), then `core/sizing` + Lab 1.
3. M2: Tracks 0-2 content (book).
4. M3 **(journal built, including weekly review; auto-fill from Labs 1 and 2 and the Console importer still open)**: journal schema, `core/stats`, Lab 3 MVP with auto-fill from Labs 1 and 2. **Ask the owner for approval before starting; do not divert from book work on your own.**
5. Synthetic generator, adapters, indicators, backtest engine, Lab 4.
6. Strategy spec finalised, `tools/forward-test`, Lab 5 (and the journal's forward-import).

Each step ends with passing tests and an offline-verified build.
