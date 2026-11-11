<!-- meta
id: T8.2
title: Loss aversion and revenge trading
page_type: Concept
prerequisites: [T8.1, T2.9]
labs: [Lab 1, Lab 3]
estimated_minutes: 25
-->

# Loss aversion and revenge trading

## Hook

You lose Rs 2,000 before lunch. You feel a strong need to win it back before the market closes. So you trade again, with twice your usual size. That trade also loses. The day now costs Rs 3,000, and the hole is deeper than before. This chapter explains why the urge is so strong. It also shows the arithmetic that makes the hole deeper, and the rule that stops it.

## The idea

**Loss aversion** means a loss feels heavier than a gain of the same rupee size. Researchers who study choice have found this pattern in many people. A loss of Rs 2,000 often hurts more than a gain of Rs 2,000 feels good.

**Recovery** is the gain you need to get back to where you started. The gain is measured on the smaller amount that is left. So a loss needs a bigger percentage to recover than you might expect.

- A loss of L% of capital needs a gain of L / (100 - L) % to recover.
- A 10% loss needs 10 / 90 = 11.1%, not 10%.
- A 50% loss needs 50 / 50 = 100%, which means the account must double.

**Revenge trading** is a trade taken to win back a loss. It often comes with a bigger size, a shorter gap after the loss, or a looser stop. It often has no written plan behind it.

Your plan sets a **daily limit**. The daily limit is the largest loss you accept in one day. The rule is simple:

- Once the daily limit is reached, trading stops for the day.
- No increase in size after a loss.

A limit only helps if you follow it on a bad day. That is when the urge is strongest.

## See it

<!-- component: drawdown-compounding | path: 50000,48000,47000 | caption: Hypothetical equity path: Rs 50,000, then Rs 48,000 after the first loss, then Rs 47,000 after the revenge trade. Read the gain needed at each point. -->

Look at the path after each loss. Compare the gain needed after Rs 2,000 with the gain needed after Rs 3,000. The second number is higher. The revenge trade made the loss bigger, so the climb back is longer.

## Worked example

**Hypothetical.** Capital Rs 50,000. You lose Rs 2,000 on a planned trade. Your usual risk per trade is 1R, which is Rs 500.

| Step | Calculation | Result |
|---|---|---|
| 1. Loss so far | 50,000 - 48,000 | Rs 2,000 (4% of capital) |
| 2. Recovery needed | 2,000 / 48,000 | 4.17% |
| 3. Revenge trade risk | 2 x Rs 500 | Rs 1,000 |
| 4. Loss on the revenge trade | 1R at the new size | Rs 1,000 |
| 5. Total loss | 2,000 + 1,000 | Rs 3,000 (6% of capital) |
| 6. Recovery needed now | 3,000 / 47,000 | 6.38% |

The doubled size made the loss bigger. The recovery needed also rose, from 4.17% to 6.38%. The revenge trade broke the rule of no size increase after a loss.

## Try it

### Guided exercise

**Task.** Your capital is Rs 50,000. You lose Rs 5,000. Work out the recovery needed, as a percentage of the capital that is left.

Hints:

1. The remaining capital is Rs 50,000 - Rs 5,000 = Rs 45,000.
2. Recovery = loss / remaining capital.

**Answer:** Recovery = 5,000 / 45,000 = 0.111, which is **11.1%**. The gain needed is more than the 10% loss, because the base is smaller.

### Independent exercise

**Task.** After three planned trades that each lose Rs 500, you double your size for the next trade. That trade also loses. Work out the total loss. Then name the rule that was broken.

<details><summary>Check your answer</summary>

- Three planned losses: 3 x Rs 500 = Rs 1,500.
- Revenge trade at double size: 2 x Rs 500 = Rs 1,000 loss.
- Total loss: Rs 1,500 + Rs 1,000 = **Rs 2,500**.
- Rule broken: no size increase after a loss.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks recovery arithmetic, the daily limit and the signs of revenge trading.

## Paper task

Mode: **paper or learning note**. Log it in your journal (or on paper until the journal app is ready).

1. For the next five trading sessions, look at every trade taken after a loss in the same session. Include every paper trade. The Kite demo is for looking at screens only, so practice trades are paper trades.
2. For each one, tag it as a rule break if the size went up, the gap was short, or the plan did not cover it.
3. Write the total loss for the session, in rupees and as a percent of capital.
4. Write the recovery needed after that loss, using the formula from this chapter.
5. If the journal is not ready, do the task on paper or in a spreadsheet.

## Limits and common mistakes

- The recovery formula shows how big the hole is. It does not show a safe way out of the hole.
- A trade taken after a loss is not always revenge. Check the size, the gap and the plan before you decide.
- The daily limit stops trading for the day. It does not make the loss smaller.
- Loss aversion is a pattern seen in many people. It does not prove how you will react on a given day.
- A bigger size after a loss does not fix the plan. It only makes the next loss bigger.

## Remember

- A 10% loss needs an 11.1% gain. It does not need 10%.
- Recovery = loss / capital left after the loss.
- Revenge trading often means a bigger size, a shorter gap or no plan.
- Once the daily limit is reached, trading stops for the day.
- No size increase after a loss.

## Sources and verification

- Daniel Kahneman and Amos Tversky (1979), "Prospect Theory: An Analysis of Decision under Risk", Econometrica, 47(2), starting on page 263.
- Your own daily limit, as written in your plan.

<!-- standing-disclaimer -->
