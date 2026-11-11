<!-- meta
id: T4.9
title: A complete demo walkthrough
page_type: Kite walkthrough
prerequisites: [T4.1, T4.2, T4.3, T4.4, T4.5, T4.6, T4.7, T4.8, T2.5, T3.3]
labs: [Lab 1, Lab 3]
estimated_minutes: 35
-->

# A complete demo walkthrough

## Hook

A trader writes her plan on paper first. The plan has the entry, the stop, the number of shares and the planned loss. Only then does she open the Kite demo to see where each field sits. The demo uses dummy data, so it cannot show whether the plan would have paid. Its value is in following the steps every time.

## The idea

This chapter is a paper walkthrough with the Kite click path. It puts the steps from the earlier order chapters together. Use the same steps for every paper walkthrough.

1. **Plan before you open Kite.** Write the setup, the entry, the stop, the number of shares, the planned loss, the product and the review date. For a holding you plan to keep for weeks, the product is CNC.
2. **Size the trade.** Use the stop distance, the risk budget and the caps. See *Position sizing step by step*.
3. **Write the stop as its own order.** The stop is a separate order from the entry. For a holding you plan to keep for weeks, use a GTT. A normal SL is valid for one trading day only. Then check the stop's side, type, trigger, limit and quantity.
4. **Check the sell rules.** Before a delivery sell, check that you have a CDSL TPIN authorisation, or a DDPI or POA. See *Order book*.
5. **Record on paper.** Write the plan and the field labels you found, then compare the two.
6. **Label the record.** Write `paper` in the journal. Never write "live".

On the phone app, a real order is sent by swiping the button, not by tapping it. In the demo, only find the button and read its label.

Three terms from the sizing steps:

- **Risk budget:** the most you accept to lose on one trade. It is your capital times your risk percent.
- **Cash cap:** the most shares your cash can buy.
- **Concentration cap:** the most shares that keep one position within a set share of your capital. See *Portfolio exposure and concentration*.

The number of shares is the smallest of the raw risk figure, the cash cap and the concentration cap. Round each down. If two limits tie, say so.

The demo's dummy data gives no real profit or loss. A demo result, of any size, does not prove that your plan works.

## Worked example

**Hypothetical.** Capital Rs 50,000. Risk 1%, so the risk budget is Rs 500. Entry Rs 250. Stop Rs 240, below a chart level. The risk per share is Rs 10.

| Step | Calculation | Result |
|---|---|---|
| Risk budget | 50,000 x 1% | Rs 500 |
| Risk per share | 250 - 240 | Rs 10 |
| Raw shares | floor(500 / 10) | 50 |
| Cash cap | floor(50,000 / 250) | 200 |
| Concentration cap | 25% of 50,000 = 12,500, then floor(12,500 / 250) | 50 |
| **Shares** | minimum of 50, 200 and 50 | **50** |

- Position value: 50 x 250 = Rs 12,500. That is exactly the 25% cap.
- Planned loss: 50 x 10 = **Rs 500**.
- Binding constraint: the risk budget and the concentration cap tie at 50 shares.
- Stop order: a GTT (Sell, Single) with a trigger at Rs 240 and a limit at Rs 238. A GTT is needed because the holding is for weeks. Write this stop order on paper.

A limit stop with the limit below the trigger may not fill in a gap. See *Order types*.

## See it

<!-- component: lab-journal | mode: kite_demo | form: plan-and-execution | caption: Plan form and execution form for one hypothetical paper walkthrough -->

<!-- component: kite-flow | flow: demo-walkthrough | caption: The five steps of the paper walkthrough, from plan to record: plan, size, find the entry fields, find the stop fields, record on paper. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

Fill in the plan form first, using the example numbers. Then find the entry and stop fields in the Kite demo and note where each one sits. Fill in the execution form on paper after the walkthrough.

## Try it

### Guided exercise

**Task.** Complete the plan form for the worked example above.

Hints:

1. Work out the risk per share first.
2. Raw shares = risk budget divided by risk per share, rounded down.
3. Check both caps before you choose the number of shares.

**Answer:**

- Risk budget: Rs 500.
- Risk per share: Rs 10.
- Raw shares: 50.
- Cash cap: 200. Concentration cap: 50.
- Shares: **50**.
- Planned loss: **Rs 500**.
- Binding constraint: a tie between the risk limit and the concentration cap, both 50 shares.
- Stop: GTT, Sell, Single, trigger Rs 240, limit Rs 238.

### Independent exercise

**Task.** Hypothetical. Entry Rs 300. Stop Rs 290. Capital Rs 50,000. Risk 1%. Compute the final number of shares, the planned loss and the binding constraint.

<details><summary>Check your answer</summary>

- Risk budget: Rs 500.
- Risk per share: 300 - 290 = Rs 10.
- Raw shares: floor(500 / 10) = 50.
- Cash cap: floor(50,000 / 300) = 166.
- Concentration cap: floor(12,500 / 300) = 41.
- Shares: minimum of 50, 166 and 41 = **41**.
- Planned loss: 41 x 10 = **Rs 410**.
- Binding constraint: **concentration cap**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the sizing steps, the planned loss, and the rule for labelling a paper record.

## Paper task

Mode: **paper** for the full cycle. Use `kite_demo` only to find the fields. Complete the full cycle for one hypothetical trade. Log it in your journal (or on paper until the journal app is ready).

1. **Plan.** Write the setup, entry, stop, shares, planned loss, product and review date.
2. **Size.** Use the sizing steps to check the number of shares.
3. **Find the entry fields.** In the Kite demo, find the entry fields on the order screen and read their labels. Do not place any order.
4. **Find the stop fields.** In the Kite demo, find the stop fields and read their labels. For this holding, the stop is a GTT. Do not set it.
5. **Record on paper.** Write what you planned and which fields you found. Compare the two. Write a short reflection. Label the record `paper`.

## Limits and common mistakes

- A paper walkthrough is practice and is not live evidence. Do not record it as live.
- The demo shows no real fill. Do not treat any number on screen as a fill.
- A stop is not a risk limit by itself. A gap can make the loss bigger than planned (*Slippage*).
- The demo is view-only. It cannot place, change or cancel an order, create a GTT or set an alert. Do the order steps on paper.
- Finishing this walkthrough is not permission to trade with real money. Live use is a separate decision, made much later, after the checks at the end of this book.

## Remember

- Plan first, then size, then find the entry and stop fields, then record on paper.
- Shares = the smallest of the raw risk figure, the cash cap and the concentration cap.
- Planned loss = shares x risk per share.
- Compare your written walkthrough with the plan, and write what differed.
- Label every walkthrough record `paper`, never "live".

## Sources and verification

- Zerodha support article on the Kite demo. The demo uses dummy data and is at kite-demo.zerodha.com/dashboard. Check the current wording there.
- The book's own sizing and journal pages

<!-- facts-needed: demo availability and wording; whether the demo supports an SL order with a limit below the trigger. -->

<!-- standing-disclaimer -->
