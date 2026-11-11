<!-- meta
id: T2.8
title: Expectancy and profit factor
page_type: Math/Calculator
prerequisites: [T2.7]
labs: [Lab 3, Lab 1]
estimated_minutes: 30
-->

# Expectancy and profit factor

## Hook

Nine wins out of ten sounds like a strong record. In this hypothetical system, each of the nine wins is Rs 300. The one loss is Rs 4,000. Over the ten trades, the wins add up to Rs 2,700. The loss takes away Rs 4,000. The net result is minus Rs 1,300. The win rate was 90%, and the account still went down.

## The idea

A trade result has two parts. One is how often you win (the **win rate**). The other is how big the wins and losses are (the **average win** and **average loss**). You need both.

- **Expectancy per trade** is what one trade is worth on average. In words: the win rate times the average win, minus the loss rate times the average loss. In symbols: E = W x avgWin - (1 - W) x avgLoss. Here W is the win rate, and 1 - W is the loss rate.
- **In R**, measure wins and losses in units of R (the planned risk per trade): E_R = W x avgWinR - (1 - W) x avgLossR.
- **Gross profit** is the total of the winning trades. **Gross loss** is the total of the losing trades, as a positive number.
- **Profit factor** = gross profit / gross loss. Above 1 means gross profit is bigger than gross loss in that sample. With no losing trades it cannot be worked out, because the divisor is zero.

Points to keep in mind:

- Expectancy is an average over many trades. It is not a prediction of the next trade.
- Costs must be included to get net expectancy. The examples below are before costs.
- A few trades can produce any average. How sure you can be is taught in *Metrics and their limits*. Lab 3 shows a "too few trades to conclude anything" note below 30 trades.
- Win rate is a frequency, not a result. Expectancy combines frequency and size.

## See it

<!-- OPEN: The spec asks for a static paired bar chart of profit and loss per trade for X and Y. No component name fits a static chart, so a table is used. The spot-the-mistake widget in Try it can reuse the same numbers. -->

| | System X (hypothetical) | System Y (hypothetical) |
|---|---|---|
| Win rate | 90% | 40% |
| Average win | Rs 300 (0.3R) | Rs 2,000 (2R) |
| Average loss | Rs 4,000 (4R) | Rs 1,000 (1R) |
| Expectancy per trade | minus Rs 130 (minus 0.13R) | plus Rs 200 (plus 0.2R) |
| Profit factor over 10 trades | 0.675 | 1.33 |

The table shows X with frequent, small wins and one large loss. Y has fewer, larger wins. Y has the higher expectancy, even though it wins less often.

## Worked example

*Hypothetical.* R = Rs 1,000, which is 2% of Rs 50,000.

**System X**: 9 wins of Rs 300 (0.3R) and 1 loss of Rs 4,000 (4R, a gap through the stop).

| Step | Working | Result |
|---|---|---|
| Win part | 0.9 x 300 | Rs 270 |
| Loss part | 0.1 x 4,000 | Rs 400 |
| Expectancy | 270 - 400 | minus Rs 130 per trade (minus 0.13R) |
| Gross profit (10 trades) | 9 x 300 | Rs 2,700 |
| Gross loss (10 trades) | 1 x 4,000 | Rs 4,000 |
| Profit factor | 2,700 / 4,000 | 0.675 |
| Net over 10 trades | 10 x minus 130 | minus Rs 1,300, which is 2.6% of Rs 50,000 |

**System Y**: 40% wins of 2R (Rs 2,000) and 60% losses of 1R (Rs 1,000).

| Step | Working | Result |
|---|---|---|
| Win part | 0.4 x 2,000 | Rs 800 |
| Loss part | 0.6 x 1,000 | Rs 600 |
| Expectancy | 800 - 600 | plus Rs 200 per trade (plus 0.2R) |
| Gross profit (10 trades) | 4 x 2,000 | Rs 8,000 |
| Gross loss (10 trades) | 6 x 1,000 | Rs 6,000 |
| Profit factor | 8,000 / 6,000 | 1.33 |

Y has the higher expectancy despite the lower win rate. Neither example is evidence that either approach works.

## Try it

<!-- component: spot-the-mistake | system: X | wins: 9 | winSize: 300 | losses: 1 | lossSize: 4000 | caption: Use the System X numbers to find the claim that does not follow from the win rate. -->

### Guided exercise

Task: System Z (hypothetical): 60% wins of Rs 1,000 and 40% losses of Rs 800. Over 10 trades, work out the expectancy per trade and the profit factor.

Hints:

1. Work out the win part (0.6 x 1,000) and the loss part (0.4 x 800) for one trade.
2. Over 10 trades, count 6 wins and 4 losses.
3. Profit factor = gross profit / gross loss over those 10 trades.

**Answer:** Expectancy = 600 - 320 = plus Rs 280 per trade. Over 10 trades: gross profit = 6 x 1,000 = Rs 6,000. Gross loss = 4 x 800 = Rs 3,200. Profit factor = 6,000 / 3,200 = 1.875.

### Independent exercise

Task: System W (hypothetical): 75% wins of Rs 500 and 25% losses of Rs 2,000. Work out the expectancy per trade and the profit factor on 4 trades.

<details><summary>Check your answer</summary>

Expectancy = 0.75 x 500 - 0.25 x 2,000 = 375 - 500 = minus Rs 125 per trade.

On 4 trades, the expected split is 3 wins and 1 loss. Gross profit = 3 x 500 = Rs 1,500. Gross loss = 1 x 2,000 = Rs 2,000. Profit factor = 1,500 / 2,000 = 0.75.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover expectancy arithmetic, the profit factor with no losses, the comparison of two systems, and the trap of judging on win rate alone.

## Paper task

Mode: **learning note**. Log it in Lab 3 (or on paper until the journal app is ready).

1. Enter ten hypothetical rows for System X: nine rows at Rs 300 and one row at minus Rs 4,000.
2. Open the Lab 3 statistics view.
3. Check that the expectancy shows minus Rs 130 per trade (minus 0.13R), and that the profit factor shows 0.675.
4. Write one sentence. Explain why a 90% win rate can still give a negative expectancy.

<!-- OPEN: The learning-note mode is in the *How to use this book* journal mode list but not in the Lab 3 mode list (paper, live, forward, backtest, kite_demo). Confirm before the journal app is built. -->

## Limits and common mistakes

- Expectancy shown here is before costs. Net expectancy is lower. Check it with costs included.
- A handful of trades is noise. The minimum of 30 trades (gate G6, PLAN section 6) is a floor for a check. It is not a verdict on any system.
- One large loss can dominate a sample. Check the largest loss before you trust an average.
- These systems are invented for arithmetic. Neither example says anything about a real strategy.
- A high win rate is not proof of a good system on its own. Use expectancy and profit factor, and state the sample size.

## Remember

- Expectancy = win rate x average win - loss rate x average loss.
- Profit factor = gross profit / gross loss. It cannot be worked out with no losses.
- Expectancy is an average over many trades, not a prediction.
- Include costs before you read any result.
- Win rate is a frequency. Judge a system on expectancy, with its sample size.

## Sources and verification

Sources (names only):

- Chapter *Metrics and their limits* (metrics and their limits), for further reading

Items to verify: none for this chapter. All numbers are hypothetical.

<!-- standing-disclaimer -->
