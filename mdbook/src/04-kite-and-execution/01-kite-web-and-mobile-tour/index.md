<!-- meta
id: T4.1
title: Kite web and mobile tour
page_type: Kite walkthrough
prerequisites: [T0.2, T1.3]
labs: []
estimated_minutes: 25
-->

# Kite web and mobile tour

## Hook

A trading app shows many buttons, numbers and labels. Some of them look urgent. One wrong tap in an order window can send a real order. This chapter gives you a map of the main areas. You will learn what the demo is and what it is not. You will not place any order in this chapter.

## The idea

Kite is the trading platform from Zerodha. It runs on the web and on mobile. This book does not depend on either version. The labels in your own app may differ from the labels here. Check your app.

The main areas are these. Look for each name in your own app.

- **User ID menu.** Click your user ID at the top right. Look for My profile, Settings and the tour.
- **Marketwatch.** Your lists of symbols you follow. On the web you can keep up to 7 lists, numbered 1 to 7.
- **Chart.** A picture of past prices for one symbol.
- **Order window.** Opens when you click Buy or Sell on a row. Reading it does not place an order. On the phone app you place an order by swiping a button, not by tapping it.
- **Top bar (web).** Look for Dashboard, Orders, Holdings, Positions, Funds, Bids and Apps. These pages show your orders, the shares you hold, your open trades and your money. The exact order of the names may differ in your app.
- **Terminal Mode (web).** A layout you can arrange yourself, with your own set of windows.

**Console** is a separate back-office website, at console.zerodha.com. A back office keeps records, reports and statements. Console holds items such as contract notes and ledgers. It is not where you look at live prices or enter trades.

**The demo** is a practice version of Kite that uses dummy data. Dummy data is made-up data, not real market data. Paper trading means practising with pretend money and keeping a written record of your decisions. Zerodha says it does not offer demo accounts for paper trading. It does offer a demo version of Kite with dummy data. You can reach it at kite-demo.zerodha.com/dashboard, or with the Try demo button on zerodha.com/products/kite.

The demo is view-only. You can open every screen and click through them to read them. You cannot place orders, create GTTs or set alerts in it. Real orders need a funded account. This book never asks you to place a real order.

If you share a screenshot of a real account, crop out names, client IDs and balances first. Private details are easy to miss.

## See it

<!-- component: kite-flow | flow: find-your-way-around | platform: web | caption: A click path through the main parts of Kite. Switch between web and phone. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

Use the toggle to switch between the web and mobile versions. Find the same areas in both. Note any area that has a different label. The screens are recreations. Check your own Kite for the current layout.

## Worked example

**Hypothetical illustration.** Suppose you enter a buy order for 10 shares at Rs 250 in the order window. You do not submit it. The order value is what you read on the screen before charges.

| Step | Calculation | Result |
|---|---|---|
| 1. Shares | given | 10 |
| 2. Price | given | Rs 250 |
| 3. Order value before charges | 10 multiplied by Rs 250 | Rs 2,500 |
| 4. Charges | shown separately | Look for them near the margin figures in the order window |

Check step 3: Rs 2,500 divided by 10 shares is Rs 250 a share.

Charges are not in the Rs 2,500. The demo is view-only, so you cannot open an order window there. In a live account, the order window shows the margin figures and the charges near them. Read them before you submit anything.

## Try it

### Guided exercise

**Task.** In your own Kite demo, find each named area from the tour. Write down the label your app uses for each one.

Hints:

1. Use the app's own search if you cannot find an area.
2. If a label differs from this chapter, write both labels and check Zerodha support.
3. Do not place any order in this exercise.

**Answer:** There is no single correct list of labels. Your answer is complete when each area has a label from your own app. Any difference from this chapter is written next to the label. No order is placed.

### Independent exercise

**Task.** Draw a one-page map of your Kite layout. Use labels from your own app. Do not use screenshots of your real account.

<details><summary>Check your answer</summary>

A good map has these parts:

- The user ID menu, Marketwatch, the chart, the order window, and the orders, holdings, positions and funds pages.
- Console, shown as a separate website.
- A note that the demo uses dummy data.
- No names, client IDs or balances.

If your map shows a name, a client ID or a balance, remove it before you keep or share the map.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the demo, the role of Console, the order value and the rule on sharing screenshots.

## Paper task

Mode: kite demo. You will read screens only. Do not place any order.

1. Complete the tour checklist: user ID menu, Marketwatch, chart, order window, orders, holdings, positions, funds and Console.
2. Write the label your app uses for each area.
3. Write a short reflection on what you did not understand.
4. Write it in your journal. If the journal is not ready, use paper.

## Limits and common mistakes

- The tour places no orders. It also does not teach you how to choose a trade.
- Being familiar with the demo screens is not evidence of trading skill.
- Labels, screens and rules change. Check your own app before you rely on this map.
- Never share a screenshot before you remove names, client IDs and balances.

## Remember

- Kite is the trading platform on web and mobile. This book does not depend on either.
- The demo uses dummy data. It is for practice with the screens only.
- Console is a back-office area for reports and records. It is not for live prices.
- The order value shown in the order window is before charges.

## Sources and verification

Sources:

- Zerodha support: "Does Zerodha offer demo accounts for paper trading?" (support.zerodha.com)
- The Kite user manual (kite.trade/docs/kite)
- Zerodha support pages on Console

Facts to check:

- Current Kite and mobile labels. Check your own app.
- What Console holds. Check Zerodha's Console help.

<!-- facts-needed: demo availability and whether it allows orders; current Kite and mobile labels; Console contents; location of the cost preview -->

<!-- standing-disclaimer -->
