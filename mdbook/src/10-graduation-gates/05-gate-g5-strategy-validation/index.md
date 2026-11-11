<!-- meta
id: T10.5
title: Gate G5 strategy validation
page_type: Assessment
prerequisites: [T7.1, T7.2, T7.3, T7.4, T7.5, T7.6, T7.7, T7.8, T7.9, T7.10, T7.11, T6.4]
labs: [Lab 4]
estimated_minutes: 35
-->

# Gate G5 strategy validation

## Hook

A backtest of a made-up strategy shows steady gains on past data. You want to believe it. This gate asks you to run the test with costs on, to hold back a period of data, and to explain why the result may not hold in live trading. Explaining the result well matters more than the result itself.

## The idea

A *backtest* runs a set of trading rules on past prices. An *in-sample* period is the data you used while you shaped the idea. A *held-out* period is a later stretch of data you did not use to shape the idea. This gate asks you to report both separately.

> This measures educational competence. It is not proof of profitability. Nothing here requires or recommends trading with real money.

To pass, you must complete all of these:

1. **Save a run.** Save the run with its record. The record shows the unique code for the data used, the strategy written as settings, the parameters, the version of the test program and the random setting used.
2. **Turn costs on.** Costs must be on in the run.
3. **Report two periods.** Report the in-sample period and the held-out period separately.
4. **Write the explanation.** Cover the result. Check at least three biases, such as look-ahead, survivorship or overfitting. Give the trial count, which is how many settings you tried. Give at least three reasons the result may not hold live. Reasons can include fills, costs, changing market conditions, sample size and liquidity.
5. **Tick the rubric.** Each required point in the explanation rubric must be ticked, with text written for it.

The rubric rejects the words "profitable" and "ready" when they describe the result. Describe the result in plain words instead.

Each retake uses a different documented dataset. Earlier runs stay in your history.

A passing explanation is not a validation of a strategy. A strategy that passes this gate still needs forward evidence, shown in *Gate G6 paper and forward record*. It may still fail live.

If the backtester is not ready, do the task on paper or in a spreadsheet.

## See it

This gate has no picture to explore. Use this table to set out the two periods.

| Period | What it is for | What you report |
|---|---|---|
| In-sample | Shaping the idea | Result, with costs on |
| Held-out | Checking the idea on data you did not use to shape it | Result, reported separately |

Keep the two rows apart. Never blend them into one number.

## Worked example

**Hypothetical.** A made-up strategy on a made-up capital of Rs 50,000.

| Period | Role | Result | Percent of Rs 50,000 |
|---|---|---|---|
| In-sample | Shaping the idea | Rs 4,000 gain | 8.0% |
| Held-out | Checked later | Rs 500 loss | -1.0% |

The held-out result is Rs 4,500 lower than the in-sample result. That gap is the point to explain. A written explanation might say the idea did not hold on the later data, and list the reasons.

**Trial count.** You tried 8 settings and kept the best. The explanation must say so. The best of 8 can look better than it really is.

## Try it

### Guided exercise

**Task.** Using the hypothetical table above, state how many rupees lower the held-out result is than the in-sample result.

Hints:

1. The in-sample result is Rs 4,000.
2. The held-out result is minus Rs 500, which is a loss.
3. Subtract the held-out result from the in-sample result.

**Answer:** 4,000 - (-500) = 4,000 + 500 = **Rs 4,500**. The held-out result is Rs 4,500 lower.

### Independent exercise

**Task.** In your own words, list three reasons a backtest result may not hold live. Use no more than 60 words in total.

<details><summary>Check your answer</summary>

A good answer covers at least three of these points:

- **Fills.** The price you get live may differ from the price the test assumed.
- **Costs.** Live costs can differ from the costs in the test, or be missed.
- **Changing conditions.** Market behaviour in the future may differ from the past period.
- **Sample size.** A short test has few trades, so a result can be luck.
- **Liquidity.** Some prices may not trade in the size you planned.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the two periods, the trial count, the words the rubric rejects and the reasons a result may not hold live.

## Paper task

Mode: **learning note**. Write it in your journal. If the journal is not ready, use paper. If the backtester is not ready, do the task on paper or in a spreadsheet.

1. Pick one made-up strategy. You can use the example in *The fully specified swing strategy*.
2. Split the test period into an in-sample part and a held-out part. Write the dates or the stretch of data for each.
3. Write the trial count. Count every setting you tried, not only the one you kept.
4. Write three reasons the result may not hold live.
5. Write a five-line explanation of the result. Do not use the words "profitable" or "ready".

## Limits and common mistakes

- The gate checks your explanation. It does not show that the strategy works.
- One saved run uses one dataset. Other periods can give different results.
- Costs in a test are only as good as the cost figures used. Real costs can differ.
- Every setting you try adds a chance of a good-looking result by luck. Count them all.
- A passing explanation is not a validation. The gate says so on its own screen.

## Remember

- Report the in-sample and held-out periods separately.
- Keep costs on in every run.
- State the trial count, including every setting you tried.
- Give at least three reasons the result may not hold live.
- Passing this gate does not mean you should trade.

## Sources and verification

- The backtest acceptance notes for the backtester in this book.
- The strategy chapters and the testing chapters of this book, by their titles.

<!-- facts-needed: cost figures used by the backtester, with their check dates. -->

<!-- standing-disclaimer -->
