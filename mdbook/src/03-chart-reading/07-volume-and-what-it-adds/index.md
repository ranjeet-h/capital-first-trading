<!-- meta
id: T3.7
title: Volume and what it adds
page_type: Math/Calculator
prerequisites: [T3.1, T3.5]
labs: []
estimated_minutes: 15
-->

# Volume and what it adds

## Hook

A stock moves above a price level on a big day. The candle looks strong. Many traders say, "Big volume means the move is real." Is that true? This chapter shows what volume measures. It also shows what volume cannot tell you. You will compare today's volume with a normal day. You will also turn shares into rupees, so you can compare the trade with your planned size.

## The idea

- **Volume** is the number of shares traded in a period. The period can be a day, an hour or one candle. Volume is only a count. It does not say whether buyers or sellers were stronger.
- **Average volume** is the usual amount of trading for the stock. A common choice is the last 20 days. Add up the volume for those days, then divide by 20.
- **Relative volume** compares today with the usual amount.

  Relative volume = today's volume divided by the average volume.

  A value of 2.0 means twice the usual volume. A value of 0.5 means half the usual volume.

- **High relative volume** means more people traded than usual. It does not show which way they wanted the price to go. Every trade has a buyer and a seller. Volume alone does not say which side was stronger.
- **Traded value** is the rupee amount that changed hands.

  Traded value = volume multiplied by price.

  Shares alone can hide the size of a trade. Rupees show it more clearly.
- **Liquidity** means how easily you can buy or sell without moving the price much. You met this in *Order matching, spread and liquidity*. A low traded value can make it hard to sell a planned size. Selling is called exiting a trade.
- **Delivery volume** is a different measure from traded volume. It refers to shares that were taken as delivery, not bought and sold again the same day. NSE publishes a report called "Security-wise Delivery Positions", and NSE reads a higher share of delivered quantity as more buyers holding on to shares. Check NSE's own definition before you use it. (As of 11 Nov 2026, NSE reports page. Definitions can change, so check the NSE site.)
- Volume can rise for reasons that have nothing to do with the trend. News, index changes and corporate actions can all add volume. See *Corporate actions*.

## See it

<!-- component: indicator-playground | indicator: relative-volume | lookback: 20 | caption: Volume bars with a relative-volume line; change the lookback and watch the average and the line move -->

The bars show daily volume. The line shows relative volume. The data is made up. Find the breakout day and read its bar. Then read the line on that day. Change the lookback from 20 days to 10 days. Notice how the average changes and how the line moves.

## Worked example

**Hypothetical.** The stock trades at Rs 312 on the breakout day.

| Step | Calculation | Result |
|---|---|---|
| 1. Average volume, last 20 days | given | 1,00,000 shares |
| 2. Breakout day volume | given | 1,80,000 shares |
| 3. Relative volume | 1,80,000 divided by 1,00,000 | 1.8 |
| 4. Traded value on the day | 1,80,000 multiplied by Rs 312 | Rs 5,61,60,000 |
| 5. Your planned 50 shares, as a share of the day | 50 divided by 1,80,000 | about 0.03% |

Check step 4 another way: Rs 5,61,60,000 divided by Rs 312 is 1,80,000 shares. One crore is Rs 1,00,00,000. So the day traded about Rs 5.616 crore.

Check step 5 another way: 1,80,000 divided by 50 is 3,600. And 100 divided by 3,600 is about 0.028%, which rounds to 0.03%.

**What it shows.** The breakout day had 1.8 times the usual volume. Your planned 50 shares are a tiny part of that day. In this example, the stock is easy to trade. A thin stock can look very different.

## Try it

<!-- component: indicator-playground | indicator: relative-volume | closes: 100,101,100,102 | volumes: 80000,120000,100000,200000 | lookback: 3 | plan: 0 | edit: on | caption: The four days of the guided exercise. Change the volumes and see the relative volume change -->

### Guided exercise

**Task.** Volumes for the last four days are 80,000, 120,000, 100,000 and 200,000 shares. Find the average of the first three days. Then find the relative volume on the last day.

Hints:

1. Add the first three volumes. Then divide the total by 3.
2. Divide the last day's volume by that average.

**Answer:**

- Total of the first three days: 80,000 + 120,000 + 100,000 = 3,00,000 shares.
- Average of the first three days: 3,00,000 divided by 3 = 1,00,000 shares.
- Relative volume on the last day: 2,00,000 divided by 1,00,000 = 2.0.
- Check: 2.0 multiplied by 1,00,000 = 2,00,000. This matches the last day.

The last day had twice the usual volume. The numbers do not show which way the price moved.

### Independent exercise

**Task.** A stock has an average volume of 2,50,000 shares. Its price falls 2 percent on a day with 90,000 shares traded. Work out the relative volume. Then write one sentence on what it shows and one sentence on what it does not show.

<details><summary>Check your answer</summary>

- Relative volume: 90,000 divided by 2,50,000 = 0.36.
- Check: 2,50,000 multiplied by 0.36 = 90,000.
- What it shows: the day had much less trading than usual. Fewer people traded than on a normal day.
- What it does not show: the volume does not tell you the direction of the price next. It also does not prove what caused the fall.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the relative volume formula, traded value in rupees, and what a high or low volume day does and does not show.

## Paper task

Mode: paper. Write it in your journal. If the journal is not ready, use paper.

1. Pick 10 breakouts that you logged in *Breakouts*.
2. For each breakout, write the average volume for the 20 days before it.
3. Divide the breakout day's volume by that average. Record the relative volume.
4. Put the 10 results in one table. Compare them with the notes you wrote in *Breakouts*.
5. Write that 10 samples are too few to draw a conclusion.

## Limits and common mistakes

- Volume does not show direction. A down day can have low volume, as the independent exercise shows. A down day can also have high volume.
- A total volume figure means little on its own. Compare it with the same stock's own average. A number that is large for one stock can be small for another.
- Volume confirmation is a common idea. It is not shown to work in this chapter. Test a rule before you rely on it (*Backtesting basics and the realism contract*).
- A thin stock can move on small volume. Small volume is a liquidity risk for your planned position.

## Remember

- Volume is the number of shares traded in a period.
- Relative volume = today's volume divided by the average volume.
- High volume shows more trading. It does not show direction.
- Traded value = volume multiplied by price. It shows the rupee size of the trading.

## Sources and verification

Sources:

- NSE India, market data glossary
- Zerodha Varsity, volume module (reference only, original wording here)

Facts to check:

Facts checked on 11 Nov 2026:

- NSE lists a "Security-wise Delivery Positions" report on its reports page and reads a higher deliverable share as buyers holding on to shares. Read the exact NSE definition on the NSE site before you rely on it.
- How Kite draws volume on charts was not checked here. Look at the volume setting on your own chart.

<!-- standing-disclaimer -->
