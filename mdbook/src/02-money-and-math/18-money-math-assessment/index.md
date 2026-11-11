<!-- meta
id: T2.18
title: Money-math assessment
page_type: Assessment
prerequisites: [T2.1, T2.2, T2.3, T2.4, T2.5, T2.6, T2.7, T2.8, T2.9, T2.10, T2.11, T2.12, T2.13, T2.14, T2.15, T2.16, T2.17]
labs: [Lab 1, Lab 2, Lab 3]
estimated_minutes: 35
-->

# Money-math assessment

## Hook

A hypothetical trader has Rs 50,000, risks 1% per trade and plans to enter at Rs 400 with a stop at Rs 380. She divides her capital by the entry price and buys 125 shares. Her planned loss at the stop is 125 x 20 = Rs 2,500. That is 5% of her capital, five times the Rs 500 she set as the limit. This assessment checks whether the number of shares follows from the risk rule, not from the cash in the account.

<!-- OPEN: spec open question 9 asks for the numeric tolerance for percentages (for example 0.05 percentage points) and the size of the randomised set. Both are owner decisions; this chapter does not fix them -->
<!-- OPEN: the spec does not say who writes the ten-question mini-set. The paper task allows either the app's set or questions the reader writes -->

## The idea

This assessment covers the money math in this part of the book. It is the check for gate G2. To pass, you must get the cost, position-size and expectancy questions right within the allowed margin, on a fresh set of questions. You must also complete the reality-check chapter (*The Rs 2,000-3,000 reality check*).

**What it checks**

- **Costs:** fixed charges (per order) versus proportional charges (a percentage of turnover). Fixed charges weigh more on small trades (*Costs on a trade*). Cost figures come from the checked facts file. [VERIFY: cost facts from the facts registry, cross-reference *Costs on a trade*]
- **Position size:** the lowest of three limits, not the largest one.
- **Break-even win rate:** the win rate at which wins pay for losses, before costs.
- **Expectancy and profit factor:** the average result per trade, and the ratio of gains to losses.
- **Drawdown recovery:** the gain needed to return to a starting value after a loss.
- **Daily-target capital:** the capital a daily target needs (*The Rs 2,000-3,000 reality check*).

**Position size.** Work out three limits, then take the lowest:

- Risk budget = capital x risk percentage.
- Risk per share = entry - stop.
- Raw shares = risk budget / risk per share, rounded down.
- Cash cap = floor(capital / entry).
- Concentration cap = floor(capital x maximum position percentage / entry). The Lab 1 starting value is 25%.
- Shares = the lowest of raw shares, cash cap and concentration cap.

**Break-even win rate.** Before costs, with a reward of R times the risk (R is the reward-to-risk ratio), break-even win rate = 1 / (1 + R). Equivalently, win rate x R = (1 - win rate) x 1.

**Expectancy.** Per trade, in R: (win rate x average win in R) - (loss rate x average loss in R). In rupees, multiply the R result by the rupee value of one R. Expectancy describes an average over many trades. It is not a forecast of the next trade.

**Profit factor.** Total gross wins divided by total gross losses. A value above 1 means the wins outweighed the losses in the record. It says nothing about how many trades the figure is based on.

**Drawdown recovery.** A loss of L (as a fraction of the value before it) needs a gain of L / (1 - L) on the smaller base. A 30% loss needs 0.3 / 0.7 = 42.9%, not 30%.

**Question types.** Number answers (with a small allowed margin), multiple choice, scenario, spot-the-mistake and order of steps.

**Fresh sets.** The gate uses a new set of questions each time, made by a computer with checks. For example, a long's stop must be below its entry, capital stays in a sensible range, and quantities are whole shares. Each number answer is worked out by a tested calculation. The sample set in this chapter is fixed.

**Margin for percentages.** Rupee answers must be exact to the paisa (one hundredth of a rupee). Percentages are accepted within a small margin.

**Cost questions and out-of-date facts.** Cost questions depend on the checked facts file. If a cost fact is out of date, the assessment shows a warning and does not count those questions.

**Retakes.** You may retake the assessment at any time. Each retake gets a new set of questions. There is no timer, and your attempt history is kept.

**Common wrong answers to watch for**

- Sizing with capital instead of risk per share.
- Ignoring the lowest of the caps.
- Forgetting the loss on a fixed charge.
- Treating expectancy as what the next trade will do.

## See it

<!-- component: gate-check | gate: G2 | caption: G2 pass screen; shows that educational competence is not proof of profitability -->

The gate screen says: educational competence is not proof of profitability, and there is no pressure to go live. Read that screen before you read your score.

## Worked example

Three questions, each worked in full. **Hypothetical** throughout.

### Question 1: position size with both caps

Capital Rs 50,000. Risk 1%. Entry Rs 400. Stop Rs 380.

| Step | Working | Result |
|---|---|---|
| Risk budget | 50,000 x 1% | Rs 500 |
| Risk per share | 400 - 380 | Rs 20 |
| Raw shares | 500 / 20, rounded down | 25 |
| Cash cap | floor(50,000 / 400) | 125 |
| Concentration cap (25% of capital) | floor(50,000 x 0.25 / 400) = floor(31.25) | 31 |
| Shares | lowest of 25, 125 and 31 | **25** (the risk budget sets the size) |

Check: 25 x 20 = Rs 500, which is the risk budget. And 25 x 400 = Rs 10,000, which is within the Rs 12,500 concentration limit.

### Question 2: expectancy

Hypothetical record: win rate 40%, average win 2R, average loss 1R, and R = Rs 1,000.

| Step | Working | Result |
|---|---|---|
| Win part | 0.40 x 2R | 0.80R |
| Loss part | 0.60 x 1R | 0.60R |
| Expectancy | 0.80R - 0.60R | 0.20R |
| In rupees | 0.20 x Rs 1,000 | Rs 200 per trade |

Check: in 10 hypothetical trades, 4 wins of Rs 2,000 give Rs 8,000, and 6 losses of Rs 1,000 give Rs 6,000. The net is Rs 2,000, and Rs 2,000 / 10 = Rs 200 a trade. This describes that record only. It is not a forecast.

Profit factor on the same record: 0.80R / 0.60R = 1.3.

### Question 3: daily-target capital

Target Rs 2,000 a day, 250 trading days (an assumption [VERIFY: trading days per year]), 20% a year.

- Yearly target: 2,000 x 250 = Rs 5,00,000.
- Capital: 5,00,000 / 0.20 = Rs 25,00,000.

Check: 25,00,000 x 0.20 = 5,00,000.

## Try it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 400 | stop: 380 | caption: Shares against stop distance at Rs 50,000 and 1% risk; check which limit binds -->

Move the stop to Rs 390 and then to Rs 370. At Rs 390 the risk budget allows 50 shares, but the concentration cap of 31 is lower, so 31 is the size. At Rs 370 the risk budget allows 16 shares, which is the lowest, so 16 is the size. Note that the cash and concentration caps depend on entry price and capital, not on the stop.

### Guided exercise

**Task:** Answer three sample questions.

1. Capital Rs 50,000, risk 1%, entry Rs 400, stop Rs 380. How many whole shares, applying both caps?
2. What win rate breaks even before costs when the reward is R = 3 (win 3R, lose 1R)? Give a percentage.
3. An account falls 30%. What gain, in percent, brings it back to its starting value?

Hints:

1. For question 1, work out the risk budget and the risk per share, then the raw shares. Compare the raw shares with both caps and take the lowest.
2. For question 2, use W = 1 / (1 + R). Check: 25 wins of 3R and 75 losses of 1R give 75R won and 75R lost.
3. For question 3, the gain is loss / (1 - loss), applied to the smaller account. Do not use 30% of the starting value.

**Answer:** Question 1: 25 shares (risk budget Rs 500, risk per share Rs 20, raw 25; caps 125 and 31). Question 2: 25%. Question 3: 42.9%.

### Independent exercise

**Task:** Answer a ten-question set on paper with no hints. Then enter your answers in the app. Record your score and the concepts you missed in the learning log.

<details><summary>Check your answer</summary>

There is no single answer key for a set you write or draw yourself. Check each result against these tests:

- A share count is never above the lowest of the three limits.
- A break-even win rate satisfies W x R = (1 - W) x 1 for a 1R loss.
- Expectancy in R equals (win rate x average win) minus (loss rate x average loss).
- A drawdown recovery uses loss / (1 - loss), applied to the smaller base.

Missed questions are scheduled for review after the reviewAfterDays value.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Eight sample questions cover the areas above. The gate uses a fresh set of questions, not this one.

## Paper task

**Mode:** learning note. Write it in your journal. If the journal app is not ready, use paper.

1. Use ten questions covering the areas above. Use the app's set once it is ready, or write ten yourself.
2. Answer all ten on paper, with no notes and no hints.
3. Check each answer against the working in this chapter.
4. Enter your answers in the app once it is ready.
5. Record your score and the missed concepts in the learning log, with the date.

## Limits and common mistakes

- Passing G2 unlocks no live trading. The gate screen says so.
- Number success does not show that a strategy works. The expectancy in this chapter is a worked example, not a forecast.
- Cost answers are only as good as the checked cost facts. If a fact is out of date, those questions are not counted.
- A pass on a small set is a small sample. The gate's set of questions is also a sample.
- Money-math skill does not replace the risk rules. They apply before every trade.

## Remember

- Position size is the lowest of the risk, cash and concentration limits.
- Break-even win rate = 1 / (1 + R), before costs.
- Expectancy = (win rate x average win) - (loss rate x average loss), in R.
- Recovering from a 30% loss needs a 42.9% gain, not 30%.
- Educational competence is not proof of profitability.

## Sources and verification

**Sources (names only):**


**To verify:**

- Cost facts used by cost questions. [VERIFY: cost facts from the facts registry, cross-reference *Costs on a trade*]
- Trading days per year used in the daily-target question. [VERIFY: trading days per year from the NSE holiday list and calendar]

<!-- facts-needed: cost facts for cost questions (cross *Costs on a trade*); trading days per year (NSE calendar) -->
<!-- OPEN: required coverage includes profit factor. The eight sample questions do not include a profit-factor item; it is worked above. Add one when the set size is decided -->

<!-- standing-disclaimer -->
