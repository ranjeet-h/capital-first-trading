<!-- meta
id: T7.11
title: Strategy validation assessment
page_type: Assessment
prerequisites: [T7.1, T7.2, T7.3, T7.4, T7.5, T7.6, T7.7, T7.8, T7.9, T7.10]
labs: [Lab 4, Lab 2, Lab 3]
estimated_minutes: 35
-->

# Strategy validation assessment

## Hook

Two people read the same backtest. This is a hypothetical example. One writes: "The strategy is profitable and ready." The other writes: "In-sample looks positive. Out-of-sample rests on 18 trades, so the result is inconclusive." Only one of these matches the evidence. This assessment checks whether you can write a verdict that the evidence supports. Writing the verdict is the skill being tested.

## The idea

A validation write-up ends in one of three verdicts:

- **Inconclusive.** The sample is too small, or the results disagree. No decision follows from it.
- **Not validated.** The result fails the written criteria.
- **Validated for further forward testing.** The result passes the written criteria. This means the rule is worth testing forward. It does not mean the rule is profitable. It does not mean the rule is ready for real money.

Before you write a verdict, check the seven items below. For each item, write the file or screen where the evidence is stored. If you cannot show the evidence, mark the item as **not done**. Do not mark it as passed.

1. Costs are on in the run.
2. The held-out period was used once.
3. The look-ahead demo was run.
4. The survivorship demo was run.
5. The number of trials you tried is recorded.
6. The Monte Carlo run is done.
7. The sample size is stated.

A result can still fail live, even after it passes this check. Five reasons:

- **Fills.** Real fills can be worse than the test assumed (*Paper trading and forward testing*).
- **Costs.** Real costs may differ from the costs in the run.
- **Regime change.** A regime is a period with its own kind of market behaviour. The market may change, and a rule may stop working.
- **Small sample.** A short test has a wide range of possible results.
- **Liquidity.** A stock may trade less easily later, which changes the fills.

Writing a verdict is the skill. The verdict must follow from the checklist and the criteria. It cannot follow from a wish for a good result.

## See it

This assessment has no new visual. Use the quiz and the checklist below as your tools. The checklist is the structure to fill in.

| # | Checklist item | Evidence (file or screen) | Status |
|---|---|---|---|
| 1 | Costs on in the run | | |
| 2 | Held-out period used once | | |
| 3 | Look-ahead demo run | | |
| 4 | Survivorship demo run | | |
| 5 | Trial count recorded | | |
| 6 | Monte Carlo run | | |
| 7 | Sample size stated | | |

## Worked example

**Hypothetical.** A Lab 4 output on Rs 50,000 of capital shows:

- In-sample expectancy: +0.40R.
- Out-of-sample expectancy after costs: +0.05R.
- Out-of-sample trades: 18.

**Verdict: inconclusive.**

Reasons:

1. 18 trades is below the lab's 30-trade confidence threshold.
2. The out-of-sample edge is small, +0.05R. It moves a lot when costs change.

The write-up must state both reasons. A verdict without reasons is not a verdict.

## Try it

### Guided exercise

**Task.** Complete the seven-item checklist for the worked example above.

Hints:

1. For each item, write the file or screen where the evidence would be stored.
2. If you cannot show the evidence, mark the item as not done, not as passed.

**Answer:**

1. Costs on: **done**. The out-of-sample figure is stated after costs, so the run had costs on.
2. Held-out period used once: **not done**. The example does not show that the period was used once.
3. Look-ahead demo run: **not done**. No evidence is given.
4. Survivorship demo run: **not done**. No evidence is given.
5. Trial count recorded: **not done**. No count is given.
6. Monte Carlo run: **not done**. No evidence is given.
7. Sample size stated: **done**. 18 out-of-sample trades.

Two of the seven items have evidence. The other five are not done yet. Those five stop a write-up from calling the result validated.

### Independent exercise

**Task.** Write a two-paragraph validation memo for a second hypothetical result. In this result, the in-sample expectancy is positive and the out-of-sample expectancy is negative.

<details><summary>Check your answer</summary>

**Paragraph 1.** Hypothetical result on Rs 50,000 of capital. The in-sample expectancy was +0.30R. The out-of-sample expectancy after costs was -0.10R, across 35 trades. The sample is above the 30-trade threshold, so the result can be read. The out-of-sample result fails the written criteria. Verdict: not validated. A positive in-sample result cannot override a failed out-of-sample test.

**Paragraph 2.** Checklist: costs are on, and the sample size is stated. The held-out period is used once only if the journal records it. The look-ahead demo, the survivorship demo, the trial count and the Monte Carlo run are not yet done. Next step: record this as a failed test. Do not change the rule to chase the held-out result. Any new idea needs a new held-out period. Nothing here supports using real money.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the three verdicts, the held-out period, costs, and how to spot an overclaimed conclusion.

## Paper task

Mode: **backtest**, which means the trades come from past data.

1. Write the seven-item checklist in your journal learning note. Use Lab 4 for the evidence if it is ready. If it is not, use paper.
2. For each item, write where the evidence is stored. Mark an item as not done where you have no evidence.
3. Write one verdict from the three categories. Give one sentence of reason.
4. Attach the Lab 4 run settings record. If the lab does not produce one yet, write that it is missing.

## Limits and common mistakes

- A verdict is only as good as its evidence. An item with no evidence is not done.
- Passing the criteria does not make a strategy profitable. It means the rule is worth more testing.
- A result from one market period may not hold in another.
- Costs and fills in the run may not match real costs and fills.
- A write-up that says "validated" can be read as permission to trade. It is not permission.

## Remember

- Three verdicts: inconclusive, not validated, and validated for further forward testing.
- Validated for further testing means ready for more testing. It does not mean ready for real money.
- Costs must be on in the run before any verdict is written.
- A held-out period used after a change is no longer held out.
- Mark every checklist item without evidence as not done.

## Sources and verification

- Pardo, *The Evaluation and Optimization of Trading Strategies* (edition: [VERIFY: edition]).
- Bailey and colleagues, on backtest overfitting ([VERIFY: title and year]).
- The backtest lab's acceptance criteria.

<!-- facts-needed: edition of Pardo, The Evaluation and Optimization of Trading Strategies; title and year of the Bailey and colleagues paper on backtest overfitting. -->

<!-- OPEN: The brief says the verdict "inconclusive" covers results that disagree. The independent exercise uses "not validated" for a positive in-sample and negative out-of-sample result, because the out-of-sample result fails the stated criteria. Confirm which verdict the criteria give in this case. -->

<!-- standing-disclaimer -->
