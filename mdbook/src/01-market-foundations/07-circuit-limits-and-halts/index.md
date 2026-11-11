<!-- meta
id: T1.7
title: Circuit limits and halts
page_type: Concept
prerequisites: [T1.4, T1.6]
labs: []
estimated_minutes: 20
-->

# Circuit limits and halts

## Hook

You hold 100 shares bought at Rs 400. Your stop-loss is at Rs 380. Your planned loss is Rs 2,000. This is a hypothetical example. The next day, the stock falls straight to the lower price band of Rs 360. There are only sellers and no buyers. Your stop is triggered in theory, but no trade happens at Rs 380. You now face a Rs 4,000 loss on paper. You cannot get out at the price you planned.

## The idea

A **price band**, often called a **circuit limit**, is the most a stock's price may move in one day. The move is measured from the previous close. The band depends on the stock's category. NSE uses bands of 2%, 5%, 10% and 20% in either direction. All other stocks that have no band set by the exchange get 20%. Stocks that have futures and options (F&O) have no fixed band. For them the exchange uses a 10% operating range that can be widened or narrowed during the day. (As of 11 Nov 2026, NSE Basic FAQs on the Secondary Market and SEBI's master circular on trading. Rules change, so check the NSE site.)

- **Upper circuit:** the highest price allowed that day.
- **Lower circuit:** the lowest price allowed that day.
- **Reference point:** the band is measured from the previous close, not from today's open. NSE's FAQs state that the band is measured from the previous day's close.

In plain words:

- Upper band = previous close, plus the band percentage of the previous close.
- Lower band = previous close, minus the band percentage of the previous close.

**Locked circuit.** A stock reaches a band. All the orders are on one side. For example, there are only sellers at the lower band. No trade can happen beyond that price. The price stays locked there until buyers and sellers meet, or until the band changes.

**Trading halts and index-level circuit breakers.** The exchange can halt trading in a stock. It can also halt trading across the market. This happens when an index moves past set levels. The levels and rules are below.

Market-wide circuit breakers use the Nifty 50 or the Sensex, whichever moves past a level first. The levels are 10%, 15% and 20% from the previous close.

| Fall of | When it happens | What happens |
|---|---|---|
| 10% | Before 1:00 pm | Trading stops for 45 minutes, then a 15-minute pre-open |
| 10% | 1:00 pm to 2:30 pm | Trading stops for 15 minutes, then a 15-minute pre-open |
| 10% | After 2:30 pm | No stop |
| 15% | Before 1:00 pm | Trading stops for 1 hour 45 minutes, then a 15-minute pre-open |
| 15% | 1:00 pm to 2:00 pm | Trading stops for 45 minutes, then a 15-minute pre-open |
| 15% | After 2:00 pm | Trading stops for the rest of the day |
| 20% | Any time | Trading stops for the rest of the day |

(As of 11 Nov 2026, NSE circuit breaker page and SEBI circular of 28 Jun 2001 as amended in 2013. Rules change, so check the NSE site.)

For stocks with futures and options, the 10% range is widened by steps if the price keeps pushing against it. SEBI's rule is 5% twice, then 3% twice, then 2%, with a cooling-off pause each time (15 minutes, then 30 minutes, then 60 minutes). (As of 11 Nov 2026, SEBI master circular on trading, Dec 2024.)

**Bands can change.** The band for a stock can be revised over time. NSE's FAQs say bands are lowered under surveillance measures, and raised only in a review done every two months if the stock meets the criteria. Some stocks are also placed in a "trade-for-trade" segment, where every trade must end in delivery and the shares cannot be sold the same day. (As of 11 Nov 2026, NSE Basic FAQs on the Secondary Market and Zerodha support.)

**A circuit limits the price, not the loss.** The band stops the price from moving further in one day. It does not stop your position from losing value. If the stock is locked, you may not be able to exit at all until trading resumes.

## See it

<!-- component: sl-trigger-sim | prevClose: 400 | bandPct: 10 | qty: 100 | stop: 380 | scenario: locked-lower | caption: Holding of 100 shares, stop at 380, stock locked at the lower band of 360 with no buyers -->

Watch the stop-loss line at Rs 380 and the lower band at Rs 360. The price can pass the stop and reach the band. No trade happens at the stop price. The fill is blocked while the circuit is locked. The band percentage in this view is a made-up value, used only for the arithmetic.

## Worked example

This is a hypothetical example. The previous close is Rs 400. The band is a made-up 10%. The 10% figure is a round number for practice. For most stocks the real band is 2%, 5%, 10% or 20%, as in the table in the section above. Stocks with futures and options use a flexible 10% range instead of a fixed band, so a lock like this one works differently for them.

| Step | Calculation | Result |
|---|---|---|
| Upper band | 400 x 1.10 | Rs 440 |
| Lower band | 400 x 0.90 | Rs 360 |
| Stop-loss | Set on the holding | Rs 380 |
| Planned loss per share | 400 - 380 | Rs 20 |
| Planned loss on 100 shares | 100 x 20 | Rs 2,000 |
| Loss if locked at Rs 360 with no exit | 100 x (400 - 360) | Rs 4,000 |

The loss at the locked band is 2 times the planned loss of Rs 2,000. The plan assumed a sale at Rs 380. The locked figure shows what happens when a sale at Rs 380 is not possible.

## Try it

<!-- component: sl-trigger-sim | prevClose: 250 | bandPct: 20 | qty: 100 | caption: Guided exercise numbers, dummy band of 20 percent -->

### Guided exercise

**Task.** The previous close is Rs 250. The made-up band is 20%. Compute the upper and lower bands.

Hints:
1. Find 20% of Rs 250.
2. Add that amount to Rs 250 for the upper band.
3. Subtract it from Rs 250 for the lower band.

**Answer:** 20% of 250 = 50. Upper band = Rs 300. Lower band = Rs 200.
Check: 250 x 1.20 = 300; 250 x 0.80 = 200.

### Independent exercise

**Task.** Three stocks. Each has a previous close and a made-up band. The first is Rs 120 with a 5% band. The second is Rs 800 with a 10% band. The third is Rs 1,500 with a 20% band. Compute each band. Which position is most exposed to a one-day move?

<details><summary>Check your answer</summary>

- Rs 120, 5%: 120 x 0.05 = 6. Upper Rs 126, lower Rs 114.
- Rs 800, 10%: 800 x 0.10 = 80. Upper Rs 880, lower Rs 720.
- Rs 1,500, 20%: 1,500 x 0.20 = 300. Upper Rs 1,800, lower Rs 1,200.

The Rs 1,500 stock with the 20% band is the most exposed. Its band allows a move of 20% in a day. That is the largest percentage. It also allows Rs 300 per share. That is the largest rupee amount.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions. They cover band arithmetic, what a circuit does and does not prevent, stops in a locked circuit, and the reference point for the band.

## Paper task

**Mode: learning note.** Use a hypothetical plan only. Do not act on a real account.

1. Write a hypothetical holding: 100 shares, previous close Rs 400, stop-loss at Rs 380, made-up band of 10%.
2. Write what your plan says if the stock locks at the lower band on day one.
3. Write what your plan says if it is still locked on day two.
4. Write the largest loss you would accept on this holding. Check it against your trading money. See *The capital-first rules* and *Costs on a trade*.
5. Write this in your journal.

## Limits and common mistakes

- The band percentages in the examples are round numbers for practice. Real bands are 2%, 5%, 10% and 20%, and stocks with futures and options use a flexible 10% range.
- A band does not cap your loss. A locked position can stay open and lose value.
- A stop-loss is a trigger, not a guaranteed exit price. Its fill depends on trading being possible.
- Halts and circuit breakers have their own rules, and those rules change. Check the current circulars.
- Bands can change for a stock. Do not assume a band from last month still applies.

## Remember

- A band is measured from the previous close, as a percentage in each direction.
- Upper band = previous close x (1 + band). Lower band = previous close x (1 - band).
- A locked circuit can stop any trade beyond the band, including your exit.
- A circuit limits the price move. It does not limit your loss.
- Your position size must allow for locked days. See *Slippage, gaps and planned versus actual risk*.

## Sources and verification

Sources:
- NSE circuit limits and price band pages.
- BSE price band pages.
- SEBI circulars on price bands and circuit breakers.

Facts checked on 11 Nov 2026:
- Band percentages, the previous-close reference and the revision rule come from NSE's Basic FAQs on the Secondary Market.
- The flexible range for stocks with futures and options comes from SEBI's master circular on trading (Dec 2024).
- Market-wide circuit breaker levels and halt times come from NSE's circuit breaker page and SEBI's circular of 28 Jun 2001, as amended in 2013.
- The trade-for-trade rule comes from Zerodha support and NSE's FAQs.


<!-- standing-disclaimer -->
