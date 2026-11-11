<!-- meta
id: T4.7
title: Order book
page_type: Kite walkthrough
prerequisites: [T4.4, T4.5, T1.3]
labs: [Lab 2, Lab 3]
estimated_minutes: 20
-->

# Order book

## Hook

You place an order to buy 10 shares. The screen shows 6 shares done, and you think the order is finished. So you place the order again. Your first order still has 4 shares open, and the second order may now buy up to 10 more. You may end up with more shares than your plan allowed. Kite shows one order in several views. Reading the views together stops this mistake.

## The idea

Kite shows an order in several places. Each place shows one part of the story.

**Order book.** A list of each instruction you gave, with its status. Status labels such as open, executed, rejected or cancelled are [VERIFY: Kite status labels].

**Trade book.** A list of each execution, also called a fill. Each row shows a quantity and a price.

**Holdings.** The shares in your demat account after settlement. See *Demat accounts and settlement*. When shares first show here is [VERIFY: Kite display timing after settlement].

**Positions.** Trades that are still open for the day or carried forward. Which trades show here depends on the product type. [VERIFY: how Kite lists positions]

**Cost preview.** The estimated charges shown before you submit an order. The final charges appear somewhere else. Where Kite shows the final charge statement is [VERIFY: Kite final charge statement].

Partly filled means some shares are done and some are still pending. A partly filled order is not finished. Do not treat it as complete.

Reconciliation means checking that the views agree with each other. The order quantity equals the sum of the fills. That sum equals the change in holdings or positions. If the numbers do not agree, stop and find out why before you act.

## Worked example

**Hypothetical.** You place a buy order for 10 shares with a limit at Rs 250 (CNC). Two fills happen.

| Fill | Quantity | Price | Value |
|---|---|---|---|
| 1 | 6 | Rs 249.80 | 6 x 249.80 = Rs 1,498.80 |
| 2 | 4 | Rs 250.00 | 4 x 250.00 = Rs 1,000.00 |
| **Total** | **10** | | **Rs 2,498.80** |

The trade book shows two rows. Together they total 10 shares.

Average price = total value divided by total quantity = 2,498.80 divided by 10 = **Rs 249.88**.

## See it

<!-- component: kite-illustration | screen: one-order-four-views | views: order-book, trade-book, holdings, positions | caption: One order traced across the order book, trade book, holdings and positions, with quantities and prices highlighted. Illustration, check your own Kite for the current layout -->

Trace this one order from the order book to the trade book, then to holdings and positions. Watch which numbers match across the views. Look for the quantity that is still pending.

## Try it

### Guided exercise

**Task.** Reconcile the worked example above. Find the total quantity, the total value and the average price.

Hints:

1. Add the fill quantities.
2. Multiply each fill by its price.
3. Divide the total value by the total quantity.

**Answer:**

- Total quantity: 6 + 4 = **10 shares**.
- Total value: Rs 1,498.80 + Rs 1,000.00 = Rs 2,498.80.
- Average price: Rs 2,498.80 / 10 = **Rs 249.88**.

### Independent exercise

**Task.** Hypothetical. You place an order for 20 shares. 15 shares fill at Rs 402. The other 5 are still pending. Compute the value filled and the average price. Then write what each view should show at this moment.

<details><summary>Check your answer</summary>

- Value filled: 15 x 402 = **Rs 6,030**.
- Average price: 6,030 / 15 = **Rs 402.00**.
- Order book: partly filled, with 5 shares still pending. The status label is [VERIFY: Kite status label].
- Trade book: fills totalling 15 shares.
- Holdings or positions: no more than 15 shares, because only 15 have filled. The display timing is [VERIFY: Kite display timing].
- Cost preview: an estimate. It is not a final charge.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks fill arithmetic, what each view shows, and why a partly filled order is not finished.

## Paper task

Mode: **kite demo**. Log it in your journal (or on paper until the journal app is ready).

1. Write the limit price for one small order on paper first.
2. Place the order in the demo.
3. Record how it appears in the order book, the trade book, holdings and positions.
4. Record the cost preview before you submit.
5. Compare the preview with the final figure, if the demo shows one [VERIFY: where the demo shows final charges].
6. Write one line: did the four views agree?

## Limits and common mistakes

- A partly filled order is not finished. Check the order book before you act again.
- Do not average down on a pending order. Buying more of a falling holding to lower your average price is a mistake (*Why scalping, option buying and martingale are dangerous*).
- The cost preview is an estimate. Do not use it as your final cost.
- Demo data is dummy data. A demo fill cannot show how a live fill would look.

## Remember

- The order book shows each instruction and its status.
- The trade book shows each fill, with its quantity and price.
- Holdings are shares after settlement. Positions depend on the product type.
- A partly filled order is still open. Check the pending quantity.
- Reconcile the views. If the numbers differ, find out why before you act.

## Sources and verification

- Zerodha support pages on order status, trade book and holdings [VERIFY: page titles]
- Zerodha charges page [VERIFY: page title]

<!-- facts-needed: Kite order status labels; display timing of holdings after settlement; how Kite lists positions; cost preview accuracy; where the final charge statement is shown; contract note availability. -->

<!-- standing-disclaimer -->
