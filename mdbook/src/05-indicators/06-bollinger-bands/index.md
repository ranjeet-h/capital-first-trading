<!-- meta
id: T5.6
title: Bollinger Bands
page_type: Math/Calculator
prerequisites: [T5.2, T5.3]
labs: [Lab 4]
estimated_minutes: 25
-->

# Bollinger Bands

## Hook

A reader sees a close above the upper line on a chart. The reader thinks, "The price is too high, so it must fall." The reader sells the next morning. The price keeps rising for two more weeks. This chapter shows what the bands measure, how to calculate them by hand, and why touching a band is not a signal on its own.

## The idea

Bollinger Bands are three lines drawn around the price. Each line has a job.

- **Middle band.** The average of the last N closes. A common choice is N = 20.
- **Standard deviation (SD).** A number that shows how spread out those same closes are. Small SD means the closes sit close together. Large SD means they are spread wide.
- **Upper band.** The middle band plus k times the SD.
- **Lower band.** The middle band minus k times the SD. A common choice is k = 2.

In words first: upper band = average + (k times SD). In symbols: upper = average + k x SD.

There are two ways to calculate SD:

- **Population SD** divides the total of the squared differences by N.
- **Sample SD** divides the same total by N minus 1.

Tools can use either one. John Bollinger's own site says it uses the population calculation. Zerodha's charting manual does not say which one Kite uses, so check before you compare numbers from two tools. (As of 11 Nov 2026, bollingerbands.com. This is a common convention, not an exchange rule.)

Some points to keep in mind:

- The bands measure spread around an average. They do not measure what the price will do next.
- When the price moves more, the SD rises and the bands get wider. When the price calms down, the bands narrow.
- A close above the upper band tells you where the price sits compared with recent closes. It does not say the price will turn.

## See it

<!-- component: indicator-playground | indicator: bollinger | closes: 100,102,104,103,105 | period: 5 | k: 2 | sdMode: population | caption: Three lines drawn around the closes; a switch changes between population and sample SD and the bands redraw -->

Watch the middle line first. Then look at how far the upper and lower lines sit from it. Switch from population to sample SD and see how the bands move a little. Change k from 2 to 1 and see how much narrower the bands become.

## Worked example

**Hypothetical.** Five closes: Rs 100, Rs 102, Rs 104, Rs 103 and Rs 105. We use N = 5 so the sum is easy to check by hand. We use k = 2 and population SD.

| Step | Calculation | Result |
|---|---|---|
| 1. Middle band (average) | (100 + 102 + 104 + 103 + 105) / 5 | Rs 102.80 |
| 2. Differences from the average | 100 - 102.80, and so on | -2.80, -0.80, +1.20, +0.20, +2.20 |
| 3. Squared differences | each difference times itself | 7.84, 0.64, 1.44, 0.04, 4.84 |
| 4. Total of squares | 7.84 + 0.64 + 1.44 + 0.04 + 4.84 | 14.80 |
| 5. Population variance | 14.80 / 5 | 2.96 |
| 6. Population SD | square root of 2.96 | Rs 1.72 |
| 7. Band distance | 2 x 1.72, using the unrounded SD | Rs 3.44 |
| 8. Upper band | 102.80 + 3.44 | **Rs 106.24** |
| 9. Lower band | 102.80 - 3.44 | **Rs 99.36** |

Keep the extra decimals while you work. Round only at the end.

**Hypothetical. Same closes, sample SD.** Total of squares is still 14.80. Divide by N minus 1 = 4. Sample variance = 14.80 / 4 = 3.70. Sample SD = square root of 3.70 = Rs 1.92 (rounded). Band distance = 2 x 1.9235 = Rs 3.85 (rounded). Upper band = Rs 106.65. Lower band = Rs 98.95.

The sample version gives slightly wider bands here. The difference comes only from the divisor.

## Try it

<!-- component: indicator-playground | indicator: bollinger | closes: 10,12,14 | period: 3 | k: 2 | sdMode: population | edit: on | caption: The closes of the guided exercise. Change them, the window or k, and see the bands -->

### Guided exercise

**Task.** Closes Rs 10, Rs 12 and Rs 14. N = 3, population SD, k = 2. Find the middle band, the SD and the upper and lower bands.

Hints:

1. The average of 10, 12 and 14 is the middle band.
2. Square each difference from the average. Add the squares.
3. Divide the total by 3 to get the variance. Then take the square root.

**Answer:**

- Middle band: (10 + 12 + 14) / 3 = **Rs 12**.
- Differences: -2, 0, +2. Squares: 4, 0, 4. Total: 8.
- Variance: 8 / 3 = 2.667.
- SD: square root of 2.667 = 1.633, which rounds to Rs 1.63.
- Band distance: 2 x 1.633 = 3.266.
- Upper band: 12 + 3.266 = **Rs 15.27**.
- Lower band: 12 - 3.266 = **Rs 8.73**.

### Independent exercise

**Task.** Closes Rs 200, Rs 204, Rs 196 and Rs 200. N = 4, population SD, k = 2. Find the upper and lower bands.

<details><summary>Check your answer</summary>

- Middle band: (200 + 204 + 196 + 200) / 4 = Rs 200.
- Differences: 0, +4, -4, 0. Squares: 0, 16, 16, 0. Total: 32.
- Population variance: 32 / 4 = 8.
- SD: square root of 8 = 2.828, which rounds to Rs 2.83.
- Band distance: 2 x 2.828 = 5.657, which rounds to Rs 5.66.
- Upper band: 200 + 5.66 = **Rs 205.66**.
- Lower band: 200 - 5.66 = **Rs 194.34**.

All prices are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the arithmetic of the bands, the difference between the two SD methods, and why a band touch is not a signal alone.

## Paper task

Mode: **paper**. This is a learning log, not a record of trades. Log it in your journal (or on paper until the journal app is ready).

1. Choose five stocks from any chart you are allowed to view.
2. Each week, write the close and whether it was outside the upper or lower band.
3. Each week, write the band width. Band width = upper band minus lower band.
4. Read the log at the end of the month. Write what surprised you.
5. Do not use the log as proof that any band rule works.

## Limits and common mistakes

- The bands use only past closes. They say nothing certain about the next close.
- In a strong trend, price can stay near one band for a long time. A touch can be the start of a trend, not a turn.
- The result depends on the window and the SD method. Two tools can draw different bands from the same closes.
- A band touch is not a signal alone. A rule needs a stated entry, a stop and a test before anyone uses it (*Backtesting basics and the realism contract* explains how a test is set up).

## Remember

- The middle band is an average. The upper and lower bands add and subtract k times the SD.
- SD measures spread. A narrow band means the closes were close together.
- Population SD divides by N. Sample SD divides by N minus 1. Check which one your tool uses.
- A close outside a band is an observation. It is not a forecast.

## Sources and verification

- John Bollinger, *Bollinger on Bollinger Bands* (the originator's book).
- Zerodha Varsity, Bollinger Bands module (reference only, original wording).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting). It gives no default Bollinger setting, so read it on your own screen.
- StockCharts ChartSchool, Bollinger Bands page. It gives a 20-period simple average, with bands 2 standard deviations away. (As of 11 Nov 2026. This is a common convention, not an exchange rule.)

<!-- standing-disclaimer -->
