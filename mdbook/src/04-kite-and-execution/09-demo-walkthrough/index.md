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

A trader writes her plan on paper before she opens the Kite demo. The plan has the entry, the stop, the number of shares and the planned loss. Only then does she place the matching order in the demo. The demo uses dummy data, so it cannot show whether the plan would have paid. Its value is in following the steps every time.

## The idea

This chapter puts the steps from the earlier order chapters together. Use the same steps for every trade in the demo.

1. **Plan before you open Kite.** Write the setup, the entry, the stop, the number of shares, the planned loss, the product and the review date.
2. **Size the trade.** Use the stop distance, the risk budget and the caps. See *Position sizing step by step*.
3. **Place the stop as its own order.** The stop is a separate order from the entry. Place it, then check it.
4. **Record what happened.** Write what the demo did, and compare it with the plan.
5. **Label the record.** Write "kite demo" in the journal. Never write "live".

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
- Stop order: an SL with a trigger at Rs 240 and a limit at Rs 238. [VERIFY: whether the demo supports this order]

An SL with a limit below its trigger may not fill in a gap. See *Order types*.

## See it

<!-- component: lab-journal | mode: kite_demo | form: plan-and-execution | caption: Plan form and execution form for one hypothetical demo trade -->

<!-- component: kite-illustration | steps: plan, size, place-entry, place-stop, record | caption: Recreated order steps for the demo. Illustration, check your own Kite for the current layout -->

Fill in the plan form first, using the example numbers. Then look at the order steps and note where the stop goes. Fill in the execution form after the demo trade.

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
- Stop: SL, trigger Rs 240, limit Rs 238.

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

The quiz checks the sizing steps, the planned loss, and the rule for labelling a demo record.

## Paper task

Mode: **kite demo**. Complete the full cycle for one hypothetical trade. Log it in your journal (or on paper until the journal app is ready).

1. Write the plan: setup, entry, stop, shares, planned loss, product and review date.
2. Place the matching entry order in the demo.
3. Place the stop order. Check its side, type, trigger, limit and quantity.
4. Record what happened in the demo, and compare it with the plan.
5. Write a short reflection. Label the record "kite demo".

## Limits and common mistakes

- A demo trade has no evidence value for live results. Do not record it as live.
- A demo fill can differ from the plan. Record the difference, and do not explain it away.
- A stop is not a risk limit by itself. A gap can make the loss bigger than planned (*Slippage*).
- Finishing this walkthrough is not permission to trade with real money. Live use is a separate decision, made much later, after the checks at the end of this book.

## Remember

- Plan first, then size, then place the entry, then place the stop.
- Shares = the smallest of the raw risk figure, the cash cap and the concentration cap.
- Planned loss = shares x risk per share.
- Compare the demo result with the plan, and write what differed.
- Label every demo record "kite demo", never "live".

## Sources and verification

- Zerodha support pages on the Kite demo [VERIFY: page titles]
- The book's own sizing and journal pages

<!-- facts-needed: demo availability and wording; whether the demo supports an SL order with a limit below the trigger. -->

<!-- standing-disclaimer -->
