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

You hold 50 shares bought at Rs 250. You want a stop-loss that sells if the price falls to Rs 240, and you want that stop to stay in place overnight. The next morning the price opens at Rs 232, below your trigger. Will your stop sell? The answer depends on the order type you chose, and on how long Kite keeps that order alive. This chapter explains four order types: market, limit, SL and SL-M.

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

**Validity** is how long an order stays live. Kite offers Day (the default), Immediate or Cancel (IOC, which fills what it can at once and cancels the rest) and Minutes (from 1 to 120 minutes). A normal SL or SL-M order is valid for one trading day only. If it has not triggered by the end of the session, it expires. For a stop that must last longer, use a GTT (good till triggered). See *GTT orders and their limits*.

**Market protection.** On the web, click Advanced, then tick Market protection. A market order then fills only within a set range of the last price. Any part that cannot fill in that range becomes a limit order at the protection price, and it stays open.

**Blocked orders.** Kite blocks market orders for stock options and for some index option contracts. It blocks SL-M for index options and for all BSE instruments. On BSE, Zerodha suggests SL instead.

**Other order varieties** (Kite's word for the kinds of order you can place):

- **Cover (CO).** A market or limit entry with a built-in stop-loss, for intraday trades on NSE equity only. Once the first part fills, the second part cannot be cancelled.
- **Iceberg.** A large order that Kite sends to the exchange in smaller legs. See *Market depth and charts in Kite*.
- **Disclosed quantity.** For equity orders only. Only part of the order is shown to the market. Where it sits in the order window can change, so look for it in your own app.
- **AMO (After Market Order).** An order placed after market hours. Kite sends it to the exchange when the market opens. Until then, the order book shows AMO REQ RECEIVED. That is not yet an exchange order. AMO is not allowed for Cover or Iceberg orders. Zerodha does not guarantee that pre-market or AMO orders will execute.

An order travels in steps. It goes from you to your broker. The broker sends it to the exchange. The exchange matches it with an opposite order. The visual below shows this path.

## See it

<!-- component: sl-trigger-sim | entry: 250 | trigger: 240 | limit: 238 | openPrice: 232 | mode: normal | caption: Compare SL and SL-M for a long holding of 50 shares, in normal mode and in gap mode -->

<!-- component: order-flow-sim | caption: One order travelling from you, through your broker, to the exchange, and into matching -->

Start in normal mode. Compare what the SL order does with what the SL-M order does. Then switch to gap mode and compare again. Note the fill price in each case. The order flow panel shows the path of one order.

<!-- component: kite-flow | flow: place-a-limit-buy-cnc,place-a-stop-sl-order,amo,mobile-swipe-to-place | platform: web | caption: Click paths for a limit buy, a stop order, an after-market order and the phone swipe. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

<!-- component: kite-illustration | screen: order-types | caption: Switch the order type and see which boxes are used and what risk each type carries. Practice in the Zerodha demo or with dummy data only. Screens and button names can change, so check Kite's help pages. -->

## Worked example

**Hypothetical.** You are long 50 shares bought at Rs 250. Your stop has a trigger at Rs 240 and a limit at Rs 238. It must still be live the next morning. A normal SL would have expired at the end of the day, so this stop is a GTT.

Planned loss at the trigger = 50 x (250 - 240) = 50 x 10 = **Rs 500**.

| Scenario | What happens | Fill | Loss |
|---|---|---|---|
| A. Orderly fall | The price falls through Rs 240, then Rs 238 | Rs 238 | 50 x (250 - 238) = 50 x 12 = **Rs 600** |
| B. Gap to Rs 232, with a limit stop (SL, or a GTT with a limit price) | The trigger is passed. A sell at Rs 238 or better cannot fill at Rs 232 | No fill. The order stays open | Not sold yet. The loss is still open and can grow |
| C. Gap to Rs 232, with a market stop (SL-M, or a GTT set to Market) | The trigger is passed. The order sells at the best price then | About Rs 232 | 50 x (250 - 232) = 50 x 18 = **Rs 900** |

Scenario A loses Rs 100 more than planned (Rs 600 minus Rs 500). Scenario C loses Rs 400 more than planned (Rs 900 minus Rs 500). In scenario B, no sale has happened, so the loss stays open.

On Kite, a market stop can carry market protection. If it does, part of the order can stay open at the protection price instead of filling at Rs 232.

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

Mode: **paper** for the written work. Use `kite_demo` only to read the screen. Log it in your journal (or on paper until the journal app is ready).

1. Open the Kite demo and find the order window. Look for the label your own app uses for the order type.
2. Write on paper the trigger and the limit you plan to use.
3. Write the SL order's trigger and limit prices on paper. Do not place any real order.
4. Write the field names you saw and what the order view showed.
5. Write one sentence: what would this order do in a gap?

## Limits and common mistakes

- A stop does not guarantee a sale at the trigger. An SL order can stay open after the price passes it.
- SL-M is not the same as SL. SL-M sells at the best price available once triggered. SL sells only at its limit price or better.
- A stop does not cap your loss. A gap can make the loss bigger than planned (*Slippage*).
- A normal SL or SL-M order lasts one trading day only. A stop that must last longer needs a GTT.
- SL-M is blocked for index options and BSE instruments. Check the current rules before you rely on either order.
- Do not buy more shares of a losing holding to offset a stop problem. That is averaging down, and this book forbids it.

## Remember

- A market order fills now at the best price available. It gives no price guarantee.
- A limit order sets the worst price you accept. It may never fill.
- SL uses a trigger and a limit. SL-M uses a trigger only.
- For a long holding, a stop-loss sell has its limit at or below its trigger.
- In a gap, an SL may not fill, and an SL-M may fill far from the trigger.
- A normal SL or SL-M order lasts one trading day only. Use a GTT for a longer stop.

## Sources and verification

- Zerodha support articles on stop-loss orders, market protection and order validity. Zerodha changes these rules, so confirm them on its support pages before you rely on them.
- NSE India, order types and trading rules

<!-- facts-needed: Kite availability of SL and SL-M by product and segment; order validity rules; exchange order-type definitions; Kite order view field names and labels. -->

<!-- standing-disclaimer -->
