# Tracks 7-10: Chapter Specifications

Status: DRAFT for reviewer. Written 2026-11-11 from [PLAN.md](../PLAN.md), [LABS.md](../LABS.md) and the curriculum brief.
Scope: Track 7 (Testing and validation, T7.1-T7.11), Track 8 (Psychology and journaling, T8.1-T8.7), Track 9 (Advanced, theory only, T9.1-T9.7), Track 10 (Graduation gates, T10.1-T10.7).

Rules that apply to every chapter here:
- No value in this file is verified. Charges, tax rates, SEBI rules, market timings, circuit limits, holidays, lot sizes, margin rates, study figures and framework dates appear only as `[VERIFY: ...]` or as a fact name to register.
- Rupee figures are hypothetical and labelled as such unless they are plain arithmetic the reader can check.
- Nothing here recommends a stock, a strategy or a trade. No result is described as guaranteed, likely or "good".
- Lab costs and rates come from the facts registry (`data/facts.json`) only. This file never restates them.

---

## Track 7: Testing and validation

**Purpose.** Teach how to test a rule-based idea honestly before any money is at risk: what a backtest can show, what it cannot, and where each bias hides.

**Order.** T7.1 idea to hypothesis, then T7.2 data and T7.3 the engine's realism rules, then the three biases (T7.4 look-ahead, T7.5 survivorship, T7.6 overfitting), then validation method (T7.7 out-of-sample and walk-forward, T7.8 metrics, T7.9 trade-order Monte Carlo), then forward and paper evidence (T7.10), then the assessment (T7.11, gate G5 prep).

**How it serves the owner's goals.** The owner does not yet know whether a low-win-rate, trend-following style fits them. This track replaces assumption with a losing-streak and drawdown test, and makes clear that a backtest is a hypothesis check, not proof of profit. It feeds gates G5 and G6.

### T7.1 From idea to hypothesis to test plan
- **Page type:** Concept
- **Prerequisites:** T6.2, T6.4
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can rewrite a vague trading idea as a hypothesis with an explicit entry, exit and sizing rule.
  - After this chapter the reader can explain the three possible results of a test (supported, not supported, inconclusive) and what each does and does not allow.
  - After this chapter the reader can write a test plan (data, period, costs, metrics, pass or fail rules) before any results are seen.
  - After this chapter the reader can reject an idea that cannot be tested or disproved.
- **Key ideas to teach (in order):**
  - An idea is a feeling about the market. A hypothesis is a rule that can be wrong.
  - Falsifiable: state the result that would make you drop the idea.
  - Fix the pass or fail rules before looking at data. Changing them afterwards is the most common way to fool yourself.
  - The test plan fields: universe, data source, period, split, entry, stop, exit, sizing, costs, metrics, pass or fail rule, number of variants tried.
  - A passed test is weak evidence. It means the idea survived one test, nothing more.
- **Worked example (rupees):** Idea: "stocks that make new highs keep going up." Hypothesis: "Buy at the next open after a close above the prior 55-day high; stop at 2.5 x ATR(14) below entry; trail the stop at 3 x ATR; risk 1% of Rs 50,000 = Rs 500 per trade; costs from Lab 2; expectancy after costs must be above zero over the held-out period." The test plan lists one hypothesis and a pass rule. Show that the same idea with the pass rule changed after results is a different, untested idea.
- **Visual / animation / simulator:** Static Mermaid flow: idea, hypothesis, test plan, one run, record result, decide. No interactive component.
- **Guided exercise:** Turn three vague ideas into hypotheses.
  - Hints: name the entry trigger, the exit, and the one number that defines "works".
  - Hints: if a word like "strong" or "good" has no number, replace it with a measurable condition.
- **Independent exercise:** Write a complete test plan for a breakout idea of your own choosing. Include all fields listed in Key ideas.
- **Quiz focus:**
  - Falsifiability (wrong answer: "an idea is testable if it has a name").
  - Setting pass rules after seeing results (wrong answer: "adjusting the rule to fit the data is normal refinement").
  - What a passed test shows (wrong answer: "a profitable backtest proves the idea works").
  - Scenario: a teammate shows a chart and asks you to test it (correct: write the hypothesis and rules first).
  - Spot the mistake: a plan with "exit when it feels extended" (no rule).
- **Paper task (journal/Kite demo/lab):** Journal a learning note (not a trade row) containing one written test plan. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** A test plan is not a trading plan. Nothing here allows real money to be used. Misconception to address: "if I have a rule, it is a system".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** A general statistics text on hypothesis testing (name one; [VERIFY: title and edition]). PLAN.md section 4.1 for the chapter pattern.
- **Estimated length:** short

### T7.2 Historical data: sources, adjustments, quality, licences, how to import
- **Page type:** Concept
- **Prerequisites:** T7.1, T1.9
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain what OHLCV data contains and what it leaves out (no bid-ask, no order-level detail).
  - After this chapter the reader can explain why adjusted and unadjusted prices differ after a split, using a rupee example.
  - After this chapter the reader can identify rows that fail the import checks and state the row number and the reason.
  - After this chapter the reader can state the personal-use limits that apply to imported data and why the app does not redistribute it.
- **Key ideas to teach (in order):**
  - OHLCV: open, high, low, close, volume per period. What is missing: spreads, queue position, intraday path.
  - Corporate actions change historical prices. Adjusted series rewrite the past; unadjusted series keep the past as traded.
  - Adjusted data can contain information only known later (the adjustment factor is computed after the fact). This links to T7.4.
  - Data quality checks used by Lab 4: sorted dates, duplicate dates, gaps, zero or negative prices, OHLC consistency, jumps over 20% without a flagged split, zero volume.
  - Bundled data in this app is synthetic. Real data is downloaded by the owner from a source and imported on the owner's own device.
  - Licence: personal use only. Source terms must be read at the source, not assumed.
- **Worked example (rupees):** Hypothetical split: 1 share at Rs 1,000 becomes 2 shares at Rs 500. Holding 10 shares: Rs 10,000 before (10 x 1,000), 20 shares at Rs 500 after = Rs 10,000. The value is unchanged; the unadjusted price series shows a fall of 50% that did not happen to the holder. A second hypothetical file has 6 rows; row 4 has low Rs 252 and close Rs 251 (low above close, OHLC inconsistent). Reader lists the row and the rule broken.
- **Visual / animation / simulator:** Static table of the import pipeline (read, sniff header, map columns, validate, preview, accept or exclude). Reference the Lab 4 import screen (lab-backtest). No new component.
- **Guided exercise:** Validate a 6-row hypothetical CSV.
  - Hints: check the date order first, then duplicates, then OHLC rules row by row.
  - Hints: a jump over 20% is a question to answer (is there a flagged split?), not an automatic deletion.
- **Independent exercise:** Explain in writing what goes wrong if adjusted and unadjusted series are mixed in one backtest.
- **Quiz focus:**
  - Adjusted vs unadjusted (wrong answer: "both series give the same P&L").
  - OHLC rule (wrong answer: "a low above the close is a typo to ignore").
  - Jump check (wrong answer: "any jump over 20% must be a bad row").
  - Scenario: a file with a 1-for-2 split and no flag.
  - Spot the mistake: "Adj Close is the same across all providers" (wrong: sources differ in adjustment method [VERIFY]).
- **Paper task (journal/Kite demo/lab):** Lab 4: import the bundled synthetic file and write down the validation summary (row count, errors, fixes chosen). Record in a learning note. Mode: none.
- **Labs used:** Lab 4 (data import and validation), Lab 3 (learning note storage)
- **Safety / capital-first note:** Free data is not complete or error-free. Misconception to address: "more history always makes a test better". Old data may come from a different market structure.
- **Time-sensitive facts to register:**
  - Yahoo Finance CSV columns and the adjustment method stated by the source ([VERIFY]).
  - Yahoo Finance terms of use and personal-use position ([VERIFY]).
  - NSE bhavcopy-style file layout and NSE terms for these files ([VERIFY], see PLAN.md 11.6).
- **Sources to cite:** Yahoo Finance help and terms pages (name); NSE "historical data" or reports page and its terms of use (name); the app's own "Get your data" guide (to be written).
- **Estimated length:** medium

### T7.3 Backtesting basics and the realism contract (Lab 4)
- **Page type:** Lab
- **Prerequisites:** T7.2, T2.4, T2.5, T6.2
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can state the timing rule of the realism contract and explain why same-bar fills are invalid.
  - After this chapter the reader can calculate a planned loss and a gap-through-stop loss in rupees.
  - After this chapter the reader can explain where costs and slippage enter a backtest trade's net P&L.
  - After this chapter the reader can identify three realism violations in a short description of a backtest.
- **Key ideas to teach (in order):**
  - A signal uses data up to and including the close of day t. The order fills at the open of day t+1.
  - Stops are checked against the day's low (long). If the open gaps below the stop, the fill is at the open.
  - Trailing stops update at the close and apply from the next day.
  - Every fill passes through the cost engine (Lab 2, CNC by default). Slippage is optional and set per side.
  - Sizing uses the Lab 1 rules (risk %, cash cap, concentration cap). No leverage.
  - Determinism: same data, same config, same seed, same result. Every run saves a manifest.
  - Every backtest result carries the label "Hypothetical backtest. Not live results."
- **Worked example (rupees):** Capital Rs 50,000; risk 1% = Rs 500. Signal at the close; next open Rs 504; stop Rs 490. Risk per share = 504 - 490 = Rs 14. Raw shares = floor(500 / 14) = 35. Cash cap = floor(50,000 / 504) = 99. Concentration cap at 25% = floor(12,500 / 504) = 24. Shares = 24 (concentration cap binds). Planned loss = 24 x 14 = Rs 336. Next day opens at Rs 480 (below the stop). Exit at Rs 480. Loss = 24 x (504 - 480) = Rs 576, before costs. Rs 240 more than planned. Costs are added from Lab 2 and are not computed in this example.
- **Visual / animation / simulator:** `sl-trigger-sim` for the gap-through-stop case (SL vs SL-M logic shown for context).
- **Guided exercise:** Recompute the worked example with the stop at Rs 492.
  - Hints: risk per share changes; redo the raw, cash and concentration caps in that order.
  - Hints: state which cap binds and why.
- **Independent exercise:** Open at Rs 495, the day's low is Rs 488, stop Rs 490. Say at what price the stop fills and why. (Answer for reviewer: Rs 490, because the open is above the stop and the low crosses it intraday.)
- **Quiz focus:**
  - Same-bar fills (wrong answer: "fill at the close that generated the signal is realistic").
  - Gap fills (wrong answer: "a stop always fills at the stop price").
  - Cost placement (wrong answer: "costs are only relevant for live trading").
  - Determinism (wrong answer: "running twice with different seeds should match").
  - Spot the mistake: a backtest that uses the day's high to trigger the entry at the open.
- **Paper task (journal/Kite demo/lab):** Lab 4: run the 20-bar toy fixture with a gap-through-stop and a trailing exit. Write the expected P&L before the run, then compare. Learning note only.
- **Labs used:** Lab 4 (engine), Lab 1 (sizing), Lab 2 (costs)
- **Safety / capital-first note:** The realism contract is a minimum standard, not a guarantee that live fills will match. Misconception to address: "a backtest that follows the contract is accurate".
- **Time-sensitive facts to register:**
  - Circuit-limit rule and how it affects gap fills ([VERIFY: NSE circuit limit page]).
  - Cost rates used by the engine: see the Lab 2 facts registry entries; do not hard-code.
- **Sources to cite:** NSE circuit limit and price band page (name); Zerodha charges page (name, for Lab 2 facts); LABS.md Lab 4 engine rules.
- **Estimated length:** long

### T7.4 Look-ahead bias
- **Page type:** Concept
- **Prerequisites:** T7.3
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can define look-ahead bias and name three forms of it.
  - After this chapter the reader can explain, with rupees, why filling at the signal's own close inflates a result.
  - After this chapter the reader can locate the leaking line in a short rule set.
  - After this chapter the reader can compare the honest and "peek" results from Lab 4 and state the expected ordering.
- **Key ideas to teach (in order):**
  - Look-ahead bias: a decision uses information that did not exist at the decision time.
  - Form 1: fill at the same close that produced the signal.
  - Form 2: a rule uses a full-sample statistic (for example, a percentile over all years, including years after the signal).
  - Form 3: data that was adjusted or revised later is used as if it were known at the time.
  - Each form makes a result look better than it could have been traded.
  - Lab 4's peek toggle shows the inflated and honest results side by side.
- **Worked example (rupees):** Rule: buy when the close is the highest of 20 days. Peek fill at the same close Rs 300. Honest fill at next open Rs 303. On 10 shares: Rs 3,000 vs Rs 3,030, a Rs 30 difference per trade. Over 40 hypothetical trades the difference is Rs 1,200 (40 x 30). Labelled hypothetical; the point is the direction of the bias, not the size.
- **Visual / animation / simulator:** `lab-backtest` peek toggle, shown as two equity curves side by side with the text alternative.
- **Guided exercise:** Find the leak in a four-line rule set.
  - Hints: for each line, ask "was this number known at the close of the day it is used?"
  - Hints: check any line that uses the word "percentile", "average over the whole dataset" or "adjusted".
- **Independent exercise:** Write a rule that leaks through a full-sample median. Then write the fix.
- **Quiz focus:**
  - Forms of look-ahead (wrong answer: "look-ahead only affects fundamental data").
  - Same-close fills (wrong answer: "if the entry is at the same close it is fine").
  - Full-sample statistics (wrong answer: "statistics computed once on all data are harmless").
  - Scenario: a peek run gives a higher result than the honest run.
  - Spot the mistake: a signal uses tomorrow's high to decide whether to enter today.
- **Paper task (journal/Kite demo/lab):** Lab 4 peek toggle: record both results in a learning note. Mode: none.
- **Labs used:** Lab 4 (look-ahead demo)
- **Safety / capital-first note:** Look-ahead is the most common reason a backtest looks like an edge. Misconception to address: "if the backtest shows a gain, the strategy has an edge".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Bailey, Borwein, Lopez de Prado and Zhu on backtest overfitting (name and year; [VERIFY: citation]); a standard text on backtesting (name one).
- **Estimated length:** short

### T7.5 Survivorship bias
- **Page type:** Concept
- **Prerequisites:** T7.2, T7.4
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can define survivorship bias and explain why a current list of companies tested over old years is biased.
  - After this chapter the reader can compute the average return of a survivors-only group and of the full group, and explain the gap.
  - After this chapter the reader can state what a point-in-time universe is.
  - After this chapter the reader can decide which universe a given test must use.
- **Key ideas to teach (in order):**
  - The test universe must be the stocks that existed and were tradable on each past date.
  - Companies that were delisted, merged or suspended drop out of today's lists, so they are missing from a survivors-only test.
  - The effect is always toward a better-looking result.
  - Lab 4 includes delisted synthetic tickers and a loss realised at the last price (configurable).
  - Free sources often lack delisted histories. This is a data limit to state, not to hide.
- **Worked example (rupees):** Hypothetical four-stock universe over two years: A +50%, B +20%, C -100% (delisted, worthless), D -40%. Survivors-only (A and B): average (50 + 20) / 2 = +35%. Full universe: (50 + 20 - 100 - 40) / 4 = -17.5%. On Rs 10,000 spread equally, the survivors-only test shows Rs 3,500 and the full test shows a loss of Rs 1,750. Labelled hypothetical.
- **Visual / animation / simulator:** `lab-backtest` survivorship comparison (survivors vs full universe, side by side).
- **Guided exercise:** Add a fifth stock E, +10%, and recompute both averages.
  - Hints: survivors are now A, B, E; full universe has five names.
  - Hints: compare the gap between the two averages before and after adding E.
- **Independent exercise:** Name the data you would need for a point-in-time test of an index-member strategy, and state whether you can get it free. ([VERIFY] availability.)
- **Quiz focus:**
  - Definition (wrong answer: "survivorship only matters for mutual funds").
  - Direction of bias (wrong answer: "survivorship can make a result look worse").
  - Scenario: a test on today's index constituents back to 2015.
  - Spot the mistake: "I used the 50 most liquid stocks today, so it is representative."
  - Universe choice (wrong answer: "any universe is fine if it is large").
- **Paper task (journal/Kite demo/lab):** Lab 4: run survivors-only and full-universe; record both in a learning note. Mode: none.
- **Labs used:** Lab 4 (survivorship demo)
- **Safety / capital-first note:** Survivors-only results overstate what a trader could have done. Misconception to address: "the companies I know today are the market".
- **Time-sensitive facts to register:**
  - Availability and terms of delisted-stock price history from free sources ([VERIFY]).
  - Index constituent history and methodology on the NSE indices site ([VERIFY]).
- **Sources to cite:** NSE Indices methodology and constituent pages (name); the data source's own help page (name).
- **Estimated length:** short

### T7.6 Overfitting and the number of things you tried
- **Page type:** Concept
- **Prerequisites:** T7.3, T7.4
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain why the best in-sample result is biased upward.
  - After this chapter the reader can count the combinations in a parameter grid.
  - After this chapter the reader can estimate how many results look good by chance when many variants are tried.
  - After this chapter the reader can keep a trial log that includes discarded variants.
- **Key ideas to teach (in order):**
  - Parameters are choices. Every choice tried is a chance to find a lucky result.
  - Grid search: every combination is a separate test, even if it is never reported.
  - Arithmetic of chance: at a 5% chance of looking good by luck per test, 100 tests produce about 5 lucky results (100 x 0.05).
  - Informal tweaking counts. A variant tried "just to see" is part of the number.
  - Lab 4's overfitting demo shows a heat map in sample and the result of the chosen parameters out of sample.
- **Worked example (rupees):** Grid: 5 lookbacks x 4 ATR multiples = 20 combinations. The best in-sample combination shows Rs 12,000 profit on Rs 50,000 (hypothetical). Its out-of-sample result is Rs -3,000 (hypothetical). The collapse is the lesson, not the figures. Counting the 20 combinations is part of the honest result.
- **Visual / animation / simulator:** `lab-backtest` grid heat map (in sample), with the chosen cell marked and its out-of-sample value shown beside it.
- **Guided exercise:** A grid has 6 lookbacks x 5 ATR multiples x 3 filters. Count the combinations and state how many "lucky" results to expect at a 5% chance per test.
  - Hints: multiply the three counts.
  - Hints: 90 x 0.05 = 4.5, so about 4 or 5 lucky results.
- **Independent exercise:** Write a one-row-per-variant trial log template with the fields you would need to count every variant honestly.
- **Quiz focus:**
  - Counting trials (wrong answer: "I only tried one thing, so there is no overfitting").
  - Best in-sample (wrong answer: "the best parameters are the most likely to repeat").
  - Informal tweaks (wrong answer: "changes I did not record do not count").
  - Scenario: 30 variants tried, one shown.
  - Spot the mistake: a report that shows only the best grid cell.
- **Paper task (journal/Kite demo/lab):** Start a trial log in the journal learning note. Record every variant you test in Lab 4 from now on, including discarded ones. Mode: none.
- **Labs used:** Lab 4 (overfitting demo)
- **Safety / capital-first note:** Overfitting produces strategies that look profitable and fail on new prices. Misconception to address: "more optimisation is always better".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Bailey, Borwein, Lopez de Prado and Zhu (backtest overfitting; [VERIFY: citation]); Harvey and Liu on multiple testing in finance ([VERIFY: citation]).
- **Estimated length:** medium

### T7.7 Out-of-sample and walk-forward testing
- **Page type:** Concept
- **Prerequisites:** T7.3, T7.6
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can split a dataset by time (never by shuffling) into in-sample and out-of-sample parts.
  - After this chapter the reader can list the train and test windows of a walk-forward run.
  - After this chapter the reader can explain why an out-of-sample result is only honest if the test period was never used for choices.
  - After this chapter the reader can identify a contaminated split.
- **Key ideas to teach (in order):**
  - In-sample data may be used to choose parameters. Out-of-sample data may not.
  - Time order matters: markets change, so shuffling leaks the future into the past.
  - Lab 4 default split is 70/30 by time.
  - Walk-forward: choose on a training window, test on the next window, roll forward, stitch the test results.
  - Default windows in Lab 4: 3 years training, 1 year test.
  - Using the test period to choose anything turns it into in-sample data. A test period seen once is still a test period; seen after tuning, it is not.
- **Worked example (rupees):** Ten years of daily data, 2016-2025 (hypothetical). A 70/30 split: 2016-2022 in-sample (7 years), 2023-2025 out-of-sample (3 years). Walk-forward with 3-year train and 1-year test, rolling by one year: test 2019 (train 2016-2018), test 2020 (train 2017-2019), and so on to test 2025 (train 2022-2024). That is 7 windows. The stitched out-of-sample curve covers 2019-2025 only. Rupee values are not needed here; the structure is the lesson.
- **Visual / animation / simulator:** `lab-backtest` walk-forward timeline (bars for train and test windows, rolling forward, with Play, Pause, Step and Reset).
- **Guided exercise:** Data 2019-2024 (six years). Train 2 years, test 1 year, roll by one year. List every window.
  - Hints: the first test year is the third year of data.
  - Hints: the answer has 4 windows.
- **Independent exercise:** Explain why "parameters optimised on all ten years, then tested on the last three" is not an out-of-sample result.
- **Quiz focus:**
  - Shuffling (wrong answer: "random shuffles give a fairer test").
  - Reusing the test period (wrong answer: "I only looked at it once, so it is still out of sample" after tuning on it).
  - Walk-forward meaning (wrong answer: "walk-forward proves the strategy works").
  - Scenario: a split where the test window starts before the training window ends.
  - Spot the mistake: a 60/40 split where the 40% was used to pick the stop distance.
- **Paper task (journal/Kite demo/lab):** Lab 4: run one 70/30 split and one walk-forward run on the same config. Write both split dates in a learning note. Mode: none.
- **Labs used:** Lab 4 (split testing and walk-forward)
- **Safety / capital-first note:** A passed out-of-sample test is one more piece of evidence, not validation. Misconception to address: "a good out-of-sample result means it will work live".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Pardo, *The Evaluation and Optimization of Trading Strategies* (name and edition; [VERIFY]); LABS.md Lab 4 experiments 1 and 2.
- **Estimated length:** medium

### T7.8 Metrics and their limits: win rate, expectancy, profit factor, max drawdown, Sharpe
- **Page type:** Math/Calculator
- **Prerequisites:** T2.7, T2.8, T2.9, T7.3
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can calculate win rate, average win, average loss, expectancy (in rupees and in R) and profit factor from a list of trades.
  - After this chapter the reader can calculate maximum drawdown from an equity curve.
  - After this chapter the reader can explain what Sharpe ratio assumes and why it is a weak metric for skewed returns.
  - After this chapter the reader can state why a metric from a small sample cannot conclude anything.
- **Key ideas to teach (in order):**
  - Win rate = wins / trades.
  - Expectancy (Rs) = (win rate x average win) - (loss rate x average loss).
  - Expectancy (R) = expectancy in rupees / the rupee risk of one R.
  - Profit factor = gross profit / gross loss. Undefined when there are no losses.
  - Max drawdown = largest fall from a previous equity peak to a later trough.
  - Sharpe ratio uses mean and volatility of returns; it assumes returns behave in a particular way and depends on the risk-free rate chosen. Lab 4 default is 0 and labelled weak.
  - Under 30 trades, the lab says "too few trades to conclude anything".
- **Worked example (rupees):** Six hypothetical trades: +1,000, -500, +1,500, -500, -500, +800. Wins 3 (total 3,300); losses 3 (total 1,500). Win rate = 3/6 = 50%. Average win = 3,300 / 3 = 1,100. Average loss = 1,500 / 3 = 500. Expectancy = 0.5 x 1,100 - 0.5 x 500 = Rs 300 per trade. In R (1R = Rs 500): 0.6R. Profit factor = 3,300 / 1,500 = 2.2. Equity: 0, 1,000, 500, 2,000, 1,500, 1,000, 1,800. Peak 2,000, trough 1,000 afterwards: max drawdown Rs 1,000. Net Rs 1,800. Six trades is far too few to conclude anything.
- **Visual / animation / simulator:** `drawdown-compounding` for the peak-to-trough view; the metrics table is static.
- **Guided exercise:** Recompute the expectancy with trades +600, -300, +900, -300.
  - Hints: find wins and losses first, then averages.
  - Hints: express the result in R using the rupee risk of 300 per trade.
- **Independent exercise:** Ten hypothetical trades are given in the chapter's worksheet. Compute all six metrics and write one sentence on what the sample can and cannot show.
- **Quiz focus:**
  - Expectancy formula (wrong answer: "expectancy is the average win").
  - Profit factor with no losses (wrong answer: "a profit factor of infinity means a great strategy").
  - Max drawdown (wrong answer: "max drawdown is the largest single loss").
  - Sharpe limits (wrong answer: "a higher Sharpe always means safer money").
  - Scenario: a dashboard showing CAGR after six trades.
- **Paper task (journal/Kite demo/lab):** Enter the six worked-example trades into Lab 3 as mode `backtest`, then check that the dashboard matches the figures above. Mode: backtest.
- **Labs used:** Lab 3 (dashboard), Lab 4 (metrics)
- **Safety / capital-first note:** No single metric captures risk. Misconception to address: "a high win rate or high profit factor means low risk".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Sharpe, "Mutual Fund Performance" (1966) (name); LABS.md Lab 3 and Lab 4 metric lists.
- **Estimated length:** medium

### T7.9 Monte Carlo of trade order: how bad can drawdown get
- **Page type:** Lab
- **Prerequisites:** T7.8, T2.9, T2.10
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain why the same trades in a different order give a different drawdown.
  - After this chapter the reader can read a percentile band of maximum drawdown and longest losing streak.
  - After this chapter the reader can calculate the chance of a specific run of losses from a loss probability.
  - After this chapter the reader can state the assumptions that a shuffle-based simulation makes and where they fail.
- **Key ideas to teach (in order):**
  - Expectancy does not change when trades are reordered, but the path (drawdown, streaks) does.
  - Shuffle or resample the trade sequence 1,000 or more times; record max drawdown and longest losing streak in each run.
  - Read percentiles (5th, 50th, 95th), not just the average.
  - Assumption: trades are independent. Real losses cluster in regimes, so this understates clustering.
  - Probability of ruin: the chance the equity falls to a level set in advance. The level must be stated.
  - The output is a range of plausible paths for the same trades, not a forecast.
- **Worked example (rupees):** Hypothetical system: win rate 35%, average win 2R, average loss 1R, risk 1% of Rs 50,000 = Rs 500 per trade. Expectancy = 0.35 x 2 - 0.65 x 1 = +0.05R, which is Rs 25 per trade before costs. Thin. Chance that a specific run of 5 consecutive losses starts at a given trade = 0.65^5, about 11.6%. A 5-trade losing run costs 5 x Rs 500 = Rs 2,500, which is 5% of capital.
- **Visual / animation / simulator:** `lab-backtest` experiment 7 (Monte Carlo histogram with percentile markers).
- **Guided exercise:** Compute 0.65^3 and the loss in rupees of a 3-trade losing run at 1R = Rs 500.
  - Hints: multiply 0.65 by itself three times.
  - Hints: 3 losses x Rs 500.
- **Independent exercise:** Your Monte Carlo 95th-percentile maximum drawdown is Rs 9,000 on Rs 50,000. Explain what that number does and does not tell you, and what you would check before trusting it.
- **Quiz focus:**
  - Reordering (wrong answer: "shuffling removes the edge").
  - Percentiles (wrong answer: "the 95th percentile is the worst case").
  - Independence (wrong answer: "shuffle results are realistic because they are random").
  - Scenario: a Monte Carlo output used to promise a drawdown limit.
  - Spot the mistake: "Monte Carlo shows the maximum drawdown I will suffer."
- **Paper task (journal/Kite demo/lab):** Lab 4 experiment 7 on your own backtest run. Record the 5th, 50th and 95th percentile values of max drawdown and longest losing streak. Mode: backtest.
- **Labs used:** Lab 4 (experiment 7), Lab 3 (record)
- **Safety / capital-first note:** Monte Carlo is how the owner tests whether a risk percentage is survivable on a bad sequence. Misconception to address: "if the average outcome is positive, the bad path cannot matter". Feeds gate G4.
- **Time-sensitive facts to register:** None.
- **Sources to cite:** A standard reference on risk of ruin (name one; [VERIFY: citation]); LABS.md Lab 4 experiment 7.
- **Estimated length:** medium

### T7.10 Paper trading and forward testing; hypothetical vs live (Lab 5)
- **Page type:** Lab
- **Prerequisites:** T7.7, T7.9, T4.9, T2.2
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can distinguish backtest, hypothetical forward (paper) and live results, and label each correctly.
  - After this chapter the reader can list the four gaps between a hypothetical fill and a real fill.
  - After this chapter the reader can calculate the rupee effect of a fill that is worse than the assumed open.
  - After this chapter the reader can run the forward-test checklist for one day and explain each check.
- **Key ideas to teach (in order):**
  - Backtest: past data, rules applied after the fact.
  - Forward test: fixed rules applied to prices as they arrive, day by day, with no changes.
  - Paper or hypothetical: a trade recorded as if filled, not sent to any broker.
  - Live: real orders with real money.
  - The four honesty gaps: fill price (spread and gaps), queue position, partial fills, and the trader's own behaviour.
  - Lab 5 script: fails closed on missing or bad data, is idempotent, places no orders and holds no credentials.
  - The Kite demo is for interface practice with dummy data; it is not a forward test. Zerodha has said it has no paper-trading account; [VERIFY: exact wording on support.zerodha.com].
- **Worked example (rupees):** Day 1 close Rs 800 gives a hypothetical signal. Day 2 open Rs 806. Script fills 12 shares at Rs 806 = Rs 9,672. If a real fill is Rs 808, the difference is 12 x 2 = Rs 24. Multiply by the number of trades to see how assumptions accumulate. Labelled hypothetical.
- **Visual / animation / simulator:** `order-flow-sim` (trader, broker, exchange, matching) to show what a hypothetical fill skips.
- **Guided exercise:** Fill one row of a forward log for a hypothetical trade.
  - Hints: fields are trade_id, mode, symbol, planned entry, fill price, shares.
  - Hints: set mode to `forward`, never `live`.
- **Independent exercise:** Write the honesty note that must appear beside a forward-test result on the dashboard.
- **Quiz focus:**
  - Hypothetical vs live (wrong answer: "a paper profit is the same as a live profit").
  - Failing closed (wrong answer: "if data is missing, skip the bad symbol and carry on").
  - Kite demo role (wrong answer: "the Kite demo is a forward test").
  - Scenario: the script missed a holiday.
  - Spot the mistake: a forward log that labels rows `live` on the owner's first paper week.
- **Paper task (journal/Kite demo/lab):** Lab 5: run the script on the recorded 10-day fixture and import the output into the journal as mode `forward`. Real daily runs are optional and need the owner's data source; do not place orders. Mode: forward.
- **Labs used:** Lab 5 (forward-test script and importer), Lab 3 (journal)
- **Safety / capital-first note:** A forward test takes no orders and holds no credentials. A short forward test proves little; the 30-trade figure is a floor, not a verdict. Misconception to address: "paper trading proves I can do it with real money".
- **Time-sensitive facts to register:**
  - Kite demo and paper-trading wording ([VERIFY: support.zerodha.com]).
  - Cash market close time and any safety margin used by the script ([VERIFY: NSE market timings page]).
  - Holiday list used by the script ([VERIFY: NSE holiday list]).
  - Terms of the chosen data source (yahoo-finance2 or CSV files) ([VERIFY]).
- **Sources to cite:** Zerodha support pages on the demo and virtual trading (name); NSE market timings and holiday pages (name); LABS.md Lab 5 honesty notes.
- **Estimated length:** long

### T7.11 Strategy validation assessment (gate G5 prep)
- **Page type:** Assessment
- **Prerequisites:** T7.1-T7.10
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can run the Lab 4 backtest with costs and a held-out period, and report the in-sample and out-of-sample results separately.
  - After this chapter the reader can explain the result, name the biases the run checked for, and say why the result may not hold live.
  - After this chapter the reader can decide between "inconclusive", "not validated" and "validated for further forward testing" using written criteria.
  - After this chapter the reader can identify an overclaimed conclusion in someone else's write-up.
- **Key ideas to teach (in order):**
  - Verdict categories: inconclusive (sample too small or results disagree), not validated (fails the criteria), validated for further forward testing (passes the criteria, which is not the same as profitable).
  - The checklist: costs on; held-out period used once; look-ahead demo run; survivorship demo run; trial count recorded; Monte Carlo run; sample size stated.
  - "Why it may not hold live": fills, costs, regime change, small sample, changed liquidity.
  - Writing a verdict is the skill being assessed, not the verdict itself.
- **Worked example (rupees):** Hypothetical Lab 4 output on Rs 50,000 capital: in-sample expectancy +0.40R; out-of-sample expectancy +0.05R after costs; 18 out-of-sample trades. Verdict: inconclusive. Reason: 18 trades is below the lab's 30-trade confidence threshold, and the out-of-sample edge is small compared with its own cost sensitivity. The write-up must state these reasons.
- **Visual / animation / simulator:** No new component. Use `quiz-block` and `exercise-block` with the checklist as structured input.
- **Guided exercise:** Complete the seven-item checklist for the worked example above.
  - Hints: for each item, write the file or screen where the evidence is stored.
  - Hints: mark items you cannot evidence as not done, not as passed.
- **Independent exercise:** Write a two-paragraph validation memo for a second hypothetical result that is in-sample positive and out-of-sample negative.
- **Quiz focus:**
  - Verdict categories (wrong answer: "a positive out-of-sample result means validated").
  - Held-out period (wrong answer: "the held-out period can be used again after a small tweak").
  - Costs (wrong answer: "costs are negligible if the win rate is high").
  - Scenario: an 18-trade out-of-sample result described as conclusive.
  - Spot the mistake: a memo that says "the strategy is profitable and ready".
- **Paper task (journal/Kite demo/lab):** Complete the G5 checklist in the journal learning note; attach the Lab 4 run manifest. Mode: backtest.
- **Labs used:** Lab 4, Lab 2, Lab 3
- **Safety / capital-first note:** Validation for further testing is not permission to trade real money. Misconception to address: "validated means I can start with the money I have saved".
- **Time-sensitive facts to register:** Cost facts used by Lab 4 (see the registry). None other.
- **Sources to cite:** Pardo (name and edition; [VERIFY]); Bailey et al. (name and year; [VERIFY]); LABS.md Lab 4 acceptance criteria.
- **Estimated length:** medium

---

## Track 8: Psychology and journaling

**Purpose.** Cover the behaviour side of capital protection: how fear, greed and bias break a plan, and how a written checklist and a journal catch the break before it costs money.

**Order.** T8.1 emotion and losses, T8.2 loss aversion and revenge trading, T8.3 FOMO, overconfidence and confirmation bias, T8.4 plan and checklist, T8.5 the journal, T8.6 living through a losing streak, T8.7 when to stop altogether.

**How it serves the owner's goals.** The owner has stated rules: no revenge trading, no larger size after a loss, no trading to meet a target, and a no-trade day is acceptable. This track turns each rule into something observable and records whether it was followed. It feeds gates G4 and G7.

### T8.1 Fear, greed and the brain on losses
- **Page type:** Concept
- **Prerequisites:** T0.1, T2.1
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain why the same rupee loss is usually felt more strongly than the same rupee gain.
  - After this chapter the reader can express a loss as a multiple of R and as a percentage of capital.
  - After this chapter the reader can identify the decision point where a feeling starts to override a written rule.
  - After this chapter the reader can tag their own emotion before and after a trade using the journal's tag list.
- **Key ideas to teach (in order):**
  - Fear and greed are useful signals in other contexts and misfire in markets, where outcomes are noisy.
  - Losses trigger stress responses; the urge is to act to make the feeling stop.
  - Frame every loss as R (the planned risk per trade) so it is a fixed, expected cost of the method, not a personal failure.
  - Decision points: after a loss, after a win, when price moves without you, and when a plan says "no trade".
  - This book does not diagnose anyone. If trading causes distress, see T8.7.
- **Worked example (rupees):** Capital Rs 50,000; 1R = Rs 500 (1%). A day ends with a Rs 2,000 loss = 4R = 4% of capital. The loss is the same size whether it came from four planned stops or from one unplanned trade. The second case is a rule break, and the journal records it as one.
- **Visual / animation / simulator:** Static decision-loop diagram (signal, feeling, pause, rule check, action). No interactive component.
- **Guided exercise:** Classify five written scenario sentences as "feeling", "rule", or "outcome".
  - Hints: a rule has a number or a condition.
  - Hints: a feeling is about what the reader wants to do next.
- **Independent exercise:** List five emotion tags you expect to use and write one sentence for each describing when it appears.
- **Quiz focus:**
  - Loss in R (wrong answer: "a loss is the same as its rupee size, nothing else").
  - Decision points (wrong answer: "emotion only matters when I am losing").
  - Scenario: a Rs 2,000 day loss followed by a wish to "get it back".
  - Spot the mistake: "I am not emotional, so the plan does not need a check."
- **Paper task (journal/Kite demo/lab):** For five learning-note sessions, record emotion_before and emotion_after tags. Mode: none.
- **Labs used:** Lab 3 (emotion fields)
- **Safety / capital-first note:** Emotions are a risk to capital, not a character flaw. Misconception to address: "experienced traders do not feel fear".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Kahneman, *Thinking, Fast and Slow* (name and edition; [VERIFY]); LABS.md Lab 3 emotion fields.
- **Estimated length:** short

### T8.2 Loss aversion and revenge trading
- **Page type:** Concept
- **Prerequisites:** T8.1, T2.9
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain loss aversion in plain words.
  - After this chapter the reader can calculate the gain needed to recover a loss in percentage terms.
  - After this chapter the reader can identify revenge trading from its signs (larger size, shorter gap, no plan).
  - After this chapter the reader can state the daily-limit rule and apply it to a scenario.
- **Key ideas to teach (in order):**
  - Loss aversion: losses tend to weigh more than equal gains in behavioural research.
  - Recovery arithmetic: a loss of L% needs a gain of L / (100 - L) %. A 50% loss needs 100%.
  - Revenge trading: taking a trade to recover a loss, usually with a bigger size or a looser stop.
  - The rule: once the daily limit is hit, trading stops for the day. No size increase after a loss.
- **Worked example (rupees):** Capital Rs 50,000. Down Rs 2,000 (4%). Recovery needed: 2,000 / 48,000 = 4.17%. A revenge trade doubles risk to Rs 1,000. It loses 1R at the new size: Rs 1,000. Total loss Rs 3,000 (6% of capital). The recovery needed is now 3,000 / 47,000 = 6.38%. The doubled size made the hole deeper.
- **Visual / animation / simulator:** `drawdown-compounding` (recovery arithmetic).
- **Guided exercise:** Compute the recovery needed after a Rs 5,000 loss on Rs 50,000.
  - Hints: the remaining capital is 45,000.
  - Hints: recovery = loss / remaining capital.
- **Independent exercise:** After three losing planned trades of Rs 500 each, a trader doubles size for the next trade. Compute the total loss if that trade also loses, and state which rule was broken.
- **Quiz focus:**
  - Recovery (wrong answer: "a 10% loss needs a 10% gain").
  - Revenge sizing (wrong answer: "a bigger size gets back to zero faster").
  - Daily limit (wrong answer: "the limit is a suggestion if the setup looks strong").
  - Scenario: a losing morning and a wish to trade the afternoon.
  - Spot the mistake: "I will double my size until I am even."
- **Paper task (journal/Kite demo/lab):** Journal a rule_breaks tag for any trade taken after a loss within the same session, even if the trade is paper. Mode: paper or none.
- **Labs used:** Lab 1 (limit check), Lab 3 (rule_breaks)
- **Safety / capital-first note:** Revenge trading is the fastest route from a small loss to a capital problem. Misconception to address: "I can make it back today if I trade harder".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** Kahneman and Tversky, prospect theory (1979) (name; [VERIFY]); LABS.md Lab 1 limit check.
- **Estimated length:** medium

### T8.3 FOMO, overconfidence, confirmation bias
- **Page type:** Concept
- **Prerequisites:** T8.1, T2.4, T2.5
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can recognise a fear-of-missing-out entry from its signs (large move already done, no plan price).
  - After this chapter the reader can calculate how a late entry changes share count and cash used.
  - After this chapter the reader can explain how a winning streak can produce overconfidence.
  - After this chapter the reader can write the disconfirming evidence for a trade idea.
- **Key ideas to teach (in order):**
  - FOMO: buying after a large move because others are buying. The planned entry is gone.
  - A wider stop from a late entry means fewer shares for the same rupee risk.
  - Overconfidence: a few wins are read as skill; a short run is treated as a trend.
  - Confirmation bias: looking only for evidence that agrees with the idea.
  - Counter-habit: write one reason the trade could fail before entering.
- **Worked example (rupees):** Planned entry Rs 400, stop Rs 390 (risk per share Rs 10), risk budget Rs 500. Planned shares: 500 / 10 = 50, cash Rs 20,000. Price has jumped to Rs 448 after a 12% day; stop now at Rs 420 (risk per share Rs 28). Shares: 500 / 28 = 17 (rounded down), cash 17 x 448 = Rs 7,616. The late entry uses less risk budget per share but the stop is far from the plan. The trade is no longer the planned trade.
- **Visual / animation / simulator:** `spot-the-mistake` (a chart with an annotated late entry).
- **Guided exercise:** Using the same figures, compute shares if the stop is Rs 435 (risk per share Rs 13).
  - Hints: 500 / 13 rounded down.
  - Hints: state whether the trade is still the planned one.
- **Independent exercise:** Write three disconfirming reasons for a trade idea you hold, and one rule that would stop you entering.
- **Quiz focus:**
  - FOMO signs (wrong answer: "chasing a strong move is disciplined momentum" when the plan price is gone).
  - Shares from late entry (wrong answer: "the same rupee risk always buys the same shares").
  - Overconfidence (wrong answer: "five wins in a row prove the method").
  - Confirmation bias (wrong answer: "reading only supportive news is research").
  - Spot the mistake: a journal entry with "entered at market, will fix stop later."
- **Paper task (journal/Kite demo/lab):** Journal three learning-note entries, each with one disconfirming reason written before the idea is tested. Mode: none.
- **Labs used:** Lab 1 (shares and risk), Lab 3 (tags)
- **Safety / capital-first note:** A late entry is a new trade with a new plan, and it needs its own checks. Misconception to address: "if the trend is clear, the plan price does not matter".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** LABS.md Lab 1 example 3 (tight stop, cash cap); academic references on overconfidence and confirmation bias (name; [VERIFY]).
- **Estimated length:** medium

### T8.4 Discipline: trading plan, checklist, no-trade rules
- **Page type:** Concept
- **Prerequisites:** T8.1, T2.15, T6.7
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can write a one-page trading plan with every required field filled.
  - After this chapter the reader can build a pre-trade checklist where each item is observable.
  - After this chapter the reader can apply a no-trade rule and explain why "no trade" is a valid outcome.
  - After this chapter the reader can reject a setup using the reward-to-risk rule and explain the arithmetic.
- **Key ideas to teach (in order):**
  - A plan is written before the market opens and before a trade is considered.
  - A checklist item must be yes or no, with evidence. "Looks strong" is not an item.
  - No-trade rules are part of the plan: conditions, limits, and the days when the method does not run.
  - Reward-to-risk: R = reward / risk. Break-even win rate = 1 / (1 + R).
  - The lab reports rule conflicts neutrally; it never calls a trade good.
- **Worked example (rupees):** Entry Rs 250, stop Rs 240 (risk Rs 10). Target Rs 270: reward Rs 20, R = 2. Break-even win rate before costs = 1 / (1 + 2) = 33.3%. Target Rs 260: reward Rs 10, R = 1. The plan's minimum R is 1.5 (LABS.md Lab 1 reject rule), so this setup is rejected. The reject is a plan result, not a judgement of the stock.
- **Visual / animation / simulator:** `exercise-block` with a checklist. `gate-check` is used only in the gates chapters.
- **Guided exercise:** Compute R and break-even win rate for a target of Rs 275 on the same entry and stop.
  - Hints: reward = 275 - 250.
  - Hints: break-even = 1 / (1 + R).
- **Independent exercise:** Write a six-item pre-trade checklist with yes or no items, and a short no-trade list of three conditions.
- **Quiz focus:**
  - Checklist items (wrong answer: "I can judge the setup at the moment").
  - R and break-even (wrong answer: "a 1:1 setup with a 60% win rate is always good").
  - No-trade (wrong answer: "not trading means I am behind").
  - Scenario: a setup that passes four items and fails two.
  - Spot the mistake: a plan that says "trade when it looks strong".
- **Paper task (journal/Kite demo/lab):** Write plan v1 in the journal learning note and version it. Mode: none.
- **Labs used:** Lab 1 (R and reject rules), Lab 3 (plan fields)
- **Safety / capital-first note:** A plan does not guarantee results; it limits the damage from bad decisions. Misconception to address: "a plan is needed only after I have made money".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** LABS.md Lab 1 outputs and reject panel; PLAN.md section 6 gate G7 fields.
- **Estimated length:** medium

### T8.5 The journal as a tool (Lab 3): reviews, plan adherence, rule breaks
- **Page type:** Lab
- **Prerequisites:** T8.4, T7.8
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can record a planned trade and its execution, and explain why the planned fields lock at entry.
  - After this chapter the reader can calculate entry slippage in rupees from plan and fill.
  - After this chapter the reader can calculate plan adherence as a percentage.
  - After this chapter the reader can complete a weekly review that names one change.
- **Key ideas to teach (in order):**
  - Planned fields are written before entry; executed fields after. The comparison is the point.
  - Modes are never blended by default: paper, forward, backtest, live, kite_demo.
  - Slippage (Rs) = (fill price - plan price) x shares, for a long entry.
  - Plan adherence % = trades where plan followed / total trades x 100.
  - Rule breaks are tagged by category; the weekly review looks at the most frequent category.
  - Journal entries before the gates are never `live`.
- **Worked example (rupees):** Plan entry Rs 250; fill Rs 251; 40 shares. Slippage = (251 - 250) x 40 = Rs 40. Ten trades, nine with plan followed: adherence 90%. One break was a late exit (rule_breaks: exit_late); one was oversize (rule_breaks: size). Weekly review names one change: fix exit timing check.
- **Visual / animation / simulator:** `lab-journal` (plan form, execution form, weekly review form).
- **Guided exercise:** Compute slippage for plan Rs 250, fill Rs 252.50, 40 shares.
  - Hints: difference first, then multiply by shares.
  - Hints: the answer is Rs 100.
- **Independent exercise:** Complete a weekly review for three learning-note trades: what went well, one rule break, one change.
- **Quiz focus:**
  - Locked fields (wrong answer: "I can edit the plan after entry without leaving a trace").
  - Adherence (wrong answer: "adherence is wins divided by trades").
  - Mode separation (wrong answer: "paper and live go in the same dashboard by default").
  - Scenario: a plan entry changed after the fill.
  - Spot the mistake: "I left the plan blank and filled it at the end of the week."
- **Paper task (journal/Kite demo/lab):** Start the journal today. Log three learning-note entries with plan and execution fields. Mode: paper for practice entries, never live.
- **Labs used:** Lab 3 (journal)
- **Safety / capital-first note:** The journal is a record for judging behaviour, not a tool to make losses look smaller. Misconception to address: "I will remember my reasons later".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** LABS.md Lab 3 record definition and features.
- **Estimated length:** medium

### T8.6 Living through a losing streak (streak-sim with feelings log)
- **Page type:** Lab
- **Prerequisites:** T2.10, T7.9, T8.2
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can simulate a losing streak at a given win rate and R and read the output.
  - After this chapter the reader can calculate the probability of a specific run of losses from the loss probability.
  - After this chapter the reader can state the plan action at each stage of a drawdown.
  - After this chapter the reader can record feelings alongside the streak and compare them with the plan.
- **Key ideas to teach (in order):**
  - Streaks happen at any win rate. A low win rate makes long losing runs more common.
  - Gambler's fallacy: a run of losses does not make a win "due".
  - Stages: normal, limit approached, daily limit hit, weekly limit hit. The action is set in advance for each.
  - Size stays fixed in a drawdown; reducing exposure follows a written rule (see T8.7).
- **Worked example (rupees):** Win rate 40%, loss probability 0.6, 1R = Rs 500 (1% of Rs 50,000). Chance a specific run of 6 losses starts at a given trade = 0.6^6 = 0.0467, about 4.7%. Cost of 6 losses at 1R = 6 x 500 = Rs 3,000 = 6% of capital. The plan action at 4 losses in a row is written before the run begins (example: no change in size; check the weekly limit).
- **Visual / animation / simulator:** `streak-sim` with a feelings log (tag per trade).
- **Guided exercise:** Compute 0.6^4 and the rupee loss of 4 losses at 1R.
  - Hints: multiply 0.6 by itself four times.
  - Hints: 4 x Rs 500.
- **Independent exercise:** Run the simulator three times with different seeds and write what changed in the feelings log between runs.
- **Quiz focus:**
  - Gambler's fallacy (wrong answer: "after five losses a win is due").
  - Streak probability (wrong answer: "a 40% win rate means I will never see six losses").
  - Pre-set actions (wrong answer: "I will decide what to do when I am in the streak").
  - Scenario: a streak that hits the weekly limit on day three.
  - Spot the mistake: "I doubled size after four losses to recover faster."
- **Paper task (journal/Kite demo/lab):** Run streak-sim three times and log the feelings tags for each run in the journal learning note. Mode: none.
- **Labs used:** Lab 3 (feelings log), Lab 4 (Monte Carlo context from T7.9)
- **Safety / capital-first note:** The streak is the normal cost of a method, and the plan must already say what to do. Misconception to address: "a losing streak means the method is broken".
- **Time-sensitive facts to register:** None.
- **Sources to cite:** LABS.md Lab 4 experiment 7 and gate G4; general text on the gambler's fallacy (name; [VERIFY]).
- **Estimated length:** medium

### T8.7 When to stop trading altogether (suspension conditions)
- **Page type:** Concept
- **Prerequisites:** T2.11, T2.15, T8.6
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can list the suspension triggers that apply to their own plan.
  - After this chapter the reader can calculate the rupee level at which a monthly loss limit triggers.
  - After this chapter the reader can explain why reducing exposure comes before stopping.
  - After this chapter the reader can state the conditions required to restart trading.
- **Key ideas to teach (in order):**
  - Three levels: stop for the day, stop for the week, suspend until review.
  - Suspension triggers: limit breaches, a set number of consecutive losses, a drawdown from peak, a broken rule, a feeling the reader cannot manage.
  - Reducing exposure: cut the risk percentage or capital at risk by a written step, not by feel.
  - Restart: a written review, a fixed waiting period, and a plan change if the cause was a rule.
  - Stopping is part of the method; it is not a failure.
- **Worked example (rupees):** Capital Rs 50,000. Illustrative monthly loss limit 6% = Rs 3,000 (the owner sets the real figure). The limit triggers at a cumulative monthly loss of Rs 3,000. Illustrative exposure cut: after a 10% drawdown from peak (Rs 5,000), risk falls from 1% of capital (Rs 500) to 0.5% of current capital (0.5% of Rs 45,000 = Rs 225). Both figures are illustrative settings for the owner to replace.
- **Visual / animation / simulator:** `risk-limit-simulator` (new, allowed): enter limits and a sequence of losses, see the trigger and the suspension state.
- **Guided exercise:** Compute the monthly limit in rupees for a 5% limit on Rs 40,000.
  - Hints: 5% of 40,000.
  - Hints: then the risk per trade at 1% of the new capital.
- **Independent exercise:** Write the suspension and restart rules for your plan, with each trigger a yes or no test.
- **Quiz focus:**
  - Trigger levels (wrong answer: "a limit only applies after I have decided it does").
  - Exposure cut (wrong answer: "I should increase size to recover before a cut").
  - Restart (wrong answer: "I can restart the next morning if I feel calm").
  - Scenario: a limit breached on the last trading day of the month.
  - Spot the mistake: a plan that says "stop when things feel bad."
- **Paper task (journal/Kite demo/lab):** Write the suspension rules into the plan (learning note), then run `risk-limit-simulator` once and log the state transitions. Mode: none.
- **Labs used:** Lab 1 (limit inputs), Lab 3 (limit-breach log)
- **Safety / capital-first note:** The owner's household savings stay outside any loss limit. Misconception to address: "stopping means giving up on trading". If distress persists, stop and seek support outside the book.
- **Time-sensitive facts to register:** None.
- **Sources to cite:** PLAN.md section 6 (G4, G7); LABS.md Lab 3 limit-breach log.
- **Estimated length:** medium

---

## Track 9: Advanced (theory only)

**Purpose.** Explain futures, options, hedging, SEBI's F&O studies, algorithmic trading and deeper market structure, so the owner understands what these products are and why leveraged and automated approaches are not a shortcut to the daily target.

**Track rules (apply to every chapter).**
- Theory only. There is no practice path for F&O, options, futures, margin or leverage: no paper task, no Kite demo task, no lab, no journal trade row.
- Exercises are read-only reflection. Worked examples are hypothetical arithmetic for understanding, not set-ups to copy.
- No SEBI study figure is stated as fact. No algo-framework date is stated as fact. Both are `[VERIFY]`.
- No lot size, margin rate, contract specification or expiry rule is stated as fact.
- No chapter uses `leverage-demo` as an interactive simulator (that component is reserved for T2.13).

**Order.** T9.1 futures, T9.2 options and Greeks, T9.3 hedging, T9.4 SEBI's F&O studies as a case study, T9.5 algo trading, APIs and why the book does not automate, T9.6 microstructure and auctions, T9.7 FII/DII data.

**How it serves the owner's goals.** The owner asked for "explicit not a shortcut" framing. The track shows, in arithmetic, why products that magnify exposure cannot produce a steady daily target at small capital, and why automation adds compliance and data cost without changing the risk.

### T9.1 Futures and why they are leveraged
- **Page type:** Concept
- **Prerequisites:** T2.13, T1.3, T2.6
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain in plain words what a futures contract is.
  - After this chapter the reader can explain why a small percentage move in the contract can be a large percentage of the margin deposited.
  - After this chapter the reader can explain why losses can exceed the margin deposited, and what that means for capital.
  - After this chapter the reader can name the contract terms that change over time and must be checked at source.
- **Key ideas to teach (in order):**
  - A futures contract is an agreement to buy or sell an asset at a set price on a future date, traded on an exchange.
  - Margin is a deposit, smaller than the contract's value. This is the source of leverage.
  - Daily settlement (mark-to-market): gains and losses are credited and debited as prices move, not only at expiry.
  - Leverage magnifies gains and losses equally. It does not change the expected value of the bet.
  - Contract size, margin and expiry are set by the exchange and change over time. [VERIFY].
- **Worked example (rupees, illustrative only):** Hypothetical contract value Rs 10,00,000 with a hypothetical margin of Rs 1,00,000. A 2% adverse move = 2% x 10,00,000 = Rs 20,000 = 20% of the margin deposited. The same 2% move on a Rs 1,00,000 cash holding is Rs 2,000 = 2% of the cash. Margin rates and contract sizes are not facts in this book.
- **Visual / animation / simulator:** Static diagram comparing cash exposure and margin exposure for the same price move. No interactive simulator.
- **Guided exercise:** Read the worked example and state, in one sentence, why the same percentage move is larger relative to the deposit.
  - Hints: compare the rupee move with the deposit, not with the contract value.
  - Hints: the deposit is the denominator that matters to the trader's capital.
- **Independent exercise:** Explain in writing why "leverage raises expected return" is a misconception, and what it changes instead.
- **Quiz focus:**
  - Leverage (wrong answer: "leverage increases the expected profit of the same trades").
  - Daily settlement (wrong answer: "futures losses only count at expiry").
  - Loss vs deposit (wrong answer: "the most I can lose is the margin deposited").
  - Scenario: a rupee move on a futures position that is larger than the cash in the account.
  - Spot the mistake: "futures are a cheaper way to hold the same stock."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only: write the one-sentence leverage summary in the learning note. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** Futures are not a shortcut to any daily target, and the book does not practise them. Misconception to address: "a small margin means a small risk".
- **Time-sensitive facts to register:**
  - Contract specifications, lot sizes and expiry rules ([VERIFY: NSE derivatives contract specifications page]).
  - Margin requirements and their rules ([VERIFY: SEBI margin circulars; NSE margin pages]).
  - Daily settlement rules ([VERIFY: NSE clearing corporation pages]).
- **Sources to cite:** NSE derivatives contract specifications and margin pages (name); SEBI circulars on derivatives margin (name); Zerodha Varsity (reference only, link out, no text copied).
- **Estimated length:** medium

### T9.2 Options basics and Greeks (theory)
- **Page type:** Concept
- **Prerequisites:** T9.1
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can define call, put, strike, premium and expiry in plain words.
  - After this chapter the reader can split an option premium into intrinsic value and time value.
  - After this chapter the reader can explain what delta, theta and vega measure, in words.
  - After this chapter the reader can explain why a buyer's maximum loss is the premium, and why a seller's risk can be much larger.
- **Key ideas to teach (in order):**
  - Call: right to buy at the strike. Put: right to sell at the strike. The buyer pays a premium; the seller receives it.
  - Intrinsic value: the amount an option is in the money. Time value: the rest of the premium.
  - Delta: how much the premium moves for a small move in the underlying (in words).
  - Theta: how much the premium loses as time passes, other things equal.
  - Vega: how sensitive the premium is to changes in expected volatility.
  - Options can expire worthless. The buyer's loss can be the whole premium paid.
- **Worked example (rupees, per share, illustrative):** Call with strike Rs 500, premium Rs 20 per share. At expiry the underlying is Rs 530: intrinsic value Rs 30, profit per share Rs 30 - 20 = Rs 10 before costs. If the underlying is Rs 490 at expiry, intrinsic value is zero and the buyer loses Rs 20 per share, the premium. The seller's position is the mirror image, with the risk on the other side.
- **Visual / animation / simulator:** Static payoff diagram for buyer and seller (original drawing, labelled illustrative). No interactive simulator.
- **Guided exercise:** Using the call example, compute the buyer's profit per share if the underlying is Rs 515 at expiry.
  - Hints: intrinsic value is 515 - 500.
  - Hints: subtract the premium.
- **Independent exercise:** Explain in writing why an option seller's maximum gain is the premium but the loss can be far larger than the premium.
- **Quiz focus:**
  - Buyer's loss (wrong answer: "an option buyer can lose more than the premium").
  - Theta (wrong answer: "time decay helps option buyers").
  - Intrinsic vs time value (wrong answer: "a premium is all intrinsic value").
  - Scenario: an option that expires below the strike for a call.
  - Spot the mistake: "buying options is a low-risk way to trade."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** Option buying and selling are listed as dangerous in the book's strategy chapters, and this chapter does not change that. Misconception to address: "options are cheap, so they are safe".
- **Time-sensitive facts to register:**
  - Option contract specifications, expiry schedule and strike intervals ([VERIFY: NSE derivatives pages]).
  - STT and other charges on options ([VERIFY: Zerodha charges page; SEBI and NSE circulars]).
  - Current F&O eligibility and participant rules ([VERIFY: SEBI and NSE]).
- **Sources to cite:** NSE derivatives pages (name); Zerodha Varsity options module (reference only, link out, no text copied); a standard options textbook (name; [VERIFY]).
- **Estimated length:** medium

### T9.3 Hedging (theory)
- **Page type:** Concept
- **Prerequisites:** T9.1, T9.2, T2.14
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can define a hedge as an offsetting exposure and explain what it costs.
  - After this chapter the reader can compare the maximum loss with and without a hypothetical hedge in rupees.
  - After this chapter the reader can explain basis risk in plain words.
  - After this chapter the reader can explain why hedging does not remove the need for position sizing.
- **Key ideas to teach (in order):**
  - Hedge: a second position that offsets part of the first one's risk.
  - A hedge has a price (premium, spread, or lost upside). The cost reduces returns in every period, including good ones.
  - Basis risk: the hedge does not move exactly with the position it protects.
  - A hedge can reduce risk and still leave a loss; it changes the shape of the loss, not its existence.
  - For a small account, hedging costs are usually a large share of the capital being protected.
- **Worked example (rupees, illustrative only):** Hypothetical holding: 100 shares at Rs 500 = Rs 50,000. A hypothetical protective put with strike Rs 470 costs Rs 12 per share = Rs 1,200 (2.4% of Rs 50,000). If the price falls to Rs 400: unhedged loss = 100 x 100 = Rs 10,000. Hedged loss = 100 x 30 (from 500 to 470 before the put protects) + Rs 1,200 premium = Rs 4,200 (8.4%). The hedge reduced the loss and cost Rs 1,200 in the scenarios where the price did not fall.
- **Visual / animation / simulator:** Static two-line chart: unhedged and hedged payoff, labelled illustrative. No interactive simulator.
- **Guided exercise:** Compute the hedged loss if the price falls to Rs 455 with the same hypothetical put. (Answer for reviewer: Rs 4,200.)
  - Hints: below Rs 470 the put's payout offsets the fall, so the hedged loss is capped.
  - Hints: capped loss = loss from 500 to 470 (100 x 30 = Rs 3,000) + premium (Rs 1,200) = Rs 4,200, at any price below 470.
- **Independent exercise:** Write a short paragraph explaining why hedging does not replace the risk-per-trade rule.
- **Quiz focus:**
  - Hedge cost (wrong answer: "a hedge is free protection").
  - Basis risk (wrong answer: "a hedge always moves exactly with the position").
  - Hedge and sizing (wrong answer: "a hedge means I can size up").
  - Scenario: a hedged portfolio that loses in a flat market.
  - Spot the mistake: "I hedged, so the position has no risk."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** Hedging with derivatives is an F&O topic and is not a practice path in this book. Misconception to address: "hedging is how professionals make trading safe".
- **Time-sensitive facts to register:** Contract and charge facts as in T9.1 and T9.2.
- **Sources to cite:** NSE derivatives pages (name); a standard risk management text (name; [VERIFY]).
- **Estimated length:** medium

### T9.4 SEBI's F&O studies as a case study (figures [VERIFY])
- **Page type:** Concept
- **Prerequisites:** T9.1, T9.2, T7.8, T0.1
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can state what question a study of individual traders answers and what it cannot answer.
  - After this chapter the reader can list the method questions to ask of any trading study (sample, period, costs, how losses are measured, participant churn).
  - After this chapter the reader can explain why a percentage of losing participants does not, alone, give an expected value.
  - After this chapter the reader can cite a study figure only from the source, with its date.
- **Key ideas to teach (in order):**
  - Studies of this kind are usually about outcomes for a group of participants over a period. They describe history; they do not forecast any one person.
  - Method questions: which participants, which period, are costs included, how are losses and gains measured, do participants leave the sample, are the same participants tracked over time.
  - A percentage of losers says nothing about the size of wins and losses. Expected value needs both.
  - Survivorship (T7.5) applies to participant data too.
  - Never restate a figure from memory. Quote the study, the date and the figure from the source.
- **Worked example (rupees, illustrative):** Hypothetical group of 1,000 participants, 600 with net losses. A percentage alone seems to show a poor outcome. Hypothetical totals: gains of Rs 4,00,000 across 400 winners, losses of Rs 12,00,000 across 600 losers. Net = 4,00,000 - 12,00,000 = Rs -8,00,000 for the group. A different hypothetical group with 400 losers and larger average wins could net positive. The lesson: read the totals and the method, not one percentage.
- **Visual / animation / simulator:** Static study-reading checklist table. No interactive component.
- **Guided exercise:** Using the worked example, compute the average gain per winner and the average loss per loser.
  - Hints: Rs 4,00,000 / 400 and Rs 12,00,000 / 600.
  - Hints: state which average is larger.
- **Independent exercise:** Write the five method questions you would ask of a SEBI study before quoting it.
- **Quiz focus:**
  - Percentage vs expected value (wrong answer: "if most traders lose, the expected value is negative for any trader").
  - Method (wrong answer: "a study's conclusion does not depend on its sample").
  - Quoting figures (wrong answer: "I remember the headline figure, so I can state it").
  - Scenario: a headline percentage shared without the period or sample.
  - Spot the mistake: "The study proves F&O can never be profitable."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only: write the study-reading checklist in the learning note. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** A study describes outcomes for participants, not a forecast for any owner. Misconception to address: "the study tells me what will happen to me".
- **Time-sensitive facts to register:**
  - Exact title, publication date, period, sample and headline figures of each SEBI study used ([VERIFY: SEBI research and studies page]). Do not state any figure in this book until verified.
- **Sources to cite:** SEBI research and studies publications (name the exact report; [VERIFY]); the report's methodology section.
- **Estimated length:** medium

### T9.5 Algo trading, trading APIs and the SEBI retail algo framework (dates [VERIFY]); why this book does not automate orders
- **Page type:** Concept
- **Prerequisites:** T4.4, T7.10, T9.4
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can distinguish an alert or signal script from a script that places orders.
  - After this chapter the reader can explain, in general terms, what Algo-ID and broker compliance are for, and state the current requirements only from the source.
  - After this chapter the reader can list the costs and data limits to check before using any trading API.
  - After this chapter the reader can explain why this book does not place or automate orders.
- **Key ideas to teach (in order):**
  - Algo trading: rules executed by software. Alerts and signals are not orders; order placement is a separate, regulated step.
  - Trading APIs: programmatic access to a broker. Free tiers may exclude market data; paid tiers may add it [VERIFY: Kite Connect plan contents].
  - SEBI's retail algo framework: requirements for brokers and for retail algo strategies, including identification of algorithms (Algo-ID). Current requirements and effective dates are not stated here [VERIFY].
  - Automation does not remove risk. It repeats mistakes faster, and a bug can place orders the owner did not intend.
  - This book is offline, has no broker API calls and no stored credentials.
- **Worked example (illustrative, no figures):** Two scripts. Script A sends a notification when a price crosses a written level and places nothing. Script B places an order when the same level is crossed. The difference is not the code length; it is the step that sends an order to a broker, which carries compliance and risk duties [VERIFY]. The book supports only the first kind of thinking, in the journal, not in software.
- **Visual / animation / simulator:** Static diagram showing signal, decision, and an order step that is marked "not in this book". No interactive component.
- **Guided exercise:** Classify five described scripts as "alert only", "places orders", or "needs a compliance check first".
  - Hints: ask whether any order leaves the owner's machine toward a broker.
  - Hints: if you are unsure, mark "needs a compliance check first".
- **Independent exercise:** Write three questions to answer from official sources before considering any API, without giving a date or cost.
- **Quiz focus:**
  - Alert vs order (wrong answer: "an alert script is an order script with fewer lines").
  - Free API (wrong answer: "a free API means no compliance applies").
  - Automation risk (wrong answer: "automation removes emotion so it removes risk").
  - Scenario: a script that works in backtest and sends orders in the morning.
  - Spot the mistake: "I will automate my plan so I can stop watching."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only: write the three verification questions in the learning note. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** No automation of orders is taught or supported in this book. Misconception to address: "automated trading is the professional way and avoids my own errors".
- **Time-sensitive facts to register:**
  - SEBI retail algo framework: circular references, effective dates and broker obligations ([VERIFY: SEBI circulars]). Do not state the start date as fact.
  - Algo-ID requirements ([VERIFY: SEBI and exchange circulars]).
  - Kite Connect plan contents: orders, GTT, alerts, and whether market data is included on each plan ([VERIFY: Zerodha Kite Connect pages]).
- **Sources to cite:** SEBI circulars page (name the circular); NSE and BSE algo circular pages (name); Zerodha Kite Connect developer pages (name).
- **Estimated length:** medium

### T9.6 Microstructure, order flow and auctions (deeper)
- **Page type:** Concept
- **Prerequisites:** T1.4, T1.5, T1.6, T1.7
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can explain the general idea of price-time priority in plain words, with the exact NSE rule to be checked at source.
  - After this chapter the reader can calculate the average fill price and the slippage of a market order across two price levels.
  - After this chapter the reader can explain how an opening auction sets one price from the orders collected.
  - After this chapter the reader can explain why a thin order book makes a paper fill less reliable.
- **Key ideas to teach (in order):**
  - Order book: buy orders (bids) and sell orders (asks) at each price level.
  - Price-time priority: general concept; the exact exchange rule is [VERIFY].
  - A market order takes liquidity across levels; its average fill can be worse than the best price shown.
  - Auctions: the pre-open and closing sessions collect orders and set a price; the mechanism and times are [VERIFY].
  - Queue position: a limit order's place in line affects whether and when it fills.
- **Worked example (rupees, per share, illustrative):** Best ask Rs 250.00 for 100 shares; next ask Rs 250.50 for 100 shares. Buy 200 at market. Average fill = (100 x 250.00 + 100 x 250.50) / 200 = Rs 250.25. Slippage against the best ask = 0.25 x 200 = Rs 50. A paper fill at Rs 250.00 would hide this Rs 50.
- **Visual / animation / simulator:** `order-book-sim` (bids and asks, depth, spread, market order walking the book).
- **Guided exercise:** Buy 150 shares with the same book. Compute average fill and slippage.
  - Hints: 100 at 250.00 and 50 at 250.50.
  - Hints: slippage = average fill minus best ask, times shares.
- **Independent exercise:** Explain in writing why a paper fill at the best quoted price overstates the outcome of a market order in a thin book.
- **Quiz focus:**
  - Average fill (wrong answer: "a market order always fills at the best price").
  - Auction (wrong answer: "the opening price is the first trade of the day, with no collection of orders").
  - Queue (wrong answer: "a limit order fills as soon as the price touches it").
  - Scenario: a thin stock with a wide spread at the open.
  - Spot the mistake: a paper log that records market orders at the best ask only.
- **Paper task (journal/Kite demo/lab):** Kite demo, interface only: find the depth view and note which fields it shows. No order is placed. Mode: kite_demo. [VERIFY: current depth view on Kite; do not describe UI features not seen.]
- **Labs used:** none (order-book-sim is a visual)
- **Safety / capital-first note:** Liquidity and fill quality matter more for small accounts in thin stocks. Misconception to address: "the quoted price is the price I will pay".
- **Time-sensitive facts to register:**
  - Pre-open and closing session times and mechanics ([VERIFY: NSE market timings and pre-open pages]).
  - Exchange matching rules and price-time priority ([VERIFY: NSE market microstructure documents]).
  - Circuit limits as they affect auctions ([VERIFY: NSE circuit limit page]).
- **Sources to cite:** NSE market timings and pre-open session pages (name); NSE market microstructure or matching documents (name); LABS.md order-book reference.
- **Estimated length:** medium

### T9.7 FII/DII data and its limits
- **Page type:** Concept
- **Prerequisites:** T1.10, T1.2
- **Learning objectives (measurable, 3-5):**
  - After this chapter the reader can define FII and DII and explain what the daily aggregate reports.
  - After this chapter the reader can calculate net flow from buy and sell values in crore.
  - After this chapter the reader can explain why an aggregate flow figure is not a stock-specific signal.
  - After this chapter the reader can identify timing and definition issues in a flow figure before using it.
- **Key ideas to teach (in order):**
  - FII: foreign institutional investors. DII: domestic institutional investors. Both are categories in the published data, with definitions [VERIFY].
  - Gross buy, gross sell and net are different numbers. Use net only with its gross context.
  - Aggregate flows do not say which stock was bought or sold, or why.
  - Publication timing: the data appears after the session; any use must respect that timing.
  - Flows are one input among many; the book does not treat them as a trading signal.
- **Worked example (rupees, illustrative, in crore):** Hypothetical day: FII buy Rs 3,000 crore, FII sell Rs 2,400 crore. Net = 3,000 - 2,400 = Rs 600 crore. Gross turnover = 3,000 + 2,400 = Rs 5,400 crore. The net figure is 11% of gross turnover (600 / 5,400 = 11.1%). A reader who sees only "FII net buyers Rs 600 crore" misses the size of the gross activity.
- **Visual / animation / simulator:** Static table: gross buy, gross sell, net, with the arithmetic shown. No interactive component.
- **Guided exercise:** Compute net and gross turnover for FII buy Rs 1,800 crore and sell Rs 2,100 crore.
  - Hints: net = buy minus sell (a negative number means net selling).
  - Hints: gross = buy plus sell.
- **Independent exercise:** Write one paragraph on why "FIIs bought, so the market will rise" is not an inference the data supports.
- **Quiz focus:**
  - Net vs gross (wrong answer: "a large net figure always means a large market move").
  - Stock-specific (wrong answer: "aggregate flow tells me what to buy").
  - Timing (wrong answer: "I can act on today's figure before the session").
  - Scenario: a net seller day with a rising market.
  - Spot the mistake: "FII buying proves the trend."
- **Paper task (journal/Kite demo/lab):** None. No practice path. Reflection only: record the day's published figures and their definitions in the learning note, with the source and time. Mode: none.
- **Labs used:** none
- **Safety / capital-first note:** Flow data invites narrative. Misconception to address: "institutions know more, so copying them is safe".
- **Time-sensitive facts to register:**
  - Definition of FII and DII categories and the daily publication time ([VERIFY: NSE FII/DII activity page; SEBI definitions]).
  - Whether values are reported in crore and how revisions are handled ([VERIFY]).
- **Sources to cite:** NSE FII/DII daily activity page (name); SEBI FII regulations pages (name; [VERIFY]).
- **Estimated length:** short

---

## Track 10: Graduation gates

**Purpose.** Measure whether the owner has the educational competence the book teaches, in a form that can be retaken. Gates are assessments, not chapters, and use the gate template below.

**Order.** G1 market knowledge, G2 money math, G3 Kite readiness, G4 risk discipline, G5 strategy validation, G6 paper and forward record, G7 live-readiness review and one-page plan.

**How it serves the owner's goals.** The owner asked for "no pressure to go live" and for proof of understanding, not reading. Gates convert the book's rules into checks the owner can fail and retake. Passing any gate, or all of them, is not proof of profitability and does not unlock real money.

**Global rules for all gates.**
- Every gate screen states: "This measures educational competence. It is not proof of profitability. Nothing here requires or recommends trading with real money."
- Gates can be retaken. No timer. No "go live" prompt.
- All gate state is stored on the device (see each gate). No gate result is sent anywhere.
- Pass thresholds are from PLAN.md section 6. Items marked OPEN need the owner's decision before the gate is built.

### T10.1 Gate G1 market knowledge
- **Purpose:** Confirm the owner can explain how the Indian market works, using Tracks 0 and 1, without relying on recognition.
- **Prerequisites:** T0.1, T0.2, T0.3, T1.1-T1.10
- **Exact pass criteria:**
  - At least 85% correct on the drawn quiz items from Tracks 0 and 1 (PLAN.md section 6).
  - All "explain in your own words" prompts completed. Each prompt has a short list of required points; the owner ticks each point they covered. A prompt is complete when every required point is ticked and the text box is non-empty.
  - Proposed (OPEN): a minimum of 30 drawn items so that 85% is a meaningful threshold.
- **Question types and how randomised:** mcq, multi, spot-the-mistake, and scenario items from the Track 0 and Track 1 pools. Items are drawn per concept tag so every tag in the pool appears at least once. Option order is shuffled per attempt. Explain-in-own-words prompts are drawn from a pool of at least one per track.
- **Retake rules:** Unlimited. Each attempt draws a new set. Retake is available immediately after the explained answers are shown. No penalty and no timer.
- **What the screen must say:** The standard gate line above, plus: "Quiz explanations are shown for every wrong answer. Review them before retaking."
- **What is stored locally:** Attempt log (timestamp, drawn item IDs, answers, score), explain-prompt text and ticked points, pass or fail status with date. IndexedDB via the storage layer; gate status flag in localStorage is not used for results.
- **Time-sensitive facts to register:** None.
- **Sources:** Chapter sources for Tracks 0 and 1 (see their specifications).

### T10.2 Gate G2 money math
- **Purpose:** Confirm the owner can compute trading costs, position sizes and expectancy correctly, and has completed the Rs 2,000-3,000 reality check.
- **Prerequisites:** T2.1-T2.18, T7.8
- **Exact pass criteria:**
  - All numeric questions in a fresh randomised set are correct within tolerance. Cost, position-size and expectancy items are all counted; a single miss fails the attempt (PLAN.md section 6 says "all correct").
  - Proposed tolerance (OPEN): position-size items must match exactly in whole shares; rupee items within Rs 1 of the worked solution; cost items within the tolerance stored in quiz.json and recomputed from the registry.
  - The Rs 2,000-3,000 reality-check module (T2.16) completed, with its checklist ticked.
- **Question types and how randomised:** numeric (integer and rupee answers), scenario, and mcq. Numbers are randomised within ranges stored in quiz.json and recomputed by `packages/core` at draw time, so each answer matches a tested function.
- **Retake rules:** Unlimited. Fresh randomised set each attempt. A failed numeric item shows the worked solution before retake.
- **What the screen must say:** Standard gate line. Plus: "Cost figures come from the facts registry and show their verification date. If a cost fact is stale, cost questions are paused and this gate says so."
- **What is stored locally:** Attempt log with each drawn seed and answer, reality-check checklist state, staleness flag at time of attempt, pass or fail status with date.
- **Time-sensitive facts to register:** Every cost fact the engine uses (Lab 2 registry entries). Do not restate values in the quiz text.
- **Sources:** Lab 2 provenance sources; chapter sources for T2.x.

### T10.3 Gate G3 Kite readiness
- **Purpose:** Confirm the owner knows what each Kite feature does, what each order type and product type does, and the common execution mistakes, and has done the demo checklist. The book cannot verify the demo work.
- **Prerequisites:** T4.1-T4.10
- **Exact pass criteria:**
  - Self-attested Kite demo checklist: every item ticked, drawn from T4.1-T4.9 (PLAN.md section 6).
  - Each item has a short reflection field; empty reflections fail the item.
  - Execution-mistake quiz at least 90% correct on drawn items (PLAN.md section 6).
- **Question types and how randomised:** mcq, spot-the-mistake (for example, a wrong product type in a plan), and scenario (a stop that would not trigger). Drawn from the Track 4 pool, option order shuffled.
- **Retake rules:** The quiz is retakeable as in G1. The checklist can be re-ticked at any time; changes are logged with date.
- **What the screen must say:** Standard gate line. Plus: "This checklist is self-attested. The book cannot check your Kite demo. Zerodha's demo uses dummy data and is for interface practice. [VERIFY wording on support.zerodha.com before quoting it.]"
- **What is stored locally:** Checklist items with ticks, reflection text and dates; quiz attempt log; pass or fail status.
- **Time-sensitive facts to register:** Kite demo wording ([VERIFY: Zerodha support]). Any Kite UI reference must be a recreated illustration, dated.
- **Sources:** Zerodha support pages on the demo (name); chapter sources for T4.x.

### T10.4 Gate G4 risk discipline
- **Purpose:** Confirm the owner stops trading when a daily limit is hit, in simulated scenarios, and does not revenge trade or raise size after a loss.
- **Prerequisites:** T2.11, T2.12, T8.2, T8.4, T8.6, T8.7
- **Exact pass criteria:**
  - In the streak and risk-limit simulators, the owner stops trading when the daily limit is hit in 10 of 10 scenarios (PLAN.md section 6). A scenario is one simulated day.
  - "Stopped" means no further entry in that scenario after the limit is reached, and no size increase in any scenario after a loss.
  - Two multiple-choice items on the rule set must be correct.
- **Question types and how randomised:** simulator scenarios (interactive decisions), and mcq. Scenarios are generated from a seeded generator; each attempt draws ten new seeds. The limit hit point in each scenario is random within the day.
- **Retake rules:** Unlimited. A failed attempt shows which scenario broke the rule and what was done. The next attempt uses ten new seeds.
- **What the screen must say:** Standard gate line. Plus: "The simulator is not a test of market skill. It tests whether you follow a written limit."
- **What is stored locally:** Seeds drawn, decisions per scenario, the scenario where a rule was broken, pass or fail with date.
- **Time-sensitive facts to register:** None.
- **Sources:** PLAN.md section 6; LABS.md Lab 4 experiment 7 (for simulator context).

### T10.5 Gate G5 strategy validation
- **Purpose:** Confirm the owner can run the Lab 4 backtest with costs and a held-out period, and explain the result, the biases and why it may not hold live.
- **Prerequisites:** T7.1-T7.11, T6.4
- **Exact pass criteria (PLAN.md section 6, sharpened):**
  - A Lab 4 run is saved with its manifest (data hash, strategy JSON, parameters, engine version, seed).
  - Costs are on in the run.
  - The held-out period is reported separately from the in-sample period.
  - The written explanation covers: the result; at least three biases checked (look-ahead, survivorship, overfitting, or others); the trial count; and at least three reasons it may not hold live (fills, costs, regime, sample size, liquidity).
  - Each required item in the explanation rubric is ticked by the owner and the text is present for each.
  - The result is never called profitable or ready. The rubric rejects those words.
- **Question types and how randomised:** structured exercise (run the lab, then a rubric-based written explanation), with two scenario questions drawn from T7.x. The seed for the run is drawn from a list of documented seeds, so retakes use a different dataset.
- **Retake rules:** Unlimited. Each retake uses a different documented seed and a new explanation. Earlier runs stay in history.
- **What the screen must say:** Standard gate line. Plus: "A passing explanation is not a validation of a strategy. A strategy that passes this gate still needs forward evidence (G6) and may fail live."
- **What is stored locally:** Run manifests, explanation texts, rubric ticks, seed used, pass or fail with date. Run outputs can be exported as journal_v1 with mode `backtest`.
- **Time-sensitive facts to register:** Cost facts used by Lab 4 (registry).
- **Sources:** LABS.md Lab 4 acceptance criteria; PLAN.md section 6.

### T10.6 Gate G6 paper and forward record
- **Purpose:** Confirm the owner has a journal record of paper and forward-test trades that shows plan adherence and no limit breaches. This is a record gate, not a quiz.
- **Prerequisites:** T8.5, T7.10, T10.4, Lab 5 importer
- **Exact pass criteria (PLAN.md section 6, with OPEN items):**
  - At least 30 trades in mode `forward` or `paper` (PLAN.md section 6). OPEN: owner to confirm the trade count, since 30 trades is statistically thin (LABS.md Lab 5 says it is a floor, not a verdict).
  - Plan adherence at least 90% across those trades. OPEN: owner to confirm the threshold.
  - No limit breaches recorded in the journal's limit-breach log for the same period.
  - Backtest and live rows are not counted. Forward rows from the Lab 5 script are counted separately from manual paper rows, and both counts are shown.
- **Question types and how randomised:** Not a quiz. The gate reads the journal and shows counts and percentages. Nothing is randomised.
- **Retake rules:** Not retakeable. It is a record that continues. The owner can keep logging; no entries can be deleted to improve the count. Deleted trades stay as tombstones (LABS.md Lab 3).
- **What the screen must say:** Standard gate line. Plus: "Paper and manual entries are self-reported. Forward-script rows are reproducible. A record of 30 trades does not show that a strategy works." Show the current count and the thresholds in use.
- **What is stored locally:** Journal rows (IndexedDB, journal_v1), counts shown, limit-breach log, date of last evaluation. The gate status is derived from the journal, not stored as a separate flag.
- **Time-sensitive facts to register:** None. Holiday and market-timing facts used by Lab 5 are registered in T7.10.
- **Sources:** LABS.md Lab 3 and Lab 5; PLAN.md section 6 (G6 row).

### T10.7 Gate G7 live-readiness review and the one-page trading plan
- **Purpose:** Confirm the owner has written, and can print, a one-page plan covering capital, risk, limits, stop rules and withdrawals. Passing G1-G7 enables only a cautious message; it authorises nothing.
- **Prerequisites:** T10.1-T10.6, T2.15, T2.17, T8.4, T8.7
- **Exact pass criteria:**
  - Written self-review form complete with each field filled: capital to be used (Rs), risk per trade (%), daily, weekly and monthly loss limits (Rs), stop rules, maximum number of trades per day, withdrawal policy, and the amount that stays untouched.
  - Risk per trade at or below 2% (the Lab 1 warning level). Any value above 2% fails with a note; any value above 5% fails with the Lab 1 hard note. (LABS.md Lab 1.)
  - Capital to be used is entered as a number within the book's stated range (the owner's own figure; the book does not recommend a number).
  - Gates G1-G6 are all passed.
  - The one-page plan is generated from the form and shows every field. Printing is a view of the stored plan, not a second copy.
  - OPEN: whether a waiting period (for example, 7 days) between writing and passing is required. Owner to decide.
- **Question types and how randomised:** Structured form, not a quiz. The reviewer prompts are fixed; no randomisation.
- **Retake rules:** The form can be edited and re-evaluated at any time. Each save is versioned with a date. Earlier versions stay in history.
- **What the screen must say:** Standard gate line. Plus: "Passing all gates enables a 'may consider small real-money stage' message with caveats. It does not say you are ready to profit. Real money is your decision, made outside this book, and you can stop at any time. There is no pressure to go live." The message never says "ready to profit".
- **What is stored locally:** Plan versions (IndexedDB), the form values, evaluation result with date, and the gate status for G1-G6 read from their own stores. The printed plan is not stored as a separate file.
- **Time-sensitive facts to register:** Withdrawal and tax notes are not stated in the gate; if the gate refers to tax, it links to the tax chapter and its verification status (PLAN.md section 11, item 7).
- **Sources:** PLAN.md section 6 (G7 row); LABS.md Lab 1 warning and hard-note levels; T2.17 and T2.15 sources.

---

## Open questions for the reviewer

1. **Track 9 facts.** SEBI study title, date, period, sample and figures are not stated anywhere in this file. Confirm which SEBI report is used as the case study in T9.4, and whether the case study should be included in the book at all (PLAN.md says yes).
2. **Algo framework dates.** T9.5 deliberately gives no dates or Algo-ID details. Confirm the exact requirements and dates from SEBI circulars before writing any sentence about them.
3. **Kite demo wording.** T7.10, T10.3 and T4-related chapters quote "Zerodha has said it has no paper-trading account". Confirm exact wording on support.zerodha.com before quoting.
4. **G6 thresholds.** Trade count (30) and adherence (90%) are PLAN.md defaults and are flagged OPEN there. Owner to confirm.
5. **G2 tolerances.** Tolerance values for cost and expectancy items are proposals. Owner or reviewer to set them in quiz.json.
6. **G1 question count.** Proposed minimum of 30 drawn items. Confirm.
7. **G7 waiting period.** Whether a waiting period between writing and passing the plan is required. Owner to decide.
8. **G4 scenario count.** PLAN.md says 10 of 10. This file applies it per attempt with fresh seeds. Confirm the reading.
9. **Retake rules.** PLAN.md is silent on retake limits, so this file proposes unlimited retakes with fresh draws. Confirm.
10. **Track 9 exercises.** Exercises are reflection only. Confirm that the reviewer accepts worked examples with hypothetical F&O arithmetic in a theory chapter, since the brief forbids a practice path but allows theory.
11. **Disclaimer wording.** PLAN.md section 7 leaves the standing disclaimer open. Gate screens use the standard gate line until it is decided.
12. **Lab 1 limits on chapter 8.** T8.7 uses illustrative 6% and 5% monthly limits. These are not defaults; the owner sets real limits. Confirm the illustrative wording is acceptable.
13. **Chapter length.** Several chapters (T7.3, T7.10) may need splitting per the brief (for example T7.3a and T7.3b). Not split here; reviewer to decide.

## Facts to register (collected)

Each entry gives the fact to verify and the source page name. No values are stated here.

| Chapter | Fact to verify | Source to check |
|---|---|---|
| T7.2 | Yahoo Finance CSV columns, adjustment method, personal-use terms | Yahoo Finance help and terms pages |
| T7.2 | NSE bhavcopy-style file layout and terms for those files | NSE historical data or reports page and terms of use |
| T7.3 | Circuit limit and price band rule, as it affects gap fills | NSE circuit limit and price band page |
| T7.3, T10.2 | Every cost rate used by the engine | Zerodha charges page; the facts registry (`data/facts.json`) |
| T7.5 | Availability and terms of delisted-stock price history | Data source help pages |
| T7.5 | Index constituent history and methodology | NSE Indices methodology and constituent pages |
| T7.10 | Kite demo and paper-trading wording | Zerodha support pages |
| T7.10 | Cash market close time and safety margin used by the script | NSE market timings page |
| T7.10 | Holiday list used by the script | NSE holiday list |
| T7.10 | Terms of the chosen data source (yahoo-finance2 or CSV files) | Data source terms pages |
| T9.1 | Contract specifications, lot sizes, expiry rules | NSE derivatives contract specifications page |
| T9.1 | Margin requirements and rules | SEBI margin circulars; NSE margin pages |
| T9.1 | Daily settlement rules | NSE clearing corporation pages |
| T9.2 | Option contract specifications, expiry schedule, strike intervals | NSE derivatives pages |
| T9.2 | Charges and STT on options | Zerodha charges page; SEBI and NSE circulars |
| T9.2 | F&O eligibility and participant rules | SEBI and NSE pages |
| T9.4 | SEBI study title, publication date, period, sample and headline figures | SEBI research and studies publications page |
| T9.5 | SEBI retail algo framework circular references, effective dates, broker obligations | SEBI circulars page |
| T9.5 | Algo-ID requirements | SEBI and exchange circulars |
| T9.5 | Kite Connect plan contents and whether market data is included | Zerodha Kite Connect developer pages |
| T9.6 | Pre-open and closing session times and mechanics | NSE market timings and pre-open pages |
| T9.6 | Exchange matching rules and price-time priority | NSE market microstructure documents |
| T9.6 | Circuit limits as they affect auctions | NSE circuit limit page |
| T9.7 | FII and DII definitions and daily publication time | NSE FII/DII daily activity page; SEBI FII regulations pages |
| T9.7 | Reporting units and revision handling | NSE FII/DII daily activity page |
| T10.3 | Kite demo wording | Zerodha support pages |
| T10.2 | Every cost fact used by the reality-check and cost questions | Lab 2 provenance sources in the facts registry |
