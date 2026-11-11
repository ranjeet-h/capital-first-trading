<!-- meta
id: T4.2
title: Watchlists, search and price alerts
page_type: Kite walkthrough
prerequisites: [T4.1, T1.8]
labs: [Lab 3]
estimated_minutes: 15
-->

# Watchlists, search and price alerts

## Hook

A stock rises sharply during the day. You add it to a list. You then set an alert at a higher price. The list and the alert can feel like a plan. They are not a plan. This chapter shows what a watchlist and an alert do. It also shows what they do not do.

## The idea

- A **watchlist** is a list of symbols you keep in view. Its job is to hold your attention. Write your rules before you add a symbol. Useful rules include liquidity, sector and data availability. You met liquidity in *Order matching, spread and liquidity*.
- A watchlist is not a list of recommendations. Being on it says nothing about whether a trade is right.
- **Symbol search** finds a stock by its code or name. Similar names and codes exist. Check the exchange and the symbol before you act.
- The same company can have separate listings on NSE and BSE. Check which exchange your symbol belongs to. [VERIFY: symbol and code conventions]
- An **alert** is a notification. It tells you that a price has reached a level you chose. Whether a Kite alert can ever place an order is [VERIFY: alert behaviour]. This book does not rely on an alert to trade. Treat an alert as a reminder to review.
- Alerts create urgency. Use them as review prompts, not as triggers to act. Your stop and your size should be decided before any alert fires.

## See it

<!-- component: kite-illustration | view: watchlist-and-alerts | platform: web | caption: Recreated watchlist, a search result with similar symbols, and an alert dialog; check your own Kite for the current layout -->

Look at the watchlist first. Then look at the search result. Find the exchange label next to each symbol. Then look at the alert dialog. Notice the words for the alert. Check the layout in your own Kite. [VERIFY: date of the last layout check]

## Worked example

**Hypothetical.** Suppose you follow 10 symbols. Each one trades at Rs 250. Buying one share of each would cost Rs 2,500 before charges.

| Step | Calculation | Result |
|---|---|---|
| 1. Symbols | given | 10 |
| 2. Price of each | given | Rs 250 |
| 3. One share of each, before charges | 10 multiplied by Rs 250 | Rs 2,500 |

Check step 3: Rs 2,500 divided by 10 symbols is Rs 250 each.

The watchlist itself costs nothing. Your attention is the real cost.

<!-- OPEN: the spec gives Rs 25,000 for ten symbols at Rs 250 each. Ten times Rs 250 is Rs 2,500, so the worked example uses Rs 2,500. Confirm with the reviewer. --> Now suppose you set an alert at Rs 252. That alert is a prompt to review the chart. Your stop and your size must already be written down. They must not be chosen because the alert fired.

## Try it

### Guided exercise

**Task.** In your demo, make a five-symbol watchlist. Write one rule for each symbol. Set one alert in the demo. Write down what you will do when it fires.

Hints:

1. Write the rule for each symbol before you add it.
2. Check the exchange for each symbol.
3. For the alert, write a review step. For example: look at the chart, check your stop and size, and do nothing more until your plan allows it.

**Answer:** Your answer is complete when each symbol has a written rule, each exchange has been checked, and the alert note says what you will review first. No order is placed in this exercise.

### Independent exercise

**Task.** Write four selection rules for one hypothetical stock. Then write an alert plan for the same stock. The plan must say what the alert is for and what you will do before any order.

<details><summary>Check your answer</summary>

A sample answer, for a hypothetical stock:

- Rule 1: the stock trades enough shares each day that a planned size can be sold.
- Rule 2: the stock belongs to a sector that you have already studied.
- Rule 3: the data needed for your chart is available from your source.
- Rule 4: the stock is not on the list only because it rose sharply today.
- Alert plan: the alert is for a review of the chart at a set level. Before any order, you check the stop, the size, the cost and your written plan. An alert does not decide anything by itself.

All details are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the difference between an alert and an order, what a watchlist is, and a common mistake after an alert.

## Paper task

Mode: kite demo. You will set up a list and an alert in the demo only. Do not place any order.

1. Write the rules for your watchlist.
2. Check the exchange for each symbol on the list.
3. Record the purpose of the alert you set.
4. Write the review steps you will take before any order.
5. Record this as a learning note in Lab 3. Write it in your journal. If the journal is not ready, use paper.

## Limits and common mistakes

- A watchlist is not a buy list. Being on it does not make a trade right.
- A stock that rose most today is not a reason to act. Check your written rules first.
- An alert is not an order. Seeing an alert does not change your plan.
- Alerts and lists can drive fear of missing out. A rising price on a list can feel urgent. Slow down and check your rules.

## Remember

- A watchlist controls your attention. It is not a recommendation list.
- Check the exchange and the symbol before you act.
- An alert is a notification. Treat it as a reminder to review.
- Write your stop and size before any alert fires.

## Sources and verification

Sources:

- Zerodha support pages on watchlists and alerts [VERIFY: page titles]
- NSE and BSE symbol directories

Facts to check:

- Alert types, notification channels, and whether an alert can trigger an order. [VERIFY: Zerodha support]
- Symbol and series conventions on the NSE and BSE symbol pages. [VERIFY: NSE and BSE symbol pages]

<!-- facts-needed: alert types, notification channels and whether alerts can trigger orders; symbol and series conventions on NSE and BSE -->

<!-- standing-disclaimer -->
