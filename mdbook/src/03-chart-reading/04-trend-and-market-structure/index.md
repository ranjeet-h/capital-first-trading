<!-- meta
id: T3.4
title: Trend and market structure
page_type: Concept
prerequisites: [T3.3]
labs: []
estimated_minutes: 25
-->

# Trend and market structure

## Hook

**Hypothetical.** A stock rises from Rs 200 to Rs 230. It falls to Rs 215, then rises to Rs 245 and falls to Rs 222. A trader sees one strong up day in the middle of that path. The trader says, "The trend is up, so I will buy." Yet the trader has not set a swing definition, a stop or a rule. The chart has been drawn, but the trend has not been defined. This chapter shows how to read the path step by step.

## The idea

A **trend** is the direction of successive swing points. It is not the direction of one candle. One up candle does not make an uptrend.

A **swing high** is a high with lower highs on both sides. A **swing low** is a low with higher lows on both sides. The number of candles on each side is your choice. Call it N. A change to N changes which points count as swings. A change to N can change the label too. Write N in your notes.

Three labels describe the structure:

- **Uptrend:** higher highs and higher lows.
- **Downtrend:** lower highs and lower lows.
- **Range:** neither pattern. The highs and lows move sideways.

Compare each swing with the previous swing of the same type. Compare highs with highs and lows with lows.

A **structure break** is the level where the current pattern fails. In an uptrend, a close below the most recent swing low means the last higher low has failed. The structure is no longer making higher lows.

Structure labels are **retrospective**. They are updated as new candles arrive. A label that looked clear last week can change this week.

A trend is a description that can end. Using a trend to decide a trade is a strategy. That strategy is covered in *Trend following in depth*.

## See it

The swing points from the worked example, sorted by type:

| Swing highs | Swing lows |
|---|---|
| Rs 230 | Rs 200 |
| Rs 245 | Rs 215 |
| | Rs 222 |

Read down each column. Each highs value is above the one before it. Each lows value is above the one before it. Those two facts describe an uptrend.

<!-- OPEN: The spec gives an interactive pattern-identification exercise (marked as new) where the reader taps swing points and the tool labels them. That name is not in the allowed component list, so no placeholder is added here. Confirm the name, then add the placeholder under this heading. -->

## Worked example

**Hypothetical.** Swing sequence in time order: low Rs 200, high Rs 230, low Rs 215, high Rs 245, low Rs 222.

| Swing | Price | Compared with the previous swing of the same type |
|---|---|---|
| Low | Rs 200 | none yet |
| High | Rs 230 | none yet |
| Low | Rs 215 | higher than Rs 200 |
| High | Rs 245 | higher than Rs 230 |
| Low | Rs 222 | higher than Rs 215 |

The lows 200, 215 and 222 are rising. The highs 230 and 245 are rising. The structure is an **uptrend**.

The structure-break level is Rs 222. A close below Rs 222 means the most recent higher low has failed. That close would change the label. Check: 222 is the most recent swing low, so it is the level to watch.

## Try it

### Guided exercise

**Task.** **Hypothetical.** Swing sequence in time order: low Rs 100, high Rs 120, low Rs 110, high Rs 125, low Rs 115. Label each swing as a higher or lower point. Classify the structure. Name the structure-break level.

Hints:

1. Compare each swing with the previous swing of the same type.
2. Compare the highs with the highs. Compare the lows with the lows.
3. Check whether both the highs and the lows are rising.
4. The structure-break level is the most recent swing low in an uptrend.

**Answer:** Lows: 110 is higher than 100, and 115 is higher than 110. Highs: 125 is higher than 120. The structure is an **uptrend**. The structure-break level is Rs 115, the most recent swing low.

### Independent exercise

**Task.** **Hypothetical.** Swing sequence in time order: high Rs 260, low Rs 240, high Rs 255, low Rs 238. Label each swing. Classify the structure. For a downtrend view, state the structure-break level.

<details><summary>Check your answer</summary>

- The high of Rs 255 is lower than the high of Rs 260. It is a lower high.
- The low of Rs 238 is lower than the low of Rs 240. It is a lower low.
- The structure is a **downtrend**: lower highs and lower lows.
- For a downtrend view, the structure-break level is the most recent swing high, Rs 255. A close above Rs 255 means the last lower high has failed.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks higher highs and higher lows, range identification, and why the swing definition must be fixed before you look.

## Paper task

Mode: **paper**. Write the result in your journal. If the journal is not ready, use paper.

1. Pick one stock.
2. Each week for 8 weeks, label the structure on the weekly chart as uptrend, downtrend or range.
3. Write the swing definition you used, including N. Keep it the same for all 8 weeks.
4. Note any week where your label changed after new data arrived.
5. Write down what changed, and why, without drawing a conclusion from the change.

## Limits and common mistakes

- The label depends on the swing definition. A different N can give different swings and a different label.
- Labels update as new candles arrive. A week labelled as an uptrend can become a range the next week.
- One up candle is not an uptrend. A new high on one day is not enough to make a trend.
- Writing "the trend is up, so I buy" without a rule and a stop is the mistake. A label alone is not a plan.

## Remember

- A trend is the direction of successive swing points, not one candle.
- Uptrend: higher highs and higher lows. Downtrend: lower highs and lower lows. Range: neither.
- Write down your swing definition, including N, before you label the chart.
- The structure-break level is the most recent swing point that the trend depends on.
- Labels are retrospective. Expect them to change as new candles arrive.

## Sources and verification

- Zerodha Varsity, trend module (reference only)
- Dow theory overview, from standard technical-analysis texts

<!-- facts-needed: none for the arithmetic. The Dow theory overview is a description of a classic framework, not a claim of predictive power. -->

<!-- standing-disclaimer -->
