<!-- meta
id: T10.6
title: Gate G6 paper and forward record
page_type: Assessment
prerequisites: [T8.5, T7.10, T10.4]
labs: [Lab 3, Lab 5]
estimated_minutes: 25
-->

# Gate G6 paper and forward record

## Hook

You log 30 paper trades over several weeks. Most follow your written plan. On one day you break your daily limit, and you log it anyway. This gate does not grade how good the trades were. It reads your journal and counts what it shows. Then it reports the counts and the percentages.

## The idea

This gate is a record, not a quiz. Nothing is drawn at random, and you cannot retake it in the usual way. It is a record that keeps going. You can keep logging trades at any time.

> This measures educational competence. It is not proof of profitability. Nothing here requires or recommends trading with real money.

The gate checks these points for the same period:

1. **Trade count.** At least 30 trades in mode forward or paper. Thirty is a small sample, so treat it as a minimum, not as proof.
2. **Plan adherence.** At least 90% of those trades followed your plan.
3. **No limit breaches.** The journal's limit-breach log shows no breach for the same period.

Only these rows count:

- Forward rows from the forward-test script (Lab 5), counted on their own.
- Manual paper rows, counted on their own.

Both counts are shown. Backtest rows and live rows are not counted.

Manual entries are self-reported. Forward-script rows can be reproduced. Keep that difference in mind when you read the counts.

You cannot delete entries to improve your count. A deleted trade stays in the record, marked as deleted. If you made a mistake, add a correction note. Do not erase the line.

The gate screen shows the current count and the thresholds in use.

A record of 30 trades does not show that a strategy works. Passing this gate does not mean you should trade.

If the forward-test script is not ready, keep your paper record in your journal or on paper, and do the task as written.

## See it

This gate has no picture to explore. Use this table to see how each row counts.

| Row type | Counts toward the gate? | Counted as |
|---|---|---|
| Forward-script row | Yes | Its own count |
| Manual paper row | Yes | Its own count |
| Backtest row | No | Not counted |
| Live row | No | Not counted |

<!-- component: gate-check | gate: G6 | caption: Tick each criterion only when it is true for you. A gate checks what you learned. It is not permission to trade. -->

## Worked example

**Hypothetical.** Your journal for one period has 30 trades. 18 are forward-script rows and 12 are manual paper rows. Five backtest rows exist too. They are not counted.

| Check | Your figure | Threshold | Result |
|---|---|---|---|
| Trade count | 30 | At least 30 | Met |
| Plan adherence | 27 of 30 = 90.0% | At least 90% | Met |
| Limit breaches | 0 | None | Met |

Now change one thing. If only 26 of the 30 trades followed the plan, adherence is 26 / 30 = 86.7%. That is below 90%, so the check is not met.

## Try it

### Guided exercise

**Task.** Hypothetical. You have 40 trades in one period. How many must follow the plan to reach 90%?

Hints:

1. Multiply 40 by 0.90.
2. Check your answer. Divide it by 40.
3. Test one fewer. Does it still reach 90%?

**Answer:** 40 x 0.90 = 36. Check: 36 / 40 = 90%. One fewer, 35 / 40 = 87.5%, is not enough.

### Independent exercise

**Task.** Hypothetical. You have 30 trades in one period. Two trades broke your plan. Your journal also shows one limit breach in the same period. What is the plan adherence, and does the gate pass for that period?

<details><summary>Check your answer</summary>

- Plan adherence: 28 of 30 followed the plan. 28 / 30 = 93.3%. This is at or above 90%, so this check is met.
- Limit breaches: one breach is recorded in the same period. The gate needs no breaches, so this check is not met.
- The gate does not pass for that period. The adherence figure does not make up for the breach.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the counts, the thresholds and the rules for keeping a record.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Log each paper trade on its own line. Use these columns: date, mode (paper or forward), followed the plan (yes or no), limit breach (yes or no), and a short note.
2. Keep backtest rows on a separate page. Do not mix them with paper rows.
3. At the end of the period, count the trades. Work out the percentage that followed the plan.
4. If you make a mistake, add a correction note on a new line. Do not erase the old line.
5. Use only paper trades here. Do not place any real order.

## Limits and common mistakes

- Paper and manual entries are self-reported. Your honesty decides how accurate they are.
- A record of 30 trades does not show that a strategy works.
- 90% adherence means one trade in ten may break the plan. Read each break and write what you learned.
- Thirty trades is a floor, not a verdict. The gate says so, and more record gives a clearer picture.
- A period of paper trades may be one kind of market. Your record does not show how the strategy did in other conditions.

## Remember

- The gate counts your record. It does not judge the trades for being good.
- At least 30 trades and at least 90% followed the plan, for the same period.
- No limit breaches are allowed in that period.
- Forward-script rows and manual paper rows are counted separately.
- Never delete an entry to improve the count.

## Sources and verification

- The journal rules and the limit-breach log, in the journal chapter of this book.
- The forward-test chapter of this book, by its title.

<!-- facts-needed: none. Holiday and market-timing facts used by the forward-test script are registered in the forward-testing chapter. -->

<!-- standing-disclaimer -->
