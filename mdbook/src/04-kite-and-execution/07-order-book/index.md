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

**Order book.** A list of each instruction you gave, with its status. On the web, the end statuses are OPEN, COMPLETE, REJECTED and CANCELLED. Interim statuses include TRIGGER PENDING and AMO REQ RECEIVED. "Executed" is the name of a phone tab, not a status.

**Where to find these.** On the web, the Orders page has tabs such as Orders, GTT, Baskets, SIPs and Alerts. On the phone app, the Orders area has Open, Executed and GTT tabs, and you swipe to change them. Look for the exact names in your own app.

**Rejected orders.** When Kite rejects an order, it gives a reason. On the web, look for Info in the order's options menu.

**Baskets.** A basket is a group of orders placed together. A basket can hold up to 20 orders, and you can have up to 50 baskets. Execute places the orders in the order they are listed. That order changes the margin needed, not the final amount blocked.

**Trade book.** A list of each execution, also called a fill. Each row shows a quantity and a price. Look for a trades view in your own app. Its name on the web can differ from one screen to the next.

**Holdings.** The shares in your demat account after settlement. See *Demat accounts and settlement*. A CNC buy shows in Positions on the day you buy it. From the next trading day it shows in Holdings. Until the shares are delivered to your demat account, they show as T1 holdings.

**Positions.** Trades that are still open for the day or carried forward. A position shows the product (such as CNC, MIS or NRML), the instrument, the quantity, the average price, the last price and the profit or loss. Which trades show here depends on the product type.

**Funds.** On the web, press F to open Funds. Look for the available margin (the money you can use for new trades), the used margin (the money blocked in trades and open orders) and the available cash. The Add funds and Withdraw buttons are here too.

**Cost preview.** The estimated charges shown before you submit an order. On the web, the order window shows the margin needed and your available margin. Charges may appear between them, but Zerodha can change the layout. Final charges are in Console, in the contract note and the ledger.

**Selling delivery shares.** If you do not have a POA or DDPI, Kite asks for a CDSL TPIN authorisation before a delivery sell. A POA or DDPI is a permission that lets your broker sell from your demat account. The TPIN comes by email and SMS. You enter it with an OTP. An authorisation lasts one day. On the web, look for the Authorise button on the Holdings page.

Partly filled means some shares are done and some are still pending. A partly filled order is not finished. It stays OPEN, with the filled part shown. Do not treat it as complete.

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

<!-- component: kite-flow | flow: check-orders-trades-positions-holdings,cancel-or-modify-an-order,sell-holdings-with-tpin,funds-and-margin | platform: web | caption: Follow one order through Orders, Trades, Positions and Holdings, and learn the clicks to cancel, authorise a sale and check funds. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

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
- Order book: partly filled, with 5 shares still pending. The order stays OPEN.
- Trade book: fills totalling 15 shares.
- Holdings or positions: no more than 15 shares, because only 15 have filled. Check your app for when new shares appear.
- Cost preview: an estimate. It is not a final charge.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks fill arithmetic, what each view shows, and why a partly filled order is not finished.

## Paper task

Mode: **paper** for the written work. Use `kite_demo` only to read the screens. Log it in your journal (or on paper until the journal app is ready).

1. Write the limit price for one small order on paper first.
2. Write down what the order would show in Orders: its status, quantity and price. Do not place it.
3. Write how it would appear in the order book, the trade book, holdings and positions.
4. Write the cost preview you expect to see before you submit.
5. Compare your written preview with the final charges. The final charges for a real order are in Console.
6. Write one line: did the four views agree?

## Limits and common mistakes

- A partly filled order is not finished. Check the order book before you act again.
- Do not average down on a pending order. Buying more of a falling holding to lower your average price is a mistake (*Why scalping, option buying and martingale are dangerous*).
- The cost preview is an estimate. Do not use it as your final cost.
- Demo data is dummy data. The demo is view-only, so it has no real fills. It cannot show how a live fill would look.
- A sell of delivery shares can fail without the TPIN authorisation or a DDPI or POA. Check this before you sell.

## Remember

- The order book shows each instruction and its status.
- The trade book shows each fill, with its quantity and price.
- Holdings are shares after settlement. Positions depend on the product type.
- A partly filled order is still open. Check the pending quantity.
- Reconcile the views. If the numbers differ, find out why before you act.

## Sources and verification

- Zerodha support pages on order status, the trade book, holdings and CDSL TPIN authorisation. Check the current labels there.
- Zerodha charges page (check the current rates there)

<!-- facts-needed: Kite order status labels; display timing of holdings after settlement; how Kite lists positions; cost preview accuracy; where the final charge statement is shown; contract note availability. -->

<!-- standing-disclaimer -->
