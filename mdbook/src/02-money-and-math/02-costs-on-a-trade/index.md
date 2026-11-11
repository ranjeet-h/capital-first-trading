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

A trader buys Rs 5,000 of a share. A few days later, the trader sells it at exactly the same price. Nothing moved, so the trader expects to break even. But the statement shows a loss. The difference is costs. There are several small charges on the buy, and more on the sell. This chapter shows how those charges add up. It uses a DUMMY model with round numbers, so you can check every line by hand.

## The idea

A trade has two **legs**: the buy and the sell. Each leg can carry several charges. Your total cost is the sum of all of them.

The charge types you will meet on Indian equity trades are these.

- **Brokerage:** what the broker charges for carrying out the order.
- **Securities transaction tax (STT):** a government tax on trades. On delivery trades it is charged on both the buy and the sell. On intraday trades it is charged only on the sell.
- **Exchange transaction charge:** a small fee the exchange charges on the value traded.
- **SEBI fee:** the regulator's small fee on the value traded.
- **Stamp duty:** a government duty on the buy side only. Since 1 July 2020 it is the same in every state.
- **GST:** a tax on some of the other charges, not on the whole trade. It is charged on brokerage, SEBI fee and exchange transaction charge.
- **Depository (DP) charge:** a charge when you sell shares from your demat account. It is charged once for each share name sold on a day, whatever the quantity.

Charges fall into two groups:

- **Proportional** charges grow with turnover. Turnover is price x quantity for one leg. Double the trade, and the charge doubles.
- **Fixed** charges do not grow with turnover. A fixed amount per order, or per stock per day, is the same for a small trade and a large one.

This is why costs weigh more on small trades. Fixed charges take a bigger share of a small position.

Two formulas:

- Turnover of a leg = price x quantity.
- Total cost = sum of all charges on both legs.

Break-even move, in words: total cost divided by the position value. In symbols, with C for the total cost and V for the position value, the break-even move is about C / V. It is only approximate. The exit price changes the proportional charges. Use it as a rule of thumb, not as an exact figure.

**DUMMY model.** The arithmetic below uses this model. It is not any broker's, exchange's or government's rate.

- Proportional: 0.1% of turnover on each leg.
- Fixed: Rs 20 per order, on each leg.
- DP charge: Rs 50 per stock, on the sell leg only.

These are round numbers for practice. They are not the real charges. Do not quote them as Zerodha or government figures. The real charges are in the next table.

Brokerage on delivery is not in the practice model. Intraday costs are not worked out here.

### The real charges today

The table below shows what Zerodha lists for equity trades on its charges page. The exchange, SEBI and government charges are set outside Zerodha.

| Charge | Equity delivery | Equity intraday |
|---|---|---|
| Brokerage | Zero | 0.03% or Rs 20 per executed order, whichever is lower |
| STT | 0.1% on buy and on sell | 0.025% on the sell side only |
| NSE transaction charge | 0.00307% of the value traded | 0.00307% of the value traded |
| BSE transaction charge | 0.00375% of the value traded | 0.00375% of the value traded |
| SEBI fee | Rs 10 per crore | Rs 10 per crore |
| Stamp duty (buy side only) | 0.015% | 0.003% |
| GST | 18% on brokerage + SEBI fee + transaction charge | 18% on brokerage + SEBI fee + transaction charge |
| DP charge | Rs 15.34 for each share name sold in a day (Rs 3.50 depository fee + Rs 9.50 Zerodha fee + Rs 2.34 GST), whatever the quantity | Not charged, because nothing is sold from the demat account |

A few more Zerodha charges are worth knowing. Orders placed through a dealer (call and trade) cost Rs 50 per order. When an intraday position is closed for you by auto square-off, Rs 50 plus 18% GST is charged for each order closed. For new accounts, the yearly account fee (AMC) is free for the first year. After that, the amount depends on the account type and the value of your holdings, so read it on the charges page.

(As of 11 Nov 2026, from the Zerodha charges page, the NSE circular of 27 Feb 2026 and the SEBI note on stamp duty of June 2020. Rules and rates change, so check the Zerodha charges page and brokerage calculator before you rely on any figure.)

Zerodha's page says all statutory and regulatory charges are levied "at actuals". It does not state a rounding rule for every line. STT is rounded to the nearest rupee. The other lines may differ by a few paise from your own sum. The official brokerage calculator is the check.

One more point. A zero on one line is not a zero cost. A broker may show zero brokerage. The other charges in the list above still apply. Add every component.

## See it

The table below splits the dummy cost of two round trips into proportional, fixed and DP parts. Read down the columns.

| Component (DUMMY) | Rs 5,000 round trip | Rs 50,000 round trip |
|---|---|---|
| Proportional, 0.1% per leg | 5 + 5 = 10 | 50 + 50 = 100 |
| Fixed per order, Rs 20 per leg | 20 + 20 = 40 | 20 + 20 = 40 |
| DP charge on sell, Rs 50 | 50 | 50 |
| **Total** | **100** | **190** |
| Share that is fixed (order + DP) | 90 of 100 = 90% | 90 of 190 = 47.4% |

The point of the table is the shares. Fixed charges make up most of the cost on the small trade. They matter much less on the large trade.

<!-- component: lab-costs | mode: walkthrough | rates: dummy | tradeValue: 5000 | product: delivery | caption: Walk through each cost line for a Rs 5,000 round trip with DUMMY rates labelled; then change the trade value and watch the fixed share fall -->

Use the walkthrough to step through each leg. Change the trade value to see which lines move and which stay the same. The DUMMY label means the rates are not real.

## Worked example

**Hypothetical, DUMMY model (round numbers for practice, not the real charges).** The buy and sell prices are the same, so the price does not move.

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

**The DP charge in both cases.** It is Rs 50 each time. As a share of the trade, it is 50 / 5,000 = 1.0% for the small trade. It is 50 / 50,000 = 0.1% for the large one. The same rupee charge is ten times the percentage on the small trade.

## Try it

<!-- component: lab-costs | mode: walkthrough | rates: dummy | tradeValue: 10000 | product: delivery | caption: Guided exercise: round trip of Rs 10,000 with DUMMY rates -->

### Guided exercise

**Task.** Using the DUMMY model, compute the total round-trip cost for a Rs 10,000 round trip. The buy and sell prices are the same. Give the total in rupees and as a percentage of Rs 10,000.

Hints:

1. Compute the buy leg first. Find the proportional charge on Rs 10,000, then add the fixed Rs 20.
2. Compute the sell leg. Add the proportional charge, the fixed Rs 20 and the Rs 50 DP charge.
3. Add the two legs, then divide by Rs 10,000.

**Answer:** Buy leg: 10 + 20 = Rs 30. Sell leg: 10 + 20 + 50 = Rs 80. Total: Rs 110, which is 110 / 10,000 = 1.1%.

### Independent exercise

**Task.** Buy 100 shares at Rs 200 (Rs 20,000). Later, sell all 100 at Rs 210 (Rs 21,000). Using the DUMMY model, compute the total cost, the gross profit before costs and the net profit after costs.

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

The quiz checks the arithmetic of the dummy model. It checks the difference between fixed and proportional charges, and why you must verify a rate before you use it.

## Paper task

Mode: **learning note**. Write it in your journal.

1. Open the official Zerodha charges page and the official brokerage calculator. Write down the date you looked.
2. For one Rs 5,000 delivery trade and one Rs 50,000 delivery trade, write each component line and the total the calculator gives.
3. Write the list of component names in your own words, next to the source link.
4. Do not copy these figures into the book or into any calculation yet. Mark the note as a learning note, with no trade placed.

## Limits and common mistakes

- It does not tell you any real charge. Every rate here is DUMMY. The official sources are the only place for current rates.
- It does not include tax. Tax on gains is a separate question (*Taxes on trading profits*).
- It does not include slippage, the difference between the expected and the actual fill price (*Slippage, gaps and planned versus actual risk*). A real trade can cost more than the table shows.
- It does not say that a small trade is a bad idea. It says that fixed charges weigh more on small trades. It also says you must include them in every plan.

## Remember

- Costs are the sum of every charge on both legs, not just brokerage.
- Proportional charges grow with turnover. Fixed charges do not.
- On a Rs 5,000 round trip in the dummy model, the total is Rs 100, or 2.0%. On Rs 50,000, it is Rs 190, or 0.38%.
- A zero on one line is not a zero cost.
- Verify every rate from the official source, with a date, before you use it.

## Sources and verification

- Zerodha charges page (zerodha.com/charges), read on 11 Nov 2026, and the Zerodha brokerage calculator.
- Zerodha support pages on STT (STT rates and rounding), DP charges and auto square-off charges, read on 11 Nov 2026.
- NSE circular NSE/FA/73061 of 27 Feb 2026, revision in transaction charges, in force from 1 Mar 2026.
- SEBI note on stamp duty rates from 1 July 2020 (FAQ on the Indian Stamp Act, June 2020).
- SEBI turnover fee: as listed on the Zerodha charges page. SEBI sets this fee, so check SEBI's own pages too.

<!-- facts-needed: Zerodha equity delivery brokerage; STT rates and basis; NSE and BSE exchange transaction charge rates; SEBI turnover fee; stamp duty rates by state; GST rate and base; DP charge and per-scrip-per-day rule; rounding rules from the official calculator. -->


<!-- standing-disclaimer -->
