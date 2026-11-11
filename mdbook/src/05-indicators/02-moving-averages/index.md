<!-- meta
id: T5.2
title: Moving averages
page_type: Math/Calculator
prerequisites: [T5.1]
labs: [Lab 4]
estimated_minutes: 25
-->

# Moving averages

## Hook

Ana (hypothetical) keeps the closing price of a stock for five days. She adds them up and divides by five. Then she does the same on the next day. Her numbers move, but they trail the price. She wonders whether a different kind of average would react faster. This chapter shows two common averages, the simple moving average and the exponential moving average, and how each one is calculated.

## The idea

A **moving average** is the average of closing prices over a window of days. The window moves forward each day, so the average moves too. There are two common kinds.

**Simple moving average (SMA).** Every day in the window counts the same.

- Add the last N closing prices.
- Divide the total by N.

In symbols, SMA = (sum of the last N closes) / N.

To update the SMA without adding all N values again, use this rule:

- New SMA = old SMA + (today's close minus the close N days ago) / N.

The price that drops out of the window is the close N days ago. The new price comes in on the other side.

**Exponential moving average (EMA).** Recent days count more than older days. The EMA uses a **smoothing factor**, written k, that sets how much weight the newest close gets.

- k = 2 / (N + 1).
- Today's EMA = k x today's close + (1 - k) x yesterday's EMA.

In words, the EMA moves a fraction k of the way from yesterday's EMA towards today's close. A bigger k means a faster reaction.

Three points to keep in mind.

1. **The EMA reacts faster than an SMA of the same length.** Its recent weight is larger.
2. **The first EMA needs a starting value.** A common choice is the first SMA. This is a convention, and it changes the early values. It does not change the later logic.
3. **Both averages lag.** An N-day SMA lags a steady trend by about (N - 1) / 2 days. This is a rough guide, not an exact law.

Crossovers are a popular use of moving averages. A crossover happens when a short average moves above or below a long average. Some traders treat it as a sign of trend. Whether such signals help is an open question. The book tests these rules later, in Lab 4.

## See it

<!-- component: indicator-playground | indicator: ema | compareTo: sma | period: 5 | caption: SMA and EMA drawn over the same made-up closes, with a switch for the starting value of the EMA -->

Look at both lines on the same made-up prices. The EMA bends sooner after a turn in the price. Then switch the starting value of the EMA and see how the first few days change. The later values move closer together.

## Worked example

**Hypothetical.** Five closes: Rs 100, Rs 102, Rs 104, Rs 103 and Rs 105.

**Part 1. Simple moving average.**

| Step | Calculation | Result |
|---|---|---|
| 1. Sum of five closes | 100 + 102 + 104 + 103 + 105 | Rs 514 |
| 2. Divide by 5 | 514 / 5 | **Rs 102.80** |

Next close is Rs 107. The close that drops out is Rs 100.

| Method | Calculation | Result |
|---|---|---|
| Rolling update | 102.80 + (107 - 100) / 5 = 102.80 + 1.40 | **Rs 104.20** |
| Direct check | 102 + 104 + 103 + 105 + 107 = 521, then 521 / 5 | **Rs 104.20** |

Both methods give the same answer. The rolling update is quicker to do by hand.

**Part 2. Exponential moving average with N = 5.**

| Step | Calculation | Result |
|---|---|---|
| 1. Smoothing factor | 2 / (5 + 1) | 0.3333 |
| 2. Yesterday's EMA | Starting value, set equal to the first SMA | Rs 102.80 |
| 3. Today's close | Given | Rs 110 |
| 4. Change from yesterday's EMA | 110 - 102.80 | Rs 7.20 |
| 5. Weighted change | 0.3333 x 7.20 | Rs 2.40 |
| 6. Today's EMA | 102.80 + 2.40 | **Rs 105.20** |

The EMA moved Rs 2.40 towards the new close. On the same close of Rs 110, the SMA would have moved Rs 2.00, to Rs 104.80. Check: 102.80 + (110 - 100) / 5 = 104.80. The EMA gives today's close more weight, so it moves further.

## Try it

<!-- component: indicator-playground | indicator: ema | compareTo: sma | closes: 100,102,104,103,105,110 | period: 5 | edit: on | caption: The worked example. Change the last close from 110 to 107 and compare the new SMA and EMA with the chapter -->

### Guided exercise

**Task.** Closes on three days are Rs 50, Rs 51 and Rs 53. Find the first three-day SMA. The next close is Rs 56. Use the rolling update to find the new SMA.

Hints:

1. The first SMA is (50 + 51 + 53) / 3.
2. The new SMA is the old SMA + (56 - 50) / 3. The close that drops out is Rs 50.

**Answer:** The first SMA is Rs 154 / 3 = Rs 51.33, rounded. The updated SMA is Rs 51.33 + Rs 2.00 = Rs 53.33, rounded. Check: (51 + 53 + 56) / 3 = 160 / 3 = Rs 53.33.

### Independent exercise

**Task.** Find the EMA for a nine-day window, where k = 0.2. Yesterday's EMA is Rs 500. Today's close is Rs 510. Find today's EMA.

<details><summary>Check your answer</summary>

- Change from yesterday's EMA: 510 - 500 = Rs 10.
- Weighted change: 0.2 x 10 = Rs 2.
- Today's EMA: 500 + 2 = **Rs 502.00**.

Check: 2 / (9 + 1) = 0.2, which matches k.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the two formulas, the lag, and the smoothing factor. It also checks that a crossover is not a sure signal.

## Paper task

Mode: **kite_demo**. Demo only. Do not place any order.

1. On the daily chart of one stock, draw a 20-period SMA and a 20-period EMA. Use the same closing price for both.
2. Find two turning points in the price, one high and one low.
3. At each turning point, note which average changed direction first.
4. Write the result as a learning note. Do not draw a conclusion from two turning points.

Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- In a sideways market, a crossover can switch back and forth many times. Each switch can cost money through costs and can hit a stop. See *Costs on a trade*.
- A crossover is a rule to test, not a profit method. This book does not present it as one.
- The EMA reacts sooner, but it can also react to a single unusual day more strongly.
- The starting value of the EMA changes the early numbers. Compare two charts only when they use the same starting value.
- Both averages lag. They show a trend after it has begun, and they do not warn you before it starts.

## Remember

- SMA = sum of the last N closes / N. Every day counts the same.
- EMA uses k = 2 / (N + 1). Today's EMA = k x today's close + (1 - k) x yesterday's EMA.
- The EMA reacts faster than the SMA of the same length.
- Both averages lag a steady trend.
- A crossover is a hypothesis to test, not a sure signal.

## Sources and verification

- Zerodha Varsity, moving averages module (reference only).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting). It lists 11 moving-average types and says indicators apply to the closing price by default. It does not state default settings, so read the setting on your own screen. (As of 11 Nov 2026. Check the manual for changes.)
- StockCharts ChartSchool, a free reference on moving averages.

<!-- standing-disclaimer -->
