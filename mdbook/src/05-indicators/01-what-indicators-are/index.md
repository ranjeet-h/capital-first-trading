<!-- meta
id: T5.1
title: What indicators are and are not
page_type: Concept
prerequisites: [T3.1, T3.4]
labs: []
estimated_minutes: 15
-->

# What indicators are and are not

## Hook

A trader named Meena (hypothetical) sees a line on her chart cross above another line. She is confident the price will rise tomorrow. She has not checked what the lines are made from. Both lines are only averages of past prices. Neither line knows tomorrow. This chapter explains what an indicator is, and what it cannot do.

## The idea

An **indicator** is a formula. It takes past prices, and sometimes volume, over a fixed window of days. Then it gives one number, or a line, for each day.

An indicator adds no outside information. It only rearranges the price data you already have. Its output describes the past and the present. It is not a forecast.

Three words matter here:

- **Window.** The number of days the formula looks back over. A five-day window uses the last five days.
- **Parameter.** A setting you choose for the formula, such as the window length. A five-day average and a twenty-day average use different parameters.
- **Lagging.** An indicator that averages past data reacts after the price has already moved. It is late by design.

Three points follow from this.

1. **Indicators lag.** Most trend indicators average past data, so they react after a turn in price. They cannot react to a turn before it happens.
2. **Many indicators are related.** Most indicators are built from the same closing prices. Two of them often agree because they use the same data. Using several of them does not give you several independent opinions.
3. **Changing a parameter changes the answer.** A five-day line and a twenty-day line can give opposite readings on the same day. You must fix the parameters before you test them. You will see this in *Indicator playground and when indicators disagree*.

Indicators do not replace the other rules in this book. A trade still needs a stop and a size. The stop and size come from rules you set first, such as those in *Position sizing step by step*.

Here are three things an indicator cannot tell you:

- It cannot tell you tomorrow's close.
- It cannot tell you whether a crossover will work this time.
- It cannot tell you how much you can lose on a trade.

## See it

<!-- component: indicator-playground | caption: Change the window length of an average and watch the line lag or lead the price -->

Change the window length and watch the line. A longer window makes the line smoother and slower. A shorter window makes it follow the price more closely. Notice that the line always trails the price after a turn. Try the first turn in the chart, then the second.

## Worked example

**Hypothetical.** Closes for five days: Rs 100, Rs 102, Rs 104, Rs 103 and Rs 105.

| Step | Calculation | Result |
|---|---|---|
| 1. Add the five closes | 100 + 102 + 104 + 103 + 105 | Rs 514 |
| 2. Divide by 5 | 514 / 5 | Rs 102.80 |
| 3. Compare with the latest close | 105 - 102.80 | Rs 2.20 above the average |

The average of Rs 102.80 summarises the last five days. It does not predict day six. The latest close is above the average because the price rose. That is all the number tells you.

## Try it

<!-- component: indicator-playground | caption: Interactive demo of the window length, with the line compared against the price -->

### Guided exercise

**Task.** Closes on three days are Rs 100, Rs 102 and Rs 104. Work out the three-day average.

Hints:

1. Add the three closes.
2. Divide the total by 3.

**Answer:** Rs 102.00. The total is Rs 306, and 306 / 3 = Rs 102.00.

### Independent exercise

**Task.** Explain in three sentences why an indicator built only from closing prices cannot know tomorrow's close.

<details><summary>Check your answer</summary>

A good answer has three points. The indicator uses only data up to today. Tomorrow's close is not in that data. A formula cannot create information that the data does not hold.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the arithmetic of a simple average. It also checks that you know indicators lag and cannot forecast.

## Paper task

Mode: **kite_demo**. Demo only. Do not place any order.

1. Open the demo chart for one stock.
2. List every indicator on the chart. Write its name and its parameter, such as the window length.
3. Record the default parameter for each indicator. Note the default as shown in the demo, and mark it [VERIFY: Kite default parameters] until you confirm it in Kite's help.
4. For each indicator, write one sentence on what it describes about the past.

Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- An indicator does not tell you that a trade is good. It only summarises past prices.
- A crossover of two lines is an observation. It is not a signal you can rely on until you have tested it.
- Stacking several indicators adds more lines, not more evidence. Many of them use the same closing prices.
- A longer window is not always more accurate. It is only smoother and slower.
- An indicator does not reduce the need for a stop and a size rule.

## Remember

- An indicator is a formula applied to past prices or volume over a window.
- Most trend indicators lag, because they average past data.
- Indicators describe the past and the present. They are not forecasts.
- Related indicators agree often, so agreement is not separate proof.
- Fix the parameters before you test. Changing them after you see results is a common self-deception.

## Sources and verification

- Zerodha Varsity, technical indicators overview (reference only).
- Kite chart help [VERIFY: page title and the indicator list shown in Kite].
- Standard technical-analysis texts [VERIFY: choose the texts to cite].

Facts to verify before this chapter is final:

[VERIFY: Kite indicator list and default parameters]

<!-- facts-needed: Kite indicator list and default parameters from Kite chart help; the exact page title for the chart help. -->

<!-- standing-disclaimer -->
