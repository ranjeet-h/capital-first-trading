<!-- meta
id: T7.10
title: Paper trading and forward testing
page_type: Lab
prerequisites: [T7.7, T7.9, T4.9, T2.2]
labs: [Lab 5, Lab 3]
estimated_minutes: 35
-->

# Paper trading and forward testing

## Hook

A rule shows a profit on past prices. This is a hypothetical example. You then try the same rule on paper for a few weeks, and the result looks different. Why? Past prices are fixed, and every fill is known. Real trading has delays, partial fills and your own choices. This chapter shows the difference between backtest, forward and live results. It also shows the four gaps that make paper results look kinder than real ones.

## The idea

Four words describe where a result comes from. Use the right one every time.

- **Backtest.** Past data. The rules are applied after the fact, to prices that already happened.
- **Forward test.** Fixed rules, applied to prices as they arrive, day by day. The rules do not change during the test.
- **Paper or hypothetical.** A trade recorded as if it were filled. Nothing is sent to a broker.
- **Live.** Real orders, with real money.

Label every result with its type. A paper profit is not a live profit.

A paper fill is an assumption. A real fill can differ in four ways:

1. **Fill price.** The price you get can differ from the price you assumed. The spread is the gap between the best buy price and the best sell price (see *Order matching, spread and liquidity*). Prices can also jump at the open.
2. **Queue position.** In a busy market, orders at the same price wait in line. Your order may not be first.
3. **Partial fills.** You may get only part of the shares you wanted.
4. **Your own behaviour.** You may skip a signal, move a stop, or add a trade that the plan did not include.

The forward-test script in Lab 5 is built to be honest. When data is missing or bad, it stops and reports. It does not skip the symbol and carry on. It is safe to run twice, because a second run does not add the same trades again. It places no orders and holds no login details for any broker.

The Kite demo is for practice with the screens, using dummy data. It is not a forward test. Zerodha's support page says: "No, Zerodha does not offer demo accounts for paper trading. However, you can access a demo version of Kite with dummy data." (As of 11 Nov 2026, Zerodha support. Check support.zerodha.com for changes.)

The script uses a market close time and a holiday list. NSE's normal session for shares runs from 9:15 am to 3:30 pm, but NSE has changed session times for some shares and has announced more changes, so read the NSE market timings page. Take the holiday list from the NSE trading holidays page. The terms of the price data source also matter (see *Historical data*).

## See it

<!-- component: order-flow-sim | caption: Follow a real order from the trader to the broker, then to the exchange and matching. Shows which steps a hypothetical fill skips -->

Follow one order from the trader to the exchange. Notice the steps that a paper fill skips. Those skipped steps are where the four gaps appear.

## Worked example

**Hypothetical.** Day 1 close is Rs 800. The rule gives a buy signal. The script plans to buy 12 shares.

**Step 1. The assumed fill.** Day 2 opens at Rs 806. The script fills 12 shares at Rs 806. Value = 12 x 806 = **Rs 9,672**.

**Step 2. A worse real fill.** Suppose a real fill would have been Rs 808. Value = 12 x 808 = **Rs 9,696**.

**Step 3. The rupee effect.** 9,696 - 9,672 = **Rs 24**. Check: 12 x (808 - 806) = 12 x 2 = 24.

**Step 4. Many trades.** The same gap on 10 trades gives 10 x Rs 24 = **Rs 240**. This is hypothetical. It assumes the same gap on each trade. It shows how small assumptions add up.

## Try it

### Guided exercise

**Task.** Fill one row of a forward log for the worked-example trade. Use trade ID H-001 and the made-up symbol EXAMPLE. The fields are trade_id, mode, symbol, planned entry, fill price and shares.

Hints:

1. Set mode to forward. Never set it to live.
2. The fill price in this example is hypothetical. Mark it as hypothetical in your note.

**Answer:**

| trade_id | mode | symbol | planned entry | fill price | shares |
|---|---|---|---|---|---|
| H-001 | forward | EXAMPLE | Rs 806 | Rs 806 (hypothetical) | 12 |

### Independent exercise

**Task.** Write the honesty note that must appear beside a forward-test result on the dashboard.

<details><summary>Check your answer</summary>

A sample note: "Hypothetical paper results. No orders were sent. Fills are assumed, not real. Real fills may be worse because of the spread, gaps, queue position, partial fills and my own choices. A short test proves little. These results are not a forecast of live results."

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks hypothetical and live results, failing closed on bad data, the role of the Kite demo, and holiday handling.

## Paper task

Mode: **forward**, which means hypothetical paper data. No orders are placed.

1. Run the forward-test script on the recorded 10-day test data. If Lab 5 is not ready, write a made-up 10-day price list on paper.
2. Check that each output row has a trade ID, mode, symbol, planned entry, fill price and shares.
3. Import the output into the journal as mode forward (or copy the rows onto paper).
4. Write one sentence on each of the four gaps. For each one, say whether it could make a real fill worse in this example.
5. Do not place any orders. Real daily runs are optional. They need a data source whose terms you have checked.

## Limits and common mistakes

- A forward test sends no real orders. It cannot show how real fills would have gone, so the four gaps remain.
- A short forward test proves little. Thirty trades is a floor for a first look. It is not a verdict on the rule.
- Paper profit is not live profit. A paper result does not show how you act when real money is at risk.
- The Kite demo is not a forward test. It uses dummy data. Zerodha says it offers no demo account for paper trading.
- Paper trading does not prove you can do it with real money. It only shows how the rule ran on the days recorded.

## Remember

- Label every result as backtest, forward (paper) or live.
- The four gaps are fill price, queue position, partial fills and your own behaviour.
- When data is missing or bad, the script should stop. It should not guess.
- The Kite demo is for practice with dummy data. It is not a forward test.
- Paper results are hypothetical. Mark them that way every time.

## Sources and verification

- Zerodha support pages on the demo and virtual trading.
- NSE market timings and holiday pages.
- The Lab 5 notes on honesty.

<!-- standing-disclaimer -->
