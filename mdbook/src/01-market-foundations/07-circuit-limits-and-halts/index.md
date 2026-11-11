---
id: T1.7
title: Circuit limits, price bands and trading halts
page_type: Concept
prerequisites: [T1.4, T1.6]
labs: []
estimated_minutes: 20
---

# Circuit limits, price bands and trading halts

## Hook

You hold 100 shares bought at Rs 400, with a stop-loss at Rs 380. Your planned loss is Rs 2,000. Hypothetical: the next day the stock falls straight to the lower price band of Rs 360, and there are only sellers, no buyers. Your stop is triggered in theory, but no trade happens at Rs 380. You are now looking at a Rs 4,000 loss on paper, and you cannot get out at the price you planned.

## The idea

A **price band**, often called a **circuit limit**, is the maximum a stock's price may move in one day, measured from the previous close. The band depends on the stock's category. [VERIFY: band categories and percentages, NSE circuit limits page]

- **Upper circuit:** the highest price allowed that day.
- **Lower circuit:** the lowest price allowed that day.
- **Reference point:** the band is measured from the previous close, not from today's open. [VERIFY: band reference, NSE rule]

In plain words:

- Upper band = previous close, plus the band percentage of the previous close.
- Lower band = previous close, minus the band percentage of the previous close.

**Locked circuit.** When a stock reaches a band and all the orders are on one side (for example, only sellers at the lower band), no trade can happen beyond that price. The price is then "locked" there until orders on both sides meet or the band changes.

**Trading halts and index-level circuit breakers.** The exchange can halt trading in a stock, or across the market when an index moves past set levels. The levels and rules are [VERIFY: halt rules, NSE and SEBI circulars] [VERIFY: index circuit breaker levels].

**Bands can change.** The band for a stock can be revised over time. [VERIFY: band revision rule]

**A circuit limits the price, not the loss.** The band stops the price from moving further in one day. It does not stop your position from losing value. If the stock is locked, you may be unable to exit at all until trading resumes.

## See it

<!-- component: sl-trigger-sim | prevClose: 400 | bandPct: 10 | qty: 100 | stop: 380 | scenario: locked-lower | caption: Holding of 100 shares, stop at 380, stock locked at the lower band of 360 with no buyers -->

Watch the stop-loss trigger line at Rs 380 and the lower band at Rs 360. Notice that the price can pass the trigger and reach the band without any trade at the trigger price. The fill is blocked while the circuit is locked. The band percentage in this view is a dummy value, for arithmetic only.

## Worked example

Hypothetical. Previous close Rs 400. Dummy band of 10%. The real band for any stock is [VERIFY: band percentage for its category].

| Step | Calculation | Result |
|---|---|---|
| Upper band | 400 x 1.10 | Rs 440 |
| Lower band | 400 x 0.90 | Rs 360 |
| Stop-loss | Set on the holding | Rs 380 |
| Planned loss per share | 400 - 380 | Rs 20 |
| Planned loss on 100 shares | 100 x 20 | Rs 2,000 |
| Loss if locked at Rs 360 with no exit | 100 x (400 - 360) | Rs 4,000 |

The loss at the locked band is 2 times the planned loss of Rs 2,000. The planned figure assumed a fill at Rs 380. The locked figure is what happens when the fill is not available at Rs 380.

## Try it

<!-- component: sl-trigger-sim | prevClose: 250 | bandPct: 20 | qty: 100 | caption: Guided exercise numbers, dummy band of 20 percent -->

### Guided exercise

**Task.** Previous close Rs 250. Dummy band of 20%. Compute the upper and lower bands.

Hints:
1. Find 20% of Rs 250.
2. Add that amount to Rs 250 for the upper band.
3. Subtract it from Rs 250 for the lower band.

**Answer:** 20% of 250 = 50. Upper band = Rs 300. Lower band = Rs 200.
Check: 250 x 1.20 = 300; 250 x 0.80 = 200.

### Independent exercise

**Task.** Three stocks, with previous closes and dummy bands as follows: Rs 120 with a 5% band, Rs 800 with a 10% band, and Rs 1,500 with a 20% band. Compute each band. Which position is most exposed to a one-day move?

<details><summary>Check your answer</summary>

- Rs 120, 5%: 120 x 0.05 = 6. Upper Rs 126, lower Rs 114.
- Rs 800, 10%: 800 x 0.10 = 80. Upper Rs 880, lower Rs 720.
- Rs 1,500, 20%: 1,500 x 0.20 = 300. Upper Rs 1,800, lower Rs 1,200.

The Rs 1,500 stock with the 20% band is the most exposed. Its band allows a move of 20% in a day, which is the largest percentage, and Rs 300 per share, which is the largest rupee amount.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions on band arithmetic, what a circuit does and does not prevent, stops in a locked circuit, and the reference for the band.

## Paper task

**Mode: learning note.** Use a hypothetical plan only. Do not act on a real account.

1. Write a hypothetical holding: 100 shares, previous close Rs 400, stop-loss at Rs 380, dummy band of 10%.
2. Write what your plan says if the stock locks at the lower band on day one.
3. Write what your plan says if it is still locked on day two.
4. Write the largest loss you would accept on this holding, and check it against your trading capital (see T0.2 and T2.2).
5. Log it in your journal, or on paper until the journal app is ready.

## What this does NOT tell you

- The band percentages in this chapter are dummy values. Real bands are [VERIFY: band categories and percentages].
- A band does not cap your loss. A locked position can stay open and lose value.
- A stop-loss is a trigger, not a guaranteed exit price. Its fill depends on trading being possible.
- Halts and circuit breakers have their own rules, which change. Check the current circulars.
- Bands can change for a stock. Do not assume a band from last month still applies.

## Remember

- A band is measured from the previous close, as a percentage in each direction.
- Upper band = previous close x (1 + band). Lower band = previous close x (1 - band).
- A locked circuit can stop any trade beyond the band, including your exit.
- A circuit limits the price move. It does not limit your loss.
- Position size must allow for locked days (T2.6).

## Sources and verification

Sources:
- NSE circuit limits and price band pages.
- BSE price band pages.
- SEBI circulars on price bands and circuit breakers.

Facts to verify:
- [VERIFY: band categories and percentages, NSE circuit limits page]
- [VERIFY: band reference (previous close), NSE rule]
- [VERIFY: index-level circuit breaker levels and rules, NSE circular]
- [VERIFY: trading halt rules, SEBI and NSE circulars]
- [VERIFY: band revision rule]

Last content review: not yet done

<!-- facts-needed: band categories and percentages; band reference; index circuit breaker levels; halt rules; band revision rule -->

<!-- standing-disclaimer -->
