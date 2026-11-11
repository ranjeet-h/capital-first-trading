<!-- meta
id: T8.5
title: The journal as a tool
page_type: Lab
prerequisites: [T8.4, T7.8]
labs: [Lab 3]
estimated_minutes: 30
-->

# The journal as a tool

## Hook

Three weeks ago you took a trade. Today you cannot remember your planned stop. You also cannot remember whether you moved it. Memory tends to keep the reasons that make you look sensible. It often drops the rest. A journal keeps the record as it was, so you can judge your behaviour fairly. This chapter shows how to set up that record, and how to read it.

## The idea

A journal records two sets of fields for each trade.

- **Planned fields** are written before you enter. They include the planned entry, the stop, the target and the planned shares.
- **Executed fields** are written after the trade. They include the fill price, the time and the exit.

The gap between the two sets is what you study. Comparing them shows what changed, and why.

**Locked fields.** The planned fields lock at entry. You can add notes later, but you cannot rewrite the plan. This stops a plan from being changed to fit the result.

**Modes.** Each trade belongs to one mode: paper, forward, backtest, live or kite_demo. Keep the modes separate. Do not mix practice results with live results by default.

Three numbers come from the comparison:

- **Slippage in rupees** = (fill price - plan price) x shares, for a long entry. It is the extra rupees you paid above the plan price.
- **Plan adherence %** = trades where the plan was followed / total trades x 100.
- **Rule breaks** are tagged by category. Your weekly review looks at the most frequent category.

Two rules keep the record honest:

- Journal entries before the gates are never marked live.
- The journal records what you did. It is not a tool to make losses look smaller.

## See it

<!-- component: lab-journal | mode: paper | weekly: yes | form: plan-and-execution | caption: Plan form, execution form and weekly review form for one hypothetical practice trade. The planned fields lock at entry. -->

Fill the plan form first. Then fill the execution form after the trade. Compare the two. The weekly review asks you to name one change.

## Worked example

**Hypothetical.** Plan entry Rs 250. Fill price Rs 251. Shares 40.

| Step | Calculation | Result |
|---|---|---|
| 1. Price difference | 251 - 250 | Rs 1 |
| 2. Slippage | 1 x 40 | Rs 40 |

**Hypothetical.** Ten trades in the week. Nine followed the plan.

| Step | Calculation | Result |
|---|---|---|
| 3. Plan adherence | 9 / 10 x 100 | 90% |

One trade broke two rules. One break was a late exit, tagged as exit late. The other was oversize, tagged as size. The weekly review looks at the tags and names one change: fix the exit timing check.

## Try it

### Guided exercise

**Task.** Plan entry Rs 250. Fill price Rs 252.50. Shares 40. Work out the slippage in rupees.

Hints:

1. Find the difference first, then multiply by the shares.
2. The difference is Rs 2.50.

**Answer:** Slippage = (252.50 - 250) x 40 = 2.50 x 40 = **Rs 100**.

### Independent exercise

**Task.** Complete a weekly review for three learning-note trades. Write what went well, one rule break, and one change.

<details><summary>Check your answer</summary>

There is no single right review. A useful review:

- names one thing that followed the plan, for example "I wrote the plan before entry",
- names one rule break, using a tag,
- names one change that is small enough to test next week.

Example: "Went well: the plan was written before entry. Rule break: exit later than the plan. Change: add an exit-time check before entry."

All trades in this exercise are learning-note trades. None are live.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks slippage, adherence, locked fields, mode separation and the order of journal entries.

## Paper task

Mode: **paper for practice entries, never live**. Log it in your journal (or on paper until the journal app is ready).

1. Log three learning-note entries. For each, write the planned fields first: entry, stop, target and shares.
2. After each trade, write the executed fields: fill price, time and exit.
3. For each entry, work out the slippage in rupees and the plan adherence for the set.
4. Write one line for a weekly review. Name one change.
5. Mark every entry as paper. If the lab is not ready, do this in a spreadsheet.

## Limits and common mistakes

- The journal shows what you did. It cannot explain why a trade won or lost.
- Slippage from one fill is one number. It does not show your average trade quality.
- Plan adherence counts followed rules, not profits. A trade can follow the plan and still lose.
- A journal is useful only when you fill it in on time. Notes written from memory are less accurate.
- Journal entries are for judging behaviour. They are not a way to make losses look smaller.

## Remember

- Planned fields are written before entry. Executed fields are written after.
- Planned fields lock at entry.
- Slippage (Rs) = (fill price - plan price) x shares, for a long entry.
- Plan adherence % = trades where the plan was followed / total trades x 100.
- Keep paper, forward, backtest, live and kite_demo entries separate.

## Sources and verification

- Lab 3, the record definition and features of the journal.

<!-- standing-disclaimer -->
