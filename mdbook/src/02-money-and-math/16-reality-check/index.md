<!-- meta
id: T2.16
title: The Rs 2,000-3,000 reality check
page_type: Math/Calculator
prerequisites: [T2.2, T2.4, T2.5, T2.9, T2.10, T2.11, T2.12, T2.15]
labs: [Lab 1, Lab 2]
estimated_minutes: 30
-->

# The Rs 2,000-3,000 reality check

## Hook

A hypothetical trader with Rs 50,000 writes one number into her plan: Rs 2,000 a day. Over 250 trading days that is Rs 5,00,000. That is ten times her capital. Her plan does not explain how any strategy would make that every day. This chapter does the arithmetic she skipped. The result is not a strategy problem to solve. It is a number that shows the target does not fit this capital.

<!-- OPEN: spec open question 7 asks whether the 50% annual-return row should appear at all. Kept as scale-only, per spec -->
<!-- OPEN: spec lists Lab 4 (trade-order Monte Carlo for streak distribution) as a later lab. Not referenced in the text until that lab exists -->

## The idea

Start with the target in rupees. Then ask what capital and what return it would need.

**Terms**

- **Daily target:** the profit you want in one trading day, in rupees.
- **Trading days per year:** the number of market sessions in a year. This chapter uses 250 as an assumption for arithmetic. [VERIFY: trading days per year from the NSE holiday list and calendar]
- **Annual return:** the yearly profit as a percentage of your capital.
- **Required daily return:** the daily target as a percentage of your capital.

**Capital needed.** Daily target times trading days per year, divided by the annual return.

In symbols: C = (T x D) / r, where T is the daily target, D is the number of trading days, r is the annual return as a decimal, and C is the capital.

**Required daily return.** Daily target divided by capital.

In symbols: g = T / C.

**Sensitivity.** You cannot control the annual return. So the table shows three values: 10%, 20% and 50%. You can treat 20% a year as a very good result. That is a reference point, not a forecast. The 50% row shows only the scale of the problem. It is not an expectation.

**Risk and the number of trades.** At Rs 50,000 with 1% risk per trade, one R is Rs 500. A Rs 2,000 day is 4R before costs. That is four wins of 1R each, with no losing trade. Every losing trade takes away from that figure. The more trades a target needs, the more chances costs and mistakes have to add up (*Overtrading and why daily profit targets encourage it*).

**Costs.** Every trade pays costs (*Costs on a trade*). This chapter uses the dummy cost model from *Costs on a trade*: a Rs 190 round trip on Rs 50,000. Dummy figures are for arithmetic only. They are not any broker's charges. Gross profit must cover costs before any of it counts toward the target.

**Streaks.** Losing days come in runs (*Consecutive losses and losing streaks*). The worked example shows the capital lost over 5, 10 and 15 losing days. It assumes each losing day loses the risk percentage of the capital at that moment. So each loss is a smaller rupee amount than the one before.

**Consistency.** A daily target assumes a steady daily return. Real results vary from one day to the next. A few good days say nothing about the next day. Consistent daily returns cannot be guaranteed.

**Compounding check.** 1.04 raised to the power 250 is about 18,000. Put another way, Rs 1 would grow to about Rs 18,000 if it earned 4% on each of 250 days. No responsible plan can assume that. The 4% a day figure is shown here only to make the scale visible.

**Conclusion.** At Rs 10,000 to Rs 50,000, a target of Rs 2,000 to Rs 3,000 a day is unrealistic. This book does not work backwards from a target to invent a strategy that makes it look possible. The target must never drive a trade decision.

## See it

<!-- component: streak-sim | capital: 10000 | riskPct: 1 | losingDays: 5 | caption: Losing-day streak at Rs 10,000 and 1% risk; read the capital lost after 5, 10 and 15 losing days -->

Look at the capital lost after five losing days. Then change the streak to 10 and 15. The loss grows a little more slowly than a straight line, because each loss is 1% of a smaller balance. Then change the risk to 2% and compare the same streak lengths.

## Worked example

All figures are **hypothetical** and use the arithmetic of this chapter. The 250-day count is an assumption [VERIFY: trading days per year].

### Step 1: capital needed for Rs 2,000 a day at 20% a year

| Step | Calculation | Result |
|---|---|---|
| Yearly target | 2,000 x 250 | Rs 5,00,000 |
| Capital needed | 5,00,000 / 0.20 | Rs 25,00,000 (Rs 25 lakh) |

Check: 25,00,000 x 0.20 = 5,00,000.

For Rs 3,000 a day: 3,000 x 250 = Rs 7,50,000, and 7,50,000 / 0.20 = Rs 37,50,000 (Rs 37.5 lakh).

### Step 2: the effect of the annual return

| Daily target | 10% a year | 20% a year | 50% a year (scale only) |
|---|---|---|---|
| Rs 2,000 | Rs 50,00,000 | Rs 25,00,000 | Rs 10,00,000 |
| Rs 3,000 | Rs 75,00,000 | Rs 37,50,000 | Rs 15,00,000 |

Each cell is the yearly target divided by the return. Example: 5,00,000 / 0.10 = 50,00,000, and 7,50,000 / 0.50 = 15,00,000.

### Step 3: required daily return

| Capital | Rs 2,000 a day | Rs 3,000 a day |
|---|---|---|
| Rs 10,000 | 20% a day | 30% a day |
| Rs 50,000 | 4% a day | 6% a day |
| Rs 10,00,000 | 0.2% a day | 0.3% a day |

Example: 2,000 / 10,000 = 0.20, which is 20%. And 3,000 / 50,000 = 0.06, which is 6%.

### Step 4: losing streaks at fixed risk

Each loss is the risk percentage of the capital at that moment. Example at 1% on Rs 10,000:

| Day | Capital before the loss | Loss (1%) | Capital after |
|---|---|---|---|
| 1 | Rs 10,000 | Rs 100 | Rs 9,900 |
| 2 | Rs 9,900 | Rs 99 | Rs 9,801 |
| 3 | Rs 9,801 | Rs 98.01 | Rs 9,702.99 |
| 4 | Rs 9,702.99 | Rs 97.03 | Rs 9,605.96 |
| 5 | Rs 9,605.96 | Rs 96.06 | Rs 9,509.90 |

After five losses the account is about Rs 9,510, so about Rs 490 has been lost.

Capital lost, rounded:

| Capital | Risk per day | 5 losing days | 10 losing days | 15 losing days |
|---|---|---|---|---|
| Rs 10,000 | 1% | Rs 490 | Rs 956 | Rs 1,399 |
| Rs 50,000 | 1% | Rs 2,450 | Rs 4,781 | Rs 6,997 |
| Rs 10,000 | 2% | Rs 961 | Rs 1,829 | Rs 2,614 |
| Rs 50,000 | 2% | Rs 4,804 | Rs 9,146 | Rs 13,072 |

### Step 5: cost drag on the target

Dummy round trip: Rs 190 on Rs 50,000 (from the dummy model in *Costs on a trade*).

- Four round trips a day: 4 x Rs 190 = Rs 760 (dummy).
- To keep Rs 2,000 after these dummy costs, gross profit must be Rs 2,760 (2,000 + 760).

### Step 6: the compounding check

1.04 raised to the power 250 is about 18,000. Rs 1 at 4% a day becomes about Rs 18,000 after 250 days. That is the scale the target implies, and it is why it is not a sustainable path.

## Try it

<!-- component: streak-sim | capital: 50000 | riskPct: 2 | losingDays: 15 | caption: Losing-day streak at Rs 50,000 and 2% risk; check the readings against the table in the worked example -->

Change the capital and the risk. Check that your readings match the table in Step 4.

### Guided exercise

**Task:** Work out the capital needed for a daily target of Rs 1,500 at 20% a year over 250 trading days.

Hints:

1. Multiply the daily target by 250 to get the yearly target.
2. Divide the yearly target by 0.20, the 20% return written as a decimal.
3. Check your answer: multiply it by 0.20 and you should get the yearly target back.

**Answer:** 1,500 x 250 = Rs 3,75,000. Then 3,75,000 / 0.20 = Rs 18,75,000 (Rs 18.75 lakh). Check: 18,75,000 x 0.20 = 3,75,000.

### Independent exercise

**Task:** Your capital is Rs 50,000. Work out (a) the required daily return for a target of Rs 2,500 a day, and (b) the capital needed for Rs 2,500 a day at 15% a year over 250 trading days.

<details><summary>Check your answer</summary>

(a) 2,500 / 50,000 = 0.05, which is 5% a day.

(b) 2,500 x 250 = Rs 6,25,000. Then 6,25,000 / 0.15 = Rs 41,66,667, about Rs 41.7 lakh.

Check: 41,66,667 x 0.15 is about 6,25,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Seven questions cover capital needed, required daily return, cost drag, streaks and the reality check.

## Paper task

**Mode:** learning note. No trades and no live account. Write it in your journal. If the journal app is not ready, use paper.

1. Write your daily target in rupees. Use a made-up or blank figure for your capital.
2. Work out the capital needed at a 20% annual return over 250 days, or over your own checked trading-day count.
3. Work out the required daily return: target divided by capital.
4. Using your own cut rule from *Capital allocation*, count how many losing days at your chosen risk you could take before the cut applies.
5. Record the three results in one note, with today's date.

## Limits and common mistakes

- It does not predict any day's result. The arithmetic assumes a steady return, and real trading does not give one.
- The 250-day count and the dummy costs are assumptions. Replace them with checked values before you rely on any figure.
- It does not show that any strategy can reach the target. It shows only what the target would need.
- 20% a year is a yardstick for a very good year. It is not an expectation. The 50% row is for scale only.
- The streak figures assume one fixed risk percentage and losses that do not cluster unusually. Real streaks can be longer or shorter.

## Remember

- Capital needed = daily target x trading days / annual return.
- At Rs 10,000, Rs 2,000 a day needs a 20% return each day. At Rs 50,000, it needs 4% a day.
- Costs are added on top of the target. Losing streaks take capital away from the base that must work.
- A few good days say nothing about the next one. Consistent daily returns cannot be guaranteed.
- The target must never drive a trade. At this capital it is unrealistic.

## Sources and verification

**Sources (names only):**

- NSE holiday calendar, for the trading-day count.
- Zerodha charges page, cross-referenced from *Costs on a trade*. The dummy costs in this chapter are not Zerodha's charges.

**To verify:**

- Trading days per year. [VERIFY: trading days per year from the NSE holiday list and calendar]
- Replace the dummy Rs 190 round trip with the checked cost model from *Costs on a trade* before publishing.

<!-- facts-needed: trading days per year (NSE calendar); verified cost model from *Costs on a trade* to replace the dummy Rs 190 round trip -->

<!-- standing-disclaimer -->
