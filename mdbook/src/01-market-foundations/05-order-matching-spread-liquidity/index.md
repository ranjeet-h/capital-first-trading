<!-- meta
id: T1.5
title: Order matching, spread and liquidity
page_type: Concept
prerequisites: [T1.4]
labs: []
estimated_minutes: 20
-->

# Order matching, spread and liquidity

## Hook

A stock is quoted at around Rs 250. Hypothetically, you buy 40 shares at the higher of the two prices on screen. You sell them straight away at the lower price. You pay Rs 10,020 and receive Rs 9,980. So you are down Rs 40, before any brokerage or charges. Nothing in the market moved. The loss came from the gap between two prices that were both on screen.

## The idea

A price on screen is not one number. At any moment there are two prices that matter.

- **Best bid:** the highest price any buyer is currently waiting to pay.
- **Best ask:** the lowest price any seller is currently waiting to accept.
- **Spread:** the gap between them. Spread in rupees = best ask minus best bid.
- **Spread percent:** the spread divided by a reference price. Here the reference is the middle point between the bid and the ask.
- **Market depth:** how many shares are waiting at each price, not just at the best one.
- **Liquidity:** how easily you can trade a given size without moving the price much.

The spread is not a fee. Your broker does not set it. It is the market's own gap between what buyers offer and what sellers ask.

**Round trip.** A round trip means buying, then selling. If you buy at the ask and sell at the bid, you give up the whole spread. Round-trip spread cost = spread x quantity, before any charges.

**Matching.** The exchange pairs buy and sell orders when their prices meet. Orders are matched first by price. Orders at the same price are matched by time of arrival. This is called price-time priority. Think of a queue at a ticket counter: the best price goes first, and at the same price the person who came first is served first. NSE uses this rule for limit orders in the main trading session. (As of 11 Nov 2026, NSE pre-open and trading pages. Rules change, so check the NSE site. BSE's matching rule is not checked here.)

**Tick size.** The smallest allowed step in price. The step depends on the share price, as in the table below. The examples in this chapter use steps of Rs 0.50 and Rs 1.00 only to show the arithmetic. They are round numbers for practice, not the real steps for those prices.

| Share price on NSE | Tick size |
|---|---|
| Below Rs 250 | Rs 0.01 |
| Rs 250 to Rs 1,000 | Rs 0.05 |
| Rs 1,000 to Rs 5,000 | Rs 0.10 |
| Rs 5,000 to Rs 10,000 | Rs 0.50 |
| Rs 10,000 to Rs 20,000 | Rs 1.00 |
| Above Rs 20,000 | Rs 5.00 |

(As of 11 Nov 2026, NSE circulars of 24 May 2024 and 13 Mar 2025, in force from 15 Apr 2025. NSE reviews the tick size each month using the last close of the month before. Rules change, so check the NSE site.)

**Signs of low liquidity** in a displayed book:

- a wide gap between the best bid and the best ask,
- very few shares waiting at each price,
- large jumps from one price to the next.

A deep book means you can trade a larger quantity close to the best price. It does not mean you can trade any size at the shown price. A deep book reduces price impact, which is how much your own order moves the price. It does not remove that impact.

## See it

<!-- component: order-book-sim | bestBid: 249.50 | bestAsk: 250.50 | qty: 40 | caption: Spread highlighted, with a round-trip counter for buying at the ask and selling at the bid -->

Look at the gap between the top buy price and the top sell price. That gap is the spread. It is the first cost you pay on a round trip. Check that the round-trip counter matches the worked example below. The figures are made up for illustration.

## Worked example

Hypothetical: best bid Rs 249.50, best ask Rs 250.50, quantity 40 shares.

| Step | Calculation | Result |
|---|---|---|
| Spread in rupees | 250.50 - 249.50 | Rs 1.00 |
| Reference price (midpoint) | (250.50 + 249.50) / 2 | Rs 250.00 |
| Spread percent | 1.00 / 250.00 | 0.40% |
| Buy 40 at the ask | 40 x 250.50 | Rs 10,020 |
| Sell 40 at the bid | 40 x 249.50 | Rs 9,980 |
| Loss before charges | 10,020 - 9,980 | Rs 40 |

Check: 40 x Rs 1.00 spread = Rs 40. The loss is about 0.40% of the Rs 10,020 paid, which matches the spread percent.

## Try it

<!-- component: order-book-sim | bestBid: 99.00 | bestAsk: 101.00 | qty: 100 | caption: Guided exercise numbers, round-trip counter for 100 shares -->

### Guided exercise

**Task.** Bid is Rs 99.00 and ask is Rs 101.00. For a round trip of 100 shares, find the spread in rupees, the spread percent of the reference price, and the round-trip cost.

Hints:

1. Subtract the bid from the ask.
2. The reference price is the midpoint: add bid and ask, then divide by 2.
3. Multiply the spread by the quantity.

**Answer:** Spread = Rs 2.00. Reference price = Rs 100. Spread percent = 2.00 / 100 = 2.0%. Round-trip cost = 100 x 2.00 = Rs 200.

Check: buy 100 x 101 = Rs 10,100; sell 100 x 99 = Rs 9,900; difference Rs 200.

### Independent exercise

**Task.** Stock A: bid 500.00, ask 500.50. Stock B: bid 50.00, ask 50.20. For 100 shares of each, work out the round-trip spread cost in rupees. Which stock is cheaper per rupee traded?

<details><summary>Check your answer</summary>

- Stock A: spread Rs 0.50 x 100 = Rs 50. Value traded is about 100 x 500 = Rs 50,000. Cost per rupee is about 50 / 50,000 = 0.10%.
- Stock B: spread Rs 0.20 x 100 = Rs 20. Value traded is about 100 x 50 = Rs 5,000. Cost per rupee is about 20 / 5,000 = 0.40%.

Stock A is cheaper per rupee traded, at about 0.1% against about 0.4%. Stock B has the smaller gap in rupees per share. But the comparison that matters for your money is the cost per rupee you put to work.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions on spread arithmetic, depth, liquidity and matching priority. Each wrong answer has a short explanation.

## Paper task

**Mode: kite_demo.** Kite demo data is dummy data, so the numbers here are for practice only. Layouts change, so check your own Kite for the current layout.

1. Open the Kite demo and pick one demo stock. Check your own Kite for the current layout.
2. Note the best bid and best ask at three different times during the demo session.
3. For each reading, compute the spread in rupees and the spread percent.
4. Write the three readings in your journal, or on paper. Mark them "kite_demo" and "dummy data".
5. Do not place any order.

## Limits and common mistakes

- A spread is the cost at one moment, for one size. A larger order can fill at prices further from the best price.
- A deep book now does not promise the same depth later, or when you need to exit.
- The spread says nothing about whether a price is right or wrong.
- Spread cost is before brokerage, taxes and other charges. Those are covered in *Costs on a trade*.
- Matching rules and tick sizes are not stated as facts here. Use the official values once they are verified.

## Remember

- You buy at the ask and sell at the bid, so a round trip gives up the spread.
- Spread = ask minus bid. Spread percent = spread divided by the reference price.
- Liquidity is the ability to trade a size without moving the price much.
- A deep order book reduces price impact. It does not remove it.
- The spread is the market's price gap, not a broker fee.

## Sources and verification

Sources:

- NSE market microstructure and trading rules pages.
- BSE trading rules.
- Zerodha Varsity, as reference only (link only, no text copied).
- Zerodha support pages on order types.

**Facts checked on 11 Nov 2026:**

- Price-time priority comes from NSE's trading rules. BSE's rule was not checked for this chapter.
- The tick size table comes from NSE circulars dated 24 May 2024 and 13 Mar 2025. ETFs are left out of the below-Rs-250 rule.
- The Kite demo layout can change, so this chapter does not describe it.

<!-- standing-disclaimer -->
