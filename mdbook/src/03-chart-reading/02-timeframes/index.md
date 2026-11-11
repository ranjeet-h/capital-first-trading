<!-- meta
id: T3.2
title: Timeframes and how the same price looks different
page_type: Concept
prerequisites: [T3.1]
labs: [Lab 3]
estimated_minutes: 15
-->

# Timeframes and how the same price looks different

## Hook

**Hypothetical.** A trader opens a stock on the one-minute chart. The last few minutes look weak, so the trader decides the stock is falling. Then the trader opens the daily chart and sees a stock that rose over the past weeks. Both charts show the same stock at the same moment. Which one is right? The honest answer is that both are right. They show different periods. The mistake is to pick the chart that agrees with the mood of the moment.

## The idea

A **timeframe** is the length of one candle. A one-minute candle covers one minute of trading. A daily candle covers one whole day. The same trades give different candles at different timeframes.

When you join shorter candles into one longer candle, use four rules:

- **Open** comes from the first short candle.
- **Close** comes from the last short candle.
- **High** is the largest high of all the short candles.
- **Low** is the smallest low of all the short candles.

Shorter timeframes show more small moves. Many of those moves are noise. Noise means small price movement that does not change your plan. Longer timeframes show fewer moves. They give fewer, slower decisions.

For an end-of-day plan, the daily candle is the decision frame. Shorter timeframes help with later questions about timing. Those questions are covered in *Multiple timeframe analysis*.

Three points to keep in mind:

- A stop set from a five-minute wick is not a daily decision. Write the timeframe in your plan.
- Switching timeframes until a pattern appears is hindsight shopping. Choose the timeframe before you look at the chart.
- A longer timeframe is not safer by default. It shows fewer moves, but a gap can still carry the price past your stop.

## See it

<!-- component: candle-builder | mode: timeframe-switch | timeframes: 1-minute, 5-minute, daily | caption: The same tick data redraws at each timeframe setting -->

Switch between the one-minute, five-minute and daily settings. The same tick data redraws at each setting. Compare the candle you see at each setting with the table in the worked example. Notice that the close and the open can change the label.

## Worked example

**Hypothetical.** Five one-minute candles, each shown as open, high, low and close:

| Minute | Open | High | Low | Close |
|---|---|---|---|---|
| 1 | 500 | 501 | 499 | 500.5 |
| 2 | 500.5 | 503 | 500 | 502 |
| 3 | 502 | 504 | 501 | 501 |
| 4 | 501 | 502 | 498 | 499 |
| 5 | 499 | 500 | 497 | 498.5 |

Join them into one five-minute candle:

| Part | Rule | Result |
|---|---|---|
| Open | open of minute 1 | 500 |
| High | largest high (minute 3) | 504 |
| Low | smallest low (minute 5) | 497 |
| Close | close of minute 5 | 498.5 |

Range = 504 minus 497 = Rs 7. Check: the range is also the highest high minus the lowest low, so no number is missed.

The close of 498.5 is below the open of 500. The five-minute candle is **bearish**. Minute 2 closed up, but the five-minute candle still compares the first open with the last close.

## Try it

### Guided exercise

**Task.** Join the five one-minute candles in the worked example into one five-minute candle. Give the open, high, low and close. Give the range. Say whether the candle is bullish or bearish.

Hints:

1. The open is the open of the first minute.
2. List all five highs. Take the largest.
3. List all five lows. Take the smallest.
4. The close is the close of the last minute.

**Answer:** Open 500. High 504. Low 497. Close 498.5. Range Rs 7 (504 minus 497). The candle is **bearish**, because 498.5 is below 500.

### Independent exercise

**Task.** **Hypothetical.** Four one-hour candles follow. Each shows open, high, low and close: (200, 204, 199, 203), (203, 206, 202, 205), (205, 205, 200, 201) and (201, 203, 199, 202). Join them into one four-hour candle. State whether it is bullish or bearish.

<details><summary>Check your answer</summary>

- Open: the first candle's open, 200.
- High: the largest of 204, 206, 205 and 203, which is 206.
- Low: the smallest of 199, 202, 200 and 199, which is 199.
- Close: the last candle's close, 202.
- Range: 206 minus 199 = Rs 7.
- The candle is **bullish**, because 202 is above 200.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the aggregation rules, the range, and why a choice of timeframe must come before you look.

## Paper task

Mode: **paper**. Write the result in your journal. If the journal is not ready, use paper.

1. Pick one stock.
2. On the same day, look at its five-minute, one-hour and daily charts.
3. For each chart, write whether the candles look up, down or sideways.
4. Write which timeframe your plan uses, and write it before you look at the charts.
5. Note any day where the labels disagree. Keep that note for later use in your study.

If you do this in the Kite demo, write the mode as `kite_demo`. Say that the demo is for interface practice only.

## Limits and common mistakes

- A longer timeframe does not remove risk. A daily candle can still open far below your stop after a gap (*Gaps and what they mean for stops*).
- Changing the timeframe until a pattern appears gives false confidence. Choose the timeframe first.
- A stop placed on a five-minute wick can be hit by normal noise. A daily plan would ignore that noise. The planned loss changes with the timeframe, so recheck the numbers.
- Intervals and how far back the history goes depend on the platform. Check the current limits before you plan. [VERIFY: Kite chart intervals and history depth]

## Remember

- A timeframe is the length of one candle.
- Joining candles: open from the first, close from the last, high is the largest high, low is the smallest low.
- The same stock can look bullish on one timeframe and bearish on another.
- Choose the timeframe and write it in your plan before you look.
- A stop must match the timeframe of the plan it belongs to.

## Sources and verification

- Kite chart help pages
- Zerodha Varsity, timeframe module (reference only)
- Zerodha support, intraday data pages

[VERIFY: Kite chart intervals available and their history depth]
[VERIFY: intraday data retention period]

<!-- facts-needed: Kite chart intervals and history depth; intraday data retention period. -->

<!-- standing-disclaimer -->
