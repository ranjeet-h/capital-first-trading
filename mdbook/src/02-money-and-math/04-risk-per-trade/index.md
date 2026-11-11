---
id: T2.4
title: Risk per trade and stop-loss distance
page_type: Math/Calculator
prerequisites: [T2.1, T1.4]
labs: [Lab 1]
estimated_minutes: 30
---

# Risk per trade and stop-loss distance

## Hook

A trader with Rs 50,000 decides in advance to risk Rs 500 on a trade. Two plans both risk Rs 500 in total. One buys 50 shares, the other buys 25. The difference is not the budget. It is where each plan puts its stop, the price at which the idea is wrong. A stop that is far from the entry allows fewer shares for the same rupee risk. This chapter shows the arithmetic, step by step.

## The idea

Start with the rule that comes first: **the risk per trade is set before the trade, as a rupee amount derived from your capital.**

- **Capital** is the trading capital you have set aside (T0.2).
- **Risk percentage** is the share of that capital you accept losing on one trade. A common planning figure is 1%, which is a design default in this book, not a fact.
- **Risk budget** is capital x risk percentage, in rupees.

The stop is the price at which the trade idea is wrong. It is chosen because of the idea, not to fit a budget. This order matters. If you choose the stop to fit the budget, the stop is no longer a statement about the trade.

Once the stop is chosen, the rest is arithmetic. For a **long** trade (you buy first and sell later; this track covers long trades only):

- **Risk per share** = entry price - stop price. This is the rupee loss on each share if the stop is hit.
- **Shares** = risk budget / risk per share, rounded **down** to a whole number.
- **Stop distance** as a percentage of entry = risk per share / entry price.
- **Position value** = shares x entry price.
- **Planned loss at the stop** = shares x risk per share.

Rounding down matters. If the formula gives 31.25 shares, you buy 31, not 32. Rounding up would risk more than the budget.

Two rules follow directly from the arithmetic:

- A **tighter stop** (closer to entry) gives a smaller risk per share, so the same budget buys **more shares**.
- A **wider stop** (further from entry) gives a larger risk per share, so the same budget buys **fewer shares**.

Two numbers are easy to confuse:

- **Risk percentage** (1% of capital) is the planned loss as a share of capital.
- **Position percentage** is the position value as a share of capital.

A 1% risk does not mean a 1% position. In the example below, a 1% risk gives a position of 25% of capital.

Rules for the stop itself:

- A stop above the entry price is invalid for a long trade. The stop must sit below the entry. If the plan has a stop above the entry, reject the plan or correct it before doing any arithmetic.
- Never move a stop further away after entry to avoid a loss. That turns a planned loss into an unplanned one.
- Noise and volatility measures for placing stops are taught in Track 5. Here, only the arithmetic.

## See it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 250 | stop: 240 | caption: Shares and position value for three stops (240, 245, 230) on a Rs 250 entry, with a Rs 500 risk budget; compare the shares as the stop moves -->

Move the stop closer to the entry and watch the share count rise. Move it further away and watch the share count fall. The risk in rupees stays near Rs 500 in each case. Look at the position value too: it changes with the share count, not with the risk budget.

## Worked example

**Hypothetical.** Capital Rs 50,000. Risk 1% = Rs 500. Entry Rs 250.

**Plan 1: stop at Rs 240**

| Step | Calculation | Result |
|---|---|---|
| Risk budget | 50,000 x 1% | Rs 500 |
| Risk per share | 250 - 240 | Rs 10 |
| Stop distance | 10 / 250 | 4% |
| Raw shares | 500 / 10 | 50 |
| Position value | 50 x 250 | Rs 12,500 |
| Position as % of capital | 12,500 / 50,000 | 25% |
| Planned loss | 50 x 10 | Rs 500 |

**Plan 2: stop at Rs 245 (tighter)**

| Step | Calculation | Result |
|---|---|---|
| Risk per share | 250 - 245 | Rs 5 |
| Raw shares | 500 / 5 | 100 |
| Position value before cap | 100 x 250 | Rs 25,000 |
| Position as % of capital | 25,000 / 50,000 | 50% |

A 50% position is above the default 25% concentration cap used in Lab 1. With the cap, the largest allowed position is 12,500 / 250 = 50 shares, and the planned loss becomes 50 x 5 = Rs 250, not Rs 500. The cap, not the risk budget, sets the size here. T2.5 works through this in full.

**Plan 3: stop at Rs 230 (wider)**

| Step | Calculation | Result |
|---|---|---|
| Risk per share | 250 - 230 | Rs 20 |
| Shares | 500 / 20 | 25 |
| Position value | 25 x 250 | Rs 6,250 |
| Position as % of capital | 6,250 / 50,000 | 12.5% |
| Planned loss | 25 x 20 | Rs 500 |

**Lesson.** Plans 1 and 3 each plan a Rs 500 loss, with 50 and 25 shares. Plan 2 shows that a tighter stop does not automatically mean a bigger planned loss: the cap cut its size to 50 shares and the planned loss to Rs 250. The stop distance sets the share count before caps. The caps and the risk budget then decide the final size.

## Try it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 400 | stop: 384 | caption: Guided exercise inputs: capital Rs 50,000, risk 1%, entry Rs 400, stop Rs 384 -->

### Guided exercise

**Task.** Capital Rs 50,000, risk 1%, entry Rs 400, stop Rs 384. Compute the risk budget, the risk per share, the shares (rounded down), the position value, the position as a percentage of capital and the planned loss.

Hints:

1. Compute the risk budget first: 1% of Rs 50,000.
2. Compute the raw share count, then round down before you multiply anything else.
3. Recompute the planned loss from the rounded share count, not the raw one.

**Answer:**

- Risk budget: Rs 500.
- Risk per share: 400 - 384 = Rs 16.
- Raw shares: 500 / 16 = 31.25, so **31 shares**.
- Position value: 31 x 400 = Rs 12,400.
- Position as % of capital: 12,400 / 50,000 = 24.8%.
- Planned loss: 31 x 16 = Rs 496. The unused budget is Rs 4.

### Independent exercise

**Task.** Capital Rs 30,000, risk 0.5%, entry Rs 120, stop Rs 111. Compute the risk budget, the risk per share, the shares, the position value, the position percentage, and the planned loss.

<details><summary>Check your answer</summary>

- Risk budget: 30,000 x 0.5% = Rs 150.
- Risk per share: 120 - 111 = Rs 9.
- Raw shares: 150 / 9 = 16.67, so **16 shares**.
- Position value: 16 x 120 = Rs 1,920.
- Position as % of capital: 1,920 / 30,000 = 6.4%.
- Planned loss: 16 x 9 = Rs 144.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the stop rules, rounding down, and the difference between risk percentage and position percentage.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Use Lab 1, if it is available, to run the sensitivity strip for stop distances of Rs 2, Rs 5, Rs 10 and Rs 20 on one hypothetical entry price.
2. If Lab 1 is not yet available, do the same arithmetic by hand with capital Rs 50,000, risk 1% and entry Rs 250.
3. Record the shares and the planned loss for each stop distance in a learning-note entry.
4. Mark the entry as hypothetical. No order is placed.

## What this does NOT tell you

- It does not tell you where a good stop is. The stop must come from the reason for the trade. This chapter only does the arithmetic.
- It does not show that a 1% planned risk is a 1% maximum loss. A gap or a circuit can take the loss beyond the plan (T2.6).
- It does not make a tight stop safer. A very tight stop is hit by ordinary price noise and can repeat a small loss many times.
- It does not change the rule that the risk percentage is never raised after losses.

## Remember

- Set the risk budget first: capital x risk percentage, in rupees.
- Risk per share = entry - stop, for a long trade. A stop at or above entry is invalid.
- Shares = risk budget / risk per share, rounded down.
- A tighter stop allows more shares for the same rupee risk. A wider stop allows fewer.
- Risk percentage is not position percentage. 1% risk gave a 25% position in the example.

## Sources and verification

- The book's Lab 1 specification (LABS.md).
- Zerodha Varsity position sizing concepts, as a reference only (link, no text copied).
- The 1% risk and 25% concentration cap are design defaults of the book, not facts.

<!-- facts-needed: none for this chapter (the 1% and 25% defaults are design settings; no market rule is stated). -->

Last content review: not yet done

<!-- standing-disclaimer -->
