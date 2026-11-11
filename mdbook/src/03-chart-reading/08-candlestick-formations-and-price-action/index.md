<!-- meta
id: T3.8
title: Candlestick formations and price action
page_type: Concept
prerequisites: [T3.1, T3.3, T3.4]
labs: [Lab 3]
estimated_minutes: 25
-->

# Candlestick formations and price action

## Hook

A friend shows you two candles on a chart. The friend says, "This is a bearish engulfing pattern. The price will fall now." The name sounds certain. This chapter shows what a candlestick pattern really is. It is a shape rule with a name. You will check two shape rules by hand. You will also learn why a name alone cannot show what the price does next.

## The idea

- A **candlestick pattern** is a shape rule. The rule says what the candles must look like. A **name** is only a label for that rule.
- Authors do not always agree on the rule. The same name can mean different shapes in different books. Always write down the exact rule you use.
- **Bullish** and **bearish** describe the candle's direction. A green candle closes above its open. A red candle closes below its open.
- **Context** means where the shape appears. Compare it with *Support and resistance* and *Trend and market structure*. The same shape can mean something different in a rising market than in a falling one.
- **Base rate** is how often a shape is followed by the move its name suggests. This is an open research question. This book states no figure for any formation.
- **Price action** means reading the price and its candles directly. It is still only a description. It becomes a method only after you test its rules.
- Many shapes appear by chance. Naming a shape after the price has already moved is hindsight. Hindsight looks clear only when you look back.
- Confirmation rules change the result. For example, you may wait for the next candle to close before you act. State the rule before you test it.

## See it

<!-- component: pattern-quiz | pairs: 3 | caption: Three pairs of candles; name the formation or choose none, then check the bodies -->

Each pair shows two candles. Choose the formation, or choose none. Then check the bodies. Ask whether the second body covers the first body. Ask also whether the second candle has the colour the rule needs.

## Worked example

**Hypothetical. A bearish engulfing pattern.** The rule used here has three checks. The second candle is red. Its body covers the body of the first candle. Its close is below the first candle's open.

| Candle | Open | Close | Colour | Body |
|---|---|---|---|---|
| Day 1 | Rs 105 | Rs 110 | Green | Rs 105 to Rs 110 |
| Day 2 | Rs 111 | Rs 102 | Red | Rs 102 to Rs 111 |

Check the rule:

- Day 2 body runs from Rs 102 to Rs 111. Day 1 body runs from Rs 105 to Rs 110. Day 2 covers Day 1 on both ends. The rule is met.
- Day 2 closes at Rs 102. Day 1 opened at Rs 105. Rs 102 is below Rs 105. The rule is met.

**Hypothetical. A hammer-shaped candle.** One version of the rule says the lower shadow is at least twice the body, and the upper shadow is small. The shadow is the thin line above or below the body. Other authors use other rules.

| Step | Calculation | Result |
|---|---|---|
| 1. Body | open Rs 200, close Rs 199. 200 minus 199 | Rs 1 |
| 2. Lower shadow | close Rs 199 minus low Rs 192 | Rs 7 |
| 3. Lower shadow against body | 7 divided by 1 | 7 times the body |
| 4. Upper shadow | high Rs 201 minus open Rs 200 | Rs 1 |

Check step 3: 1 multiplied by 7 is 7. The lower shadow is at least twice the body, so this rule is met.

**Lesson.** Both shapes meet their rules. Neither shape shows what the price did next. These checks test the shape only.

## Try it

### Guided exercise

**Task.** Three pairs of candles are below. The values are hypothetical. For each pair, say whether the bearish or the bullish engulfing rule is met. Show the body comparison.

- Pair A. Day 1: open Rs 100, close Rs 104, green. Day 2: open Rs 105, close Rs 98, red.
- Pair B. Day 1: open Rs 100, close Rs 104, green. Day 2: open Rs 103, close Rs 107, green.
- Pair C. Day 1: open Rs 110, close Rs 104, red. Day 2: open Rs 103, close Rs 112, green.

Hints:

1. Compare the bodies, not the wicks.
2. Check whether the second body covers the first body.
3. Check the colour of the second candle. Red is needed for bearish. Green is needed for bullish.

**Answer:**

- Pair A: the bearish engulfing rule is met. Day 1 body is Rs 100 to Rs 104. Day 2 body is Rs 98 to Rs 105. Day 2 covers Day 1, and Day 2 is red. Day 2 closes at Rs 98, which is below Rs 100.
- Pair B: the rule is not met. Day 2 is green, so it cannot be bearish. Its body starts at Rs 103, which is above Rs 100. It does not cover the start of Day 1's body. It closes at Rs 107, above Rs 100, so it is not bearish.
- Pair C: the bullish engulfing rule is met. Day 1 body is Rs 104 to Rs 110. Day 2 body is Rs 103 to Rs 112. Day 2 covers Day 1, and Day 2 is green. Day 2 closes at Rs 112, which is above Rs 110.

### Independent exercise

**Task.** Write your own definition of one formation in four lines or fewer. State the context you require. List three things you would need before you could test the rule.

<details><summary>Check your answer</summary>

A sample answer:

- Definition: a bearish engulfing pattern is a red candle whose body covers the body of the green candle before it.
- Context: the shape appears after a rise, near a level you have already marked.
- Needed before testing: an exact definition of the context. A fixed test period. A fixed rule for when to record the outcome.

Any answer is acceptable when the rule is exact, the context is stated and the test steps are written before any outcome is seen.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks engulfing and hammer rules, the limits of a pattern name, and what a test needs.

## Paper task

Mode: paper. Write it in your journal. If the journal is not ready, use paper.

1. Choose one formation. Write its definition in four lines or fewer.
2. Write the context you require, such as the trend before the shape.
3. Find 10 occurrences on charts you have seen. Note each date, the candles and the context.
4. Record the outcome only after the number of days you set before you began. Do not change that number later.
5. Record the results as learning notes in Lab 3. Do not treat any result as a trading signal.

## Limits and common mistakes

- A named pattern is not a promise. The book makes no claim that any formation predicts profit.
- A pattern named after the move is hindsight. The shape can look clear now. It was not clear when the price was moving.
- A rule with no stated context and no fixed test period cannot be checked.
- Ten or twenty examples are too few to show that a formation works or fails.
- Changing the rule after you see the result makes the test unfair to the rule.

## Remember

- A candlestick pattern is a shape rule. Write the exact rule before you use it.
- Context and confirmation rules change what a shape means.
- A name does not show what the price does next.
- Test a rule before you trust it (*Backtesting basics and the realism contract*).

## Sources and verification

Sources:

- Zerodha Varsity, candlestick patterns module (reference only, original wording here)
- Peer-reviewed studies of candlestick patterns. No results from these studies are stated in this chapter.

Facts to check:

- Any base rate for a named formation, if a study is cited later. No base rate is stated here. [VERIFY: cited study and its exact result]

<!-- facts-needed: base rates for named formations, only if a cited study is added; no figure is stated in this chapter -->
<!-- OPEN: the spec leaves the choice of peer-reviewed studies open; no specific studies are named yet. -->

<!-- standing-disclaimer -->
