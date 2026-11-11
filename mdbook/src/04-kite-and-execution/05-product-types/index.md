<!-- meta
id: T4.5
title: Product types
page_type: Kite walkthrough
prerequisites: [T4.4, T1.3, T2.13]
labs: [Lab 2]
estimated_minutes: 20
-->

# Product types

## Hook

Two traders buy 10 shares at Rs 250. Both plan to hold for three weeks. One of them picks the product type meant for a same-day trade. A product type is one setting on the order screen. It tells the broker how long the trade is meant to last. This chapter shows how to read that setting before you submit an order.

## The idea

A product type tells the broker how long a trade is meant to last. It also tells the broker how the trade is settled. Settlement is the step where shares and money change hands after a trade. See *Demat accounts and settlement*.

Kite names its products like this. Look for these names, or the same choices, in your own app.

**CNC (Longterm, delivery).** CNC stands for cash and carry. You pay the full price for the shares. There is no leverage, which means no borrowed money. Kite does not close a CNC holding for you. A CNC buy shows in Positions on the day you buy. From the next trading day it shows in Holdings. A CNC holding can stay overnight, for weeks or longer. If you buy and sell the same share on the same day under CNC, Zerodha treats it as an intraday trade for brokerage.

**MIS (Intraday, margin).** MIS stands for margin intraday square-off. The position is meant to close within the same trading day. It uses margin, which is borrowed money that lets you control more shares than your cash alone would buy. That is leverage. See *Leverage and margin*. This book explains MIS as theory only. It does not teach MIS practice.

**NRML (Overnight).** NRML is used for futures and options (F&O). You can hold these positions until expiry. There is no intraday leverage.

**MTF (Margin Trading Facility).** MTF is a separate product where Zerodha funds part of a share purchase. Kite lists it, but this book does not teach it.

**Cover (CO)** is an order type, not a product. It is covered in *Order types*.

On the phone app, the product is a tick box named Intraday. Tick it for MIS. Untick it for delivery (CNC).

**Auto square-off.** Zerodha closes open MIS positions at a set time, without any action from you. Kite's support page gives these times:

- Stocks in the closing auction session (CAS): 3:12 PM.
- Other equity: 3:25 PM.
- F&O: 3:26 PM.
- MCX commodities: 10 minutes before the close.

These times changed on 26 December 2025. They can change at the risk team's discretion. Zerodha charges a fee for each order it squares off. At last check it was Rs 50 plus 18% GST. Zerodha can change this, so check the Zerodha support pages before you rely on it. After the cut-off you cannot place a new MIS order. You also cannot convert a CNC or NRML position to MIS. Zerodha does not have to close your intraday position for you, so you must plan to close it yourself.

**Convert.** In Positions, open the options menu for a position and choose Convert. You can change MIS to NRML or CNC, and back. Cover orders cannot be converted. You can convert only before the auto square-off time.

**Margin and leverage.** Zerodha's support article has said that equity MIS allows up to 5 times leverage, which means 20 percent margin. The risk team can reduce or remove leverage during the day. Zerodha can change this. Check the Zerodha support pages before you rely on it.

**Charges.** The product type can change the charges. Check the cost preview for the product you chose. Do not assume one product is cheaper.

**Why this book uses CNC.** The method in this book looks at prices at the end of each day. It holds trades for days or weeks. That style uses CNC. Intraday trading is a higher-risk style. It is not a shortcut to more money.

## Worked example

**Hypothetical.** You buy 10 shares at Rs 250.

| Step | Calculation | Result |
|---|---|---|
| Order value | 10 x 250 | Rs 2,500 before charges |
| Adverse move | 1% of Rs 2,500 | Rs 25 before charges |

An adverse move means the price moves against you. A 1% fall on the order costs Rs 25 before charges.

- **CNC:** the holding can continue overnight.
- **MIS:** the position is meant to close the same day. If it stays open, Zerodha's auto square-off applies at the time shown above.

## See it

<!-- component: kite-flow | flow: convert-position-and-mis-square-off | platform: web | caption: The click path for converting a position, and what happens at the auto square-off. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

<!-- component: kite-illustration | screen: order-preview | selector: product | selected: CNC | caption: Pick a product and read what it means for how long you can hold. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

Look at the product selector and the list of consequences beside it. Change the product and see which consequences change. Note which product matches a holding that lasts for weeks.

## Try it

### Guided exercise

**Task.** Classify three planned trades. Choose a product for each one and write the reason.

- (a) Hold for weeks.
- (b) Close today.
- (c) Carry overnight if the stop is not hit.

Hints:

1. The holding period decides the product.
2. If the plan says "carry overnight", MIS is wrong.
3. Write one reason for each choice.

**Answer:**

- (a) **CNC.** The plan holds for weeks.
- (b) This is an intraday plan. The matching product is MIS. This book does not practise intraday trading, so write "not for this book" as the reason and do not plan it here.
- (c) **CNC.** The plan carries overnight, so MIS is wrong.

### Independent exercise

**Task.** Write a product-error scenario. Explain the consequence, and explain how you would catch the error before you submit.

<details><summary>Check your answer</summary>

Sample answer:

- Plan: buy 20 shares and hold them for three weeks. Product: CNC.
- Error: MIS is selected by mistake.
- Consequence: the position is meant to close the same day, and Zerodha's auto square-off may close it at the cut-off time.
- Catch: before you submit, compare the product field with the holding period written in the plan.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks how the product type follows the holding period, and why this book uses CNC.

## Paper task

Mode: **paper** for the written work. Use `kite_demo` only to read the screen. Log it in your journal (or on paper until the journal app is ready).

1. Find where the product selector sits in the Kite app flow shown above. Use the chapter's illustration if you do not open the Kite demo.
2. List the product choices you see. Note which one is selected first.
3. Write that choice in your journal, with today's date.
4. Write one sentence: which product would you choose for a three-week plan, and why.
5. Do not submit any order for this task.

## Limits and common mistakes

- A product type does not make a trade safer. It only sets how long the trade is meant to last.
- MIS rules can close an open position for you. The times above can change. Confirm them on Zerodha's support pages.
- CNC does not remove risk. A holding for weeks can still fall. Set a stop (*Risk per trade and stop-loss distance*).
- Margin in MIS is leverage. This book covers it as theory only, and you should not use margin to size a position in this book.

## Remember

- The product type sets how long the trade is meant to last.
- CNC fits a holding that stays overnight.
- MIS is meant to close the same day. Zerodha closes any MIS position still open at the auto square-off time.
- Check the product field against your plan before you submit.
- Do not pick a product because you think it costs less. Check the cost preview.

## Sources and verification

- Zerodha support articles on what CNC, MIS and NRML mean, and on intraday auto square-off timings. Zerodha changes these times and charges, so confirm them there before you rely on them.
- SEBI and NSE circulars on margin and intraday rules. Search their websites for the current circulars.

<!-- facts-needed: MIS auto square-off timing and rules; product availability by stock; intraday margin rules; CNC and MIS charges; default product shown in the Kite demo order window. -->

<!-- standing-disclaimer -->
