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

**CNC (delivery).** You buy shares, and they move into your demat account after settlement. A CNC holding can stay overnight, for weeks or longer. [VERIFY: Kite rules for CNC holdings]

**MIS (intraday).** The position is meant to close within the same trading day. Brokers have auto square-off rules. These rules can close an open MIS position without any action from you. The timing and the rules are [VERIFY: Zerodha support and exchange circulars on auto square-off].

**Margin and leverage.** MIS uses margin. Margin lets you control more shares than your cash alone would buy. That is leverage. See *Leverage and margin*. This book explains MIS as theory only. It does not teach MIS practice.

**Charges.** The product type can change the charges. [VERIFY: Kite cost preview for CNC and MIS]. Check the preview for the product you chose. Do not assume one product is cheaper.

**Why this book uses CNC.** The method in this book looks at prices at the end of each day. It holds trades for days or weeks. That style uses CNC. Intraday trading is a higher-risk style. It is not a shortcut to more money.

## Worked example

**Hypothetical.** You buy 10 shares at Rs 250.

| Step | Calculation | Result |
|---|---|---|
| Order value | 10 x 250 | Rs 2,500 before charges |
| Adverse move | 1% of Rs 2,500 | Rs 25 before charges |

An adverse move means the price moves against you. A 1% fall on the order costs Rs 25 before charges.

- **CNC:** the holding can continue overnight.
- **MIS:** the position is meant to close the same day. If it stays open, the broker's auto square-off rule applies [VERIFY: auto square-off timing and rules].

## See it

<!-- component: kite-illustration | screen: order-preview | selector: product | selected: CNC | caption: Recreated order preview with a product selector beside a list of consequences. Illustration, check your own Kite for the current layout. Verified: [VERIFY: date checked] -->

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
- Consequence: the position is meant to close the same day, and the auto square-off rule may apply [VERIFY: auto square-off rules].
- Catch: before you submit, compare the product field with the holding period written in the plan.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks how the product type follows the holding period, and why this book uses CNC.

## Paper task

Mode: **kite demo**. Log it in your journal (or on paper until the journal app is ready).

1. Open the demo order window and find the product selector.
2. List the product options you see, and note which one is the default [VERIFY: default product in the demo].
3. Write the default in your journal, with today's date.
4. Write one sentence: which product would you choose for a three-week plan, and why.
5. Do not submit any order for this task.

## Limits and common mistakes

- A product type does not make a trade safer. It only sets how long the trade is meant to last.
- MIS rules can close an open position for you. The timing and the rules can change. Check them [VERIFY: auto square-off rules].
- CNC does not remove risk. A holding for weeks can still fall. Set a stop (*Risk per trade and stop-loss distance*).
- Margin in MIS is leverage. This book covers it as theory only, and you should not use margin to size a position in this book.

## Remember

- The product type sets how long the trade is meant to last.
- CNC fits a holding that stays overnight.
- MIS is meant to close the same day, and its auto square-off rules can close it for you.
- Check the product field against your plan before you submit.
- Do not pick a product because you think it costs less. Check the cost preview.

## Sources and verification

- Zerodha support pages on product types [VERIFY: page titles]
- SEBI and NSE circulars on margin and intraday auto square-off [VERIFY: circular titles]

<!-- facts-needed: MIS auto square-off timing and rules; product availability by stock; intraday margin rules; CNC and MIS charges; default product shown in the Kite demo order window. -->

<!-- standing-disclaimer -->
