<!-- meta
id: T5.8
title: Volume indicators and VWAP
page_type: Math/Calculator
prerequisites: [T3.7, T5.2]
labs: []
estimated_minutes: 25
-->

# Volume indicators and VWAP

## Hook

A stock rises on a day with heavy trading. One reader says, "The big volume proves the rise is real." Another reader says, "Volume tells me nothing." Both claim too much. This chapter shows how two volume tools are built, what each one adds up, and what neither one can show.

## The idea

Volume is the number of shares traded in a period (*Volume and what it adds*). Two indicators use volume in different ways.

**On-balance volume (OBV)** is a running total. Each day, it adds or subtracts that day's volume:

- If today's close is higher than yesterday's close, add today's volume.
- If today's close is lower than yesterday's close, subtract today's volume.
- If the close is the same, leave the total unchanged.

The total starts at zero, or at any starting number you choose. The starting number only moves the whole line up or down. It does not change the moves.

**Volume-weighted average price (VWAP)** is an average price. Each price counts more when more shares trade at it. The steps are:

1. Typical price = (high + low + close) divided by 3.
2. Multiply each typical price by that bar's volume.
3. Add these products for the whole session. Add the volumes too.
4. VWAP = total of products divided by total volume.

VWAP starts again at the start of each session. Some charts show VWAP on daily bars. That is a different measure. Check how Kite defines it. [VERIFY: Kite VWAP definition]

Some points to keep in mind:

- OBV adds whole days of volume. It does not show how much of that volume came from buyers and how much from sellers.
- VWAP is a reference line. Traders watch it, but its predictive value is not established.
- This book uses VWAP only in an optional intraday module, on paper. It is not used for swing decisions.

## See it

<!-- component: indicator-playground | indicator: obv | volumePane: on | closes: 100,103,101 | volumes: 10000,20000,5000 | vwap: off | caption: A volume pane under the price; the OBV line is drawn as a running total and a VWAP overlay can be turned on, which resets at each session start -->

Look at the OBV line as you step through the days. It goes up on a day with a higher close and down on a day with a lower close. Turn VWAP on and watch it reset when a new session starts. Then compare the line with the price. Ask what the line adds, and what it leaves out.

## Worked example

**Hypothetical. OBV.** Closes Rs 100, Rs 103 and Rs 101. Volumes 10,000, 20,000 and 5,000 shares. Start at zero.

| Day | Close | Volume | Compared with the day before | OBV |
|---|---|---|---|---|
| 1 | Rs 100 | 10,000 | no earlier close | 0 |
| 2 | Rs 103 | 20,000 | higher, so add | 0 + 20,000 = **20,000** |
| 3 | Rs 101 | 5,000 | lower, so subtract | 20,000 - 5,000 = **15,000** |

**Hypothetical. VWAP for three bars.** The typical prices are rounded in the table. Keep the full value while you work. Here, the second and third typical prices are each 307 / 3.

| Bar | Typical price | Volume | Typical price x volume (rounded) |
|---|---|---|---|
| 1 | Rs 100.00 | 10,000 | 10,00,000 |
| 2 | Rs 102.33 (307 / 3) | 20,000 | 20,46,667 |
| 3 | Rs 102.33 (307 / 3) | 5,000 | 5,11,667 |
| **Total** | | **35,000** | **35,58,333** (full precision) |

VWAP = 35,58,333 / 35,000 = **Rs 101.67**.

The rounded column adds to a number one unit higher than the full-precision total. That small gap comes from rounding. It does not change the answer.

## Try it

### Guided exercise

**Task.** Two bars in one session. Bar 1: typical price Rs 200, volume 1,000 shares. Bar 2: typical price Rs 206, volume 3,000 shares. Find the VWAP.

Hints:

1. Multiply each typical price by its volume.
2. Add the two products.
3. Divide by the total volume.

**Answer:**

- Bar 1: 200 x 1,000 = 2,00,000.
- Bar 2: 206 x 3,000 = 6,18,000.
- Total of products: 2,00,000 + 6,18,000 = 8,18,000.
- Total volume: 1,000 + 3,000 = 4,000.
- VWAP: 8,18,000 / 4,000 = **Rs 204.50**.

### Independent exercise

**Task.** OBV starts at 50,000. Day 1: close higher than the day before, volume 10,000. Day 2: close lower, volume 4,000. Day 3: close the same as the day before, volume 8,000. Find the OBV after day 3.

<details><summary>Check your answer</summary>

- Start: 50,000.
- Day 1, higher close: 50,000 + 10,000 = 60,000.
- Day 2, lower close: 60,000 - 4,000 = 56,000.
- Day 3, same close: no change, so 56,000.
- OBV after day 3: **56,000**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the OBV rules, the VWAP formula and the reset rule, and why volume does not show direction.

## Paper task

Mode: **paper**. This is a learning log only. Log it in your journal (or on paper until the journal app is ready).

1. For one stock, write the closes and volumes for 10 sessions from a chart you are allowed to view.
2. Calculate the OBV for each day, starting from zero. Write each step.
3. Record the relative volume (*Volume and what it adds*) for the same days.
4. Only if Kite shows VWAP in the demo, note the time it resets. [VERIFY: Kite VWAP reset time]
5. Write one sentence on what the OBV line did not show you.

## Limits and common mistakes

- OBV counts whole days of volume. It does not show whether buyers or sellers drove the volume.
- The starting value of OBV moves the line. It does not change the moves.
- VWAP resets each session. Compare it only inside one session, and only with the same definition.
- VWAP's predictive value is not established. The book uses it only in an optional intraday module, on paper.
- Volume figures can differ between data sources and chart settings. [VERIFY: Kite volume display conventions]

## Remember

- OBV adds volume on up closes, subtracts on down closes, and changes nothing on equal closes.
- VWAP = total of (typical price x volume) divided by total volume, from the start of the session.
- Typical price = (high + low + close) divided by 3.
- Volume shows how much traded. It does not show which way the price will go.

## Sources and verification

- Zerodha Varsity, volume indicators module (reference only, original wording).
- NSE India, market timings page, for session start and end.
- Kite chart help pages, for OBV and VWAP. [VERIFY: article title]

<!-- facts-needed: Kite definitions and availability of OBV and VWAP; Kite VWAP reset rule on intraday charts; NSE session start and end times. -->

[VERIFY: Kite OBV and VWAP definitions and availability]
[VERIFY: NSE session start and end times]

<!-- standing-disclaimer -->
