<!-- meta
id: T10.4
title: Gate G4 risk discipline
page_type: Assessment
prerequisites: [T2.11, T2.12, T8.2, T8.4, T8.6, T8.7]
labs: []
estimated_minutes: 25
-->

# Gate G4 risk discipline

## Hook

Imagine a simulated day with a daily loss limit of Rs 1,000. Hypothetical. After two losing trades, you are down Rs 1,000. A third setup looks tempting, and you want to win the money back. This gate asks one question: do you stop? It is not a test of market skill. It tests whether you follow a limit you wrote before the day began.

## The idea

The gate runs simulated days. Each simulated day is one scenario. The daily limit is hit at a random point in the day, so you cannot know when it will come.

> This measures educational competence. It is not proof of profitability. Nothing here requires or recommends trading with real money.

To pass, you must do both of these in every scenario:

1. **Stop when the limit is hit.** "Stopped" means you make no further entry in that day after the limit is reached.
2. **Do not increase your size after a loss.** In no scenario may you raise your size after a loss.

You must also answer two multiple-choice questions on the rule set. Both must be correct.

The pass mark is 10 of 10 scenarios. <!-- OPEN: PLAN.md says 10 of 10. The reading that each attempt draws ten fresh simulated days needs owner confirmation. -->

Each attempt draws ten new simulated days. The earlier attempt does not carry over. There is no timer and no penalty for retaking.

If you fail, the gate shows which day broke the rule and what you did on that day. Then you can retake it.

The simulator is not a test of market skill. It tests whether you follow a written limit.

Passing this gate does not mean you should trade. A pass only shows that you followed the rule in simulated days.

## See it

This gate has no picture to explore. Use this table to see what each outcome means.

| What you did after the limit was hit | Result for that day |
|---|---|
| Made no further entry | Stopped. Rule kept. |
| Made one more entry, even a small one | Not stopped. Rule broken. |
| Raised size after a loss | Size rule broken. |

One broken rule in one day fails the attempt.

## Worked example

**Hypothetical.** Ten simulated days. The daily limit is Rs 1,000 in each day.

| Day | Limit hit? | What you did | Result |
|---|---|---|---|
| 1 | Yes | Stopped | Kept |
| 2 | No | Traded normally | Kept |
| 3 | Yes | Stopped | Kept |
| 4 | Yes | Took one more trade | Broken |
| 5 to 10 | Mixed | Stopped each time the limit was hit | Kept |

Nine days kept the rule and one day broke it. That is 9 of 10, which is 90%. The gate needs 10 of 10, so this attempt fails. The result shows day 4 as the broken scenario.

## Try it

### Guided exercise

**Task.** Hypothetical. Your daily limit is Rs 1,500. You lose Rs 600 on trade 1 and Rs 900 on trade 2. Have you hit the limit? What should you do next?

Hints:

1. Add the two losses together.
2. Compare the total with the limit. Has it reached the limit?
3. Think about what the rule says to do once the limit is reached.

**Answer:** 600 + 900 = Rs 1,500. That equals the limit, so the limit is hit. You make no further entry for that day.

### Independent exercise

**Task.** Hypothetical. Your daily limit is Rs 1,000. Your losses are Rs 350, then Rs 400, then Rs 200, then Rs 100. After which trade is the limit hit? What should you do after that?

<details><summary>Check your answer</summary>

- After trade 1: Rs 350. Not hit.
- After trade 2: Rs 350 + Rs 400 = Rs 750. Not hit.
- After trade 3: Rs 750 + Rs 200 = Rs 950. Not hit.
- After trade 4: Rs 950 + Rs 100 = Rs 1,050. The limit of Rs 1,000 is hit.

The limit is hit after trade 4. You make no further entry for that day. All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the limit arithmetic, the meaning of "stopped" and the size rule.

## Paper task

Mode: **learning note**. Write it in your journal. If the journal is not ready, use paper. If the simulator is not ready, do the task on paper or in a spreadsheet.

1. Write a hypothetical daily loss limit on paper. Use a made-up figure.
2. Write three rules under it. Stop when the limit is hit. Make no entry after that. Do not raise size after a loss.
3. Make a table of ten made-up days. For each day, write the losses in order and the point where the limit is hit.
4. For each day, write whether you stopped. Mark any day where you did not.
5. Mark the whole page as hypothetical.

## Limits and common mistakes

- The simulator does not measure market skill. A pass does not show you can make money.
- Simulated days use random outcomes. Real days can move in ways the simulator does not show.
- A rule only helps if you write it down before the day starts. Writing it after a loss is too late.
- Ten of ten is a learning standard. It does not promise how you will act with real money.
- If a loss is making you want to win it back, read *Living through a losing streak* before you trade again.

## Remember

- Stop when the daily limit is hit. Make no further entry that day.
- Never raise your size after a loss.
- The pass mark is 10 of 10 simulated days.
- The gate tests a written limit, not market skill.
- Passing this gate does not mean you should trade.

## Sources and verification

- The book's rule for daily limits, in the risk chapters of this book.
- The simulator notes in the earlier risk chapters of this book.

<!-- facts-needed: none. The gate uses simulated days and the book's own rules. -->

<!-- standing-disclaimer -->
