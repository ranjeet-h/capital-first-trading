<!-- meta
id: T3.1
title: Candlesticks
page_type: Concept
prerequisites: [T1.4, T1.5]
labs: []
estimated_minutes: 25
-->

# Candlesticks

## Hook

**Hypothetical.** A stock opens the day at Rs 500. It closes the day at Rs 509. The chart shows that whole day as one box. A trader looks at the box. The trader thinks, "The price went up, so it will keep going up." That thought is the mistake this chapter addresses. The box is a summary of one day. It holds four numbers. It does not say what the next day will bring.

## The idea

A price is one trade. Many trades happen in a day, so many prices appear. A candle squeezes all the prices for one period into four numbers.

The four numbers are:

- **Open:** the first traded price in the period.
- **High:** the highest traded price in the period.
- **Low:** the lowest traded price in the period.
- **Close:** the last traded price in the period.

A period can be one minute, one day or any other length. The length is covered in *Timeframes and how the same price looks different*.

The candle has three parts that come from those four numbers:

- **Body:** the thick part. It is the gap between open and close, never a negative number. Body = close minus open, ignoring the sign.
- **Shadows** (also called wicks): the thin lines above and below the body. The upper shadow runs from the top of the body up to the high. The lower shadow runs from the bottom of the body down to the low.
- **Range:** the full height of the candle. Range = high minus low.

Two labels describe the candle:

- A **bullish** candle has a close above its open. The price finished higher than it started.
- A **bearish** candle has a close below its open. The price finished lower than it started.

Colours differ between charting tools. One tool may draw bullish candles in green. Another may use white. Read the legend, the small key on the chart, before you rely on colour. The rule is the comparison of close with open, not the colour. Kite's default candles are green and red. Zerodha says a setting called "Colour bars based on previous close" can change how the colours are chosen, so read the legend on your own chart. (As of 11 Nov 2026, Zerodha support page on candle colours. Settings change, so check Kite.)

A candle is built from many trades. Each trade is one tick. The candle keeps the first, highest, lowest and last tick of the period.

The open of a daily candle on NSE comes from the pre-open phase. NSE sets the day's open price from the price found in pre-open, which runs from 9:00 am to 9:15 am. If no price is found there, the first trade of the normal market at 9:15 am is the open. The session times are covered in *Trading sessions, timings and holidays*. (As of 11 Nov 2026, NSE pre-open page. Rules change, so check the NSE site.) Daily candles on Kite use the exchange's end-of-day data, while minute candles are built from the live price feed, so the open on a minute chart can differ a little from the daily open.

A candle does not show everything. It does not show the order of trades inside the period. It does not show how many shares were traded. It says nothing certain about the next candle.

## See it

<!-- component: candle-builder | ticks: 501, 499, 510, 506 | caption: One candle forming from four ticks; open, high, low and close update as each tick arrives; Play, Pause, Step and Reset; text table alongside -->

Use Step to add one tick at a time. The open stays fixed at the first tick. The high and low move only when a new extreme arrives. The close is always the last tick. Use Play, Pause, Step and Reset. Check each number against the text table beside the picture.

## Worked example

**Hypothetical.** One daily candle: open Rs 500, high Rs 512, low Rs 497, close Rs 509.

| Part | Calculation | Result |
|---|---|---|
| Body | 509 minus 500 | Rs 9 |
| Upper shadow | 512 minus 509 | Rs 3 |
| Lower shadow | 500 minus 497 | Rs 3 |
| Range | 512 minus 497 | Rs 15 |

Check: body plus both shadows must equal the range. 9 + 3 + 3 = 15.

The close is above the open, so the candle is **bullish**.

Cost check, before charges: 100 shares at Rs 509 cost 100 x 509 = Rs 50,900. Check: 100 x 500 = Rs 50,000, and 100 x 9 = Rs 900, which adds to Rs 50,900.

## Try it

### Guided exercise

**Task.** Five ticks arrive in this order: Rs 501, Rs 499, Rs 510, Rs 506 and Rs 504. Build the candle. Give the open, high, low and close. Say whether it is bullish or bearish.

Hints:

1. The open is the first tick.
2. The high is the largest tick.
3. The low is the smallest tick.
4. The close is the last tick.

**Answer:** Open Rs 501. High Rs 510. Low Rs 499. Close Rs 504. The candle is **bullish**, because 504 is above 501.

- Body: 504 minus 501 = Rs 3.
- Upper shadow: 510 minus 504 = Rs 6.
- Lower shadow: 501 minus 499 = Rs 2.
- Range: 510 minus 499 = Rs 11. Check: 3 + 6 + 2 = 11.

### Independent exercise

**Task.** **Hypothetical.** A candle has open Rs 300, high Rs 308, low Rs 296 and close Rs 297. Work out the body, the upper shadow, the lower shadow and the range. Say whether the candle is bullish or bearish. Name one thing this candle does not show.

<details><summary>Check your answer</summary>

- Body: 300 minus 297 = Rs 3.
- Upper shadow: the top of the body is the open here, because the close is lower. 308 minus 300 = Rs 8.
- Lower shadow: 297 minus 296 = Rs 1.
- Range: 308 minus 296 = Rs 12. Check: 3 + 8 + 1 = 12.
- The candle is **bearish**, because 297 is below 300.
- One thing it does not show: the order of the trades inside the day. It also does not show the volume. Either answer is correct.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the four prices, the body and shadow arithmetic, and what a single candle cannot tell you.

## Paper task

Mode: **paper**. Pick one stock and a chart you are allowed to view. Write the result in your journal. If the journal is not ready, use paper.

1. Choose one stock. Use a chart you are allowed to view.
2. For 10 daily candles, write the open, high, low and close.
3. For each candle, work out the body, the upper shadow, the lower shadow and the range.
4. Mark each candle as bullish or bearish.
5. If you use the Kite demo instead, write the mode as `kite_demo`. Say that the demo is for interface practice only.

## Limits and common mistakes

- A long lower shadow does not mean the price will bounce. It shows only that the price fell during the period and then recovered part of the fall.
- Colour does not define a candle. Check the legend first. Then compare the close with the open.
- The order of moves inside a candle is unknown. The shape cannot show whether the high or the low came first.
- A candle does not show volume. Two candles with the same shape can have very different numbers of shares traded. Volume is covered in *Volume and what it adds*.
- A candle is a record of one period. Calling the last candle strong or weak does not predict the next one.

## Remember

- A candle squeezes one period into four numbers: open, high, low and close.
- Body = close minus open, ignoring the sign. Range = high minus low.
- Bullish means close above open. Bearish means close below open.
- Colour is a display setting. Read the legend before you rely on it.
- A candle describes one past period. It is not a forecast.

## Sources and verification

- Zerodha Varsity, candlestick module (reference only)
- NSE India, market data definitions
- Kite chart help pages

Facts checked on 11 Nov 2026:

- Kite's default candle colours are green and red, and a setting can change them. This comes from Zerodha's support site.
- NSE sets the day's open from the pre-open price, or from the first normal-market trade if pre-open finds none. This comes from NSE's pre-open page.
- Daily candles use exchange end-of-day data, and minute and hourly candles use the live feed. This comes from Zerodha's support site.

<!-- standing-disclaimer -->
