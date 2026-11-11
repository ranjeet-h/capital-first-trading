<!-- meta
id: T5.7
title: Fibonacci retracement and the evidence debate
page_type: Math/Calculator
prerequisites: [T3.4, T5.1]
labs: [Lab 4]
estimated_minutes: 25
-->

# Fibonacci retracement and the evidence debate

## Hook

A reader draws Fibonacci lines on a chart after a fall. The price pauses near one line. The reader writes, "This level guarantees a bounce." Then the price falls through the line and keeps going. This chapter shows how the levels are calculated, why the swing points you choose change them, and why the evidence that they predict price is still contested.

## The idea

A retracement is the part of a move that the price gives back. After a rise, the price often falls back for a while before it moves again. Fibonacci retracement lines mark how far the fall might go, using fixed ratios.

For an uptrend, the steps are:

1. Pick a **swing low** (the start of the rise) and a **swing high** (the top of the rise).
2. Find the **range** = swing high minus swing low.
3. For each ratio, a **level** = swing high minus (ratio times range).

In words first: level = swing high minus the ratio times the range. In symbols: level = high - (ratio x range).

The ratios used most often are:

- 23.6 percent
- 38.2 percent
- 50 percent
- 61.8 percent
- 78.6 percent

Some points to keep in mind:

- The 50 percent level is not a Fibonacci ratio in the strict sense. It is half the range, and it is a convention to include it. Label it that way.
- The other ratios come loosely from the Fibonacci number sequence. That link is a pattern in numbers. It is not proof that prices follow the pattern.
- Choosing the swing low and the swing high is a judgement. Two careful readers can pick different points and get different levels.
- Many traders may watch the same levels. That is a plausible explanation for any reaction, but it is a hypothesis, not a fact.
- The evidence that these levels predict price is contested. Treat each level as a zone, and check it against support and resistance (*Support and resistance*).

## See it

<!-- OPEN: The spec's visual line asks for sr-drawing-exercise with a Fibonacci tool. That component is not on the allowed component list, so no placeholder is written here. Add it once the component is allowed. -->

Picture each level as a horizontal line drawn across the chart, between the swing high and the swing low. Read the range first. Then find each line. Notice that the 61.8 percent line sits lower than the 50 percent line. The worked example below gives the exact prices for one swing.

## Worked example

**Hypothetical.** Swing low Rs 200. Swing high Rs 260. Range = 260 - 200 = Rs 60.

| Ratio | Ratio x range | Level = 260 - (ratio x 60) |
|---|---|---|
| 23.6% | 0.236 x 60 = 14.16 | 260 - 14.16 = **Rs 245.84** |
| 38.2% | 0.382 x 60 = 22.92 | 260 - 22.92 = **Rs 237.08** |
| 50% (convention) | 0.50 x 60 = 30.00 | 260 - 30.00 = **Rs 230.00** |
| 61.8% | 0.618 x 60 = 37.08 | 260 - 37.08 = **Rs 222.92** |
| 78.6% | 0.786 x 60 = 47.16 | 260 - 47.16 = **Rs 212.84** |

Check: the 78.6 percent level is the lowest. Its distance from the swing high is the largest. It is 47.16, which is less than the full range of 60. So the level stays above the swing low.

## Try it

### Guided exercise

**Task.** Swing low Rs 150. Swing high Rs 180. Find the 23.6 percent level and the 61.8 percent level.

Hints:

1. The range is 180 minus 150.
2. Multiply the range by each ratio.
3. Subtract each result from the swing high.

**Answer:**

- Range: 180 - 150 = Rs 30.
- 23.6 percent: 0.236 x 30 = 7.08. Level = 180 - 7.08 = **Rs 172.92**.
- 61.8 percent: 0.618 x 30 = 18.54. Level = 180 - 18.54 = **Rs 161.46**.

### Independent exercise

**Task.** Swing low Rs 200. Swing high Rs 240. Find the 38.2 percent level. Then say in one sentence how a different swing low would move this level.

<details><summary>Check your answer</summary>

- Range: 240 - 200 = Rs 40.
- 38.2 percent: 0.382 x 40 = 15.28.
- Level: 240 - 15.28 = **Rs 224.72**.
- Sentence: a lower swing low makes the range bigger, so the level moves down. For example, a swing low of Rs 190 gives a range of Rs 50 and a 38.2 percent level of Rs 220.90.

All prices are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the level formula, the difference between a convention and a ratio, and why a level is not a guarantee.

## Paper task

Mode: **paper**. This is a learning log only. Log it in your journal (or on paper until the journal app is ready).

1. Pick five charts with one clear rise and fall each.
2. On each chart, choose the swing low and swing high, and write them down before you look at later prices.
3. Calculate the 38.2 percent and 61.8 percent levels. Write them down.
4. Later, record whether the price reacted near each level, and how.
5. Write one sentence on how much your choice of swing points changed the levels.

## Limits and common mistakes

- The levels depend on the swing points you pick. Different choices give different levels.
- The ratios are conventions with loose links to a number pattern. The evidence that they predict prices is contested.
- A level that price respected once is not evidence that it will work again.
- A Fibonacci level is not an exact stop. A stop needs a stated rule, a tested reason and a planned loss that fits your risk budget (*Risk per trade and stop-loss distance*).

## Remember

- Level = swing high minus (ratio times range). Range = swing high minus swing low.
- The 50 percent level is a convention, not a Fibonacci ratio.
- Swing points are a judgement. Write them down before you look at later prices.
- Treat levels as zones and cross-check them with other evidence.

## Sources and verification

- Zerodha Varsity, Fibonacci module (reference only, original wording).
- Academic reviews of technical trading rules.
- Kite chart help pages, for the Fibonacci tool. [VERIFY: article title]

<!-- facts-needed: whether Kite has a Fibonacci retracement tool and where it sits in the chart tools menu. -->

[VERIFY: Kite Fibonacci tool availability]

<!-- OPEN: Specific academic reviews of technical trading rules are not named in the spec. The sources list keeps the general name only. Add exact references once they are chosen. -->

<!-- standing-disclaimer -->
