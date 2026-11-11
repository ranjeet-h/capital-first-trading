<!-- meta
id: T6.3
title: Trend following in depth
page_type: Strategy
prerequisites: [T6.2, T3.4, T5.3]
labs: [Lab 4]
estimated_minutes: 30
-->

# Trend following in depth

## Hook

A trader buys a share that has been rising. Her plan allows a planned loss of Rs 500 per trade. After eight losing trades in a row, she drops the plan and trades by feel. Hypothetical example: the next signal the plan would have taken was a large winner. She missed it, because she had left the rules. This chapter explains why a losing run is part of the design, not a sign to abandon it.

## The idea

Trend following means you enter when price moves up strongly and stays strong. You hold while the move continues. You exit when the move ends. See *Trend and market structure*.

The method accepts many small losses. It aims for fewer, larger wins. In this style there is no fixed profit cap. You do not set a profit target in advance. Every trade still has a loss cap.

**Fixed loss per trade.** Each trade risks the same rupee amount. This is called 1R. For example, 1R may be Rs 500. A losing trade then costs about 1R. Each loss has the same size, so you can count the results in R.

**Trailing stop.** A trailing stop moves up as price rises. It never moves down. It is an exit rule, not a profit target. When price falls back to the stop, the trade closes. The distance of the stop can be set using ATR. See *ATR and volatility, used for stops*.

**Low win rate.** A method can win only 35 percent of its trades and still have a positive expectancy. This happens when the average win is much larger than the average loss. Expectancy is explained in *What a trading edge is*. A low win rate is a hypothesis to test. It is not a fact.

**Dry spells.** A dry spell is a long run with no winners, or many small losses in a row. Dry spells are normal in this design. They are also the most dangerous time to change the rules or add money. Write the rule for a dry spell before one starts. See *Living through a losing streak*.

This method does not add money after losses.

**Sample size.** A few dozen trades cannot show whether the method works. Results from a small sample can come from luck.

## See it

<!-- component: strategy-simulator | mode: trailing-stop | caption: Trailing-stop mode shows the stop moving up as price rises and never moving down -->

<!-- component: streak-sim | winRate: 35 | R: 500 | caption: Shows losing runs at a 35 percent win rate, with each loss at 1R of Rs 500 -->

Use the trailing-stop view first. Watch the stop rise with each new high close, and watch it stay where it is when price falls. Then use the streak view. Look at how often long losing runs appear, even at a fixed win rate.

## Worked example

**Hypothetical.** Twenty trades. 1R = Rs 500. Seven trades are wins, and each win is +3R, which is Rs 1,500. Thirteen trades are losses, and each loss is -1R, which is Rs 500.

| Item | Calculation | Result |
|---|---|---|
| Total from wins | 7 x 3R = 21R, then 21 x Rs 500 | Rs 10,500 |
| Total from losses | 13 x 1R = 13R, then 13 x Rs 500 | minus Rs 6,500 |
| Net gross | 21R - 13R = 8R, then 8 x Rs 500 | Rs 4,000 |
| Win rate | 7 / 20 | 35 percent |
| Expectancy in R | 0.35 x 3 - 0.65 x 1 = 1.05 - 0.65 | 0.40R per trade |
| Expectancy in rupees | 0.40 x Rs 500 | Rs 200 per trade |
| A run of 10 losses | 10 x Rs 500 | minus Rs 5,000 |

These figures are before costs and taxes. Real charges and the rules on tax are in *Costs on a trade* and *Taxes on trading profits*. (As of 11 Nov 2026, Zerodha lists zero brokerage on delivery trades. Rules change, so check the Zerodha charges page.)

The losing run is the hard part. The run of 10 losses costs Rs 5,000 with no winner in between. The plan must allow for it before it starts.

## Try it

### Guided exercise

**Task.** Five trades are wins at +2R. Ten trades are losses at -1R. R = Rs 500. Compute the net result in R and in rupees.

Hints:

1. The five wins total 10R.
2. The ten losses total 10R.
3. Subtract the losses from the wins.

**Answer:** Wins: 5 x 2R = 10R. Losses: 10 x 1R = 10R. Net: 10R - 10R = **0R**, which is **Rs 0** gross.

### Independent exercise

**Task.** Forty trades. Win rate 30 percent. Average win 3R. Average loss 1R. R = Rs 500. Compute the expectancy in R, the expectancy in rupees per trade, and the total gross result.

<details><summary>Check your answer</summary>

- Expectancy: 0.30 x 3 - 0.70 x 1 = 0.90 - 0.70 = **0.20R**.
- In rupees: 0.20 x Rs 500 = **Rs 100 per trade**.
- Total gross: 40 x Rs 100 = **Rs 4,000**.
- Check by count: 12 wins x 3R = 36R. 28 losses x 1R = 28R. 36R - 28R = 8R. 8 x Rs 500 = Rs 4,000.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the low win rate, the trailing stop and the rules for losing runs.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Write the rules for entry, initial stop, trailing stop and the dry-spell rule before you look at any chart.
2. From past chart history, pick ten trades that the rules would have taken. Use hypothetical trades only.
3. Record the result of each trade in R.
4. Add up the net R. Work out the expectancy in R.
5. Label the whole set hypothetical.

## Limits and common mistakes

- A trailing stop does not stop every loss. A price gap can jump past the stop. See *Gaps and what they mean for stops*.
- No profit cap does not mean no loss cap. Each trade still has a planned loss.
- A low win rate is hard to live with. Plan for dry spells before they start.
- Ten trades show almost nothing. A few dozen trades cannot show whether the method works either.
- The figures here are before costs and taxes. See *Costs on a trade* and *Taxes on trading profits*.

## Remember

- Each trade risks the same planned amount, called 1R.
- A trailing stop moves only up. It is an exit rule, not a profit target.
- A 35 percent win rate can still give a positive expectancy, if the average win is large enough. This is a hypothesis to test.
- Dry spells are normal in this design. Keep the rules unchanged during them.

## Sources and verification

- Zerodha Varsity, material on trend following (reference only).
- *Costs on a trade* and *Taxes on trading profits*, each with its own dated sources (read on 11 Nov 2026).

<!-- standing-disclaimer -->
