<!-- meta
id: T5.10
title: Indicator playground and when indicators disagree
page_type: Concept
prerequisites: [T5.1, T5.2, T5.3, T5.4, T5.5, T5.6, T5.7, T5.8, T5.9]
labs: [Lab 4]
estimated_minutes: 25
-->

# Indicator playground and when indicators disagree

## Hook

A reader puts five indicators on one chart. Four say the price is rising. One says it is overbought. The reader feels confident and buys. Later, the reader changes the period of one indicator again and again, until an old trade looks like a winner. This chapter shows why that is self-deception. It also shows how to set a tie-break rule before you look at the data.

## The idea

Indicators are built from a small set of inputs, mostly the closes, the volume and the high and low. Many indicators use the same closes. So many of them give the same answer.

Some points to keep in mind:

- **Indicators are often redundant.** Two momentum indicators built from the same closes will agree most of the time for that reason. Count the inputs, not the names.
- **Disagreement is normal.** Decide before you look which indicator, if any, decides.
- **Changing settings after you see results is the most common self-deception.** A setting that looks good on past data may not work on new data (*Overfitting and the number of things you tried*).
- **The playground is for understanding.** It shows how a formula reacts when a setting changes. It is not for finding the best setting.
- **Stops and position size still apply.** They apply even when every indicator agrees.

The short rule: write the tie-break rule first, then look at the data.

## See it

<!-- component: indicator-playground | indicator: sma | period: 10 | compareTo: 20,50 | predict: on | sliders: period | caption: Price with a short and a longer average; a predict mode asks you to say which side the average sits on before the answer is shown -->

Move the period slider from 10 to 50. Watch how the average changes shape as the period grows. Use the predict mode before you reveal each answer. Write down your guess, then check it. Notice how often two averages with different periods give different answers on the same date.

## Worked example

**Hypothetical and illustrative only.** One date. Close Rs 250. The readings below come from four indicators.

| Reading | Value | What it says |
|---|---|---|
| 20-day average | Rs 248 | Price is above the average, so the reading leans up |
| RSI | 72 | Above the common 70 reference, so it reads overbought |
| MACD histogram | Positive | Momentum is leaning up |
| Upper Bollinger Band | Rs 255 | Price is below the upper band, so the band is not touched |

Most readings point up. One points to overbought. Counting readings does not decide the trade. A rule written before the day decides.

Suppose the rule uses only the breakout test from *The fully specified swing strategy*. Then the RSI reading is not used at all. The breakout test decides, and the count of indicators makes no difference.

**Parameter sensitivity.** Same date, same close of Rs 250. Now change only the period of the average:

| Average | Value | Above or below the close of Rs 250 |
|---|---|---|
| 10-day | Rs 252 | Above |
| 20-day | Rs 248 | Below |
| 50-day | Rs 240 | Below |

The 20-day and 50-day averages sit below the close. The 10-day average sits above it. The same date gives a different reading when only the period changes. That is why you fix the periods before you test.

## Try it

### Guided exercise

**Task.** The close rises sharply for three days in a row. Predict whether a 10-day average will sit above or below the latest close. Then check your guess in the playground.

Hints:

1. A shorter average reacts faster than a longer one.
2. After a sharp rise, the short average moves up quickly.
3. The average still includes older, lower closes. Ask how far the latest close sits above the average.

**Answer:** The 10-day average moves up quickly after the rise. It usually stays below the latest close, because it still includes older and lower closes. Check this on the playground, and try a different number of rising days.

### Independent exercise

**Task.** Write a tie-break rule in one paragraph. Use at most two indicators. State what you do when they disagree, and what you do when they agree. Write it before you look at any chart.

<details><summary>Check your answer</summary>

A good answer has these parts:

- The two named indicators, with their periods fixed.
- The rule for agreement, for example: both lean up, so the rule allows the trade and the stop and size rules apply.
- The rule for disagreement, for example: one leans up and one leans down, so the rule allows no trade that day.
- A note that the rule was written before the data was read.

The rule should not change after a result. If it changes, write the change as a new rule and test that rule separately.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks how indicators agree, how a period changes a reading, and why settings must be fixed before a test.

## Paper task

Mode: **paper**. This is a learning log only. Log it in your journal (or on paper until the journal app is ready).

1. Choose two indicators from this track. Fix their periods and write them down.
2. Write a tie-break rule for disagreement. Date it before you look at the data.
3. On 10 days where the two indicators disagree, record the rule's answer.
4. Record the outcome later, after a fixed number of days. Write the outcome as a learning note.
5. Write one sentence on whether any period change would have changed your answer.

## Limits and common mistakes

- Changing periods after you see results is the main way to fool yourself. Fix the settings before you test.
- Agreement is not proof. Two indicators built from the same closes can give the same answer twice.
- A disagreement rule written after a loss is hindsight. It is not a rule.
- The playground shows how a formula behaves. It does not show which setting works.

## Remember

- Count the inputs, not the names. Many indicators use the same closes.
- Decide the tie-break rule before you look at the data.
- Fix the periods before you test. Record every setting you try.
- Stops and position size still apply when all indicators agree.

## Sources and verification

- The sources listed in the earlier chapters of this track.
- Peer-reviewed work on overfitting and data snooping in trading tests.

<!-- facts-needed: default periods used by the Kite chart indicators (see the earlier chapters of this track). -->

[VERIFY: Kite default indicator periods]

<!-- OPEN: The spec's visual line asks for several parameter sliders and a predict-then-reveal mode. The placeholder keys above are the intended inputs. Check them when the playground is built. The spec's worked example says all three averages are below the close. The 10-day average at Rs 252 is above Rs 250, so the text states the correct reading. -->

<!-- standing-disclaimer -->
