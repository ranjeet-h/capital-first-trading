<!-- meta
id: T4.8
title: Common execution mistakes
page_type: Kite walkthrough
prerequisites: [T4.4, T4.5, T4.6, T4.7]
labs: [Lab 1, Lab 3]
estimated_minutes: 20
-->

# Common execution mistakes

## Hook

You plan to buy 10 shares at Rs 250, which is Rs 2,500. You type 100 instead. The order value is Rs 25,000. On a Rs 50,000 account, that is half your capital in one trade. The mistake took one extra zero. This chapter shows the common order mistakes and how to catch them before you submit.

## The idea

Most order mistakes fall into a few families.

1. **Wrong product.** The product type does not match your plan. See *Product types*.
2. **A stop that never triggers.** The stop is placed, but it cannot act.
3. **A price typing error.** This is also called a fat-finger error. It is a typing mistake, such as an extra zero or a misplaced decimal point.
4. **Wrong quantity.** The number of shares does not match your plan.
5. **Wrong order type or validity.** For example, SL-M is blocked on BSE stocks. A stop set for the Day validity ends at the end of the session, so it is gone the next morning. An AMO placed after hours stays as AMO REQ RECEIVED until it reaches the exchange, so it is not yet a live order.
6. **A fill far from the price you saw.** A market order can fill well away from the last price, especially in a fast move.

A stop can fail to act for four common reasons:

- **Wrong side.** A sell stop was placed as a buy stop, or the reverse.
- **Trigger never reached.** The trigger is set where the price does not go.
- **Order inactive or cancelled.** The stop is no longer live.
- **GTT not active or expired.** A stop kept as a GTT has stopped working. See *GTT orders and their limits*.

On the web, Kite sends an order when you click Buy or Sell, or press Enter. Zerodha's manual describes no extra "are you sure?" step. Kite does reject some orders and shows a message. Examples:

- A quantity above the freeze limit gets a nudge. Kite then splits the order into slices. The nudge asks you to check the quantity. It is a warning, not a block.
- An order outside the day's circuit band is rejected by Kite's own risk check.
- An order without enough margin is rejected. The message reads like "Insufficient funds. Required margin is Rs X but available margin is Rs Y".

Read these messages. Do not rely on them to catch your own typing errors.

A checklist written before the session is better than a fix made during it. Write the checklist when you are calm, and use it every time.

After a mistake, reduce your exposure by your rules. Do not add shares to fix it. Adding to a losing position is covered in *Why scalping, option buying and martingale are dangerous*.

## Worked example

**Hypothetical.** Your plan is 10 shares at Rs 250. You type 100 by mistake. The stop is Rs 10 below the entry, at Rs 240.

| Item | Intended | Typed |
|---|---|---|
| Shares | 10 | 100 |
| Price | Rs 250 | Rs 250 |
| Order value | 10 x 250 = Rs 2,500 | 100 x 250 = Rs 25,000 |
| Planned loss at Rs 240 | 10 x 10 = Rs 100 | 100 x 10 = Rs 1,000 |

- The typed order is ten times the intended size.
- On a Rs 50,000 account, Rs 25,000 is half of your capital in one trade.
- The planned loss on 100 shares is Rs 1,000. That is 2% of Rs 50,000 (1,000 / 50,000 = 2%).
- Your risk budget at 1% of Rs 50,000 is Rs 500. The typed loss is twice that budget.

## See it

<!-- component: order-preview-check | set: order-previews | caption: Three recreated order previews, each with one error. Find the error and state the correction. Illustration, check your own Kite for the current layout -->

Compare each preview with its plan. Find the one error in each. Write the correction before you open the answer.

## Try it

### Guided exercise

**Task.** Three orders are described below. Each one has one error. Find the error and state the correction. Check side, product, quantity and price against the plan.

1. **Plan:** a sell stop for 100 shares you hold, with a trigger at Rs 240. **Entered:** a buy stop for 100 shares, with a trigger at Rs 240.
2. **Plan:** buy 25 shares at Rs 300. **Entered:** buy 250 shares at Rs 300.
3. **Plan:** CNC, because you will hold for three weeks. **Entered:** MIS.

Hints:

1. A stop for a holding is a sell order.
2. Count the digits of the quantity against the plan.
3. The product follows the holding period.

**Answer:**

1. **Wrong side.** The stop must be a sell stop. Correction: change the side to sell.
2. **Wrong quantity.** The order is ten times the plan. Correction: 25 shares.
3. **Wrong product.** The holding is for three weeks, so the product is CNC. Correction: change the product to CNC.

### Independent exercise

**Task.** Write your own eight-item pre-submission checklist. Then test it against three errors you were not shown.

<details><summary>Check your answer</summary>

A sample checklist:

1. Side (buy or sell) matches the plan.
2. Product matches the holding period in the plan.
3. Quantity matches the plan, and the digit count is right.
4. Price matches the plan, with no typing error.
5. Order type (limit, market, SL or SL-M) matches the plan, and the validity is right.
6. A stop trigger sits on the correct side of the entry price for the holding.
7. A stop quantity equals the number of shares you hold.
8. Any GTT on the same stock is checked and has a review date.

All examples are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the cost of a typing error, the rules for stops that never trigger, and the check before submitting.

## Paper task

Mode: **paper**. Log it in your journal (or on paper until the journal app is ready).

1. Write one hypothetical plan on paper, with a quantity and a price.
2. Write the wrong order on paper, with the wrong quantity. Do not place it.
3. Note where you would catch the error: before you clicked Buy or Sell, or not at all.
4. Log the mistake in your journal with a rule-break tag.

## Limits and common mistakes

- The book cannot check your practice. Your reflection is your own record.
- A checklist reduces errors. It does not remove them. Keep it current.
- Kite's messages are not a safety net. They may not catch a wrong quantity or a wrong side. Check the order yourself before you click Buy or Sell.
- A wrong quantity on a stop also changes the planned loss. Check the stop as well as the entry order.
- An order set to Day validity ends at the end of the session. Check the validity before you rely on an order over several days.

## Remember

- Most order mistakes are wrong product, a stop that never triggers, a typing error, a wrong quantity, or a wrong order type or validity.
- A stop can fail to act when it is on the wrong side or cancelled, or when its trigger is never reached.
- Ten times the intended size can turn a small plan into half of your capital.
- Check side, product, quantity, price and validity against the written plan before you submit.
- After a mistake, reduce exposure by your rules. Do not add to the position.

## Sources and verification

- Zerodha support pages on order rejections and Kite error messages. Check the current wording there.
- NSE India, trading rules and price band notices. Search the NSE website for the current circulars.

<!-- facts-needed: Kite order confirmation and price-range messages; exchange price-band and order rejection rules; the exact wording of Kite error messages. -->

<!-- standing-disclaimer -->
