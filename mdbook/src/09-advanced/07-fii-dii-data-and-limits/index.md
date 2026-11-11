<!-- meta
id: T9.7
title: FII/DII data and its limits
page_type: Concept
prerequisites: [T1.10, T1.2]
labs: []
estimated_minutes: 15
-->

# FII/DII data and its limits

## Hook

A news line says, "FIIs bought Rs 600 crore today, so the market will rise." This chapter shows what that number means. It also shows what the number cannot tell you.

## The idea

**FII** means foreign institutional investors. **DII** means domestic institutional investors. Both are groups in the published daily data. The official depositories NSDL and CDSL publish foreign investor data under the name FII/FPI. FPI means foreign portfolio investor, which is the term used in current rules. The exact list of what NSE counts as DII is on the NSE FII/DII page, so read it there. (As of 11 Nov 2026, NSDL FPI reports page. Rules change, so check the NSDL and NSE sites.)

A **crore** is ten million rupees, written Rs 1,00,00,000. Daily flow figures are given in Rs crore.

Some figures are provisional. NSDL says the stock exchanges prepare provisional foreign investor data from the trading members' reports for the trade day. The final figures come later, from the custodians' reports to the depositories. So a number you read on the day can change. NSE also marks its figures as provisional. (As of 11 Nov 2026, NSDL FPI reports page. Check the NSDL and NSE sites.)

Four terms describe the figures.

- **Gross buy** is the total value bought in the day.
- **Gross sell** is the total value sold in the day.
- **Net** is gross buy minus gross sell. A negative net means net selling.
- **Gross turnover** is gross buy plus gross sell. It shows the total activity.

Use the net figure only with its gross context. A net of Rs 600 crore can come from a small amount of activity or a large amount. The gross figure shows the size of the activity.

Three limits matter most.

1. **The data is a total for a group.** It does not say which stock was bought or sold, or why.
2. **The data appears after the session.** Any use must respect that timing. The exact time of day differs, so check the NSE page for when it updates.
3. **Flow data is one input among many.** This book does not treat it as a trading signal.

## See it

The table shows the arithmetic for one hypothetical day.

| Item | Calculation | Result |
|---|---|---|
| FII gross buy | given | Rs 3,000 crore |
| FII gross sell | given | Rs 2,400 crore |
| Net | 3,000 - 2,400 | Rs 600 crore net buying |
| Gross turnover | 3,000 + 2,400 | Rs 5,400 crore |
| Net as a share of gross | 600 / 5,400 | 11.1% |

The net figure is 11.1% of the gross activity. A reader who sees only "FIIs net buyers Rs 600 crore" misses the size of the gross activity.

<!-- component: flow-bars | buy: 3000 | sell: 2400 | caption: The chapter's made-up day: Rs 3,000 crore bought and Rs 2,400 crore sold, so net Rs 600 crore, gross Rs 5,400 crore, net 11.1% of gross. -->

## Worked example

**Hypothetical day, in crore.** FII buy Rs 3,000 crore. FII sell Rs 2,400 crore.

- Net = 3,000 - 2,400 = **Rs 600 crore** of net buying.
- Gross turnover = 3,000 + 2,400 = **Rs 5,400 crore**.
- Net as a share of gross = 600 / 5,400 = **11.1%**. Check: 5,400 x 11.1% is about 600.

The day shows net buying. The same day also shows a large amount of selling. Both facts belong in the reading.

## Try it

<!-- component: flow-bars | buy: 1800 | sell: 2100 | caption: The guided exercise: buy Rs 1,800 crore and sell Rs 2,100 crore. Check your net and gross. -->

### Guided exercise

**Task.** Compute the net and the gross turnover for FII buy Rs 1,800 crore and FII sell Rs 2,100 crore.

Hints:

1. Net = buy minus sell. A negative number means net selling.
2. Gross = buy plus sell.
3. Check that the gross figure is larger than the net figure.

**Answer:**

- Net = 1,800 - 2,100 = **minus Rs 300 crore**. This is net selling.
- Gross turnover = 1,800 + 2,100 = **Rs 3,900 crore**.

### Independent exercise

**Task.** Write one paragraph on why "FIIs bought, so the market will rise" is not an inference the data supports.

<details><summary>Check your answer</summary>

A good paragraph has these points.

- The figure is a total for one day, across a whole group.
- It does not say which stocks were bought, at what prices, or why.
- It shows what happened, not what will happen next.
- Prices already reflect many facts. One day of flow does not show a link to later prices.
- The net figure needs its gross context. Even then, it describes the past day only.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks net against gross, stock-specific limits, one scenario on a day with net selling, timing and one spot-the-mistake.

## Paper task

Mode: **learning note**. This chapter has no practice. It asks for a record.

1. Record the day's published FII and DII figures in your learning note.
2. Write their definitions and units next to the figures.
3. Write the source and the time you read them.
4. Save this in your journal, or on paper until the journal app is ready.

## Limits and common mistakes

- Definitions, categories and publication time of the flow data can change. Read the NSE and NSDL pages.
- Provisional figures can be revised later. Note whether the figure you read is provisional or final.
- Flow data does not say which stock was bought or sold, or why.
- Flow data is one input among many. This book does not use it as a trading signal.
- Net buying does not mean the price will rise. Net selling does not mean it will fall.

## Remember

- FII means foreign institutional investors. DII means domestic institutional investors.
- Net is buy minus sell. Gross turnover is buy plus sell.
- Read the net figure with its gross context.
- Aggregate flow does not name a stock or give a reason.
- The data appears after the session, so it cannot guide trades made during that session.

## Sources and verification

- NSE FII/DII daily activity page
- NSDL FPI reports page (fpi.nsdl.co.in)
- SEBI pages on foreign portfolio investors

<!-- standing-disclaimer -->
