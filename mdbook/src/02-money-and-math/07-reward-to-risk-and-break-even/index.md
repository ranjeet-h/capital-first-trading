<!-- meta
id: T2.7
title: Reward-to-risk, win rate and break-even
page_type: Math/Calculator
prerequisites: [T2.1, T2.4]
labs: [Lab 1, Lab 3]
estimated_minutes: 20
-->

# Reward-to-risk, win rate and break-even

## Hook

Two hypothetical plans both enter at Rs 250 with a Rs 240 stop. Plan P targets Rs 260. Plan Q targets Rs 270. Each wins 50 of 100 hypothetical trades. Before costs, Plan P needs a 50% win rate just to break even, and Plan Q needs only about 33.3%. The same win rate means very different things for the two plans.

## The idea

**Reward-to-risk (R)** compares what a plan could make with what it could lose, per share. For a long trade:

- Risk per share = entry - stop.
- Reward per share = target - entry.
- R = reward / risk.

**Break-even win rate before costs.** Take a plan with R. Let W be the win rate, so the loss rate is 1 - W. The plan breaks even when the expected wins equal the expected losses. In units of the risk, a win pays R and a loss costs 1, so W x R = (1 - W) x 1. Solving gives W = 1 / (1 + R). Equivalently, W = risk / (risk + reward).

**Costs raise the break-even.** A cost paid on each share adds to the risk and takes from the reward. Both changes push the required win rate up.

Other points:

- Win rate and R trade off in most approaches. A higher target is often reached less often. Neither number decides the result alone.
- A target is a plan, not a forecast. Many approaches do not use a fixed target at all; those are covered in Track 6.
- Break-even here is before costs, before slippage and before gaps (T2.6). Those are separate losses.

## See it

<!-- OPEN: The spec asks for a static bar chart of break-even win rate against R, with the costed line dashed. No component name fits a static chart, so a table is used. -->

| Target (Rs) | Reward per share | R | Break-even win rate before costs |
|---|---|---|---|
| 260 | Rs 10 | 1 | 50.0% |
| 270 | Rs 20 | 2 | 33.3% |
| 280 | Rs 30 | 3 | 25.0% |
| 270, with dummy cost of Rs 2 per share | Rs 18 (after cost) | 1.5 (costed) | 40.0% |

Read down the table. As R rises, the win rate needed to break even falls. The last row is the same Rs 270 target after a dummy cost of Rs 2 per share: the break-even rises from 33.3% to 40.0%. The costs are dummy figures for arithmetic only.

## Worked example

*Hypothetical.* Entry Rs 250, stop Rs 240, target Rs 270.

| Step | Working | Result |
|---|---|---|
| Risk per share | 250 - 240 | Rs 10 |
| Reward per share | 270 - 250 | Rs 20 |
| R | 20 / 10 | 2 |
| Break-even before costs | 1 / (1 + 2) | 1/3 = 33.3% |

Now add a *DUMMY* cost. Assume Rs 100 round trip on 50 shares, which is Rs 2 per share. This is not a real charge.

| Step | Working | Result |
|---|---|---|
| Risk per share, with cost | 10 + 2 | Rs 12 |
| Reward per share, after cost | 20 - 2 | Rs 18 |
| Costed R | 18 / 12 | 1.5 |
| Costed break-even | W x 18 = (1 - W) x 12, so 30W = 12 | W = 0.4 = 40% |

Check: 0.4 x 18 = 7.2, and 0.6 x 12 = 7.2. Both sides match.

Other targets, same entry and stop, before costs: target Rs 260 gives R = 1 and break-even 50%; target Rs 280 gives R = 3 and break-even 25%.

## Try it

### Guided exercise

Task: Entry Rs 400, stop Rs 380, target Rs 460. Compute R and the break-even win rate before costs.

Hints:

1. Find risk per share (entry minus stop) and reward per share (target minus entry).
2. R = reward / risk.
3. Break-even = 1 / (1 + R).

**Answer:** Risk Rs 20; reward Rs 60; R = 3; break-even = 1 / 4 = 25%.

### Independent exercise

Task: Entry Rs 150, stop Rs 144, target Rs 165. Compute R and the break-even win rate before costs. Then, with a DUMMY cost of Rs 0.50 per share, recompute the break-even.

<details><summary>Check your answer</summary>

Before costs: risk Rs 6, reward Rs 15, R = 2.5, break-even = 1 / 3.5 = 28.6%.

With the Rs 0.50 dummy cost: risk Rs 6.5, reward Rs 14.5, break-even = 6.5 / (6.5 + 14.5) = 6.5 / 21 = 31.0%. The cost raised the break-even.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover break-even arithmetic, the effect of costs, the reject rule for a minimum R and the trap of judging on win rate alone.

## Paper task

Mode: **learning note**. Log it in Lab 3 (or on paper until the journal app is ready).

1. Choose three hypothetical plans, each with an entry, a stop and a target.
2. For each plan, record planned R and the break-even win rate before costs.
3. Add a DUMMY cost of Rs 0.50 per share and recompute the break-even for each plan.
4. Save each plan to the journal with its planned R field (Lab 1 save-to-journal), in learning-note mode.

<!-- OPEN: The learning-note mode is in the T0.3 journal mode list but not in the Lab 3 mode list (paper, live, forward, backtest, kite_demo). Confirm before the journal app is built. -->

## What this does NOT tell you

- R is a plan. It is not a forecast, and target prices are not reached reliably.
- Do not choose a target to make R look good. The rule is set before the trade.
- Break-even before costs ignores slippage, fills and gaps (T2.6). Real break-evens are higher.
- A higher R is not automatically better. It can come with a lower chance of reaching the target.
- The costs in this chapter are DUMMY figures. They are not Zerodha or statutory rates.

## Remember

- R = reward per share / risk per share, for a long trade.
- Break-even win rate before costs = 1 / (1 + R).
- Costs add to the risk and take from the reward, so they raise the break-even.
- A win rate only means something next to R.
- A plan below your minimum R fails your rule, however good its story sounds.

## Sources and verification

Sources (names only):

- The book's Lab 1 specification (LABS.md)
- Standard expectancy arithmetic, computed in this chapter; no external figure is used

Items to verify: none for this chapter. The costs are DUMMY values and must not be quoted as real charges.

Last content review: not yet done

<!-- standing-disclaimer -->
