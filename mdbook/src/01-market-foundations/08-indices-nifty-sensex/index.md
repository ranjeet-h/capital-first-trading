<!-- meta
id: T1.8
title: Indices: Nifty and Sensex
page_type: Concept
prerequisites: [T1.1, T1.4]
labs: []
estimated_minutes: 20
-->

# Indices: Nifty and Sensex

## Hook

On a day when an index rises 1.6%, a friend says, "The market is up. My holdings must be up too." This is a hypothetical example. You hold Rs 50,000 in one stock. That stock falls 2% that day. Your holding is down Rs 1,000, while the index is up. The index sums up many stocks. It does not sum up your stock.

## The idea

An **index** is one number that sums up a group of stocks. Nifty and Sensex are two such indices. The number is a level, measured in points. It is not a price you can pay. You cannot buy one share of an index.

**Weighting.** Each stock in the group has a weight. The weight is its share of the index. All the weights add up to 100%. The common method is based on market size, with an adjustment for shares that are free to trade. This is called the free-float market-capitalisation method. The Nifty 50 has 50 stocks. The Sensex has 30 stocks. Both use this method. The three-stock and five-stock examples below are made up to keep the arithmetic short. (As of 11 Nov 2026, NSE Indices methodology document, June 2026, and BSE Indices methodology, May 2026. Methods change, so check the NSE and BSE sites.)

**Point change and percent change.**

- Point change = new level minus previous level.
- Percent change = point change divided by previous level, times 100.

**Contribution of one stock.** Weight times that stock's move. The index move is the total of all the contributions.

**Breadth.** Breadth counts how many stocks in the group rose and how many fell. An index can rise even when many stocks fall. This happens if the heavily weighted stocks rise. Breadth is context, not a forecast.

**Broad and sectoral indices** measure different groups. A broad index covers a wide set of stocks. A sectoral index covers one sector.

**Index-linked products** are not covered in this track. They are covered later in the book.

**Rebalancing.** The stocks in an index are reviewed on a schedule. For the Nifty 50, NSE reviews the list twice a year, using six months of data that end in January and July. Changes take effect from the last trading day of March and September, with about four weeks of notice. NSE allows at most 5 changes in a calendar year. The Sensex is reviewed twice a year too. Its changes take effect on the Monday after the third Friday of June and December. (As of 11 Nov 2026, NSE Indices methodology document, June 2026, and BSE Indices methodology, May 2026. Check the NSE and BSE sites for the latest.)

**What an index move tells you.** It describes the group of stocks. It does not tell you what one stock will do. It is not a trade signal by itself.

## See it

The table shows a three-stock index. It uses the weights and moves from the worked example. The last column is weight times move.

| Stock | Weight | Move | Contribution to index |
|---|---|---|---|
| A | 50% | +4% | +2.0% |
| B | 30% | -2% | -0.6% |
| C | 20% | +1% | +0.2% |
| Total | 100% | | +1.6% |

Read the contribution column. Stock A moves the index most. It has the largest weight and the largest move. Stock B falls. The index still rises, because the fall in B is smaller than the rise in A.

<!-- component: index-calculator | preset: chapter | level: 20000 | holding: 50000 | caption: The chapter's three-stock index: A +4%, B -2%, C +1% gives +1.6%. Change a price and watch the index. Try the five-stock example too. -->

## Worked example

This is a hypothetical index move. The index goes from 20,000 to 20,400.

| Step | Calculation | Result |
|---|---|---|
| Point change | 20,400 - 20,000 | +400 points |
| Percent change | 400 / 20,000 x 100 | +2.0% |

This is a hypothetical weighted example, for illustration only. The weights and moves come from the table above.

| Step | Calculation | Result |
|---|---|---|
| Stock A contribution | 0.50 x 4 | +2.0 |
| Stock B contribution | 0.30 x (-2) | -0.6 |
| Stock C contribution | 0.20 x 1 | +0.2 |
| Index move | 2.0 - 0.6 + 0.2 | +1.6% |

A holding of Rs 50,000 in Stock B falls 2%. That is 50,000 x 0.02 = Rs 1,000. The index still rose 1.6%.

## Try it

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
- Index move = 1.2 - 0.35 - 1.0 = -0.15%. The index falls, even though the first stock rose.
- Effect on Rs 20,000 in the first stock: 20,000 x 0.03 = Rs 600 gain.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions. They cover point and percent change, weights, what an index does and does not say, and the index level as a number.

## Paper task

**Mode: learning note.**

1. Pick one broad index.
2. Open the exchange site for that index. Find the current layout yourself.
3. Record its closing value for five trading days. Write down the source page and the date for each value.
4. Compute each day's point change and percent change.
5. Write no conclusions. Write your numbers in your journal.

## Limits and common mistakes

- An index move describes a group of stocks. It does not describe your stock.
- A rising index does not mean every stock rose. Breadth and weights matter.
- The index level is a number of points, not a price in rupees.
- An index move is not permission to trade.
- Weights and methods change at rebalancing. The stocks shown here may not be current.

## Remember

- An index is a weighted group of stocks, summed up as one number.
- Percent change = point change divided by the previous level.
- Index move = the total of weight x stock move.
- A heavily weighted stock can move the index more than a light one.
- An index is market context. It is not a trade signal.

## Sources and verification

Sources:
- NSE Indices methodology documents.
- BSE index pages.
- Zerodha Varsity, for reference only (link only, no text copied).

Facts checked on 11 Nov 2026:
- The Nifty 50 has 50 stocks and uses the free-float market-capitalisation method. Its review schedule comes from NSE Indices' methodology document of June 2026.
- The Sensex has 30 stocks, is drawn from the BSE 100, and is reviewed twice a year. This comes from BSE's Indices methodology of May 2026.
- This chapter does not list index constituents or their weights, because they change. Check the NSE and BSE sites.


<!-- standing-disclaimer -->
