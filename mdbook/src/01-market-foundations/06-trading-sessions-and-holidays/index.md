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

- **Pre-open:** orders are collected. An opening price is worked out before continuous trading starts. On NSE it runs from 9:00 am to 9:15 am. Orders are taken in the first minutes. Then the exchange matches them, and then trading moves to the normal market at 9:15 am. The price found in pre-open becomes the day's open price. If no price is found, the first trade in the normal market is the open. (As of 11 Nov 2026, NSE pre-open page and NSE circulars of 2026. Times change, so check the NSE site.)
- **Continuous trading:** orders are matched as they arrive, as described in *Order matching, spread and liquidity*.
- **Closing session:** a closing price is set near the end of the day. NSE began a Closing Auction Session on 3 Aug 2026, starting with stocks that have futures and options. It runs after the normal market closes at 3:15 pm for those stocks. A reference price is taken from the trades between 3:00 pm and 3:15 pm. Orders can then be placed within 3% of that reference price. The closing price is the price where the most shares can trade. Other stocks keep the older closing method, and their normal market runs until 3:30 pm. (As of 11 Nov 2026, NSE closing auction session page and NSE circulars. NSE may widen this to more stocks, so check the NSE site.)

**Auctions.** In the pre-open and closing phases, many orders are matched at one price. Put simply, the exchange picks the price where the most shares can trade. Think of a village auction where the seller and buyers all agree on one price at the end. (As of 11 Nov 2026, NSE pre-open page.)

**Market timings** are set by the exchange. They can differ on special sessions. The table in the next section gives the timings in force on 11 Nov 2026. Check the NSE site before you rely on them, because they have changed this year.

**Holidays.** The exchange publishes a holiday list every year. No trading happens on those days. NSE's 2026 list has 16 holidays that fall on weekdays. One of them, 15 Jan, was added after the first list came out. They are listed in the table below the timings. (As of 11 Nov 2026, NSE circular of 12 Dec 2025. Check the NSE site for any change.)

**Special sessions.** The exchange may announce a special session on some days. For example, a special Muhurat trading session was held on Sunday 8 Nov 2026 for Diwali. (As of 11 Nov 2026, NSE circular of 19 Oct 2026. Check the NSE site for new ones.)

**Weekends** are non-trading days.

**How to find the next session.** Start on the day after your starting day. Skip weekends. Skip exchange holidays. The first day you did not skip is the next session.

**Decisions after the close.** If you decide after the market closes, your order goes to the next session. That session can open at a different price from the close you used in your plan. This gap is covered in *Slippage, gaps and planned versus actual risk*.

**Orders placed when the market is closed** follow the rules of your broker and the exchange. Some brokers let you queue an order for the next session and some do not. Check your broker's help pages for how it treats orders placed after the close.

## See it

The first table shows one week with a holiday. The holiday is made up for practice. The second table shows the phases of one trading day. The times come from NSE and were checked on 11 Nov 2026.

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
| Pre-open | Orders collected; opening price worked out | 9:00 am to 9:15 am |
| Continuous trading | Orders matched as they arrive | 9:15 am to 3:30 pm for most stocks. 9:15 am to 3:15 pm for stocks with futures and options |
| Closing session | Closing price set | 3:15 pm to 3:35 pm for stocks with futures and options, in the first phase |
| Post-close | Trades at the closing price | 3:50 pm to 4:00 pm |

(As of 11 Nov 2026, NSE pre-open and closing auction pages and NSE circulars of 2026. Times change, so check the NSE site. The futures and options segment trades until 3:40 pm.)

The 2026 trading holidays that fall on a weekday, from NSE's list of 12 Dec 2025:

| Date | Day | Holiday |
|---|---|---|
| 15 Jan | Thursday | Maharashtra municipal elections (added after the first list; confirm on the NSE site) |
| 26 Jan | Monday | Republic Day |
| 3 Mar | Tuesday | Holi |
| 26 Mar | Thursday | Shri Ram Navami |
| 31 Mar | Tuesday | Mahavir Jayanti |
| 3 Apr | Friday | Good Friday |
| 14 Apr | Tuesday | Dr. Baba Saheb Ambedkar Jayanti |
| 1 May | Friday | Maharashtra Day |
| 28 May | Thursday | Bakri Id |
| 26 Jun | Friday | Muharram |
| 14 Sep | Monday | Ganesh Chaturthi |
| 2 Oct | Friday | Mahatma Gandhi Jayanti |
| 20 Oct | Tuesday | Dussehra |
| 10 Nov | Tuesday | Diwali-Balipratipada |
| 24 Nov | Tuesday | Guru Nanak Jayanti |
| 25 Dec | Friday | Christmas |

Some other holidays fall on a weekend, so they cost no trading day: Mahashivratri on Sunday 15 Feb, Id-Ul-Fitr on Saturday 21 Mar, Independence Day on Saturday 15 Aug and Diwali Laxmi Pujan on Sunday 8 Nov. (As of 11 Nov 2026, NSE circular of 12 Dec 2025. Dates can change, so check the NSE site.)

<!-- component: session-clock | caption: The phases of a trading day. Widths are not to scale and no clock times are shown. Check the exchange for the real times. -->

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

<!-- component: next-session-finder | startDay: 4 | holidayAfter: 3 | caption: The chapter's made-up week: a plan after Friday's close, with Monday as a holiday. Tap days to try the exercise cases. -->

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

- Phases, times, holidays and special sessions can change. The times here were checked on 11 Nov 2026. Check the NSE site again before you rely on them.
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

**Facts checked on 11 Nov 2026:**

- Pre-open timings (9:00 to 9:15 am) and the rule that the pre-open price becomes the open come from NSE's pre-open page and NSE circulars of 2026. The new pre-open steps took effect on 7 Sep 2026.
- The Closing Auction Session began on 3 Aug 2026 (first phase, stocks with derivatives). Its timings, 3% price band and reference price come from NSE's closing auction page and SEBI's circular of 16 Jan 2026.
- Normal market close (3:30 pm, or 3:15 pm for stocks with derivatives), the post-close session (3:50 to 4:00 pm) and the derivatives close (3:40 pm) come from NSE and Zerodha's market timings page.
- The 2026 holiday list and the Muhurat session come from NSE circulars of 12 Dec 2025 and 19 Oct 2026.
- How brokers treat orders placed after the close was not checked. See your broker's help pages.

<!-- standing-disclaimer -->
