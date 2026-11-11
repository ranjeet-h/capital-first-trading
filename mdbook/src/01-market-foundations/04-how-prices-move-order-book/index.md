<!-- meta
id: T1.4
title: How prices move: the order book
page_type: Concept
prerequisites: [T1.2, T1.3]
labs: []
estimated_minutes: 25
-->

# How prices move: the order book

## Hook

A hypothetical trader sees a stock at Rs 250. They decide to buy 250 shares "at Rs 250." That looks like Rs 62,500. But the buy fills at a total of Rs 62,650. The cheapest 100 shares are gone, and the next 150 are offered at Rs 251. The price on screen was the last trade. It was not the price of the whole order.

## The idea

**The price is the last trade.** The price on screen is the price of the most recent matched trade. It is not a fixed value. It is not a fair price on its own.

**An order book is a list of waiting orders.** Orders that have not yet matched wait in the book. Each waiting buy order names the price it will pay. Each waiting sell order names the price it will accept. The book shows how many shares wait at each price.

**Demand and supply.** Demand is the buy orders at or above a given price. These are buyers willing to pay that much. Supply is the sell orders at or below a given price. These are sellers willing to accept that much. The price moves where these meet, as orders arrive and match.

**Two kinds of order.**

- A **market order** takes the best available prices now. It fills at whatever the book offers, from the lowest sell price up.
- A **limit order** sets a maximum buy price or a minimum sell price. It fills only at that price or better, and it may not fill at all.

**Price moves when orders use up the best prices.** A large market buy takes the cheapest sell shares first. When those are used up, it moves to the next price. Each price it uses can raise the price.

**News changes expectations, and expectations change orders.** The price responds to the orders that news creates, not to the news itself. A price change shows that orders moved. It does not show which information caused them.

**No price is fair by itself.** The price is what a buyer and a seller agreed to at that moment. A change in price does not show whether the earlier price was right or wrong.

## See it

Here is the sell side of a made-up order book. Each row is a price, with shares waiting to be sold at that price.

| Ask price (Rs) | Shares waiting at this price | Running total |
|---|---|---|
| 250 | 100 | 100 |
| 251 | 150 | 250 |
| 252 | 200 | 450 |

A market buy fills from the top row down. Read the running total. A buy of 250 shares uses the first two rows exactly. A buy of 300 would reach into the third row. The price of the last trade moves up as the buy climbs the rows.

## Worked example

**Hypothetical ask side:** 100 shares at Rs 250, 150 at Rs 251, 200 at Rs 252. A market buy of 250 shares.

| Step | Working | Result |
|---|---|---|
| 1. Fill 100 at the lowest ask | 100 x Rs 250 | Rs 25,000 |
| 2. Fill the next 150 at Rs 251 | 150 x Rs 251 | Rs 37,650 |
| 3. Total cost for 250 shares | 25,000 + 37,650 | Rs 62,650 |
| 4. Average price | 62,650 / 250 | Rs 250.60 |
| 5. Last traded price | last fill | Rs 251 |

**Check on step 2:** 150 x 251 = 150 x 250 + 150 = 37,500 + 150 = 37,650.

The buy paid an average of Rs 250.60 per share, not Rs 250. The Rs 250 on screen was only the first price.

## Try it

**Interactive demo.** Use the order-book simulator to walk a market buy up the ask side. Watch the price step up as each price is used up.

<!-- component: order-book-sim | ask: 250x100, 251x150, 252x200 | market_buy_qty: 250 | caption: A market buy consumes the ask side from the lowest price upward; the last traded price steps up as levels are used. -->

### Guided exercise

**Task:** Using the same made-up book, work out the cost of a market buy of 100 shares, and then of 200 shares.

**Hints:**

1. Fill from the lowest ask upward.
2. For 100 shares, all of the fill is at Rs 250.
3. For 200 shares, the first 100 are at Rs 250 and the next 100 are at Rs 251.

**Answer:**

- 100 shares: 100 x Rs 250 = Rs 25,000. Average Rs 250.00.
- 200 shares: 100 x Rs 250 = Rs 25,000, plus 100 x Rs 251 = Rs 25,100. Total Rs 50,100. Average 50,100 / 200 = Rs 250.50.

### Independent exercise

**Task:** A market buy of 300 shares uses the same book. Work out the total cost, the average price and the new last traded price. Use no hints.

<details><summary>Check your answer</summary>

- First 100 at Rs 250: 100 x 250 = Rs 25,000.
- Next 150 at Rs 251: 150 x 251 = Rs 37,650.
- Last 50 at Rs 252: 50 x 252 = Rs 12,600.
- Total: 25,000 + 37,650 + 12,600 = Rs 75,250.
- Average: 75,250 / 300 = Rs 250.83 (rounded to two decimals).
- New last traded price: Rs 252, the last price the order reached.

Check the total: 100 + 150 + 50 = 300 shares, and the three amounts add to 75,250.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions check the average price of a walk up the book, the last price, the limit order, a thin-stock case and the claim about information.

## Paper task

**Mode:** kite_demo. Open the market depth view for one demo stock. Write down the best bid and best ask in your own words, in your journal or on paper.

1. Open the market depth view for one stock in the Kite demo.
2. Note the best bid (the highest buy price waiting) and the best ask (the lowest sell price waiting).
3. Write both in your own words.
4. Zerodha says the market depth view shows the best 5 buy prices and the best 5 sell prices. It also shows the open, high, low and close, the volume and the circuit limits. Layouts change, so write "check your own Kite for the current layout" next to your note. The demo uses dummy data. (As of 11 Nov 2026, Zerodha support page on market depth.)

## Limits and common mistakes

- This book does not tell you where any price will go. It explains how a price is formed, not what it will do.
- The price on screen is not the price a large order gets. The average can be higher.
- In thin stocks, a market order can fill far from the last price. Use a limit order with a known maximum. Do not assume the price on screen is what you will pay.
- A price move is not proof that anyone knows something. It shows that orders moved.

## Remember

- The price on screen is the last matched trade. It is not a fixed or fair value.
- A market buy fills from the lowest ask up. In the example, 250 shares cost Rs 62,650, an average of Rs 250.60.
- A limit order is a maximum for a buy. It may not fill.
- A price change shows that orders moved. It does not show why.
- A thin book moves more for the same order size.

## Sources and verification

**Sources (names only):**

- NSE education pages on order matching.
- Zerodha Varsity, as a reference only (link only, no text copied).
- Zerodha support pages on order types.

**Facts checked on 11 Nov 2026:**

- Zerodha's standard market depth view shows the best 5 bids and offers. A separate 20-level depth view exists as another feature. (Zerodha support site.)
- The exact layout of the Kite demo can change, so this chapter does not describe it. Check it on screen.
- Orders at the same price are matched in the order they arrive. See *Order matching, spread and liquidity* for the rule and its source.

<!-- standing-disclaimer -->
