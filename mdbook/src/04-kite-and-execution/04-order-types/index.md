<!-- meta
id: T4.4
title: Order types
page_type: Kite walkthrough
prerequisites: [T4.3, T2.6, T3.6]
labs: [Lab 1]
estimated_minutes: 30
-->

# Order types

## Hook

You hold 50 shares bought at Rs 250. You set a stop-loss to sell if the price falls to Rs 240. The next morning the price opens at Rs 232, below your trigger. Will your order sell? The answer depends on the order type you chose. This chapter explains four order types: market, limit, SL and SL-M.

## The idea

An order is an instruction to buy or sell. Some orders have a condition. A condition is a price rule that must be met first. Each order type handles price in its own way.

**Market order.** You buy or sell at the best price available now. You do not set a price. You get speed, but you do not get a price guarantee. In a fast move, the price you get can be far from the last price you saw.

**Limit order.** You set the worst price you accept. A buy limit fills at the limit price or lower. A sell limit fills at the limit price or higher. If the price never reaches your limit, the order may never fill.

**Trigger price.** Some orders wait for a trigger price. The trigger is the price that activates the order. Until the price reaches the trigger, nothing happens.

**SL (stop-loss limit).** An SL order has two prices: a trigger and a limit. When the trigger is reached, the order becomes a limit order at the limit price. It fills only at the limit price or better.

**SL-M (stop-loss market).** An SL-M order has a trigger only. When the trigger is reached, the order becomes a market order. It sells at the best price available then. That fill can be well away from the trigger.

"Long" means you own the shares and want the price to rise. For a long holding, a stop-loss sell has its trigger below your entry price. Its limit is at or below the trigger.

A gap is a jump in price with no trading in between. Gaps often happen at the market open. A gap can make a stop act differently from what you expect. See *Gaps and what they mean for stops*.

| Order type | What you set | When it becomes active | Price you may get | Main risk |
|---|---|---|---|---|
| Market | Nothing | Now | Best available now | The price can be far from the last price you saw |
| Limit | Limit price | Now | Limit price or better | It may never fill |
| SL | Trigger and limit | When the price reaches the trigger | Limit price or better | It may not fill in a gap |
| SL-M | Trigger | When the price reaches the trigger | Best available then | The fill can be far from the trigger |

Read the SL row again. In a gap, the SL order may stay open while the price keeps falling. You still hold the shares.

Which order types you can use for each product, and on each exchange, is [VERIFY: Kite and exchange order-type rules].

An order travels in steps. It goes from you to your broker. The broker sends it to the exchange. The exchange matches it with an opposite order. The visual below shows this path.

## See it

<!-- component: sl-trigger-sim | entry: 250 | trigger: 240 | limit: 238 | openPrice: 232 | mode: normal | caption: Compare SL and SL-M for a long holding of 50 shares, in normal mode and in gap mode -->

<!-- component: order-flow-sim | caption: One order travelling from you, through your broker, to the exchange, and into matching -->

Start in normal mode. Compare what the SL order does with what the SL-M order does. Then switch to gap mode and compare again. Note the fill price in each case. The order flow panel shows the path of one order.

## Worked example

**Hypothetical.** You are long 50 shares bought at Rs 250. Your SL order has a trigger at Rs 240 and a limit at Rs 238.

Planned loss at the trigger = 50 x (250 - 240) = 50 x 10 = **Rs 500**.

| Scenario | What happens | Fill | Loss |
|---|---|---|---|
| A. Orderly fall | The price falls through Rs 240, then Rs 238 | Rs 238 | 50 x (250 - 238) = 50 x 12 = **Rs 600** |
| B. Gap to Rs 232, with SL | The trigger is passed. A sell at Rs 238 or better cannot fill at Rs 232 | No fill. The order stays open | Not sold yet. The loss is still open and can grow |
| C. Gap to Rs 232, with SL-M | The trigger is passed. The order sells at the best price then | About Rs 232 | 50 x (250 - 232) = 50 x 18 = **Rs 900** |

Scenario A loses Rs 100 more than planned (Rs 600 minus Rs 500). Scenario C loses Rs 400 more than planned (Rs 900 minus Rs 500). In scenario B, no sale has happened, so the loss stays open.

## Try it

### Guided exercise

**Task.** You are long 50 shares bought at Rs 250. Your SL trigger is Rs 240 and your limit is Rs 236. The price opens at Rs 235. Decide whether the SL order fills. Then work out what an SL-M order would do.

Hints:

1. A sell limit fills only at its price or higher.
2. An opening price below the limit does not fill the order.
3. An SL-M order fills near the opening price.

**Answer:**

- The SL does not fill. The price is Rs 235, which is below the limit of Rs 236.
- The SL-M fills near Rs 235.
- SL-M loss: 50 x (250 - 235) = 50 x 15 = **Rs 750**.

### Independent exercise

**Task.** You are long 100 shares bought at Rs 300. The SL trigger is Rs 290 and the limit is Rs 287. The price opens at Rs 284. Work out the planned loss at the trigger, the SL-M loss, and whether the SL fills.

<details><summary>Check your answer</summary>

- Planned loss at the trigger: 100 x (300 - 290) = 100 x 10 = Rs 1,000.
- SL-M loss: 100 x (300 - 284) = 100 x 16 = Rs 1,600.
- SL fill: no. The open at Rs 284 is below the limit of Rs 287.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks the difference between SL and SL-M, and what a gap does to a stop.

## Paper task

Mode: **kite demo**, for interface practice only. Log it in your journal (or on paper until the journal app is ready).

1. Open the demo and find the order window [VERIFY: the label in your own Kite].
2. Write on paper the trigger and the limit you plan to use.
3. Place one SL order in the demo with those prices. Do not place any real order.
4. Cancel the order.
5. Write the field names you used and what the order view showed [VERIFY: field names].
6. Write one sentence: what would this order do in a gap?

## Limits and common mistakes

- A stop does not guarantee a sale at the trigger. An SL order can stay open after the price passes it.
- SL-M is not the same as SL. SL-M sells at the best price available once triggered. SL sells only at its limit price or better.
- A stop does not cap your loss. A gap can make the loss bigger than planned (*Slippage*).
- Which products and exchanges allow SL and SL-M is [VERIFY: Kite and exchange order-type rules]. Check before you rely on either order.
- Do not buy more shares of a losing holding to offset a stop problem. That is averaging down, and this book forbids it.

## Remember

- A market order fills now at the best price available. It gives no price guarantee.
- A limit order sets the worst price you accept. It may never fill.
- SL uses a trigger and a limit. SL-M uses a trigger only.
- For a long holding, a stop-loss sell has its limit at or below its trigger.
- In a gap, an SL may not fill, and an SL-M may fill far from the trigger.

## Sources and verification

- Zerodha support pages on order types [VERIFY: page titles]
- NSE India, order types and trading rules

<!-- facts-needed: Kite availability of SL and SL-M by product and segment; order validity rules; exchange order-type definitions; Kite order view field names and labels. -->

<!-- standing-disclaimer -->
