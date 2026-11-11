<!-- meta
id: T5.4
title: RSI (Relative Strength Index)
page_type: Math/Calculator
prerequisites: [T5.2, T5.3]
labs: [Lab 4]
estimated_minutes: 25
-->

# RSI (Relative Strength Index)

## Hook

Sana (hypothetical) opens a chart and sees a line marked RSI at 74. A friend tells her the stock is overbought, so she should sell now. Sana does not know what the number means or how it was made. The stock has risen for weeks. This chapter shows how the RSI is calculated, why the 70 level is only a convention, and why a high reading can last a long time in a strong trend.

## The idea

**RSI** is a momentum indicator. It compares the size of recent gains with the size of recent losses. It gives a number from 0 to 100.

Build it in four steps.

1. **Change.** Change = today's close minus yesterday's close. A rise is a gain. A fall is a loss, and you write its size as a positive number.
2. **Average gain and average loss.** Add the gains over N periods and divide by N. Do the same for the losses. N = 14 is a common convention. The first averages use simple averages. After that, Wilder smoothing is used, as in *ATR and volatility, used for stops*.
3. **RS.** RS = average gain / average loss. RS is the ratio of the two averages.
4. **RSI.** RSI = 100 - 100 / (1 + RS).

Some words to know:

- **Momentum.** How strongly the price has been moving up or down over a window.
- **Overbought.** A label people use for a high RSI. It is a description of the recent gains, not an order to sell.

Some points to keep in mind.

- **70 and 30 are conventional levels.** Many charts draw lines at 70 and 30. These are reference levels. They are not signals.
- **Divergence is a guess.** A divergence is when price and RSI move in different directions. Traders watch it. Its value has not been established.
- **Strong trends keep RSI high or low.** In a strong uptrend, RSI can stay above 70 for a long time. A high reading does not mean the trend is over.

A rule such as "buy when RSI is below 30" is a hypothesis. It must be tested with costs and with data the rule was not built on. The book tests such rules later, in Lab 4. It does not present such a rule as a fact.

## See it

<!-- component: indicator-playground | indicator: rsi | levels: on | caption: RSI pane with a toggle that shows or hides the reference levels at 70 and 30 -->

Switch the reference levels on and off. Watch how RSI behaves during a strong rise. It can sit above 70 for many days. Then watch a sideways period. The reading moves up and down between the levels.

## Worked example

**Hypothetical.** Four-period RSI. Closes: Rs 100, Rs 102, Rs 103, Rs 100 and Rs 102.

| Period | Close | Change | Gain | Loss |
|---|---|---|---|---|
| 1 | 102 | 102 - 100 = +2 | 2 | 0 |
| 2 | 103 | 103 - 102 = +1 | 1 | 0 |
| 3 | 100 | 100 - 103 = -3 | 0 | 3 |
| 4 | 102 | 102 - 100 = +2 | 2 | 0 |
| **Total** | | | **5** | **3** |

| Step | Calculation | Result |
|---|---|---|
| 1. Average gain | 5 / 4 | 1.25 |
| 2. Average loss | 3 / 4 | 0.75 |
| 3. RS | 1.25 / 0.75 | 1.6667 |
| 4. RSI | 100 - 100 / (1 + 1.6667) = 100 - 100 / 2.6667 = 100 - 37.5 | **62.5** |

For a four-period example, each average is a simple average of the four changes. A real RSI uses N = 14, and it uses Wilder smoothing after the first average.

## Try it

<!-- component: indicator-playground | indicator: rsi | closes: 100,102,103,100,102 | period: 4 | edit: on | caption: The worked example with a four-period RSI. Change the closes and see the steps -->

### Guided exercise

**Task.** Four changes are +1, -1, +2 and -2. Find the RSI for this four-period window.

Hints:

1. Gains are +1 and +2, total 3. Average gain = 3 / 4 = 0.75.
2. Losses are 1 and 2, total 3. Average loss = 3 / 4 = 0.75.
3. RS = 0.75 / 0.75 = 1.

**Answer:** RSI = 100 - 100 / (1 + 1) = 100 - 50 = **50**.

### Independent exercise

**Task.** Four changes are +3, +1, -1 and -2. Find the average gain, the average loss, RS and RSI. Round RS to four decimals and RSI to two decimals.

<details><summary>Check your answer</summary>

- Gains: 3 + 1 = 4. Average gain = 4 / 4 = **1.00**.
- Losses: 1 + 2 = 3. Average loss = 3 / 4 = **0.75**.
- RS = 1.00 / 0.75 = **1.3333**.
- RSI = 100 - 100 / (1 + 1.3333) = 100 - 100 / 2.3333 = 100 - 42.86 = **57.14**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the calculation of RS and RSI. It also checks that 70 and 30 are conventions, and that a high RSI in a strong trend is not an automatic sell.

## Paper task

Mode: **paper**. Calculation practice only. Do not place any order.

1. Choose ten stocks. Write their names in your journal.
2. Once a week, at the same time of day, record the RSI for each stock from the chart. Note the time you used.
3. Work out one RSI by hand each week from the closes you copied, to check the chart value.
4. Do not draw conclusions from the weekly readings. They are for learning the calculation.

Log it in your journal (or on paper until the journal app is ready).

## Limits and common mistakes

- A reading above 70 does not tell you to sell. In a strong uptrend, it can stay above 70 for a long time.
- A reading below 30 does not tell you to buy. In a strong downtrend, it can stay below 30.
- RSI measures momentum over a window. It does not measure whether the price is high or low in general.
- A threshold rule needs a stop and a size rule. It does not replace them.
- The chart may use a different period or a different smoothing method. Check the setting before you compare two charts. Wilder's original RSI uses 14 periods. A chart tool may show another number, so read the setting on your screen.

## Remember

- Change = today's close minus yesterday's close. Gains and losses are kept apart.
- RS = average gain / average loss. RSI = 100 - 100 / (1 + RS).
- The result always falls between 0 and 100.
- 70 and 30 are conventional reference levels, not signals.
- A high RSI in a strong trend can last for a long time.

## Sources and verification

- J. Welles Wilder (1978), where RSI and Wilder smoothing come from.
- Zerodha Varsity, RSI module (reference only).
- Zerodha, Kite charting manual (kite.trade/docs/kite/charting). It gives no default RSI setting, so read it on your own screen.
- StockCharts ChartSchool, RSI page. It gives 14 periods and Wilder smoothing (the earlier average times 13, plus the new value, divided by 14). (As of 11 Nov 2026. This is a common convention, not an exchange rule.)

<!-- standing-disclaimer -->
