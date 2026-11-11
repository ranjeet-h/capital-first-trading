<!-- meta
id: T6.6
title: Strategy simulator
page_type: Strategy
prerequisites: [T6.4, T6.2, T4.4]
labs: [Lab 4]
estimated_minutes: 25
-->

# Strategy simulator

## Hook

A trader sets a stop at Rs 247. She expects to sell at Rs 247 if the price falls that far. The next morning, the stock opens at Rs 240, because of news overnight. Hypothetical example. She does not sell at Rs 247. The first price available is near Rs 240. Her loss is larger than the plan allowed. A simulator shows this step by step, so you can see the fill before you trade with real money.

## The idea

A strategy simulator runs a set of rules over a price history, one bar at a time. A bar is one period of prices, such as one day. The simulator writes down what each rule says at each bar. It then shows the trade it would have made.

A simulator run follows the rules you wrote. It is not a record of real trading. The data can be real or synthetic. Synthetic data is made up for learning. Any total on screen is for learning, and it carries a hypothetical label.

The simulator follows four realism rules:

- **The decision is made at the close of day t.** The rules read the close of the bar that just ended.
- **The fill is at the open of day t plus 1.** The trade is filled at the next day's opening price. You cannot trade at a price that has already passed. See *Look-ahead bias*.
- **The trailing stop updates at the close and applies from the next bar.** A stop does not change in the middle of a bar.
- **A gap through a stop fills near the open, not at the stop price.** If the bar opens below the stop, the exit is at the open. See *Gaps and what they mean for stops*. Circuit limits can also affect the fill. NSE puts a daily price band of 2%, 5%, 10% or 20% on most shares, measured from the previous close. If a share is locked at its lower band, there may be no buyers, and an exit may not be possible. Shares with futures and options use a flexible 10% range instead. (As of 11 Nov 2026, NSE Basic FAQs on the Secondary Market and SEBI's master circular on trading. Rules change, so check the NSE site.)

The step log is the main teaching tool. Each row is one bar. It shows the bar's prices, the result of each rule and the action taken. Reading the log is more useful than reading the final total.

## See it

<!-- component: strategy-simulator | mode: step | controls: play, pause, step, reset | caption: Step through the swing example bar by bar, with a step log showing each bar's values and the action taken -->

Press Step to move one bar. Read the decision on the close of the bar. Then press Step again and check the fill on the next bar's open. Use Reset to start again. The step log shows each bar in a row. Check that every entry uses the next open, not the signal close.

## Worked example

**Hypothetical.** The signal is at the close of day t. The close is Rs 255. The setup rules are met.

| Day | Prices | Rule result | Action |
|---|---|---|---|
| Day t | Close Rs 255 | Setup met | Plan an entry at the next open |
| Day t plus 1 | Open Rs 257 | Entry check passed | Buy 48 shares at Rs 257. Set the initial stop at Rs 247. |
| Day t plus 2 | Open Rs 240 | Open is below the stop of Rs 247 | Exit at about Rs 240 |

**The entry fill.** The entry is Rs 257, not Rs 255. The difference is Rs 2 per share. With 48 shares, the difference is 2 x 48 = Rs 96.

**The stopped trade.** The planned loss is 48 x (257 - 247) = 48 x Rs 10 = Rs 480. The actual loss is (257 - 240) x 48 = Rs 17 x 48 = **Rs 816**. The ratio of actual loss to planned loss is 816 / 480 = **1.7**.

The stop was at Rs 247, but the price was already at Rs 240 when the bar opened. The fill is at the open. The loss is larger than planned.

## Try it

### Guided exercise

**Task.** Use the same signal as the worked example. The day t plus 2 bar opens at Rs 250, not Rs 240. During that day, price trades down to Rs 246. The stop is Rs 247 and the position is 48 shares. Find the exit price and the actual loss.

Hints:

1. Is the open below the stop? Compare Rs 250 with Rs 247.
2. Did the bar trade below the stop during the day? Compare Rs 246 with Rs 247.
3. If the open is above the stop, the exit is at the stop price.

**Answer:**

- The open of Rs 250 is above the stop of Rs 247, so the open does not trigger an exit at the open.
- The bar trades down to Rs 246, which is below Rs 247. The exit is at the stop, **Rs 247**.
- Actual loss: (257 - 247) x 48 = 10 x 48 = **Rs 480**. This equals the planned loss.

<!-- component: strategy-simulator | mode: step | scenario: guided | caption: Change the day t plus 2 open and low yourself and see where the exit happens and what the loss is. -->

### Independent exercise

**Task.** Make your own three-bar example with these inputs. Signal close Rs 200 on day t. The entry is the next day's open of Rs 202. ATR(14) is Rs 2.00. Capital is Rs 50,000. Risk is 1 percent of capital. The concentration cap is 25 percent. The following day opens at Rs 193. Write the step log. Find the shares, the planned loss, the exit price, the actual loss, and the ratio of actual loss to planned loss.

<details><summary>Check your answer</summary>

- Initial stop: 202 - (2.5 x 2.00) = 202 - 5 = **Rs 197**.
- Risk per share: Rs 5. Risk budget: Rs 500.
- Raw shares: floor(500 / 5) = 100.
- Cash cap: floor(50,000 / 202) = 247.
- Concentration cap: floor(12,500 / 202) = 61.
- Shares: minimum of 100, 247 and 61 = **61**.
- Planned loss: 61 x Rs 5 = **Rs 305**.
- The open of Rs 193 is below the stop of Rs 197, so the exit is at the open, **Rs 193**.
- Actual loss: (202 - 193) x 61 = 9 x 61 = **Rs 549**.
- Ratio: 549 / 305 = **1.8**.
- Check: 61 x 202 = Rs 12,322, which is below Rs 12,500.

All figures are hypothetical and made up for learning.

</details>

<!-- component: strategy-simulator | mode: rules | scenario: practice | caption: See the share sizing and the gap exit for the independent exercise, then change the open to test your own numbers. -->

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the fill timing, the gap through a stop, and the rules for updating the trailing stop.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Choose a simple made-up three-bar price list. Label it synthetic.
2. Run the rules from *The idea* on that list, bar by bar. Write one row per bar in a step log.
3. Mark each decision as made on a close or filled on an open.
4. If a stop is hit, write the planned loss and the actual loss.
5. Label the whole log hypothetical. Do not state a profit or a result.

## Limits and common mistakes

- A simulator result is a set of rules applied to data. It is not the strategy's performance.
- Synthetic data does not show how real prices move. Real gaps and circuit limits can be harder.
- The fill rules are assumptions. Real fills depend on the market at that moment, and on price bands.
- A simulator makes it simple to try many settings. Trying many settings can fit the past without showing an edge. See *Overfitting and the number of things you tried*.
- Costs are not in the examples above. The real charges, with dates and sources, are in *Costs on a trade*. As of 11 Nov 2026, Zerodha lists zero brokerage on delivery trades. Rules change, so check the Zerodha charges page.

## Remember

- The decision is made at the close. The fill is at the next open.
- The trailing stop updates at the close and applies from the next bar.
- A gap through a stop fills near the open, not at the stop price.
- The step log shows the reason for each action. Read it row by row.
- Every simulator result is hypothetical.

## Sources and verification

- The realism rules in *Backtesting basics and the realism contract*.
- *Gaps and what they mean for stops*, for gap fills.
- NSE Basic FAQs on the Secondary Market (price bands) and Zerodha charges page, read on 11 Nov 2026.

<!-- standing-disclaimer -->
