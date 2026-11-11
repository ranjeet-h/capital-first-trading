<!-- meta
id: T9.6
title: Microstructure, order flow and auctions
page_type: Concept
prerequisites: [T1.4, T1.5, T1.6, T1.7]
labs: []
estimated_minutes: 25
-->

# Microstructure, order flow and auctions

## Hook

A reader sees Rs 250.00 on the screen and expects to pay Rs 250.00. The reader imagines a market order for 200 shares. The shares would fill at two prices, not one. A paper log that records only Rs 250.00 hides the difference.

## The idea

**Microstructure** is the way orders meet and prices form. It is the detail behind the price you see.

- **Order book.** The order book lists buy orders (bids) and sell orders (asks) at each price. The **best ask** is the lowest sell price on offer. The **best bid** is the highest buy price on offer. The **spread** is the gap between them. See *Order matching, spread and liquidity*.
- **Depth.** Depth is how many shares sit at each price. A thin book has few shares at each price. See *Market depth and charts in Kite*.
- **Market order.** A market order buys or sells now at the prices available. It takes shares one price level at a time. Its average fill can be worse than the best ask.
- **Limit order.** A limit order sets the highest price you will pay, or the lowest you will take. See *Order types*.
- **Price-time priority.** At the same price, the earlier order is filled first. This works like a queue at a bus stop. NSE says it stores orders by price first, then by time. (As of 11 Nov 2026, NSE trading system page. Rules change, so check the NSE site.)
- **Queue position.** A limit order waits in that line. A price that touches your limit does not always fill it. Orders ahead of you may take the shares first.
- **Auctions.** In an auction, orders are collected first. Then one price is set from them. It works like a village auction where bids come in before one price is chosen. The pre-open session is run this way.

NSE's pre-open session runs from 9:00 am to 9:15 am. In the first part, you can enter, change or cancel orders. In the middle part, orders are matched at one price and confirmed. The last few minutes are a buffer before the normal session. NSE sets that one price as the price with the most shares that can trade. If more than one price does that, it picks the one with the smallest leftover imbalance. If there is still a tie, it picks the price closest to the previous close. That price becomes the day's opening price. NSE has changed the exact minutes inside the pre-open session in the past, so read its current page for the split.

NSE also runs a closing auction session for some shares. In the version NSE described in March 2026, the reference price is the volume weighted average price of trades from 3:00 pm to 3:15 pm. The auction runs after 3:15 pm, and the price can move up to 3 percent from that reference. NSE has announced more changes to the closing auction, so read the current NSE circulars for the exact times and the list of shares. (As of 11 Nov 2026, NSE pre-open page and NSE circular of 18 Mar 2026. Rules change, so check the NSE site.)

A thin book makes all of this more important. Paper results that ignore these points can look better than real results.

## See it

The order book below shows the ask side. Watch the 200-share market buy use the first price level, then the second. Note the average price the order fills at. The numbers are made up.

<!-- component: order-book-sim | asks: 250.00x100, 250.50x100 | order: buy 200 market | caption: Bids and asks at each price, depth and spread, with a market order walking the book -->

## Worked example

**Hypothetical.** Best ask Rs 250.00 for 100 shares. Next ask Rs 250.50 for 100 shares. A market buy of 200 shares.

| Step | Calculation | Result |
|---|---|---|
| 1. First 100 shares | 100 x Rs 250.00 | Rs 25,000 |
| 2. Next 100 shares | 100 x Rs 250.50 | Rs 25,050 |
| 3. Total paid | Rs 25,000 + Rs 25,050 | Rs 50,050 |
| 4. Average fill | Rs 50,050 / 200 | Rs 250.25 per share |
| 5. Slippage against the best ask | (Rs 250.25 - Rs 250.00) x 200 | Rs 50 |

Check: 200 x Rs 250.00 = Rs 50,000. Rs 50,050 - Rs 50,000 = Rs 50. A paper fill at Rs 250.00 would show Rs 50,000 and hide this Rs 50. The amount is small here. In a thin stock the gap can be much wider.

## Try it

### Guided exercise

**Task.** Buy 150 shares with the same book. Compute the average fill and the slippage.

Hints:

1. The first 100 shares fill at Rs 250.00. The next 50 fill at Rs 250.50.
2. Slippage is the total paid minus the shares multiplied by the best ask.
3. Work out the total paid first, then the average.

**Answer:**

- First 100 shares: 100 x Rs 250.00 = Rs 25,000.
- Next 50 shares: 50 x Rs 250.50 = Rs 12,525.
- Total paid: Rs 37,525.
- Average fill: Rs 37,525 / 150 = about Rs 250.17 per share.
- Slippage: Rs 37,525 - (150 x Rs 250.00) = Rs 37,525 - Rs 37,500 = **Rs 25**.
- Check: 50 shares, each Rs 0.50 above the best ask, is 50 x 0.50 = Rs 25.

### Independent exercise

**Task.** Explain in writing why a paper fill at the best quoted price overstates the outcome of a market order in a thin book.

<details><summary>Check your answer</summary>

A good answer has these points.

- A paper fill at the best quoted price assumes all shares fill at that one price.
- In a thin book, the best price level holds few shares. The rest of the order fills at worse prices.
- The paper result is therefore better than a real market order would give.
- For a limit order, paper also ignores queue position. A price touch does not mean a real fill.
- Example, hypothetical: 200 shares at Rs 250.00 on paper gives Rs 50,000. The real cost in the worked example is Rs 50,050.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks average fill, auctions, queue position, one scenario and one spot-the-mistake.

## Paper task

Mode: **Kite demo, look only**. You view the screen and place no order.

1. Open the Kite demo or the view you have access to. Do not place any order.
2. Find the market depth view. Read the page for how it shows bids and asks. Write only the fields you can see on your own screen.
3. Write the fields it shows in your journal, or on paper until the journal app is ready.
4. Write one sentence on what the depth view does not show about your own fill.

## Limits and common mistakes

- The book in this chapter is made up. Real books change every second.
- Auction times, pre-open rules and matching rules change. Check the NSE market timings and pre-open pages.
- A paper log does not show your place in the queue, or the real fill of a market order.
- In a thin stock, slippage can be much larger than the Rs 50 in this example.
- Circuit limits can affect auctions and trading on a given day. The limits differ by share and change over time. This book states none. See the NSE price band pages.

## Remember

- The best ask is the lowest sell price. A market buy can fill above it.
- The average fill can be worse than the best ask.
- A limit order waits in a queue. A touch of its price does not guarantee a fill.
- Auctions collect orders first, then set one price.
- A paper log that uses only the best price can look better than reality.

## Sources and verification

- NSE market timings and pre-open session pages
- NSE market microstructure or matching documents
- *Order book*, in the Kite chapter, for the order book reference

<!-- standing-disclaimer -->
