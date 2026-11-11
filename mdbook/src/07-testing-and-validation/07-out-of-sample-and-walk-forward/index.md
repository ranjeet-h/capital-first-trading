<!-- meta
id: T7.7
title: Out-of-sample and walk-forward testing
page_type: Concept
prerequisites: [T7.3, T7.6]
labs: [Lab 4]
estimated_minutes: 25
-->

# Out-of-sample and walk-forward testing

## Hook

Ana tests a trading rule on ten years of daily prices. This is a hypothetical example. She tries many settings and keeps the one that scores best. The score looks strong. But she chose the settings using the same years she then scored them on. That is like writing an exam and marking it with your own answer key. This chapter shows how to keep some data aside, so the test is honest.

## The idea

Split the data by time, never at random. Part of the data is **in-sample**. You may use it to choose settings. The rest is **out-of-sample**. You may not use it to choose anything. The out-of-sample part is the test. It shows how the rule behaves on prices that did not help you choose it.

Why keep the order of the dates? Markets change over the years. If you shuffle the days at random, some later days land in the training part. The training then learns from prices that come after the test days. This leaks the future into the past. A random shuffle does not make the test fairer. It makes the test less honest.

The default split in the backtest lab is 70 percent in-sample and 30 percent out-of-sample, cut by time. The first 70 percent of the dates is for choosing. The last 30 percent is for testing.

One split tests the rule once. **Walk-forward testing** repeats the test many times:

1. Choose settings on a training window.
2. Test those settings on the next window. The choice did not use that window.
3. Roll both windows forward by one step.
4. Join the test results in date order.

The lab's default windows are 3 years of training and 1 year of testing. They roll forward by 1 year at a time.

A test period stays honest only while nobody uses it to make choices. Suppose you look at 2023, change one stop, and test again on 2023. Now 2023 has been used to choose. It is in-sample again, and the second result does not test the rule. A test period that you look at once, with no changes, is still a test period. The same period, seen after tuning, is not.

A passed out-of-sample test is one more piece of evidence. It is not proof. Walk-forward testing does not prove a rule works either. It shows how the rule's choices held up across several separate test years.

## See it

| Run | Training years | Test year |
|---|---|---|
| 1 | 2016 to 2018 | 2019 |
| 2 | 2017 to 2019 | 2020 |
| 3 | 2018 to 2020 | 2021 |
| 4 | 2019 to 2021 | 2022 |
| 5 | 2020 to 2022 | 2023 |
| 6 | 2021 to 2023 | 2024 |
| 7 | 2022 to 2024 | 2025 |

Read each row from left to right. The training years come first and the test year comes after them. The test year is never used to pick that row's settings. Look down the last column: the test years run from 2019 to 2025 with no gaps.

<!-- component: walk-forward-demo | caption: Roll the training and test years forward, then compare with one split and with a random shuffle. -->

## Worked example

**Hypothetical.** Ten years of daily prices, 2016 to 2025.

**Step 1. The 70/30 split by time.**

| Part | Years | Length | Use |
|---|---|---|---|
| In-sample | 2016 to 2022 | 7 years | Choose settings |
| Out-of-sample | 2023 to 2025 | 3 years | Test once |

Seven years is 70 percent of ten years. Three years is 30 percent.

**Step 2. Walk-forward with 3 years of training and 1 year of testing, rolling by 1 year.**

- The first window trains on 2016 to 2018 and tests 2019.
- The next window trains on 2017 to 2019 and tests 2020.
- The last window trains on 2022 to 2024 and tests 2025.

Count the test years: 2019 to 2025 is 7 years. So there are **7 windows**.

The joined test results cover 2019 to 2025 only. The years 2016 to 2018 were training data for the first window. They never appear in the joined test results.

## Try it

### Guided exercise

**Task.** Use data for 2019 to 2024, which is six years. Train on 2 years, test on 1 year, and roll forward by 1 year. List every window.

Hints:

1. The first test year is the third year of data.
2. The answer has 4 windows.
3. Each window uses 3 years in total: 2 for training and 1 for testing.

**Answer:**

- Window 1: train 2019 to 2020, test 2021.
- Window 2: train 2020 to 2021, test 2022.
- Window 3: train 2021 to 2022, test 2023.
- Window 4: train 2022 to 2023, test 2024.

Four windows. The joined test results cover 2021 to 2024.

### Independent exercise

**Task.** Explain why "settings optimised on all ten years, then tested on the last three" is not an out-of-sample result.

<details><summary>Check your answer</summary>

The settings were chosen using all ten years. That includes the last three years. Those years were already used to make choices, so they are in-sample. Testing them afterwards checks data that the choice was built from. It does not check data the choice has never seen.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks time order, counting windows, reuse of the test period, and what walk-forward does and does not show.

## Paper task

Mode: **learning note**. If the backtest lab is not ready, do this task on paper or in a spreadsheet.

1. Choose one set of settings and one set of daily prices. Use at least ten years, if you have them.
2. Run one split: 70 percent in-sample and 30 percent out-of-sample, cut by time. Write down the last in-sample date and the first out-of-sample date.
3. Run one walk-forward with 3 years of training and 1 year of testing, rolling by 1 year. Write down the first window and the last window.
4. Use the same settings in both runs. Change nothing between them.
5. Log the note in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- A good out-of-sample result is not a promise. It does not mean the rule will work with real money.
- Three test years may not include every kind of market. A rule that passes in one kind of year may fail in another.
- Walk-forward testing does not remove look-ahead bias or survivorship bias. Those need their own checks (*Look-ahead bias* and *Survivorship bias*).
- Each change made after you look at a test period turns that period into in-sample data. Keep a count of how often you looked (*Overfitting and the number of things you tried*).
- The joined test curve leaves out the early training years. In the worked example, 2016 to 2018 never appear in it.

## Remember

- Split by time. Never shuffle the dates before you split.
- In-sample data may be used to choose. Out-of-sample data may not.
- One 70/30 split tests once. Walk-forward testing tests in many windows.
- Looking at a test period and then changing the rule turns it into in-sample data.
- A passed test is one piece of evidence, not validation.

## Sources and verification

- Robert Pardo, *The Evaluation and Optimization of Trading Strategies*, 2nd edition (Wiley, 2008).
- The backtest lab's notes on split and walk-forward testing.

<!-- standing-disclaimer -->
