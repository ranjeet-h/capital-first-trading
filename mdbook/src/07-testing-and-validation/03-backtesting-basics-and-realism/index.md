<!-- meta
id: T7.3
title: Backtesting basics and the realism contract
page_type: Lab
prerequisites: [T7.2, T2.4, T2.5, T6.2]
labs: [Lab 4, Lab 1, Lab 2]
estimated_minutes: 35
-->

# Backtesting basics and the realism contract

## Hook

Imagine a test shows a trade that exits at the stop price of Rs 490. In real life, the market opened at Rs 480 that day. The test says the loss is Rs 336. The loss from the real open is Rs 576. The test was too kind by Rs 240. A set of timing and fill rules prevents this kind of error. This chapter explains those rules. The book calls them the realism contract.

## The idea

A **backtest** replays past prices and applies a fixed set of rules to them. It shows what the rules would have done on that past data. Every result of a backtest is hypothetical. The label on every result reads: **Hypothetical backtest. Not live results.**

The realism contract is a set of rules that makes the backtest act more like a real trade. These are the main rules:

- **Timing.** A signal uses data up to and including the close of day t. The order fills at the open of day t+1. Day t is the day you see the signal, after the close. The earliest you can act is the next day's open.
- **No same-bar fills.** A fill at the same close that made the signal is not possible in real trading. You see the close only after the market shuts.
- **Stops, long trade.** The stop is checked against the day's low. If the open is already below the stop, the fill is at the open. If not, and the low reaches the stop, the fill is at the stop price.
- **Trailing stops.** A trailing stop moves up as the price rises. In this contract, it updates at the close. The new level applies from the next day.
- **Costs.** Every fill passes through the cost settings in Lab 2. The default is CNC, the delivery type, where you buy shares and hold them (*Product types*). Costs are covered in *Costs on a trade*.
- **Slippage.** Slippage is a fill worse than the planned price. It is optional. You set it for each side of a trade (*Slippage*).
- **Sizing.** The trade size follows the rules in *Position sizing step by step*. No leverage is used. Leverage means borrowed money, and this track uses none (*Leverage and margin*).
- **Same inputs, same result.** The same data, the same settings and the same seed give the same result. A seed is the starting number for any random step. Each run saves a record of its settings and data. This record is called a manifest.

**Profit and loss (P&L)** is what a trade gains or loses. The net P&L is the result after costs and slippage. A backtest that leaves out costs shows a higher P&L than the trader would really get.

## See it

<!-- component: sl-trigger-sim | stop: 490 | open: 480 | caption: Gap-through-stop case for a long trade. The open is below the stop, so the fill is at the open. The stop-loss and stop-loss market logic is shown for context. -->

The picture shows one day. The stop is at Rs 490. The day opens at Rs 480, below the stop. Move the open above the stop and look at where the fill moves. Then move the open below the stop again and compare.

## Worked example

**Hypothetical.** Capital Rs 50,000. Risk 1% per trade, which is Rs 500. The signal comes at the close. The next open is Rs 504. The stop is Rs 490.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 50,000 x 1% | Rs 500 |
| 2. Risk per share | 504 - 490 | Rs 14 |
| 3. Raw shares | floor(500 / 14) = floor(35.7) | 35 |
| 4. Cash cap | floor(50,000 / 504) = floor(99.2) | 99 |
| 5. Concentration cap at 25% | floor(12,500 / 504) = floor(24.8) | 24 |
| **Shares** | minimum of 35, 99 and 24 | **24** |

The concentration cap is the binding constraint. It is the smallest limit, so it sets the size.

**Planned loss.** 24 x 14 = Rs 336.

**Gap through the stop.** The next day opens at Rs 480, below the stop of Rs 490. The stop fills at the open, Rs 480. The loss is:

24 x (504 - 480) = 24 x 24 = **Rs 576**, before costs.

That is Rs 240 more than planned: 576 - 336 = 240.

The stop price did not protect the trade from the gap. The fill followed the open. Costs are not added in this example. They come from the cost settings in Lab 2.

## Try it

### Guided exercise

**Task.** Recompute the worked example with the stop at Rs 492. Find the shares, the binding constraint, the planned loss and the position value.

Hints:

1. Risk per share changes. Recompute it first.
2. Then redo the raw, cash and concentration caps, in that order.
3. State which cap binds, and why.

**Answer:**

- Risk per share: 504 - 492 = Rs 12.
- Raw shares: floor(500 / 12) = floor(41.7) = 41.
- Cash cap: floor(50,000 / 504) = 99. This does not change.
- Concentration cap: floor(12,500 / 504) = floor(24.8) = 24. This does not change.
- Shares: minimum of 41, 99 and 24 = **24**.
- Binding constraint: the **concentration cap**. It is the smallest limit.
- Planned loss: 24 x 12 = Rs 288.
- Position value: 24 x 504 = Rs 12,096, which is 24.2% of capital.

A closer stop gives a bigger raw figure. The concentration cap still sets the size at 24 shares.

### Independent exercise

**Task.** The open is Rs 495. The day's low is Rs 488. The stop is Rs 490. At what price does the stop fill, and why?

<details><summary>Check your answer</summary>

The stop fills at Rs 490.

The open is Rs 495, which is above the stop. There is no gap through the stop at the open. The day's low is Rs 488, which is below the stop. So the low crosses the stop during the day. In this model, the fill is at the stop price, Rs 490.

Real fills can be worse than this model. See the limits below. How a stop order fills depends on the market on that day and on the order type you use. Read Zerodha's support pages on order types, and the NSE price band pages, before you assume any fill price.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks same-bar fills, gap fills, cost placement, repeatable results and a spot-the-mistake on entry timing.

## Paper task

Mode: **learning note**. Use Lab 4 for a practice run. If the lab is not ready, do the task on paper or in a spreadsheet.

1. Make a made-up 20-day price series. Include one day that opens below your stop.
2. Make the same series rise, so a trailing stop moves up and then exits on a later day.
3. Before you run anything, write the expected planned loss, the expected fill on the gap day, and the expected P&L before costs.
4. Run the series in Lab 4, or work it out on paper or in a spreadsheet.
5. Compare the result with your expected figures. Write down each difference and its cause.
6. Log the note in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- The realism contract is a minimum standard. It is not a promise that live fills will match the backtest.
- The gap rule fills at the open. Real fills can be worse than the open, even when the low only crosses the stop.
- The costs in this chapter are not calculated here. A backtest that leaves them out shows a result too high for a real trader.
- A backtest that follows every rule can still be wrong about the future. Look-ahead, survivorship and overfitting are covered in the next chapters (*Look-ahead bias*, *Survivorship bias*, *Overfitting and the number of things you tried*).

## Remember

- A signal uses the close of day t. The order fills at the open of day t+1.
- A fill at the signal's own close is not realistic.
- A stop that gaps below the open fills at the open, not at the stop price.
- Costs enter every fill. The net P&L is the result after costs.
- Every backtest result is hypothetical, and it is not a live result.

## Sources and verification

- NSE price band pages. Price bands can stop a share from trading beyond a set move in a day, which can change a fill. This book states no band.
- Zerodha charges page (zerodha.com/charges), for the cost settings. The rates are not restated in this chapter, because they change.

<!-- standing-disclaimer -->
