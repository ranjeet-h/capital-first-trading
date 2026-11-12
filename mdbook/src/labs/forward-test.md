# Forward test

A backtest looks at the past. A forward test looks at days that come **after** you fix your rule. That makes it a much fairer check.

You run a small script on your own computer once a day, after the market closes. It reads that day's prices and writes down what your rule **would have** done. It places no orders. It needs no login and no broker.

Then you bring its two files here. This page adds the trades to your journal in **Forward** mode and compares them with the same rule on earlier days.

<lab-forward></lab-forward>

## How to use it

1. **Set up the script.** The steps are in the `tools/forward-test` folder of the project, in a file called `README.md`. You need one price file per share, and a rule file.
2. **Run it each day** after 3:45 pm India time. If you miss days, the next run catches up.
3. **Choose the two files here.** `forward_log.csv` has the trades. `forward_state.json` is optional and adds the comparison.
4. **Check the preview**, then add the trades. Adding the same file again never makes copies.

## Read the result with care

- The script assumes you buy at the **next morning's open**. Real orders can fill at a worse price.
- Price files you save yourself can have mistakes. The script stops if it sees an odd price, a missing day or a big jump.
- Fewer than 30 trades proves very little. Keep going for months, not days.
- If the new days look much worse than the earlier days, be careful. The earlier result may have been luck.

This is a study tool. It does not tell you what to buy or sell.
