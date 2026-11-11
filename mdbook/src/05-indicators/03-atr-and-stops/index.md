<!-- meta
id: T5.3
title: ATR and volatility, used for stops
page_type: Math/Calculator
prerequisites: [T5.2, T2.4, T2.5]
labs: [Lab 1, Lab 4]
estimated_minutes: 35
-->

# ATR and volatility, used for stops

## Hook

Vikram (hypothetical) wants a stop that fits how much a stock usually moves. He sets his stop Rs 2 below his entry. The stock often moves Rs 8 in a day. His stop is hit by normal movement, not by bad news. He has used a stop that is too tight for the stock. This chapter shows one way to measure normal movement, called the Average True Range, or ATR.

## The idea

**Volatility** means how much a price moves. A stock that moves Rs 1 a day is less volatile than one that moves Rs 10 a day.

**True range (TR)** measures how far one day moved. It is the largest of three values for a day.

1. High minus low for the day.
2. The absolute value of high minus yesterday's close.
3. The absolute value of low minus yesterday's close.

The second and third values count gaps. A gap is a jump in price with no trading in between. If the stock opens far above yesterday's close, the true range picks up that jump. Simple high minus low would miss it.

**Average True Range (ATR)** is the average of TR over N bars. A common setting is N = 14. The bar can be a day, an hour or any other period.

ATR uses **Wilder smoothing**, a method that gives recent bars more weight.

- The first ATR is the simple average of the first N true ranges. This is a common convention.
- Each later ATR = (yesterday's ATR x (N - 1) + today's TR) / N.

Some points to keep in mind.

- ATR is in rupees per share. To compare two stocks, convert it to a percent of the price.
- A stop distance can be a multiple, k, of ATR. For example, a stop 2 times ATR below entry. The multiple is a design choice that you test later. See *The fully specified swing strategy* for how such choices are fixed and tested in this book.
- A wider ATR gives a wider stop. For the same risk budget, a wider stop gives fewer shares.
- ATR cannot cover unusual gaps beyond normal volatility. A gap can still be much larger than ATR. See *Gaps and what they mean for stops*.

Position size still comes from the rules in *Position sizing step by step*. ATR sets the stop distance. The budget and the caps set the number of shares.

## See it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 250 | stop: 241.34 | caption: Three bars for the ATR example (raw risk limit 57, cash cap 200, concentration cap 50); the minimum is highlighted and the binding constraint is named -->

<!-- component: lab-position-size | capital: 50000 | riskPct: 1 | entry: 250 | stop: 241.34 | maxPct: 25 | caption: A position size calculator with three limits. Change any number and see which limit decides -->

The three bars show the three limits. The shortest bar sets the size. Here the concentration cap is the shortest bar. Change the stop and watch how the risk bar grows. Notice that the concentration bar does not move, because the entry price does not change.

## Worked example

**Hypothetical.** Five bars. Each row gives the high, the low and the previous close.

| Bar | High | Low | Previous close | High - low | High - previous close | Low - previous close | TR |
|---|---|---|---|---|---|---|---|
| Day 2 | 106 | 102 | 103 | 4 | 3 | 1 | **4** |
| Day 3 | 108 | 103 | 104 | 5 | 4 | 1 | **5** |
| Day 4 | 107 | 104 | 107 | 3 | 0 | 3 | **3** |
| Day 5 | 110 | 106 | 105 | 4 | 5 | 1 | **5** |

Each TR is the largest value in its row. For example, Day 4 has TR 3, because high minus low is 3 and the two gap values are 0 and 3.

**Seed ATR for N = 3.** (4 + 5 + 3) / 3 = **4.00**.

**Wilder ATR on Day 5.** (4.00 x 2 + 5) / 3 = (8 + 5) / 3 = 13 / 3 = **4.33**, rounded.

**Stop and size.** Assume capital Rs 50,000, risk 1 percent and the 25 percent concentration setting. Entry is Rs 250.

| Step | Calculation | Result |
|---|---|---|
| 1. Stop distance | 2 x 4.33 | Rs 8.66 |
| 2. Stop price | 250 - 8.66 | Rs 241.34 |
| 3. Risk budget | 50,000 x 1% | Rs 500 |
| 4. Raw shares | floor(500 / 8.66) = floor(57.7) | 57 |
| 5. Cash cap | floor(50,000 / 250) | 200 |
| 6. Concentration cap | floor(12,500 / 250) | 50 |
| **Shares** | minimum of 57, 200, 50 | **50** |

Binding constraint: the **concentration cap**. The planned position is 50 x Rs 250 = Rs 12,500, which is 25 percent of capital. The planned loss is 50 x Rs 8.66 = Rs 433, which is less than the Rs 500 budget. The cap stopped the size before the budget was used up.

## Try it

<!-- component: indicator-playground | indicator: atr | closes: 103,104,107,105,109 | highs: 104,106,108,107,110 | lows: 100,102,103,104,106 | period: 3 | mult: 2 | entry: 250 | edit: on | caption: The five bars of the worked example. Day 1 is only there to give day 2 a previous close. Change the highs, lows or closes and watch the true range and the ATR -->

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 250 | stop: 241.34 | caption: Interactive demo of stop distance against shares, using the ATR example -->

### Guided exercise

**Task.** A bar has high Rs 300, low Rs 292 and previous close Rs 305. Find the true range.

Hints:

1. High minus low = 300 - 292 = 8.
2. High minus previous close = 300 - 305 = -5, so the absolute value is 5.
3. Low minus previous close = 292 - 305 = -13, so the absolute value is 13.

**Answer:** The true range is Rs 13, the largest of 8, 5 and 13. The gap from the previous close sets the answer here.

### Independent exercise

**Task.** ATR is Rs 6.00 on a Rs 400 stock. The stop multiple is 2.5. Capital is Rs 50,000, risk is 1 percent and the concentration setting is 25 percent. Find the stop distance, the stop price and the shares. Name the binding constraint.

<details><summary>Check your answer</summary>

- Stop distance: 2.5 x Rs 6.00 = **Rs 15**.
- Stop price: 400 - 15 = **Rs 385**.
- Risk budget: 50,000 x 1% = Rs 500.
- Raw shares: floor(500 / 15) = floor(33.3) = 33.
- Cash cap: floor(50,000 / 400) = 125.
- Concentration cap: floor(12,500 / 400) = floor(31.25) = 31.
- Shares: minimum of 33, 125, 31 = **31**.
- Binding constraint: **concentration cap**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks true range with a gap, the stop distance from ATR, and the link between the stop and the size. It also checks that ATR does not cover gaps.

## Paper task

Mode: **paper**. No account and no order is needed.

1. Pick five stocks. For each one, copy a sample of 20 bars by hand from a chart or a printed table. Write the high, low and close for each bar.
2. Work out the true range for each bar that has a previous close.
3. Find the ATR for the first 14 bars by taking their simple average. Then apply Wilder smoothing to the bars that follow.
4. Compare your ATR with the ATR shown by the platform. Note the platform setting as shown on your screen. Zerodha's charting manual does not list a default ATR setting.

Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- An ATR stop can be too tight for normal noise. It can also be too wide to fit the budget.
- The risk budget still decides the size. A wider stop does not give you more shares. It gives fewer.
- ATR cannot protect you from a gap that is larger than normal movement.
- ATR is in rupees, not in percent. Converting it to percent is a separate step.
- A tighter stop raises the raw share count. The caps still limit the final size, as shown in *Position sizing step by step*.

## Remember

- True range is the largest of high minus low, and the two gap distances.
- ATR is an average of true range. Wilder smoothing gives recent bars more weight.
- Stop distance = a multiple of ATR. The multiple is a choice that you test later.
- Shares are still the minimum of the risk limit, the cash cap and the concentration cap.
- ATR does not cover gaps beyond normal movement.

## Sources and verification

- J. Welles Wilder, *New Concepts in Technical Trading Systems* (1978). This is where ATR and Wilder smoothing come from.
- Zerodha Varsity, volatility module (reference only).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting). It gives no default ATR setting, so read it on your own screen.
- StockCharts ChartSchool, ATR page. It gives 14 periods and Wilder smoothing. The first true range is high minus low, and the first ATR is the average of 14 true ranges. (As of 11 Nov 2026. This is a common convention, not an exchange rule.)

<!-- standing-disclaimer -->
