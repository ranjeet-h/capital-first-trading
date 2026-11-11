# Curriculum specification: Tracks 3 to 6

Status: DRAFT for reviewer. Written 2026-11-11. These are chapter specifications for a later author and a coding agent, not book text.
Parent documents: [PLAN.md](../PLAN.md) and [LABS.md](../LABS.md). Where this file and PLAN.md disagree, PLAN.md wins and the difference goes to the open questions at the end.

Standing rules for every chapter in this file:
- Every Zerodha charge, rate, Kite screen name, Kite behaviour and market rule is either `[VERIFY: ...]` or listed under "Time-sensitive facts to register". No value is stated as fact.
- Every rupee example is hypothetical and labelled as such. Every number in a worked example can be recomputed with a calculator from the formula given.
- Kite illustrations are recreated and labelled "illustration, check your own Kite for the current layout", with a verification date.

---

## Track 3: Chart reading

**Purpose.** Read a candle chart as a compact record of past prices and trades, not as a forecast. Learn to draw levels, label trend, and describe breakouts, gaps and volume without over-claiming.
**Order.** Candles, timeframes, support and resistance, trend structure, breakouts, gaps, volume, candlestick formations (with honest limits), assessment.
**How it serves the goals.** Chart levels become stop prices, and stop prices decide position size (Track 2). Gaps show why a stop is a trigger, not a guarantee. The pattern chapter is explicitly about why patterns cannot be trusted without testing.

### T3.1 Candlesticks: OHLC, bullish and bearish candles, what a candle does not tell you
- **Page type:** Concept
- **Prerequisites:** T1.4, T1.5
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) read open, high, low and close from a candle; (2) calculate body, upper shadow, lower shadow and range of a candle in rupees; (3) classify a candle as bullish or bearish and explain that the label describes one period only; (4) list at least three things a single candle does not show.
- **Key ideas to teach (in order):**
  - A price is one trade. A candle compresses all trades in one period into four numbers.
  - Open = first traded price of the period; close = last traded price; high and low = the extremes.
  - Body = |close minus open|. Shadows (wicks) are the parts of the range beyond the body. Range = high minus low.
  - Bullish = close above open; bearish = close below open. Colour conventions differ between tools; read the legend.
  - A candle is built from ticks. The candle-builder shows the same ticks grouped into one candle.
  - Limits: the order of moves inside a candle is unknown; the shape does not show volume; a candle says nothing certain about the next one.
  - The "open" on a daily chart comes from the continuous session, not the pre-open phase (link to T1.6).
- **Worked example (rupees):** Hypothetical stock, one daily candle: open Rs 500, high Rs 512, low Rs 497, close Rs 509. Body Rs 9 (509 minus 500). Upper shadow Rs 3 (512 minus 509). Lower shadow Rs 3 (500 minus 497). Range Rs 15 (512 minus 497). Bullish. Buying 100 shares at the close would cost Rs 50,900 before charges. All five figures must match exactly.
- **Visual / animation / simulator:** candle-builder. Feed a fixed tick list (501, 499, 510, 506) and show how O, H, L and C form as each tick arrives. Play, Pause, Step and Reset. A text table runs alongside.
- **Guided exercise:** Given ticks 501, 499, 510, 506, 504, build the candle and label it. Hints: (1) open is the first tick; (2) high is the largest tick; (3) low is the smallest; (4) close is the last tick. Expected: O 501, H 510, L 499, C 504, bullish because 504 is above 501.
- **Independent exercise:** Given O 300, H 308, L 296, C 297, compute body, both shadows and range, classify the candle, and name one thing it does not show.
- **Quiz focus:** OHLC definitions; body and shadow arithmetic; bullish versus bearish; scenario: "a green candle means the price will rise tomorrow"; spot the mistake: a candle whose close is reported as its low. Common wrong answers: confusing open with previous close; treating a long wick as certain rejection; treating colour as the definition.
- **Paper task (journal/Kite demo/lab):** Mode paper. Record 10 daily candles of one stock from any chart you are allowed to view, with O, H, L, C, body and range. If taken in the Kite demo, use mode kite_demo and state that the demo is for interface practice only.
- **Labs used:** none
- **Safety / capital-first note:** A single candle is history, not a signal. Address the misconception "a long lower wick means it will bounce". Candle descriptions must never be written as forecasts.
- **Time-sensitive facts to register:** Colour convention and default candle style in Kite [VERIFY: Kite chart settings]. Definition of open on NSE continuous session [VERIFY: NSE market timings page].
- **Sources to cite:** Zerodha Varsity, candlestick module (reference only, original wording); NSE India, market data definitions; Kite chart help pages [VERIFY: article title].
- **Estimated length:** medium

### T3.2 Timeframes and how the same price looks different
- **Page type:** Concept
- **Prerequisites:** T3.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) aggregate five one-minute candles into one five-minute candle with correct OHLC; (2) explain why the same stock can look like a trend on one timeframe and a range on another; (3) choose and justify the timeframe used for an end-of-day decision; (4) identify a timeframe-mismatch error in a stop placement.
- **Key ideas to teach (in order):**
  - Timeframe = the length of one candle.
  - Aggregation rules: open from the first candle, close from the last, high = maximum of highs, low = minimum of lows.
  - Shorter timeframes show more noise; longer timeframes show fewer, slower decisions.
  - For an end-of-day swing style, the daily candle is the decision frame. Shorter frames are for later timing questions (see T5.9).
  - A stop set from a five-minute wick is not a daily decision. Write the timeframe in the plan.
  - Switching timeframes until a pattern appears is hindsight shopping. Choose the timeframe before looking.
- **Worked example (rupees):** Five one-minute candles (O, H, L, C): (500, 501, 499, 500.5), (500.5, 503, 500, 502), (502, 504, 501, 501), (501, 502, 498, 499), (499, 500, 497, 498.5). Aggregated five-minute candle: O 500, H 504, L 497, C 498.5. Range Rs 7. Bearish, because 498.5 is below 500, even though the second minute closed up. Reader must reproduce the four values.
- **Visual / animation / simulator:** candle-builder with a timeframe switch (1-minute, 5-minute, daily). The same tick data redraws at each setting.
- **Guided exercise:** Aggregate the five one-minute candles above into one five-minute candle. Hints: (1) first open; (2) list all highs and take the largest; (3) list all lows and take the smallest; (4) last close.
- **Independent exercise:** Four one-hour candles: (200, 204, 199, 203), (203, 206, 202, 205), (205, 205, 200, 201), (201, 203, 199, 202). Aggregate into one four-hour candle and state whether it is bullish or bearish. Expected: O 200, H 206, L 199, C 202, bullish, range Rs 7.
- **Quiz focus:** aggregation rules; scenario: the same stock on two timeframes gives opposite labels; spot the mistake: taking the high of the last candle only; "a higher timeframe is always better". Common wrong answers: using the last candle's high; assuming a longer timeframe removes all risk.
- **Paper task (journal/Kite demo/lab):** Mode paper. For one stock, log the trend label on the 5-minute, 1-hour and daily charts on the same day, and record which timeframe your plan uses. If done in the Kite demo, use mode kite_demo.
- **Labs used:** none (Lab 3 for logging)
- **Safety / capital-first note:** Timeframe shopping produces false confidence. Stops set on a short timeframe can be hit by noise that a daily plan would ignore, which changes the planned risk.
- **Time-sensitive facts to register:** Chart intervals available in Kite and their history depth [VERIFY: Kite chart help]. Intraday data retention [VERIFY: Zerodha support].
- **Sources to cite:** Kite chart help pages [VERIFY: article title]; Zerodha Varsity, timeframe module (reference only).
- **Estimated length:** short

### T3.3 Support and resistance
- **Page type:** Concept
- **Prerequisites:** T3.1, T3.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) identify a zone where price reversed at least twice; (2) draw a zone rather than a single line; (3) explain role reversal, where broken support becomes resistance; (4) place a stop beyond a zone and convert the distance into shares using Lab 1 rules.
- **Key ideas to teach (in order):**
  - Support and resistance are areas where past buying or selling interest showed up. They are descriptions of history.
  - Use zones, not lines. A zone is a band of prices where reversals clustered.
  - More touches are not proof. Two people can draw different zones on the same chart.
  - Role reversal: a broken support can act as resistance, and the reverse.
  - Round numbers are a widely used heuristic. Their predictive value is not established; treat them as a hypothesis (contested).
  - Stops go beyond the zone, not on it, because noise regularly touches zone edges.
- **Worked example (rupees):** Hypothetical stock, swing highs at Rs 251, Rs 252 and Rs 250.5 that were each rejected; support zone Rs 249 to Rs 252. Assume a hypothetical entry at Rs 252 (zone top) and a stop at Rs 247 (Rs 2 below the zone bottom). Risk per share Rs 5. Capital Rs 50,000, risk 1% = Rs 500. Raw shares 100. Cash cap floor(50,000 / 252) = 198. Concentration cap floor(12,500 / 252) = 49. Shares = 49, concentration cap binds, planned loss 49 times Rs 5 = Rs 245.
- **Visual / animation / simulator:** sr-drawing-exercise (new, allowed). The reader draws zones on a synthetic chart; the tool counts touches and shows whether each zone held or broke, and reveals the answer only after the reader commits.
- **Guided exercise:** On the synthetic chart, draw one support zone and one resistance zone. Hints: (1) find swing highs and lows first; (2) look for clusters, not single points; (3) draw the zone to include the clustered wicks; (4) write the stop beyond the zone.
- **Independent exercise:** A zone is Rs 380 to Rs 384. Entry Rs 384, stop Rs 377. Capital Rs 40,000, risk 1% (Rs 400). Compute risk per share, raw shares, cash cap, concentration cap (25%) and final shares. Expected: risk per share Rs 7, raw 57, cash cap 104, concentration cap 26, final 26, binding constraint concentration.
- **Quiz focus:** zone versus line; role reversal; scenario: a level held three times, so it will hold a fourth time (wrong); spot the mistake: a stop placed exactly on the level; subjectivity of drawing. Common wrong answers: treating touch count as probability; placing stops on the line; treating a broken level as irrelevant.
- **Paper task (journal/Kite demo/lab):** Mode paper. Draw zones on 10 charts and record each zone before looking at what happened next. Mark whether it held, broke, or was not tested. Log in Lab 3 as learning notes.
- **Labs used:** Lab 1 (stop distance to shares)
- **Safety / capital-first note:** Support is a hypothesis. Never average down because price is "at support" (see T6.5). A stop beyond the zone is still a planned loss that must fit the risk budget.
- **Time-sensitive facts to register:** none
- **Sources to cite:** Zerodha Varsity, support and resistance module (reference only); peer-reviewed reviews of technical trading rules (owner to select).
- **Estimated length:** medium

### T3.4 Trend and market structure
- **Page type:** Concept
- **Prerequisites:** T3.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) label swing highs and swing lows in a price sequence; (2) classify a sequence as higher highs and higher lows, lower highs and lower lows, or range; (3) name the level whose break changes the structure; (4) explain why the labels depend on the swing definition.
- **Key ideas to teach (in order):**
  - A trend is the direction of successive swing points, not one up candle.
  - A swing definition is needed, for example a high with lower highs on both sides within N bars. N is your choice and changes the labels.
  - Uptrend structure: higher highs and higher lows. Downtrend: lower highs and lower lows. Range: neither.
  - Structure break: in an uptrend, a close below the most recent swing low means the structure is no longer making higher lows.
  - Structure labels are retrospective. They are updated as new bars arrive.
  - A trend is a description that can end. Trend following is a strategy, covered in T6.3.
- **Worked example (rupees):** Swing sequence: low Rs 200, high Rs 230, low Rs 215, high Rs 245, low Rs 222. Lows 200, 215, 222 are rising. Highs 230, 245 are rising. Uptrend structure. Structure-break level is Rs 222: a close below Rs 222 means the most recent higher low has failed. Hypothetical numbers only.
- **Visual / animation / simulator:** pattern-identification (new, allowed). The reader taps swing points on a synthetic chart; the tool labels HH, HL, LH, LL and shades the break level.
- **Guided exercise:** Label the sequence: low 100, high 120, low 110, high 125, low 115. Hints: compare each swing with the previous swing of the same type (highs with highs, lows with lows). Expected: the lows 110 and 115 are higher lows, the high 125 is a higher high, so the structure is uptrend; the structure-break level is Rs 115, the most recent swing low.
- **Independent exercise:** Sequence: high Rs 260, low Rs 240, high Rs 255, low Rs 238. Label each swing, classify the structure, and state the break level for a downtrend view. Expected: lower highs and lower lows (downtrend); break level is the most recent swing high Rs 255.
- **Quiz focus:** HH/HL definition; scenario: price made a new high on one day, so the trend is up (wrong); spot the mistake: changing the swing definition after seeing the answer; range identification. Common wrong answers: one up candle equals an uptrend; ignoring the most recent swing.
- **Paper task (journal/Kite demo/lab):** Mode paper. For one stock, label structure weekly for 8 weeks, recording the swing definition used. Note any week where your label changed after new data arrived.
- **Labs used:** none
- **Safety / capital-first note:** Structure is a description that moves with the definition. Writing "in an uptrend, so buy" without a rule and a stop is the mistake to address.
- **Time-sensitive facts to register:** none
- **Sources to cite:** Zerodha Varsity, trend module (reference only); Dow theory overview in standard technical-analysis texts (owner to select).
- **Estimated length:** medium

### T3.5 Breakouts, breakdowns and false breakouts
- **Page type:** Concept
- **Prerequisites:** T3.3, T3.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) define a breakout using a close rather than an intraday touch; (2) identify a false breakout and the return inside the range; (3) compute the planned loss for a stop placed inside the range top; (4) explain why a breakout is a test of a hypothesis, not a guarantee.
- **Key ideas to teach (in order):**
  - A range has a top and a bottom. A breakout is a move above the top; a breakdown is a move below the bottom.
  - Define the breakout before you look: close-based (the candle closes beyond the level) or touch-based (price trades beyond it). Close-based is easier to test.
  - A false breakout is a move beyond the level that fails to hold and closes back inside.
  - Volume is supporting context (see T3.7), not proof.
  - A breakout strategy's edge depends on rules, costs and sample size (T6.2). The book gives no failure rate; test rules yourself in Lab 4.
- **Worked example (rupees):** A 10-day range of Rs 300 to Rs 310. Day 11 closes at Rs 312 on volume 180,000 shares against a 20-day average of 100,000 (ratio 1.8). Day 12 closes at Rs 307, back inside the range. A hypothetical entry at Rs 312 with a stop at Rs 308 gives risk Rs 4 per share. Day 12's close of Rs 307 is below the Rs 308 stop, so under the book's next-open fill rule the trade would have exited at day 13's open (Lab 4).
- **Visual / animation / simulator:** candle-builder with a range overlay, plus predict-next: the reader predicts the next candle after a close beyond the range.
- **Guided exercise:** Range Rs 500 to Rs 520. Day closes at Rs 522. Hints: (1) breakout is measured from the range top, so the distance is 522 minus 520 = Rs 2; (2) a stop of Rs 516 is Rs 6 below entry at 522; (3) planned loss for 40 shares is 40 times 6. Expected: Rs 240.
- **Independent exercise:** Range Rs 150 to Rs 158. Close Rs 160 on 1.5 times average volume. Entry Rs 160, stop Rs 154. Shares 30. Compute planned loss and state whether the close-based definition was met. Expected: planned loss Rs 180; close-based breakout met.
- **Quiz focus:** close versus touch; false breakout; scenario: price poked above Rs 310 intraday and closed at Rs 308 (no close-based breakout); spot the mistake: buying on the intraday touch and calling it confirmed. Common wrong answers: treating every touch as a breakout; ignoring the close.
- **Paper task (journal/Kite demo/lab):** Mode paper. Log 5 breakouts from chart history with the definition used, the close-based result after 5 days, and whether it was a false breakout. Label the log "hindsight study, not evidence".
- **Labs used:** Lab 1 (stop distance and planned loss)
- **Safety / capital-first note:** Breakouts attract FOMO. Define the rule before the bar closes, and never chase a move that has already moved far beyond the level.
- **Time-sensitive facts to register:** Circuit-limit effects on breakout trading [VERIFY: NSE and SEBI circuit price band rules; see T1.7].
- **Sources to cite:** Zerodha Varsity, breakout material (reference only); NSE India circuit-limit pages.
- **Estimated length:** medium

### T3.6 Gaps and what they mean for stops
- **Page type:** Concept
- **Prerequisites:** T3.1, T1.6, T1.7
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) calculate gap percentage from the previous close and the open; (2) explain why a stop order is a trigger and does not guarantee its price; (3) compute planned and actual loss for a gap through a stop; (4) explain how a circuit limit can stop an exit from happening.
- **Key ideas to teach (in order):**
  - A gap is an open that differs from the previous close with no trading between them.
  - Overnight news and events are common causes. The book does not predict gaps.
  - A stop becomes a market order or limit order once the trigger is reached. The fill then depends on the market at that moment.
  - If the open is already beyond the stop, the fill is near the open, not at the stop price (gap through stop).
  - Planned risk (entry minus stop, times shares) is not the same as actual risk when gaps occur.
  - Circuit limits may prevent trading at prices beyond a band, which can stop an exit from happening [VERIFY: T1.7].
  - Size positions against a gap scenario you can afford, not only the stop distance (T2.6).
- **Worked example (rupees):** Previous close Rs 400, entry Rs 400, stop Rs 390, 100 shares. Planned loss = 100 times Rs 10 = Rs 1,000. Next day opens at Rs 380 (gap down 5 percent: (380 minus 400) divided by 400). The stop triggers and the hypothetical fill is near Rs 380. Actual loss = 100 times Rs 20 = Rs 2,000, twice the plan. Figures are illustrative.
- **Visual / animation / simulator:** sl-trigger-sim in gap-through-stop mode. The reader sees the trigger, the open, and the fill side by side.
- **Guided exercise:** Same trade, but the open is Rs 385. Compute gap percent, actual loss and the ratio to planned loss. Hints: (1) gap percent uses the previous close; (2) actual loss per share is entry minus fill; (3) divide actual by planned. Expected: gap minus 3.75 percent, actual Rs 1,500, ratio 1.5.
- **Independent exercise:** Previous close Rs 250, stop Rs 240, 50 shares, open Rs 228. Compute planned loss, actual loss and the ratio. Expected: planned Rs 500, actual Rs 1,100, ratio 2.2.
- **Quiz focus:** gap through stop; scenario: a stop of Rs 240 on a stock that opens at Rs 228; spot the mistake: "my stop limits my loss to planned amount"; sizing that ignores gap scenarios. Common wrong answers: assuming the fill equals the trigger; treating gap percent as absolute rupees.
- **Paper task (journal/Kite demo/lab):** Mode paper. For one month, log every gap above 2 percent on a watchlist: gap size, direction, and whether a stop at a chosen distance would have been passed. No outcome predictions.
- **Labs used:** Lab 1 (planned loss); Lab 4 (gap fill rule, next-open and gap-through-stop realism)
- **Safety / capital-first note:** A stop is a trigger, not insurance. For capital protection, compare planned loss with the largest gap you consider plausible, and keep that actual loss within the risk budget.
- **Time-sensitive facts to register:** Circuit price bands and their rules [VERIFY: NSE and SEBI circuit limit pages]. Cash-market session open and close times [VERIFY: NSE market timings]. How Kite handles triggered stop orders across a gap [VERIFY: Zerodha support].
- **Sources to cite:** NSE India, market timings and circuit-limit pages; SEBI circulars on price bands; Zerodha support, stop-order articles [VERIFY: titles].
- **Estimated length:** medium

### T3.7 Volume and what it adds
- **Page type:** Math/Calculator
- **Prerequisites:** T3.1, T3.5
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute relative volume against a 20-day average; (2) explain what volume measures and what it cannot show; (3) describe a price move on high versus low relative volume without predicting its direction; (4) convert traded shares into rupee value and relate it to planned position size.
- **Key ideas to teach (in order):**
  - Volume is the number of shares traded in a period.
  - Relative volume = today's volume divided by the average of the last N days (N = 20 is a common choice).
  - High relative volume shows that more participants traded. It does not show which direction they wanted.
  - Traded value in rupees = volume times price. Liquidity (T1.5) matters when deciding whether a planned size can be exited.
  - Delivery volume and traded volume are different measures [VERIFY: NSE delivery data definition].
  - Volume is also affected by news, index events and corporate actions (T1.9).
- **Worked example (rupees):** 20-day average volume 100,000 shares. Breakout day volume 180,000 shares, so relative volume = 180,000 divided by 100,000 = 1.8. Traded value at Rs 312 = 180,000 times 312 = Rs 56,160,000 (Rs 5.616 crore). A planned 50-share order is 50 divided by 180,000, about 0.03 percent of that day's volume.
- **Visual / animation / simulator:** indicator-playground with a volume pane and a relative-volume line that updates as the reader changes the lookback.
- **Guided exercise:** Volumes over the last 4 days: 80,000, 120,000, 100,000, 200,000 with a 3-day average of the previous three days. Hints: (1) average the three prior days; (2) divide the last day by that average. Expected: prior average 100,000 for the three days 80,000, 120,000, 100,000; relative volume 2.0 on the final day.
- **Independent exercise:** Average volume 250,000 shares. Price falls 2 percent on 90,000 shares. Compute relative volume and write one sentence describing what it shows and what it does not. Expected: ratio 0.36; low participation on a down day, which does not predict direction.
- **Quiz focus:** relative volume formula; scenario: high volume on a down day; spot the mistake: "high volume always means price goes up". Common wrong answers: treating volume as direction; using total volume for a stock without normalising.
- **Paper task (journal/Kite demo/lab):** Mode paper. Log relative volume on 10 breakouts you logged in T3.5 and compare the two logs. Do not draw conclusions from 10 samples.
- **Labs used:** none
- **Safety / capital-first note:** Volume confirmation is an intuition often sold as a signal. Do not treat it as one until tested. Thin stocks can move on small volume, which is a liquidity risk for the position.
- **Time-sensitive facts to register:** NSE definition and availability of delivery percentage data [VERIFY: NSE market data page]. Kite volume display conventions [VERIFY: Kite chart help].
- **Sources to cite:** NSE India, market data glossary; Zerodha Varsity, volume module (reference only).
- **Estimated length:** short

### T3.8 Candlestick formations and price action: honest limits
- **Page type:** Concept
- **Prerequisites:** T3.1, T3.3, T3.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) state the rule for a bullish and a bearish engulfing formation and identify one in a given pair of candles; (2) apply a body-and-shadow rule to identify a hammer-shaped candle; (3) explain why a pattern cannot be evaluated without its exact definition, context and a tested base rate; (4) list the honest limits of pattern claims.
- **Key ideas to teach (in order):**
  - A candlestick pattern is a shape rule. The name is a label for the rule, and authors define them differently.
  - Context matters: where the formation appears relative to trend and levels (T3.3, T3.4).
  - Base rate: how often the formation is followed by the expected move is an empirical question. The book states no figure for it.
  - Price action means reading structure and candles directly. It is still a description until a rule is tested (T7).
  - Many formations occur by chance. Naming a pattern after the move is hindsight.
  - Confirmation rules (for example, waiting for the next candle to close) change results and must be stated.
- **Worked example (rupees):** Bearish engulfing: day 1 open Rs 105, close Rs 110 (bullish candle, body Rs 105 to Rs 110). Day 2 open Rs 111, close Rs 102 (bearish, body Rs 102 to Rs 111). Day 2's body covers day 1's body, and day 2 closes below day 1's open. Hammer-shaped candle: open Rs 200, high Rs 201, low Rs 192, close Rs 199. Body Rs 1. Lower shadow = 199 minus 192 = Rs 7, which is at least twice the body. Upper shadow Rs 1.
- **Visual / animation / simulator:** pattern-quiz (identify the formation in a pair of candles) and pattern-identification for context placement (new, allowed).
- **Guided exercise:** Three candle pairs are shown. For each, state whether the bullish or bearish engulfing rule is met and show the body comparison. Hints: (1) compare the bodies, not the wicks; (2) check whether the second body covers the first; (3) check the direction of the second candle.
- **Independent exercise:** Write your own definition of one formation in no more than four lines, state the context you require, and list three things you would need before you could test it.
- **Quiz focus:** engulfing identification; hammer rule; scenario: a formation appears after a 15 percent fall, so it must reverse the trend (unsupported); spot the mistake: naming a pattern after it has already moved price. Common wrong answers: a hammer is always bullish; patterns are reliable without stated context.
- **Paper task (journal/Kite demo/lab):** Mode paper. Journal 10 formation occurrences with your written definition and context, and record the outcome only after a fixed number of days. Log in Lab 3 as learning notes.
- **Labs used:** Lab 3 (learning notes); later Lab 4 for testing rules
- **Safety / capital-first note:** Patterns create overconfidence. The book makes no claim that any formation predicts profit. Address the belief that a named pattern is a guarantee.
- **Time-sensitive facts to register:** none
- **Sources to cite:** Zerodha Varsity, candlestick patterns (reference only, original wording); peer-reviewed empirical studies of candlestick patterns (owner to select; no results stated here).
- **Estimated length:** medium

### T3.9 Chart-reading assessment
- **Page type:** Assessment
- **Prerequisites:** T3.1, T3.2, T3.3, T3.4, T3.5, T3.6, T3.7, T3.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) read OHLC and compute body, shadow and range; (2) convert a zone-based stop into shares and planned loss; (3) identify structure, breakouts and gaps on an unseen chart; (4) explain the limits of chart reading in one paragraph.
- **Key ideas to teach (in order):**
  - Three sections: calculation, identification on unseen charts, and one scenario with a stop and a gap.
  - Feedback explains each wrong answer, with the rule that applies.
  - Proposed chapter pass mark: 80 percent (a design choice for the reviewer, not a gate; G1 uses 85 percent in PLAN.md section 6).
  - Retake allowed with a fresh randomised set. No timer.
  - The result screen states that chart-reading competence does not show that any chart method works.
- **Worked example (rupees):** Scenario item: zone Rs 249 to Rs 252, entry Rs 252, stop Rs 247, capital Rs 50,000, risk 1 percent. Question: planned loss at 49 shares, and what changes if the open gaps to Rs 240. Expected: planned loss Rs 245 (49 times Rs 5); with a gap to Rs 240 the actual loss is 49 times Rs 12 = Rs 588.
- **Visual / animation / simulator:** quiz-block for calculation items; pattern-quiz and predict-next for identification; sr-drawing-exercise for the zone item.
- **Guided exercise:** One sample item with hints: identify the zone, check the stop, compute the shares.
- **Independent exercise:** A 10-item mini-set on an unseen synthetic chart, completed without hints.
- **Quiz focus:** all sections; scenario item above; spot the mistake: a stop placed inside a zone with no stated reason. Common wrong answers: using the entry instead of the stop for risk per share; ignoring the gap.
- **Paper task (journal/Kite demo/lab):** Mode paper. Journal 20 charts with your labels before reading the answer key, then compare and record the differences.
- **Labs used:** Lab 3 (records answers as learning notes)
- **Safety / capital-first note:** A passing score does not show that any chart method works. State this on the result screen.
- **Time-sensitive facts to register:** none
- **Sources to cite:** the sources of T3.1 to T3.8.
- **Estimated length:** short

---

## Track 4: Kite and execution (demo account only)

**Purpose.** Understand the order tools well enough to avoid expensive execution mistakes. Practice happens only in the Kite demo (dummy data, interface practice) or as checklists the owner completes privately.
**Order.** Tour, watchlists and alerts, depth and charts, order types, product types, GTT, order views and cost preview, common mistakes, a full demo walkthrough, readiness assessment (gate G3).
**How it serves the goals.** Turns Track 2 sizing into an actual order with the right type, product and stop, and makes the owner check each step before submitting.

**Global rule for Track 4.** Every Kite screen name, button, field, product rule, order-type availability, validity period, limit and charge is `[VERIFY]` until checked on Zerodha's own pages and in the owner's own Kite. Kite illustrations are recreated and labelled "illustration, check your own Kite for the current layout", with a verification date. The book never gives login or account steps, and never asks for or stores credentials.

### T4.1 Kite web and mobile tour; Console overview
- **Page type:** Kite walkthrough
- **Prerequisites:** T0.2, T1.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) locate the main areas of Kite on web and mobile using the labels in their own app [VERIFY]; (2) state what the demo is and is not; (3) describe the purpose of Console as an account back office [VERIFY]; (4) decide which screens can be explored without placing any order.
- **Key ideas to teach (in order):**
  - Kite is Zerodha's trading platform on web and mobile. The book does not depend on either app.
  - Orientation first: account area, watchlist, chart, order window, and the orders, positions and holdings views [VERIFY labels].
  - Console is a separate back-office area for reports and statements [VERIFY: what Console shows, per Zerodha support].
  - The demo uses dummy data and is for interface practice only. Zerodha states it has no paper-trading account [VERIFY: exact wording on Zerodha support].
  - How to reach the demo is [VERIFY]. The book does not describe the steps until verified.
  - Screenshots of a real account must be cropped to remove names, client IDs and balances before sharing.
- **Worked example (rupees):** Illustration: a buy of 10 shares at Rs 250 shows an order value of Rs 2,500 (10 times Rs 250) before charges. Charges are shown separately; where and how [VERIFY: Kite cost preview]. The reader must find the same value in their own demo.
- **Visual / animation / simulator:** kite-illustration with annotated recreated web and mobile screens, a toggle for each platform, and an overlay reading "check your own Kite".
- **Guided exercise:** In your own Kite demo, find each named area from the tour and write the label your app uses. Hints: (1) use the app's own search; (2) if a label differs, note it and check Zerodha support; (3) do not place any order in this exercise.
- **Independent exercise:** Draw a one-page map of your Kite layout with labels (no screenshots of your real account).
- **Quiz focus:** demo versus live; Console purpose; scenario: a student thinks the demo shows real prices for paper trading; spot the mistake: sharing an unredacted account screenshot. Common wrong answers: demo equals paper trading account; Console places orders.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Complete the tour checklist and write a short reflection on what you did not understand.
- **Labs used:** none
- **Safety / capital-first note:** The tour places no orders. The book never needs a login. Do not treat demo familiarity as evidence of trading skill.
- **Time-sensitive facts to register:** Demo availability and exact wording [VERIFY: Zerodha support]. Current Kite and mobile labels [VERIFY: owner's own app]. Console contents [VERIFY: Zerodha Console help].
- **Sources to cite:** Zerodha support pages on Kite and the demo [VERIFY: titles]; Zerodha Console help [VERIFY: title].
- **Estimated length:** medium

### T4.2 Watchlists, search and price alerts
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.1, T1.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) build a watchlist from written selection criteria; (2) explain that a watchlist is an attention tool, not a recommendation list; (3) set a price alert in the demo and state that it notifies rather than trades [VERIFY: alert behaviour]; (4) check a symbol for similar names and exchange before acting.
- **Key ideas to teach (in order):**
  - A watchlist controls attention. Write the criteria before adding a symbol (liquidity, sector, data availability).
  - Symbol search: similar names and codes exist. Check the exchange and symbol.
  - The same company can have separate listings on NSE and BSE [VERIFY: symbol and code conventions].
  - An alert is a notification. Whether a Kite alert can ever place an order is [VERIFY]; this book assumes it does not and the plan never relies on one.
  - Alerts create urgency. Set them as review prompts, not as triggers to act.
- **Worked example (rupees):** Ten watchlist symbols at Rs 250 each would cost Rs 25,000 to buy one share each. The watchlist is free; the attention cost is not. An alert at Rs 252 is a prompt to review the chart, with the stop and size decided in advance.
- **Visual / animation / simulator:** kite-illustration showing a watchlist, a search result with similar symbols, and an alert dialog.
- **Guided exercise:** Create a five-symbol watchlist in your demo with a written rule for each symbol. Hints: (1) write the rule first; (2) verify the exchange for each symbol; (3) set one alert in the demo and write what you will do when it fires.
- **Independent exercise:** Write four selection rules and an alert plan for one hypothetical stock. The plan must say what the alert is for and what the reader will do before any order.
- **Quiz focus:** alert versus order; watchlist equals recommendations; scenario: choosing a stock because it rose most today; spot the mistake: placing an order immediately on an alert. Common wrong answers: a watchlist is a buy list; alerts are automatic orders.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Record the watchlist rules and the alert purpose in the journal as a learning note.
- **Labs used:** Lab 3 (learning note)
- **Safety / capital-first note:** Alerts and watchlists drive FOMO. Address the belief that a rising stock on a list is an opportunity.
- **Time-sensitive facts to register:** Alert types, notification channels and whether alerts can trigger orders [VERIFY: Zerodha support]. Symbol and series conventions [VERIFY: NSE and BSE symbol pages].
- **Sources to cite:** Zerodha support pages on watchlists and alerts [VERIFY: titles]; NSE and BSE symbol directories.
- **Estimated length:** short

### T4.3 Market depth and charts in Kite
- **Page type:** Kite walkthrough
- **Prerequisites:** T1.5, T3.2, T4.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) read a depth snapshot and identify best bid, best ask and spread in rupees; (2) explain that depth is a moment, not a commitment; (3) set up a daily chart with a chosen timeframe in the demo; (4) explain why depth matters less for end-of-day decisions.
- **Key ideas to teach (in order):**
  - Best bid is the highest buy price waiting. Best ask is the lowest sell price waiting. Spread = ask minus bid.
  - Depth shows several levels of quantities. The number of levels shown is [VERIFY: Kite depth view].
  - Orders can be placed and cancelled, so depth changes. Hidden or iceberg orders are not visible.
  - Crossing the spread: buying at the ask costs about half the spread per share more than the mid-price.
  - Chart setup: timeframe, chart type and indicators. Available options are [VERIFY: Kite chart settings].
- **Worked example (rupees):** Best bid Rs 249.90, best ask Rs 250.10, spread Rs 0.20, mid-price Rs 250.00. Buying 100 shares at the ask: the cost above mid is (250.10 minus 250.00) times 100 = Rs 10.
- **Visual / animation / simulator:** order-book-sim (bids and asks update as orders arrive; spread and depth shown) and kite-illustration for the depth panel.
- **Guided exercise:** Given a depth table, find best bid, best ask, spread, and the cost above mid for buying 100 shares at market. Hints: (1) best bid is the top of the buy side; (2) market buy takes the ask; (3) subtract the mid from the ask and multiply by quantity.
- **Independent exercise:** Spread Rs 0.50 on a Rs 400 stock; buy 200 shares at the ask. Compute the spread as a percent of price and the cost above mid. Expected: 0.125 percent; Rs 50.
- **Quiz focus:** spread; mid-price; depth as snapshot; scenario: a large bid quantity appears and the reader assumes the price will hold; spot the mistake. Common wrong answers: big bid guarantees support; spread is a fee.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Record the spread for one symbol at three times on one trading day, and the chart settings used. Session times [VERIFY: NSE market timings].
- **Labs used:** none
- **Safety / capital-first note:** Depth can be misleading and changes quickly. It is not a basis for end-of-day decisions. Liquidity of the symbol decides whether a planned size can be exited (T1.5).
- **Time-sensitive facts to register:** Depth levels displayed in Kite [VERIFY]. Chart intervals and history depth [VERIFY: Kite chart help].
- **Sources to cite:** NSE India, market depth and order-book description [VERIFY: page name]; Zerodha support pages on market depth and charts [VERIFY: titles].
- **Estimated length:** medium

### T4.4 Order types: market, limit, SL and SL-M
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.3, T2.6, T3.6
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) explain what each of market, limit, SL and SL-M does and when it executes; (2) calculate the outcome of a stop-loss sell with and without a gap; (3) identify which order type can leave a position unexited; (4) choose an order type for a planned stop and justify the choice.
- **Key ideas to teach (in order):**
  - An order is an instruction with conditions. Market executes at the best available price, with no price guarantee. Limit executes only at the limit or better, and may not execute.
  - SL (stop-loss limit): a trigger price activates a limit order at the limit price.
  - SL-M (stop-loss market): a trigger price activates a market order.
  - For a long position, a stop-loss sell has a trigger below the entry and a limit at or below the trigger.
  - An SL order can fail to fill if the market gaps past its limit. An SL-M order fills, but at a price that may be far from the trigger.
  - Availability of SL and SL-M by product and exchange is [VERIFY: Kite and exchange order-type rules].
  - Path of an order: sl-trigger-sim and order-flow-sim show trader, broker, exchange and matching.
- **Worked example (rupees):** Long 50 shares bought at Rs 250. Stop-loss sell: trigger Rs 240, limit Rs 238. Planned loss at the trigger = 50 times Rs 10 = Rs 500. Scenario A (orderly fall through 240 then 238): fill at Rs 238, loss Rs 600. Scenario B (opens at Rs 232): the trigger is hit, but a sell limit at Rs 238 cannot fill at Rs 232, so the order stays open and the position stays exposed. Scenario C (SL-M, same gap): fills near Rs 232, loss Rs 900.
- **Visual / animation / simulator:** sl-trigger-sim (SL versus SL-M, normal and gap modes) and order-flow-sim.
- **Guided exercise:** Long 50 shares at Rs 250, SL trigger Rs 240, limit Rs 236, opens at Rs 235. Determine whether the SL fills and what the SL-M would do. Hints: (1) a sell limit fills only at its price or higher; (2) an open below the limit does not fill it; (3) SL-M fills near the open. Expected: SL does not fill at 235 (limit 236); SL-M fills near 235, loss 15 times 50 = Rs 750.
- **Independent exercise:** Long 100 shares at Rs 300, SL trigger Rs 290, limit Rs 287, opens at Rs 284. Compute the planned loss, the SL-M loss, and state whether the SL fills. Expected: planned Rs 1,000, SL-M loss Rs 1,600, SL does not fill.
- **Quiz focus:** SL versus SL-M; scenario: an SL order placed with limit Rs 287 and trigger Rs 290 on a gap to Rs 284; spot the mistake: a sell SL with a limit above its trigger; "a stop order guarantees the trigger price". Common wrong answers: SL-M is the same as SL; stop orders cannot lose more than planned.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Place and cancel one SL order in the demo (interface practice only). Record the field names you used and what the order view shows [VERIFY].
- **Labs used:** Lab 1 (planned loss)
- **Safety / capital-first note:** The main hidden risk of stops is non-fill or a fill far from the trigger. Never assume the stop equals the planned risk. Choose the order type knowing the gap case.
- **Time-sensitive facts to register:** Kite availability of SL and SL-M by product and segment [VERIFY: Zerodha support]. Order validity rules [VERIFY]. Exchange order-type definitions [VERIFY: NSE order types page].
- **Sources to cite:** Zerodha support pages on order types [VERIFY: titles]; NSE India, order types and trading rules.
- **Estimated length:** long

### T4.5 Product types: CNC and MIS, and why beginners stay with CNC
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.4, T1.3, T2.13
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) explain what each product type means for holding period and settlement; (2) spot a product-type error in an order preview; (3) explain why this book restricts beginners to CNC; (4) describe MIS square-off in general terms, with the exact rule marked [VERIFY].
- **Key ideas to teach (in order):**
  - Product type states how long the trade is meant to last and how it is settled.
  - CNC (delivery): shares are held in the demat account after settlement (T1.3). A CNC holding can stay overnight.
  - MIS (intraday): the position is meant to close within the same session. Auto square-off rules exist [VERIFY: timing and rules].
  - MIS uses margin, which is leverage (theory only, T2.13). The book does not teach MIS practice.
  - Product type changes costs and charges [VERIFY: Kite cost preview; Lab 2].
  - The book's style is end-of-day swing and positional, which uses CNC.
- **Worked example (rupees):** Buy 10 shares at Rs 250, order value Rs 2,500. In CNC the holding can continue overnight. In MIS the position is intended to close the same day. If left open, the rule set by the broker or exchange applies [VERIFY]. Illustration: a 1 percent adverse move on Rs 2,500 is Rs 25 before charges.
- **Visual / animation / simulator:** kite-illustration with a product selector shown beside the order preview, with the consequences listed.
- **Guided exercise:** Classify three planned trades (hold for weeks, close today, hold until a stop) and choose the product for each. Hints: (1) the holding period decides the product; (2) if the plan says "carry overnight", MIS is wrong; (3) write the reason.
- **Independent exercise:** Write a product-error scenario and explain the consequence and how to catch it before submitting.
- **Quiz focus:** product types; scenario: a trader meant to hold overnight selects MIS; spot the mistake: "MIS is cheaper, so use it". Common wrong answers: CNC allows sales at any time regardless of settlement; MIS has no risk because it closes the same day.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. In the demo order view, locate the product selector and note its options and default [VERIFY]. Record the default in the journal.
- **Labs used:** Lab 2 (compare CNC and MIS costs, once verified)
- **Safety / capital-first note:** Intraday is a higher-risk style, not a shortcut. Beginners stay with CNC. The product selector is a common source of unintended positions.
- **Time-sensitive facts to register:** MIS auto square-off timing and rules [VERIFY: Zerodha support and SEBI or exchange circulars]. Product availability by stock [VERIFY]. Intraday margin rules [VERIFY: SEBI and exchange margin pages]. CNC and MIS charges [VERIFY: Zerodha charges page].
- **Sources to cite:** Zerodha support pages on product types [VERIFY: titles]; SEBI and NSE margin circulars.
- **Estimated length:** medium

### T4.6 GTT orders and their limits
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.4, T4.5
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) explain that a GTT waits for a trigger price and then places an order; (2) name two limits: validity and no guaranteed fill; (3) compute the planned loss for a GTT stop placed in the demo; (4) list three GTT mistakes.
- **Key ideas to teach (in order):**
  - GTT (good till triggered) stores a conditional order that waits for a trigger price.
  - Once triggered, the stored order is placed. Its order type and product are [VERIFY: Kite GTT form].
  - Validity period and the number of active GTTs are [VERIFY: Zerodha GTT help].
  - A GTT is not a guaranteed fill. The same gap and limit rules from T4.4 apply after triggering.
  - A GTT can be forgotten. Check it after every trade, every corporate action and every change in holdings [VERIFY: how Kite handles GTTs on corporate actions].
  - A GTT must match the holding quantity. A GTT larger than the holding is a mistake.
- **Worked example (rupees):** 100 shares bought at Rs 250 (CNC). GTT: trigger Rs 240, sell 100 shares. If it fills at the trigger, planned loss = 100 times Rs 10 = Rs 1,000. If validity ends before the reader's review date, the position has no stop after that date. Illustration only.
- **Visual / animation / simulator:** kite-illustration of a GTT form and a GTT status list, with the trigger, quantity and expiry fields annotated [VERIFY].
- **Guided exercise:** Holding 100 shares at Rs 250; plan a GTT with trigger Rs 240 and compare planned loss with a stop trigger at Rs 245. Hints: (1) loss = (entry minus trigger) times quantity; (2) check quantity against holdings; (3) write the review date. Expected: Rs 1,000 at Rs 240; Rs 500 at Rs 245.
- **Independent exercise:** Write a GTT plan for a hypothetical holding: trigger, quantity, planned loss, expiry check date and a weekly review step.
- **Quiz focus:** GTT versus immediate order; expiry; scenario: a GTT set for 150 shares when 100 are held; spot the mistake: "a GTT is a guaranteed exit". Common wrong answers: GTT never expires; GTT fills at the trigger price exactly.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Create and cancel one GTT in the demo. Record the fields, validity and any warnings [VERIFY].
- **Labs used:** Lab 1 (planned loss)
- **Safety / capital-first note:** A GTT is not a risk limit and does not replace the plan. Check it after every trade. A stale GTT is a silent exposure.
- **Time-sensitive facts to register:** GTT validity period, number of GTTs, allowed products and trigger-range rules [VERIFY: Zerodha GTT help]. Corporate-action handling of GTTs [VERIFY].
- **Sources to cite:** Zerodha support, GTT articles [VERIFY: titles].
- **Estimated length:** medium

### T4.7 Order book, trade book, holdings versus positions, and cost preview
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.4, T4.5, T1.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) distinguish order book, trade book, holdings and positions; (2) reconcile one order with its trades and the resulting holding; (3) compute the average price from partial fills; (4) explain why a cost preview is an estimate until verified.
- **Key ideas to teach (in order):**
  - Order book: each instruction and its status (for example open, executed, rejected, cancelled) [VERIFY: status labels].
  - Trade book: each execution (fill) with quantity and price.
  - Holdings: shares in the demat account after settlement. Timing of display after T+1 is [VERIFY].
  - Positions: open intraday and carry positions, depending on product type [VERIFY].
  - Reconciliation: order quantity equals the sum of fills, which equals the change in holdings or positions.
  - Cost preview: estimated charges before submission. Final charges appear elsewhere [VERIFY: where the final charge statement is shown].
- **Worked example (rupees):** Buy order for 10 shares at limit Rs 250 (CNC). Fills: 6 at Rs 249.80 and 4 at Rs 250.00. Trade book shows two rows totalling 10 shares. Value = (6 times 249.80) plus (4 times 250.00) = Rs 1,498.80 plus Rs 1,000 = Rs 2,498.80. Average price = Rs 2,498.80 divided by 10 = Rs 249.88.
- **Visual / animation / simulator:** kite-illustration showing one order traced across the four views, with quantities and prices highlighted.
- **Guided exercise:** Reconcile the example above. Hints: (1) add the fill quantities; (2) multiply each fill; (3) divide total value by total quantity. Expected: 10 shares, average Rs 249.88.
- **Independent exercise:** Order for 20 shares; 15 filled at Rs 402 and 5 still pending. Compute value filled, average price, and what each view should show at that moment.
- **Quiz focus:** holdings versus positions; order status meanings; scenario: a partly filled order viewed as complete; spot the mistake: reading cost preview as the final charge. Common wrong answers: holdings show intraday positions; trade book shows pending orders.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Place one order in the demo, then record its appearance in all four views and the cost preview. Compare the preview with the final figure where the demo shows one [VERIFY].
- **Labs used:** Lab 3 (execution reconciliation as a learning note); Lab 2 (cost preview comparison)
- **Safety / capital-first note:** Reconciliation catches errors early. Never assume a partly filled order is finished, and do not average down on a pending order.
- **Time-sensitive facts to register:** Holdings display timing after T+1 [VERIFY: Zerodha support; T1.3]. Cost preview accuracy and where final charges appear [VERIFY: Zerodha support]. Contract note availability [VERIFY].
- **Sources to cite:** Zerodha support pages on order status, trade book and holdings [VERIFY: titles]; Zerodha charges page.
- **Estimated length:** medium

### T4.8 Common execution mistakes
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.4, T4.5, T4.6, T4.7
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) detect a wrong product type before submission; (2) calculate the exposure caused by a quantity error; (3) explain four reasons a stop may never trigger; (4) write a pre-submission checklist.
- **Key ideas to teach (in order):**
  - Four error families: wrong product, stops that never trigger, fat-finger price or quantity, and wrong quantity.
  - Stops that never trigger: wrong side, trigger never reached, order inactive or cancelled, GTT not active or expired.
  - Confirmation prompts and price-range checks may exist [VERIFY: Kite order confirmation and price-range messages].
  - A checklist written before the session beats a fix during the session.
  - After a mistake, reduce exposure by the rules. Do not add to the position to "fix" it (T6.5).
- **Worked example (rupees):** Intended: 10 shares at Rs 250 = Rs 2,500. Typed: 100 shares = Rs 25,000, ten times the intended size. On a Rs 50,000 account that is half the capital in one trade. With a Rs 10 stop distance, the planned loss on 100 shares is Rs 1,000 (2 percent of capital), twice the Rs 500 budget.
- **Visual / animation / simulator:** spot-the-mistake on recreated order-preview illustrations.
- **Guided exercise:** Three described orders contain one error each. Find each error and state the correction. Hints: check side, product, quantity and price against the plan.
- **Independent exercise:** Write your own eight-item pre-submission checklist, then test it against three errors you were not shown.
- **Quiz focus:** spot the mistake; scenario: a stop placed on the wrong side for a long position; common wrong answers: a fat-finger error is caught by the exchange; a stop cannot be placed too far.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Deliberately enter one wrong-quantity order in the demo and record where you caught it, then cancel. Log the mistake in Lab 3 as a rule-break tag.
- **Labs used:** Lab 1 (quantity check); Lab 3 (rule-break tags)
- **Safety / capital-first note:** This chapter exists to prevent expensive mistakes. The book cannot verify demo practice, so the reflection is self-attested.
- **Time-sensitive facts to register:** Kite confirmation and price-range messages [VERIFY: Zerodha support]. Exchange price-band and order rejection rules [VERIFY: NSE circulars].
- **Sources to cite:** Zerodha support pages on orders and errors [VERIFY: titles]; NSE India trading rules.
- **Estimated length:** medium

### T4.9 A complete demo walkthrough: plan in the journal, place in the Kite demo, record
- **Page type:** Kite walkthrough
- **Prerequisites:** T4.1 to T4.8, T2.5, T3.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) write a complete planned trade with sizing from Lab 1; (2) place the matching demo order with the planned quantity, product and stop; (3) record the execution and compare plan with what happened in the demo; (4) label the record as kite_demo, never live.
- **Key ideas to teach (in order):**
  - Plan before opening Kite: setup, entry, stop, shares, planned loss, product, review date.
  - Size from Lab 1 using the stop distance, the risk budget and the caps.
  - The stop is a separate order and must be placed and checked.
  - Record execution and compare with plan. The demo's dummy data gives no real profit or loss.
  - Journal the mode as kite_demo.
- **Worked example (rupees):** Capital Rs 50,000; risk 1 percent = Rs 500. Entry Rs 250, stop Rs 240 (chart level below a zone). Risk per share Rs 10. Raw shares 50. Cash cap 200. Concentration cap 25 percent = Rs 12,500, so 50 shares. Position Rs 12,500 (exactly at the cap). Planned loss Rs 500. Stop order: SL with trigger Rs 240 and limit Rs 238 [VERIFY that the demo supports this order].
- **Visual / animation / simulator:** lab-journal (plan form and execution form) and kite-illustration of the order steps.
- **Guided exercise:** Complete the plan form for the worked example. Hints: (1) risk per share first; (2) raw shares = risk budget divided by risk per share, rounded down; (3) check both caps. Expected: 50 shares, planned loss Rs 500.
- **Independent exercise:** Entry Rs 300, stop Rs 290, capital Rs 50,000, risk 1 percent. Compute the final shares, planned loss and binding constraint. Expected: raw 50, cash cap 166, concentration cap 41 (floor of 12,500 divided by 300), final 41, planned loss Rs 410, concentration binding.
- **Quiz focus:** plan versus execution; mode labelling; scenario: a demo fill differs from the plan; spot the mistake: recording a demo trade as live. Common wrong answers: demo P&L shows skill; a stop at the trigger is always filled.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. Complete the full cycle: plan, place, record, reflect, for one hypothetical trade. This is the chapter's paper task.
- **Labs used:** Lab 1 (sizing); Lab 3 (journal, mode kite_demo)
- **Safety / capital-first note:** A demo trade has no evidential value for live results. Do not record it as live. There is no pressure to move beyond demo practice.
- **Time-sensitive facts to register:** Demo availability and wording [VERIFY: Zerodha support]. SL order availability in the demo [VERIFY].
- **Sources to cite:** Zerodha support pages on the demo [VERIFY: titles]; the book's journal specification (PLAN.md and LABS.md, Lab 3).
- **Estimated length:** long

### T4.10 Kite readiness assessment (gate G3)
- **Page type:** Assessment
- **Prerequisites:** T4.1 to T4.9

Gate fields used in place of the template fields, per the brief:

- **Purpose:** Confirm educational competence in order mechanics before any further Kite work. Not a real-money permission.
- **Exact pass criteria (PLAN.md G3, sharpened):** (a) every item on the Kite demo checklist (T4.1 to T4.9) marked done, with a one-line reflection each; this part is self-attested and cannot be verified by the book; (b) execution-mistake quiz at 90 percent or more on a fresh randomised set of at least 10 questions; (c) for the T4.9 demo trade, the owner states the planned loss, the binding sizing constraint and the stop order type with its gap behaviour.
- **Question types and randomisation:** spot-the-mistake order previews; numeric items on sizing, stop fills and gap losses; order-type behaviour scenarios; product-type choice scenarios. Items drawn at random from a bank, with numbers varied within tolerance.
- **Retake rules:** unlimited retakes; each retake uses a new randomised set; wrong answers show their explanation before retake; no timer.
- **What the screen must say:** "This checks that you understand order mechanics and your demo checklist. It is not proof that you can trade profitably, and it is not a recommendation to place live orders. There is no pressure to go live." The same notice appears on the pass screen.
- **What is stored locally:** checklist ticks, reflection text, quiz attempts with item IDs and answers, timestamps, and the gate status, in IndexedDB through the storage layer. Included in the JSON backup export. Nothing leaves the device.
- **Labs used:** Lab 3 (gate record, learning notes)
- **Safety / capital-first note:** Passing G3 must not be read as readiness for real money. The G7 review and PLAN.md section 6 decide that.
- **Time-sensitive facts to register:** all Track 4 [VERIFY] items, as listed above.
- **Sources to cite:** the sources of T4.1 to T4.9.
- **Estimated length:** short

---

## Track 5: Indicators

**Purpose.** Understand what each common indicator is, its formula, its interpretation and its limits. Every indicator has its mathematics explained in words, with a small numeric example the reader can check with a calculator. No indicator is presented as a predictor of profit.
**Order.** Concept of indicators, moving averages, ATR, RSI, MACD, Bollinger Bands, Fibonacci, volume indicators and VWAP, multiple timeframes, playground and disagreement.
**How it serves the goals.** ATR gives stop distances for Track 6, moving averages give trend filters, and the disagreement chapter prevents the most common form of self-deception: tuning parameters until the past looks good.

**Global rule for Track 5.** Default parameters such as 14, 20 and 2 are conventions in the literature. They are not facts about any platform. The Kite defaults are `[VERIFY]`. Each indicator section gives the formula in words, and the worked figures are rounded to the stated number of decimals.

### T5.1 What indicators are and are not
- **Page type:** Concept
- **Prerequisites:** T3.1, T3.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) state that every indicator is a formula applied to past price and/or volume; (2) explain what a lagging indicator is; (3) identify three things an indicator cannot tell you; (4) check a claimed indicator signal for its inputs, lookback and lag.
- **Key ideas to teach (in order):**
  - An indicator is a transform of OHLC and volume data over a window. It adds no outside information.
  - Parameters: the window length (period) and any smoothing constants.
  - Most trend indicators lag because they average past data.
  - Many indicators are closely related because they transform the same price. Stacking them adds redundancy, not new evidence.
  - Indicator values describe the past and the present. They are not forecasts.
  - Changing a parameter changes the conclusion. That is why parameters must be fixed before testing (T5.10, T7.6).
- **Worked example (rupees):** Closes: Rs 100, 102, 104, 103, 105. The simple five-day average is (100 + 102 + 104 + 103 + 105) divided by 5 = Rs 102.80. The latest close is Rs 105, which is Rs 2.20 above the average. The average is a summary of the last five days, not a prediction of the sixth.
- **Visual / animation / simulator:** indicator-playground. The reader changes the window length and watches the line lag or lead the price.
- **Guided exercise:** Closes 100, 102, 104. Compute the three-day average. Hints: (1) sum the three closes; (2) divide by 3. Expected: Rs 102.00.
- **Independent exercise:** Explain in three sentences why an indicator built only from closes cannot know tomorrow's close.
- **Quiz focus:** no new information; lagging; scenario: an indicator crossing a line "predicts" a rise (wrong); spot the mistake: calling an indicator value a forecast. Common wrong answers: indicators are independent evidence; a longer window is always more accurate.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. List the indicators on your demo chart with their parameters, and record the defaults [VERIFY: Kite defaults].
- **Labs used:** none
- **Safety / capital-first note:** No indicator makes a trade good or reduces the need for a stop and sizing rule.
- **Time-sensitive facts to register:** Kite indicator list and default parameters [VERIFY: Kite chart help].
- **Sources to cite:** Zerodha Varsity, technical indicators overview (reference only); Kite chart help [VERIFY: title]; standard technical-analysis texts (owner to select).
- **Estimated length:** short

### T5.2 Moving averages: SMA and EMA
- **Page type:** Math/Calculator
- **Prerequisites:** T5.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute an N-day simple moving average (SMA); (2) update an exponential moving average (EMA) using the smoothing factor 2 divided by (N plus 1); (3) explain why the EMA reacts faster than an SMA of the same length; (4) list the main limits: lag and whipsaw in ranges.
- **Key ideas to teach (in order):**
  - SMA = the sum of the last N closes divided by N.
  - Rolling update: new SMA = old SMA plus (today's close minus the close N days ago) divided by N.
  - EMA smoothing factor k = 2 divided by (N plus 1).
  - EMA update: today's EMA = k times today's close plus (1 minus k) times yesterday's EMA. In words: move a fraction k of the way from yesterday's EMA towards today's close.
  - Seeding: the first EMA is often set equal to the first SMA. This is a convention and changes early values.
  - Lag: an N-day SMA lags a steady trend by about (N minus 1) divided by 2 days (a rule of thumb).
  - Crossovers (for example a short average above a long one) are used as trend heuristics. Their predictive value is contested and must be tested (Lab 4).
- **Worked example (rupees):** Five-day SMA of closes 100, 102, 104, 103, 105: sum 514, divided by 5 = Rs 102.80. Next close Rs 107. Rolling update: 102.80 plus (107 minus 100) divided by 5 = Rs 104.20. Check directly: 102, 104, 103, 105, 107 sum to 521, divided by 5 = Rs 104.20.
  EMA with N = 5: k = 2 divided by 6 = 0.3333. Yesterday's EMA Rs 102.80 (seeded by SMA). Today's close Rs 110. EMA = 102.80 plus 0.3333 times (110 minus 102.80) = 102.80 plus 2.40 = Rs 105.20.
- **Visual / animation / simulator:** indicator-playground with SMA and EMA overlays on the same synthetic series, and a toggle for the seed convention.
- **Guided exercise:** Three-day SMA of closes 50, 51, 53, then a rolling update when the next close is 56. Hints: (1) first SMA is (50 plus 51 plus 53) divided by 3; (2) new SMA = old plus (56 minus 50) divided by 3. Expected: first SMA Rs 51.33 (rounded); updated Rs 53.33 (rounded).
- **Independent exercise:** Nine-day EMA (k = 0.2). Yesterday's EMA Rs 500, today's close Rs 510. Compute today's EMA. Expected: Rs 502.00.
- **Quiz focus:** formula errors; lag; scenario: a moving-average crossover marked as a sure signal (wrong); spot the mistake: using the wrong smoothing constant. Common wrong answers: EMA is always above SMA; an SMA reacts faster than an EMA of the same length.
- **Paper task (journal/Kite demo/lab):** Mode kite_demo. On one stock's daily chart, compare a 20-period SMA and EMA and record which one turned first at two turning points. Log as a learning note.
- **Labs used:** Lab 4 (testing crossover rules, later)
- **Safety / capital-first note:** Crossovers produce many flips in ranges. Each flip costs money (Lab 2) and can hit a stop. Never present a crossover as a profit method in this book.
- **Time-sensitive facts to register:** none (the formulas are conventions). Kite default moving-average types [VERIFY: Kite chart help].
- **Sources to cite:** Zerodha Varsity, moving averages module (reference only); standard technical-analysis texts (owner to select).
- **Estimated length:** medium

### T5.3 ATR and volatility, used for stops
- **Page type:** Math/Calculator
- **Prerequisites:** T5.2, T2.4, T2.5
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute the true range of a bar, including a gap; (2) compute ATR with Wilder smoothing; (3) convert ATR into a stop distance and then into shares with Lab 1; (4) explain why an ATR stop is not a guarantee of loss size.
- **Key ideas to teach (in order):**
  - True range (TR) for a bar = the largest of: high minus low; the absolute value of high minus yesterday's close; the absolute value of low minus yesterday's close. TR captures gaps.
  - ATR over N bars is an average of TR. Wilder smoothing: ATR today = (ATR yesterday times (N minus 1) plus TR today) divided by N. Seed: the average of the first N TR values (a common convention).
  - ATR is in rupees per share. As a percent of price it can be compared across stocks.
  - A stop distance can be a multiple k of ATR. The multiple is a design choice to be tested (T6.4).
  - Wider ATR gives a wider stop, which gives fewer shares for the same risk budget.
  - ATR does not cover unusual gaps beyond normal volatility (T3.6).
- **Worked example (rupees):** Bars: day 2 high 106, low 102, previous close 103: TR = max(4, 3, 1) = 4. Day 3 high 108, low 103, previous close 104: TR = max(5, 4, 1) = 5. Day 4 high 107, low 104, previous close 107: TR = max(3, 0, 3) = 3. Seed ATR(3) = (4 plus 5 plus 3) divided by 3 = 4.00. Day 5 high 110, low 106, previous close 105: TR = max(4, 5, 1) = 5. Wilder ATR = (4.00 times 2 plus 5) divided by 3 = 4.33.
  Stop distance with k = 2: 2 times 4.33 = Rs 8.66. Entry Rs 250, stop Rs 241.34. Capital Rs 50,000, risk budget Rs 500. Raw shares = 500 divided by 8.66 = 57 (rounded down). Cash cap 200. Concentration cap 50 (Rs 12,500 divided by Rs 250). Final shares 50, concentration binding. Planned loss = 50 times 8.66 = Rs 433, below budget because the cap binds.
- **Visual / animation / simulator:** position-size-viz (stop distance against shares) and lab-position-size.
- **Guided exercise:** Bar with high Rs 300, low Rs 292, previous close Rs 305. Compute TR. Hints: (1) high minus low = 8; (2) high minus previous close = 5; (3) low minus previous close = 13 in absolute value. Expected: TR Rs 13.
- **Independent exercise:** ATR is Rs 6.00 on a Rs 400 stock; the stop multiple is 2.5. Compute stop distance, stop price, and shares for a Rs 500 risk budget. Expected: distance Rs 15, stop Rs 385, raw shares 33; cash cap 125; concentration cap (Rs 12,500 divided by Rs 400) 31; final 31 shares, concentration binding.
- **Quiz focus:** true range including gaps; ATR is not a maximum; scenario: a tighter stop means a bigger position with the same budget (wrong); spot the mistake: reading ATR as a percent. Common wrong answers: ATR is the daily range average (ignores gaps); narrower stops always reduce risk.
- **Paper task (journal/Kite demo/lab):** Mode paper. For five stocks, compute ATR(14) from a 20-bar sample you copy by hand, and compare with the platform value [VERIFY: Kite ATR default].
- **Labs used:** Lab 1 (sizing from ATR stop); Lab 4 (ATR-based stops and slippage option)
- **Safety / capital-first note:** An ATR stop can be too tight for normal noise or too wide to fit the budget. The budget rule still decides the size. ATR cannot protect against gaps.
- **Time-sensitive facts to register:** none (formulas); Kite ATR default [VERIFY].
- **Sources to cite:** J. Welles Wilder, New Concepts in Technical Trading Systems (1978), origin of ATR and Wilder smoothing; Zerodha Varsity, volatility module (reference only).
- **Estimated length:** long

### T5.4 RSI (Relative Strength Index)
- **Page type:** Math/Calculator
- **Prerequisites:** T5.2, T5.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute price changes, average gains and average losses for a window; (2) compute RS and RSI; (3) explain why 70 and 30 are conventions rather than rules; (4) describe the limit that RSI can stay high or low for long periods in strong trends.
- **Key ideas to teach (in order):**
  - Change = today's close minus yesterday's close. A gain is a positive change; a loss is the size of a negative change, as a positive number.
  - Average gain and average loss over N periods (N = 14 is a common convention). Wilder smoothing is used after the first average.
  - RS = average gain divided by average loss.
  - RSI = 100 minus 100 divided by (1 plus RS). Range 0 to 100.
  - 70 and 30 are conventional reference levels. They are not signals.
  - Divergence (price and RSI moving differently) is a heuristic, not an established edge.
  - RSI describes momentum over a window. In a strong trend it can stay above 70 for long periods.
- **Worked example (rupees):** Four-period RSI. Closes 100, 102, 103, 100, 102. Changes: +2, +1, minus 3, +2. Gains total 5, average gain 5 divided by 4 = 1.25. Losses total 3, average loss 3 divided by 4 = 0.75. RS = 1.25 divided by 0.75 = 1.6667. RSI = 100 minus 100 divided by 2.6667 = 100 minus 37.5 = 62.5.
- **Visual / animation / simulator:** indicator-playground with an RSI pane and a toggle for the reference levels.
- **Guided exercise:** Changes +1, minus 1, +2, minus 2. Compute RSI for a four-period window. Hints: (1) gains total 3, average 0.75; (2) losses total 3, average 0.75; (3) RS = 1. Expected: RSI 50.
- **Independent exercise:** Changes +3, +1, minus 1, minus 2. Compute RSI. Expected: average gain 1.00, average loss 0.75, RS 1.3333, RSI 57.14.
- **Quiz focus:** formula; scenario: RSI above 70 in a strong uptrend, and the reader sells because it is "overbought" (a common mistake); spot the mistake: averaging gains by the number of up days only. Common wrong answers: 70 means sell; RSI measures price level rather than momentum.
- **Paper task (journal/Kite demo/lab):** Mode paper. For 10 stocks, record RSI at a fixed time each week. Do not draw conclusions from the weekly reads; these are for learning the calculation.
- **Labs used:** Lab 4 (testing RSI rules, later)
- **Safety / capital-first note:** Threshold rules such as "buy below 30" are hypotheses to test with costs and out-of-sample data. They are not facts.
- **Time-sensitive facts to register:** Kite RSI default period [VERIFY: Kite chart help].
- **Sources to cite:** J. Welles Wilder (1978), origin of RSI; Zerodha Varsity, RSI module (reference only).
- **Estimated length:** medium

### T5.5 MACD
- **Page type:** Math/Calculator
- **Prerequisites:** T5.2, T5.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute the MACD line from two EMAs; (2) compute the signal line and histogram; (3) identify a crossover from given values; (4) explain why MACD lags and whipsaws in ranges.
- **Key ideas to teach (in order):**
  - MACD line = EMA(12) minus EMA(26). The 12 and 26 are conventional periods.
  - Signal line = EMA(9) of the MACD line.
  - Histogram = MACD line minus signal line. Positive means the MACD line is above the signal line.
  - A crossover is a sign change of the histogram. It is a heuristic, not a proven signal.
  - MACD sits on two EMAs, so it inherits their lag.
  - In a range the lines cross often, producing whipsaw.
- **Worked example (rupees):** Illustrative EMA(12) = Rs 105.00 and EMA(26) = Rs 102.00. MACD = 105.00 minus 102.00 = 3.00. Signal = EMA(9) of MACD, given as 2.40. Histogram = 3.00 minus 2.40 = 0.60, positive. Yesterday: MACD 2.20, signal 2.30, histogram minus 0.10. Today's histogram changed sign, which is a crossover. The EMA inputs are illustrative; a reader computes real ones with a spreadsheet using the T5.2 method.
- **Visual / animation / simulator:** indicator-playground with the MACD pane and histogram bars.
- **Guided exercise:** EMA(12) Rs 98.40 and EMA(26) Rs 100.10 with signal Rs minus 1.20. Compute MACD and histogram. Hints: (1) MACD = 98.40 minus 100.10; (2) histogram = MACD minus signal. Expected: MACD minus 1.70; histogram minus 0.50.
- **Independent exercise:** Yesterday MACD 1.10 and signal 1.30; today MACD 1.60 and signal 1.40. Find the histogram each day and state whether a sign change occurred. Expected: yesterday minus 0.20, today plus 0.20, sign change yes.
- **Quiz focus:** histogram sign; scenario: a crossover in a sideways market; spot the mistake: "MACD above zero means buy". Common wrong answers: histogram equals MACD; signal line is the price.
- **Paper task (journal/Kite demo/lab):** Mode paper. Log five crossovers on 5 stocks with the date and the subsequent 5-day move. Label as hindsight. Do not compute a success rate from five events.
- **Labs used:** Lab 4 (testing MACD rules, later)
- **Safety / capital-first note:** Each crossover is a potential trade with its own costs. Crossovers do not remove the need for a stop and budget.
- **Time-sensitive facts to register:** Kite MACD parameters [VERIFY: Kite chart help].
- **Sources to cite:** Gerald Appel (originator of MACD, as recorded in standard texts); Zerodha Varsity, MACD module (reference only).
- **Estimated length:** medium

### T5.6 Bollinger Bands
- **Page type:** Math/Calculator
- **Prerequisites:** T5.2, T5.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute middle, upper and lower bands from a window of closes; (2) state the difference between population and sample standard deviation; (3) explain that bands measure dispersion around a mean; (4) explain why touching a band is not a signal on its own.
- **Key ideas to teach (in order):**
  - Middle band = N-period SMA (N = 20 is a common convention).
  - Standard deviation (SD) of the same closes measures how spread out they are.
  - Upper band = middle plus k times SD; lower band = middle minus k times SD. k = 2 is a common convention.
  - Population SD divides the sum of squared deviations by N; sample SD divides by N minus 1. Tools differ [VERIFY: Kite convention].
  - Band width grows when volatility grows.
  - Price touching a band is an observation. Whether it means reversal or continuation is a hypothesis to test.
- **Worked example (rupees):** Closes 100, 102, 104, 103, 105 (N = 5 for hand checking). Mean = 102.80. Deviations: minus 2.80, minus 0.80, plus 1.20, plus 0.20, plus 2.20. Squares: 7.84, 0.64, 1.44, 0.04, 4.84; total 14.80. Population variance = 14.80 divided by 5 = 2.96; SD = 1.72. With k = 2: plus or minus 3.44. Upper band Rs 106.24; lower band Rs 99.36.
  Sample version: variance 14.80 divided by 4 = 3.70; SD 1.92; plus or minus 3.85; upper Rs 106.65; lower Rs 98.95.
- **Visual / animation / simulator:** indicator-playground with a population and sample toggle, showing how the bands change.
- **Guided exercise:** Closes 10, 12, 14 (N = 3, population). Compute the middle, SD and bands with k = 2. Hints: (1) mean is 12; (2) squared deviations are 4, 0, 4 with total 8; (3) variance = 8 divided by 3. Expected: SD 1.63; bands Rs 8.73 and Rs 15.27.
- **Independent exercise:** Closes 200, 204, 196, 200 (N = 4, population). Compute upper and lower bands with k = 2. Expected: SD 2.83; upper Rs 205.66; lower Rs 194.34.
- **Quiz focus:** SD convention; scenario: price closes above the upper band and the reader sells "because it is overbought" (unsupported); spot the mistake: treating the middle band as support without test. Common wrong answers: bands are fixed price levels; a band touch is a guaranteed reversal.
- **Paper task (journal/Kite demo/lab):** Mode paper. For five stocks, record weekly whether the close was outside the bands, and the band width. Learning log only.
- **Labs used:** Lab 4 (testing band rules, later)
- **Safety / capital-first note:** Band-based rules are hypotheses. Trending markets can walk along a band for long periods.
- **Time-sensitive facts to register:** Kite Bollinger defaults and SD convention [VERIFY: Kite chart help].
- **Sources to cite:** John Bollinger, Bollinger on Bollinger Bands (originator's book); Zerodha Varsity, Bollinger module (reference only).
- **Estimated length:** medium

### T5.7 Fibonacci retracement and the evidence debate
- **Page type:** Math/Calculator
- **Prerequisites:** T3.4, T5.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute retracement levels in rupees from a swing low and swing high; (2) state which ratios are conventions and which are loosely linked to the Fibonacci sequence; (3) explain why swing selection makes the levels subjective; (4) describe the evidence as contested.
- **Key ideas to teach (in order):**
  - Retracement level (uptrend) = swing high minus ratio times (swing high minus swing low).
  - Common ratios: 23.6, 38.2, 50, 61.8 and 78.6 percent. The 50 percent level is not a Fibonacci ratio in the strict sense; it is a convention. Label it so.
  - The ratios come from the Fibonacci sequence only loosely. Do not present the link as proof.
  - Choosing the swing high and low is a judgement. Different choices give different levels.
  - Traders watching the same levels is a plausible but untested explanation (hypothesis).
  - Evidence is contested. Treat levels as zones and cross-check with support and resistance (T3.3).
- **Worked example (rupees):** Swing low Rs 200, swing high Rs 260, range Rs 60. Levels: 23.6 percent = 260 minus 14.16 = Rs 245.84; 38.2 percent = 260 minus 22.92 = Rs 237.08; 50 percent = Rs 230.00; 61.8 percent = 260 minus 37.08 = Rs 222.92; 78.6 percent = 260 minus 47.16 = Rs 212.84.
- **Visual / animation / simulator:** sr-drawing-exercise with a Fibonacci tool; the reader draws the swing and reads the levels.
- **Guided exercise:** Swing low Rs 150, swing high Rs 180. Compute the 23.6 and 61.8 percent levels. Hints: (1) range is 30; (2) 0.236 times 30 = 7.08; (3) 0.618 times 30 = 18.54. Expected: Rs 172.92 and Rs 161.46.
- **Independent exercise:** Repeat with swing low Rs 200 and high Rs 240. Compute the 38.2 percent level and explain in one sentence how a different swing low moves it. Expected: Rs 224.72; a lower swing low moves the level down.
- **Quiz focus:** formula; scenario: a reader says Fibonacci levels "guarantee" a bounce (wrong); spot the mistake: using a price below the swing low as the high. Common wrong answers: the 50 percent level is a Fibonacci number; levels are exact prices.
- **Paper task (journal/Kite demo/lab):** Mode paper. Draw levels on five charts before looking at later prices, then record whether price reacted at a level. Learning log only.
- **Labs used:** Lab 4 (testing, later)
- **Safety / capital-first note:** Subjective levels make the rule hard to test and easy to fit to the past. Do not use a Fibonacci level as an exact stop without a tested rule.
- **Time-sensitive facts to register:** none (formulas); Kite Fibonacci tool availability [VERIFY: Kite chart tools].
- **Sources to cite:** Zerodha Varsity, Fibonacci module (reference only); academic reviews of technical-level evidence (owner to select).
- **Estimated length:** medium

### T5.8 Volume indicators and VWAP (VWAP optional, intraday)
- **Page type:** Math/Calculator
- **Prerequisites:** T3.7, T5.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute on-balance volume (OBV) changes and a running total; (2) compute relative volume; (3) compute VWAP for a session from typical price and volume; (4) explain why VWAP is session-based and optional for this book.
- **Key ideas to teach (in order):**
  - OBV: add the day's volume if the close is higher than the previous close, subtract it if lower, and leave the total unchanged if equal. The total is a running sum.
  - Relative volume: T3.7.
  - Typical price = (high plus low plus close) divided by 3.
  - VWAP = sum of (typical price times volume) divided by sum of volume, accumulated from the start of the session.
  - VWAP resets each session. A daily-chart VWAP is not the same measure [VERIFY: Kite VWAP definition].
  - VWAP is widely used as a reference level. Its predictive value is not established. The book uses it only in the optional intraday module, paper-only.
- **Worked example (rupees):** OBV from closes 100 (volume 10,000), 103 (volume 20,000), 101 (volume 5,000), starting at 0. Day 2 close higher: plus 20,000. Day 3 close lower: minus 5,000. OBV = 15,000.
  VWAP for three bars: bar 1 typical price Rs 100.00, volume 10,000; bar 2 typical price Rs 102.33, volume 20,000; bar 3 typical price Rs 102.33, volume 5,000. Sum of price times volume = 1,000,000 plus 2,046,667 plus 511,667 = 3,558,333. Total volume 35,000. VWAP = Rs 101.67.
- **Visual / animation / simulator:** indicator-playground with a volume pane, an OBV line and a VWAP overlay toggle that resets at session start.
- **Guided exercise:** Two bars: typical price Rs 200 with volume 1,000, then Rs 206 with volume 3,000. Compute VWAP. Hints: (1) multiply each by its volume; (2) add; (3) divide by total volume. Expected: Rs 204.50.
- **Independent exercise:** OBV starts at 50,000. Closes: up on 10,000, down on 4,000, unchanged on 8,000. Compute the final OBV. Expected: 56,000.
- **Quiz focus:** OBV rules; VWAP reset; scenario: a daily-chart VWAP used as an intraday level (confused definitions); spot the mistake: adding volume on a down day. Common wrong answers: VWAP is a moving average of closes; OBV measures price.
- **Paper task (journal/Kite demo/lab):** Mode paper. Record relative volume on 10 sessions and, only if Kite offers intraday VWAP in the demo, note its reset time [VERIFY].
- **Labs used:** none
- **Safety / capital-first note:** VWAP is for the optional intraday module and is not used for swing decisions. Intraday exposure is a higher-risk style (T6.5).
- **Time-sensitive facts to register:** Kite VWAP and OBV availability and definitions [VERIFY: Kite chart help]. NSE session start and end times [VERIFY: NSE market timings].
- **Sources to cite:** Zerodha Varsity, volume indicators (reference only); NSE India, market timings page.
- **Estimated length:** medium

### T5.9 Multiple timeframe analysis
- **Page type:** Concept
- **Prerequisites:** T3.2, T5.2, T5.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) build a weekly candle from five daily candles; (2) write a higher-timeframe filter as a rule; (3) explain how a daily pullback is read against a weekly trend; (4) explain why each added timeframe adds parameters and overfitting risk.
- **Key ideas to teach (in order):**
  - Aggregation rules from T3.2 apply: open from the first day, close from the last, high and low from the extremes.
  - Filter then trigger: a higher-timeframe rule decides whether trades are allowed; a lower-timeframe rule decides when.
  - Keep to two timeframes, defined before testing.
  - Each added timeframe and indicator adds parameters. More parameters make it easier to fit the past.
  - Holiday weeks have fewer daily bars. Weekly aggregation must handle this [VERIFY: NSE holiday list].
- **Worked example (rupees):** Five daily candles. Mon: open 290, high 296, low 288, close 294. Tue: 294, 301, 293, 299. Wed: 299, 300, 292, 293. Thu: 293, 297, 290, 291. Fri: 291, 298, 289, 296. Weekly candle: open 290, high 301, low 288, close 296. Bullish, because 296 is above 290. Check: highs 296, 301, 300, 297, 298 give 301; lows 288, 293, 292, 290, 289 give 288.
  Hypothetical filter: weekly close Rs 296 above a 10-week SMA of Rs 285 (illustrative) passes. Daily trigger: a pullback to Rs 291, near a 20-day SMA of Rs 290 (illustrative).
- **Visual / animation / simulator:** candle-builder with a weekly and daily toggle on the same synthetic data.
- **Guided exercise:** Aggregate the five daily candles above into one weekly candle and confirm the bullish label. Hints: (1) first open; (2) highest of five highs; (3) lowest of five lows; (4) last close.
- **Independent exercise:** Five daily candles where the weekly close is Rs 280 and the weekly 10-week SMA is Rs 285. State whether the illustrative filter passes and why the daily pullback is then not read.
- **Quiz focus:** aggregation; overfitting with many timeframes; scenario: a trader adds four timeframes to find agreement; spot the mistake: taking the weekly high from the last day only. Common wrong answers: more timeframes means more evidence; the weekly candle equals the Friday candle.
- **Paper task (journal/Kite demo/lab):** Mode paper. Keep a two-timeframe view for five stocks for four weeks and record the filter decision each week, in a learning log.
- **Labs used:** Lab 4 (testing a filter, later)
- **Safety / capital-first note:** A higher-timeframe filter does not remove the risk of the trade. Stops and sizing still apply. Avoid analysis paralysis by fixing the framework in advance.
- **Time-sensitive facts to register:** Trading holidays and shortened sessions [VERIFY: NSE holiday list]. Kite interval availability [VERIFY].
- **Sources to cite:** Zerodha Varsity, multiple timeframe material (reference only); Kite chart help [VERIFY].
- **Estimated length:** medium

### T5.10 Indicator playground and when indicators disagree
- **Page type:** Concept
- **Prerequisites:** T5.1 to T5.9
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) predict how an output changes when one parameter changes, then check it in the playground; (2) identify redundant indicators that transform the same price; (3) write a tie-break rule for disagreement before looking at the data; (4) explain why adjusting parameters until a past result looks good is overfitting.
- **Key ideas to teach (in order):**
  - Indicators are often redundant. Two momentum indicators built from closes will agree most of the time for that reason.
  - Disagreement is normal. Decide in advance which indicator, if any, decides.
  - Changing parameters after seeing outcomes is the most common self-deception (T7.6).
  - The playground is for understanding how a formula responds, not for finding the best setting.
  - Trade decisions still need the stop and sizing rules, even when all indicators agree.
- **Worked example (rupees):** On one date: close Rs 250; 20-day SMA Rs 248 (price above); RSI 72 (above the conventional 70 reference); MACD histogram positive; upper Bollinger band Rs 255. Three readings lean up and one reads overbought. Under a pre-written rule that uses only the breakout condition from T6.4, the RSI reading is ignored and the result depends on the breakout test, not on the count of indicators. Illustrative only.
  Parameter sensitivity: the same date gives a 10-day SMA of Rs 252, a 20-day SMA of Rs 248 and a 50-day SMA of Rs 240. All are below the close, so this one reads as above-trend. A different date could flip the 10-day result; that sensitivity is why parameters are fixed before testing.
- **Visual / animation / simulator:** indicator-playground with several parameter sliders and a "predict, then reveal" mode.
- **Guided exercise:** Predict whether a 10-day SMA is above or below the close when the close rises sharply for three days. Check in the playground. Hints: (1) a short average reacts faster; (2) after a sharp rise, the short average is pulled up quickly. Expected: the 10-day SMA is pulled up but usually stays below the latest close.
- **Independent exercise:** Write a one-paragraph tie-break rule that uses at most two indicators and states what happens when they disagree.
- **Quiz focus:** redundancy; overfitting; scenario: the reader changes the period until a past trade looks profitable; spot the mistake: counting three indicators as three independent confirmations. Common wrong answers: more indicators means more evidence; disagreement means the data is wrong.
- **Paper task (journal/Kite demo/lab):** Mode paper. Log 10 days where two chosen indicators disagree, with the tie-break rule written before the day, and the outcome recorded later as a learning note.
- **Labs used:** Lab 4 (parameter grid demo, overfitting, later)
- **Safety / capital-first note:** Parameter tuning on past data is the main way to fool yourself. Fix parameters before testing, and record every combination tried (T7.6).
- **Time-sensitive facts to register:** none
- **Sources to cite:** the sources of T5.1 to T5.9; overfitting references in Track 7 (owner to select).
- **Estimated length:** medium

---

## Track 6: Strategy

**Purpose.** Define what a strategy is, how to specify one so that it can be tested, and why most approaches fail. Give one fully specified trend-following swing strategy, labelled illustrative and not a recommendation.
**Order.** Styles compared against the owner's goals, what an edge is, trend following, the swing specification, dangerous approaches, the strategy simulator, and when to not trade.
**How it serves the goals.** Matches the owner's style (end-of-day swing and positional, fixed loss per trade, trailing stop, no profit cap) and applies the owner's rules: no leverage, no averaging down, no martingale, no daily target as a goal, and no trade when the rules do not say trade.

**Global rule for Track 6.** No strategy in this track is presented as profitable. Every number is hypothetical. Results are labelled "hypothetical", "backtested" or "live" as appropriate, and only hypothetical numbers appear in this track. Scores in T6.1 are the book's judgement against the owner's stated criteria, not market evidence.

### T6.1 Investing, trading, speculation and styles compared
- **Page type:** Concept
- **Prerequisites:** T0.1, T2.1, T2.16
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) define investing, trading and speculation by purpose and holding period; (2) compare eight styles on holding period, monitoring need, capital needs and risk per trade; (3) score each style against the owner's criteria with a reason; (4) explain why the book's focus is end-of-day swing and positional trading.
- **Key ideas to teach (in order):**
  - Investing: ownership of a business for a long horizon; returns depend on business and market over time.
  - Trading: shorter horizons with explicit entry, exit and risk rules.
  - Speculation: a bet on a price move where the outcome is not tied to analysis you can test. The line is blurry; say so.
  - Styles: intraday, swing, positional, momentum, breakout, trend following, reversal, price action.
  - Owner criteria (from the owner's brief): capital preservation, no daily target as a goal, no need to watch the market constantly, fixed loss per trade, no leverage, robustness across conditions, clear downside.
  - Scoring is judgement. Mark each score with its reason.
- **Worked example (rupees):** Same Rs 50,000 account. An intraday style may generate many round trips a day; each round trip has a cost (Lab 2 [VERIFY]). Illustrative placeholder: if a round trip costs Rs 50 on a Rs 12,500 position, the cost is 0.4 percent of the position per round trip (50 divided by 12,500). Ten such trades cost Rs 500, which is 1 percent of capital before any profit or loss. A swing style with one round trip a fortnight incurs far fewer. Illustrative only.
- **Visual / animation / simulator:** none needed; a comparison table with a legend. No new component.
- **Guided exercise:** Classify five examples (buy and hold a business for years; buy before a results date and sell the next day; hold for three weeks on a breakout; a daily target bet; a multi-year allocation) as investing, trading or speculation. Hints: (1) holding period; (2) whether there is a testable rule; (3) whether the outcome depends on analysis. Give a reason for each.
- **Independent exercise:** Score three styles against the five owner criteria, one line of reason per cell, and state which style does not fit and why.
- **Quiz focus:** classification; scenario: a trader aims to earn Rs 2,500 every day from a Rs 50,000 account (flag as unrealistic against T2.16); spot the mistake: calling every short-term trade "trading" with no rule. Common wrong answers: investing means no risk; intraday is always the most profitable style.
- **Paper task (journal/Kite demo/lab):** Mode paper. Write a learning note on which style you would consider and why, and list what would make you reject it.
- **Labs used:** Lab 3 (learning note)
- **Safety / capital-first note:** No style is shown as profitable. The table is not evidence of any style's results. Speculation is named as a risk, not a method.
- **Time-sensitive facts to register:** Tax treatment differences between intraday and delivery gains [VERIFY: T2.3 facts]. Charges by product [VERIFY: Zerodha charges page].
- **Sources to cite:** SEBI investor education material (names: investor awareness pages); Zerodha Varsity, trading styles (reference only).
- **Estimated length:** long

### T6.2 What a trading edge is; hypothesis, entry, exit, sizing
- **Page type:** Concept
- **Prerequisites:** T6.1, T2.7, T2.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) write a testable hypothesis; (2) define entry, exit, stop and sizing rules that another person could execute; (3) compute expectancy in R from win rate and payoff; (4) explain why an edge must be measured after costs and out of sample.
- **Key ideas to teach (in order):**
  - An edge is a positive expected result per trade after costs, measured over a sample. It is a hypothesis until measured.
  - Hypothesis form: "If condition X occurs, the average trade result in R will be positive over N trades, measured on data not used to design the rule."
  - Four decisions: entry, exit (including stop), sizing, and filters.
  - Expectancy in R = (win rate times average win in R) minus (loss rate times average loss in R). Costs reduce it.
  - Sample size matters. Small samples cannot distinguish skill from luck.
  - The book does not assume the reader has an edge.
- **Worked example (rupees):** Hypothetical strategy: win rate 40 percent, average win 2R, average loss 1R. Expectancy = 0.40 times 2 minus 0.60 times 1 = 0.20R per trade. With R = Rs 500 (planned risk), expectancy = Rs 100 per trade before costs. If a round trip costs Rs 50 (illustrative placeholder, replace with the Lab 2 figure), expectancy after costs = Rs 50 per trade. Hypothetical only.
- **Visual / animation / simulator:** strategy-simulator used in step mode to show how entry, stop and exit rules are read bar by bar.
- **Guided exercise:** Win rate 30 percent, average win 3R, average loss 1R. Compute expectancy. Hints: (1) 0.30 times 3; (2) 0.70 times 1; (3) subtract. Expected: 0.20R.
- **Independent exercise:** Write a hypothesis and four rule definitions (entry, exit, stop, sizing) for a breakout idea. Do not state any expected profit.
- **Quiz focus:** hypothesis form; expectancy formula; scenario: a rule won 8 of its last 10 trades, so it has an edge (wrong); spot the mistake: designing and testing on the same data. Common wrong answers: a high win rate means positive expectancy; costs do not matter at small size.
- **Paper task (journal/Kite demo/lab):** Mode paper. Write one hypothesis and its planned fields in Lab 3 (mode paper), with no profit target.
- **Labs used:** Lab 3 (planned fields); Lab 4 and Lab 5 later
- **Safety / capital-first note:** An unmeasured edge is a belief. Name the test that would show you are wrong before you run it.
- **Time-sensitive facts to register:** none
- **Sources to cite:** Zerodha Varsity, expectancy and systems material (reference only); peer-reviewed material on backtesting and selection bias (owner to select).
- **Estimated length:** medium

### T6.3 Trend following in depth: fixed loss, trailing stop, low win rate, long dry spells
- **Page type:** Strategy
- **Prerequisites:** T6.2, T3.4, T5.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) explain why a fixed-R loss with a trailing stop produces many small losses and few larger wins; (2) compute net R and rupees for a hypothetical sequence; (3) compute the cost of a losing run in rupees at a fixed risk; (4) explain long dry spells and why they are the moment to keep rules unchanged.
- **Key ideas to teach (in order):**
  - Trend following accepts frequent losses and aims for fewer, larger winners. It has no fixed profit cap in the owner's style, but it does have a loss cap per trade.
  - A fixed-R loss means each trade's planned loss is the same rupee amount (for example Rs 500).
  - A trailing stop moves up as price rises and never moves down. It is an exit, not a profit target.
  - Win rate can be low (for example 35 percent) and expectancy still positive, if the average win is large relative to the average loss. This is a hypothesis to test.
  - Long dry spells: months with no winner, or many small losses. These are normal in the design and the most dangerous time to change rules or raise size.
  - Sample size: a few dozen trades cannot show whether the method works.
- **Worked example (rupees):** Hypothetical 20 trades at 1R = Rs 500. Seven wins average +3R (Rs 1,500 each): total Rs 10,500. Thirteen losses at -1R (Rs 500 each): total Rs 6,500. Net gross = Rs 4,000, which is 8R. Win rate 35 percent. Expectancy = 0.35 times 3 minus 0.65 times 1 = 0.40R, or Rs 200 per trade. A run of 10 consecutive losses costs 10 times Rs 500 = Rs 5,000. All before costs and taxes. Hypothetical.
- **Visual / animation / simulator:** strategy-simulator with a trailing-stop mode; streak-sim to show losing runs at a given win rate and R.
- **Guided exercise:** Five wins at +2R and ten losses at -1R. Compute net R and rupees at R = Rs 500. Hints: (1) wins total 10R; (2) losses total 10R; (3) subtract. Expected: net 0R, Rs 0 gross.
- **Independent exercise:** Forty hypothetical trades, win rate 30 percent, average win 3R, at R = Rs 500. Compute expectancy in R, expectancy in rupees per trade, and total gross. Expected: 0.20R, Rs 100 per trade, Rs 4,000 gross.
- **Quiz focus:** low win rate; trailing stop; scenario: a trader abandons the rules after eight losses in a row; spot the mistake: "a trailing stop means I cannot lose". Common wrong answers: no profit cap means no loss cap; a high win rate is needed for the method to work.
- **Paper task (journal/Kite demo/lab):** Mode paper. Build 10 hypothetical trades from chart history with the rules written first, record R results, and label the set as hypothetical.
- **Labs used:** Lab 4 (trade-order Monte Carlo and streak view, later); streak-sim
- **Safety / capital-first note:** A low win rate is a psychological test. The rule for dry spells must be written before one starts (T8.6). Do not add capital after losses (owner's rule).
- **Time-sensitive facts to register:** Costs and tax on the trades [VERIFY: T2.2 and T2.3 facts].
- **Sources to cite:** Zerodha Varsity, trend following material (reference only); peer-reviewed work on trend-following performance (owner to select; no figures stated here).
- **Estimated length:** long

### T6.4 The fully specified swing strategy (illustrative, not a recommendation)
- **Page type:** Strategy
- **Prerequisites:** T6.2, T6.3, T5.2, T5.3, T2.5, T2.11, T3.5
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) apply each rule to a given price history and say whether a trade qualifies; (2) compute stop, shares and planned loss; (3) compute the trailing-stop level at a given point; (4) read the strategy specification and identify each rule and its parameter.
- **Key ideas to teach (in order):**
  - This is a rule set to test, not advice. It is labelled illustrative and carries no evidence of performance.
  - Setup: the close is above the highest high of the previous 55 bars (not including the current bar), and the close is above the 50-day SMA.
  - Entry: next day's open after the signal close (the realism rule, see T6.6 and Lab 4).
  - Initial stop: entry minus 2.5 times ATR(14).
  - Exit: trailing stop = highest close since entry minus 3 times ATR(14). It only moves up. A bar that trades below the stop exits at the open if the open is already below, otherwise at the stop.
  - Sizing: 1 percent risk budget; cash cap; concentration cap of 25 percent of capital.
  - Filters (design proposals): minimum price Rs 50; minimum 20-day average traded value Rs 5 crore; at most 4 open positions.
  - No new entries when the daily or weekly loss limit is reached. No leverage. No averaging down.
  - Costs and taxes are included in any result (Lab 2, T2.3).
  - Specification (proposal, expression grammar to be fixed in M5):
    ```
    { "id": "swing_illustrative_v1", "version": "1.0",
      "indicators": [ {"name":"highestHigh","period":55,"exclude_current":true},
                      {"name":"sma","period":50}, {"name":"atr","period":14} ],
      "entry": { "all": [ {"left":"close","op":">","right":"highestHigh55"},
                          {"left":"close","op":">","right":"sma50"} ] },
      "stop": { "type":"atr", "multiple":2.5 },
      "exit": { "type":"trailing_close_atr", "multiple":3 },
      "sizing": { "riskPct":1, "maxPositionPct":25 },
      "filters": { "minPrice":50, "minAvgTurnoverInr":50000000, "maxPositions":4 } }
    ```
    The LABS.md example uses an expression form that is not valid JSON; this structured form is a proposal for the reviewer.
- **Worked example (rupees):** Capital Rs 50,000. Signal close Rs 255 (above the prior 55-bar high and above the 50-day SMA, both assumed to be met). Next open Rs 257, so entry Rs 257. ATR(14) Rs 4.00. Initial stop = 257 minus 10 = Rs 247. Risk per share Rs 10. Raw shares 50. Cash cap floor(50,000 divided by 257) = 194. Concentration cap floor(12,500 divided by 257) = 48. Shares 48. Planned loss = 48 times Rs 10 = Rs 480 (0.96 percent of capital).
  Later, the highest close since entry is Rs 280 and ATR(14) is Rs 5.00. Trailing stop = 280 minus 15 = Rs 265. Exit at Rs 265: gross gain = (265 minus 257) times 48 = Rs 384, which is 0.8R of the Rs 480 planned loss. Before costs and taxes. Hypothetical.
- **Visual / animation / simulator:** strategy-simulator loaded with this specification on synthetic data, with the rule evaluation shown for each bar.
- **Guided exercise:** Entry Rs 300, ATR(14) Rs 6.00, capital Rs 50,000. Compute stop, risk per share, shares and planned loss. Hints: (1) stop = 300 minus 15; (2) raw = 500 divided by 15; (3) check both caps. Expected: stop Rs 285; shares 33 (raw 33, cash cap 166, concentration cap 41); planned loss Rs 495.
- **Independent exercise:** Highest close since entry Rs 320, ATR(14) Rs 4.00. Compute the trailing stop and state whether it can move down on a later bar. Expected: Rs 308; it cannot move down.
- **Quiz focus:** reading the specification; scenario: a bar's high breaks the 55-bar high intraday but closes below it (no setup); spot the mistake: using the current bar in the highest-high calculation; a stop placed at entry without a rule. Common wrong answers: the trailing stop follows the high; the strategy has been validated.
- **Paper task (journal/Kite demo/lab):** Mode paper. Apply the rules to one week of bars in your chart history and journal the planned trades with planned fields (Lab 3). Do not state any profit.
- **Labs used:** Lab 1 (sizing); Lab 3 (journal); Lab 4 (backtest, held-out period); Lab 5 (forward test) later
- **Safety / capital-first note:** This specification is not evidence of profit. Passing a backtest does not show it will work live, and forward testing and live trading differ. The owner decides whether to test it. The book never recommends it or any stock.
- **Time-sensitive facts to register:** Cost and tax inputs [VERIFY: Lab 2 and T2.3 facts]. Circuit-limit handling for gaps [VERIFY: T1.7]. Trading calendar [VERIFY: NSE holiday list]. Filter thresholds are design proposals, not facts.
- **Sources to cite:** Book sources in T5.3 (ATR), T2.5 (sizing); Lab 4 realism contract (LABS.md).
- **Estimated length:** long

### T6.5 Why scalping, intraday, option buying and selling, averaging down and martingale are dangerous
- **Page type:** Math/Calculator
- **Prerequisites:** T6.2, T2.7, T2.9, T2.12, T2.13
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) compute the break-even price move per share after a fixed round-trip cost; (2) compute the gain needed to recover a loss; (3) compute the stake and cumulative loss in a doubling sequence; (4) explain, at theory level, why option buyers and sellers have different loss profiles.
- **Key ideas to teach (in order):**
  - Scalping: small targets and many trades. A fixed cost per round trip is a large share of a small gain.
  - Intraday trading: uses margin in the MIS product (leverage, T2.13) and must close the same day. The book keeps it as a paper-only later module.
  - Averaging down: adding to a losing position increases exposure to the same idea and changes the average price. Recovery needs a larger percentage gain as the loss grows.
  - Martingale (doubling after a loss): stakes grow exponentially, and one long losing run can exceed the account.
  - Options (theory only, T9.2): a buyer's loss is limited to the premium paid; a seller's gain is limited to the premium received, while the seller's loss can be far larger. Premiums, decay and margin are theory here.
  - None of these is a shortcut to the owner's daily target (T2.16).
- **Worked example (rupees):**
  - Scalp: buy 100 shares at Rs 100. Target gross gain Rs 0.10 per share = Rs 10. Assumed round-trip cost Rs 50 (placeholder; replace with the verified Lab 2 figure). Net = minus Rs 40. Break-even move = Rs 50 divided by 100 shares = Rs 0.50 per share, which is 0.5 percent.
  - Averaging down: buy 100 shares at Rs 100 (Rs 10,000). Price falls to Rs 80: loss Rs 2,000 (20 percent). Recovery to Rs 100 needs +25 percent (100 divided by 80, minus 1). Buy 100 more at Rs 80: average price (10,000 plus 8,000) divided by 200 = Rs 90. At Rs 60, loss on 200 shares = (60 minus 90) times 200 = minus Rs 6,000, against Rs 2,000 with one lot.
  - Martingale with base risk Rs 500: stake after k losses = Rs 500 times 2 to the power k. Cumulative loss after five losses = 500 times (1 plus 2 plus 4 plus 8 plus 16) = Rs 15,500. The next stake would be Rs 16,000, which exceeds a Rs 10,000 account and is 32 percent of a Rs 50,000 account.
- **Visual / animation / simulator:** drawdown-compounding (recovery gain after a fall), position-size-viz (stake growth), streak-sim (martingale sequence at a given win rate).
- **Guided exercise:** A 40 percent loss needs what gain to recover? Hints: (1) remaining value is 60 percent; (2) gain needed = 1 divided by 0.6, minus 1. Expected: 66.7 percent.
- **Independent exercise:** Scalp with a Rs 60 round-trip placeholder cost on 200 shares. Compute the break-even move per share and as a percent of Rs 100. Expected: Rs 0.30 per share; 0.3 percent.
- **Quiz focus:** break-even; recovery math; scenario: "averaging down lowers my risk" (wrong); spot the mistake: a doubling sequence that is not capped. Common wrong answers: averaging lowers the break-even without raising exposure; martingale is safe if the win rate is high.
- **Paper task (journal/Kite demo/lab):** Mode paper. Write one learning note per danger with the arithmetic from this chapter, and check each calculation with a calculator.
- **Labs used:** Lab 2 (cost placeholder replaced by verified figure); Lab 4 (cost sensitivity)
- **Safety / capital-first note:** These approaches are excluded from the owner's plan. The book presents them as failure modes to recognise, not as methods to practise.
- **Time-sensitive facts to register:** Intraday and option-related charges, margins and rules [VERIFY: Zerodha charges page; SEBI and exchange margin pages]. SEBI F&O studies (T9.4) [VERIFY]. Option contract details are not given here.
- **Sources to cite:** SEBI studies on intraday and F&O outcomes (names; figures to be verified in T9.4); Zerodha Varsity, risk and position sizing (reference only).
- **Estimated length:** long

### T6.6 Strategy simulator: step through a strategy on synthetic data
- **Page type:** Strategy
- **Prerequisites:** T6.4, T6.2, T4.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) step bar by bar and state the decision at each close; (2) show the next-open fill and its rupee difference from the signal price; (3) detect a gap through a stop and compute the actual loss; (4) explain why a simulator run is not evidence of a result.
- **Key ideas to teach (in order):**
  - The simulator applies the realism rules: decisions on the close of day t, fills at the open of day t plus 1.
  - The trailing stop updates at the close and applies from the next bar.
  - A gap through a stop fills near the open, not at the stop price.
  - The step log is the teaching object: each row shows the bar, the rule results and the action.
  - Synthetic data is labelled as synthetic. Totals shown are for learning and carry the hypothetical banner.
- **Worked example (rupees):** Signal at the close of day t: Rs 255. Day t plus 1 opens at Rs 257, so the entry is Rs 257, a Rs 2 difference per share. With 48 shares, the difference is Rs 96. Later, a gap: stop at Rs 247, day opens at Rs 240. Fill near Rs 240. Actual loss = (257 minus 240) times 48 = Rs 816, against a planned loss of Rs 480, a ratio of 1.7.
- **Visual / animation / simulator:** strategy-simulator with Play, Pause, Step and Reset, and a step-log table showing each bar's values.
- **Guided exercise:** Step through a three-bar synthetic fixture provided in the exercise and write the decision for each bar. Hints: (1) evaluate the rules on the close; (2) the entry is the next open; (3) update the trailing stop after the close. The fixture bars are to be supplied by the reviewer (see open questions).
- **Independent exercise:** On a new synthetic fixture, produce the full trade log and state planned and actual loss for any stopped trade.
- **Quiz focus:** fill timing; gap; scenario: a trader enters at the signal close; spot the mistake: a stop filled at the stop price after a gap. Common wrong answers: entries at the signal close; trailing stops that move down.
- **Paper task (journal/Kite demo/lab):** Mode paper. Run the simulator on a fixture and record the trade log as a learning note. Export only with the hypothetical label.
- **Labs used:** Lab 4 (engine parity, later)
- **Safety / capital-first note:** A simulator result is fiction with rules. It must not be read as the strategy's performance. Show the banner on every results view.
- **Time-sensitive facts to register:** Circuit-limit fill assumptions [VERIFY: T1.7]. Costs [VERIFY: Lab 2 facts].
- **Sources to cite:** LABS.md Lab 4 realism contract; T3.6 for gaps.
- **Estimated length:** medium

### T6.7 Choosing no-trade: when not to trade
- **Page type:** Concept
- **Prerequisites:** T6.4, T2.11, T2.12
- **Learning objectives (measurable, 3-5):** After this chapter the reader can (1) list no-trade conditions in each category (market, account, data, personal, plan); (2) decide trade or no-trade for given scenarios and give the rule that decides; (3) explain why a no-trade day counts as a compliant day against the owner's goals; (4) state the rule that stops trading after a limit breach.
- **Key ideas to teach (in order):**
  - No-trade conditions are written in advance, as a list with rules, not decided during the session.
  - Market conditions: no setup, insufficient liquidity (T1.5), circuit or event risk [VERIFY: calendar].
  - Account conditions: loss limit reached, consecutive-loss rule reached, capital below the minimum the plan allows.
  - Data conditions: stale or failed data, unclear symbol, unclear corporate action (T1.9).
  - Personal conditions: sleep, distraction, or strong emotion after a loss. Revenge trading is excluded (T8.2).
  - No-trade is not missing out. The owner's brief states that earning nothing on a day is acceptable.
- **Worked example (rupees):** Illustrative daily loss limit Rs 1,000 for a Rs 50,000 account (2 percent; a design example, not a rule). Two trades each lose Rs 500 at 1R. The limit is reached, so trading stops for the day. Day result: minus Rs 1,000, the planned maximum for the day. A day with no setup has a result of Rs 0 and is still a compliant day.
- **Visual / animation / simulator:** risk-limit-simulator (new, allowed): the reader enters trades and limits and sees the stop-trading state appear at the breach.
- **Guided exercise:** Classify six scenarios as trade or no-trade, each with the rule that decides. Hints: (1) is there a setup under the rules; (2) is a limit reached; (3) is the data reliable; (4) is the personal state fit.
- **Independent exercise:** Write your own six-item no-trade list, each item with its rule and category.
- **Quiz focus:** categories; scenario: the trader has not traded for five days and takes the next weak setup; spot the mistake: treating no-trade as failure. Common wrong answers: no-trade days waste capital; a limit can be exceeded once if the next trade looks good.
- **Paper task (journal/Kite demo/lab):** Mode paper. Journal five no-trade days with the rule that decided each, using the Lab 3 no-trade entry.
- **Labs used:** Lab 3 (no-trade entries); Lab 1 (limit check)
- **Safety / capital-first note:** The book never rewards trades. A week of logged no-trade days is a complete log. Address the fear of missing out directly.
- **Time-sensitive facts to register:** Market holidays and special sessions [VERIFY: NSE holiday list]. Circuit limits [VERIFY: T1.7]. Event calendars used for no-trade rules [VERIFY: source per event].
- **Sources to cite:** NSE India, holiday list page; SEBI investor education material on trading risks.
- **Estimated length:** medium

---

## Open questions for the reviewer

1. **Kite facts (Track 4):** Every Kite label, demo access step, order-type availability, GTT validity, MIS square-off rule and alert behaviour is `[VERIFY]`. Each needs a check against Zerodha support and the owner's own Kite before the chapter is final. I did not state any of them.
2. **Demo order support (T4.4, T4.9):** It is unknown whether the Kite demo accepts SL orders or GTTs. Chapters assume the practice is possible only if verified. Please confirm.
3. **Track 5 defaults:** Parameters (14, 20, 2, 12/26/9) are conventions. Confirm the book presents them as conventions and not as Kite defaults until checked.
4. **Bollinger SD convention (T5.6):** Population versus sample is shown on both. Confirm which one the book uses in the playground.
5. **Fibonacci (T5.7):** Kept as a contested-evidence chapter. The 50 percent level is labelled as a convention, not a Fibonacci ratio. Owner to confirm whether to keep it at all.
6. **VWAP (T5.8):** Kept as an optional intraday item, as the brief asks. Owner may prefer to move it to the intraday module.
7. **Strategy specification (T6.4):** LABS.md's entry expression is not valid JSON. The structured form is a proposal. The filter values (minimum price Rs 50, minimum 20-day traded value Rs 5 crore, maximum 4 positions) are design choices, not facts, and need owner approval. The chapter stays illustrative and carries no performance claim.
8. **Lab 4 toy fixture (T6.6):** The 20-bar toy fixture required by LABS.md acceptance was not written here. Reviewer to supply the exact bars so the simulator steps can be checked by hand.
9. **Placeholder costs:** Rs 50 per round trip (T6.1, T6.2, T6.5) is an illustrative placeholder, not a Zerodha figure. Replace with the verified Lab 2 figure after the facts registry is populated, or remove.
10. **Overlap with Track 9:** Option theory appears briefly in T6.5 and is developed in T9.2. Confirm the split.
11. **T3.9 pass mark (80 percent):** A design proposal for a chapter assessment, not a gate. PLAN.md G1 uses 85 percent.
12. **T4.10 gate fields:** Written as the brief's gate fields. The 90 percent threshold and self-attested checklist follow PLAN.md section 6 G3, sharpened.
13. **T6.7 limit example:** The Rs 1,000 daily limit is an illustration of the arithmetic, not a recommended limit. Limits are owned by Track 2 (T2.11).
14. **Pattern names (T3.8):** Only two formations are given with rules. Reviewer to decide whether more are named.
15. **Chapter lengths:** Estimated lengths are guesses for planning and need confirming against the page budget.

## Facts to register (collected)

Every item is unverified. Values are not stated in this file; each needs an entry in `data/facts.json` before any chapter uses it.

| Fact | Used in | Authoritative source to check |
|---|---|---|
| Kite demo: dummy data, no paper-trading account, exact wording and how to reach it | T4.1, T4.9 | Zerodha support, Kite demo help |
| Console contents and purpose | T4.1 | Zerodha Console help |
| Kite chart colour convention, intervals, history depth, default indicators and parameters | T3.1, T3.2, T5.1 to T5.9 | Kite chart help |
| Kite VWAP and OBV definitions and availability | T5.8 | Kite chart help |
| Cash-market session open and close times | T3.1, T3.6, T4.3, T5.8 | NSE India, market timings |
| Circuit price band rules and their effect on exits | T3.5, T3.6, T6.4, T6.6, T6.7 | NSE and SEBI circuit-limit pages and circulars |
| Trading holidays and special sessions | T5.9, T6.7 | NSE India, holiday list |
| NSE delivery-percentage data definition and availability | T3.7 | NSE India, market data glossary |
| Symbol and series conventions for NSE and BSE | T4.2 | NSE and BSE symbol directories |
| Kite alert types, notification channels, and whether alerts can place orders | T4.2 | Zerodha support, alerts help |
| Kite order types: availability of SL and SL-M by product and segment; validity rules | T4.4, T4.9 | Zerodha support, order types; NSE order types page |
| Kite product types: MIS auto square-off timing and rules; product availability by stock | T4.5, T6.5 | Zerodha support; SEBI and exchange circulars |
| Intraday and derivatives margin rules | T4.5, T6.5 | SEBI and NSE margin circulars |
| Kite GTT: validity period, number of GTTs, allowed products, trigger range rules, handling of corporate actions | T4.6 | Zerodha support, GTT help |
| Kite order views: status labels; holdings display timing after T+1; final charge statement location | T4.7 | Zerodha support; T1.3 facts |
| Kite order confirmation and price-range messages | T4.8 | Zerodha support; NSE trading rules |
| Equity charges (brokerage, STT, exchange, SEBI, stamp, GST, DP) used in Lab 2 and any cost example | T2.2 cross-references, T5.9 (not used), T6.1, T6.2, T6.3, T6.5, T6.6, T6.4 | Zerodha charges page; official calculator; NSE, SEBI, statutory sources |
| Tax treatment of intraday versus delivery gains | T6.1, T6.3 | T2.3 facts; tax authority source |

Sources are listed by name only. URLs are not invented here and must be added by the reviewer from the official pages.
