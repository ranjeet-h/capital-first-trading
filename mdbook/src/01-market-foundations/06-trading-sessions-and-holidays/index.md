<!-- meta
id: T1.6
title: Trading sessions, timings and holidays
page_type: Concept
prerequisites: [T1.3, T1.4]
labs: []
estimated_minutes: 15
-->

# Trading sessions, timings and holidays

## Hook

On Friday evening a stock closes at Rs 400. You write a plan: buy on the next session if the stock holds above Rs 400. Hypothetical: Monday is an exchange holiday, so your order waits until Tuesday. Tuesday's opening price could be well away from Rs 400, and the plan has to say what happens then. Most beginner plans ignore the calendar entirely.

## The idea

A trading day is not one continuous block. It has phases, and each phase handles orders in a different way.

- **Pre-open:** orders are collected, and an opening price is worked out before continuous trading starts. [VERIFY: exact phases, times and mechanics, NSE market timings]
- **Continuous trading:** orders are matched as they arrive, as described in *Order matching, spread and liquidity*.
- **Closing session:** a closing price is set near the end of the day. [VERIFY: closing price method, NSE closing session rules]

**Auctions.** In the pre-open and closing phases, many orders are matched at one price. In plain words, the exchange picks the price at which the most shares can trade. [VERIFY: auction method]

**Market timings** are set by the exchange and can differ on special sessions. The times are not stated in this chapter. [VERIFY: NSE market timings page]

**Holidays.** The exchange publishes a holiday list each year. No trading happens on those days. [VERIFY: NSE holiday list]

**Special sessions.** Some days may have a special session, announced by the exchange. [VERIFY: NSE circular]

**Weekends** are non-trading days.

**How to find the next session.** Start from the day after your reference point. Skip weekends. Skip exchange holidays. The first day left is the next session.

**End-of-day decisions.** If you decide after the close, the order is placed at the next session. The next session can open at a different price from the close you planned around. That gap is covered in *Slippage, gaps and planned versus actual risk*.

**Orders placed when the market is closed** are handled under the rules of your broker and the exchange. [VERIFY: order handling outside market hours]

## See it

Read the two tables below. The first shows the weekly calendar with a dummy holiday. The second shows the phases of one trading day, with the times left as placeholders until they are verified.

| Day | Trading? | Note |
|---|---|---|
| Monday | No | Exchange holiday (dummy, for the exercise) |
| Tuesday | Yes | First session after the holiday |
| Wednesday | Yes | |
| Thursday | Yes | |
| Friday | Yes | |
| Saturday | No | Weekend |
| Sunday | No | Weekend |

| Phase | What happens | Time |
|---|---|---|
| Pre-open | Orders collected; opening price worked out | [VERIFY: time] |
| Continuous trading | Orders matched as they arrive | [VERIFY: time] |
| Closing session | Closing price set | [VERIFY: time] |

<!-- OPEN: spec asks for a static day timeline. No static component is in the list, so tables are used here. Confirm. -->

## Worked example

Hypothetical plan. Friday evening close: Rs 400. Dummy holiday list: Monday is a holiday.

| Step | Day | Trading day? | What happens |
|---|---|---|---|
| 1 | Friday | Yes | Plan is written after the close |
| 2 | Saturday | No | Weekend |
| 3 | Sunday | No | Weekend |
| 4 | Monday | No | Dummy holiday |
| 5 | Tuesday | Yes | Next session. The plan's order is placed here |

Calendar days from Friday to Tuesday: Saturday (1), Sunday (2), Monday (3), Tuesday (4). So 4 calendar days, but only one trading session between them, which is Tuesday itself.

If the plan is based on the Rs 400 close, Tuesday's opening price may be well above or below Rs 400. The plan must say what it does in that case.

## Try it

<!-- OPEN: spec gives no interactive demo for this chapter. No component placeholder is inserted. -->

### Guided exercise

**Task.** Dummy holiday list: the Friday of a given week is a holiday. Starting after a Thursday, find the next three trading dates.

Hints:
1. List the days after Thursday, in order.
2. Skip Saturday and Sunday.
3. Skip the dummy holiday, which is Friday.

**Answer:** Monday, Tuesday and Wednesday of the following week.

### Independent exercise

**Task.** Three scenarios, each with its own dummy holiday list. For each, find the next trading session.

a. The trade date is a Tuesday. Wednesday is a dummy holiday.
b. The trade date is a Friday. Monday and Tuesday are dummy holidays.
c. The trade date is a Friday. There are no dummy holidays.

<details><summary>Check your answer</summary>

a. Wednesday is a holiday, so the next session is Thursday.
b. Saturday and Sunday are weekends. Monday and Tuesday are holidays. The next session is Wednesday.
c. Saturday and Sunday are weekends. Monday has no holiday, so the next session is Monday.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions on phase order, next-session arithmetic, weekends, the pre-open and closing prices, and gap risk over a holiday.

## Paper task

**Mode: learning note.**

1. Find the official NSE holiday list for the current year.
2. Copy it into a journal note, with the source link and the date you copied it. Log it in your journal, or on paper until the journal app is ready.
3. Using that list, write the next 10 trading dates from today, skipping weekends and listed holidays.
4. Add one line saying what you checked and where.

## Limits and common mistakes

- Phases, times, holidays and special sessions change. The times in this chapter are placeholders until they are checked against official pages.
- A holiday list from a previous year is not this year's list.
- Knowing the next session does not tell you the price you will get in it.
- Special sessions can change the normal timings.
- A stop or plan built on one close can meet a very different opening price after a weekend or holiday. This is gap risk (*Slippage, gaps and planned versus actual risk*).

## Remember

- A trading day has phases. Each handles orders differently.
- Weekends are non-trading days. Holidays remove trading days.
- To find the next session: skip weekends, then skip holidays.
- The pre-open price and the closing price are different phases. Do not treat them as the same.
- A plan made after a long weekend or holiday must say what it does if the next open is far from the close.

## Sources and verification

Sources:
- NSE market timings and holiday pages.
- NSE circulars.
- BSE timings page.
- Zerodha support on market hours, as reference.

Facts to verify:
- [VERIFY: market phases and times, NSE market timings page]
- [VERIFY: closing price method, NSE closing session rules]
- [VERIFY: holiday list for the current year, NSE]
- [VERIFY: special session dates, NSE circular]
- [VERIFY: order handling outside market hours, broker and exchange rules]

<!-- facts-needed: market phases and times; closing price method; current-year holiday list; special session dates; order handling outside market hours -->

<!-- standing-disclaimer -->
