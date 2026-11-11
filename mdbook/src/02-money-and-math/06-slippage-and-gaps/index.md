<!-- meta
id: T2.6
title: Slippage, gaps and planned versus actual risk
page_type: Concept
prerequisites: [T2.4, T2.5, T1.7]
labs: [Lab 1, Lab 3]
estimated_minutes: 30
-->

# Slippage, gaps and planned versus actual risk

## Hook

Hypothetical account: Rs 50,000, risk 1% = Rs 500. The plan buys at Rs 250 with a stop at Rs 240, so 50 shares and a planned loss of Rs 500. Overnight, news breaks and the stock opens at Rs 232, below the stop. The stop fills at the open, and the realised loss is Rs 900, not Rs 500. The arithmetic of the plan was correct; the plan simply described the stop as the price you would get out at.

## The idea

A trade has two risk numbers, and they are not the same thing.

- **Planned risk** = (entry - stop) x shares. This is the loss the plan expects if the exit happens exactly at the stop.
- **Execution risk** = the loss you actually realise at the price your exit order fills.

Terms, defined once:

- **Stop-loss**: an instruction to sell once the price reaches a level. It is an instruction. It does not promise an exit at that level.
- **Trigger**: the price at which a stop becomes active.
- **Fill**: the price at which an order is actually executed.
- **Gap**: the price opens, or jumps, past a level with no trading in between. A stop triggers at the first price available, which can be far from the stop.
- **Slippage**: the difference between the price you expected and the price you got. It comes from the bid-ask spread, thin depth and the order type (T1.5).
- **Circuit**: an exchange price band (T1.7). A stock locked at a circuit may have no trades on the exit side, so the exit can be blocked altogether.

In words: the actual loss is the entry price minus the exit fill price, times the shares. In symbols: loss = (entry - fill) x shares. Divide by the planned risk in rupees to express it in R, where 1R is the planned loss.

Why this matters for swing trades. An end-of-day swing trade holds through the night. News, global moves and corporate events can happen while the market is closed. Overnight gap risk is part of holding overnight; it is not a rare accident you can design out of the plan.

Order types. Stop orders come in forms (for example SL and SL-M) that behave differently at the trigger. [VERIFY: how SL and SL-M orders trigger and fill on Kite (see T4.4)]. Do not assume one behaves like the other.

The stress test. You cannot know the next opening price. What you can do is choose a gap assumption, decide how large a gap loss you can accept, and size the position so that the assumed gap stays inside that limit. The assumption is your choice, and a different assumption gives a different size.

## See it

<!-- component: sl-trigger-sim | mode: gap-through-stop | entry: 250 | stop: 240 | open: 232 | slippage: 2 | caption: Shows the trigger, the open and the fill, with planned and actual loss bars. -->

Look at three things: where the trigger sits (Rs 240), where the market opens (Rs 232), and where the fill lands. Compare the planned loss bar (Rs 500) with the actual loss bar. Then move the open price down, and set slippage to 0, to see how the fill follows the open rather than the stop.

## Worked example

*Hypothetical.* Capital Rs 50,000, risk 1%, entry Rs 250, stop Rs 240.

| Step | Working | Result |
|---|---|---|
| Risk budget | 1% x 50,000 | Rs 500 |
| Risk per share | 250 - 240 | Rs 10 |
| Shares | 500 / 10 | 50 |
| Planned loss (1R) | 50 x 10 | Rs 500 |
| Overnight open | opens at Rs 232, below the stop | stop fills at the open |
| Loss per share | 250 - 232 | Rs 18 |
| Actual gap loss | 50 x 18 | Rs 900 |
| Multiple of R | 900 / 500 | 1.8R |
| Share of capital | 900 / 50,000 | 1.8% |

Add slippage. *Illustrative:* assume a further Rs 2 per share of slippage, so the fill is at Rs 230.

| Step | Working | Result |
|---|---|---|
| Loss per share | 250 - 230 | Rs 20 |
| Actual loss | 50 x 20 | Rs 1,000 |
| Multiple of R | 1,000 / 500 | 2R |
| Share of capital | 1,000 / 50,000 | 2% |

The planned 1% became a realised 2%.

## Try it

<!-- component: sl-trigger-sim | mode: gap-through-stop | entry: 250 | stop: 240 | open: 236 | caption: Demo for the guided exercise: set the open to Rs 236 and read the loss. -->

### Guided exercise

Task: Use the same plan (entry Rs 250, stop Rs 240, 50 shares). Hypothetical: the stock opens at Rs 236 and the stop fills at the open. Compute the actual loss in rupees and in R.

Hints:

1. Find the loss per share first: entry minus fill.
2. Multiply by 50 shares.
3. Divide by the planned Rs 500 to get R.

**Answer:** Loss per share = 250 - 236 = Rs 14. Loss = 50 x 14 = Rs 700. In R: 700 / 500 = 1.4R. The gap loss is 40% above the plan.

### Independent exercise

Task: The entry is Rs 250 and the stop is Rs 240. You assume a gap to Rs 220 and want the loss at that gap to stay within Rs 500. How many whole shares can you hold? State that the gap assumption is yours; it is not a prediction.

<details><summary>Check your answer</summary>

Loss per share at the assumed gap = 250 - 220 = Rs 30. Shares = 500 / 30 = 16.67, rounded down to 16. Gap loss = 16 x 30 = Rs 480. Seventeen shares would give 17 x 30 = Rs 510, above the limit. The gap size is an assumption you choose; a larger assumed gap means fewer shares.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover planned and actual loss, gap fills, stress-test sizing and stop order types.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Write down three hypothetical trades, each with entry, stop and shares.
2. For each one, calculate the planned loss: (entry - stop) x shares.
3. For each one, add a hypothetical opening price below the stop. Calculate the actual loss at the open.
4. Record the slippage fields (slippage_entry_inr and slippage_exit_inr) for each trade, using zero where no slippage applies.
5. Write the planned and actual loss side by side and note which one your plan had described.

<!-- OPEN: The spec asks for planned and actual loss fields. The Lab 3 spec has plan_risk_inr and net_pnl_inr but no separate actual-loss field, so this task uses the slippage fields only. The learning-note mode is also missing from the Lab 3 mode list (paper, live, forward, backtest, kite_demo) even though T0.3 lists it. -->

## What this does NOT tell you

- A stop is an instruction. It does not fix the exit price, and in a circuit it may not produce an exit at all.
- Planned risk is the plan, not a ceiling on what you can lose.
- The Rs 232 open and the Rs 2 per share slippage are hypothetical. They are not a forecast of how any stock will open.
- The gap size you assume is your own choice. A larger real gap than you assumed will produce a larger loss than your stress test allowed.
- Smaller size for a stress test does not reduce the risk of the idea itself.

## Remember

- Planned risk = (entry - stop) x shares. It describes the plan, not a maximum.
- Actual loss = (entry - fill) x shares, and the fill can be far from the stop after a gap.
- Gaps and circuits can move or block the exit.
- Holding overnight carries gap risk by design.
- Size the position for a stress test you have chosen, not only for the chart.

## Sources and verification

Sources (names only):

- Zerodha support pages on stop-loss orders
- NSE documentation on order types
- NSE circuit limit pages
- Chapter T1.7 (circuit limits and price bands)

Items to verify before this chapter is final:

- [VERIFY: how SL and SL-M orders trigger and fill on Kite]
- [VERIFY: exchange rules for stop and trigger orders]
- [VERIFY: circuit band rules that apply to an exit during a locked circuit]

<!-- facts-needed: SL and SL-M trigger and fill behaviour on Kite; exchange rules for stop and trigger orders; circuit rules for locked exits (cross-reference T1.7) -->

Last content review: not yet done

<!-- standing-disclaimer -->
