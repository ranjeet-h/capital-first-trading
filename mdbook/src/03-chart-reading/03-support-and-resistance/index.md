<!-- meta
id: T3.3
title: Support and resistance
page_type: Concept
prerequisites: [T3.1, T3.2]
labs: [Lab 1, Lab 3]
estimated_minutes: 25
-->

# Support and resistance

## Hook

**Hypothetical.** A stock has reached about Rs 251 three times. Each time, the price turned back down. A trader says, "Rs 251 is a wall. It will hold a fourth time." The trader then places a stop exactly at Rs 251. The next small move down takes the stock to Rs 250.5 and the stop is hit. The trader lost money on a level that was never a wall. The level was only a place where price had turned before.

## The idea

**Support** is an area where price has often stopped falling and turned up. **Resistance** is an area where price has often stopped rising and turned down. Both come from the past. They describe where buyers or sellers showed up before. They do not promise what will happen next.

Use a **zone**, not a single line. A zone is a band of prices where the turns clustered. A single line hides the spread. Two people can draw different zones on the same chart. Your zone is a judgement, and you should write it down.

More touches are not proof. Price reaching a zone many times does not give a chance of a bounce. Touch count is a description of the past.

**Role reversal** means a broken level can change its job. A support that breaks can later act as resistance. A resistance that breaks can later act as support. Price may come back to the old level and turn there. That is also a description, not a promise.

Round numbers, such as Rs 250 or Rs 500, are watched by many traders. Some people treat them as levels. Their value as predictors is not established. Treat them as a hypothesis that you can test.

Stops go **beyond** the zone, not on it. Normal noise often touches the edges of a zone. A stop on the edge can be hit by that noise. A stop beyond the zone is still a planned loss. The planned loss must fit your risk budget (*Position sizing step by step*).

Support is a hypothesis. Never buy more of a falling share because price is "at support." That is called averaging down. It means buying more of a falling share to lower your average cost. It is covered in *Why scalping, option buying and martingale are dangerous*.

## See it

Three swing highs, each one rejected, clustered close together:

| Swing high | Price | What happened next |
|---|---|---|
| High 1 | Rs 251 | Rejected |
| High 2 | Rs 252 | Rejected |
| High 3 | Rs 250.5 | Rejected |

The three highs sit between Rs 250.5 and Rs 252. That band is the zone. Look at the spread of the cluster, not at one price.

<!-- OPEN: The spec gives an interactive zone-drawing exercise (sr-drawing-exercise, marked as new). That name is not in the allowed component list, so no placeholder is added here. Confirm the name, then add the placeholder under this heading. -->

## Worked example

**Hypothetical.** Swing highs at Rs 251, Rs 252 and Rs 250.5 were each rejected. Price later closed above them. Assume the old resistance now acts as support (role reversal). The support zone runs from Rs 249 to Rs 252. Assume an entry at Rs 252, the top of the zone. Assume a stop at Rs 247, which is Rs 2 below the bottom of the zone. Capital is Rs 50,000. Risk per trade is 1 percent.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 50,000 x 1% | Rs 500 |
| 2. Risk per share | 252 minus 247 | Rs 5 |
| 3. Raw shares | floor(500 / 5) | 100 |
| 4. Cash cap | floor(50,000 / 252) = floor(198.4) | 198 |
| 5. Concentration cap (25%) | floor(12,500 / 252) = floor(49.6) | 49 |
| **Shares** | minimum of 100, 198 and 49 | **49** |

Binding constraint: the **concentration cap**. The planned loss is 49 x Rs 5 = Rs 245. That is inside the Rs 500 budget. The concentration cap is the smallest limit, so it sets the size.

The steps are the same as in *Position sizing step by step*.

## Try it

### Guided exercise

**Task.** Use the three swing highs in the *See it* table. Draw one zone that includes all three. Write the top edge and the bottom edge of your zone.

Hints:

1. Find the swing highs first. Here they are already given.
2. Look for a cluster, not a single point.
3. Draw the zone to include all the clustered highs.
4. Any stop you set goes beyond the zone, not on its edge.

**Answer:** A zone that includes all three highs runs from Rs 250.5 (bottom) to Rs 252 (top). The worked example uses a wider zone of Rs 249 to Rs 252. Both are judgements. Your zone is correct if it holds all three highs and you can explain why you drew it there.

### Independent exercise

**Task.** **Hypothetical.** A support zone runs from Rs 380 to Rs 384. Entry Rs 384. Stop Rs 377. Capital Rs 40,000. Risk 1 percent. Concentration cap 25 percent. Work out the risk per share, the raw shares, the cash cap, the concentration cap and the final shares. Name the binding constraint.

<details><summary>Check your answer</summary>

- Risk budget: 40,000 x 1% = Rs 400.
- Risk per share: 384 minus 377 = Rs 7.
- Raw shares: floor(400 / 7) = floor(57.1) = 57.
- Cash cap: floor(40,000 / 384) = floor(104.2) = 104.
- Concentration cap: floor(40,000 x 25% / 384) = floor(10,000 / 384) = floor(26.04) = 26.
- Final shares: minimum of 57, 104 and 26 = **26**.
- Binding constraint: **concentration cap**.
- Planned loss: 26 x 7 = Rs 182.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks zones against lines, role reversal, and why a stop goes beyond a zone.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready). Lab 3 is the place for these notes.

1. Pick 10 charts, from any chart you are allowed to view.
2. On each chart, draw one support zone or one resistance zone.
3. Write down the zone before you look at what happened next.
4. Later, mark each zone as held, broke, or not tested.
5. Record the notes as learning notes. Do not treat them as proof.

## Limits and common mistakes

- Support and resistance describe past turns. A level that held before may not hold again.
- Your zone is a judgement. Another trader may draw a different zone on the same chart.
- Touch count is not a probability. Three touches do not make a fourth touch more likely to hold.
- A stop beyond the zone is still a planned loss. Check it against your risk budget with the steps in *Position sizing step by step*.
- Never average down because price is at support. Averaging down adds to a losing position, and the plan must not allow it.

## Remember

- A zone is a band of prices. A line is one price.
- Support and resistance describe past turns. They do not promise future turns.
- A broken level can change its job. This is role reversal.
- Put stops beyond the zone, never exactly on it.
- A stop is only safe if its planned loss fits the risk budget.

## Sources and verification

- Zerodha Varsity, support and resistance module (reference only)
- Peer-reviewed reviews of technical trading rules
- Dow theory overview, from standard technical-analysis texts

<!-- facts-needed: none for the arithmetic. The round-number claim is a contested hypothesis and is labelled as untested in the text. -->

<!-- standing-disclaimer -->
