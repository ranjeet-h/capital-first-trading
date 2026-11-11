<!-- meta
id: T1.9
title: Corporate actions
page_type: Concept
prerequisites: [T1.1, T1.4]
labs: []
estimated_minutes: 20
-->

# Corporate actions

## Hook

You hold 100 shares of a stock priced at Rs 1,000. Overnight, the chart shows the price at Rs 500. That looks like a fall of 50%. This is a hypothetical example. The company has split each share into two. You now hold 200 shares. Each is worth about Rs 500. Your holding is still worth Rs 1,00,000. The chart fell, but you did not lose anything.

## The idea

A **corporate action** is an event that a company decides on. It changes the company's shares, the share price, or the cash that holders receive.

- **Split:** each existing share becomes more shares. Each new share is worth less. The total value does not change at the moment of the split. A "1:2 split" means each share becomes two.
- **Bonus issue:** the company gives existing holders free extra shares, in a stated ratio. A "1:1 bonus" gives one extra share for each share you hold. The total value does not change at the moment of the issue.
- **Dividend:** cash paid for each share you hold. On the ex-date, the share price drops by about the dividend amount. (As of 11 Nov 2026, Zerodha support page on ex-date and record date. Rules change, so check the exchange site.)
- **Rights issue:** existing holders can buy new shares at a stated price. The company's offer document says who can buy, how many shares, at what price and by what date. Read it for each rights issue, because the terms differ. This chapter does not teach the SEBI rights issue rules.

**Key dates.** The company announces the action. It then sets a record date and an ex-date. The **record date** is the day the company checks its list of owners to see who gets the benefit. The exchange goes by the record date. Since settlement became T+1, the **ex-date** and the record date are the same day. To get the benefit you must buy at least one trading day before that day. Think of a cut-off day for a prize list: your name must already be on the list. For bonus issues announced on or after 1 Oct 2024, the bonus shares are credited one working day after the record date and begin trading the day after that. (As of 11 Nov 2026, NSE corporate actions FAQ updated 7 Jul 2026, Zerodha support, and SEBI circular of 16 Sep 2024. Rules change, so check the NSE site.)

**Formulas in words.**

- New share count = old share count x the ratio. For a 1:2 split, the ratio is 2.
- Approximate new price = old price divided by the same ratio.
- Holding value = shares held x price, plus any cash received.

**Adjusted and unadjusted prices.**

- An **unadjusted** chart shows the real trading price on each day. A split shows up as a sudden fall.
- An **adjusted** chart fixes past prices for splits and bonuses. The line stays smooth. Tools differ in how they adjust, and some do not adjust for dividends at all. Check the setting of your own charting tool. Zerodha says Kite charts show corporate actions from the ex-date.

**Where announcements come from.** The company and the exchange publish corporate actions. Read the official filing. Do not rely on a forwarded summary.

**A price drop on a corporate action is not a sell signal.** A split or an ex-date drop changes the number on the screen. On its own, it does not change what your holding is worth.

## See it

The table shows the same holding before and after each event. The numbers are hypothetical.

| Event | Before | After | Value check |
|---|---|---|---|
| Split 1:2 (each share becomes two) | 100 shares at Rs 1,000 = Rs 1,00,000 | 200 shares at about Rs 500 | 200 x 500 = Rs 1,00,000 |
| Bonus 1:1 (one free share per share held) | 100 shares at Rs 1,000 = Rs 1,00,000 | 200 shares at about Rs 500 | 200 x 500 = Rs 1,00,000 |
| Dividend Rs 10 per share (made up) | 100 shares at Rs 1,000, no cash | 100 shares at about Rs 990, Rs 1,000 cash | 100 x 990 + 1,000 = Rs 1,00,000 |

Look at the value column. Each row ends at the same total. This is before market movement and before tax. The number of shares and the price change. The value of the holding does not.

<!-- component: corporate-action-demo | action: split | shares: 100 | price: 1000 | ratio: 2 | caption: The chapter's 1:2 split on 100 shares at Rs 1,000. Switch to bonus or dividend. The price changes, the value of your holding does not. -->

## Worked example

This is a hypothetical example with round figures.

**Split 1:2.** You hold 100 shares at Rs 1,000.

| Step | Calculation | Result |
|---|---|---|
| Value before | 100 x 1,000 | Rs 1,00,000 |
| New shares | 100 x 2 | 200 |
| Approximate new price | 1,000 / 2 | about Rs 500 |
| Value after | 200 x 500 | Rs 1,00,000 |

**Dividend Rs 10 per share (made up).** You hold 100 shares at Rs 1,000.

| Step | Calculation | Result |
|---|---|---|
| Cash received | 100 x 10 | Rs 1,000 |
| Approximate new price on ex-date | 1,000 - 10 | about Rs 990 |
| Value of shares | 100 x 990 | Rs 99,000 |
| Total value | 99,000 + 1,000 | Rs 1,00,000 |

This is before market movement and before tax. Tax on dividends is covered in *Taxes on trading profits*.

**Unadjusted chart.** The price drops from Rs 1,000 to Rs 500 on the split day. The fall on the chart is (500 - 1,000) / 1,000 = -50%. This is a change in the share count and the price. It is not a loss.

## Try it

<!-- component: corporate-action-demo | action: bonus | shares: 300 | price: 600 | ratio: 1 | caption: The guided exercise: 300 shares at Rs 600 with a 1:1 bonus. Check your own answer against the demo. -->

### Guided exercise

**Task.** You hold 300 shares at Rs 600. That is a total of Rs 1,80,000. A 1:1 bonus is announced. Compute the new share count and the approximate new price.

Hints:
1. Each share gets one free share, so the new count is the old count times 2.
2. The approximate new price is the old price divided by 2.
3. Multiply the new count by the new price to check the value.

**Answer:** 600 shares at about Rs 300 each. Check: 600 x 300 = Rs 1,80,000.

### Independent exercise

**Task.** A stock trades at Rs 900. You hold 50 shares. The company announces a 3:1 split. Each share becomes three. Compute the new share count, the approximate new price and the value.

<details><summary>Check your answer</summary>

- New shares: 50 x 3 = 150.
- Approximate new price: 900 / 3 = Rs 300.
- Value: 150 x 300 = Rs 45,000. Check: 50 x 900 = Rs 45,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions. They cover split arithmetic, dividend value, unadjusted charts, and whether a split or dividend changes total value.

## Paper task

**Mode: learning note.**

1. Find one past corporate action announcement for a listed company, on the exchange website.
2. Write down its type, ratio, record date and ex-date in your own words. Mark any date you cannot confirm.
3. Check whether a chart you use is adjusted or unadjusted, using your own platform's settings.
4. Write no trading decision based on the announcement.
5. Write your notes in your journal.

## Limits and common mistakes

- A split or bonus does not change the value of your holding at the moment it happens.
- A dividend does not always increase your total value. The price adjusts on the ex-date. The market moves on top of that.
- A drop on an ex-date or split is not a sell signal. An announcement alone is not a reason to trade.
- Dates, ratios and rights rules must be checked against the official filing.
- Tax on dividends is covered in *Taxes on trading profits*, not here.

## Remember

- A split or bonus changes the share count and the price. The total value stays the same at that moment.
- A dividend is cash for each share. On the ex-date, the price drops by about that amount.
- An unadjusted chart can show a false crash after a split.
- Adjusted charts fix past prices so the line is smooth.
- Read the official announcement, not a summary of it.

## Sources and verification

Sources:
- SEBI LODR regulations.
- NSE corporate actions page.
- BSE corporate actions page.
- Company announcements on exchange filings.

Facts checked on 11 Nov 2026:
- The record date and ex-date are the same day under T+1. The exchange goes by the record date, which companies set under SEBI's listing rules (Regulation 42).
- The bonus timing rule comes from SEBI circular CIR/CFD/PoD/2024/122 of 16 Sep 2024.
- Rights issue terms and chart adjustment methods were not checked here. Read each company's offer document, and the help pages of your charting tool.
- Tax on dividends is not covered here. See *Taxes on trading profits*.

<!-- standing-disclaimer -->
