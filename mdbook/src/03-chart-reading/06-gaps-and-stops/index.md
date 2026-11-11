<!-- meta
id: T3.6
title: Gaps and what they mean for stops
page_type: Concept
prerequisites: [T3.1, T1.6, T1.7]
labs: [Lab 1, Lab 4]
estimated_minutes: 25
-->

# Gaps and what they mean for stops

## Hook

**Hypothetical.** A trader buys 100 shares at Rs 400, with a stop at Rs 390. The planned loss is Rs 1,000. The next morning the stock opens at Rs 380, below the stop. The stop does not get filled at Rs 390. The loss is about Rs 2,000, which is twice the plan. This chapter explains why the stop did not protect the planned amount.

## The idea

A **gap** is an open that differs from the previous close. No trading happens between the two prices. The gap is the empty space on the chart between the old close and the new open.

Overnight news and events are common causes of gaps. This book does not predict gaps. It explains what a gap does to a stop.

A **stop order** is a trigger. When the market reaches the trigger price, the stop becomes a market order or a limit order. From that point, the fill depends on the market at that moment. A trigger price is not a guaranteed fill price.

If the open is already beyond the stop, the fill is near the open, not at the stop price. This is called a **gap through stop**. The stop did not limit the loss to the planned amount.

**Planned risk** is entry minus stop, times shares. **Actual risk** is entry minus the real fill, times shares. Gaps make the two different.

Two more points:

- Circuit limits set how far a price may move in one session. A circuit limit can stop trading beyond a band, so an exit may not happen at all [VERIFY: NSE and SEBI circuit price band rules]. Circuit limits are covered in *Circuit limits and halts*.
- Size your position against a gap you can afford, not only against the stop distance. This is covered in *Slippage*.

Gap percent = (open minus previous close) divided by previous close, times 100. A negative gap percent means the open was below the previous close.

## See it

The sl-trigger-sim shows the trigger, the open and the fill side by side. It runs in gap-through-stop mode.

<!-- component: sl-trigger-sim | mode: gap-through-stop | prevClose: 400 | entry: 400 | stop: 390 | open: 380 | shares: 100 | caption: Trigger at Rs 390, open at Rs 380, hypothetical fill near the open; the trigger, the open and the fill are shown side by side -->

Look at the trigger price first. Then look at the open. The fill sits near the open, not at the trigger. Compare the planned loss with the actual loss.

## Worked example

**Hypothetical.** Previous close Rs 400. Entry Rs 400. Stop Rs 390. Size 100 shares. The next day opens at Rs 380.

| Step | Calculation | Result |
|---|---|---|
| Planned loss | 100 x (400 minus 390) | Rs 1,000 |
| Gap percent | (380 minus 400) divided by 400 | minus 5% |
| Fill (hypothetical) | near the open | about Rs 380 |
| Actual loss | 100 x (400 minus 380) | Rs 2,000 |
| Ratio | 2,000 divided by 1,000 | 2 times the plan |

The stop triggered, and the fill was near the open of Rs 380. The actual loss was twice the planned loss. All figures are illustrative.

## Try it

### Guided exercise

**Task.** **Hypothetical.** The same trade as the worked example: previous close Rs 400, entry Rs 400, stop Rs 390, 100 shares. This time the open is Rs 385. Compute the gap percent, the actual loss and the ratio of actual loss to planned loss.

Hints:

1. The gap percent uses the previous close, which is Rs 400.
2. The actual loss per share is the entry minus the fill. The fill is the open here.
3. Divide the actual loss by the planned loss.

**Answer:** Gap percent = (385 minus 400) divided by 400 = minus 15 divided by 400 = minus 3.75%. Actual loss = 100 x (400 minus 385) = 100 x 15 = Rs 1,500. Planned loss = Rs 1,000. Ratio = 1,500 divided by 1,000 = 1.5.

### Independent exercise

**Task.** **Hypothetical.** Previous close Rs 250. Assume the entry is at Rs 250. Stop Rs 240. Size 50 shares. The open is Rs 228. Compute the planned loss, the actual loss and the ratio.

<details><summary>Check your answer</summary>

- Planned loss: 50 x (250 minus 240) = 50 x 10 = Rs 500.
- Actual loss: 50 x (250 minus 228) = 50 x 22 = Rs 1,100. Check: 50 x 20 = 1,000, and 50 x 2 = 100, which adds to 1,100.
- Ratio: 1,100 divided by 500 = 2.2.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks gap through stop, the planned and actual loss, and sizing against a gap.

## Paper task

Mode: **paper**. Log it in your journal, or on paper if the journal is not ready.

1. Build a watchlist of stocks you are allowed to view.
2. For one month, log every gap above 2 percent on the watchlist.
3. For each gap, write the size and the direction.
4. Write whether a stop at a distance you chose would have been passed.
5. Make no outcome predictions. Record only what happened.

## Limits and common mistakes

- A stop is a trigger, not insurance. It does not promise the fill price.
- A gap through stop can make the loss several times the planned loss. The planned loss is not a limit.
- Gap percent is not rupees. A 5 percent gap on Rs 400 is Rs 20 per share. Keep the two measures apart.
- Circuit limits can prevent an exit beyond a price band. Check the current rules before you rely on any exit (*Circuit limits and halts*). [VERIFY: NSE and SEBI circuit price band rules]
- Compare the planned loss with the largest gap you consider plausible. Keep that loss inside your risk budget (*Slippage*).

## Remember

- A gap is an open that differs from the previous close, with no trading between.
- A stop becomes an order at its trigger. The fill depends on the market then.
- In a gap through stop, the fill is near the open, not at the stop price.
- Planned loss is not the same as actual loss when gaps occur.
- Size against the gap you can afford, not only the stop distance.

## Sources and verification

- NSE India, market timings and circuit-limit pages
- SEBI circulars on price bands
- Zerodha support, stop-order articles

[VERIFY: NSE and SEBI circuit price band rules]
[VERIFY: NSE market timings for the cash-market session open and close]
[VERIFY: how Kite handles triggered stop orders across a gap]

<!-- facts-needed: circuit price band rules and their effect on exits; cash-market session open and close times; how Kite handles triggered stop orders across a gap. -->

<!-- standing-disclaimer -->
