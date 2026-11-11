<!-- meta
id: T7.5
title: Survivorship bias
page_type: Concept
prerequisites: [T7.2, T7.4]
labs: [Lab 4]
estimated_minutes: 15
-->

# Survivorship bias

## Hook

Imagine you test a rule on today's list of companies, going back to 2015. The test looks strong. But the companies that failed, merged or stopped trading are not on today's list. The test only saw the companies that survived. So the result looks better than a trader could have got in 2015. This mistake is called survivorship bias.

## The idea

**Survivorship bias** means a test includes only the things that lasted. The companies that fell out of the market are missing.

A company can leave the list in three common ways:

- It is **delisted**. Its shares are removed from the exchange and no longer trade.
- It **merges** into another company.
- It **stops trading** for a long period, or its shares become worthless.

Companies that left in these ways drop out of today's lists. A test built on those lists never sees them. The missing companies are often the ones that did badly. So the bias pushes results toward looking better, not worse.

The test universe must be the stocks that existed and could be traded on each past date. This is called a **point-in-time universe**. A test that uses it includes a company in each past year when it was really part of the market, even if it is gone today.

Lab 4 includes delisted synthetic tickers. It can also book a delisted stock's loss at its last traded price. That loss is a setting you can change. It is not a real exit price.

Free data sources often lack the price history of delisted companies. That is a data limit. It must be stated in the test, not hidden.

## See it

| Stock (hypothetical) | Two-year result | In the survivors-only test? | In the full test? |
|---|---|---|---|
| A | +50% | Yes | Yes |
| B | +20% | Yes | Yes |
| C | -100%, delisted and worthless | No | Yes |
| D | -40%, trading stopped and it left today's list | No | Yes |

Look at the two columns on the right. The survivors-only test leaves out C and D. The full test keeps them. The result of the two tests differs by a lot.

*The lab's interactive survivorship comparison is not shown here yet.*

<!-- OPEN: The spec gives a lab-backtest survivorship comparison with survivors and the full universe side by side. The lab-backtest component is not in the allowed component list, so no placeholder is inserted. The table above stands in for it. Also confirm why D is excluded from the survivors-only group: the spec names only A and B as survivors and does not say why D is missing. This chapter gives D the reason "dropped out of today's list", which is hypothetical. -->

## Worked example

**Hypothetical.** Four stocks over two years:

- A: +50%
- B: +20%
- C: -100% (delisted and worthless)
- D: -40% (trading stopped and it left today's list)

**Survivors-only test (A and B):**

- Average: (50 + 20) / 2 = **+35%**.

**Full test (A, B, C and D):**

- Average: (50 + 20 - 100 - 40) / 4 = -70 / 4 = **-17.5%**.

For a simple comparison, apply each average to Rs 10,000:

- Survivors-only: 35% of Rs 10,000 = **Rs 3,500 gain**.
- Full test: -17.5% of Rs 10,000 = **Rs 1,750 loss**.

The gap between the two results is 35 - (-17.5) = 52.5 percentage points. The survivors-only test shows a gain. The full test shows a loss. Both use the same four stocks. Only the list differs.

## Try it

### Guided exercise

**Task.** Add a fifth stock, E, which rose 10%. Recompute both averages. Then compare the gap between the two averages before and after adding E.

Hints:

1. The survivors are now A, B and E. The full universe has five stocks.
2. Work out each average to one decimal place.
3. Compare the gap before and after E is added.

**Answer:**

- Survivors-only: (50 + 20 + 10) / 3 = 80 / 3 = **+26.7%**.
- Full test: (50 + 20 - 100 - 40 + 10) / 5 = -60 / 5 = **-12.0%**.
- Gap before E: 35.0 - (-17.5) = 52.5 points.
- Gap after E: 26.7 - (-12.0) = 38.7 points.

Adding E narrows the gap but does not remove it. C and D are still missing from the survivors-only test.

### Independent exercise

**Task.** Name the data you would need for a point-in-time test of a strategy that trades only index members. For each item, say whether you could get it free. [VERIFY: free availability of each item]

<details><summary>Check your answer</summary>

You would need:

- **Past index membership lists**, with the date each company joined and the date each company left. Without these, you cannot know who was in the index on each past date.
- **Price history for companies that have left the index**, including companies that were delisted or merged. Without these, the test is still biased.
- **Corporate action history** for each company, such as splits, bonus issues and mergers (*Corporate actions*). Without these, prices cannot be adjusted correctly (*Historical data*).

Whether you can get each item free is [VERIFY: free availability of past index membership, delisted price history and corporate action records, from the chosen sources]. Many free sources do not have all three. If you cannot get them, say so in the test plan. Do not hide the gap.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the definition of survivorship bias, the direction of its effect, and how to choose a universe for a past-date test.

## Paper task

Mode: **learning note**. Use Lab 4 to run the survivors-only test and the full-universe test on the same rules. If the lab is not ready, do the task on paper or in a spreadsheet, using the four-stock example.

1. Write the survivors-only average and the full-universe average.
2. Write the gap between them.
3. Write which stocks each test used, and why.
4. Log the note in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- The four-stock example is made up. Real losses from delisting vary. Do not apply the Rs 1,750 figure to a real test.
- Free sources often lack the price history of delisted companies. A missing history is still a bias, even when the reason is practical.
- A point-in-time list fixes the universe. It does not fix the rules. Look-ahead can still enter the rules (*Look-ahead bias*).
- A large list of stocks is not a fix on its own. A large list of today's companies is still a survivors-only list.

## Remember

- Survivorship bias comes from testing only the companies that lasted.
- Delisted, merged and suspended companies drop out of today's lists.
- The effect pushes results toward looking better.
- The test universe must be the stocks that could be traded on each past date.
- A data limit must be stated, not hidden.

## Sources and verification

- NSE Indices methodology and constituent pages. [VERIFY: index constituent history and methodology]
- The help page of the chosen data source. [VERIFY: availability and terms of delisted-stock price history]

<!-- facts-needed: availability and terms of delisted-stock price history from free sources; index constituent history and methodology on the NSE indices site. -->

<!-- standing-disclaimer -->
