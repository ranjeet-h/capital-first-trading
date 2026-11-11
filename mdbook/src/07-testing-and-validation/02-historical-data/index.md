<!-- meta
id: T7.2
title: Historical data
page_type: Concept
prerequisites: [T7.1, T1.9]
labs: [Lab 4, Lab 3]
estimated_minutes: 25
-->

# Historical data

## Hook

Imagine you test an idea on a file of old prices. The file shows a share falling 50% in one day. Did the share really fall that much, or is the file wrong? A stock split can cause this kind of change. A bad row can cause it too. If you do not check the file first, the test can give a false answer. This chapter explains what price data holds, what it leaves out, and how to check it before a test.

## The idea

**Historical data** is a file of past prices. Most free files have one row for each trading day. Each row holds five numbers. The five numbers are called OHLCV:

- **Open:** the price at the start of the day.
- **High:** the highest price reached during the day.
- **Low:** the lowest price reached during the day.
- **Close:** the price at the end of the day.
- **Volume:** the number of shares that changed hands during the day.

OHLCV leaves things out. It does not show the bid and the ask, which are the prices buyers and sellers offer at one moment (*Order matching, spread and liquidity*). It also does not show the order-by-order path of trades inside the day. So a test on daily rows cannot know the order of events inside the day.

**Corporate actions** are company events that change the share price or share count. A **split** is one example. After a split, you hold more shares, each at a lower price. The total value stays the same. Other examples are bonus issues and dividends (*Corporate actions*).

Corporate actions create two kinds of price series:

- **Unadjusted:** the prices as they traded on each day. The past stays as it was.
- **Adjusted:** the past prices are rewritten to match the new share count. The old prices change in the file.

An adjusted series can contain information that was known only later. The adjustment is worked out after the event. If a test uses that number as if it were known on the day, it looks into the future. This is a form of look-ahead bias (*Look-ahead bias*).

Before a test, check the file. The import checks used in Lab 4 are these:

| Check | What it looks for | What to do |
|---|---|---|
| Sorted dates | Each date comes after the one before it | Fix the order against the source. Do not guess. |
| Duplicate dates | Two rows for the same day | Find out why before you keep either row. |
| Gaps | A trading day missing from the dates | Compare with the exchange holiday list [VERIFY: NSE holiday list]. Some gaps are holidays. |
| Zero or negative prices | A price of zero or below | Treat it as an error to check. |
| OHLC consistency | The high must be at or above the open and close. The low must be at or below the open and close. | Check the row against the source. |
| Jumps over 20% | A large move with no flag for a split | Ask the question: is there a flagged split? Do not delete the row on sight. |
| Zero volume | No shares traded that day | Check the day with the source before you use it. |

Free data is not always complete or correct. The checks find some problems, not all of them.

**Licence.** A data source sets its own terms. Many free sources allow personal use only. Read the terms at the source. Do not assume you may share, sell or publish a file. Yahoo Finance is one free source. Its file columns and its adjustment method are [VERIFY: Yahoo Finance CSV columns and adjustment method]. Its personal-use terms are [VERIFY: Yahoo Finance terms of use].

The bundled practice data in this book is made up. If you import real data, it stays on your own device. The source's terms still apply to that data.

## See it

| Step | What happens |
|---|---|
| 1. Read | The file is opened. |
| 2. Sniff the header | The row with the column names is found. |
| 3. Map columns | Each column is matched to Date, Open, High, Low, Close and Volume. |
| 4. Validate | Each row is checked against the rules in *The idea*. |
| 5. Preview | You see which rows pass and which rows fail. |
| 6. Accept or exclude | You decide which rows to keep. |

The import in Lab 4 follows these six steps. Read them in order. A row must pass the checks before it reaches a test.

## Worked example

**Hypothetical. A split.** One share is priced at Rs 1,000. The company splits it 1 for 2. Each old share becomes 2 shares. The price becomes Rs 500.

| | Before the split | After the split |
|---|---|---|
| Your holding | 10 shares at Rs 1,000 | 20 shares at Rs 500 |
| Value | 10 x 1,000 = Rs 10,000 | 20 x 500 = Rs 10,000 |

Your value did not change. But the unadjusted price series falls from Rs 1,000 to Rs 500. That looks like a fall of 50%: (500 - 1,000) / 1,000 = -50%. No one lost value because of the split. A test that uses the unadjusted series will still see a loss.

**Hypothetical. A bad row.** A second file has six rows. Each row is one trading day.

| Row | Date | Open (Rs) | High (Rs) | Low (Rs) | Close (Rs) | Volume |
|---|---|---|---|---|---|---|
| 1 | 2026-03-02 | 250 | 254 | 248 | 252 | 1,20,000 |
| 2 | 2026-03-03 | 252 | 256 | 250 | 255 | 98,000 |
| 3 | 2026-03-04 | 255 | 257 | 253 | 254 | 1,10,000 |
| 4 | 2026-03-05 | 255 | 258 | 252 | 251 | 1,05,000 |
| 5 | 2026-03-06 | 251 | 253 | 249 | 252 | 1,01,000 |
| 6 | 2026-03-09 | 252 | 255 | 251 | 254 | 99,000 |

Row 4 has a low of Rs 252 and a close of Rs 251. The low is above the close. A day's low cannot be above its close. So row 4 breaks the OHLC rule. The other five rows pass every check.

## Try it

### Guided exercise

**Task.** Check this six-row hypothetical file. Name each problem, the row it sits in, and what you would do next.

| Row | Date | Open (Rs) | High (Rs) | Low (Rs) | Close (Rs) | Volume |
|---|---|---|---|---|---|---|
| 1 | 2026-03-02 | 100 | 102 | 99 | 101 | 50,000 |
| 2 | 2026-03-03 | 101 | 103 | 100 | 102 | 60,000 |
| 3 | 2026-03-03 | 102 | 104 | 101 | 103 | 55,000 |
| 4 | 2026-03-04 | 103 | 104 | 101 | 102 | 0 |
| 5 | 2026-03-05 | 130 | 132 | 128 | 131 | 90,000 |
| 6 | 2026-03-06 | 131 | 130 | 129 | 132 | 85,000 |

Hints:

1. Check the date order first, from row 1 to row 6.
2. Then check for duplicate dates.
3. Then check each row's OHLC rule, one row at a time.
4. A jump over 20% is a question to answer. It is not an automatic deletion.

**Answer:**

- **Date order:** passes. The dates run from 2 March to 6 March.
- **Duplicate date:** rows 2 and 3 both show 3 March. Find out why before you keep either row. Do not keep both.
- **Zero volume:** row 4 shows no shares traded. Check the source before you use that day.
- **Jump over 20%:** row 5 closes at Rs 131. Row 4 closed at Rs 102. The rise is 131 - 102 = Rs 29. 29 / 102 = 28.4%. There is no split flag in the file. Ask the source. Do not delete the row without a reason.
- **OHLC rule:** row 6 fails. Its high is Rs 130. Its open of Rs 131 and its close of Rs 132 are both above the high. Check the row against the source, or exclude it.
- **Clean rows:** row 1 passes every check. Row 5 passes the OHLC rule, but its jump needs an answer.

### Independent exercise

**Task.** In writing, explain what goes wrong if adjusted and unadjusted price series are mixed in one backtest.

<details><summary>Check your answer</summary>

A backtest that mixes the two series can see the same share at two different prices. Take the split from the worked example. Before the split, the series shows Rs 1,000. After the split, the adjusted series shows Rs 500 for the same past price, or the unadjusted series shows Rs 500 for the new price. Either way, the test sees a fall of 50% that did not happen to the holder. A stop or a signal can then fire on that fake fall. The test reports trades and results that did not happen. The result looks wrong, and the cause is the mixed data, not the idea.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks adjusted and unadjusted prices, the OHLC rule, and the jump check.

## Paper task

Mode: **learning note**. Use Lab 4 to import the bundled practice file and write a validation summary. If the lab is not ready, do the task on paper or in a spreadsheet, using the six rows in the worked example.

1. Write the row count of the file.
2. List each row that fails a check, with the reason.
3. Write what you chose to do with each failed row, and why.
4. Record the summary in a learning note. Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- Free data can be incomplete or wrong. A file that passes the checks can still contain errors the checks cannot find.
- More history does not always make a test better. Old prices may come from a time with different market rules [VERIFY: rule changes over the years for the chosen source].
- A clean price file is not full market data. It has no bid and ask prices and no order-by-order detail.
- You may use the data for personal use only, under the source's terms. Do not share the files.

## Remember

- OHLCV is one row per day: open, high, low, close and volume.
- A split changes the price and the share count. The total value stays the same.
- Unadjusted and adjusted series must not be mixed in one test.
- A jump over 20% is a question. Check it with the source.
- A row that breaks the OHLC rule is a row to check, not a typo to ignore.

## Sources and verification

- Yahoo Finance help and terms pages.
- An NSE historical data or reports page, and its terms of use.

[VERIFY: Yahoo Finance CSV columns and adjustment method]
[VERIFY: Yahoo Finance terms of use and personal-use position]
[VERIFY: NSE bhavcopy-style file layout and NSE terms for these files]
[VERIFY: NSE holiday list]

<!-- facts-needed: Yahoo Finance CSV columns and adjustment method; Yahoo Finance terms of use and personal-use position; NSE bhavcopy-style file layout and terms for these files; NSE holiday list used for gap checks. -->

<!-- standing-disclaimer -->
