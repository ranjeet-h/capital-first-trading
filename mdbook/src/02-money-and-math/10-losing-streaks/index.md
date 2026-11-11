<!-- meta
id: T2.10
title: Consecutive losses and losing streaks
page_type: Math/Calculator
prerequisites: [T2.9, T2.8]
labs: [Lab 3]
estimated_minutes: 30
-->

# Consecutive losses and losing streaks

## Hook

Your plan has won six of its last ten trades. On trade eleven you have lost five in a row, and your gut says a win is due. This chapter shows the arithmetic behind streaks, and why "due" is the wrong word for it.

## The idea

Start with one trade. Let p be the win rate. The chance of a loss on one trade is 1 - p.

**Streak probability.** If each trade is independent of the others, the chance of k losses in a row starting at a given trade is (1 - p) raised to the power k. In words: multiply the loss chance by itself k times.

**Independence is an assumption.** The formula assumes each trade's result does not depend on the previous one. Real markets may cluster, with losses coming together. Lab 4 (a Monte Carlo of trade order) and *Monte Carlo of trade order* test this assumption. Do not treat the formula as settled for a real plan.

**Across many trades, streaks appear.** The chance of a streak starting at one particular trade is small. The chance that a streak of that length appears somewhere in a long sequence is much larger, because there are many starting points.

**Fixed risk and shrinking losses.** If each trade risks a fixed percentage of current capital, each loss is a smaller rupee amount as capital falls. Capital after k losses is capital x (1 - risk)^k, so the total lost is capital minus that figure.

**Streak rules are your choice.** Examples: pause after N losses, reduce risk after N losses, or review the plan. Write the rule before a streak starts. The rule that matters most is that you never increase size after losses. Doubling after losses, to recover faster, is a martingale-style method. It is dangerous and is covered in *Why scalping, option buying and martingale are dangerous*.

Why streaks feel abnormal: a low win rate or a long run of losses is common in the arithmetic, but it feels like a broken system. A streak alone is not evidence that a system has stopped working.

## See it

<!-- component: streak-sim | winRate: 60 | risk: 1 | startCapital: 50000 | caption: Simulated trades at a 60% win rate. Read the longest losing streak in the text summary. -->

<!-- component: streak-sim | winRate: 40 | risk: 1 | startCapital: 50000 | caption: Simulated trades at a 40% win rate. Compare the streak lengths with the 60% grid. -->

Look at the longest losing streak in each grid, and at how often streaks of 3 or more appear. Then compare the 40% grid with the 60% grid. Change the risk setting and see how the rupee loss per streak changes, while the streak lengths stay the same.

## Worked example

*Hypothetical.*

**Win rate 60%.** Loss chance = 0.4.

| Losses in a row | Working | Probability, starting at a given trade |
|---|---|---|
| 3 | 0.4 x 0.4 x 0.4 | 0.064, about 6.4% |
| 5 | 0.4 x 0.4 x 0.4 x 0.4 x 0.4 | 0.01024, about 1.0% |

**Win rate 40%.** Loss chance = 0.6. For 5 losses: 0.6^5 = 0.07776, about 7.8%.

**Capital lost at 1% risk on Rs 50,000.** Each loss is 1% of the capital at that time.

| Losses in a row | Capital left (approx.) | Lost (approx.) |
|---|---|---|
| 5 | 50,000 x 0.99^5 = Rs 47,550 | Rs 2,450 |
| 10 | 50,000 x 0.99^10 = Rs 45,219 | Rs 4,781 |
| 15 | 50,000 x 0.99^15 = Rs 43,003 | Rs 6,997 |

**Capital lost at 2% risk on Rs 50,000.**

| Losses in a row | Capital left (approx.) | Lost (approx.) |
|---|---|---|
| 5 | 50,000 x 0.98^5 = Rs 45,196 | Rs 4,804 |
| 10 | 50,000 x 0.98^10 = Rs 40,854 | Rs 9,146 |
| 15 | 50,000 x 0.98^15 = Rs 36,928 | Rs 13,072 |

**Rs 10,000 at 1% risk.** Five losses cost about Rs 490; ten cost about Rs 956; fifteen cost about Rs 1,399.

Hand check for the first row: a 1% loss on Rs 50,000 is Rs 500. The next loss is 1% of Rs 49,500, which is Rs 495. Each later loss is a little smaller, so five losses total slightly less than Rs 2,500.

## Try it

<!-- component: streak-sim | winRate: 45 | risk: 1 | startCapital: 50000 | caption: Demo for the guided exercise: find the chance of three losses in a row at a 45% win rate. -->

### Guided exercise

Task: Win rate 45% (hypothetical). What is the probability of three losses in a row, starting at a given trade?

Hints:

1. Loss chance = 1 - 0.45.
2. Raise the loss chance to the power 3.
3. Convert the result to a percentage.

**Answer:** Loss chance = 0.55. 0.55^3 = 0.166375, about 16.6%.

### Independent exercise

Task: Capital is Rs 50,000. Risk is 1% per trade, and each loss is 1% of the capital at that time. You take seven losses in a row. What capital remains, and how much is lost in total?

<details><summary>Check your answer</summary>

Capital remaining = 50,000 x 0.99^7 = 50,000 x 0.932065 = about Rs 46,603. Total lost = 50,000 - 46,603 = about Rs 3,397.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover streak probability, the "due" misconception, the streak rule, the reading of a streak and a loss-amount calculation.

## Paper task

Mode: **learning note**. Log it in Lab 3 (or on paper until the journal app is ready).

1. Before you start, write your streak rule in one line, for example a pause after N losses. Do not change it during the streak.
2. Record a hypothetical streak of seven losses at 1% risk on Rs 50,000. Use the emotion_before field, and the capital_at_plan field for the capital at each step.
3. Work out the capital after each of the seven losses. The seventh should be about Rs 46,603.
4. Write one sentence on what the rule says to do after the streak ends, and note whether you would have kept to it.

<!-- OPEN: The learning-note mode is in the *How to use this book* journal mode list but not in the Lab 3 mode list (paper, live, forward, backtest, kite_demo). Confirm before the journal app is built. -->

## Limits and common mistakes

- The formula assumes each trade is independent. If results cluster in a real plan, the chance of a streak is higher than the formula gives.
- The figures describe a starting point. They do not predict when the next streak will start.
- A streak is not, on its own, evidence that a system is broken. Equally, a streak is not evidence that it still works.
- The Monte Carlo test in Lab 4 comes later, and *Monte Carlo of trade order* covers the independence test.
- Doubling size after losses is not a recovery method in this book. It breaks the capital-first rules.

## Remember

- Probability of k losses in a row, from a given trade = (1 - p)^k, if trades are independent.
- A losing streak is expected at some frequency; it does not mean the next trade is more likely to win.
- At a fixed percentage risk, each loss is a smaller rupee amount as capital falls.
- Write your streak rule before the streak starts.
- Never increase size after losses.

## Sources and verification

Sources (names only):

- The book's Lab 4 specification (trade-order Monte Carlo, later)
- The book's Lab 3 specification (streak statistics)
- Chapter *Monte Carlo of trade order* (independence and resampling tests)
- Chapter *Living through a losing streak (streak-sim with feelings log)* (living through streaks)

Items to verify: none for this chapter. All numbers are hypothetical.

<!-- standing-disclaimer -->
