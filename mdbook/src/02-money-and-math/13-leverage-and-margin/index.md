<!-- meta
id: T2.13
title: Leverage and margin
page_type: Math/Calculator
prerequisites: [T2.9, T2.4]
labs: [Lab 1]
estimated_minutes: 25
-->

# Leverage and margin

## Hook

Hypothetical: your own money is Rs 50,000. A 10% fall in a Rs 50,000 holding costs Rs 5,000. That is 10% of your own money. Now take a Rs 1,00,000 position, where half is borrowed. A 10% fall costs Rs 10,000. That is 20% of your own money. The borrowed Rs 50,000 is still owed. The price moved by the same amount in both cases. Only the size of the position changed.

## The idea

**Leverage** means controlling a position that is bigger than your own money. You do this with borrowed money or margin.

- **Leverage ratio** = position value / own capital. A Rs 1,00,000 position with Rs 50,000 of your own money has a ratio of 2 (2x).
- **Gains and losses are both multiplied by the ratio.** Measured as a percentage of your own capital, a price move of m percent changes your capital by ratio x m percent. A fall is a loss.
- **Wipe-out move** = 1 / ratio, for a long position (you own the asset and gain when it rises). It is the price fall that takes the position value down to the borrowed amount. That uses up all your own money. This ignores costs and financing, which make the real position worse.
- **Margin** is money or securities you deposit or borrow to support a position. The broker and the regulator set the rules. Check the rules for each product.

  - Since 1 September 2021, SEBI's rules say a broker must collect the full margin up front for positions in the stock market. This is why the old very high intraday leverage is gone. (As of 11 Nov 2026, SEBI circulars as summarised by Zerodha and others. Rules change, so check the SEBI site.)
  - Zerodha says its intraday leverage depends on the share. It can be cut or removed during the day. Shares you pledge as collateral are valued at less than their market price. (As of 11 Nov 2026, Zerodha support. Rules change, so check Zerodha support.)
- **Margin calls and forced sales.** When the position falls far enough, the broker can sell it to cover the shortfall. A forced sale happens at the price available at that time. That price is often the worst one.
- **Financing costs.** Borrowed money usually has a cost. For example, Zerodha's margin trading facility (MTF) charges interest of 0.04% a day on the amount it funds. That is about Rs 40 a day for every Rs 1 lakh funded, or roughly 14.6% a year. It runs every day you hold the position. (As of 11 Nov 2026, Zerodha support page on MTF interest. Rules change, so check Zerodha support.)
- **Intraday leverage** has auto square-off rules. The broker can close your positions at a set time. At Zerodha, open intraday share positions are closed at about 3:25 PM, and futures and options at about 3:26 PM. Each order closed this way costs Rs 50 plus 18% GST. (As of 11 Nov 2026, Zerodha support. Rules change, so check Zerodha support.)

This book does not practise leverage. The leverage demo is theory only. F&O (futures and options) is covered as theory in *Futures and why they are leveraged*.

## See it

<!-- component: leverage-demo | mode: theory | ownCapital: 50000 | leverage: 2 | priceMovePct: -10 | caption: Theory only: gain or loss on own capital, with the wipe-out line; no trading controls -->

Set the ratio to 1x, then to 4x, and keep the same 10% price fall. The loss on your own capital grows from 10% to 40%. The wipe-out line marks the price fall that uses up all your own money. The sliders change only the arithmetic. There are no trading controls.

## Worked example

**Hypothetical.** Own capital Rs 50,000. A 10% fall in the price.

| Ratio | Position value | Loss on a 10% fall | Loss as % of own capital | Wipe-out move (1 / ratio) |
|---|---|---|---|---|
| 1x | 50,000 | 5,000 | 10% | 100% |
| 2x | 1,00,000 | 10,000 | 20% | 50% |
| 3x | 1,50,000 | 15,000 | 30% | 33.3% |
| 4x | 2,00,000 | 20,000 | 40% | 25% |

Each row uses the same steps. Position value x 10% = loss. Then loss / Rs 50,000 = percent of own capital.

**2x, step by step (hypothetical; this is only arithmetic, not an offer or a product).**

1. Own money Rs 50,000. Borrowed Rs 50,000. Position Rs 1,00,000.
2. Price rises 10%: gain = 1,00,000 x 10% = Rs 10,000, which is 10,000 / 50,000 = 20% of own money.
3. Price falls 10%: loss = Rs 10,000, which is 20% of own money.
4. Wipe-out: 1 / 2 = 50%. Price falls 50%: position value = 50,000. That equals the borrowed Rs 50,000, so your own money is gone.

## Try it

Use the demo with the guided exercise inputs (theory mode):

<!-- component: leverage-demo | mode: theory | ownCapital: 20000 | leverage: 3 | priceMovePct: -15 | caption: Guided exercise inputs; check each answer by hand -->

### Guided exercise

**Task.** Own capital Rs 20,000. Position Rs 60,000 (3x). The price falls 15%. Work out the loss in rupees and as a percentage of own capital.

Hints:

1. Find the loss on the position first: position value x fall.
2. Divide that loss by your own capital.
3. Check: a 3x position with a 15% fall should give 3 x 15% = 45% of own capital.

**Answer:** Loss on the position = 60,000 x 15% = Rs 9,000. As a share of own capital, 9,000 / 20,000 = 45%.

### Independent exercise

**Task.** Own capital Rs 25,000 at 4x leverage. Work out the price fall that wipes out the own capital, and the loss at a 10% fall.

<details><summary>Check your answer</summary>

Position = 4 x 25,000 = Rs 1,00,000.

Wipe-out move = 1 / 4 = 25%. Check: a 25% fall on Rs 1,00,000 is Rs 25,000, which equals the own capital.

Loss at a 10% fall = 1,00,000 x 10% = Rs 10,000. As a share of own capital, 10,000 / 25,000 = 40%.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover the leverage ratio, the bigger loss, the wipe-out move, margin and the limits of a stop.

## Paper task

Mode: **learning note**. No orders are placed, and the Kite demo is not used for this task.

1. Draw a table with four rows (1x, 2x, 3x, 4x). Add columns for position value, loss on a 10% fall, and loss as a percentage of own capital.
2. Use own capital of Rs 50,000 and a 10% fall in every row.
3. Add a column for the wipe-out move (1 / ratio). Check each row against the worked example.
4. Write it in your journal. If the journal app is not ready, use paper.

The Kite demo has no practice path for leverage. Do not look for leverage features in it.

## Limits and common mistakes

- This table leaves out financing costs, charges and margin rules. Those matter in real life. Check them with the broker and the regulator.
- The wipe-out formula is for a long position. It ignores costs. A gap can take the price past the wipe-out line (*Slippage, gaps and planned versus actual risk*).
- Leverage does not improve a plan. It multiplies whatever the plan does, in both directions.
- A stop does not protect you from margin calls or forced sales. The quiz explains why.
- The 2x example is arithmetic only. It is not an offer and not a product.

## Remember

- Leverage ratio = position value / own capital.
- Gains and losses are both multiplied by the ratio.
- Wipe-out move = 1 / ratio, for a long position, ignoring costs.
- Margin can bring financing costs and forced sales at a bad price.
- The book does not teach leverage in practice. Leverage is not a route to a target.

## Sources and verification

Sources, read on 11 Nov 2026:

- SEBI circulars on peak margin and upfront margin (sebi.gov.in), as summarised in public broker guides. The 1 September 2021 date is from those summaries, so read the SEBI circular itself too.
- Zerodha support: margin trading facility (MTF) interest and FAQs.
- Zerodha support: intraday auto square-off timings and charges.
- Zerodha bulletin on intraday (MIS) leverage, which says leverage can be reduced during the day.

<!-- standing-disclaimer -->
