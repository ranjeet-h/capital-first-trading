<!-- meta
id: T2.5
title: Position sizing step by step
page_type: Math/Calculator
prerequisites: [T2.4]
labs: [Lab 1, Lab 3]
estimated_minutes: 30
-->

# Position sizing step by step

## Hook

A trader with Rs 10,000 sets a tight stop, Rs 2 below an entry of Rs 250. The risk budget formula says 50 shares. Fifty shares at Rs 250 cost Rs 12,500, which is more than the whole account. The tight stop did not make the position bigger. It made the risk formula ask for a size the account cannot buy. This chapter shows how to find the real size, step by step, and which limit decides it.

## The idea

Position sizing takes three limits and keeps the smallest one. The three limits are:

1. **Risk limit:** how many shares the risk budget allows.
2. **Cash limit:** how many shares the cash you hold can buy.
3. **Concentration limit:** how many shares keep one position within a set share of your capital.

The five steps:

- **Step 1, risk budget.** Risk budget = capital x risk %.
- **Step 2, risk per share.** Risk per share = entry - stop, for a long trade.
- **Step 3, raw shares.** Raw shares = floor(risk budget / risk per share). "Floor" means round down to a whole number.
- **Step 4, cash cap.** Cash cap = floor(capital / entry). A long delivery trade needs the cash to buy the shares, and this track uses no leverage, so the cash you hold limits the size.
- **Step 5, concentration cap.** Concentration cap = floor(capital x max position % / entry). The 25% default is a design setting in Lab 1, which you can change. It is not a market rule.

Then:

- **Shares = the minimum of the three limits** (raw shares, cash cap, concentration cap).
- **Binding constraint** = the limit that produced the minimum. Name it. If two limits tie, say so.

Some points to keep in mind:

- This track uses **whole shares** throughout.
- Tick size, the smallest price step, can matter if a plan rounds prices. [VERIFY: NSE tick size page]
- Lot size for cash equity is treated as whole shares in this book. Confirm the current rule before using it on real data. [VERIFY: current lot size rule for cash equity]
- Costs are added in Lab 1 to show the true loss. The costs themselves are covered in *Costs on a trade*.

The main lesson: **a tighter stop does not mean a larger position.** A tighter stop raises the raw share count. The cash and concentration caps can then cut it. The stop changes what the risk formula allows, and the caps decide what you can actually hold.

## See it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 250 | stop: 240 | caption: Three bars for Example A (raw risk limit 50, cash cap 200, concentration cap 50); the minimum is highlighted and the binding constraint is named -->

The three bars show the three limits. The shortest bar is the answer. For Example A, the raw risk limit and the concentration cap tie at 50 shares, and the cash cap is far above them. Change the stop to Rs 248 and look at how the risk bar grows while the concentration bar stays put.

## Worked example

**Hypothetical. Example A.** Capital Rs 50,000. Entry Rs 250. Stop Rs 240.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 50,000 x 1% | Rs 500 |
| 2. Risk per share | 250 - 240 | Rs 10 |
| 3. Raw shares | floor(500 / 10) | 50 |
| 4. Cash cap | floor(50,000 / 250) | 200 |
| 5. Concentration cap | floor(50,000 x 25% / 250) = floor(12,500 / 250) | 50 |
| **Shares** | minimum of 50, 200, 50 | **50** |

Binding constraint: the risk budget, and the concentration cap ties with it at 50 shares. Position value: 50 x 250 = Rs 12,500, which is 25% of capital. Planned loss: 50 x 10 = Rs 500.

**Hypothetical. Example B.** Capital Rs 10,000. Entry Rs 250. Stop Rs 248.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 10,000 x 1% | Rs 100 |
| 2. Risk per share | 250 - 248 | Rs 2 |
| 3. Raw shares | floor(100 / 2) | 50 |
| 4. Cash cap | floor(10,000 / 250) | 40 |
| 5. Concentration cap | floor(10,000 x 25% / 250) = floor(2,500 / 250) | 10 |
| **Shares** | minimum of 50, 40, 10 | **10** |

Binding constraint: **concentration cap**. The raw figure of 50 shares would cost 50 x 250 = Rs 12,500, which is more than the Rs 10,000 account. The cash cap of 40 shares would be Rs 10,000, which is the whole account. Neither is allowed by the concentration rule. Position value: 10 x 250 = Rs 2,500 (25%). Planned loss: 10 x 2 = Rs 20, which is 0.2% of capital. The risk budget of Rs 100 was not used, because the cap bound first.

**Lesson.** A tight stop gave a larger raw figure, not a larger position. The caps reduced it. If your plan's position exceeds the cash you have, reject the plan. It is not a plan you can carry out.

## Try it

### Guided exercise

**Task.** Capital Rs 50,000. Risk 1%. Entry Rs 400. Stop Rs 380. Compute the risk budget, risk per share, the raw shares, the cash cap, the concentration cap, the shares, the binding constraint, the position value and the planned loss.

Hints:

1. Compute all three limits before you take the minimum.
2. Round down each limit. Do not round up any of them.
3. The concentration cap uses 25% of capital in this example.

**Answer:**

- Risk budget: Rs 500.
- Risk per share: 400 - 380 = Rs 20.
- Raw shares: floor(500 / 20) = floor(25) = **25**.
- Cash cap: floor(50,000 / 400) = floor(125) = 125.
- Concentration cap: floor(12,500 / 400) = floor(31.25) = 31.
- Shares: minimum of 25, 125, 31 = **25**.
- Binding constraint: **risk budget**.
- Position value: 25 x 400 = Rs 10,000 (20% of capital).
- Planned loss: 25 x 20 = Rs 500.

### Independent exercise

**Task.** Capital Rs 25,000. Risk 1%. Entry Rs 200. Stop Rs 190. Compute the three limits, the shares, the binding constraint, the position value and the planned loss.

<details><summary>Check your answer</summary>

- Risk budget: 25,000 x 1% = Rs 250.
- Risk per share: 200 - 190 = Rs 10.
- Raw shares: floor(250 / 10) = 25.
- Cash cap: floor(25,000 / 200) = 125.
- Concentration cap: floor(25,000 x 25% / 200) = floor(6,250 / 200) = floor(31.25) = 31.
- Shares: minimum of 25, 125, 31 = **25**.
- Binding constraint: **risk budget**.
- Position value: 25 x 200 = Rs 5,000 (20% of capital).
- Planned loss: 25 x 10 = Rs 250.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks which limit binds, rounding down, and why a tight stop can give a smaller position.

## Paper task

Mode: **learning note**, or **paper** if you prefer. Log it in your journal (or on paper until the journal app is ready).

1. Write three hypothetical setups, each with capital, risk %, entry and stop.
2. For each setup, write the five steps as separate lines, with the three limits and the minimum.
3. Record the planned shares, the binding constraint and the planned loss.
4. Mark each entry as hypothetical. Do not record a live account.

## Limits and common mistakes

- It does not tell you which entry or stop to choose. Those come from the trade idea, which is outside this chapter.
- It does not include costs. The true loss in Lab 1 adds costs (*Costs on a trade*), and this chapter's arithmetic does not.
- It does not make a position safe. Caps reduce size. They do not reduce the risk of the idea, and gaps can still produce losses above the plan (*Slippage, gaps and planned versus actual risk*).
- It does not allow adding shares to a losing position to lower the average price. That is averaging down, which this track forbids.

## Remember

- Shares = the minimum of three limits: raw risk limit, cash cap, concentration cap. Round each down.
- Name the binding constraint every time. If two tie, say so.
- Risk per share is entry minus stop. Never divide the budget by the entry price.
- A tighter stop can raise the raw figure. The caps can then make it smaller.
- If the position costs more than the cash you hold, the plan is rejected.

## Sources and verification

- Lab 1 specification (LABS.md).
- Lab 3 plan form (LABS.md), for recording the planned fields.
- NSE tick size page, for rounding prices in a plan.
- The 25% concentration cap is a design setting of the book, not a market rule.

<!-- facts-needed: tick size for cash equity; lot size rule for cash equity (the book assumes whole shares). -->

[VERIFY: NSE tick size for cash equity]
[VERIFY: current lot size rule for cash equity]

<!-- OPEN: The spec's Lab 1 visual asks for three bars with the minimum highlighted. LABS.md describes a bar or ladder visual for the price levels and a sensitivity strip, but not three limit bars. Confirm before the placeholder is built. -->

<!-- standing-disclaimer -->
