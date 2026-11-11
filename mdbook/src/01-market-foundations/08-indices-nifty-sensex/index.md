<!-- meta
id: T1.8
title: Indices (Nifty, Sensex) and what they measure
page_type: Concept
prerequisites: [T1.1, T1.4]
labs: []
estimated_minutes: 20
-->

# Indices (Nifty, Sensex) and what they measure

## Hook

On a day when an index rises 1.6%, a friend says "the market is up, so my holdings must be up too." Hypothetical: you hold Rs 50,000 in one stock that falls 2% that day. Your holding is down Rs 1,000 while the index is up. The index is a summary of many stocks. It is not a summary of your stock.

## The idea

An **index** is a single number that summarises a basket of stocks. Nifty and Sensex are two such indices. The number is a level, measured in points. It is not a price you can pay, and you cannot buy one share of an index.

**Weighting.** Each stock in the basket has a weight, which is its share of the index. The weights add up to 100%. The commonly used method is based on market capitalisation with a free-float adjustment. [VERIFY: index weighting methodology, NSE indices methodology document]

**Point change and percent change.**

- Point change = new level minus previous level.
- Percent change = point change divided by previous level, multiplied by 100.

**Contribution of one stock.** Weight multiplied by that stock's move. The index move is the sum of all the contributions.

**Breadth.** How many stocks in the basket rose and how many fell. An index can rise even when many stocks fall, if the heavily weighted stocks rise. Breadth is context, not a forecast.

**Broad and sectoral indices** measure different baskets. A broad index covers a wide set of stocks. A sectoral index covers one sector.

**Index-linked products** are not covered in this track. They are discussed only in Track 9. [VERIFY: product list if index-linked products are mentioned]

**Rebalancing.** The index composition is reviewed on a schedule. [VERIFY: rebalancing schedule, NSE indices]

**What an index move tells you.** It describes the basket. It does not tell you what a specific stock will do, and it is not a trade signal by itself.

## See it

The table shows a three-stock index with the weights and moves from the worked example. The last column is weight multiplied by move.

| Stock | Weight | Move | Contribution to index |
|---|---|---|---|
| A | 50% | +4% | +2.0% |
| B | 30% | -2% | -0.6% |
| C | 20% | +1% | +0.2% |
| Total | 100% | | +1.6% |

Read the contribution column. Stock A moves the index most, because it has the largest weight and the largest move. Stock B falls, yet the index still rises, because its fall is smaller than the rise in A.

<!-- OPEN: spec asks for a static weighted bar chart. No static component is in the list, so a table is used here. Confirm. -->

## Worked example

Hypothetical index move: 20,000 to 20,400.

| Step | Calculation | Result |
|---|---|---|
| Point change | 20,400 - 20,000 | +400 points |
| Percent change | 400 / 20,000 x 100 | +2.0% |

Hypothetical weighted example (illustrative only). Weights and moves are from the table above.

| Step | Calculation | Result |
|---|---|---|
| Stock A contribution | 0.50 x 4 | +2.0 |
| Stock B contribution | 0.30 x (-2) | -0.6 |
| Stock C contribution | 0.20 x 1 | +0.2 |
| Index move | 2.0 - 0.6 + 0.2 | +1.6% |

A holding of Rs 50,000 in Stock B falls 2%. That is 50,000 x 0.02 = Rs 1,000, even though the index rose 1.6%.

## Try it

<!-- OPEN: spec gives no interactive demo for this chapter. No component placeholder is inserted. -->

### Guided exercise

**Task.** An index falls from 18,000 to 17,640. Compute the point change and the percent change.

Hints:
1. Point change = new level minus old level.
2. Percent change = point change divided by the old level.
3. Keep the minus sign.

**Answer:** Point change = 17,640 - 18,000 = -360 points. Percent change = -360 / 18,000 = -2.0%.
Check: 2% of 18,000 = 360.

### Independent exercise

**Task.** A three-stock index has weights of 40%, 35% and 25%. The moves are +3%, -1% and -4%, in the same order. Compute the index move. Then compute the effect on a Rs 20,000 holding in the first stock.

<details><summary>Check your answer</summary>

- Contributions: 0.40 x 3 = +1.2; 0.35 x (-1) = -0.35; 0.25 x (-4) = -1.0.
- Index move = 1.2 - 0.35 - 1.0 = -0.15%. The index falls even though the first stock rose.
- Effect on Rs 20,000 in the first stock: 20,000 x 0.03 = Rs 600 gain.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions on point and percent change, weights, what an index does and does not say, and the index level as a number.

## Paper task

**Mode: learning note.**

1. Pick one broad index.
2. Open the exchange site for that index. Check the current layout yourself.
3. Record its closing value for five trading days, with the source page and the date you copied each value.
4. Compute each day's point change and percent change.
5. Write no conclusions. Log it in your journal, or on paper until the journal app is ready.

## What this does NOT tell you

- An index move describes a basket. It does not describe your stock.
- A rising index does not mean every stock rose. Breadth and weights matter.
- The index level is a number of points, not a price in rupees.
- An index move is not permission to trade.
- Weights and methods change at rebalancing. The composition shown here is not current.

## Remember

- An index is a weighted basket summarised as one number.
- Percent change = point change divided by the previous level.
- Index move = the sum of weight x stock move.
- A heavily weighted stock can move the index more than a light one.
- An index is market context. It is not a trade signal.

## Sources and verification

Sources:
- NSE Indices methodology documents.
- BSE index pages.
- Zerodha Varsity, as reference only (link, no text copied).

Facts to verify:
- [VERIFY: index constituents and weighting methodology, NSE indices methodology document]
- [VERIFY: rebalancing schedule, NSE indices]
- [VERIFY: product list, if index-linked products are mentioned]

Last content review: not yet done

<!-- facts-needed: index constituents and weighting methodology for the main indices; rebalancing schedule; index-linked product list -->

<!-- standing-disclaimer -->
