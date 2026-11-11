<!-- meta
id: T4.3
title: Market depth and charts in Kite
page_type: Kite walkthrough
prerequisites: [T1.5, T3.2, T4.2]
labs: []
estimated_minutes: 25
-->

# Market depth and charts in Kite

## Hook

A stock shows a price of Rs 250 on the screen. You plan to buy 100 shares at the market price. The price you pay can be a little higher than Rs 250. The reason is the order book, the list of buy and sell prices waiting at this moment. This chapter shows how Kite shows that list. It also shows how to set up a daily chart.

## The idea

- **Market depth** is a view of the buy and sell prices waiting in the order book. Kite shows some of them. How many levels Kite shows is [VERIFY: Kite depth view].
- **Best bid** is the highest price a buyer is waiting to pay.
- **Best ask** is the lowest price a seller is waiting to take.
- **Spread** is the gap between them.

  Spread = best ask minus best bid.

- **Mid-price** is the point halfway between the best bid and the best ask.

  Mid-price = (best bid plus best ask) divided by 2.

- **Crossing the spread** means buying at the ask or selling at the bid. A market buy takes the ask. You pay about half the spread per share more than the mid-price.
- Depth is a snapshot. Orders can be placed and cancelled at any time, so depth changes quickly. Some orders are hidden. An iceberg order shows only a small part of its full size. You cannot see the rest.
- **Chart setup** means the timeframe, the chart type and any indicators you add. You learned about timeframes in *Timeframes and how the same price looks different*. Which options Kite offers is [VERIFY: Kite chart settings].
- Depth matters less for end-of-day decisions. It shows one moment. Liquidity decides whether a planned size can be sold. See *Order matching, spread and liquidity*.

## See it

<!-- component: order-book-sim | caption: Bids and asks update as orders arrive; the spread and the depth are shown. The data is made up. -->

<!-- component: kite-illustration | view: depth-panel | platform: web | caption: Recreated depth panel and chart setup; check your own Kite for the current layout -->

Watch the bids and asks change as orders arrive. Find the spread in each moment. Then look at the depth panel in the Kite illustration. Note which settings you can change on the chart. Check the layout in your own Kite. [VERIFY: Kite chart settings]

## Worked example

**Hypothetical.** Best bid Rs 249.90. Best ask Rs 250.10.

| Item | Calculation | Result |
|---|---|---|
| Spread | 250.10 minus 249.90 | Rs 0.20 |
| Mid-price | (249.90 plus 250.10) divided by 2 | Rs 250.00 |
| Cost above mid for 100 shares | (250.10 minus 250.00) multiplied by 100 | Rs 10 |

Check the cost above mid another way: 100 shares at Rs 250.10 cost Rs 25,010. 100 shares at Rs 250.00 cost Rs 25,000. The difference is Rs 10.

The buy costs Rs 10 more than the mid-price. This is not a fee from the broker. It comes from the gap between the bid and the ask.

## Try it

### Guided exercise

**Task.** This is a hypothetical depth table.

| Side | Price | Quantity |
|---|---|---|
| Bid | Rs 180.40 | 400 |
| Bid | Rs 180.35 | 600 |
| Ask | Rs 180.60 | 300 |
| Ask | Rs 180.65 | 500 |

Find the best bid, the best ask, the spread and the mid-price. Then work out the cost above mid for a market buy of 200 shares.

Hints:

1. The best bid is the highest price on the buy side.
2. A market buy takes the lowest ask first. The ask quantity of 300 is enough for 200 shares.
3. Cost above mid = (ask minus mid) multiplied by quantity.

**Answer:**

- Best bid: Rs 180.40.
- Best ask: Rs 180.60.
- Spread: 180.60 minus 180.40 = Rs 0.20.
- Mid-price: (180.40 plus 180.60) divided by 2 = Rs 180.50.
- Cost above mid for 200 shares: (180.60 minus 180.50) multiplied by 200 = Rs 20.
- Check: 200 shares at Rs 180.60 cost Rs 36,120. 200 shares at Rs 180.50 cost Rs 36,100. The difference is Rs 20.

### Independent exercise

**Task.** The spread is Rs 0.50 on a stock priced at Rs 400. You buy 200 shares at the ask. Work out the spread as a percent of the price. Then work out the cost above mid.

<details><summary>Check your answer</summary>

- Spread as a percent of price: 0.50 divided by 400 = 0.00125. Multiply by 100 to get 0.125 percent.
- Check: 400 multiplied by 0.125 percent = 400 multiplied by 0.00125 = Rs 0.50.
- Cost above mid: half the spread is Rs 0.25 a share. Multiply by 200 shares to get Rs 50.
- Check: 200 shares at Rs 400.25 cost Rs 80,050. 200 shares at Rs 400.00 cost Rs 80,000. The difference is Rs 50.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the spread, the mid-price, the cost above mid, and what depth can and cannot show.

## Paper task

Mode: kite demo. Watch the screens only. Do not place any order.

1. Choose one symbol. Record its spread at three times on one trading day.
2. Write the chart settings you used, such as the timeframe and any indicators.
3. Check the session times first. [VERIFY: NSE market timings]
4. Write it in your journal. If the journal is not ready, use paper.

## Limits and common mistakes

- Depth can mislead. A large bid can disappear within seconds.
- Depth is not a basis for end-of-day decisions. It shows one moment only.
- Liquidity decides whether a planned size can be sold. A tight spread does not replace a check of liquidity.
- The spread is not a fee from the broker. It is the gap between the best bid and the best ask. Its cost is paid when you cross it.

## Remember

- Spread = best ask minus best bid.
- Mid-price = (best bid plus best ask) divided by 2.
- Buying at the ask costs about half the spread per share above the mid-price.
- Depth changes. Hidden orders are not visible.

## Sources and verification

Sources:

- NSE India, market depth and order book description [VERIFY: page name]
- Zerodha support pages on market depth and charts [VERIFY: page titles]

Facts to check:

- How many depth levels Kite displays. [VERIFY: Kite depth view]
- Chart intervals and how much history Kite holds. [VERIFY: Kite chart help]
- Available chart settings. [VERIFY: Kite chart settings]
- Session times for the paper task. [VERIFY: NSE market timings]

<!-- facts-needed: depth levels displayed in Kite; chart intervals and history depth; available chart settings; NSE session times -->

<!-- standing-disclaimer -->
