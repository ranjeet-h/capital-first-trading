<!-- meta
id: T2.11
title: Risk limits
page_type: Math/Calculator
prerequisites: [T2.5, T2.10]
labs: [Lab 1, Lab 3]
estimated_minutes: 30
-->

# Risk limits

## Hook

Hypothetical: an account has Rs 50,000. You plan to risk Rs 500 on each trade. The first trade of the morning loses Rs 500, as planned. You feel you must win the money back. So you take a second trade that is bigger than planned, and it loses Rs 1,500. The day ends at minus Rs 2,000. That is four times the Rs 500 you planned for one trade. No limit was set for the day, so nothing stopped the second trade.

## The idea

Per-trade risk controls one trade. See *Risk per trade and stop-loss distance* and *Position sizing step by step*. A **limit** controls a period. It is the most rupees you allow yourself to lose over a set time. You write it down before trading starts.

| Limit | What it caps | Example size |
|---|---|---|
| Per trade | Planned loss on one trade | 1% of capital |
| Daily | All losses in one day | 2% of capital |
| Weekly | All losses in one week | 4% of capital |
| Monthly | All losses in one month | 8% of capital |
| Max trades per day | Number of trades | 2 |

The sizes are examples. You set every number.

- **Base.** Each percentage needs a stated base. The base is your starting capital or your current equity (what the account is worth now). Write the base on the limit card. A limit that moves with your results is not a fixed rule.
- **Rupee limit** = base x limit percentage.
- **Remaining limit** = rupee limit minus the losses already used in that period.
- **Stop rule.** When a limit is reached, the rule says what to do. If the daily limit is reached, you make no more trades that day. If the weekly limit is reached, you make no more trades that week. No revenge trades, which are trades made to win back a loss. No recovery attempts. A limit that the next trade can lift is not a limit.
- **Reduce exposure.** A rule set in advance that lowers your risk after a drop in the account. For example, you halve your per-trade risk percentage once the month's drawdown (the fall from the account's high point) reaches a set level. It only ever moves risk down. You write it before trading.
- **Two different figures.** Your Rs 2,000-3,000 figure is a daily profit goal. *The Rs 2,000-3,000 reality check* tests it against the arithmetic. It is not a loss limit. Do not use it as one.

A limit is a rule you set and follow yourself. Limits cannot stop a gap, where the price jumps past your stop (*Slippage, gaps and planned versus actual risk*). Brokers also have risk controls. They are different from the limits in this book.

- For intraday (MIS) positions, Zerodha closes open positions automatically at a set time. For shares it is 3:25 PM for most shares and 3:12 PM for shares in the closing auction session. For futures and options it is 3:26 PM. Zerodha charges Rs 50 plus 18% GST for each order it closes this way.
- Zerodha's risk team can change these times, and can reduce or remove intraday leverage during the day.
- Zerodha says you are responsible for closing your own intraday positions. It is not bound to do it for you.

(As of 11 Nov 2026, Zerodha support page on auto square-off timings, and the Zerodha announcement of 26 Dec 2025 that moved the share time from 3:20 PM to 3:25 PM. Rules change, so check Zerodha support.)

## See it

<!-- component: risk-limit-simulator | capital: 50000 | perTradePct: 1 | dailyPct: 2 | weeklyPct: 4 | monthlyPct: 8 | maxTradesPerDay: 2 | caption: Ladder of limits for an illustrative Rs 50,000 account; each loss fills the ladder until the first breach shows a stop state -->

Read the ladder from the smallest limit upward: per trade, then daily, weekly and monthly. Each loss fills one step. The first step that fills decides your next action. The stop state shows that no more trades are allowed. Compare how fast the daily step fills with how fast the per-trade step fills.

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
6. The rule set in advance halves per-trade risk to 0.5%. On the starting-capital base: 0.5% x 50,000 = Rs 250.
7. On a current-equity base: equity is 50,000 - 5,000 = Rs 45,000, and 0.5% x 45,000 = Rs 225.

Steps 6 and 7 use the same rule but give different answers. That is why you must write the base down.

## Try it

Use the simulator with the guided exercise inputs:

<!-- component: risk-limit-simulator | capital: 30000 | perTradePct: 1 | dailyPct: 2 | weeklyPct: 4 | monthlyPct: 8 | lossPerTrade: 300 | caption: Guided exercise inputs; use the ladder to check each answer by hand -->

### Guided exercise

**Task.** Capital is Rs 30,000. Per-trade 1%, daily 2%, weekly 4% and monthly 8%. Work out each limit in rupees. Then two losses of Rs 300 happen on the same day. How much of the daily limit is left?

Hints:

1. Multiply capital by each percentage. First change the percentage to a decimal (1% = 0.01).
2. Add the day's losses first. Then take them away from the daily limit.
3. Check that the per-trade limit is smaller than the daily limit.

**Answer:** Per trade Rs 300; daily Rs 600; weekly Rs 1,200; monthly Rs 2,400. Two losses of Rs 300 use Rs 600, so the daily limit left is 600 - 600 = Rs 0. The daily stop applies.

### Independent exercise

**Task.** Capital Rs 20,000. Daily limit 3%, weekly limit 6%, monthly limit 10%. Each trade loses Rs 150. How many losing trades until the daily limit is reached? Then state the stop rule in one sentence.

<details><summary>Check your answer</summary>

Daily limit = 20,000 x 3% = Rs 600. Each loss is Rs 150, so 600 / 150 = 4 trades. Check: 4 x 150 = 600.

Stop rule (sample wording): once the daily limit is reached, no more trades that day, whatever the setup looks like.

For reference: the weekly limit is Rs 1,200 and the monthly limit is Rs 2,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions check limit math, the stop rule, the reduce-exposure rule and the base. Each wrong answer has an explanation.

## Paper task

Mode: **learning note** (Lab 3). No orders are placed.

1. Write a one-page limit card. Include capital, base, per-trade, daily, weekly and monthly limits, max trades per day, and the stop rule.
2. Work out each rupee limit from your made-up capital. Show each multiplication.
3. Write it in your journal. If you do not have the journal app yet, use paper. Keep a "remaining daily limit" line for five made-up days.
4. For each day, note the losses used and the amount left. Mark any day on which a limit would have stopped trading.

## Limits and common mistakes

- Limits do not stop gaps. A stop can fill well below the stop price. So the loss can be bigger than planned (*Slippage, gaps and planned versus actual risk*).
- The percentages are examples, not advice. You set every number before trading.
- A broker's risk controls are not your limits. The broker can close intraday positions at its set time (3:25 PM for most shares as of 11 Nov 2026) and can cut leverage. Check Zerodha support for the current rules.
- Limits cannot fix a plan that does not work. They only cap the damage in each period.
- A limit card works only if you follow the stop rule. The common mistake is trading again after the stop.

## Remember

- A limit caps your losses over a period. It is set in rupees before trading.
- Write the base (starting or current capital) on the card.
- When a limit is reached, the stop rule applies. No more trades in that period.
- Reduce exposure is a rule set in advance. It lowers risk after a drawdown. It never raises risk.
- Limits cannot stop a gap loss that is bigger than the planned amount.

## Sources and verification

Sources, read on 11 Nov 2026:

- Zerodha support: "Intraday auto square-off timings".
- Zerodha Z-Connect: "Changes to the auto square-off timings for equity and F&O" (26 Dec 2025).
- Zerodha support: "How much margin and leverage does Zerodha provide".

<!-- facts-needed: broker risk controls and intraday auto square-off rules (Zerodha support pages; SEBI circulars) -->

<!-- standing-disclaimer -->
