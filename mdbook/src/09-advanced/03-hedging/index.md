<!-- meta
id: T9.3
title: Hedging
page_type: Concept
prerequisites: [T9.1, T9.2, T2.14]
labs: []
estimated_minutes: 25
-->

# Hedging

## Hook

A farmer grows rice. He worries that prices will fall before harvest. He pays for a cover that pays him if prices drop. The cover costs money, and it does not stop every loss. Hedging in trading works in the same way.

## The idea

A **hedge** is a second position that offsets part of the risk of the first. The first position is the one you already hold or plan to hold. The hedge is like the cover. It pays out in one kind of bad case, and it has a price.

Five points matter.

- **A hedge has a cost.** The cost can be a premium, a spread, or a gain you give up if prices rise. The cost reduces returns in every period, including good ones.
- **Basis risk.** The hedge may not move exactly with the position it protects. It is like a cover that pays for rain measured at one place, when your field is in another place.
- **A hedge changes the shape of the loss.** It does not remove the loss. A hedged position can still lose money.
- **Small accounts feel the cost more.** The cost is a bigger share of a small amount of capital. For example, Rs 1,200 on a Rs 50,000 holding is 2.4%.
- **A hedge does not replace position sizing.** A hedge is not a reason to take a bigger position. Keep the limits from *Position sizing step by step*.

## See it

The table shows the same holding with and without the hypothetical put. The put has strike Rs 470 and costs Rs 1,200. The results exclude other costs.

| Price at expiry | Unhedged result | Hedged result |
|---|---|---|
| Rs 500 (flat) | Rs 0 | minus Rs 1,200 |
| Rs 470 | minus Rs 3,000 | minus Rs 4,200 |
| Rs 455 | minus Rs 4,500 | minus Rs 4,200 |
| Rs 400 | minus Rs 10,000 | minus Rs 4,200 |

Read down the hedged column. The loss stops getting worse below Rs 470. The hedge also costs Rs 1,200 in the flat case, where nothing else goes wrong.

## Worked example

**Hypothetical.** You hold 100 shares at Rs 500. The holding is worth Rs 50,000. You also buy a hypothetical put with strike Rs 470. The premium is Rs 12 per share. That is Rs 1,200 in total. Rs 1,200 is 2.4% of Rs 50,000.

The price falls to Rs 400 at expiry.

| Item | Calculation | Result |
|---|---|---|
| Loss on shares, unhedged | 100 x (500 - 400) | Rs 10,000 |
| Put payout | 100 x (470 - 400) | Rs 7,000 |
| Loss on shares after the put | 10,000 - 7,000 | Rs 3,000 |
| Hedged total loss | 3,000 + 1,200 premium | **Rs 4,200** |

The unhedged loss is 20% of the holding. The hedged loss is 8.4% of the holding. Check: Rs 4,200 / Rs 50,000 = 8.4%. The hedge cut the loss from Rs 10,000 to Rs 4,200. It also cost Rs 1,200 in every case.

## Try it

### Guided exercise

**Task.** The price falls to Rs 455 with the same hypothetical put. Compute the hedged loss.

Hints:

1. Below Rs 470, the put offsets the fall, so the hedged loss is capped.
2. The loss from Rs 500 to Rs 470 is 100 x 30 = Rs 3,000.
3. Add the Rs 1,200 premium.

**Answer:** Hedged loss = Rs 3,000 + Rs 1,200 = **Rs 4,200**. Check: the unhedged loss is 100 x 45 = Rs 4,500. The put pays 100 x (470 - 455) = Rs 1,500. Rs 4,500 - Rs 1,500 = Rs 3,000, plus the Rs 1,200 premium, is Rs 4,200.

### Independent exercise

**Task.** Write a short paragraph explaining why hedging does not replace the risk-per-trade rule.

<details><summary>Check your answer</summary>

A good answer has these points.

- A hedge covers part of a price move after you enter. It does not set how much you can lose before you enter.
- A hedge has its own cost. It can also have basis risk, so it may not cover the loss fully.
- The risk-per-trade rule sets the size of the position. A hedge does not change that size.
- A hedge can tempt a trader to take a bigger position. That is the mistake the rule prevents.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks hedge cost, basis risk, hedging and sizing, one scenario and one spot-the-mistake.

## Paper task

Mode: **learning note**. This chapter has no practice. It asks for reflection only.

1. Write three sentences. Say what a hedge is, what it costs, and what basis risk means.
2. Using the worked example, write the unhedged loss and the hedged loss at Rs 400, in rupees.
3. Write one sentence on why hedging does not allow a bigger position.
4. Save these in your journal, or on paper until the journal app is ready.

## Limits and common mistakes

- The example assumes the put matches the holding exactly. Real hedges may not match. That gap is basis risk.
- Option premiums, charges and rules change over time. [VERIFY: option contract, premium and charge facts, NSE and broker pages]
- A hedge can lose money in a flat market, because its cost is paid either way.
- Hedging with derivatives is theory in this book. There is no practice path.
- A hedge does not replace the risk-per-trade rule. See *Risk per trade and stop-loss distance*.

## Remember

- A hedge offsets part of a risk. It does not remove all risk.
- Every hedge has a cost, and that cost is paid in good periods too.
- Basis risk means the hedge may not move exactly with the position.
- Hedging does not allow a bigger position.
- Hedging costs weigh more on a small account, as a share of its capital.

## Sources and verification

- NSE derivatives pages
- A standard risk management text [VERIFY: name the text before use]

Items to verify:

- [VERIFY: contract and charge facts, as in the chapter on futures and the chapter on options]

<!-- facts-needed: contract and charge facts for options used as hedges; name of the risk management text. -->

<!-- standing-disclaimer -->
