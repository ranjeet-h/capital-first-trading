<!-- meta
id: T7.6
title: Overfitting and the number of things you tried
page_type: Concept
prerequisites: [T7.3, T7.4]
labs: [Lab 4]
estimated_minutes: 25
-->

# Overfitting and the number of things you tried

## Hook

Imagine a trader tries 20 settings and keeps the best one. On the old data, that setting shows a profit of Rs 12,000 on Rs 50,000. The trader is pleased. Then the same setting is tested on new prices and loses Rs 3,000. The trader did not find an edge. The trader found the best of 20 tries, which was partly luck. This is overfitting. This chapter shows how to count the tries honestly.

## The idea

A **parameter** is a choice inside a rule. Examples are the number of days in an average, the width of a stop, or an extra filter. Each choice you try is a chance to find a lucky result.

A **grid search** tests every combination of the parameter choices. Each combination is a separate test. Count every one, including the ones you never report.

A **lucky result** is a good-looking result that appeared by chance. Suppose each test has a 5% chance of looking good by luck. Then 100 tests produce about 5 lucky results: 100 x 0.05 = 5. The numbers are simple, but the lesson is clear. The more tests you run, the more lucky results you will see.

Informal tweaking counts too. A variant you tried "just to see" is part of the number. Changes you did not record still count.

The **in-sample** data is the data you use to choose settings. The **out-of-sample** data is kept back and used only to check the chosen setting. The best in-sample result is biased upward. It was picked because it looked best on that data.

A **heat map** shows the result of every grid cell in one picture. The lab's overfitting demo shows the heat map for the in-sample data. It also shows the result of the chosen cell on the out-of-sample data.

## See it

| Result (hypothetical) | In sample (used to choose) | Out of sample (kept back) |
|---|---|---|
| Combinations tried | 20 | Not tested again |
| Chosen setting, result | Rs 12,000 profit on Rs 50,000 (24%) | Rs -3,000 on the same capital (-6%) |

The chosen setting looks strong on the data used to choose it. The same setting looks weak on the data kept back. The table shows the collapse. The heat map in the lab shows all 20 cells, not only the chosen one.

*The lab's interactive heat map is not shown here yet.*

<!-- OPEN: The spec gives a lab-backtest grid heat map with the chosen cell marked. The lab-backtest component is not in the allowed component list, so no placeholder is inserted. The table above stands in for it. Confirm the component name before the heat map is added. -->

## Worked example

**Hypothetical.** The grid has 5 lookbacks and 4 ATR multiples.

- Combinations: 5 x 4 = **20**.
- Best in-sample result: Rs 12,000 profit on Rs 50,000. That is 12,000 / 50,000 = 24%.
- Out-of-sample result for the same setting: Rs -3,000. That is -3,000 / 50,000 = -6%.

The collapse is the lesson. The figures are made up. Counting the 20 combinations is part of the honest result. A report that leaves out the count hides the size of the search.

## Try it

### Guided exercise

**Task.** A grid has 6 lookbacks, 5 ATR multiples and 3 filters. Count the combinations. Then state how many lucky results to expect if each test has a 5% chance of looking good by luck.

Hints:

1. Multiply the three counts.
2. Multiply the number of combinations by 0.05.
3. Round the answer to the nearest whole number, or give a range.

**Answer:**

- Combinations: 6 x 5 x 3 = **90**.
- Lucky results: 90 x 0.05 = **4.5**. So about 4 or 5 lucky results.

### Independent exercise

**Task.** Write a one-row-per-variant trial log template. Include the fields you need to count every variant honestly.

<details><summary>Check your answer</summary>

A sample template. Each row is one variant, including the ones you dropped.

| Field | What to write |
|---|---|
| Trial number | A number that goes up by one each time. Never skip a number. |
| Date | The date you ran the variant. |
| Rule name and version | The name of the rule and a version number. |
| Parameters | Each setting used, such as lookback, ATR multiple and filter. |
| Data used | The name of the data set and whether it is in sample or out of sample. |
| Result after costs | The net result, in rupees and in percent. |
| Metrics | The other numbers you read, such as expectancy and the largest fall from a peak. |
| Kept, dropped or changed | One word. |
| Reason | One sentence on why the variant was kept, dropped or changed. |

Keep every row, even when a variant was dropped. The number of rows is the number of tries.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the count of trials, the chance of lucky results, the best in-sample setting and what a report should show.

## Paper task

Mode: **learning note**. Start a trial log in your journal learning note. Record every variant you test in Lab 4 from now on, including the ones you discard. If the lab is not ready, keep the log on paper or in a spreadsheet.

1. Create the log with the fields from the independent exercise.
2. Add one row for each variant you test, in order.
3. Add a row for each discarded variant too.
4. At the end of the week, count the rows and write the total in the note.

## Limits and common mistakes

- A trial log is only as honest as the rows you write. A variant you did not record is still a trial.
- Out-of-sample data can be spent. Once you use it to choose a setting, it becomes part of the in-sample data (*Out-of-sample and walk-forward testing*).
- More testing is not always better. Each extra variant adds another chance of a lucky best result.
- The 5% chance in this chapter is a simple example. It is not a measured figure for any real strategy.

## Remember

- Every combination in a grid is a test, even if it is never reported.
- The best in-sample result is biased upward.
- Informal tweaks count as trials.
- Report the number of variants tried, with the result.
- A chosen setting must be checked on data it was not chosen with.

## Sources and verification

- Bailey, Borwein, Lopez de Prado and Zhu, on backtest overfitting. [VERIFY: citation, year and title]
- Harvey and Liu, on multiple testing in finance. [VERIFY: citation, year and title]

<!-- facts-needed: citation for Bailey, Borwein, Lopez de Prado and Zhu on backtest overfitting; citation for Harvey and Liu on multiple testing in finance. -->

<!-- standing-disclaimer -->
