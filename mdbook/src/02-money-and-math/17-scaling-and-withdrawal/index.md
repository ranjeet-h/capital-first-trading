<!-- meta
id: T2.17
title: Scaling and withdrawal policy
page_type: Concept
prerequisites: [T2.9, T2.15, T2.16]
labs: [Lab 3]
estimated_minutes: 20
-->

# Scaling and withdrawal policy

## Hook

A hypothetical account starts at Rs 50,000 and climbs to Rs 57,000. The trader feels like taking money out now. Later the account falls to Rs 53,000, and the trader considers topping it up from household savings to get back faster. Both ideas feel reasonable on the day. The second breaks the rule that household money never becomes trading capital, and this chapter shows why the first needs a written rule before any withdrawal is made.

## The idea

Two rules come first. Reinvest profits before taking any out. Never withdraw while the account is in a drawdown.

**Terms, defined once**

- **High-water mark (HWM):** the highest equity the account has reached so far. It only moves up.
- **Drawdown from the HWM:** how far equity sits below the HWM, as a share of the HWM.

In symbols: drawdown = (H - E) / H, where H is the high-water mark and E the current equity.

- **Withdrawal threshold:** a rule with numbers you set in advance. The example in this chapter is: withdraw only when equity is at a new HWM and above starting capital plus Rs 10,000. The numbers are illustrative. You choose the real ones. A threshold may also require a stated period of positive results (for example, a set number of months).

**Why no withdrawal in a drawdown.** A withdrawal lowers the base the account must recover from. The gap to the HWM does not shrink. It grows in percentage terms. From Rs 53,000, with an HWM of Rs 57,000, the account needs a gain of 4,000 / 53,000 = 7.5% to return to the peak. If Rs 5,000 is withdrawn first, the account is at Rs 48,000, and the gain needed becomes 9,000 / 48,000 = 18.8%.

**Scale-up.** Trading capital may increase only after gates G6 and G7 are passed, and only with a recorded result behind it. Never increase risk after losses. Scale-up that comes from a losing run is a rule break, not a plan.

**Scale-down.** The cut and stop rules from T2.15 reduce the trading capital or pause trading. Scale-down follows the rules, not feelings about the last week.

**Records.** Every capital change is logged in the journal, in the capital_at_plan field (Lab 3). A change that is not recorded cannot be reviewed.

**Method.** Withdrawals also change the base used to measure drawdown. The method must be stated before the first withdrawal. [VERIFY: your choice of withdrawal method]

## See it

<!-- component: capital-allocation-planner | path: 50000,54000,51000,57000,53000 | threshold: 60000 | caption: Equity path with the high-water mark and the Rs 60,000 withdrawal threshold -->

Read the path against two lines: the high-water mark and the Rs 60,000 threshold. A withdrawal is allowed only when equity is at a new high and above the threshold. Change the last point to Rs 61,000 and check whether the rule now allows a withdrawal.

## Worked example

**Hypothetical.** Start at Rs 50,000. The rule in this example: withdraw only when equity is at a new HWM and above Rs 60,000 (starting capital of Rs 50,000 plus Rs 10,000).

| Step | Equity (Rs) | HWM after step (Rs) | Drawdown from HWM | Withdrawal allowed? |
|---|---|---|---|---|
| Start | 50,000 | 50,000 | 0% | No. Not above Rs 60,000 |
| 1 | 54,000 | 54,000 | 0% | No. Below Rs 60,000 |
| 2 | 51,000 | 54,000 | (54,000 - 51,000) / 54,000 = 5.6% | No. In drawdown |
| 3 | 57,000 | 57,000 | 0% | No. Below Rs 60,000 |
| 4 | 53,000 | 57,000 | (57,000 - 53,000) / 57,000 = 7.0% | No. In drawdown, and below Rs 60,000 |

At step 4 the threshold is not met at Rs 53,000, so no withdrawal is allowed. The account is in drawdown.

Recovery gap, in percent:

- From Rs 53,000 with no withdrawal: 4,000 / 53,000 = 7.5% gain needed.
- After withdrawing Rs 5,000: the account is at Rs 48,000, and the gap to Rs 57,000 is 9,000. The gain needed is 9,000 / 48,000 = 18.8%.

## Try it

<!-- component: drawdown-compounding | path: 50000,54000,51000,57000,53000 | caption: Recovery from drawdown with a withdrawal marker; compare the gap to the high-water mark with and without a withdrawal -->

Add a Rs 5,000 withdrawal at Rs 53,000 and compare the gain needed to get back to the high-water mark, with and without the withdrawal.

### Guided exercise

**Task:** For the equity path Rs 50,000, 54,000, 51,000, 57,000, 53,000, compute the high-water mark after each step and the drawdown at the end.

Hints:

1. The HWM is the highest equity so far. Carry the largest value forward.
2. Drawdown = (HWM - current equity) / HWM.
3. Use the HWM after the last step, not the starting value.

**Answer:** HWM after each step: 50,000; 54,000; 54,000; 57,000; 57,000. Final drawdown: (57,000 - 53,000) / 57,000 = 4,000 / 57,000 = 7.0%.

### Independent exercise

**Task:** Write a withdrawal policy with three numbers: a threshold above starting capital, a positive-period length in months, and a maximum withdrawal as a percentage of the gain. Test it on the path Rs 50,000, 62,000, 58,000, 66,000. State the first step on which a withdrawal is allowed under your rule.

<details><summary>Check your answer</summary>

The numbers are yours, so this is one example. Threshold: Rs 10,000 above starting capital (Rs 60,000). Positive-period length: none. Maximum withdrawal: 50% of the gain.

- Step 1 (Rs 50,000): no. Not above Rs 60,000.
- Step 2 (Rs 62,000): yes. It is a new HWM and above Rs 60,000. If your policy has a waiting period, the first allowed step moves later.
- Step 3 (Rs 58,000): no. Drawdown from Rs 62,000 is 4,000 / 62,000 = 6.5%.

So under this example, the first allowed step is Rs 62,000.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions cover the withdrawal rule, withdrawals in a drawdown, the top-up mistake, high-water mark arithmetic and scale-up after losses.

## Paper task

**Mode:** learning note. Log it in your journal (or on paper until the journal app is ready).

1. Write your withdrawal policy on one page: threshold above starting capital, positive-period length and maximum withdrawal percentage.
2. Write the scale-up condition next to it: gates G6 and G7 and a recorded result. Add the scale-down triggers from T2.15.
3. Test the policy on the path Rs 50,000, 62,000, 58,000, 66,000. Note the first step on which a withdrawal is allowed.
4. Add a line stating that every capital change will be logged in the journal, in the capital_at_plan field.
5. Record the page with today's date. Do not record a live account.

## What this does NOT tell you

- The numbers are yours. The threshold in this chapter is an example, not a recommendation.
- A withdrawal rule does not show the account will grow. Every equity path here is hypothetical.
- Tax on withdrawals and gains is not covered here. [VERIFY: tax on withdrawals or gains, see T2.3]
- A policy written after a good month is a judgement made in good conditions. Write the policy before any trade, not after a result.
- Scale-up after losses is not allowed, whatever the recent result.

## Remember

- High-water mark only moves up. Drawdown = (HWM - current equity) / HWM.
- Never withdraw during a drawdown. A withdrawal enlarges the gain needed to recover.
- A withdrawal needs both the threshold and the high-water condition to be met.
- Scale up only after G6 and G7 and a recorded result. Scale down with the T2.15 cut and stop rules.
- Record every capital change in the journal.

## Sources and verification

**Sources (names only):**

- PLAN.md section 2 (withdrawals and reinvestment) and section 6 (gate G7).
- Lab 3 specification (LABS.md): the journal record and capital_at_plan field.
- T2.3, for tax treatment.

**To verify:**

- Your choice of withdrawal method. [VERIFY: your choice of withdrawal method]
- Tax on withdrawals or gains. [VERIFY: tax on withdrawals or gains, see T2.3]

<!-- facts-needed: tax on withdrawals or gains (T2.3); owner's withdrawal method -->
<!-- OPEN: spec open question 8 asks how drawdown is measured after a withdrawal (adjusted base or raw equity). Reviewer decision. The text uses raw equity against the HWM -->

Last content review: not yet done

<!-- standing-disclaimer -->
