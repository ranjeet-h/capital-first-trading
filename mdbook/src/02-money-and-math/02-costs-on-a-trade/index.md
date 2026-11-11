<!-- meta
id: T2.2
title: Costs on a trade
page_type: Math/Calculator
prerequisites: [T1.3, T2.1]
labs: [Lab 2]
estimated_minutes: 30
-->

# Costs on a trade

## Hook

A trader buys Rs 5,000 of a share and sells it a few days later at exactly the same price. Nothing moved, so the trader expects to break even. The statement shows a loss. The difference is costs: several small charges on the buy, and more on the sell. This chapter shows how those charges add up, using a dummy model with round numbers, so you can check every line by hand.

## The idea

A trade has two **legs**: the buy and the sell. Each leg can carry several charges. Your total cost is the sum of all of them.

The charge types you will meet on Indian equity trades are these. Only their names are used here. Their rates and bases are not stated in this chapter, because they must come from an official source first.

- **Brokerage:** what the broker charges for executing the order.
- **Securities transaction tax (STT):** a government tax on trades. [VERIFY: rate and which legs it applies to]
- **Exchange transaction charge:** a fee levied by the exchange on turnover. [VERIFY: NSE and BSE rates]
- **SEBI fee:** the regulator's turnover fee. [VERIFY: SEBI fees page]
- **Stamp duty:** a state-level duty on the buy side. [VERIFY: rate by state law]
- **GST:** a tax on some of the other charges, not on the whole trade. [VERIFY: GST base and rate]
- **Depository (DP) charge:** a charge on sales from your demat account. [VERIFY: per scrip per day rule and components]

Charges fall into two groups:

- **Proportional** charges scale with turnover. Turnover is price x quantity for one leg. Double the trade, double the charge.
- **Fixed** charges do not scale. A fixed amount per order, or per stock per day, is the same for a small trade and a large one.

This is why costs weigh more on small trades. Fixed charges take a bigger share of a small position.

Two formulas:

- Turnover of a leg = price x quantity.
- Total cost = sum of all charges on both legs.

Break-even move, in words: total cost divided by the position value. In symbols, with C the total cost and V the position value, the break-even move is about C / V. It is approximate, because the exit price changes the proportional charges. Use it as a rule of thumb, not as an exact figure.

**Dummy model.** The arithmetic below uses this model, which is not any broker's, exchange's or government's rate:

- Proportional: 0.1% of turnover on each leg.
- Fixed: Rs 20 per order, on each leg.
- DP charge: Rs 50 per stock, on the sell leg only.

Labelled DUMMY, for arithmetic only. Do not quote these as Zerodha or statutory figures. Lab 2 replaces them with verified rates from the facts registry, and the official calculator is the check for those.

Brokerage on delivery is not covered by the dummy model. Intraday costs are not worked here. Their structure is noted in this chapter and their figures belong to Lab 2 after verification.

<!-- OPEN: Spec open question asks whether intraday costs belong in this chapter or only in Lab 2. Written here as structure only, numbers in Lab 2. -->

Finally, a zero on one line is not a zero cost. A broker showing zero brokerage still leaves the other charges in the list above. Always add every component.

## See it

The stacked table below splits the dummy cost of two round trips into proportional, fixed and DP parts. Read down the columns.

| Component (DUMMY) | Rs 5,000 round trip | Rs 50,000 round trip |
|---|---|---|
| Proportional, 0.1% per leg | 5 + 5 = 10 | 50 + 50 = 100 |
| Fixed per order, Rs 20 per leg | 20 + 20 = 40 | 20 + 20 = 40 |
| DP charge on sell, Rs 50 | 50 | 50 |
| **Total** | **100** | **190** |
| Share that is fixed (order + DP) | 90 of 100 = 90% | 90 of 190 = 47.4% |

The point of the table is the shares: fixed charges dominate the small trade and matter much less on the large trade.

<!-- component: lab-costs | mode: walkthrough | rates: dummy | tradeValue: 5000 | product: delivery | caption: Walk through each cost line for a Rs 5,000 round trip with DUMMY rates labelled; then change the trade value and watch the fixed share fall -->

Use the walkthrough to step through each leg. Change the trade value and see which lines move and which stay the same. Note the DUMMY label: the rates are not real.

<!-- OPEN: The lab-costs "walkthrough mode with dummy rates" is in the spec's Visual line but not in LABS.md. Confirm the mode exists before this placeholder is built. -->

## Worked example

**Hypothetical, DUMMY model.** The buy and sell prices are the same, so the price does not move.

**Round trip of Rs 5,000**

| Step | Calculation | Result |
|---|---|---|
| Buy turnover | 5,000 | Rs 5,000 |
| Buy proportional | 0.1% x 5,000 = 5 | Rs 5.00 |
| Buy fixed | Rs 20 | Rs 20.00 |
| **Buy leg total** | 5.00 + 20 | **Rs 25.00** |
| Sell turnover | 5,000 | Rs 5,000 |
| Sell proportional | 0.1% x 5,000 = 5 | Rs 5.00 |
| Sell fixed | Rs 20 | Rs 20.00 |
| Sell DP charge | Rs 50 | Rs 50.00 |
| **Sell leg total** | 5.00 + 20 + 50 | **Rs 75.00** |
| **Total cost** | 25.00 + 75.00 | **Rs 100.00** |

Total cost as a share of the position: 100 / 5,000 = 0.02 = **2.0%**. The break-even move is about 2.0%.

**Round trip of Rs 50,000**

| Step | Calculation | Result |
|---|---|---|
| Buy leg total | 50 + 20 | Rs 70.00 |
| Sell leg total | 50 + 20 + 50 | Rs 120.00 |
| **Total cost** | 70 + 120 | **Rs 190.00** |

Total cost as a share of the position: 190 / 50,000 = 0.0038 = **0.38%**.

**The DP charge in both cases.** It is Rs 50 each time. As a share of the trade: 50 / 5,000 = 1.0% for the small trade, and 50 / 50,000 = 0.1% for the large one. The same rupee charge is ten times the percentage on the small trade.

## Try it

<!-- component: lab-costs | mode: walkthrough | rates: dummy | tradeValue: 10000 | product: delivery | caption: Guided exercise: round trip of Rs 10,000 with DUMMY rates -->

### Guided exercise

**Task.** Using the DUMMY model, compute the total round-trip cost for a Rs 10,000 round trip (buy and sell at the same price). Give the total in rupees and as a percentage of Rs 10,000.

Hints:

1. Compute the buy leg first: proportional on Rs 10,000, then add the fixed Rs 20.
2. Compute the sell leg: proportional, plus the fixed Rs 20, plus the Rs 50 DP charge.
3. Add the two legs, then divide by Rs 10,000.

**Answer:** Buy leg: 10 + 20 = Rs 30. Sell leg: 10 + 20 + 50 = Rs 80. Total: Rs 110, which is 110 / 10,000 = 1.1%.

### Independent exercise

**Task.** Buy 100 shares at Rs 200 (Rs 20,000) and later sell all 100 at Rs 210 (Rs 21,000). Using the DUMMY model, compute the total cost, the gross profit before costs and the net profit after costs.

<details><summary>Check your answer</summary>

- Buy leg: proportional 0.1% x 20,000 = 20; fixed 20; total 40.
- Sell leg: proportional 0.1% x 21,000 = 21; fixed 20; DP 50; total 91.
- Total cost: 40 + 91 = Rs 131.
- Gross profit: (210 - 200) x 100 = Rs 1,000.
- Net profit: 1,000 - 131 = Rs 869.

This is DUMMY arithmetic. It is not an estimate of any real trade.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the arithmetic of the dummy model, the difference between fixed and proportional charges, and why you verify a rate before you use it.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Open the official Zerodha charges page and the official brokerage calculator. Note the access date.
2. For one Rs 5,000 delivery trade and one Rs 50,000 delivery trade, record each component line and the total the calculator gives.
3. Write the list of component names in your own words, next to the source link.
4. Do not copy these figures into the book or any calculation yet. Lab 2 will verify them. Mark the note as a learning note, with no trade placed.

## What this does NOT tell you

- It does not tell you any real charge. Every rate here is DUMMY, and the official sources are the only place for current rates.
- It does not include tax. Tax on gains is a separate question (T2.3).
- It does not include slippage, the difference between the expected and the actual fill price (T2.6). A real trade can cost more than the table shows.
- It does not say that a small trade is a bad idea. It says that fixed charges weigh more on small trades, and that you must include them in every plan.

## Remember

- Costs are the sum of every charge on both legs, not just brokerage.
- Proportional charges scale with turnover. Fixed charges do not.
- On a Rs 5,000 round trip in the dummy model, the total is Rs 100, or 2.0%. On Rs 50,000, it is Rs 190, or 0.38%.
- A zero on one line is not a zero cost.
- Verify every rate from the official source, with a date, before you use it.

## Sources and verification

- Zerodha charges page and brokerage calculator (official). Reference only until Lab 2 verifies the figures.
- NSE and BSE fee and circular pages (exchange transaction charges).
- SEBI fees page (SEBI turnover fee).
- Income Tax Department STT page.
- GST portal (GST rate and base).
- CDSL and NSDL tariff pages (DP charges).
- Stamp duty: the relevant state stamp act or Indian Clearing Corporation documentation.

<!-- facts-needed: Zerodha equity delivery brokerage; STT rates and basis; NSE and BSE exchange transaction charge rates; SEBI turnover fee; stamp duty rates by state; GST rate and base; DP charge and per-scrip-per-day rule; rounding rules from the official calculator. -->

[VERIFY: Zerodha equity delivery brokerage]
[VERIFY: STT rates and which legs they apply to]
[VERIFY: NSE and BSE exchange transaction charge rates]
[VERIFY: SEBI turnover fee]
[VERIFY: stamp duty rates by state]
[VERIFY: GST rate and base]
[VERIFY: DP charge and per-scrip-per-day rule]
[VERIFY: rounding rules from the official calculator]

Last content review: not yet done

<!-- standing-disclaimer -->
