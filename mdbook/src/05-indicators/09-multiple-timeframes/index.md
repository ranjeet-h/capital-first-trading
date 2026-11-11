<!-- meta
id: T5.9
title: Multiple timeframe analysis
page_type: Concept
prerequisites: [T3.2, T5.2, T5.4]
labs: [Lab 4]
estimated_minutes: 25
-->

# Multiple timeframe analysis

## Hook

A trader looks at a daily chart and sees a small dip. The trader then checks the 5-minute chart, the hourly chart and the weekly chart. Each one tells a slightly different story. After enough checking, the trader finds one chart where the picture looks clear. The trader then trades on that chart alone. This chapter shows a simple way to use two timeframes, and why adding more can fool you.

## The idea

Multiple timeframe analysis means looking at the same stock on more than one timeframe (*Timeframes and how the same price looks different*). Keep the method simple.

- **The higher timeframe is a filter.** It decides whether trades are allowed at all. For example, a weekly rule.
- **The lower timeframe is the trigger.** It decides when, within the allowed trades, to act. For example, a daily rule.

You can build a higher-timeframe candle from lower-timeframe candles. The rules from *Timeframes and how the same price looks different* apply:

- Open comes from the first candle in the period.
- Close comes from the last candle in the period.
- High is the largest high. Low is the smallest low.

Some points to keep in mind:

- Pick two timeframes before you test anything. Write them down.
- Each extra timeframe adds settings. More settings make it easier to fit a rule to past data (*Overfitting and the number of things you tried*).
- Holiday weeks have fewer daily candles. A weekly candle built from a short week covers fewer days. The days when the market is shut are on the NSE trading holidays page.
- A filter that passes is not a forecast. It only says the rule allows a look.

## See it

<!-- component: candle-builder | data: five-daily-candles | timeframe: daily | weeklyToggle: on | caption: Five daily candles for one hypothetical week; a switch redraws them as one weekly candle and back -->

Start with the five daily candles. Switch to weekly and see one candle replace them. Check that the weekly open is the Monday open and the weekly close is the Friday close. Then switch back and compare.

## Worked example

**Hypothetical.** Five daily candles for one week. Each row shows open, high, low and close in rupees.

| Day | Open | High | Low | Close |
|---|---|---|---|---|
| Mon | Rs 290 | Rs 296 | Rs 288 | Rs 294 |
| Tue | Rs 294 | Rs 301 | Rs 293 | Rs 299 |
| Wed | Rs 299 | Rs 300 | Rs 292 | Rs 293 |
| Thu | Rs 293 | Rs 297 | Rs 290 | Rs 291 |
| Fri | Rs 291 | Rs 298 | Rs 289 | Rs 296 |

Build the weekly candle:

| Part | Rule | Check | Weekly value |
|---|---|---|---|
| Open | open of the first day | Mon open | **Rs 290** |
| High | largest of the five highs | 296, 301, 300, 297, 298 | **Rs 301** |
| Low | smallest of the five lows | 288, 293, 292, 290, 289 | **Rs 288** |
| Close | close of the last day | Fri close | **Rs 296** |

The weekly candle is bullish, because the close (Rs 296) is above the open (Rs 290).

**Hypothetical filter.** Suppose the rule says: the weekly close must be above a 10-week average of Rs 285. This number is illustrative. Rs 296 is above Rs 285, so the filter passes.

**Hypothetical trigger.** Suppose the daily rule looks for a pullback to about Rs 291, near a 20-day average of Rs 290. This number is also illustrative. The trigger is read only after the filter passes.

## Try it

### Guided exercise

**Task.** Build one weekly candle from the five daily candles in the worked example. Confirm that the weekly candle is bullish.

Hints:

1. The weekly open is the first day's open.
2. Find the largest of the five highs.
3. Find the smallest of the five lows.
4. The weekly close is the last day's close.

**Answer:**

- Open: Rs 290 (Monday).
- High: Rs 301 (Tuesday's high is the largest).
- Low: Rs 288 (Monday's low is the smallest).
- Close: Rs 296 (Friday).
- Bullish, because Rs 296 is above Rs 290.

### Independent exercise

**Task.** A hypothetical week ends with a weekly close of Rs 280. The illustrative 10-week average is Rs 285. Does the filter pass? What does the framework say to do with the daily pullback that week?

<details><summary>Check your answer</summary>

- The filter asks whether the weekly close is above Rs 285.
- Rs 280 is below Rs 285, so the filter does not pass.
- The framework does not allow trades for that direction this week.
- So the daily pullback is not used. The rule does not read it, whatever the daily chart looks like.

All numbers are hypothetical and illustrative.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks how a weekly candle is built, what a filter does, and why more timeframes add risk.

## Paper task

Mode: **paper**. This is a learning log only. Log it in your journal (or on paper until the journal app is ready).

1. Choose five stocks from a chart you are allowed to view.
2. Write down your two timeframes before you look at any chart.
3. Each week, record the higher-timeframe filter result: pass or not.
4. If the filter passes, record what the lower-timeframe rule says.
5. After four weeks, write one sentence on whether you changed either timeframe during the test.

## Limits and common mistakes

- Two timeframes do not make a trade safer. A stop and a position size are still needed.
- Each added timeframe adds settings. More settings make overfitting easier.
- A weekly candle needs its full set of days. A holiday week can give a candle built from fewer days.
- A filter that passes is not a forecast. The filter only allows a look at the trigger.

## Remember

- The higher timeframe is a filter. The lower timeframe is the trigger.
- A weekly candle has the first day's open, the highest high, the lowest low and the last day's close.
- Fix your two timeframes before you test. Do not add more after you see results.
- Agreement across timeframes is not proof that a trade will work.

## Sources and verification

- Zerodha Varsity, multiple timeframe module (reference only, original wording).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting), for the chart intervals Kite offers. It says intraday data is available from 2015.
- NSE India, trading holidays page.

<!-- standing-disclaimer -->
