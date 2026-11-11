<!-- meta
id: T2.13
title: Leverage and margin, theory only, and how they magnify loss
page_type: Math/Calculator
prerequisites: [T2.9, T2.4]
labs: [Lab 1]
estimated_minutes: 25
-->

# Leverage and margin: theory only, and how they magnify loss

## Hook

Hypothetical: own capital is Rs 50,000. A 10% fall in a Rs 50,000 holding costs Rs 5,000, which is 10% of the own money. A 10% fall in a Rs 1,00,000 position, half of it borrowed, costs Rs 10,000, which is 20% of the own money. The borrowed Rs 50,000 is still owed. The price moved by the same amount in both cases. Only the size of the bet changed.

## The idea

**Leverage** means controlling a position that is larger than your own money, using borrowed funds or margin.

- **Leverage ratio** = position value / own capital. A Rs 1,00,000 position with Rs 50,000 of own money has a ratio of 2 (2x).
- **Gains and losses are both multiplied by the ratio**, measured as a percentage of own capital. A price move of m percent changes own capital by ratio x m percent. A fall is a loss.
- **Wipe-out move** = 1 / ratio, for a long position. It is the price fall that takes the position value down to the borrowed amount, which uses up all the own money. This ignores costs and financing, which make the real position worse.
- **Margin** is funds or securities deposited or borrowed to support a position. Its rules are set by the broker and the regulator, and must be checked for each product [VERIFY: current margin rules].
- **Margin calls and forced sales.** When the position falls far enough, the broker can sell it to cover the shortfall. A forced sale happens at the price available then, which is often the worst one.
- **Financing costs.** Borrowed funds usually carry a cost [VERIFY: financing rates on margin funding].
- **Intraday leverage** has auto square-off rules, meaning positions can be closed by the broker at a set time [VERIFY: intraday auto square-off timing and rules].

This book does not practise leverage. The leverage demo is theory only, and the book has no practice path for it. F&O is covered as theory in T9.1. Lab 1 flags any leverage above 1x as rejected for cash trades.

## See it

<!-- component: leverage-demo | mode: theory | ownCapital: 50000 | leverage: 2 | priceMovePct: -10 | caption: Theory only: gain or loss on own capital, with the wipe-out line; no trading controls -->

Set the ratio to 1x, then to 4x, and keep the same 10% price fall. The loss on own capital grows from 10% to 40%. The wipe-out line marks the price fall that uses up all the own money. The sliders change only the arithmetic. There are no trading controls.

## Worked example

**Hypothetical.** Own capital Rs 50,000. A 10% fall in the price.

| Ratio | Position value | Loss on a 10% fall | Loss as % of own capital | Wipe-out move (1 / ratio) |
|---|---|---|---|---|
| 1x | 50,000 | 5,000 | 10% | 100% |
| 2x | 1,00,000 | 10,000 | 20% | 50% |
| 3x | 1,50,000 | 15,000 | 30% | 33.3% |
| 4x | 2,00,000 | 20,000 | 40% | 25% |

Each row shows the same step: position value x 10% = loss, then loss / Rs 50,000 = percent of own capital.

**2x, step by step (hypothetical; this is an arithmetic example, not an offer or any broker's product).**

1. Own money Rs 50,000. Borrowed Rs 50,000. Position Rs 1,00,000.
2. Price rises 10%: gain = 1,00,000 x 10% = Rs 10,000, which is 10,000 / 50,000 = 20% of own money.
3. Price falls 10%: loss = Rs 10,000, which is 20% of own money.
4. Wipe-out: 1 / 2 = 50%. Price falls 50%: position value = 50,000. That equals the borrowed Rs 50,000, so the own money is gone.

## Try it

Demo with the guided exercise inputs (theory mode):

<!-- component: leverage-demo | mode: theory | ownCapital: 20000 | leverage: 3 | priceMovePct: -15 | caption: Guided exercise inputs; check each answer by hand -->

### Guided exercise

**Task.** Own capital Rs 20,000. Position Rs 60,000 (3x). The price falls 15%. Compute the loss in rupees and as a percentage of own capital.

Hints:

1. Find the loss on the position first: position value x fall.
2. Divide that loss by own capital.
3. Check: a 3x position with a 15% fall should give 3 x 15% = 45% of own capital.

**Answer:** Loss on the position = 60,000 x 15% = Rs 9,000. As a share of own capital, 9,000 / 20,000 = 45%.

### Independent exercise

**Task.** Own capital Rs 25,000 at 4x leverage. Compute the price fall that wipes out the own capital, and the loss at a 10% fall.

<details><summary>Check your answer</summary>

Position = 4 x 25,000 = Rs 1,00,000.

Wipe-out move = 1 / 4 = 25%. Check: a 25% fall on Rs 1,00,000 is Rs 25,000, which equals the own capital.

Loss at a 10% fall = 1,00,000 x 10% = Rs 10,000. As a share of own capital, 10,000 / 25,000 = 40%.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Six questions cover the leverage ratio, the magnified loss, the wipe-out move, margin, and the limits of a stop.

## Paper task

Mode: **learning note**. No orders are placed, and the Kite demo is not used for this task.

1. Draw a table with four rows (1x, 2x, 3x, 4x) and the columns position value, loss on a 10% fall, and loss as a percentage of own capital.
2. Use own capital of Rs 50,000 and a 10% fall in every row.
3. Add a column for the wipe-out move (1 / ratio) and check each row against the worked example.
4. Log it in your journal (or on paper until the journal app is ready).

The Kite demo has no practice path for leverage. Do not look for leverage features in it.

## What this does NOT tell you

- This table leaves out financing costs, charges and margin rules. Those are [VERIFY: margin framework and collateral rules] and must be checked with the broker and the regulator.
- The wipe-out formula is for a long position and ignores costs. A gap can take the price past the wipe-out line (T2.6).
- Leverage does not improve a plan. It multiplies whatever the plan does, in both directions.
- A stop does not protect against margin calls or forced sales. The quiz explains why.
- The 2x example is an arithmetic illustration. It is not an offer and not a product.

## Remember

- Leverage ratio = position value / own capital.
- Gains and losses are both multiplied by the ratio.
- Wipe-out move = 1 / ratio, for a long position, ignoring costs.
- Margin can bring financing costs and forced sales at a bad price.
- The book does not practise leverage, and leverage is not a route to a target.

## Sources and verification

Sources (names only):

- SEBI margin framework circulars.
- Zerodha support pages on margin and MIS.
- NSE margin pages.

Facts to verify before this chapter is final:

- [VERIFY: current margin rules and collateral rules]
- [VERIFY: intraday auto square-off timing and rules]
- [VERIFY: financing rates on margin funding]
- F&O margin basics, for the theory chapter T9.1.

<!-- facts-needed: margin framework and collateral rules (SEBI circulars; Zerodha margin page); intraday auto square-off timing and rules (Zerodha support; NSE circulars); financing or interest rates on margin funding (Zerodha charges page); F&O margin basics for T9.1 -->

<!-- OPEN: spec says Lab 1 "flags leverage above 1x as rejected for cash trades", but LABS.md Lab 1 has no leverage input and lists "no leverage" in its scope. Reviewer to confirm the reject rule before this line is kept. -->

Last content review: not yet done

<!-- standing-disclaimer -->
