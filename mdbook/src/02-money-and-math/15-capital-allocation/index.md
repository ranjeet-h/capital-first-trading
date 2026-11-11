---
id: T2.15
title: Capital allocation, cut and stop rules
page_type: Math/Calculator
prerequisites: [T0.2, T2.11, T2.14]
labs: [Lab 3]
estimated_minutes: 30
---

# Capital allocation: how much to allocate, what stays untouched, when to cut or stop

## Hook

Hypothetical: savings are Rs 4,00,000, and the trader had set Rs 50,000 as the trading money. After a good month, the trader moves Rs 2,00,000 into trading. A 40% fall on Rs 2,00,000 is Rs 80,000. That loss now reaches money that was meant for the household rent. The allocation was never fixed in rupees, so nothing stopped the move.

## The idea

Money is split into three layers:

1. **Household obligations and emergency reserve.** Never traded. The reserve size is your choice. The book does not set it.
2. **Trading capital.** A fixed rupee amount, set by you before trading, that you can afford to lose entirely.
3. **Per-trade risk.** A percentage of the current trading capital. Per-trade risk is derived from the trading capital, not from total savings.

Rules that follow:

- **Set in rupees.** Trading capital is a rupee amount set before trading. It is not a percentage of growing savings.
- **Cut rule.** A drawdown threshold, for example 10% of trading capital, that reduces the risk percentage or the allocation.
- **Stop rule.** A deeper threshold, for example 20%, that pauses trading for review. The pause happens when the threshold is reached, not after a recovery. The stop rule links to T8.7.
- **State the base.** The worked examples measure drawdown from the starting allocation of Rs 50,000. Per-trade risk uses the current trading capital.
- **Additional money** comes only from spare income. Household savings are never trading capital, and they are never used to top up trading capital after losses (PLAN section 2).
- **Scale-up and withdrawal** are covered in T2.17. This chapter does not set them.

<!-- OPEN: the spec's spot-the-mistake says a cut level computed on the original capital is a mistake, but its worked example computes the cut on the Rs 50,000 starting allocation. This draft measures drawdown from the starting allocation and uses current trading capital for per-trade risk. Reviewer to confirm the base. -->

## See it

<!-- component: capital-allocation-planner | savings: 400000 | tradingCapital: 50000 | cutPct: 10 | stopPct: 20 | riskPct: 1 | caption: Stacked bar of savings, untouched amount and trading capital, with cut and stop lines on the trading segment -->

Read the bar from left to right: the untouched amount is the largest part, and the trading capital is a small segment. The cut line marks a 10% drop from the Rs 50,000 starting allocation, and the stop line marks a 20% drop. Notice that the untouched amount includes the emergency reserve, which the bar does not split out.

## Worked example

**Hypothetical.** Savings Rs 4,00,000.

| Item | Calculation | Rupees or % |
|---|---|---|
| Trading capital | Set by you | Rs 50,000 |
| Trading share of savings | 50,000 / 4,00,000 | 12.5% |
| Untouched amount | 4,00,000 - 50,000 | Rs 3,50,000 |

The untouched amount includes the emergency reserve. The book does not set the reserve.

**Cut at 10% drawdown.**

1. Cut level = 10% x 50,000 = Rs 5,000.
2. Trading capital falls to 50,000 - 5,000 = Rs 45,000.
3. Per-trade risk at 1% = 1% x 45,000 = Rs 450. The lower capital gives a lower risk.

**Stop review at 20% drawdown.**

4. Stop level = 20% x 50,000 = Rs 10,000.
5. Trading capital falls to 50,000 - 10,000 = Rs 40,000.
6. Trading pauses for review. If trading resumed after review, per-trade risk at 1% would be 1% x 40,000 = Rs 400. No trade is taken during the pause.

## Try it

Planner with the guided exercise inputs:

<!-- component: capital-allocation-planner | savings: 600000 | tradingCapital: 30000 | cutPct: 15 | riskPct: 1 | caption: Guided exercise inputs; check each figure by hand -->

### Guided exercise

**Task.** Savings Rs 6,00,000. Trading capital Rs 30,000. Compute the trading share of savings (5%), the untouched amount, and the per-trade risk at 1%. Then, at a 15% drawdown, compute the capital and the per-trade risk at 1%.

Hints:

1. Trading share = trading capital / total savings.
2. Untouched = total savings - trading capital.
3. After a drawdown, take percentages of the trading capital after the drawdown, not of savings.

**Answer:** Trading share = 30,000 / 6,00,000 = 5%. Untouched = 6,00,000 - 30,000 = Rs 5,70,000. Per-trade risk = 1% x 30,000 = Rs 300. At a 15% drawdown, the loss is 15% x 30,000 = Rs 4,500, so the capital is 30,000 - 4,500 = Rs 25,500. Per-trade risk = 1% x 25,500 = Rs 255.

### Independent exercise

**Task.** Write your own allocation with five numbers: total savings, emergency reserve, trading capital, cut threshold and stop threshold. Compute the per-trade risk at 1%, and the capital at each threshold.

<details><summary>Check your answer</summary>

Sample numbers (yours will differ): savings Rs 3,00,000; emergency reserve Rs 1,00,000; trading capital Rs 40,000; cut threshold 10%; stop threshold 20%.

- Trading share of savings = 40,000 / 3,00,000 = 13.3%.
- Per-trade risk at 1% of Rs 40,000 = Rs 400.
- Cut: 10% x 40,000 = Rs 4,000. Capital = 36,000. Per-trade risk = 1% x 36,000 = Rs 360.
- Stop: 20% x 40,000 = Rs 8,000. Capital = 32,000. Trading pauses for review. The 1% figure would be Rs 320 if trading resumed.

The reserve is not used in any of these calculations. It stays untouched.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover the trading share, the capital after a drawdown, the top-up rule, the base of the risk percentage and the timing of the stop rule.

## Paper task

Mode: **learning note** (Lab 3). Planned fields only.

1. Make a one-page allocation sheet in your journal, using hypothetical numbers.
2. Record the five numbers: total savings, emergency reserve, trading capital, cut threshold and stop threshold.
3. Build a threshold table with three rows (starting, cut and stop). For each row, record the capital and the per-trade risk at 1%.
4. Mark the sheet as a learning note. It is the planning step before the G7 gate.

Log it in your journal (or on paper until the journal app is ready).

## What this does NOT tell you

- The numbers are your decisions. The book does not recommend an amount, a reserve or a threshold.
- The 10% and 20% thresholds are illustrations.
- A fixed trading amount does not make any plan profitable. It only limits how much can be lost.
- The sheet does not cover scale-up or withdrawal. Those rules are in T2.17.
- This is not personal financial advice. Household planning may need a qualified professional.

## Remember

- Set trading capital in rupees before trading. It is not a share of growing savings.
- Obligations and the emergency reserve are never traded.
- Per-trade risk comes from the current trading capital.
- The cut reduces risk. The stop pauses trading at its threshold, not after a recovery.
- Household money is never used to top up trading capital.

## Sources and verification

Sources (names only):

- The book's capital framework (PLAN section 2 and section 4.6).
- The book's Lab 3 specification (LABS.md).

Facts to verify before this chapter is final: none. The chapter uses only your numbers and illustrative thresholds.

Last content review: not yet done

<!-- OPEN: should the emergency reserve have a default months figure in the planner, or stay blank? Current draft: blank, the owner decides. -->

<!-- standing-disclaimer -->
