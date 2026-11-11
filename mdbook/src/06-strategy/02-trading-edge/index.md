<!-- meta
id: T6.2
title: What a trading edge is
page_type: Concept
prerequisites: [T6.1, T2.7, T2.8]
labs: [Lab 3]
estimated_minutes: 25
-->

# What a trading edge is

## Hook

A friend says, "My method wins eight out of ten trades, so I have an edge." That sounds strong. Here is a hypothetical example. Each win gains Rs 100. Each loss costs Rs 900. Eight wins give Rs 800. Two losses cost Rs 1,800. Overall, the method loses Rs 1,000. Winning often does not prove that a method works. This chapter shows how to measure an edge properly.

## The idea

An edge is a reason to expect a positive result from a method. In this book, an edge means an average result per trade that stays positive after costs. Costs are the charges you pay on each trade, such as brokerage, exchange charges and taxes.

An edge is only a hypothesis until you measure it. A hypothesis is a clear statement that a test could prove wrong. Write it down before you test it. Use this form:

> If condition X occurs, the average trade result will be positive over N trades. The result is measured in R. The test uses data that was not used to design the rule.

R is the planned loss on one trade. If your plan risks Rs 500 on a trade, then 1R is Rs 500. A winner of Rs 1,000 is +2R. A loser of Rs 500 is -1R. Measuring in R lets you compare trades of different sizes.

Every method must answer four decisions:

- **Entry:** when do you open the trade?
- **Exit:** when do you close it? This includes the stop, which is the price where you accept a loss.
- **Sizing:** how many shares do you buy? See *Position sizing step by step*.
- **Filters:** which signals do you skip, even when the entry rule is met?

Expectancy is the average result per trade, measured in R. In words, it is the win rate times the average win, minus the loss rate times the average loss. The loss rate is one minus the win rate. In symbols, E = (W x AW) - ((1 - W) x AL). W is the win rate. AW is the average win in R. AL is the average loss in R. See *Expectancy and profit factor* for more.

Costs reduce expectancy. A cost of Rs 50 on a trade with 1R of Rs 500 is 0.1R. That is small for one trade. Over many trades, costs add up.

Sample size matters. A few trades can look strong by luck. Imagine a coin that lands heads six times in ten tosses. That does not prove the coin is unfair. Ten trades show very little. Many more are needed before a result says much.

Testing a rule on the same data you used to build it is a common error. The result looks better than it really is. Keep some data aside and test on that. The chapter *Overfitting and the number of things you tried* explains why.

This book does not assume you have an edge. Many ideas that look promising show no edge when they are measured.

## See it

<!-- component: strategy-simulator | mode: step | caption: Step through entry, stop and exit rules one bar at a time to see how each rule is read -->

Press Step to move the simulator one bar at a time. At each bar, check three things. Is the entry rule met? Where is the stop? Has the exit rule triggered? The step log shows the answer for each bar in a row. Read the log from top to bottom, the same way the price moved.

## Worked example

**Hypothetical.** Win rate 40 percent. Average win 2R. Average loss 1R. R = Rs 500. Assumed cost Rs 50 per trade.

| Step | Calculation | Result |
|---|---|---|
| 1. Win part | 0.40 x 2R | 0.80R |
| 2. Loss part | 0.60 x 1R | 0.60R |
| 3. Expectancy | 0.80R - 0.60R | 0.20R per trade |
| 4. In rupees | 0.20 x Rs 500 | Rs 100 per trade |
| 5. After costs | Rs 100 - Rs 50 | Rs 50 per trade |

The Rs 50 cost is an assumed figure for this example only. [VERIFY: costs on a trade] Taxes are not included here.

## Try it

### Guided exercise

**Task.** Win rate 30 percent. Average win 3R. Average loss 1R. Compute the expectancy in R.

Hints:

1. Multiply the win rate by the average win.
2. Multiply the loss rate by the average loss. The loss rate is 1 minus 0.30.
3. Subtract the second result from the first.

**Answer:** 0.30 x 3 = 0.90R. The loss rate is 0.70. 0.70 x 1 = 0.70R. 0.90R - 0.70R = **0.20R** per trade.

### Independent exercise

**Task.** Write one hypothesis for a breakout idea. Then write four rule definitions: entry, exit (including the stop), sizing and filters. Do not write any expected profit.

<details><summary>Check your answer</summary>

A sample answer, with example numbers only:

- Hypothesis: If price closes above the highest high of the previous 20 days, the average trade result will be positive over 50 trades. The result is measured in R, on data not used to design the rule.
- Entry: buy at the next day's open after the signal close.
- Exit: close when price falls to the trailing stop.
- Stop: set 2 ATR below the entry price at the time of entry.
- Sizing: risk 1 percent of capital, and apply the cash cap and the concentration cap.
- Filters: skip signals when the daily loss limit has been reached.

Check that the answer has no profit figure. The numbers above are examples, not results.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the expectancy formula, the form of a hypothesis, and why a streak of wins is not proof.

## Paper task

Mode: **paper**. Write it in your journal. If the journal is not ready, use paper.

1. Write one hypothesis in the form shown in *The idea*.
2. Write the four decisions: entry, exit (including the stop), sizing and filters.
3. Write the test that would show you are wrong. Name the data you will use, and say it was not used to design the rule.
4. Do not write any profit target.
5. Mark the page as hypothetical.

## Limits and common mistakes

- A high win rate alone does not show a positive expectancy. The size of the wins and the losses matters too.
- Costs matter at any account size. A Rs 50 cost on a Rs 500 planned loss takes 0.1R from every trade.
- Eight wins in ten trades is a small sample. Luck can produce it.
- A rule built and tested on the same charts looks better than it is.
- Naming the test before you run it helps you. It does not prove that an edge exists.

## Remember

- An edge is a hypothesis until it is measured after costs.
- Write the hypothesis, the rules and the test before you look at results.
- Expectancy = (win rate x average win in R) minus (loss rate x average loss in R).
- A high win rate alone does not show positive expectancy.
- Ten or twenty trades cannot separate skill from luck.

## Sources and verification

- Zerodha Varsity, material on expectancy and trading systems (reference only).
- Published research on backtesting and selection bias.
- [VERIFY: costs on a trade, for the Rs 50 example]

<!-- facts-needed: the actual cost per round trip (the Rs 50 figure is an assumed example only). -->

<!-- OPEN: The peer-reviewed sources for backtesting and selection bias are not yet chosen. Names only are listed. -->

<!-- standing-disclaimer -->
