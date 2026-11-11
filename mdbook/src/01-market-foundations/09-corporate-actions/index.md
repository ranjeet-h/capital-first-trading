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

You hold 100 shares of a stock priced at Rs 1,000. Overnight the chart shows the price at Rs 500, a fall of 50%. Hypothetical: the company has split each share into two, and you now hold 200 shares worth about Rs 500 each. Your holding is still worth Rs 1,00,000. The chart fell, but you did not lose anything.

## The idea

A **corporate action** is an event decided by a company that changes its shares, its share price, or the cash its holders receive.

- **Split:** each existing share becomes more shares. Each one is worth proportionally less. Total value is unchanged at the moment of the split. A "1:2 split" means each share becomes two.
- **Bonus issue:** the company gives existing holders free additional shares in a stated ratio. A "1:1 bonus" gives one extra share for each share held. Total value is unchanged at the moment of the issue.
- **Dividend:** cash paid per share held. On the ex-date, the share price adjusts down by about the dividend amount. [VERIFY: ex-date definition and rules, SEBI LODR and NSE corporate actions pages]
- **Rights issue:** existing holders can buy new shares at a stated price. Entitlement and mechanics are set by rules that must be checked. [VERIFY: SEBI rights issue rules]

**Key dates.** Announcement, record date and ex-date. Their definitions are [VERIFY: record date, ex-date and announcement definitions].

**Formulas in words.**

- New share count = old share count x the ratio (for a 1:2 split, the ratio is 2).
- Approximate new price = old price divided by the same ratio.
- Holding value = shares held x price, plus any cash received.

**Adjusted and unadjusted prices.**

- An **unadjusted** chart shows the raw trading price on each day. A split shows up as a sudden fall.
- An **adjusted** chart corrects past prices for splits and bonuses, so the line stays continuous. Dividend adjustment rules [VERIFY: adjustment method].

**Where announcements come from.** The company and the exchange publish corporate actions. Read the filing, not a forwarded summary.

**A price drop on a corporate action is not a sell signal.** A split or an ex-date drop changes the number on the screen. It does not, on its own, change what the holding is worth.

## See it

The table shows the same holding before and after each event, using hypothetical numbers.

| Event | Before | After | Value check |
|---|---|---|---|
| Split 1:2 (each share becomes two) | 100 shares at Rs 1,000 = Rs 1,00,000 | 200 shares at about Rs 500 | 200 x 500 = Rs 1,00,000 |
| Bonus 1:1 (one free share per share held) | 100 shares at Rs 1,000 = Rs 1,00,000 | 200 shares at about Rs 500 | 200 x 500 = Rs 1,00,000 |
| Dividend Rs 10 per share (dummy) | 100 shares at Rs 1,000, no cash | 100 shares at about Rs 990, Rs 1,000 cash | 100 x 990 + 1,000 = Rs 1,00,000 |

Look at the value column. Each row ends at the same total, before market movement and before tax. The number of shares and the price change. The holding's value does not.

<!-- OPEN: spec asks for a static before-and-after candle chart. Candle charts are not in the component list, so a table is used here. Confirm. -->

## Worked example

Hypothetical, using round figures.

**Split 1:2.** Holder has 100 shares at Rs 1,000.

| Step | Calculation | Result |
|---|---|---|
| Value before | 100 x 1,000 | Rs 1,00,000 |
| New shares | 100 x 2 | 200 |
| Approximate new price | 1,000 / 2 | about Rs 500 |
| Value after | 200 x 500 | Rs 1,00,000 |

**Dividend Rs 10 per share (dummy).** Holder has 100 shares at Rs 1,000.

| Step | Calculation | Result |
|---|---|---|
| Cash received | 100 x 10 | Rs 1,000 |
| Approximate new price on ex-date | 1,000 - 10 | about Rs 990 |
| Value of shares | 100 x 990 | Rs 99,000 |
| Total value | 99,000 + 1,000 | Rs 1,00,000 |

This is before market movement and before tax. Tax treatment of dividends is covered in *Taxes on trading profits*.

**Unadjusted chart.** The price drops from Rs 1,000 to Rs 500 on the split day. The fall on the chart is (500 - 1,000) / 1,000 = -50%. That is a change in the share count and price, not a loss.

## Try it

<!-- OPEN: spec gives no interactive demo for this chapter. No component placeholder is inserted. -->

### Guided exercise

**Task.** You hold 300 shares at Rs 600, a total of Rs 1,80,000. A 1:1 bonus is announced. Compute the new share count and the approximate new price.

Hints:
1. Each share gets one free share, so the new count is the old count times 2.
2. The approximate new price is the old price divided by 2.
3. Multiply the new count by the new price to check the value.

**Answer:** 600 shares at about Rs 300 each. Check: 600 x 300 = Rs 1,80,000.

### Independent exercise

**Task.** A stock trades at Rs 900. You hold 50 shares. It announces a 3:1 split, where each share becomes three. Compute the new share count, the approximate new price and the value.

<details><summary>Check your answer</summary>

- New shares: 50 x 3 = 150.
- Approximate new price: 900 / 3 = Rs 300.
- Value: 150 x 300 = Rs 45,000. Check: 50 x 900 = Rs 45,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions on split arithmetic, dividend value, unadjusted charts and whether a split or dividend changes total value.

## Paper task

**Mode: learning note.**

1. Find one past corporate action announcement for a listed company, on the exchange website.
2. Record its type, ratio, record date and ex-date in your own words. Mark any date you cannot confirm.
3. Check whether a chart you use is adjusted or unadjusted, using your own platform's settings.
4. Write no trading decision based on the announcement.
5. Log it in your journal, or on paper until the journal app is ready.

## Limits and common mistakes

- A split or bonus does not change the value of your holding at the moment it happens.
- A dividend does not always increase your total value. The price adjusts on the ex-date, and the market moves on top of that.
- A drop on an ex-date or split is not a sell signal, and an announcement alone is not a trading reason.
- Dates, ratios and rights rules must be checked against the official filing.
- Tax on dividends is covered in *Taxes on trading profits*, not here.

## Remember

- A split or bonus changes the share count and the price. Total value stays the same at that moment.
- A dividend is cash per share. On the ex-date, the price adjusts down by about that amount.
- An unadjusted chart can show a false crash after a split.
- Adjusted charts correct past prices so the line is continuous.
- Read the official announcement, not a summary of it.

## Sources and verification

Sources:
- SEBI LODR regulations.
- NSE corporate actions page.
- BSE corporate actions page.
- Company announcements on exchange filings.

Facts to verify:
- [VERIFY: record date, ex-date and announcement definitions, SEBI LODR and NSE]
- [VERIFY: ex-date rules, NSE corporate actions page]
- [VERIFY: rights issue rules, SEBI]
- [VERIFY: adjustment method for historical prices]
- [VERIFY: tax treatment of dividends, cross-reference *Taxes on trading profits*]

<!-- facts-needed: record date, ex-date and announcement definitions; ex-date rules; rights issue rules; price adjustment method; dividend tax treatment (*Taxes on trading profits*) -->

<!-- standing-disclaimer -->
