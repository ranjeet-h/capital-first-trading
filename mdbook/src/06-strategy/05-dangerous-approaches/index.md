<!-- meta
id: T6.5
title: Why scalping and martingale are dangerous
page_type: Math/Calculator
prerequisites: [T6.2, T2.7, T2.9, T2.12, T2.13]
labs: [Lab 2, Lab 4]
estimated_minutes: 30
-->

# Why scalping and martingale are dangerous

## Hook

A trader buys 100 shares at Rs 100. He aims to sell for Rs 0.10 more per share, a gain of Rs 10. He assumes a cost of Rs 50 for the round trip. Hypothetical example. The Rs 50 cost is larger than the Rs 10 gain, so the trade loses Rs 40 even when it works as planned. The Rs 50 is a round number for practice, not the real charge. The real charges are in *Costs on a trade*. This chapter shows the arithmetic behind five approaches that feel quick or clever, and why each one is dangerous.

## The idea

This chapter covers five approaches. The book treats them as failure modes to recognise. They are not methods to practise.

**Scalping.** A scalper makes many trades, each aiming for a small gain. Every trade pays a cost. A fixed cost takes a large share of a small gain. The break-even move is the cost divided by the number of shares. It is the price move needed just to cover the cost.

**Intraday trading.** Intraday trades open and close within the same day. Some products used for intraday trades use borrowed money, called margin. Borrowed money makes gains and losses larger. See *Leverage and margin*. Intraday positions must be closed the same day. At Zerodha, open intraday share positions are closed for you at about 3:25 PM, and futures and options at about 3:26 PM, and each order closed this way costs Rs 50 plus 18% GST. Zerodha can also cut intraday leverage during the day. (As of 11 Nov 2026, Zerodha support. Rules change, so check Zerodha support.) SEBI's July 2024 study of individual intraday traders in the equity cash segment found that 71% of them lost money after costs in FY23. This book does not encourage intraday trading. Any later practice would be on paper only.

**Averaging down.** Averaging down means buying more of a share that has fallen. The average price falls. But the money at risk on the same idea grows. A fall in price needs a larger gain to recover. The bigger the loss, the bigger the gain needed. See *Drawdown and recovery math*.

**Martingale.** Martingale means doubling the stake after each loss. The stakes grow very fast. One long run of losses can cost more than the whole account. A high win rate does not remove this risk. A single long run is enough.

**Options, in theory only.** An option buyer pays a price called the premium. The buyer's loss is limited to the premium paid. An option seller receives the premium. The seller's gain is limited to the premium received. The seller's loss can be far larger. Premiums, decay and margin are not covered here. See *Options basics and Greeks*.

None of these approaches is a shortcut to a daily profit target. See *The Rs 2,000-3,000 reality check*.

## See it

<!-- component: drawdown-compounding | caption: Shows how much gain is needed to recover after a fall, so the recovery math in averaging down can be seen -->

<!-- component: position-size-viz | caption: Shows stake growth in a doubling sequence with a base risk of Rs 500 -->

<!-- component: streak-sim | caption: Shows a martingale sequence at a given win rate, so a long losing run can be seen -->

Start with the recovery view. Watch how the gain needed grows as the fall gets deeper. Then watch the stake view. Each loss doubles the next stake. The streak view shows how often a long losing run can appear.

## Worked example

**Hypothetical. Scalping.** Buy 100 shares at Rs 100 (Rs 10,000).

| Step | Calculation | Result |
|---|---|---|
| Target gross gain | 100 x Rs 0.10 | Rs 10 |
| Assumed round-trip cost | Placeholder for this example | Rs 50 |
| Net result | Rs 10 - Rs 50 | minus Rs 40 |
| Break-even move per share | Rs 50 / 100 shares | Rs 0.50, which is 0.5 percent of Rs 100 |

**Hypothetical. Averaging down.** Buy 100 shares at Rs 100 (Rs 10,000). The price falls to Rs 80.

| Step | Calculation | Result |
|---|---|---|
| Loss at Rs 80 | (80 - 100) x 100 | minus Rs 2,000, which is 20 percent |
| Gain needed to get back to Rs 100 | 100 / 80 - 1 | 25 percent |
| Second buy | 100 shares at Rs 80 | Rs 8,000 |
| New average price | (10,000 + 8,000) / 200 | Rs 90 |
| Loss at Rs 60 on 200 shares | (60 - 90) x 200 | minus Rs 6,000 |
| Comparison: one lot of 100 shares at Rs 60 | (60 - 100) x 100 | minus Rs 4,000 |

The average price fell from Rs 100 to Rs 90. But the number of shares doubled, and the loss at Rs 60 is larger. Averaging down did not lower the risk. It raised it.

**Hypothetical. Martingale.** Base risk Rs 500. Each loss doubles the next stake.

| Trade | Stake | Total lost if this trade and all before it lose |
|---|---|---|
| 1 | Rs 500 | Rs 500 |
| 2 | Rs 1,000 | Rs 1,500 |
| 3 | Rs 2,000 | Rs 3,500 |
| 4 | Rs 4,000 | Rs 7,500 |
| 5 | Rs 8,000 | Rs 15,500 |
| 6 | Rs 16,000 | Rs 31,500 |

After five losses, the stake is 500 x 2 to the power 5, which is Rs 16,000. That stake is larger than a Rs 10,000 account. It is 32 percent of a Rs 50,000 account. The total lost after five losses is 500 x (1 + 2 + 4 + 8 + 16) = Rs 15,500.

**Recovery math.** A 40 percent loss leaves 60 percent of the value. The gain needed is 1 / 0.6 - 1 = 66.7 percent.

## Try it

### Guided exercise

**Task.** A position falls 40 percent. What gain is needed to recover to the starting value?

Hints:

1. After a 40 percent loss, 60 percent of the value remains.
2. The gain needed is 1 divided by 0.6, minus 1.
3. Give the answer as a percent to one decimal place.

**Answer:** 1 / 0.6 = 1.667. 1.667 - 1 = 0.667. The gain needed is **66.7 percent**.

### Independent exercise

**Task.** A scalp trade uses 200 shares at Rs 100. The assumed round-trip cost is Rs 60. Compute the break-even move per share, and the break-even move as a percent of Rs 100.

<details><summary>Check your answer</summary>

- Break-even move per share: Rs 60 / 200 shares = **Rs 0.30**.
- As a percent of Rs 100: 0.30 / 100 = **0.3 percent**.
- Check: 200 shares x Rs 0.30 = Rs 60, which equals the cost.

The Rs 60 cost is an assumed figure for this example only. All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the break-even move, the recovery math, the stake doubling and the risk of averaging down.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Write one learning note for each of the five approaches in this chapter.
2. In each note, copy the arithmetic from this chapter.
3. Check each calculation again with a calculator.
4. For each approach, write the single event that would cause the largest loss.
5. Mark every note as hypothetical.

## Limits and common mistakes

- The break-even figures use a round-number cost for practice. The real charges are in *Costs on a trade*.
- Averaging down does not lower risk. It increases the money at risk on the same idea.
- Option figures here are theory only. Premiums, decay and margin rules are not covered in this chapter. See *Options basics and Greeks*.
- A stake that doubles can exceed your account before the losing run ends.
- The prices in these examples are invented. They do not predict any real share.
- Intraday and option charges, margins and rules change. Check the Zerodha charges page, Zerodha support and the NSE site before you rely on any figure.

## Remember

- A fixed cost per trade is a large share of a small gain.
- The break-even move is the cost divided by the number of shares.
- After a fall, the gain needed to recover grows faster than the fall.
- Averaging down raises the money at risk on the same idea.
- Martingale can lose more than the whole account, even with a high win rate.

## Sources and verification

- SEBI, "Analysis of Intraday Trading by Individuals in Equity Cash Segment" (July 2024). It reports that 71% of individual intraday traders in the equity cash segment made net losses in FY23.
- SEBI study of individual traders in equity derivatives for FY25 and FY26 (August 2026). It reports that 87.7% of individuals lost money in FY26.
- Zerodha Varsity, material on risk and position sizing (reference only).
- Zerodha charges page and Zerodha support on auto square-off (read on 11 Nov 2026).

<!-- standing-disclaimer -->
