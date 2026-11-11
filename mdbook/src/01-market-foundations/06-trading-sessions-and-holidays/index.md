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

On Friday evening a stock closes at Rs 400. You write a plan. You will buy on the next trading day if the stock stays above Rs 400. This is a hypothetical example. Monday is an exchange holiday, so your order waits until Tuesday. Tuesday's opening price could be far from Rs 400. Your plan must say what to do then. Many beginners ignore the calendar.

## The idea

A trading day is not one block of time. It has phases. Each phase handles orders in its own way.

- **Pre-open:** orders are collected. An opening price is worked out before continuous trading starts. [VERIFY: exact phases, times and mechanics, NSE market timings]
- **Continuous trading:** orders are matched as they arrive, as described in *Order matching, spread and liquidity*.
- **Closing session:** a closing price is set near the end of the day. [VERIFY: closing price method, NSE closing session rules]

**Auctions.** In the pre-open and closing phases, many orders are matched at one price. Put simply, the exchange picks the price where the most shares can trade. [VERIFY: auction method]

**Market timings** are set by the exchange. They can differ on special sessions. This chapter does not state the times. [VERIFY: NSE market timings page]

**Holidays.** The exchange publishes a holiday list every year. No trading happens on those days. [VERIFY: NSE holiday list]

**Special sessions.** The exchange may announce a special session on some days. [VERIFY: NSE circular]

**Weekends** are non-trading days.

**How to find the next session.** Start on the day after your starting day. Skip weekends. Skip exchange holidays. The first day you did not skip is the next session.

**Decisions after the close.** If you decide after the market closes, your order goes to the next session. That session can open at a different price from the close you used in your plan. This gap is covered in *Slippage, gaps and planned versus actual risk*.

**Orders placed when the market is closed** follow the rules of your broker and the exchange. [VERIFY: order handling outside market hours]

## See it

The first table shows one week with a holiday. The holiday is made up for practice. The second table shows the phases of one trading day. The times are placeholders until they are checked.

| Day | Trading? | Note |
|---|---|---|
| Monday | No | Exchange holiday (made up for practice) |
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

This is a hypothetical plan. Friday's close is Rs 400. In a made-up holiday list, Monday is a holiday.

| Step | Day | Trading day? | What happens |
|---|---|---|---|
| 1 | Friday | Yes | Plan is written after the close |
| 2 | Saturday | No | Weekend |
| 3 | Sunday | No | Weekend |
| 4 | Monday | No | Made-up holiday |
| 5 | Tuesday | Yes | Next session. The plan's order is placed here |

Count the calendar days from Friday to Tuesday. Saturday is 1. Sunday is 2. Monday is 3. Tuesday is 4. That is 4 calendar days. But only one trading day falls in that span, and it is Tuesday.

If your plan uses the Rs 400 close, Tuesday's opening price may be well above or below Rs 400. Your plan must say what to do in that case.

## Try it

<!-- OPEN: spec gives no interactive demo for this chapter. No component placeholder is inserted. -->

### Guided exercise

**Task.** In a made-up holiday list, Friday is a holiday. Start after a Thursday. Find the next three trading dates.

Hints:
1. List the days after Thursday, in order.
2. Skip Saturday and Sunday.
3. Skip the made-up holiday, which is Friday.

**Answer:** Monday, Tuesday and Wednesday of the following week.

### Independent exercise

**Task.** Three cases. Each has its own made-up holiday list. For each, find the next trading session.

a. The trade date is a Tuesday. Wednesday is a made-up holiday.
b. The trade date is a Friday. Monday and Tuesday are made-up holidays.
c. The trade date is a Friday. There are no made-up holidays.

<details><summary>Check your answer</summary>

a. Wednesday is a holiday, so the next session is Thursday.
b. Saturday and Sunday are weekends. Monday and Tuesday are holidays. The next session is Wednesday.
c. Saturday and Sunday are weekends. Monday has no holiday, so the next session is Monday.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions. They cover the order of phases, finding the next session, weekends, pre-open and closing prices, and gap risk over a holiday.

## Paper task

**Mode: learning note.**

1. Find the official NSE holiday list for the current year.
2. Copy it into your journal, with the source link and the date you copied it.
3. Using that list, write the next 10 trading dates from today. Skip weekends and listed holidays.
4. Add one line saying what you checked and where.

## Limits and common mistakes

- Phases, times, holidays and special sessions can change. The times here are placeholders until you check them on official pages.
- A holiday list from a previous year is not this year's list.
- Knowing the next session does not tell you the price you will get in it.
- Special sessions can change the normal timings.
- A stop or plan based on one close can meet a very different opening price after a weekend or holiday. This is called gap risk. See *Slippage, gaps and planned versus actual risk*.

## Remember

- A trading day has phases. Each handles orders differently.
- Weekends are non-trading days. Holidays remove trading days.
- To find the next session: skip weekends, then skip holidays.
- The pre-open price and the closing price are different phases. Do not treat them as the same.
- A plan that covers a long weekend or holiday must say what to do if the next open is far from the close.

## Sources and verification

Sources:
- NSE market timings and holiday pages.
- NSE circulars.
- BSE timings page.
- Zerodha support on market hours, for reference.

Facts to verify:
- [VERIFY: market phases and times, NSE market timings page]
- [VERIFY: closing price method, NSE closing session rules]
- [VERIFY: holiday list for the current year, NSE]
- [VERIFY: special session dates, NSE circular]
- [VERIFY: order handling outside market hours, broker and exchange rules]

<!-- facts-needed: market phases and times; closing price method; current-year holiday list; special session dates; order handling outside market hours -->

<!-- standing-disclaimer -->
