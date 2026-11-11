---
id: T2.11
title: Risk limits per trade, day, week and month
page_type: Math/Calculator
prerequisites: [T2.5, T2.10]
labs: [Lab 1, Lab 3]
estimated_minutes: 30
---

# Risk limits per trade, day, week and month

## Hook

Hypothetical: an account of Rs 50,000 plans to risk Rs 500 per trade. The first trade of the morning loses Rs 500, exactly as planned. The trader feels the day must be won back, takes a second trade that is bigger than planned, and loses Rs 1,500. The day ends at minus Rs 2,000, four times the Rs 500 planned for one trade. Nothing had set a limit for the day, so nothing stopped the second trade.

## The idea

Per-trade risk (T2.4 and T2.5) controls one trade. A **limit** controls a period. It is the most rupees you allow yourself to lose over a set time, written down before trading starts.

| Limit | What it caps | Illustrative size |
|---|---|---|
| Per trade | Planned loss on one trade | 1% of capital |
| Daily | All losses in one session | 2% of capital |
| Weekly | All losses in one week | 4% of capital |
| Monthly | All losses in one month | 8% of capital |
| Max trades per day | Number of trades | 2 |

The sizes are illustrations. You set every number.

- **Base.** Each percentage needs a stated base: starting capital, or current equity. Write the base on the limit card. A limit that moves with results is a rule that changes with results.
- **Rupee limit** = base x limit percentage.
- **Remaining limit** = rupee limit minus the losses already used in that period.
- **Stop rule.** When a limit is reached, the rule says what to do. A daily limit reached means no more trades that day. A weekly limit reached means no more trades that week. No revenge trades and no recovery attempts. A limit that the next trade can lift is not a limit.
- **Reduce exposure.** A pre-set rule that lowers risk after a drawdown, for example halving the per-trade risk percentage once the month's drawdown reaches a set level. It only ever moves risk down, and it is written before trading.
- **Two different figures.** Your Rs 2,000-3,000 figure is a daily profit goal that T2.16 tests against the arithmetic. It is not a loss limit. Do not use it as one.

<!-- OPEN: spec objective 5 calls the owner's Rs 2,000-3,000 figure "a ceiling and not a per-day risk"; T2.12 calls it "a ceiling, not a target". This draft describes it as a daily profit goal tested in T2.16. Reviewer to confirm wording. -->

Limits are a rule-based control. They cannot stop a gap that opens beyond a stop (T2.6). Brokers also have risk controls, which differ from the limits in this book [VERIFY: broker risk controls and intraday auto square-off rules].

## See it

<!-- component: risk-limit-simulator | capital: 50000 | perTradePct: 1 | dailyPct: 2 | weeklyPct: 4 | monthlyPct: 8 | maxTradesPerDay: 2 | caption: Ladder of limits for an illustrative Rs 50,000 account; each loss fills the ladder until the first breach shows a stop state -->

Read the ladder from the smallest limit upward: per trade, then daily, weekly and monthly. Each loss fills a rung. The first rung that fills decides the next action, and the stop state shows that no more trades are allowed. Compare how quickly the daily rung fills with how quickly the per-trade rung fills.

## Worked example

**Hypothetical.** Capital Rs 50,000. Limits: per trade 1%, daily 2%, weekly 4%, monthly 8%, two trades a day.

| Limit | Calculation | Rupees |
|---|---|---|
| Per trade | 50,000 x 1% = 50,000 x 0.01 | 500 |
| Daily | 50,000 x 2% = 50,000 x 0.02 | 1,000 |
| Weekly | 50,000 x 4% = 50,000 x 0.04 | 2,000 |
| Monthly | 50,000 x 8% = 50,000 x 0.08 | 4,000 |

**Day 1**

1. Trade 1 loses Rs 500. Daily used 500. Remaining 1,000 - 500 = Rs 500.
2. Trade 2 loses Rs 500. Daily used 1,000. Remaining 1,000 - 1,000 = Rs 0.
3. The daily limit is reached. Stop for the day. Trade 3 is not allowed.

**Day 2**

4. The day loses Rs 1,000. Weekly used = 1,000 (day 1) + 1,000 (day 2) = Rs 2,000. That equals the weekly limit. Stop for the week.

**Reduce exposure**

5. The month's drawdown reaches 10%: 10% x 50,000 = Rs 5,000.
6. The pre-set rule halves per-trade risk to 0.5%. On the starting-capital base: 0.5% x 50,000 = Rs 250.
7. On a current-equity base: equity is 50,000 - 5,000 = Rs 45,000, and 0.5% x 45,000 = Rs 225.

Steps 6 and 7 use the same rule and give different answers. That is why the base must be written down.

## Try it

Simulator with the guided exercise inputs:

<!-- component: risk-limit-simulator | capital: 30000 | perTradePct: 1 | dailyPct: 2 | weeklyPct: 4 | monthlyPct: 8 | lossPerTrade: 300 | caption: Guided exercise inputs; use the ladder to check each answer by hand -->

### Guided exercise

**Task.** Capital Rs 30,000 with per-trade 1%, daily 2%, weekly 4% and monthly 8%. Compute each limit in rupees. Then two losses of Rs 300 happen on the same day. What is left of the daily limit?

Hints:

1. Multiply capital by each percentage. Convert the percentage to a decimal first (1% = 0.01).
2. Add the day's losses before you subtract them from the daily limit.
3. Check that the per-trade limit is smaller than the daily limit.

**Answer:** Per trade Rs 300; daily Rs 600; weekly Rs 1,200; monthly Rs 2,400. Two losses of Rs 300 use Rs 600, so the remaining daily limit is 600 - 600 = Rs 0. The daily stop applies.

### Independent exercise

**Task.** Capital Rs 20,000. Daily limit 3%, weekly limit 6%, monthly limit 10%. Each trade loses Rs 150. How many losing trades until the daily limit is reached? Then state the stop rule in one sentence.

<details><summary>Check your answer</summary>

Daily limit = 20,000 x 3% = Rs 600. Each loss is Rs 150, so 600 / 150 = 4 trades. Check: 4 x 150 = 600.

Stop rule (sample wording): once the daily limit is reached, no more trades that day, whatever the setup looks like.

For reference: the weekly limit is Rs 1,200 and the monthly limit is Rs 2,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover limit arithmetic, the stop rule, the reduce-exposure rule and the base. Each wrong answer has an explanation.

## Paper task

Mode: **learning note** (Lab 3). No orders are placed.

1. Write a one-page limit card: capital, base, per-trade, daily, weekly and monthly limits, max trades per day, and the stop rule.
2. Compute each rupee limit from your hypothetical capital. Show each multiplication.
3. Log it in your journal (or on paper until the journal app is ready). Keep a "remaining daily limit" line for five hypothetical days.
4. For each day, record the losses used and the remaining amount. Mark any day on which a limit would have stopped trading.

## What this does NOT tell you

- Limits do not stop gaps. A stop at a limit can fill well below the stop price, so the realised loss can be larger than the plan (T2.6).
- The percentages are illustrations, not recommendations. You set every number before trading.
- A broker's risk controls are not your limits, and the broker rules are [VERIFY: broker risk controls and intraday auto square-off rules].
- Limits do not fix a plan that has no edge. They only cap the damage in each period.
- A limit card works only if the stop rule is followed. The common failure is trading again after the stop.

## Remember

- A limit caps losses over a period, in rupees, and is set before trading.
- Write the base (starting or current capital) on the card.
- When a limit is reached, the stop rule applies: no more trades in that period.
- Reduce exposure is a pre-set rule that lowers risk after a drawdown. It never raises risk.
- Limits cannot prevent a gap loss larger than the planned amount.

## Sources and verification

Sources (names only):

- The book's Lab 1 and Lab 3 specifications (LABS.md).
- Zerodha support pages on risk controls.
- SEBI circulars on risk management.

Facts to verify before this chapter is final:

- [VERIFY: broker risk controls and intraday auto square-off rules]

<!-- facts-needed: broker risk controls and intraday auto square-off rules (Zerodha support pages; SEBI circulars) -->

<!-- OPEN: default limit percentages are the owner's decision. The chapter uses illustrative placeholders only. -->

Last content review: not yet done

<!-- standing-disclaimer -->
