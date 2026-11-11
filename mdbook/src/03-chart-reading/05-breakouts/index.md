<!-- meta
id: T3.5
title: Breakouts
page_type: Concept
prerequisites: [T3.3, T3.4]
labs: [Lab 1, Lab 4]
estimated_minutes: 25
-->

# Breakouts

## Hook

**Hypothetical.** A stock stays between Rs 300 and Rs 310 for 10 days. One morning it trades at Rs 311 for a minute. It then closes at Rs 308, inside the range. A trader says, "It broke out, so I bought." The price did trade above the top. The close did not. This chapter explains why the close matters and how to test a breakout rule.

## The idea

A **range** has a top and a bottom. A **breakout** is a move above the top of the range. A **breakdown** is a move below the bottom of the range.

Define the breakout before you look at the chart:

- **Close-based:** the candle closes beyond the level.
- **Touch-based:** price trades beyond the level, even for a moment.

Close-based is easier to test. A close is one fixed number for the period. A touch can happen and reverse within seconds. A plan that uses touches needs more rules to say what counts.

A **false breakout** is a move beyond the level that fails to hold. Price closes back inside the range. The move was real, but it did not last.

Volume is supporting context. A high-volume breakout is more active, but it is not proof. Volume is covered in *Volume and what it adds*.

A breakout rule has an edge only if the rule, the costs and the number of trades all work together. That idea is covered in *What a trading edge is*. The book gives no failure rate for breakouts. Test your own rules in Lab 4 before you trust them.

Breakouts attract fear of missing out. That is the urge to buy because others seem to be buying. Define the rule before the candle closes. Do not chase a move that has already gone far beyond the level.

## See it

Use the candle builder with the range drawn as a band. The band shows the top and the bottom of the range. Watch whether the close lands above the top edge or inside the band.

Then use predict-next. Guess the candle after a close beyond the range. The point is to see how little one close tells you about the next candle.

<!-- component: candle-builder | range: 300-310 | caption: Candles with the range drawn as a band; the top edge is the breakout level; watch whether the close lands above or inside the band -->

<!-- component: predict-next | context: close beyond range top | caption: Guess the candle after a close beyond the range; one close gives little information about the next candle -->

## Worked example

**Hypothetical.** A 10-day range runs from Rs 300 to Rs 310.

| Day | Close | Volume | Result |
|---|---|---|---|
| 11 | Rs 312 | 1,80,000 shares (20-day average 1,00,000) | Close above Rs 310: close-based breakout |
| 12 | Rs 307 | Not used here | Back inside the range: false breakout |

Relative volume on day 11 = 1,80,000 divided by 1,00,000 = 1.8. Check: 1.8 times the average is 1,80,000.

A hypothetical entry is at Rs 312. A hypothetical stop is at Rs 308. Risk per share = 312 minus 308 = Rs 4.

On day 12 the close is Rs 307. That is below the stop of Rs 308. Under the next-open fill rule used in Lab 4, the exit would happen at the open of day 13. The exit price is not known until that open is known. Check: 307 is below 308, so the close is through the stop.

## Try it

### Guided exercise

**Task.** **Hypothetical.** A range runs from Rs 500 to Rs 520. A day closes at Rs 522. The planned stop is Rs 516. The planned size is 40 shares. Work out the distance of the close beyond the range top, the stop distance from the entry, and the planned loss.

Hints:

1. The breakout distance is measured from the range top. Compute 522 minus 520.
2. The stop distance is the entry minus the stop. Compute 522 minus 516.
3. The planned loss is the shares times the stop distance. Compute 40 times that distance.

**Answer:** The close is Rs 2 above the range top (522 minus 520). The stop is Rs 6 below the entry (522 minus 516). The planned loss is 40 x 6 = Rs 240. Check: 40 x (522 minus 516) = 40 x 6 = 240.

### Independent exercise

**Task.** **Hypothetical.** A range runs from Rs 150 to Rs 158. A day closes at Rs 160 on 1.5 times the average volume. Entry Rs 160. Stop Rs 154. Size 30 shares. Compute the planned loss. State whether the close-based breakout rule was met.

<details><summary>Check your answer</summary>

- Risk per share: 160 minus 154 = Rs 6.
- Planned loss: 30 x 6 = Rs 180. Check: 30 x 6 = 180.
- Close-based rule: the close of Rs 160 is above the range top of Rs 158. The rule is met.
- The volume of 1.5 times average is context only. It does not prove the breakout.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks close versus touch, false breakouts, and the planned loss on a breakout trade.

## Paper task

Mode: **paper**. Log it in your journal, or on paper if the journal is not ready.

1. Choose 5 breakouts from chart history on any chart you are allowed to view.
2. For each one, write the breakout definition you used before you look at what happened next.
3. Record the close-based result after 5 days.
4. Mark whether each breakout was a false breakout.
5. Label the whole log "hindsight study, not evidence".

## Limits and common mistakes

- A touch is not a breakout under a close-based rule. A trade above the top that closes inside the range has not broken out.
- Volume is context, not proof. A high-volume false breakout is still a false breakout.
- Chasing a move that has already moved far past the level adds risk. Your planned loss may grow far beyond the plan.
- Circuit limits can stop trading beyond a price band, and that can affect a breakout (*Circuit limits and halts*). NSE sets daily bands of 2%, 5%, 10% or 20% for most stocks. Stocks with futures and options use a flexible 10% range instead. (As of 11 Nov 2026, NSE FAQs and SEBI's master circular. Check the NSE site for changes.)
- Work out the planned loss before you enter. Share count multiplies the risk per share (*Position sizing step by step*).

## Remember

- A breakout is a move beyond the range top. A breakdown is a move beyond the range bottom.
- Define close-based or touch-based before the candle closes.
- A false breakout closes back inside the range.
- Volume supports the context. It does not prove the breakout.
- Breakout rules must be tested, not assumed.

## Sources and verification

- Zerodha Varsity, breakout material (reference only)
- NSE India, circuit-limit pages
- SEBI circulars on price bands

Facts checked on 11 Nov 2026:

- Band percentages come from NSE's Basic FAQs on the Secondary Market. The flexible range for stocks with futures and options comes from SEBI's master circular on trading. The full detail is in *Circuit limits and halts*.

<!-- standing-disclaimer -->
