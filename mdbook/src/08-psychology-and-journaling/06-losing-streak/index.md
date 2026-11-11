<!-- meta
id: T8.6
title: Living through a losing streak
page_type: Lab
prerequisites: [T2.10, T7.9, T8.2]
labs: [Lab 3, Lab 4]
estimated_minutes: 30
-->

# Living through a losing streak

## Hook

You have lost four trades in a row. Each loss was the planned 1R, which is Rs 500. You start to feel sure the method is broken. Another part of you says a win must be due soon. Both feelings are normal. This chapter shows how often streaks happen, and what to write down before one starts. It also shows why a streak alone does not prove the method is broken.

## The idea

**Streaks happen at any win rate.** A lower win rate makes long losing runs more common. A higher win rate does not stop them completely.

**Gambler's fallacy** is the wrong belief that a run of losses makes a win "due". In the simple model used in this chapter, each trade has the same chance, whatever came before. So a losing run does not make the next trade more likely to win.

Real markets may not match that simple model. Treat the numbers here as a way to understand the odds, not as a forecast.

**Stages of a drawdown.** Write an action for each stage before a streak begins:

- Normal.
- Limit approached.
- Daily limit reached.
- Weekly limit reached.

The action for each stage is set in advance. You do not decide it in the middle of the streak.

**Size stays fixed in a drawdown.** Reducing exposure follows a written rule. The rule is covered in *When to stop trading altogether*. A feeling is not a rule.

## See it

<!-- component: streak-sim | winRate: 40 | risk: 1 | startCapital: 50000 | caption: Simulated trades at a 40% win rate, with a feelings tag for each trade. Run it three times and compare the streaks and the tags. -->

Watch the longest losing run in the summary. Then look at the feelings tags beside it. Ask which tags came before you changed a rule, and which came after.

## Worked example

**Hypothetical.** Win rate 40%. So the chance of a loss on one trade is 1 - 0.4 = 0.6. Risk 1R = Rs 500, which is 1% of Rs 50,000.

| Step | Calculation | Result |
|---|---|---|
| 1. Chance of a loss on one trade | 1 - 0.4 | 0.6 |
| 2. Six losses in a row, starting at one given trade | 0.6 x 0.6 x 0.6 x 0.6 x 0.6 x 0.6 = 0.6^6 | 0.0467, about 4.7% |
| 3. Rupee loss of six losses | 6 x Rs 500 | Rs 3,000 |
| 4. Share of capital | 3,000 / 50,000 | 6% |
| 5. Planned action at four losses in a row | written before the run begins | No change in size. Check the weekly limit. |

Six losses in a row can happen at a 40% win rate. From one given trade, the chance is about 4.7%. The plan action at four losses is written in advance, so you do not decide it while you feel the pressure.

## Try it

### Guided exercise

**Task.** At a 40% win rate, the chance of a loss on one trade is 0.6. Work out 0.6 to the power of 4. Then work out the rupee loss of four losses at 1R of Rs 500.

Hints:

1. Multiply 0.6 by itself four times.
2. Four losses cost 4 x Rs 500.

**Answer:**

- 0.6 x 0.6 x 0.6 x 0.6 = 0.36 x 0.36 = **0.1296**, about 13.0%.
- 4 x Rs 500 = **Rs 2,000**.

### Independent exercise

**Task.** Run the streak simulator three times, each with a fresh random run. Write what changed in the feelings log between the runs.

<details><summary>Check your answer</summary>

There is no single right answer. A useful log names:

- the longest losing run in each run,
- the feeling tag you wrote at the point the streak was longest,
- whether the feeling made you want to change size or trade more.

Example: "Run 1 had a long run early, and I tagged fear. Run 2 had a short run, and I tagged calm. Run 3 had two runs of three, and I tagged a wish to get back." Each run is a simulation, and none of them is proof of how the method performs.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the gambler's fallacy, streak probability, pre-set actions and the drawdown stages.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Run the streak simulator three times, using a 40% win rate.
2. For each run, note the longest losing run and the rupee loss at 1R.
3. For each run, log the feelings tags in your journal learning note.
4. Write the planned action for four losses in a row, before you read the results.
5. If the simulator is not ready, do the task on paper or in a spreadsheet, using the 0.6 chance of a loss.

## Limits and common mistakes

- A simulated streak uses a fixed win rate. Real trades may not match it, so simulated results are not proof of future results.
- The odds of a run tell you how common it is. They do not tell you when the next run will start or end.
- Feelings tags record how you felt. They do not measure whether the method works.
- A losing streak does not prove the method is broken. A winning streak does not prove it works either.
- The simple model assumes each trade is separate. Real markets may not behave that way.

## Remember

- Streaks happen at any win rate, and a lower win rate makes them more common.
- Gambler's fallacy: a run of losses does not make a win due.
- The chance of six losses in a row from one given trade, at 0.6, is about 4.7%.
- Write the action for each drawdown stage before a streak starts.
- Size stays fixed in a drawdown. Reducing exposure follows a written rule.

## Sources and verification

- The losing-streak experiment in Lab 4.
- Amos Tversky and Daniel Kahneman (1971), "Belief in the Law of Small Numbers", Psychological Bulletin, 76(2), 105-110. It is about the mistaken belief that short runs of chance events must even out.

<!-- standing-disclaimer -->
