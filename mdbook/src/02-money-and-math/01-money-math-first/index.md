<!-- meta
id: T2.1
title: Why money math comes before charts
page_type: Concept
prerequisites: [T0.1, T0.2]
labs: [Lab 1, Lab 3]
estimated_minutes: 20
-->

# Why money math comes before charts

## Hook

Two traders start with Rs 50,000 each. They take the same ten hypothetical trades, in the same order. Both have the same five wins and five losses. One finishes at Rs 52,500. The other finishes at Rs 75,000. But on the way, it fell to Rs 30,000. That is a 40% fall from where it started. The only difference is how many rupees each trader risked on each trade. (This is a hypothetical example. It shows arithmetic, not a strategy.)

## The idea

Every trade has two parts.

- **Direction:** the trade wins or loses. You do not control this part.
- **Size:** how many rupees you win or lose. You do control this part, before the trade.

Most beginners look only at direction. That is why they quote a win rate and stop there. The win rate is the share of trades that win. It tells you how often you win. It does not tell you how much.

**R** is the rupee amount you risk on one trade. Once you fix R, you can write every result as a multiple of R.

- A loss of the planned size is **-1R**.
- A win twice the planned size is **+2R**.

Writing results in R lets you compare trades and traders. You do not need to know their account size. The arithmetic is also easier to check.

Two numbers describe a set of results:

- **Win rate** describes frequency: wins divided by total trades.
- **Average win and average loss** describe size: how many rupees (or R) a typical winner and a typical loser are worth.

You need both. A high win rate with tiny wins and large losses can still shrink an account. A low win rate with large wins can grow one. Neither number is enough alone.

Keep the same results but change only the size. You get a different **equity path**. This is the running account balance after each trade. The **drawdown** is the fall from the highest balance reached so far. It is shown as a percentage of that high point. The same results with a bigger R give bigger swings and deeper drawdowns.

Put in one line: **equity after a trade = equity before the trade + (multiple of R) x R.** In symbols, E is equity and m is the R-multiple of the result. So E(new) = E(old) + m x R.

Charts show price. They do not show how many shares you hold, how much you risk, or what costs you pay. Money math turns a chart idea into a result in rupees. If you do not set size and costs first, a chart cannot tell you what a plan would do to your account.

Everything in this chapter is hypothetical. The numbers are chosen to be easy to check. They do not describe any real strategy. A sequence of ten trades is far too short to judge one.

## See it

<!-- component: drawdown-compounding | capital: 50000 | traderA_R: 500 | traderB_R: 5000 | sequence: LLLLWWWWWL | caption: Two equity traces on the same ten hypothetical results; only the size of R differs -->

Look at the two lines. They start at the same point and end at different heights. Trader B's line dips much lower before it recovers. Change the R for Trader B to a smaller number and watch the dip shrink. The win and loss pattern stays the same.

## Worked example

**Hypothetical.** Both traders start with Rs 50,000. The sequence is four losses, then five wins, then one loss. That is 5 wins and 5 losses, a 50% win rate. Each win is +2R. Each loss is -1R.

**Trader A** risks R = Rs 500, which is 1% of Rs 50,000.

| Trade | Result | Change in rupees | Equity after trade |
|---|---|---|---|
| Start | | | 50,000 |
| 1 | Loss, -1R | -500 | 49,500 |
| 2 | Loss, -1R | -500 | 49,000 |
| 3 | Loss, -1R | -500 | 48,500 |
| 4 | Loss, -1R | -500 | 48,000 |
| 5 | Win, +2R | +1,000 (2 x 500) | 49,000 |
| 6 | Win, +2R | +1,000 | 50,000 |
| 7 | Win, +2R | +1,000 | 51,000 |
| 8 | Win, +2R | +1,000 | 52,000 |
| 9 | Win, +2R | +1,000 | 53,000 |
| 10 | Loss, -1R | -500 (1 x 500) | 52,500 |

Trader A ends at Rs 52,500. Net result: 52,500 - 50,000 = Rs 2,500. That is 2,500 / 50,000 = 5%. The worst drawdown is from Rs 50,000 down to Rs 48,000. That is 2,000 / 50,000 = 4%.

**Trader B** risks R = Rs 5,000, which is 10% of Rs 50,000. The sequence is the same.

| Trade | Result | Change in rupees | Equity after trade |
|---|---|---|---|
| Start | | | 50,000 |
| 1 | Loss, -1R | -5,000 | 45,000 |
| 2 | Loss, -1R | -5,000 | 40,000 |
| 3 | Loss, -1R | -5,000 | 35,000 |
| 4 | Loss, -1R | -5,000 | 30,000 |
| 5 | Win, +2R | +10,000 (2 x 5,000) | 40,000 |
| 6 | Win, +2R | +10,000 | 50,000 |
| 7 | Win, +2R | +10,000 | 60,000 |
| 8 | Win, +2R | +10,000 | 70,000 |
| 9 | Win, +2R | +10,000 | 80,000 |
| 10 | Loss, -1R | -5,000 (1 x 5,000) | 75,000 |

Trader B ends at Rs 75,000. Net result: 25,000 / 50,000 = 50%. The worst drawdown is from Rs 50,000 down to Rs 30,000. That is 20,000 / 50,000 = 40%.

**Reversed order.** Keep the same ten results. But move the five wins to the front, then the five losses. Trader B's equity runs: 50,000, 60,000, 70,000, 80,000, 90,000, 100,000 after the five wins. Then it runs 95,000, 90,000, 85,000, 80,000, 75,000 after the five losses. The end is again Rs 75,000. But the path is different. The high point is now Rs 1,00,000. The fall to Rs 75,000 is 25,000 / 1,00,000 = 25%. Same ending, different ride.

**Lesson.** Trader A and Trader B had the same win rate, the same R-multiples and the same sequence. Only R changed. Trader B's bigger size gave a bigger final number and a much deeper fall. A bigger final number does not make a bigger size safer.

## Try it

<!-- component: drawdown-compounding | capital: 50000 | traderA_R: 1000 | traderB_R: 5000 | sequence: LLLLWWWWWL | caption: Try a new R for trader A and watch the equity path change; the win and loss pattern does not change -->

### Guided exercise

**Task.** Fill in the equity after each trade for Trader A (R = Rs 500), using the sequence in the worked example. Check that trade 10 ends at Rs 52,500.

Hints:

1. Each loss subtracts 500 from the equity before it.
2. Each win adds 1,000 (that is 2 x 500).
3. Write the balance after every row before starting the next row.

**Answer:** 49,500; 49,000; 48,500; 48,000; 49,000; 50,000; 51,000; 52,000; 53,000; 52,500.

### Independent exercise

**Task.** Trader C uses R = Rs 1,000 (2% of Rs 50,000) on the same sequence of ten results. Compute the lowest equity, the final equity, the net return and the worst drawdown.

<details><summary>Check your answer</summary>

- Lowest equity: 50,000 - 4 x 1,000 = Rs 46,000 (after four losses).
- Final equity: after the four losses, 46,000. The five wins add 5 x 2,000 = 10,000, giving 56,000. The last loss subtracts 1,000, giving Rs 55,000.
- Net return: 5,000 / 50,000 = 10%.
- Worst drawdown: from 50,000 down to 46,000 = 4,000 / 50,000 = 8%.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the difference between win rate and size, and the arithmetic of the equity path.

## Paper task

Mode: **learning note** (not a trading record). Write it in your journal.

1. Make a table with ten rows, one per trade, for Trader A (R = Rs 500) and Trader B (R = Rs 5,000). Use the sequence L, L, L, L, W, W, W, W, W, L.
2. For each row, write the change in rupees and the equity after the trade.
3. Write down the worst drawdown for each trader as a percentage.
4. Add one line: "Same win rate, different size, different drawdown." Mark the note as hypothetical.

## Limits and common mistakes

- It does not tell you that any trading approach is profitable. The sequence is made up and has only ten trades.
- It does not show that a 50% win rate is good or bad. Win rate alone never settles the result. For the rest of the picture, see *Expectancy and profit factor*.
- It ignores costs. Real trades pay costs (*Costs on a trade*), and those change every line of the table.
- It does not show that a particular R is safe. Real losing streaks can be longer than four trades (*Consecutive losses and losing streaks*).

## Remember

- Every trade has a direction you cannot control and a size you can.
- R is the rupee amount risked on a trade. Express results as multiples of R.
- Win rate describes frequency. Average win and average loss describe size. You need both.
- Same results, bigger R: a bigger swing and a deeper drawdown.
- Set size and costs before you discuss any chart.

## Sources and verification

- Zerodha Varsity, position sizing concepts, for reference only (link only, no text copied).

<!-- facts-needed: none for this chapter (all figures are hypothetical arithmetic). -->

<!-- OPEN: The spec's Lab 3 paper task asks for a ten-trade table for both traders; the journal fields for this are not yet defined in LABS.md, so the paper version is written as a table. -->

<!-- standing-disclaimer -->
