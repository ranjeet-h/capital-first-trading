# Forward test: a fixed rule on new prices

## What this is

A forward test checks a trading rule on prices that come after the rule was fixed. You write the rule first. Then you wait for new prices. Then you see what the rule would have done. You do not change the rule while the test runs.

This folder holds a small script. After the market closes each trading day, you run it. It reads end-of-day price files. It writes down what the rule would have done.

The script:

- places NO orders,
- uses NO broker,
- needs NO login,
- uses NO internet.

Words used in this guide:

- **End-of-day price**: the open, high, low, close and volume of a share for one day.
- **Strategy file**: a small text file (JSON) that describes the rule.
- **Hypothetical trade**: a trade written in a log. No real money moves.
- **Forward test**: a test on prices that come after the rule was set.
- **Lock file**: a small file that says a run is still busy.

## Before you start

- Node.js version 20 or newer. Check it with `node --version`.
- The book repo, with its packages installed. From the repo root, run `npm install` once.
- A computer clock that shows the right time. See the section "Honest limits".

## Set it up

You need three things:

1. a config file,
2. a strategy file,
3. price files.

### 1. The config file

Make a file called `forward.config.json` in the folder you will run from. Example:

```json
{
  "strategyFile": "strategy.json",
  "symbols": ["AAA", "BBB", "CCC"],
  "capitalRupees": 50000,
  "startDate": "2026-11-12",
  "dataSource": "csvDir",
  "csvDir": "prices",
  "outDir": "out",
  "slippageBps": 5
}
```

What each field means:

- `strategyFile`: the path to the strategy file. The path is relative to the config file.
- `symbols`: the share codes to watch. Each one needs a price file.
- `capitalRupees`: a pretend amount of money, in rupees. The script uses it to work out position sizes. No real money is used.
- `startDate`: the first day of the test, as YYYY-MM-DD. Set it once. Never change it.
- `dataSource`: must be `"csvDir"`. The script does not download prices.
- `csvDir`: the folder that holds the price files.
- `outDir`: the folder where the output files go. Use a new folder for each new test.
- `slippageBps`: optional. An extra cost added to each fill. One basis point is 0.01 percent. The default is 5.

### 2. The strategy file

Example:

```json
{
  "version": 1,
  "name": "Breakout",
  "type": "breakout",
  "lookback": 20,
  "atrPeriod": 14,
  "stopAtr": 2,
  "trailAtr": 3,
  "riskPct": 1,
  "maxPositions": 3
}
```

There are three rule types:

- `buy_and_hold`: buy once at the start and keep holding. It needs no extra setting.
- `sma_cross`: buy when a short average price rises above a long average price. It needs `fast` and `slow`, the number of days in each average. For example, `"fast": 10` and `"slow": 50`. Keep the other fields from the example.
- `breakout`: buy when the price rises above its highest level of the last few days. It needs `lookback`, the number of past days to check.

The other fields:

- `atrPeriod`: the number of days used to measure a share's usual daily move. This measure is called ATR (average true range).
- `stopAtr`: how far below the buy price the stop-loss sits. The distance is a multiple of ATR. A stop-loss is a price that closes the trade if the price falls to it.
- `trailAtr`: how far a trailing stop-loss follows the price up. A trailing stop moves up with the price but never moves down.
- `riskPct`: the percent of the pretend capital you are willing to lose on one trade.
- `maxPositions`: the most trades that can be open at one time.

Do not change this file during a test. If you change the rule, you start a new test in a new `outDir`.

### 3. The price files

Put one file per share in the `csvDir` folder. Name each file `SYMBOL.csv`, such as `AAA.csv`.

The first line is the header. Use exactly this:

```
date,open,high,low,close,volume
```

Each line after it is one trading day. Example:

```
date,open,high,low,close,volume
2026-11-09,1510.00,1522.75,1506.50,1519.00,984200
2026-11-10,1524.50,1531.00,1519.25,1528.75,1203400
```

The rules for the file:

- Dates are YYYY-MM-DD.
- Prices are in rupees, with up to 2 decimal places.
- Volume is the number of shares traded, as a whole number.
- The newest day in the file must be recent. The script stops if the data is more than 5 days old.

The script does not download prices. You get them yourself and save them in this layout.

## Run it

From the repo root, run:

```
npm run forward -- --config forward.config.json
```

When to run it: after 15:45 India time on the newest trading day. The market closes at 15:30. The script waits for the close to settle. It refuses to run before 15:45 on the newest day.

It is safe to run it twice. The same prices give the same output files. If you miss a day, the next run catches up.

To try the built-in sample (made-up prices), run this from the repo root:

```
npm run forward -- --config tools/forward-test/sample/forward.config.json
```

The sample prices are old, so the script will stop with a warning. That is the safety check working. The sample is there to test the script and to see what the output looks like.

To build the state file again, add `--rebuild`:

```
npm run forward -- --config forward.config.json --rebuild
```

Copy the old `forward_state.json` somewhere safe before you rebuild it.

### Look at the result in the book

1. From the repo root, run `make serve`. The book opens in your browser.
2. Open the lab page called **Forward test**.
3. Choose `forward_log.csv` and `forward_state.json` from your `outDir`.
4. The page shows a preview first. Then it adds the trades to the journal in **Forward** mode. It also compares the rule with the same rule on the days before the start date.

## What the files mean

The script writes these files into `outDir`:

| File | What it holds |
| --- | --- |
| `forward_log.csv` | One row for each hypothetical trade. The trade is either still open or closed. |
| `forward_state.json` | The rule's fingerprint (a short code that changes if the rule changes), the start date, the last day run, the open positions, and how the same rule did on days before the start date. |
| `forward_pending.csv` | What the rule would do at the next open: one row per buy or sell, with the next trading day. It is a note to yourself. Nothing is sent anywhere. The next-day date comes from a holiday list that has only one source, so check it against NSE. |
| `forward_warnings.log` | Problems the script found. Read this file first when the script stops. |
| `forward.lock` | Exists only while a run is going. It is removed when the run ends. |

## When it stops and why

When the script stops, it writes the reason to `forward_warnings.log`, changes nothing, and exits with code 1.

| What you see | What to do |
| --- | --- |
| A price file is missing for a symbol | Add the file `SYMBOL.csv` to `csvDir`. Or remove the symbol from `symbols`. |
| A row has a high lower than its low | Check the row against your source. Fix the typo. |
| A price jumped more than 20 percent in one day | Check the row. A share split can cause this. A split is when a company splits its shares, so each share's price falls. Fix the file if it is wrong. |
| A day shows zero volume | Check the row against your source. Fix the file if it is wrong. |
| One share is behind the others | Update that share's file so every file reaches the same newest day. |
| The price data is more than 5 days old | Get newer prices and save them into `csvDir`. |
| It is before 15:45 India time on the newest day | Wait until 15:45, then run again. |
| `forward_state.json` is damaged | Copy it somewhere safe. Then run with `--rebuild`. |
| The rule or `startDate` in the config is different from the test's start | Put the original rule and date back. Or start a new test in a new `outDir`. |
| `forward.lock` exists | Another run may still be going. Wait. Delete the lock file only if you are sure no run is going. For example, a run may have crashed. |

## Run it automatically (optional)

You do not need this. You can always run the script by hand.

Before you set up an automatic run, check two things:

- The computer must be on and awake at the time you choose.
- The computer's time zone must be India, or you must change the hour to match. A time of 16:00 on a computer set to another time zone is not 16:00 in India.

Weekday schedules do not know about market holidays. On a holiday, the script may stop with a warning. Nothing is changed when it stops.

Replace `/Users/you/path/to/capital-first-trading` with the real path to your repo in every example below.

### macOS (launchd)

1. Save this file as `~/Library/LaunchAgents/local.capital-first.forward.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>local.capital-first.forward</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/env</string>
    <string>npm</string>
    <string>run</string>
    <string>forward</string>
    <string>--</string>
    <string>--config</string>
    <string>forward.config.json</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/Users/you/path/to/capital-first-trading</string>
  <key>StartCalendarInterval</key>
  <array>
    <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>16</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>16</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>16</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>16</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>16</integer><key>Minute</key><integer>0</integer></dict>
  </array>
  <key>StandardOutPath</key>
  <string>/Users/you/path/to/capital-first-trading/forward_launchd.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/you/path/to/capital-first-trading/forward_launchd.log</string>
</dict>
</plist>
```

Weekday 1 is Monday and weekday 5 is Friday. The schedule runs at 16:00 on those days.

2. Load the job:

```
launchctl load ~/Library/LaunchAgents/local.capital-first.forward.plist
```

3. To test it now, run `launchctl start local.capital-first.forward`. Then read `forward_launchd.log` in the repo.

4. To stop the job, run `launchctl unload ~/Library/LaunchAgents/local.capital-first.forward.plist`.

### Linux (cron)

1. Run `crontab -e`.
2. Add this line, then save:

```
0 16 * * 1-5 cd /path/to/repo && npm run forward -- --config forward.config.json >> forward_cron.log 2>&1
```

This runs at 16:00 from Monday to Friday. Output goes to `forward_cron.log` in the repo.

### Windows (Task Scheduler)

1. Open Task Scheduler and choose "Create Basic Task".
2. Set the trigger to Weekly, on Monday through Friday, at 16:00.
3. Set the action to "Start a program". Program: `cmd`. Arguments: `/c npm run forward -- --config forward.config.json`. Start in: the repo folder.
4. Finish, then check that the computer's time zone is India.

### Just run it by hand

This is the simplest way. After 15:45 India time on each trading day, open a terminal in the repo and run:

```
npm run forward -- --config forward.config.json
```

If you miss a day, run it on the next day. It catches up.

## Honest limits

- **Fills are assumed at the next day's open price.** Real trading may do worse. The spread (the gap between buy and sell prices), a queue of orders, or a price gap can all cost you more.
- **A short test proves little.** Thirty trades is the least you should look at. It is not proof that the rule works.
- **Hypothetical results are not live results.** No real money was used. Real trades can go differently.
- **The script trusts the computer clock.** Turn on automatic time setting. If you run the script from another time zone, check that the clock shows India time.
- **You supply the prices.** The script does not download them. Bad prices give bad results.
- **Not financial advice.** This is a study tool. It does not tell you what to buy or sell.
