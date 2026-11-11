<!-- meta
id: T2.9
title: Drawdown, recovery and compounding
page_type: Math/Calculator
prerequisites: [T2.8]
labs: [Lab 3]
estimated_minutes: 30
-->

# Drawdown, recovery and compounding

## Hook

A hypothetical Rs 50,000 account falls 50%, to Rs 25,000. A 50% gain on Rs 25,000 brings it to Rs 37,500. That is not back to Rs 50,000. To return to Rs 50,000 from Rs 25,000, the account needs a 100% gain. The hole is deeper than the drop that made it.

## The idea

**Drawdown** is the fall from a peak to the lowest point after it. That lowest point is called the trough. Drawdown is shown as a share of the peak. **Equity** means the value of your account at a point in time. In words: drawdown = (peak equity - trough equity) / peak equity.

**Recovery gain** is the rise needed from the trough to get back to the peak. It is measured from the trough, not from the peak. If the drawdown is d (as a fraction of the peak), the recovery gain is d / (1 - d). In rupees, that is (peak - trough) / trough.

**Asymmetry.** Losses and gains do not work the same way. Each loss takes a share of a smaller balance. Each recovery must then be measured from that smaller balance. A 50% loss needs a 100% gain.

**Compounding.** Each percentage move applies to the balance at that time. Equal up and down percentages do not cancel. Rs 50,000 gains 10%, to Rs 55,000. Then it loses 10% of Rs 55,000 (Rs 5,500), to Rs 49,500. The net result is minus 1%. The order of the moves does not change this.

**Risk of ruin** is the probability, over many trades, that equity falls to a level from which the plan cannot continue. It is not a single bad trade. It depends on the edge (the plan's average result per trade), the risk per trade and the streaks (*Consecutive losses and losing streaks*). The book works it out by simulation in Lab 4. That means many repeated test runs. It does not use a shortcut here. For the same sequence of results, a smaller risk per trade lowers the chance of a deep drawdown.

## See it

<!-- component: drawdown-compounding | startCapital: 50000 | lossPct: 30 | caption: Recovery curve. Move the loss slider and read the gain needed to return to the peak. -->

Move the loss slider and watch how fast the gain needed grows. Start at 30%, then go to 50%. Read the recovery gain each time. The curve is steeper at large losses. So each extra point of loss costs more to recover.

## Worked example

*Hypothetical.* Account values over time: Rs 50,000, then Rs 55,000, then Rs 48,000, then Rs 52,000.

| Step | Working | Result |
|---|---|---|
| Peak | highest value before the trough | Rs 55,000 |
| Trough | lowest value after the peak | Rs 48,000 |
| Drawdown | (55,000 - 48,000) / 55,000 | 12.7% |
| Recovery gain from trough | (55,000 - 48,000) / 48,000 | 14.6% |

Compounding check, with each move applied to the balance at the time:

| Step | Working | Result |
|---|---|---|
| Start | | Rs 50,000 |
| Gain 10% | 50,000 x 1.10 | Rs 55,000 |
| Loss 10% | 55,000 x 0.90 | Rs 49,500 |
| Net | 49,500 - 50,000 | minus Rs 500, which is minus 1% |

Loss and gain needed to recover. The formula is recovery gain = loss / (1 - loss). Worked row: a 20% loss takes Rs 50,000 to Rs 40,000. Getting back to Rs 50,000 needs Rs 10,000 / Rs 40,000 = 25%.

| Loss | Gain needed to recover |
|---|---|
| 10% | 11.1% |
| 20% | 25% |
| 30% | 42.9% |
| 50% | 100% |
| 75% | 300% |

## Try it

### Guided exercise

Task: Account values over time: Rs 50,000, then Rs 45,000, then Rs 39,000, then Rs 44,000 (hypothetical). Find the peak, the trough, the drawdown and the recovery gain from the trough.

Hints:

1. Find the highest point before the trough. That is the peak.
2. Drawdown = (peak - trough) / peak.
3. Recovery gain = (peak - trough) / trough.

**Answer:** Peak Rs 50,000. Trough Rs 39,000. Drawdown = 11,000 / 50,000 = 22.0%. Recovery gain from the trough = 11,000 / 39,000 = 28.2%.

### Independent exercise

Task: Capital is Rs 50,000. Your drawdown limit is 15%. The account falls 20% and then recovers. Does the fall go past the limit? What gain is needed from the trough?

<details><summary>Check your answer</summary>

Yes. A 20% fall is more than the 15% limit. The trough is Rs 40,000 (Rs 50,000 minus Rs 10,000). Recovery to Rs 50,000 needs Rs 10,000 / Rs 40,000 = 25% from the trough.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover recovery arithmetic, compounding, the meaning of risk of ruin, and reading a drawdown.

## Paper task

Mode: **learning note**. Log it in Lab 3 (or on paper until the journal app is ready).

1. Take the ten-row hypothetical table for Trader A from *Why money math comes before charts*.
2. Enter it in Lab 3 as hypothetical rows, or work it on paper with the balance after each trade.
3. Record the maximum drawdown in rupees and as a percentage, measured from the peak. Lab 3 shows the drawdown curve and the maximum drawdown.
4. Compare your result with the 4% worked out in *Why money math comes before charts*. Note which peak the figure is measured from.

## Limits and common mistakes

- Drawdown depends on the order of the results. The same trades in a different order give a different path.
- Recovery arithmetic does not say how long a recovery will take, or whether it will happen.
- Risk of ruin is not worked out here. Lab 4 estimates it by simulation.
- You set a drawdown limit before you trade. This book does not allow withdrawals during a drawdown (*Scaling and withdrawal policy*).
- The examples are hypothetical. They are not a forecast of any account.

## Remember

- Drawdown = (peak - trough) / peak.
- Recovery gain = drawdown / (1 - drawdown), measured from the trough.
- Equal percentage up and down moves do not cancel. A 50% loss needs a 100% gain.
- Risk of ruin is a probability over many trades, not one bad trade.
- A smaller risk per trade lowers the chance of deep drawdowns for the same sequence.

## Sources and verification

Sources (names only):

- Standard drawdown arithmetic, computed in this chapter

All numbers in this chapter are made up for practice.

<!-- standing-disclaimer -->
