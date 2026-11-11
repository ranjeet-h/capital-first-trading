<!-- meta
id: T2.12
title: Overtrading and why daily profit targets encourage it
page_type: Math/Calculator
prerequisites: [T2.8, T2.11, T0.2]
labs: [Lab 3]
estimated_minutes: 25
-->

# Overtrading and why daily profit targets encourage it

## Hook

Hypothetical: a trader sets a daily profit goal of Rs 2,000. By mid-morning the day is down Rs 300. No setup from the checklist has appeared. The trader takes a trade "to get back on track". The trade is not on the checklist, and it loses. The target did not cause the first loss. It changed the second decision. That is the pattern this chapter measures.

## The idea

**Expectancy** is the average result per trade over many trades. It counts wins and losses together. Measured in R (the rupee amount risked on one trade), an expectancy of 0.1R means the average trade makes one tenth of one R.

**Costs** are paid on every trade. So they lower that average:

- Net expectancy per trade = expectancy - cost per round trip. A round trip is one buy and one sell.

**Trades needed** to reach a target, on average:

- Trades needed = target / net expectancy per trade.
- Short form: N = T / E_net, where N is trades, T is the target and E_net is net expectancy.

Three things follow:

1. **Small expectancy means many trades.** A small average needs a large number of trades to add up to a daily target.
2. **Costs change the count.** Each rupee of cost you remove from the average cuts the number of trades needed.
3. **No positive net expectancy means no count works.** If E_net is zero or below, no number of trades reaches the target on average. More trades only add more of a negative average.

A daily target also works as pressure. It makes a no-trade day feel like a loss. That pushes a trader to take trades when no setup exists. More trades mean more exposure to random price moves (noise), more costs and more chances to break a rule. Costs are covered in *Costs on a trade*.

Signs of overtrading in a journal:

- Trades placed outside the checklist.
- Trade count above the daily limit.
- Size increased on a later trade.
- A trade placed to recover an earlier loss.

Your Rs 2,000-3,000 figure is tested in *The Rs 2,000-3,000 reality check*. It is not a goal for any strategy.

<!-- OPEN: spec *Overtrading and why daily profit targets encourage it* says the Rs 2,000-3,000 figure is "a ceiling, not a target", while PLAN section 2 calls it a daily target. This draft refers only to the *The Rs 2,000-3,000 reality check* test. Reviewer to confirm wording. -->

## See it

This is a static table. The target is fixed at Rs 2,000 a day. Each row shows how the number of trades rises as net expectancy falls.

| Net expectancy per trade (Rs) | Trades needed per day | Note |
|---|---|---|
| 50 | 40 | Before costs in the worked example |
| 25 | 80 | |
| 20 | 100 | |
| 10 | 200 | After the dummy cost in the worked example |
| 0 or below | No count reaches the target on average | |

Read down the table. When net expectancy halves, the trade count doubles. The 200-trade row is where the worked example lands once costs are included.

## Worked example

**Hypothetical.** For arithmetic only, not an estimate: R = Rs 500 (1% of Rs 50,000). Expectancy = 0.1 x 500 = Rs 50 per trade. Target = Rs 2,000 a day.

| Step | Calculation | Result |
|---|---|---|
| 1. Trades needed before costs | 2,000 / 50 | 40 trades a day |
| 2. Over 250 trading days (assumed) | 40 x 250 | 10,000 trades a year |
| 3. Dummy cost per round trip | Rs 40 assumed | Net expectancy = 50 - 40 = Rs 10 |
| 4. Trades needed after costs | 2,000 / 10 | 200 trades a day |
| 5. Over 250 trading days (assumed) | 200 x 250 | 50,000 trades a year |

The cost assumption turns a 40-trade day into a 200-trade day. The Rs 40 figure is a DUMMY value, used for arithmetic only. It is not a real broker fee or government charge.

## Try it

This chapter has no interactive demo. Use the table in See it and the guided exercise below.

<!-- OPEN: spec gives no interactive demo for *Overtrading and why daily profit targets encourage it*; the See it table is static. -->

### Guided exercise

**Task.** Target Rs 1,000 a day. Expectancy Rs 25 per trade. DUMMY cost Rs 15 per trade. Work out the trades needed before costs and after costs.

Hints:

1. Work out the net expectancy first: expectancy minus cost.
2. Divide the target by the expectancy, then by the net expectancy.
3. Check: the after-cost count should be larger than the before-cost count.

**Answer:** Before costs, 1,000 / 25 = 40 trades. Net expectancy 25 - 15 = Rs 10. After costs, 1,000 / 10 = 100 trades.

### Independent exercise

**Task.** Target Rs 3,000 a day. R = Rs 400. Expectancy is 0.15R. DUMMY cost Rs 30 per trade. Work out the net expectancy, the trades per day and the trades per week over five trading days.

<details><summary>Check your answer</summary>

Expectancy = 0.15 x 400 = Rs 60 per trade.

Net expectancy = 60 - 30 = Rs 30 per trade.

Trades per day = 3,000 / 30 = 100.

Trades per week = 100 x 5 = 500. Check: 500 / 5 = 100 per day.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover the trades-needed math, the effect of costs, the wrong idea that more trades even out an average, the overtrading signs and the no-trade day.

## Paper task

Mode: **learning note** (Lab 3). No orders are placed.

1. Log the trade count for each day of one week. Use made-up or learning entries only.
2. Add a "checklist passed (Y/N)" column for each trade.
3. Record one no-trade day and the reason: no setup passed the checklist.
4. Count the trades that failed the checklist. Note any trade placed to recover a loss.

Write it in your journal. If the journal app is not ready, use paper.

## Limits and common mistakes

- Expectancy is an average of past or assumed trades. It does not predict any single day.
- The costs here are DUMMY values. Real costs are in *Costs on a trade* and Lab 2.
- A lower trade count does not promise a profit. It cuts the exposure to costs and rule breaks.
- The maximum trades per day is your choice. This chapter does not set one.
- A no-trade day is a valid result. It is not proof of skill either.

## Remember

- Trades needed = target / net expectancy per trade.
- Costs apply to every trade, so they raise the count.
- A daily target can make a no-trade day feel like a failure. That pushes trades with no setup.
- Set a maximum trades per day in advance. Count a no-trade day as a valid result.
- Watch four journal signs: trades outside the checklist, trade count above the limit, larger size, and trades placed to recover a loss.

## Sources and verification

Sources (names only):

- *Discipline* (discipline) and *Loss aversion and revenge trading* (revenge trading), for the behaviour links.

Facts to verify before this chapter is final: none. The costs in this chapter are DUMMY values, and their real counterparts are checked in *Costs on a trade*.

<!-- standing-disclaimer -->
