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

GTT stands for good till triggered. A GTT stores an order that waits for a trigger price. When the price reaches the trigger, the stored order is placed.

The order type and the product of the stored order are [VERIFY: Kite GTT form]. Read the form before you save it.

A GTT stays active for a set period, and you can hold only a limited number of them. The period and the number are [VERIFY: Zerodha GTT help]. Check the status on your own screen. Do not rely on memory.

A GTT is not a guaranteed fill. Once the trigger is reached, the stored order follows the rules of its type. The gap and limit rules from *Order types* still apply.

The quantity in a GTT must match your holding. A GTT that asks to sell more shares than you hold is a mistake. Check the quantity every time.

Check every GTT after each trade. Check it after each *Corporate actions* event, such as bonus shares or a split, because these change share counts and prices. Check it again after any change in your holdings. How Kite handles GTTs during corporate actions is [VERIFY: Kite handling of GTTs on corporate actions].

## Worked example

**Hypothetical.** You bought 100 shares at Rs 250 (CNC). Your GTT has a trigger at Rs 240 and sells 100 shares.

| Item | Calculation | Result |
|---|---|---|
| Holding | Given | 100 shares |
| Loss per share | 250 - 240 | Rs 10 |
| Planned loss if it fills at the trigger | 100 x 10 | **Rs 1,000** |

A fill at the trigger is not guaranteed. A fill below the trigger can cost more than the planned Rs 1,000.

If the GTT's validity ends before your review date, the position has no stop after that date. This is an illustration only.

## See it

<!-- component: kite-illustration | screen: gtt-form-and-status | fields: trigger, quantity, expiry | caption: Recreated GTT form and GTT status list with the trigger, quantity and expiry fields annotated. Illustration, check your own Kite for the current layout. Field labels: [VERIFY: field labels in your own Kite] -->

Look at the trigger, quantity and expiry fields on the form. Then open the status list and find the GTT you just made. Compare its quantity with your holding. A mismatch is a warning sign.

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
- Expiry check date: write the date from the GTT help [VERIFY: validity period].
- Weekly review step: check the GTT status and its quantity against your holdings.

Check the planned loss against your risk budget before you save the GTT. All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the planned loss of a GTT, the quantity rule, and the limits of a GTT.

## Paper task

Mode: **kite demo**. Log it in your journal (or on paper until the journal app is ready).

1. Open the GTT screen in the demo and create one GTT with a trigger you write on paper first.
2. Note the fields you filled in, the validity shown, and any warning the screen gave [VERIFY: field labels and validity text].
3. Cancel the GTT.
4. Write one sentence on the quantity check: how did you confirm it matched the holding?

## Limits and common mistakes

- A GTT is not a risk limit. It does not replace your plan.
- A GTT is not a guaranteed exit. A gap can move the fill away from the trigger (*Gaps and what they mean for stops*).
- A GTT can be forgotten. Put a review date in your journal for each GTT you create.
- A GTT that is larger than your holding is a mistake. Fix the quantity before you rely on it.
- After you sell shares in another way, check for any GTT on the same stock and cancel it if it is no longer part of your plan.

## Remember

- A GTT waits for a trigger price, then places the stored order.
- Its validity and number are limited. Check them [VERIFY: Zerodha GTT help].
- A GTT is not a guaranteed fill. The gap and limit rules still apply.
- The quantity must match your holding.
- Check every GTT after each trade and after each corporate action.

## Sources and verification

- Zerodha support, GTT help articles [VERIFY: page titles]
- NSE India, corporate action notices [VERIFY: notice names]

<!-- facts-needed: GTT validity period; number of GTTs allowed; products allowed for a GTT; trigger-range rules; how Kite handles GTTs on corporate actions; field labels on the GTT form. -->

<!-- standing-disclaimer -->
