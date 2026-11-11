<!-- meta
id: T7.9
title: Monte Carlo of trade order
page_type: Lab
prerequisites: [T7.8, T2.9, T2.10]
labs: [Lab 4, Lab 3]
estimated_minutes: 30
-->

# Monte Carlo of trade order

## Hook

Two traders use the same ten trades. This is a hypothetical example. Trader A meets the winning trades first, and the account climbs. Trader B meets the same losses in a bunch, and the account falls by Rs 4,000 before it recovers. Both traders end with the same total. Only the path differs. A single backtest shows one path only. This chapter shows how to test many paths for the same trades.

## The idea

Reordering trades does not change the expectancy. The total and the average stay the same. But the path changes. The maximum drawdown and the longest losing streak can change a lot.

A **Monte Carlo** test works like this:

1. Take the list of trade results.
2. Shuffle the order, or resample the list, to make a new path.
3. Record the maximum drawdown and the longest losing streak for that path.
4. Repeat 1,000 times or more.

Read the results as percentiles. The 5th percentile is a low value. The 50th is the middle. The 95th is a high value. For drawdown, the 95th percentile means that 95 runs in every 100 had a drawdown no bigger than that figure. Five runs in every 100 had a bigger drawdown. Do not read only the average.

The test has one big assumption. It treats each trade as independent. That means one trade does not depend on the one before it. Real losses often cluster in hard periods of the market. So this test can understate the streaks you may meet.

**Probability of ruin** is the chance that your account falls to a level you chose before the run. For example, a hypothetical level of Rs 25,000 on Rs 50,000 of capital. The level must be written down before the run. Choosing it after you see the results is a form of hindsight.

The output is a range of possible paths for the same trades. It is not a forecast of your next drawdown.

## See it

Use this table after a run. Fill it in from your own results. Read the 50th row first, then the 95th row.

| Percentile | Max drawdown (Rs) | Longest losing streak (trades) |
|---|---|---|
| 5th | | |
| 50th | | |
| 95th | | |

<!-- component: monte-carlo-shuffle | caption: Shuffle the order of the same trades many times and read the range of drawdowns and losing streaks. -->

## Worked example

**Hypothetical system.** Win rate 35 percent. Average win 2R. Average loss 1R. Capital Rs 50,000. Risk 1 percent of capital, which is Rs 500 per trade.

**Step 1. Expectancy in R.** (0.35 x 2) - (0.65 x 1) = 0.70 - 0.65 = **+0.05R per trade**.

**Step 2. Expectancy in rupees.** 0.05 x Rs 500 = **Rs 25 per trade**, before costs. This is a thin edge.

**Step 3. A specific run of 5 losses.** The chance of five losses in a row, starting at a given trade, is 0.65 to the power of 5. That means 0.65 x 0.65 x 0.65 x 0.65 x 0.65. The result is about **0.116, or 11.6 percent**.

**Step 4. Rupee cost of that run.** 5 x Rs 500 = **Rs 2,500**. That is 2,500 / 50,000 = **5 percent of capital**.

## Try it

### Guided exercise

**Task.** Work out 0.65 to the power of 3. Then work out the rupee loss of a 3-trade losing run at 1R = Rs 500.

Hints:

1. Multiply 0.65 by itself three times.
2. A 3-trade losing run costs 3 x Rs 500.

**Answer:**

- 0.65 x 0.65 = 0.4225. Then 0.4225 x 0.65 = **0.274625**, which is about **27.5 percent**.
- Rupee loss: 3 x Rs 500 = **Rs 1,500**.

### Independent exercise

**Task.** Your Monte Carlo 95th-percentile maximum drawdown is Rs 9,000 on capital of Rs 50,000. Explain what this number does and does not tell you. Then say what you would check before you trust it.

<details><summary>Check your answer</summary>

- The figure is 9,000 / 50,000 = 18 percent of capital.
- What it tells you: in 95 runs out of every 100, the drawdown was Rs 9,000 or less. This is for the same trades, shuffled, under the test's assumptions.
- What it does not tell you: it is not the worst case. About 1 run in 20 had a bigger drawdown. It is not a forecast of your next drawdown.
- What to check first:
  - The trade list is complete and includes costs and realistic fills.
  - The run used 1,000 or more shuffles.
  - The risk per trade is the one you would really use.
  - The assumption that trades are independent is noted as a limit.
  - Any probability of ruin uses a level written down before the run.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks why reordering changes the path but not the expectancy. It also checks percentiles and the independence assumption.

## Paper task

Mode: **backtest**, which means the trades come from past data.

1. Take your own trade list from a backtest run. Use Lab 4, experiment 7, if the lab is ready.
2. If the lab is not ready, copy your trade list into a spreadsheet and shuffle the order. Run as many shuffles as you can. Write down how many you ran. Fewer than 1,000 runs is a small sample.
3. For each run, record the maximum drawdown and the longest losing streak. Then record the 5th, 50th and 95th percentile of each.
4. Write the figures in the table in your journal (or on paper until the journal app is ready). Write the number of runs beside it.
5. Write one sentence: what the range does and does not tell you.

## Limits and common mistakes

- The output is a range of possible orders for the same trades. It is not a forecast of your next drawdown.
- The trades are treated as independent. Real losses can cluster in hard market periods, so the streaks can be understated.
- The 95th percentile is not the worst case. Some runs can be worse than it.
- The result depends on the trade list. A short or lucky list gives a range that looks safer than it is.
- Costs, slippage and gaps only count if they are already in the trade list (*Slippage*).

## Remember

- Reordering trades keeps the expectancy the same. It can change the drawdown and the streaks.
- Read the 5th, 50th and 95th percentiles, not only the average.
- Each trade is treated as independent in this test. That is a limit.
- A probability of ruin needs a level you write down before the run.
- The result is a range of paths for the same trades. It is not a forecast.

## Sources and verification

- This book names no single reference on risk of ruin. Treat any figure from a simulation as one possible range, not a promise.
- The backtest lab's notes on the Monte Carlo experiment.

<!-- standing-disclaimer -->
