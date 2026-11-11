<!-- meta
id: T5.5
title: MACD
page_type: Math/Calculator
prerequisites: [T5.2, T5.4]
labs: [Lab 4]
estimated_minutes: 25
-->

# MACD

## Hook

Tomas (hypothetical) sees the MACD line above zero on his chart. He takes this to mean the stock is in an uptrend, so he buys without a stop. Two days later the line falls below zero, and he has a loss he did not plan for. He never checked how the MACD is built or how often it crosses in a sideways market. This chapter shows how MACD is calculated, what a crossover means, and why it lags.

## The idea

**MACD** stands for moving average convergence divergence. It is built from two exponential moving averages (EMAs) of the closing price. It has three lines.

1. **MACD line.** MACD line = EMA(12) - EMA(26). The 12 and 26 are conventional periods.
2. **Signal line.** Signal line = EMA(9) of the MACD line. This is a smoothed copy of the MACD line.
3. **Histogram.** Histogram = MACD line - signal line.

A positive histogram means the MACD line is above the signal line. A negative histogram means it is below.

A **crossover** is a change of sign in the histogram. The histogram moves from positive to negative, or from negative to positive. Traders watch crossovers as possible signs of a change in trend. Their value has not been established, so treat them as a rule to test.

Some points to keep in mind.

- **MACD inherits lag.** It sits on two EMAs, so it reacts after the price has already moved. See *Moving averages* for why EMAs lag.
- **Ranges cause whipsaw.** A whipsaw is a string of false signals. In a sideways market, the lines cross often, and each crossing looks like a signal. Most of them lead nowhere.
- **Zero is not a command.** MACD above zero describes the recent averages. It does not tell you to buy.

Each crossover is a possible trade. Every trade has costs and needs a stop and a size rule. A crossover does not remove those needs. See *Costs on a trade* and *Position sizing step by step*.

## See it

<!-- component: indicator-playground | indicator: macd | caption: MACD pane with the histogram bars, showing the MACD line, the signal line and the sign changes of the histogram -->

Watch the histogram bars as they move above and below zero. Each sign change is a crossover. Then look at a sideways period. Count how many crossovers happen in a short stretch. The count shows why crossovers need a test before anyone relies on them.

## Worked example

**Hypothetical. Illustrative EMA values.** The EMAs below are made up. In practice, a reader computes the real ones with a spreadsheet, using the EMA method from *Moving averages*.

| Step | Calculation | Result |
|---|---|---|
| 1. MACD line | EMA(12) - EMA(26) = 105.00 - 102.00 | **3.00** |
| 2. Signal line | EMA(9) of the MACD line, given as | 2.40 |
| 3. Histogram | 3.00 - 2.40 | **0.60**, positive |

Yesterday, the MACD line was 2.20 and the signal line was 2.30. The histogram was 2.20 - 2.30 = -0.10, negative.

Today the histogram is positive. Its sign changed, so there is a crossover. Remember that this is a sign change in a made-up example. It is not a forecast. It is also the kind of event that happens often in a sideways market.

## Try it

<!-- component: indicator-playground | indicator: macd | manual: on | ema12: 105 | ema26: 102 | signal: 2.4 | yesterdayMacd: 2.2 | yesterdaySignal: 2.3 | caption: The worked example. Type your own EMA values and see the MACD line, the histogram and whether the sign changed -->

### Guided exercise

**Task.** EMA(12) is Rs 98.40 and EMA(26) is Rs 100.10. The signal line is Rs -1.20. Find the MACD line and the histogram.

Hints:

1. MACD = 98.40 - 100.10.
2. Histogram = MACD - signal.

**Answer:** MACD = 98.40 - 100.10 = **-1.70**. Histogram = -1.70 - (-1.20) = -1.70 + 1.20 = **-0.50**.

### Independent exercise

**Task.** Yesterday the MACD line was 1.10 and the signal line was 1.30. Today the MACD line is 1.60 and the signal line is 1.40. Find the histogram each day and say whether the sign changed.

<details><summary>Check your answer</summary>

- Yesterday: histogram = 1.10 - 1.30 = **-0.20**.
- Today: histogram = 1.60 - 1.40 = **+0.20**.
- The sign changed from negative to positive, so there is a **crossover**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the MACD line, the histogram and the meaning of a crossover. It also checks that zero is not a buy command.

## Paper task

Mode: **paper**. A learning log only. Do not place any order.

1. Pick five stocks. On each, find five crossovers on the daily chart.
2. For each crossover, write the date and the price move over the next five days.
3. Label the log as hindsight. You are looking back at results you can now see.
4. Do not work out a success rate from five events. Five events are too few to mean anything.

Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- A crossover in a sideways market can reverse soon after. Each reversal can cost money and can hit a stop.
- MACD above zero is a description, not an instruction to buy.
- The histogram is the difference between two lines. It is not the MACD line itself.
- Changing the periods from 12, 26 and 9 changes every reading. Fix them before you test a rule.
- A crossover does not make a trade safer. The stop and the size still decide the loss.

## Remember

- MACD line = EMA(12) - EMA(26). Signal line = EMA(9) of the MACD line.
- Histogram = MACD line - signal line. A sign change is a crossover.
- MACD lags because it uses two EMAs.
- In a range, the lines cross often, and most crossings are noise.
- Each crossover still needs a stop and a size rule.

## Sources and verification

- Gerald Appel, the originator of MACD, as recorded in standard technical-analysis texts.
- Zerodha Varsity, MACD module (reference only).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting). It gives no default MACD setting, so read it on your own screen.
- StockCharts ChartSchool, MACD page. It gives a 12-day EMA minus a 26-day EMA, with a 9-day EMA signal line, on closing prices. (As of 11 Nov 2026. This is a common convention, not an exchange rule.)

<!-- standing-disclaimer -->
