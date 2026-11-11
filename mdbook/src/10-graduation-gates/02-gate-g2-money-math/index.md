<!-- meta
id: T10.2
title: Gate G2 money math
page_type: Assessment
prerequisites: [T2.1, T2.2, T2.3, T2.4, T2.5, T2.6, T2.7, T2.8, T2.9, T2.10, T2.11, T2.12, T2.13, T2.14, T2.15, T2.16, T2.17, T2.18, T7.8]
labs: [Lab 2]
estimated_minutes: 30
-->

# Gate G2 money math

## Hook

A quick sum says a trade will make Rs 100. You forget the costs. After the costs are taken out, the trade loses money. Small sums matter, and this gate checks that you can do them correctly. It covers costs, position sizes and expectancy. It also asks you to finish the reality check.

## The idea

This gate tests the money math from the second track of this book. It covers three kinds of sums: trading costs, position sizes and expectancy. *Expectancy* is the average result per trade, after you count wins and losses together.

> This measures educational competence. It is not proof of profitability. Nothing here requires or recommends trading with real money.

The gate has three parts:

1. **Numeric questions.** Every numeric question in a fresh set must be correct. One miss fails the attempt.
2. **Scenario and multiple-choice questions.** These check whether you can choose the right method.
3. **The reality check.** You must finish *The Rs 2,000-3,000 reality check* and tick its checklist.

The rules for each kind of answer are these:

- Position-size answers must match exactly, in whole shares.
- Rupee answers must be within Rs 1 of the worked solution.
- Cost answers are checked within the tolerance stored with each question.

The cost figures come from the book's facts list. Each figure shows the date it was checked. If a cost figure is out of date, the cost questions pause, and the gate says so.

Each retake uses a fresh set of numbers. A missed numeric question shows the worked solution before you retake. There is no timer.

The Rs 2,000-3,000 per day figure is not a target or a promise. Work through the reality check before you try this gate.

Passing this gate does not mean you should trade. It shows that you can do the sums.

## See it

This gate has no picture to explore. Use the table below to check your own sums before you start.

| Sum | What to check |
|---|---|
| Risk budget | Capital x risk % |
| Risk per share | Entry minus stop |
| Shares | The smallest of the three limits, each rounded down |
| Planned loss | Shares x risk per share |

If any line does not match your working, go back to the step that differs.

<!-- component: gate-check | gate: G2 | caption: Tick each criterion only when it is true for you. A gate checks what you learned. It is not permission to trade. -->

## Worked example

**Hypothetical. Example B from *Position sizing step by step*.** Capital Rs 10,000. Risk 1%. Entry Rs 250. Stop Rs 248.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 10,000 x 1% | Rs 100 |
| 2. Risk per share | 250 - 248 | Rs 2 |
| 3. Raw shares | floor(100 / 2) | 50 |
| 4. Cash cap | floor(10,000 / 250) | 40 |
| 5. Concentration cap | floor(2,500 / 250) | 10 |
| **Shares** | minimum of 50, 40 and 10 | **10** |
| **Planned loss** | 10 x 2 | **Rs 20** |

The binding limit is the concentration cap. The planned loss is Rs 20 before costs. The costs are covered in *Costs on a trade*. The arithmetic here does not add them.

## Try it

### Guided exercise

**Task.** Hypothetical. Capital Rs 20,000. Risk 1%. Entry Rs 100. Stop Rs 95. Find the shares, the binding limit and the planned loss.

Hints:

1. Work out the risk budget first. Then find the risk per share.
2. Find all three limits and round each one down.
3. The planned loss is the shares multiplied by the risk per share.

**Answer:**

- Risk budget: 20,000 x 1% = Rs 200.
- Risk per share: 100 - 95 = Rs 5.
- Raw shares: floor(200 / 5) = 40.
- Cash cap: floor(20,000 / 100) = 200.
- Concentration cap: floor(20,000 x 25% / 100) = floor(50) = 50.
- Shares: minimum of 40, 200 and 50 = **40**.
- Binding limit: **risk budget**.
- Planned loss: 40 x 5 = **Rs 200**.

### Independent exercise

**Task.** Hypothetical. Capital Rs 10,000. Risk 1%. Entry Rs 500. Stop Rs 490. Find the shares, the binding limit, the position value and the planned loss.

<details><summary>Check your answer</summary>

- Risk budget: 10,000 x 1% = Rs 100.
- Risk per share: 500 - 490 = Rs 10.
- Raw shares: floor(100 / 10) = 10.
- Cash cap: floor(10,000 / 500) = 20.
- Concentration cap: floor(10,000 x 25% / 500) = floor(2,500 / 500) = 5.
- Shares: minimum of 10, 20 and 5 = **5**.
- Binding limit: **concentration cap**.
- Position value: 5 x 500 = Rs 2,500, which is 25% of capital.
- Planned loss: 5 x 10 = **Rs 50**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the five steps of position sizing, the planned loss and how costs and facts are shown.

## Paper task

Mode: **learning note** or **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Write three hypothetical position-size sums. Each one needs capital, risk %, entry and stop.
2. For each sum, write the five steps on separate lines.
3. Record the shares, the binding limit and the planned loss.
4. Work each sum twice. Only keep the answer if both results match.
5. Mark every line as hypothetical.

## Limits and common mistakes

- The gate checks your sums. It does not check whether a trade idea is any good.
- The sums use made-up numbers. Real costs and rules differ, and they change over time.
- The gate reads your reality-check tick. It does not test whether you understood the figure behind it.
- Rounding up is a common mistake. Round every limit down, every time.
- A correct sum does not prove that a trade fits your real cash. Check your real cash before any real decision.

## Remember

- Shares are the smallest of the three limits, each rounded down.
- Planned loss is shares multiplied by risk per share.
- Costs are separate from the planned loss in this gate.
- Work every sum twice before you trust it.
- Passing this gate does not mean you should trade.

## Sources and verification

- The book's cost facts list, with the date each figure was checked.
- The earlier money math chapters in this book.

<!-- facts-needed: every cost figure used by the cost questions, with its check date. Values are not restated in the chapter. -->

<!-- standing-disclaimer -->
