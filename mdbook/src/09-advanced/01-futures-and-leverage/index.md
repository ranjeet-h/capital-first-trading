<!-- meta
id: T9.1
title: Futures and why they are leveraged
page_type: Concept
prerequisites: [T2.13, T1.3, T2.6]
labs: []
estimated_minutes: 25
-->

# Futures and why they are leveraged

## Hook

Hypothetical. You have Rs 1,00,000 in cash. A friend says a futures contract worth Rs 10,00,000 needs only Rs 1,00,000 as a deposit. You think a small price move must be a small risk. That idea is wrong in an important way. This chapter shows why the deposit is not the full picture.

## The idea

A **futures contract** is an agreement to buy or sell something at a set price on a set future date. It is traded on an exchange. The price is fixed when you enter the agreement. The market price can move a lot before the date arrives.

Think of paying a deposit to reserve a house. You pay a part of the price now. The full price is still the value of the deal. The deposit is only the part you pay first.

These terms matter here:

- **Margin** is the deposit you pay to hold the contract. It is smaller than the value of the contract.
- **Leverage** means you control a large value with a small amount of money. Futures have leverage because the margin is small compared with the contract value.
- **Expiry** is the last date of the contract.
- **Daily settlement** means gains and losses move in and out of your account as prices change. They do not wait for expiry. [VERIFY: NSE clearing corporation daily settlement rules]
- **Expected result** is the average result you would get over many similar bets.

Three facts follow from these terms.

1. **Leverage makes gains and losses bigger by the same factor.** It does not change the expected result of a bet. Leverage makes each swing bigger. The average result per rupee of exposure stays the same.
2. **A small deposit does not mean a small risk.** The risk comes from the full contract value. The deposit only tells you how much you paid first.
3. **Losses can be larger than the margin deposited.** If prices move against you, you may have to pay more money into the account. The margin rules and any extra payment are set by the exchange and your broker. [VERIFY: margin requirements and margin call rules]

Contract size, margin and expiry are set by the exchange. They change over time. Check them at the source before you rely on any number. [VERIFY: contract size, margin and expiry rules]

## See it

The table compares the same price move on cash and on a futures position.

| | Cash holding | Futures position |
|---|---|---|
| Money you put in | Rs 1,00,000 | Rs 1,00,000 as margin |
| Value you control | Rs 1,00,000 | Rs 10,00,000 |
| Rupee move for a 2% price move | Rs 2,000 | Rs 20,000 |
| Move as a share of the money you put in | 2% | 20% |

Look at the last row. The same 2% move is ten times bigger against the money you put in. Try a 5% move with the same numbers. The futures move is Rs 50,000, which is half of the margin. The move grows with the contract value, not with the deposit.

## Worked example

**Hypothetical.** Contract value Rs 10,00,000. Margin Rs 1,00,000. The price moves 2% against you.

| Step | Calculation | Result |
|---|---|---|
| 1. Rupee move on the contract | 2% x Rs 10,00,000 | Rs 20,000 |
| 2. Move as a share of the margin | Rs 20,000 / Rs 1,00,000 | 20% |
| 3. Same 2% move on Rs 1,00,000 of cash | 2% x Rs 1,00,000 | Rs 2,000 |
| 4. Move as a share of the cash | Rs 2,000 / Rs 1,00,000 | 2% |

The same price move costs 20% of the margin in the futures case. It costs 2% of the cash in the cash case. The futures move is ten times larger, because the contract is ten times the margin. All figures are made up. Margin rates and contract sizes in this example are not real facts.

## Try it

### Guided exercise

**Task.** Read the worked example. In one sentence, say why the same percentage move is bigger against the deposit.

Hints:

1. Compare the rupee move with the deposit, not with the contract value.
2. The deposit is the number that matters for your capital.
3. Look at the last row of the table in *See it*.

**Answer:** The margin is one tenth of the contract value. So a 2% move on the contract is 20% of the margin. The same 2% on cash is only 2% of the cash.

### Independent exercise

**Task.** Explain in writing why "leverage raises the expected return" is a misconception. Say what leverage changes instead.

<details><summary>Check your answer</summary>

A good answer has these points.

- Expected return is the average result over many similar bets. Leverage does not change that average per rupee of exposure.
- Leverage multiplies gains and losses by the same factor. A bet with a negative average stays negative in proportion.
- Leverage changes the size of each swing. It also makes a large loss larger against your own money.
- Leverage makes the rupee amount at risk bigger for the same price move. It does not make the trade more likely to succeed.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks leverage, daily settlement, losses against the deposit, and one scenario.

## Paper task

Mode: **learning note**. This chapter has no practice. It asks for reflection only.

1. Write one sentence that says what leverage changes.
2. Write one sentence that says why a small deposit does not mean a small risk.
3. Save both sentences in your journal, or on paper until the journal app is ready.
4. Do not look for a contract to trade. This book does not teach futures practice.

## Limits and common mistakes

- This chapter explains how futures work in theory. It does not teach how to trade them.
- Margin, contract size and expiry rules change over time. Check them at the exchange before you rely on any number. [VERIFY: contract specifications, margin and expiry rules]
- The Rs 10,00,000 contract and the Rs 1,00,000 margin are made up. Real contracts differ.
- A futures position is not a shortcut to a daily target. See *The Rs 2,000-3,000 reality check*.
- Knowing how leverage works does not tell you whether any trade will make money.

## Remember

- A futures contract is an agreement for a set price on a set date.
- Margin is a deposit. It is smaller than the contract value.
- Leverage makes gains and losses bigger. It does not raise the expected result.
- Gains and losses move daily. Losses can be larger than the margin deposited.
- Check the current contract rules at the source.

## Sources and verification

- NSE derivatives contract specifications and margin pages
- SEBI circulars on derivatives margin
- Zerodha Varsity, futures material (reference only)

Items to verify:

- [VERIFY: contract specifications, lot sizes and expiry rules]
- [VERIFY: margin requirements and margin call rules]
- [VERIFY: daily settlement rules]

<!-- facts-needed: contract specifications, lot sizes and expiry rules; margin requirements and margin call rules; daily settlement rules. -->

<!-- standing-disclaimer -->
