# Strategy tester

Try a simple trading rule on past prices. See what it would have made after costs. Then see how easily a test like this can fool you.

The prices are made up by a computer, so no real share is involved. You can also test on your own price files, one file for each share. Your settings, files and results stay on this device.

<lab-backtest></lab-backtest>

## How to use it

1. **Pick a rule** and press *Run the test*. Start with the defaults.
2. **Read the result.** Look at money at the end, the biggest drop, and the number of trades. Fewer than 30 trades proves very little.
3. **Look at one trade.** Pick any trade to see the prices around it, where you got in, and where you got out.
4. **Try the experiments** below the result. Each one changes a single thing, so you can see why a good-looking test can still be wrong.
5. **Keep the trades** if you want to study them in your journal. They are kept apart from your real trades.

## Your own price files

Open *Prices: made-up or your own* and choose one CSV file for each share, named like `RELIANCE.csv`. Each file needs the columns date, open, high, low, close and volume. A file with odd prices is refused, and the page tells you why. Use prices already adjusted for splits and bonuses.

## The honest rules this tool follows

- The rule reads the price at the close. It buys at the **next morning's open**, never at the price it just saw.
- If a share opens below your stop-loss, you get the open price, not the stop. Gaps hurt in real life, so they hurt here.
- Every sale pays the real Zerodha delivery costs.
- Small slippage is added on each side, because real orders rarely fill at the exact price.
- You never borrow money.

A good result here does not mean a rule will work with real money. It only means the rule is worth testing further on prices it has never seen.

This tool is for learning. It does not tell you what to trade.
