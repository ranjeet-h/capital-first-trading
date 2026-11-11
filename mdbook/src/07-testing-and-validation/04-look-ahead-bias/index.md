<!-- meta
id: T7.4
title: Look-ahead bias
page_type: Concept
prerequisites: [T7.3]
labs: [Lab 4]
estimated_minutes: 15
-->

# Look-ahead bias

## Hook

Imagine a rule buys when today's close is the highest close of the last 20 days. A test fills the trade at that same close, Rs 300. But you only know the close after the market shuts. At Rs 300 you could never have bought that trade. The test gave you the price you wanted, not the price you could get. This mistake is called look-ahead bias. It makes a result look better than it could have been.

## The idea

**Look-ahead bias** means a decision uses information that did not exist at the time of the decision. The test sees the future, even by a little.

It has three common forms:

1. **Same-close fill.** The trade fills at the same close that produced the signal. The close was not known until the day ended.
2. **Full-sample statistic.** A rule uses a number calculated over all the data, including years after the signal. For example, a percentile or a median across all years.
3. **Later data used as if known.** Data that was adjusted or revised later is used as if it were known at the time. The adjustment factor is worked out after the event (*Historical data*).

Each form makes a result look better than it could have been traded. The effect usually points the same way. The test looks more profitable than the real trade would have been.

The lab's peek switch shows the same rules twice. The peek run uses the leaking method. The honest run does not. Putting the two results side by side shows how much the leak helped.

## See it

| Result on the same rules (hypothetical) | Peek run | Honest run |
|---|---|---|
| Fill price | Rs 300, the same close | Rs 303, the next open |
| Cost of 10 shares | 10 x 300 = Rs 3,000 | 10 x 303 = Rs 3,030 |
| Shown result | Looks better | Lower, and realistic |

Read the two rows that matter. The peek run is cheaper by Rs 30 for each trade. That small gap is the leak. The honest run is the result you could have traded.

<!-- component: lookahead-peek | caption: Turn the peek on and off and watch two made-up result lines pull apart, then find the line that leaks the future. -->

## Worked example

**Hypothetical.** The rule: buy when the close is the highest close of the last 20 days.

- Peek fill: at the same close, Rs 300.
- Honest fill: at the next open, Rs 303.
- Shares: 10 in each trade.

Per trade:

- Peek cost: 10 x 300 = Rs 3,000.
- Honest cost: 10 x 303 = Rs 3,030.
- Difference: 3,030 - 3,000 = **Rs 30** per trade.

Over 40 hypothetical trades:

- 40 x 30 = **Rs 1,200**.
- Check: Rs 1,200 / 40 = Rs 30 per trade.

The size of the gap depends on the rule and the market. The lesson is the direction. In this example, the peek run looks better.

## Try it

### Guided exercise

**Task.** The four lines below form a rule set. One line leaks. Find it, and say which form of look-ahead it uses.

1. Calculate the 20-day average close, using closes up to and including today.
2. Calculate the median close across all years in the data, and use it as the level to beat.
3. Buy at the next day's open when today's close is above the 20-day average close.
4. Sell at the next day's open when today's close is below the 20-day average close.

Hints:

1. For each line, ask whether the number was known at the close of the day it is used.
2. Check any line that uses the words percentile, median, average over the whole dataset or adjusted.
3. Compare the data each line can see on the day of the decision.

**Answer:**

- Line 2 leaks. It uses a median across all years, including years after the signal. This is form 2, a full-sample statistic.
- Lines 1, 3 and 4 do not leak. Line 1 uses closes up to today. Lines 3 and 4 fill at the next open.
- A fix for line 2: use the median of all closes up to and including today, recalculated each day.

### Independent exercise

**Task.** Write a rule that leaks through a full-sample median. Then write the fix.

<details><summary>Check your answer</summary>

**Leaking rule:** Buy when today's close is above the median close of the whole data set. The median uses years after the signal, so the rule uses future information.

**Fixed rule:** Buy at the next day's open when today's close is above the median of all closes up to and including today. Recalculate the median each day, using only the data available that day.

All figures in this example are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the three forms of look-ahead, same-close fills, full-sample statistics and what a peek result means.

## Paper task

Mode: **learning note**. Use the peek switch in Lab 4 to run both versions of one rule. If the lab is not ready, do the task on paper or in a spreadsheet.

1. Choose one simple rule, such as a 20-day high breakout.
2. Run the honest version and record its result.
3. Run the peek version and record its result.
4. Write the difference in a learning note, and the form of look-ahead that caused it.
5. Log the note in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- Removing look-ahead does not prove an edge. The honest run can still lose money.
- The Rs 30 gap in the worked example is one made-up case. The size of the leak depends on the rule. The direction is the lesson.
- Adjusted data can leak in ways a simple check cannot find. A rule that uses adjusted prices needs a check of when each adjustment was known. Read your data source's notes on how and when it changes past prices.
- A peek run shows where the leak is. Do not record a peek result as the result of the rule.

## Remember

- Look-ahead bias uses information that did not exist when the decision was made.
- The three forms are a same-close fill, a full-sample statistic and later-revised data.
- A fill at the signal's own close is not realistic.
- A peek run that looks better is a warning, not a success.

## Sources and verification

- Bailey, Borwein, Lopez de Prado and Zhu (2014), "Pseudo-Mathematics and Financial Charlatanism: The Effects of Backtest Overfitting on Out-of-Sample Performance", Notices of the American Mathematical Society, 61(5), 458-471.
- Robert Pardo, *The Evaluation and Optimization of Trading Strategies*, 2nd edition (Wiley, 2008).

<!-- standing-disclaimer -->
