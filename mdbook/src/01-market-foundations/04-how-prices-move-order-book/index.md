---
id: T1.4
title: How prices move - supply and demand, the order book
page_type: Concept
prerequisites: [T1.2, T1.3]
labs: []
estimated_minutes: 25
---

# How prices move: supply and demand, the order book

## Hook

A hypothetical trader sees a stock at Rs 250 and decides to buy 250 shares "at Rs 250," which looks like Rs 62,500. The buy fills at a total of Rs 62,650, because the cheapest 100 shares are gone and the next 150 are offered at Rs 251. The screen price was the last trade, not the price of the whole order.

## The idea

**The price is the last trade.** The displayed price is the price at which the most recent matched trade happened. It is not a fixed value, and it is not a fair price on its own.

**An order book is a list of resting orders.** Orders that have not yet matched wait in the book. Each waiting buy order names a price it will pay. Each waiting sell order names a price it will accept. The book shows how many shares are waiting at each price.

**Demand and supply.** Demand is the buy orders at or above a given price: buyers willing to pay that much. Supply is the sell orders at or below a given price: sellers willing to accept that much. The price moves where these meet, as orders arrive and match.

**Two kinds of order.**

- A **market order** takes the best available prices now. It fills at whatever the book offers, from the lowest sell price up.
- A **limit order** sets a maximum buy price or a minimum sell price. It fills only at that price or better, and it may not fill at all.

**Price moves when orders consume the best levels.** A large market buy takes the cheapest sell shares first. When those are used up, it moves to the next price. Each level it consumes can raise the price.

**News changes expectations, and expectations change orders.** The price responds to the orders that news creates, not to the news directly. A price change shows that orders moved. It does not show which information caused them.

**No price is fair by itself.** The price is what a buyer and a seller agreed to at that moment. A change in price is not a verdict on whether the earlier price was right or wrong.

## See it

Here is the sell side of a hypothetical order book. Each row is a price with shares waiting to be sold at that price.

| Ask price (Rs) | Shares waiting at this price | Cumulative shares |
|---|---|---|
| 250 | 100 | 100 |
| 251 | 150 | 250 |
| 252 | 200 | 450 |

A market buy fills from the top row down. Read the cumulative column: a buy of 250 shares uses the first two rows exactly. A buy of 300 would reach into the third row. The price of the last trade moves up as the buy climbs the rows.

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

The buy paid an average of Rs 250.60 per share, not Rs 250. The displayed Rs 250 was only the first level.

## Try it

**Interactive demo.** Use the order-book simulator to walk a market buy up the ask side. Watch the price step up as each level is consumed.

<!-- component: order-book-sim | ask: 250x100, 251x150, 252x200 | market_buy_qty: 250 | caption: A market buy consumes the ask side from the lowest price upward; the last traded price steps up as levels are used. -->

### Guided exercise

**Task:** Using the same hypothetical book, compute the cost of a market buy of 100 shares, and then of 200 shares.

**Hints:**

1. Fill from the lowest ask upward.
2. For 100 shares, all of the fill is at Rs 250.
3. For 200 shares, the first 100 are at Rs 250 and the next 100 are at Rs 251.

**Answer:**

- 100 shares: 100 x Rs 250 = Rs 25,000. Average Rs 250.00.
- 200 shares: 100 x Rs 250 = Rs 25,000, plus 100 x Rs 251 = Rs 25,100. Total Rs 50,100. Average 50,100 / 200 = Rs 250.50.

### Independent exercise

**Task:** A market buy of 300 shares uses the same book. Compute the total cost, the average price and the new last traded price. Use no hints.

<details><summary>Check your answer</summary>

- First 100 at Rs 250: 100 x 250 = Rs 25,000.
- Next 150 at Rs 251: 150 x 251 = Rs 37,650.
- Last 50 at Rs 252: 50 x 252 = Rs 12,600.
- Total: 25,000 + 37,650 + 12,600 = Rs 75,250.
- Average: 75,250 / 300 = Rs 250.83 (rounded to two decimals).
- New last traded price: Rs 252, the last level the order reached.

Check the total: 100 + 150 + 50 = 300 shares, and the three amounts add to 75,250.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions check the walked-up average price, the last price, the limit order, a thin-stock scenario and the price-to-information claim.

## Paper task

**Mode:** kite_demo. Open the market depth view for one demo stock. Record the best bid and best ask in your own words, in the journal or on paper until the journal app is ready.

1. Open the market depth view for one stock in the Kite demo.
2. Note the best bid (the highest buy price waiting) and the best ask (the lowest sell price waiting).
3. Write both in your own words.
4. Label the layout "unverified": [VERIFY: Kite demo depth view]. The demo uses dummy data.

## What this does NOT tell you

- The book does not tell you where any price will go. It explains how a price is formed, not what it will do.
- A displayed price is not the fill price for a large order. The average can be higher.
- In thin stocks a market order can fill far from the last price. Use a limit order with a known maximum, and do not assume the displayed price is what you will pay.
- A price move is not proof that anyone knows something. It shows that orders moved.

## Remember

- The displayed price is the last matched trade, not a fixed or fair value.
- A market buy fills from the lowest ask up. In the example, 250 shares cost Rs 62,650, an average of Rs 250.60.
- A limit order is a maximum for a buy. It may not fill.
- A price change shows that orders moved. It does not show why.
- A thin book moves more for the same order size.

## Sources and verification

**Sources (names only):**

- NSE education pages on order matching.
- Zerodha Varsity, as a reference only (link, no text copied).
- Zerodha support pages on order types.

**Facts to verify:**

- Market depth levels shown in Kite. [VERIFY: Zerodha Kite help page]
- Kite demo depth view layout. [VERIFY: Kite demo depth view]
- Matching rules and price-time priority, if used later (cross-reference T1.5). [VERIFY: NSE market rules]

Last content review: not yet done

<!-- facts-needed: Zerodha Kite help page (market depth levels); Kite demo depth view layout; NSE market rules for matching -->

<!-- standing-disclaimer -->
