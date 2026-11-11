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

Imagine you have Rs 10,000. You set a tight stop, Rs 2 below an entry of Rs 250. The risk formula says you can buy 50 shares. But 50 shares at Rs 250 cost Rs 12,500. That is more than your whole account. The tight stop did not make the position bigger. It made the risk formula ask for a size your account cannot buy. This chapter shows how to find the real size, step by step. It also shows which limit decides it.

## The idea

Position sizing takes three limits and keeps the smallest one. The three limits are:

1. **Risk limit:** how many shares the risk budget allows.
2. **Cash limit:** how many shares the cash you hold can buy.
3. **Concentration limit:** how many shares keep one position within a set share of your capital.

The five steps:

- **Step 1, risk budget.** Risk budget = capital x risk %.
- **Step 2, risk per share.** Risk per share = entry - stop, for a long trade.
- **Step 3, raw shares.** Raw shares = floor(risk budget / risk per share). "Floor" means round down to a whole number.
- **Step 4, cash cap.** Cash cap = floor(capital / entry). A long delivery trade means you pay for the shares and keep them. You need the cash to buy them. This track uses no leverage, which means no borrowed money. So the cash you hold limits the size.
- **Step 5, concentration cap.** Concentration cap = floor(capital x max position % / entry). This cap limits how much of your capital one position can use. The 25% figure is a setting in Lab 1. You can change it. It is not a market rule.

Then:

- **Shares = the minimum of the three limits** (raw shares, cash cap, concentration cap).
- **Binding constraint** is the limit that gives the smallest number. That limit sets your size. Name it. If two limits tie, say so.

Some points to keep in mind:

- This track uses **whole shares** throughout.
- Tick size is the smallest step a price can move. It can matter if a plan rounds prices. On NSE cash shares the tick size depends on the share price. It is Re 0.01 for prices below Rs 250, Rs 0.05 from Rs 250 to Rs 1,000, and Rs 0.10 above Rs 1,000 up to Rs 5,000. It gets larger still for higher prices. NSE reviews the tick size of each share every month. (As of 11 Nov 2026, NSE circulars on tick size. Rules change, so check the NSE site.)
- Lot size is the smallest number of shares you can trade at once. For shares traded in demat form on NSE, the market lot is one share. This book treats cash equity as whole shares. (As of 11 Nov 2026, NSE trading system page. Rules change, so check the NSE site.)
- Lab 1 adds costs to show the true loss. The costs themselves are covered in *Costs on a trade*.

The main lesson: **a tighter stop does not mean a larger position.** A tighter stop raises the raw share count. The cash and concentration caps can then cut it. The stop changes what the risk formula allows. The caps decide what you can actually hold.

## See it

<!-- component: position-size-viz | capital: 50000 | riskPct: 1 | entry: 250 | stop: 240 | caption: Three bars for Example A (raw risk limit 50, cash cap 200, concentration cap 50); the minimum is highlighted and the binding constraint is named -->

The three bars show the three limits. The shortest bar is the answer. For Example A, the risk limit and the concentration cap tie at 50 shares. The cash cap is far above them. Change the stop to Rs 248 and look at how the risk bar grows. The concentration bar stays put.

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

Binding constraint: the risk limit. The concentration cap ties with it at 50 shares. Position value: 50 x 250 = Rs 12,500, which is 25% of capital. Planned loss: 50 x 10 = Rs 500.

**Hypothetical. Example B.** Capital Rs 10,000. Entry Rs 250. Stop Rs 248.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 10,000 x 1% | Rs 100 |
| 2. Risk per share | 250 - 248 | Rs 2 |
| 3. Raw shares | floor(100 / 2) | 50 |
| 4. Cash cap | floor(10,000 / 250) | 40 |
| 5. Concentration cap | floor(10,000 x 25% / 250) = floor(2,500 / 250) | 10 |
| **Shares** | minimum of 50, 40, 10 | **10** |

Binding constraint: **concentration cap**. The raw figure of 50 shares would cost 50 x 250 = Rs 12,500. That is more than the Rs 10,000 account. The cash cap of 40 shares would cost Rs 10,000. That is the whole account. Neither of these fits the 25% limit. Position value: 10 x 250 = Rs 2,500 (25%). Planned loss: 10 x 2 = Rs 20, which is 0.2% of capital. The risk budget of Rs 100 was not fully used. The concentration cap was the smaller limit.

**Lesson.** A tight stop gave a larger raw figure, not a larger position. The caps reduced it. If your plan's position costs more than the cash you have, reject the plan. You cannot carry it out.

## Try it

### Guided exercise

**Task.** Capital Rs 50,000. Risk 1%. Entry Rs 400. Stop Rs 380. Work out the risk budget, risk per share, the raw shares, the cash cap, the concentration cap, the shares, the binding constraint, the position value and the planned loss.

Hints:

1. Work out all three limits before you take the minimum.
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

**Task.** Capital Rs 25,000. Risk 1%. Entry Rs 200. Stop Rs 190. Work out the three limits, the shares, the binding constraint, the position value and the planned loss.

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

1. Write three hypothetical setups. Each one has capital, risk %, entry and stop.
2. For each setup, write the five steps as separate lines. Include the three limits and the minimum.
3. Record the planned shares, the binding constraint and the planned loss.
4. Mark each entry as hypothetical. Do not record a live account.

## Limits and common mistakes

- It does not tell you which entry or stop to choose. Those come from the trade idea, which is outside this chapter.
- It does not include costs. Lab 1 adds costs to show the true loss (*Costs on a trade*). The arithmetic in this chapter does not add them.
- It does not make a position safe. Caps reduce size. They do not reduce the risk of the idea. A gap (a jump in price with no trading in between) can still cause a loss bigger than the plan (*Slippage, gaps and planned versus actual risk*).
- It does not allow you to buy more of a losing share to lower your average price. This is called averaging down. This track forbids it.

## Remember

- Shares = the minimum of three limits: raw risk limit, cash cap, concentration cap. Round each down.
- Name the binding constraint every time. If two tie, say so.
- Risk per share is entry minus stop. Never divide the budget by the entry price.
- A tighter stop can raise the raw figure. The caps can then make it smaller.
- If the position costs more than the cash you hold, the plan is rejected.

## Sources and verification

- NSE circulars on tick size for the cash market (revision of June 2024 and April 2025), read on 11 Nov 2026, for rounding prices in a plan.
- NSE trading system page, for the market lot of one share.
- The 25% limit is a setting in this book, not a market rule.

<!-- facts-needed: tick size for cash equity; lot size rule for cash equity (the book assumes whole shares). -->


<!-- standing-disclaimer -->
