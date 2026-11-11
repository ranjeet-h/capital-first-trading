<!-- meta
id: T6.7
title: Choosing no-trade
page_type: Concept
prerequisites: [T6.4, T2.11, T2.12]
labs: [Lab 3, Lab 1]
estimated_minutes: 25
-->

# Choosing no-trade

## Hook

A trader loses Rs 500 on one trade and another Rs 500 on the next. The day's loss is now Rs 1,000. Hypothetical example. He feels behind and wants to win the money back. A third setup appears. It does not meet all the rules, but he takes it anyway. This chapter shows how to decide, before the session, when not to trade. It also shows why a day with no trade can be a correct day.

## The idea

No-trade conditions are written in advance, as a list with rules. They are not decided during the session, when emotions run high.

A no-trade decision can come from five groups of conditions.

**Market conditions.** There is no setup under the rules. The market is too thin to trade at a sensible price. See *Order matching, spread and liquidity*. There is a circuit or event risk. See *Circuit limits and halts*. [VERIFY: event calendar sources]

**Account conditions.** The daily or weekly loss limit has been reached. A consecutive-loss rule has been reached. See *Risk limits* and *Consecutive losses and losing streaks*. The capital is below the minimum that the plan allows.

**Data conditions.** The prices are stale or the feed has failed. The symbol is unclear. A corporate action is unclear. See *Corporate actions*.

**Personal conditions.** You are short of sleep, distracted, or in a strong emotion after a loss. Revenge trading is excluded. It is a trade taken to win back money lost. See *Loss aversion and revenge trading*.

**Plan conditions.** The rule for the trade is not met. The plan does not allow the trade.

A no-trade decision is not missing out. Earning nothing on a day can be the correct result. A no-trade day has a result of Rs 0 and still follows the plan.

A rule that stops trading after a limit breach must be fixed in advance. When the limit is reached, trading stops for the day. Do not make an exception because the next trade looks good.

## See it

<!-- component: risk-limit-simulator | capital: 50000 | dailyLossLimit: 1000 | tradeLoss: 500 | caption: Enter trades and a limit, then see the stop-trading state appear at the breach -->

Enter two losing trades of Rs 500 each. Watch the running total. When the total reaches the limit, the stop-trading state appears. Then try a day with no trades. The day's result stays at Rs 0.

## Worked example

**Hypothetical.** Example daily loss limit: Rs 1,000 for a Rs 50,000 account. This is 2 percent of capital. It is an example of the arithmetic, not a recommended limit.

| Event | Trade result | Running total for the day |
|---|---|---|
| Trade 1 | minus Rs 500 (1R) | minus Rs 500 |
| Trade 2 | minus Rs 500 (1R) | minus Rs 1,000 |
| Limit check | Limit of minus Rs 1,000 is reached | No more trades today |

The day's result is minus Rs 1,000, which is the planned maximum loss for the day.

**A day with no setup.** The rules find no setup. There are no trades. The result is Rs 0. The day is compliant with the plan.

## Try it

### Guided exercise

**Task.** Classify six scenarios as trade or no-trade. For each scenario, name the rule that decides.

Hints:

1. Is there a setup under the rules?
2. Has a loss limit or a consecutive-loss rule been reached?
3. Is the data reliable?
4. Is your personal state fit for trading?

Scenarios:

1. No setup appears under the rules, so you wait.
2. The daily loss limit was reached this morning. A new setup appears.
3. The price feed shows yesterday's last price with an old timestamp.
4. You slept badly and feel angry after a loss.
5. A setup meets every rule. The data is clean. The limit is not reached. You are calm.
6. A company has announced a corporate action, and the terms are unclear.

**Answer:**

1. **No-trade.** Market rule: no setup.
2. **No-trade.** Account rule: loss limit reached.
3. **No-trade.** Data rule: the price is stale.
4. **No-trade.** Personal rule: your state is not fit.
5. **Trade.** All conditions are met.
6. **No-trade.** Data rule: the corporate action is unclear.

### Independent exercise

**Task.** Write your own six-item no-trade list. Each item needs a rule and a category. Use the five categories from *The idea*.

<details><summary>Check your answer</summary>

A sample list:

1. No setup under the rules. Category: market.
2. Daily loss limit reached. Category: account.
3. Two consecutive losses, as set in the plan. Category: account.
4. Stale or missing prices. Category: data.
5. An unclear symbol or corporate action. Category: data.
6. Strong emotion after a loss, or poor sleep. Category: personal.

Each item has a rule and a category. The check is that every item can be decided before the session begins.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the categories of no-trade, the loss-limit arithmetic, and the rule that stops trading after a breach.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Journal five no-trade days, one for each day.
2. For each day, write the rule that decided the no-trade.
3. Write the category of that rule: market, account, data, personal or plan.
4. Record the day's result, which is Rs 0 when no trade was taken.
5. Mark the entries hypothetical unless they come from your own record.

## Limits and common mistakes

- The Rs 1,000 limit in this chapter is an illustration of the arithmetic. It is not a recommended limit.
- No-trade rules must be written before the session. Writing them during the day invites excuses.
- A no-trade rule does not close a position you already hold. Open positions follow their exit rules.
- Waiting does not remove all risk. A stop can still be hit, and a gap can still cause a loss.
- The calendar of holidays and events must be checked from an official source. [VERIFY: NSE holiday list]

## Remember

- No-trade conditions are written before the session, in five categories.
- A limit that is reached ends trading for the day. Do not make an exception.
- A day with no trade has a result of Rs 0 and can be a compliant day.
- Missing a trade is not a failure of the plan.
- A no-trade rule does not close open positions. Exit rules still apply.

## Sources and verification

- NSE India, holiday list page. [VERIFY: NSE holiday list]
- SEBI investor education material on trading risks.
- [VERIFY: circuit price band rules]
- [VERIFY: event calendar source for each event used in a rule]

<!-- facts-needed: trading holidays and special sessions; circuit price band rules; event calendars used in no-trade rules, with the source for each event. -->

<!-- standing-disclaimer -->
