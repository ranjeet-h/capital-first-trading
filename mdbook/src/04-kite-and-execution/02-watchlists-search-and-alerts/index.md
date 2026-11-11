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
- On the Kite web, your watchlist is called Marketwatch. You can keep up to 7 lists, numbered 1 to 7. Each list can hold up to 50 symbols. Kite saves your lists on its own.
- To add a symbol on the web, press ~ (the tilde key) to open search. Type a name or code. Click Add next to the result you want. Hover over a row to see its buttons: Buy, Sell, Chart, Market depth, Delete and More. Look for the exact icons in your app. The More menu holds options such as Create GTT, Create alert and Add to basket.
- **Symbol search** finds a stock by its code or name. Similar names and codes exist. Check the exchange and the symbol before you act.
- The same company can have separate listings on NSE and BSE. Kite shows the exchange next to each row. Check which exchange your symbol belongs to.
- An **alert** is a notification. It tells you that a price has reached a level you chose. A plain alert only notifies you. Kite also has **ATO (Alert Triggers Order)**. With ATO, an alert can place a basket of up to 20 orders on its own when it fires. This book does not use alerts to trade. Treat an alert as a reminder to review.
- To set an alert on the web, hover over the row, click More, then Create alert. Enter a name, choose the property, the operator and the value, then click Create. On the phone app, open the stock and tap Set alert. Kite limits how many alerts and ATO alerts you can have, and an alert lasts 365 days.
- Alerts create urgency. Use them as review prompts, not as triggers to act. Your stop and your size should be decided before any alert fires.

## See it

<!-- component: kite-flow | flow: add-to-watchlist,create-an-alert-and-ato | platform: web | caption: Click paths for adding a symbol safely and for making an alert. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

Look at the watchlist first. Then look at the search result. Find the exchange label next to each symbol. Then look at the alert dialog. Notice the words for the alert, and check whether an ATO option is switched on. Check the layout in your own Kite.

## Worked example

**Hypothetical.** Suppose you follow 10 symbols. Each one trades at Rs 250. Buying one share of each would cost Rs 2,500 before charges.

| Step | Calculation | Result |
|---|---|---|
| 1. Symbols | given | 10 |
| 2. Price of each | given | Rs 250 |
| 3. One share of each, before charges | 10 multiplied by Rs 250 | Rs 2,500 |

Check step 3: Rs 2,500 divided by 10 symbols is Rs 250 each.

The watchlist itself costs nothing. Your attention is the real cost.

Now suppose you set an alert at Rs 252. That alert is a prompt to review the chart. Your stop and your size must already be written down. They must not be chosen because the alert fired.

## Try it

### Guided exercise

**Task.** Build a five-symbol watchlist on paper. Write one rule for each symbol. In the Kite demo, find where the alert button sits. Then write one alert as a sentence on paper. Write down what you will do when it fires.

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

Mode: paper. The Kite demo is view-only. Use it only to find the alert button and read its labels. Write the list and each alert on paper.

1. Write the rules for your watchlist on paper.
2. Check the exchange for each symbol on the list.
3. Write each alert as a sentence on paper, with its purpose.
4. Write the review steps you will take before any order.
5. Record this as a learning note in Lab 3. Write it in your journal. If the journal is not ready, use paper.

## Limits and common mistakes

- A watchlist is not a buy list. Being on it does not make a trade right.
- A stock that rose most today is not a reason to act. Check your written rules first.
- A plain alert is not an order. Seeing it does not change your plan. But an alert with ATO switched on can place orders. Check the alert settings before you set one.
- Alerts and lists can drive fear of missing out. A rising price on a list can feel urgent. Slow down and check your rules.

## Remember

- A watchlist controls your attention. It is not a recommendation list.
- Check the exchange and the symbol before you act.
- A plain alert is a notification. An ATO alert can also place orders. Either way, check your plan first.
- Write your stop and size before any alert fires.

## Sources and verification

Sources:

- Zerodha support pages on watchlists, alerts and ATO (Alert Triggers Order). Check the current limits there.
- NSE and BSE symbol directories

Facts to check:

- Alert types, notification channels, and the ATO rules, including limits on alerts and orders. Check Zerodha's alert pages.
- Symbol and series conventions on the NSE and BSE symbol pages.

<!-- facts-needed: alert types, notification channels and ATO rules; symbol and series conventions on NSE and BSE -->

<!-- standing-disclaimer -->
