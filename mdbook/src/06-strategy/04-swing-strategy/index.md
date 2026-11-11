<!-- meta
id: T6.4
title: The fully specified swing strategy
page_type: Strategy
prerequisites: [T6.2, T6.3, T5.2, T5.3, T2.5, T2.11, T3.5]
labs: [Lab 1, Lab 3, Lab 4, Lab 5]
estimated_minutes: 35
-->

# The fully specified swing strategy

## Hook

A trader buys a share after a breakout. He has no written stop. The price falls, so he sets a stop after the fall, at a lower level. The loss grows far beyond what he planned. Hypothetical example. A complete rule set prevents this. Every rule is written before the trade, and every number is fixed in advance. This chapter goes through one example rule set, line by line. It is an illustration, not a recommendation.

## The idea

This is a rule set to test. It is not advice. It is an example of how a strategy can be written in full. It carries no evidence of results. The book never recommends it, or any stock.

A complete rule set answers every question a trade can raise. When to look. When to buy. Where to stop. When to sell. How many shares. Each rule has a name and a number. The table below shows the rules of this example.

| Rule | What it says | Numbers used |
|---|---|---|
| Setup | Today's close is above the highest high of the previous 55 bars, not counting today. Today's close is also above the 50-day simple moving average. | 55 bars, 50 days |
| Entry | Buy at the next day's open after the setup close. | Next open |
| Initial stop | Entry price minus 2.5 times ATR(14). | 2.5, 14 |
| Exit | Highest close since entry minus 3 times ATR(14). The trailing stop only moves up. | 3, 14 |
| Sizing | Risk 1 percent of capital per trade. Apply the cash cap and the 25 percent concentration cap. | 1 percent, 25 percent |
| Filters | Minimum price Rs 50. Minimum 20-day average traded value Rs 5 crore. At most 4 open positions. | Rs 50, Rs 5 crore, 4 |
| Loss limits | No new entries after the daily or weekly loss limit is reached. | Set in the plan |
| Leverage and averaging | No leverage. No averaging down. | None |

Some points about these rules:

- **The setup uses the close, not the high.** The highest high is only the level to beat. The close must beat it. See *Moving averages* for the 50-day average.
- **Entry is the next open.** The signal is known only after the close. A trade cannot be filled at a price that has already passed. This is the realism rule. It also avoids *Look-ahead bias*.
- **ATR measures typical daily movement.** The stop is set as a multiple of ATR, so it is wider when price moves more. See *ATR and volatility, used for stops*.
- **The exit trails.** The trailing stop follows the highest close since entry. It never moves down. A bar that opens below the stop exits at the open. A bar that trades below the stop, but opens above it, exits at the stop price.
- **Sizing uses three limits.** The risk budget, the cash cap and the concentration cap are all checked. The smallest one decides the size. See *Position sizing step by step*.
- **The filter values are choices.** The price, traded value and position count are design choices for this example. They are not market facts.
- **Costs and taxes are included in any result.** A result without them is not complete.

Changing a number after you see the results is a common trap. It fits the rule to the past. See *Overfitting and the number of things you tried*.

## See it

<!-- component: strategy-simulator | mode: rules | spec: swing-example | caption: The example rule set loaded on synthetic data, with the rule check shown for each bar -->

Load the example rule set. Step through the bars. For each bar, read the setup check, the entry check, the stop and the exit check. The rule results show why the simulator acted, or did not act, on each bar.

## Worked example

**Hypothetical.** Capital Rs 50,000. Signal close Rs 255. The setup is assumed to be met. Next day's open is Rs 257, so the entry is Rs 257. ATR(14) is Rs 4.00.

| Step | Calculation | Result |
|---|---|---|
| 1. Initial stop | 257 - (2.5 x 4.00) = 257 - 10.00 | Rs 247 |
| 2. Risk per share | 257 - 247 | Rs 10 |
| 3. Risk budget | 50,000 x 1% | Rs 500 |
| 4. Raw shares | floor(500 / 10) | 50 |
| 5. Cash cap | floor(50,000 / 257) | 194 |
| 6. Concentration cap | floor(50,000 x 25% / 257) = floor(12,500 / 257) | 48 |
| 7. Shares | minimum of 50, 194 and 48 | **48** |
| 8. Planned loss | 48 x Rs 10 | Rs 480, which is 0.96 percent of capital |

The binding constraint is the concentration cap, at 48 shares.

Later, the highest close since entry is Rs 280. ATR(14) is Rs 5.00.

| Step | Calculation | Result |
|---|---|---|
| 9. Trailing stop | 280 - (3 x 5.00) = 280 - 15 | Rs 265 |
| 10. Exit at the stop | Price falls to Rs 265 | Exit at Rs 265 |
| 11. Gross gain | (265 - 257) x 48 = 8 x 48 | Rs 384 |
| 12. Gain in R | 384 / 480 | 0.8R |

The gain is Rs 384, before costs and taxes. [VERIFY: cost and tax inputs for this example] The result is hypothetical.

## Try it

### Guided exercise

**Task.** Entry Rs 300. ATR(14) Rs 6.00. Capital Rs 50,000. Compute the initial stop, the risk per share, the shares and the planned loss.

Hints:

1. The stop is 2.5 times ATR below entry. That is 2.5 x Rs 6.00 = Rs 15.
2. The raw shares are floor(Rs 500 / risk per share).
3. Check the cash cap and the concentration cap. Then take the smallest.

**Answer:**

- Initial stop: 300 - 15 = **Rs 285**.
- Risk per share: Rs 15.
- Raw shares: floor(500 / 15) = floor(33.3) = 33.
- Cash cap: floor(50,000 / 300) = 166.
- Concentration cap: floor(12,500 / 300) = floor(41.7) = 41.
- Shares: minimum of 33, 166 and 41 = **33**. The binding constraint is the risk budget.
- Planned loss: 33 x Rs 15 = **Rs 495**.

### Independent exercise

**Task.** The highest close since entry is Rs 320. ATR(14) is Rs 4.00. Compute the trailing stop. Then state whether the trailing stop can move down on a later bar.

<details><summary>Check your answer</summary>

- Trailing stop: 320 - (3 x 4.00) = 320 - 12 = **Rs 308**.
- It cannot move down. The trailing stop only moves up, so it stays at Rs 308 or rises on a later bar.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks how to read the rules, the trailing stop, and the setup check that uses the bar before today.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Pick one week of daily bars from your chart history.
2. Apply the rules in the table above, one bar at a time. Write the decision for each bar.
3. For each planned trade, record the planned fields: entry, initial stop, shares, planned loss and the reason.
4. Mark every entry hypothetical.
5. Do not write any profit figure.

## Limits and common mistakes

- This specification is not evidence of profit. A rule set that passes a backtest has not shown that it works live.
- Forward testing and live trading are different. Prices, fills and emotions change when real money is at risk.
- The filter values and the 55-bar and 50-day settings are choices. Changing them after you see results fits the past.
- A gap can move the exit far from the stop. See *Gaps and what they mean for stops*. [VERIFY: circuit price band rules for gap exits]
- Costs, taxes and holidays are not in the arithmetic above. [VERIFY: NSE holiday list] [VERIFY: cost and tax inputs]

## Remember

- A complete rule set states setup, entry, stop, exit, sizing and filters, with numbers.
- Entry is the next open after the setup close. The setup uses the close.
- The initial stop is entry minus 2.5 times ATR(14). The trailing stop is highest close minus 3 times ATR(14), and only moves up.
- Shares are the smallest of the risk limit, the cash cap and the concentration cap.
- A written example is not a recommendation and carries no record of results.

## Sources and verification

- Book chapters: *ATR and volatility, used for stops*, and *Position sizing step by step*.
- The testing rules for realism, in *Backtesting basics and the realism contract*.
- [VERIFY: cost and tax inputs for this example]
- [VERIFY: circuit price band rules for gap exits]
- [VERIFY: NSE holiday list]

<!-- facts-needed: cost and tax inputs; circuit price band rules and their effect on exits; trading holiday list. Filter thresholds are design choices, not facts. -->

<!-- OPEN: The rule set is shown as a table. The structured specification in the source notes is a proposal with a grammar still to be fixed. Confirm the book should show the table only. -->

<!-- standing-disclaimer -->
