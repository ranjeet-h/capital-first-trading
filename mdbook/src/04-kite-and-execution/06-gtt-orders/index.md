<!-- meta
id: T4.6
title: GTT orders and their limits
page_type: Kite walkthrough
prerequisites: [T4.4, T4.5]
labs: [Lab 1]
estimated_minutes: 20
-->

# GTT orders and their limits

## Hook

You buy 100 shares at Rs 250. You set a GTT to sell at Rs 240, and then you forget it. Months later you sell the shares in another way. The old GTT is still waiting. A forgotten GTT is a hidden risk. It keeps waiting, and it can act when the price reaches its trigger.

## The idea

GTT stands for good till triggered. A GTT stores an order that waits for a trigger price. When the price reaches the trigger, Kite places the stored order on the exchange. The stored order is a limit order or a market order. A market order carries price protection (see *Order types*).

A GTT lasts up to one year. The form has no field where you choose the end date. Zerodha sets the period, and you can have only a limited number of active GTTs at one time. Zerodha can change that limit, so check the Zerodha support pages. A GTT fires only once. You do not need the cash or the shares in place when you create it. Kite checks your funds and holdings when the trigger is hit.

A GTT is available for CNC, NRML and MTF orders.

A GTT is not a guaranteed fill. Once the trigger is reached, the stored order follows the rules of its type. The gap and limit rules from *Order types* still apply.

The quantity in a GTT must match your holding. A GTT that asks to sell more shares than you hold is a mistake. Check the quantity every time.

Check every GTT after each trade. Check it after each *Corporate actions* event, such as bonus shares or a split, because these change share counts and prices. Check it again after any change in your holdings. Some corporate actions can disable a GTT, and a large one can cancel it. If that happens, you must place a fresh GTT.

**Where to find GTTs.** Go to Orders, then the GTT tab. There you can view, change or cancel them.

**How to create one (web).** Go to Marketwatch, Holdings or Positions. Hover over the instrument and click More (the three dots). Choose Create GTT. On the phone app, tap the instrument, tap Create GTT, enter the details and slide the Create GTT button.

**The form (web).** Look for these fields in your app:

- Buy or Sell, at the top left.
- Single or OCO, at the top right.
- Trigger price. For Single, one trigger price. For OCO, two: a stoploss trigger and a target trigger.
- Quantity.
- Limit or Market. If you choose Limit, enter the limit price. For a sell GTT, set the limit below the trigger, or use Market, to help the order fill.
- Trailing (in the Stoploss part). A tick box and a trailing point value. This is on the web only, from June 2026.
- Place.

The form has no expiry field.

**Types.**

- **Single:** one trigger. It can start a buy or end a holding.
- **OCO (one cancels the other):** a stoploss and a target. When one triggers, its order is placed and the other is cancelled. Sell OCO works for shares and F&O. Buy OCO is for F&O only.
- **Trailing stoploss:** the trigger moves up with the price by the amount you set. For shares, it works on sell orders only.

**Statuses.** Kite uses seven statuses: Active, Triggered, Disabled, Expired, Cancelled, Rejected and Deleted. Your app may show them with different capital letters or colours. Look for them on your own screen.

- **Disabled:** needs your action. For example, a bonus or a split can disable it. So can a trigger set too close to the current price (within 0.25 percent when placed).
- **Cancelled or Rejected:** Kite stopped it. For example, the stock was delisted or suspended, or a large corporate action took place.
- **Expired:** one year passed without a trigger, or the futures or options contract ended.
- **Deleted:** you deleted it.

If a GTT is disabled or expired, you must place a fresh one.

**Trigger hours.** A GTT can trigger only while trading continues. The cut-off times differ: F&O stocks until 3:15 PM, other stocks until 3:30 PM, and F&O contracts until 3:40 PM. Zerodha can change these times. Check the Zerodha support pages before you rely on them.

## Worked example

**Hypothetical.** You bought 100 shares at Rs 250 (CNC). Your GTT has a trigger at Rs 240 and sells 100 shares.

| Item | Calculation | Result |
|---|---|---|
| Holding | Given | 100 shares |
| Loss per share | 250 - 240 | Rs 10 |
| Planned loss if it fills at the trigger | 100 x 10 | **Rs 1,000** |

A fill at the trigger is not guaranteed. A fill below the trigger can cost more than the planned Rs 1,000.

If the GTT is disabled, cancelled or expires before your review date, the position has no stop after that date. This is an illustration only.

## See it

<!-- component: kite-flow | flow: create-a-gtt | platform: web | caption: The click path for a GTT, from the trigger to the status list. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

Look at the trigger price, the quantity and the Buy or Sell choice on the form. Notice that the form has no expiry field. Then open Orders, then GTT, and look at the list. Compare the quantity of any GTT there with your holding. A mismatch is a warning sign.

## Try it

### Guided exercise

**Task.** You hold 100 shares bought at Rs 250. Plan a GTT with a trigger at Rs 240. Then compare the planned loss with a trigger at Rs 245.

Hints:

1. Loss = (entry - trigger) x quantity.
2. Check the quantity against your holding.
3. Write your review date.

**Answer:**

- Trigger Rs 240: 100 x (250 - 240) = 100 x 10 = **Rs 1,000**.
- Trigger Rs 245: 100 x (250 - 245) = 100 x 5 = **Rs 500**.
- Quantity: 100, the same as your holding.
- Review date: write one date in your journal.

### Independent exercise

**Task.** Hypothetical. You hold 200 shares bought at Rs 400. Write a GTT plan with the trigger, the quantity, the planned loss, an expiry check date and a weekly review step.

<details><summary>Check your answer</summary>

Sample answer:

- Trigger: Rs 380 (one example).
- Quantity: 200, the same as your holding.
- Planned loss: 200 x (400 - 380) = 200 x 20 = **Rs 4,000**.
- Expiry check date: the date one year after you create the GTT.
- Weekly review step: check the GTT status and its quantity against your holdings.

Check the planned loss against your risk budget before you save the GTT. All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the planned loss of a GTT, the quantity rule, and the limits of a GTT.

## Paper task

Mode: **paper** for the written work. Use `kite_demo` only to read the GTT form. Log it in your journal (or on paper until the journal app is ready).

1. Write the GTT trigger and limit on paper only.
2. In the Kite demo, find the GTT form and note the fields. Note any warning the screen gives. Check that the form has no expiry field.
3. Write one sentence on the quantity check: how did you confirm it matched the holding?

## Limits and common mistakes

- A GTT is not a risk limit. It does not replace your plan.
- A GTT is not a guaranteed exit. A gap can move the fill away from the trigger (*Gaps and what they mean for stops*).
- A GTT can be forgotten. Put a review date in your journal for each GTT you create.
- A GTT that is larger than your holding is a mistake. Fix the quantity before you rely on it.
- After you sell shares in another way, check for any GTT on the same stock and cancel it if it is no longer part of your plan.
- Selling delivery shares needs CDSL TPIN authorisation, unless you have a DDPI or POA. Without it, a GTT sell can fail when it triggers (see *Order book*).

## Remember

- A GTT waits for a trigger price, then places the stored order.
- A GTT lasts up to one year, and you can have a limited number of active GTTs.
- A GTT is not a guaranteed fill. The gap and limit rules still apply.
- The quantity must match your holding.
- Check every GTT after each trade and after each corporate action.

## Sources and verification

- Zerodha support articles on GTT: what it is, disabled, cancelled and expired GTTs, and why a GTT did not execute. Zerodha changes these limits, so confirm them there.
- NSE India corporate action notices for the stock

<!-- facts-needed: GTT validity period; number of GTTs allowed; products allowed for a GTT; trigger-range rules; how Kite handles GTTs on corporate actions; field labels on the GTT form. -->

<!-- standing-disclaimer -->
