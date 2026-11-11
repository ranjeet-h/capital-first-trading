<!-- meta
id: T7.8
title: Metrics and their limits
page_type: Math/Calculator
prerequisites: [T2.7, T2.8, T2.9, T7.3]
labs: [Lab 3, Lab 4]
estimated_minutes: 30
-->

# Metrics and their limits

## Hook

A test report shows a win rate of 50 percent, a profit factor of 2.2 and a maximum drawdown of Rs 1,000. These are hypothetical figures. A reader may think the rule is both strong and safe. But the report is built from only six trades. Six trades cannot show whether a rule works. This chapter explains each number, shows how to work it out by hand, and says what each number cannot tell you.

## The idea

Start with a list of trades. Each trade has a result in rupees. A winning trade has a positive number. A losing trade has a negative number. Keep the signs clear.

- **Win rate** is the number of winning trades divided by the total number of trades. It is the share of trades that made money.
- **Average win** is the total of the winning trades divided by the number of wins.
- **Average loss** is the total of the losing trades divided by the number of losses. Show it as a positive number.
- **Expectancy in rupees** is (win rate x average win) minus (loss rate x average loss). The loss rate is 1 minus the win rate. It is the average result per trade in this sample. It does not promise the next trade.
- **Expectancy in R** is the expectancy in rupees divided by the rupee risk of one R. One R is your planned loss on one trade (see *Risk per trade and stop-loss distance*).
- **Profit factor** is gross profit divided by gross loss. Gross profit is the total of the wins. Gross loss is the total of the losses, shown as a positive number. If there are no losses, the profit factor cannot be worked out.
- **Equity curve** is the running total of trade results. It starts at zero.
- **Maximum drawdown** is the largest fall on the equity curve. It is measured from a high point to a later low point. It is not measured from the start.
- **Sharpe ratio** is the average return above a safe rate, divided by how much the returns move up and down. It assumes returns are spread in a fairly regular way around the average. Trading returns often do not follow that pattern. The result also changes with the safe rate you pick. The backtest lab uses 0 as the default safe rate and labels the metric as weak.

The lab shows a warning under 30 trades: too few trades to conclude anything. No single metric captures risk. A high win rate or a high profit factor does not mean low risk.

## See it

<!-- component: drawdown-compounding | trades: 1000, -500, 1500, -500, -500, 800 | caption: Equity curve of the six worked-example trades, showing the peak and the later low that give the maximum drawdown -->

Find the highest point before the largest fall. Then find the lowest point after it. The gap between those two points is the maximum drawdown in the example. The win rate and the other metrics are worked out from the trade list, not from the picture.

## Worked example

**Hypothetical.** Six trades, in rupees: +1,000, -500, +1,500, -500, -500, +800. Planned risk per trade is Rs 500, so 1R = Rs 500.

| Trade | Result (Rs) | Equity after trade (Rs) |
|---|---|---|
| 1 | +1,000 | 1,000 |
| 2 | -500 | 500 |
| 3 | +1,500 | 2,000 |
| 4 | -500 | 1,500 |
| 5 | -500 | 1,000 |
| 6 | +800 | 1,800 |

**Step 1. Wins and losses.** Three wins total Rs 3,300 (1,000 + 1,500 + 800). Three losses total Rs 1,500 (500 + 500 + 500).

**Step 2. Win rate.** 3 / 6 = **50%**.

**Step 3. Averages.** Average win = 3,300 / 3 = **Rs 1,100**. Average loss = 1,500 / 3 = **Rs 500**.

**Step 4. Expectancy in rupees.** (0.5 x 1,100) - (0.5 x 500) = 550 - 250 = **Rs 300 per trade**.

**Step 5. Expectancy in R.** 300 / 500 = **0.6R**.

**Step 6. Profit factor.** 3,300 / 1,500 = **2.2**.

**Step 7. Maximum drawdown.** The highest point is Rs 2,000, after trade 3. The lowest point after it is Rs 1,000, after trade 5. The fall is 2,000 - 1,000 = **Rs 1,000**.

**Check.** Net result = 3,300 - 1,500 = Rs 1,800. This matches the last equity figure.

Six trades is far too few to conclude anything. The numbers describe these six trades only. This example does not work out the Sharpe ratio. That needs a longer list of returns and a chosen safe rate.

## Try it

### Guided exercise

**Task.** Recompute the expectancy with these trades: +600, -300, +900, -300 (in Rs). Then express the result in R, using a rupee risk of Rs 300 per trade.

Hints:

1. Find the wins and losses first, then the averages.
2. Express the result in R by dividing by the rupee risk of Rs 300.

**Answer:**

- Wins: 600 and 900, total Rs 1,500, from 2 trades. Losses: 300 and 300, total Rs 600, from 2 trades.
- Win rate = 2 / 4 = 50%.
- Average win = 1,500 / 2 = Rs 750. Average loss = 600 / 2 = Rs 300.
- Expectancy = (0.5 x 750) - (0.5 x 300) = 375 - 150 = **Rs 225 per trade**.
- Check: net result = 1,500 - 600 = 900. 900 / 4 = 225.
- In R: 225 / 300 = **0.75R**.

### Independent exercise

**Task.** Use these ten hypothetical trades, in rupees: +800, -400, +1,200, -400, -400, +600, -400, +1,000, -400, +500. Planned risk per trade is Rs 400, so 1R = Rs 400. Work out the win rate, the average win, the average loss, the expectancy in rupees and in R, the profit factor and the maximum drawdown. Then write one sentence on what this sample can and cannot show.

<details><summary>Check your answer</summary>

- Win rate: 5 wins out of 10 trades = 50%.
- Total wins: 800 + 1,200 + 600 + 1,000 + 500 = Rs 4,100. Average win = 4,100 / 5 = Rs 820.
- Total losses: five trades of Rs 400 = Rs 2,000. Average loss = 2,000 / 5 = Rs 400.
- Expectancy = (0.5 x 820) - (0.5 x 400) = Rs 210 per trade. Check: net result 4,100 - 2,000 = 2,100, and 2,100 / 10 = 210.
- Expectancy in R: 210 / 400 = 0.525R.
- Profit factor: 4,100 / 2,000 = 2.05.
- Maximum drawdown: the equity curve goes 800, 400, 1,600, 1,200, 800, 1,400, 1,000, 2,000, 1,600, 2,100. The high point is Rs 1,600 after trade 3. The low point after it is Rs 800 after trade 5. The fall is Rs 800.
- Sample sentence: Ten trades net Rs 2,100. That is far below 30, so the numbers cannot show whether the rule works.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the expectancy formula, profit factor with no losses, maximum drawdown, the limits of Sharpe, and reading metrics from a small sample.

## Paper task

Mode: **backtest**, which means the trades come from past data.

1. Write the six worked-example trades in your journal, in order, as mode backtest. Use Lab 3 for this if it is ready. If it is not, use paper or a spreadsheet.
2. Read the figures the journal or spreadsheet gives you. Check them against the worked example: win rate 50 percent, expectancy Rs 300 per trade, profit factor 2.2, maximum drawdown Rs 1,000.
3. If any figure differs, find the error before you go on.
4. Write one sentence: six trades are too few to conclude anything.

## Limits and common mistakes

- Each number describes the trades in the list. It does not describe the next trade.
- A small sample can make any metric look strong or weak by chance. The lab warns when there are under 30 trades.
- A high win rate does not mean low risk. A rule can win often and still lose a lot on its few large losses.
- Sharpe ratio depends on the safe rate you pick. Trading returns often do not follow the pattern it assumes.
- Costs are not in these figures unless the trade list already includes them (*Costs on a trade*).

## Remember

- Expectancy = (win rate x average win) - (loss rate x average loss).
- Profit factor = gross profit divided by gross loss. With no losses, it cannot be worked out.
- Maximum drawdown is measured from a high point to a later low point, not from the start.
- Sharpe ratio depends on the safe rate and on how returns are spread.
- Under 30 trades, no metric concludes anything.

## Sources and verification

- Sharpe, *Mutual Fund Performance* (1966).
- The backtest lab's notes on the dashboard and its metric list.

<!-- facts-needed: none for time-sensitive facts. All numbers are hypothetical arithmetic. The year of the Sharpe paper comes from the chapter brief. -->

<!-- OPEN: The spec asks the reader to compute six metrics in the independent exercise. Sharpe ratio is left out of the hand calculation because it needs a longer return series and a chosen safe rate that the chapter does not fix. It is covered in the lab. -->

<!-- OPEN: The spec refers to ten trades in "the chapter's worksheet". No worksheet is given in the spec, so the ten trades in the independent exercise were written for this chapter. Confirm them. -->

<!-- standing-disclaimer -->
