<!-- meta
id: T9.2
title: Options basics and Greeks
page_type: Concept
prerequisites: [T9.1]
labs: []
estimated_minutes: 25
-->

# Options basics and Greeks

## Hook

Hypothetical. A friend says options are cheap, so buying them is low risk. An option on a share costs Rs 20 per share. The friend thinks a small price means a small risk. This chapter shows what the buyer and the seller can gain and lose. A low price does not make a trade safe.

## The idea

An **option** is a contract that gives a right, not a duty.

- A **call** gives the right to buy at a set price, called the **strike**.
- A **put** gives the right to sell at the strike.
- The **premium** is the price of the option. The buyer pays it. The seller receives it.
- The **expiry** is the last date the right can be used.

Think of paying a small token to hold a shop unit at a fixed price for one month. If prices rise, the right to buy at the fixed price becomes worth more. If prices do not rise, you lose the token. The token is the premium.

The premium has two parts.

- **Intrinsic value** is how far the option is in the money. For a call, it is the share price minus the strike, if that is above zero.
- **Time value** is the rest of the premium. It pays for the chance that the price moves further before expiry.

The Greeks are measures of how a premium responds to change. This chapter explains them in words only.

- **Delta** measures how much the premium moves when the share price moves a little. Think of it as how closely the premium follows the share.
- **Theta** measures how much the premium loses as time passes, other things equal. It works like a monthly bus pass that loses value as the month runs out. Time decay works against the buyer.
- **Vega** measures how much the premium changes when expected price swings change. It works like insurance. The price of cover rises when a storm is forecast.

The risk of each side is different.

- The buyer's most loss is the premium. The option can expire with no value.
- The seller's most gain is the premium. The seller's loss can grow far larger than the premium, because the seller must meet the buyer's right.

*Why scalping, option buying and martingale are dangerous* explains why these approaches are risky.

## See it

The table is an original drawing for this book. It shows a call with strike Rs 500 and premium Rs 20 per share. It is illustrative only.

| Price at expiry | Intrinsic value | Buyer profit per share | Seller profit per share |
|---|---|---|---|
| Rs 490 | Rs 0 | minus Rs 20 | plus Rs 20 |
| Rs 500 | Rs 0 | minus Rs 20 | plus Rs 20 |
| Rs 515 | Rs 15 | minus Rs 5 | plus Rs 5 |
| Rs 520 | Rs 20 | Rs 0 | Rs 0 |
| Rs 530 | Rs 30 | plus Rs 10 | minus Rs 10 |
| Rs 540 | Rs 40 | plus Rs 20 | minus Rs 20 |

Read the buyer column from top to bottom. The buyer loses at most Rs 20 per share. The seller column is the mirror image.

<!-- component: option-payoff | type: call | side: buy | strike: 500 | premium: 20 | price: 530 | caption: A call with strike Rs 500 and premium Rs 20 per share. Switch to seller, or to a put, and read the line. Theory only. -->

<!-- component: option-time-value | strike: 500 | premium: 20 | price: 500 | caption: Time value fades as expiry gets closer. Delta and theta shown with simple sliders. Theory only. -->

## Worked example

**Hypothetical. Call option, strike Rs 500, premium Rs 20 per share.** Results are at expiry and before costs.

| Step | Calculation | Result |
|---|---|---|
| 1. Price at expiry Rs 530: intrinsic value | 530 - 500 | Rs 30 |
| 2. Buyer profit per share | 30 - 20 | Rs 10 |
| 3. Price at expiry Rs 490: intrinsic value | Price is below the strike, so no value | Rs 0 |
| 4. Buyer profit per share | 0 - 20 | minus Rs 20 |

At Rs 530 the buyer gains Rs 10 per share. At Rs 490 the buyer loses the Rs 20 premium. The buyer's loss is capped at the premium. Costs, which this example leaves out, would reduce both results.

## Try it

### Guided exercise

**Task.** Using the call example, compute the buyer's profit per share if the share price is Rs 515 at expiry.

Hints:

1. Intrinsic value is 515 - 500.
2. Subtract the premium from the intrinsic value.
3. Check whether the result is smaller than the premium.

**Answer:** Intrinsic value = 515 - 500 = Rs 15. Profit per share = 15 - 20 = minus Rs 5. The buyer loses Rs 5 per share, which is less than the Rs 20 premium.

### Independent exercise

**Task.** Explain in writing why an option seller's most gain is the premium, but the loss can be far larger than the premium.

<details><summary>Check your answer</summary>

A good answer has these points.

- The seller keeps the premium if the option expires with no value. So the most gain is the premium.
- For a call seller, the loss grows as the price rises above the strike. There is no fixed limit on the price rise.
- Example, hypothetical: strike Rs 500, premium Rs 20, price Rs 600 at expiry. Intrinsic value is Rs 100. Seller's loss = 100 - 20 = Rs 80 per share. Check: Rs 80 is four times the Rs 20 premium.
- The seller's risk sits on the other side of the buyer's right. That is why option selling is not a low-risk shortcut.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the buyer's loss, theta, intrinsic and time value, one scenario and one spot-the-mistake.

## Paper task

Mode: **learning note**. This chapter has no practice. It asks for reflection only.

1. Write one plain sentence each for call, put, strike, premium and expiry.
2. Write one sentence on why the buyer's loss is capped at the premium.
3. Write one sentence on why a cheap option is not the same as a safe one.
4. Save these in your journal, or on paper until the journal app is ready. Do not look for an option to buy or sell.

## Limits and common mistakes

- This chapter is theory. The book does not teach buying or selling options.
- Strike intervals, expiry dates and contract rules change over time. NSE's contract page (updated 11 Aug 2026) says Nifty 50 index options expire on a Tuesday, with weekly and monthly expiries for Nifty 50 and monthly expiries for the other index contracts. The gap between strikes depends on the price of the underlying, so read it on the NSE page. (As of 11 Nov 2026, NSE contract specifications page. Rules change, so check the NSE site.)
- Charges on options change over time. Zerodha's charges page lists a flat Rs 20 brokerage per executed options order, a securities transaction tax (STT) of 0.15 percent on the premium on the sell side, and NSE transaction charges of 0.03553 percent on the premium. GST, SEBI charges and stamp charges are added. These figures are for reading only, not advice. (As of 11 Nov 2026, Zerodha charges page. Rates change, so check zerodha.com/charges.)
- The Rs 20 premium and the Rs 500 strike are made up. Real premiums differ.
- The table leaves out costs. Costs reduce results on both sides.

## Remember

- A call gives the right to buy at the strike. A put gives the right to sell at the strike.
- The premium is the buyer's cost and the seller's income.
- Time value falls as expiry gets closer, other things equal. Theta measures that fall.
- A buyer's loss is capped at the premium.
- A seller's gain is capped at the premium, but the seller's loss can be much larger.

## Sources and verification

- NSE derivatives pages
- Zerodha Varsity, options module (reference only)
- NSE derivatives contract specifications page
- Zerodha charges page (zerodha.com/charges)
- For who may trade F&O and what a broker must check, read the broker's rules and the SEBI and NSE circulars on the derivatives segment. This book states no eligibility rule.

<!-- standing-disclaimer -->
