<!-- meta
id: T8.4
title: Discipline
page_type: Concept
prerequisites: [T8.1, T2.15, T6.7]
labs: [Lab 1, Lab 3]
estimated_minutes: 30
-->

# Discipline

## Hook

On Monday you see a setup that looks strong, so you take it. You did not write an entry price, a stop or a target first. The trade loses, and you cannot say why you took it. A written plan would have asked three simple questions before you clicked. Each question would have had a clear answer. This chapter shows how to write a plan and a checklist that give you those answers.

## The idea

A **trading plan** is written before the market opens and before you consider any trade. It says which setups you accept, how much you risk, and when you do not trade.

A **checklist** is a list of items you check before you enter. Each item must be a yes or no question, with evidence. "Looks strong" is not an item. It is a feeling, and a feeling cannot be checked.

- Good item: "Is the entry price written in my plan? Yes or no."
- Poor item: "Does the setup look strong?"

**No-trade rules** are part of the plan too. They say when the method does not run. They may name a time of day, a kind of market day, or a condition you can check in advance. A "no trade" result is a valid result of the plan.

**Reward-to-risk** compares what you aim to gain with what you risk. It is written as R:

- R = reward / risk.
- **Break-even win rate** = 1 / (1 + R). This is the share of trades you must win, before costs, for the trades to pay back their losses.

Your plan can set a minimum R. A setup below that minimum is rejected. A rejected setup is a plan result, not a judgement about the share or the market.

The journal tool in this book reports rule conflicts in a neutral way. It names the rule and the conflict. It does not say a trade is good or bad.

## See it

<!-- component: exercise-block | caption: A pre-trade checklist. Mark each item yes or no, with the evidence you used. Then check the reject rule. -->

Mark each item yes or no. An item with no evidence is not a yes. Look at which items would stop the trade.

## Worked example

**Hypothetical.** Entry Rs 250. Stop Rs 240. Risk per share Rs 10.

| Step | Calculation | Result |
|---|---|---|
| 1. Target A | Rs 270 | Reward Rs 20 |
| 2. R for target A | 20 / 10 | R = 2 |
| 3. Break-even for target A | 1 / (1 + 2) | 33.3% |
| 4. Target B | Rs 260 | Reward Rs 10 |
| 5. R for target B | 10 / 10 | R = 1 |
| 6. Plan minimum | given | R of 1.5 |
| 7. Result for target B | 1 is below 1.5 | Rejected |

Target A gives R = 2, so the break-even win rate before costs is 33.3%. Target B gives R = 1, which is below the plan's minimum of 1.5. The setup is rejected. The reject is the plan working, not a judgement of the market.

## Try it

### Guided exercise

**Task.** Use the same entry Rs 250 and stop Rs 240. The target is Rs 275. Work out the reward, the R, and the break-even win rate. Then say whether the setup passes the plan minimum of 1.5.

Hints:

1. Reward = 275 - 250.
2. Break-even = 1 / (1 + R).

**Answer:**

- Reward: 275 - 250 = Rs 25.
- R: 25 / 10 = **2.5**.
- Break-even win rate before costs: 1 / (1 + 2.5) = 1 / 3.5 = **28.6%**.
- R of 2.5 is above the plan minimum of 1.5, so the setup **passes** that rule. It still needs its other checklist items.

### Independent exercise

**Task.** Write a six-item pre-trade checklist. Each item must be a yes or no question. Then write a short no-trade list of three conditions.

<details><summary>Check your answer</summary>

There is no single right list. Check that each item:

- can be answered yes or no,
- names the evidence you would look at,
- can be checked before you enter.

Example items:

- "Is the entry price written in my plan? Yes or no."
- "Is the stop price written in my plan before entry? Yes or no."
- "Is R at least the plan minimum? Yes or no."

Example no-trade conditions are the times or market states when your method does not run. Each one should be a condition you can check, not a feeling.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks checklist items, the R and break-even arithmetic, and no-trade rules.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Write plan version 1 in your journal learning note. Put the date at the top.
2. Include the setups you accept, the maximum risk you accept, and your reject rule for R.
3. Write six checklist items. Each one is a yes or no question.
4. Write a short no-trade list of three conditions.
5. Later changes go in a new version, with a new date. Do not edit version 1.
6. If the journal is not ready, do the task on paper.

## Limits and common mistakes

- A plan does not guarantee results. It limits the damage from poor decisions.
- A checklist makes you look at evidence before you enter. It cannot make a weak idea win.
- R uses your planned stop and target. If the price jumps past your stop, the loss can be bigger than the plan. See *Slippage*.
- Break-even is shown before costs. Costs can raise the win rate you need. See *Costs on a trade*.
- A no-trade day is not a failure. It is the plan working as written.

## Remember

- A plan is written before the market opens.
- Each checklist item must be a yes or no question with evidence.
- "Looks strong" is not a checklist item.
- R = reward / risk. Break-even win rate = 1 / (1 + R).
- A setup below the plan minimum is rejected. That is a plan result.

## Sources and verification

- Lab 1 outputs and the reject panel, for the R and reject rules.
- The fields of the trading plan used for gate G7, for the plan layout.

<!-- standing-disclaimer -->
