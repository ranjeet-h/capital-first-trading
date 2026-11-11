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

Hypothetical account: Rs 50,000, risk 1% = Rs 500. The plan buys at Rs 250 with a stop at Rs 240. That is 50 shares and a planned loss of Rs 500. Overnight, news breaks. The stock opens at Rs 232, below the stop. The stop fills at the open. The actual loss is Rs 900, not Rs 500. The plan's arithmetic was right. The mistake was to treat the stop as the exact price you would get out at.

## The idea

A trade has two risk numbers. They are not the same thing.

- **Planned risk** = (entry - stop) x shares. This is the loss the plan expects if the exit happens exactly at the stop.
- **Execution risk** = the loss you actually get at the price your exit order fills.

Key terms:

- **Stop-loss**: an instruction to sell once the price reaches a level. It is an instruction. It does not promise you will exit at that level.
- **Trigger**: the price at which a stop becomes active.
- **Fill**: the price at which an order is actually carried out.
- **Gap**: the price opens, or jumps, past a level with no trading in between. A stop triggers at the first price available, which can be far from the stop.
- **Slippage**: the difference between the price you expected and the price you got. It comes from the bid-ask spread. That is the gap between the price buyers offer and the price sellers ask. It also comes from thin depth, which means few orders are waiting at each price. The order type matters too (*Order matching, spread and liquidity*).
- **Circuit**: a limit on how far a price can move in one day, set by the exchange (*Circuit limits and halts*). A stock stuck at its circuit may have no buyers or sellers on the exit side. Then your exit can be blocked completely.

In words: the actual loss is the entry price minus the exit fill price, times the shares. In symbols: loss = (entry - fill) x shares. To express it in R, divide by the planned risk in rupees. 1R means one planned loss.

Why this matters for swing trades. A swing trade is a trade held for days. A trade held overnight faces gap risk. News, global moves and company events can happen while the market is closed. Overnight gap risk is part of holding overnight. It is not a rare accident you can design out of the plan.

Order types. Stop orders come in two forms on Kite: SL and SL-M. They behave differently at the trigger (see *Order types*).

- An **SL** (stoploss limit) order has a trigger price and a limit price. When the price reaches the trigger, a limit order goes to the exchange. It fills only at your limit price or better. If the price falls fast past your limit, the order can stay open and unfilled.
- An **SL-M** (stoploss market) order has only a trigger price. When the price reaches the trigger, a market order goes to the exchange. It is very likely to fill, but at whatever price is available. That price can be worse than the trigger.
- A stoploss order is valid only for the trading day. If it does not trigger, it ends at the close.
- NSE has stopped the SL-M order type for options. For shares, both forms are available.

(As of 11 Nov 2026, Zerodha support pages on stoploss orders. Rules change, so check Zerodha support.) Do not assume one form behaves like the other.

Circuits. The exchange sets a daily price band for each share. Zerodha says the bands range from 2% to 20%, depending on the share. Shares that have futures and options have no fixed daily band. They have a moving 10% band instead. An order outside the band is rejected. If the price is stuck at the band, orders wait until the exchange moves the band. If you are in an intraday (MIS) position and cannot close it because of a circuit, Zerodha says the position turns into a delivery trade. Zerodha may close positions but is not required to. You may then have to pay for the shares, or face a penalty for not delivering them if you had sold. (As of 11 Nov 2026, Zerodha support pages on circuit limits. Rules change, so check Zerodha support and the NSE site.)

The stress test. You cannot know the next opening price. You can choose a gap assumption. Decide how big a gap loss you can accept. Then size the position so the assumed gap stays inside that limit. The assumption is your choice. A different assumption gives a different size.

## See it

<!-- component: sl-trigger-sim | mode: gap-through-stop | entry: 250 | stop: 240 | open: 232 | slippage: 2 | caption: Shows the trigger, the open and the fill, with planned and actual loss bars. -->

Look at three things. The trigger sits at Rs 240. The market opens at Rs 232. The fill lands near the open. Compare the planned loss bar (Rs 500) with the actual loss bar. Then move the open price down and set slippage to 0. See how the fill follows the open, not the stop.

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

Now add slippage. *Illustrative:* assume a further Rs 2 per share of slippage. The fill is then at Rs 230.

| Step | Working | Result |
|---|---|---|
| Loss per share | 250 - 230 | Rs 20 |
| Actual loss | 50 x 20 | Rs 1,000 |
| Multiple of R | 1,000 / 500 | 2R |
| Share of capital | 1,000 / 50,000 | 2% |

The planned 1% became an actual loss of 2% of capital.

## Try it

<!-- component: sl-trigger-sim | mode: gap-through-stop | entry: 250 | stop: 240 | open: 236 | caption: Demo for the guided exercise: set the open to Rs 236 and read the loss. -->

### Guided exercise

Task: Use the same plan (entry Rs 250, stop Rs 240, 50 shares). Hypothetical: the stock opens at Rs 236 and the stop fills at the open. Work out the actual loss in rupees and in R.

Hints:

1. Find the loss per share first: entry minus fill.
2. Multiply by 50 shares.
3. Divide by the planned Rs 500 to get R.

**Answer:** Loss per share = 250 - 236 = Rs 14. Loss = 50 x 14 = Rs 700. In R: 700 / 500 = 1.4R. The gap loss is 40% above the plan.

### Independent exercise

Task: The entry is Rs 250 and the stop is Rs 240. You assume the price gaps down to Rs 220. You want the loss at that gap to stay within Rs 500. How many whole shares can you hold? Remember, the gap is your assumption. It is not a prediction.

<details><summary>Check your answer</summary>

Loss per share at the assumed gap = 250 - 220 = Rs 30. Shares = 500 / 30 = 16.67, rounded down to 16. Gap loss = 16 x 30 = Rs 480. Seventeen shares would give 17 x 30 = Rs 510, which is above the limit. The gap size is an assumption you choose. A larger assumed gap means fewer shares.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover planned and actual loss, gap fills, sizing for a stress test, and stop order types.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Write down three hypothetical trades, each with entry, stop and shares.
2. For each one, calculate the planned loss: (entry - stop) x shares.
3. For each one, add a hypothetical opening price below the stop. Calculate the actual loss at the open.
4. Record the slippage fields (slippage_entry_inr and slippage_exit_inr) for each trade. Use zero where no slippage applies.
5. Write the planned and actual loss side by side. Note which one your plan had described.

## Limits and common mistakes

- A stop is an instruction. It does not fix the exit price. In a circuit it may not produce an exit at all.
- Planned risk is the plan. It is not a ceiling on what you can lose.
- The Rs 232 open and the Rs 2 per share slippage are hypothetical. They are not a forecast of how any stock will open.
- The gap size you assume is your own choice. A real gap bigger than you assumed will cause a bigger loss than your stress test allowed.
- A smaller size for a stress test does not reduce the risk of the idea itself.

## Remember

- Planned risk = (entry - stop) x shares. It describes the plan. It is not a maximum.
- Actual loss = (entry - fill) x shares. After a gap, the fill can be far from the stop.
- Gaps and circuits can move or block the exit.
- Holding overnight always carries gap risk.
- Size the position for a stress test you have chosen, not only for the chart you are looking at.

## Sources and verification

Sources, read on 11 Nov 2026:

- Zerodha support: "What are stoploss orders and how to use them", "What is trigger price in stoploss orders".
- Zerodha support: "What are circuit limits or price bands" and the page on what happens to intraday positions when a circuit is hit.
- NSE pages on price bands and circuit breakers. Check them for the current band of any share.
- Chapter *Circuit limits and halts* (circuit limits and price bands).

<!-- facts-needed: SL and SL-M trigger and fill behaviour on Kite; exchange rules for stop and trigger orders; circuit rules for locked exits (cross-reference *Circuit limits and halts*) -->

<!-- standing-disclaimer -->
