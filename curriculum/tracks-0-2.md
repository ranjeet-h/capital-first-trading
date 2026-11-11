# Tracks 0-2: Chapter Specifications

Status: DRAFT for reviewer. Written 2026-11-11 by Haiku 5.5 from the curriculum brief. Covers T0.1-T0.3, T1.1-T1.10 and T2.1-T2.18 (31 chapters). Nothing here is a verified fact. Every value tagged `[VERIFY: ...]` must be resolved from an official source and recorded in `data/facts.json` before a chapter is written for readers.

## Track overview

**Purpose.** Give a complete beginner the vocabulary, market mechanics and money arithmetic needed before any chart or strategy is discussed. Track 0 sets the rules of the book. Track 1 explains how the Indian market works at the level a trader needs. Track 2 turns every trading idea into rupees: costs, size, risk, expectancy, drawdown and the Rs 2,000-3,000 daily-target reality check.

**Order.** Track 0 first, then Track 1, then Track 2. Track 2 is the largest and most important track. It is written so that a reader can complete it with only Track 0 and 1 and a calculator. Chart reading (Track 3), Kite (Track 4) and indicators (Track 5) come after, and Track 2 supplies the money rules they rely on.

**How it serves the owner's goals.**
- Capital first: every chapter ties to a loss mechanism (costs, sizing, gaps, streaks, overtrading, leverage).
- Modest objective: T2.16 shows that the Rs 2,000-3,000 daily target needs roughly Rs 25 lakh or more at a 20% annual return, and that it is unrealistic at Rs 10,000-50,000. No chapter presents any return as achievable.
- Plain language and rupee examples: every calculation has a worked figure the reader can check by hand.
- Distinction between investing, trading and speculation (T0.1), and between theoretical, backtested and live results (T0.1, T7.10).

**Conventions used in this track.**
- All rupee examples are hypothetical and use round figures. Where a rate or charge is needed, the chapter either uses a labelled DUMMY value (for arithmetic only) or a `[VERIFY]` tag.
- "R" means the rupee amount risked on one trade (entry minus stop, times shares).
- Labs referenced: Lab 1 (position size), Lab 2 (costs), Lab 3 (journal, built first), Lab 4 (backtester), Lab 5 (forward test).

---

## Track 0: Start here

### T0.1 What trading is and is not
- **Page type:** Concept
- **Prerequisites:** none
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain the difference between investing, trading and speculation using time horizon, source of return and risk control.
  2. Calculate the win rate needed to break even on a trade that risks Rs 3,000 to make Rs 500.
  3. Identify three ways an active trader loses money (costs, oversized positions, emotional decisions).
  4. Reject the claim that trading is a reliable income source, using the book's own arithmetic.
  5. Classify a described plan as investing, trading or speculation and justify the choice.
- **Key ideas to teach (in order):**
  - Everyday meaning first: buying a share means owning a fraction of a company, not owning a ticket with a price.
  - Investing: holding a business for years; return comes from earnings, dividends and growth in value; risk is managed by diversification and time.
  - Trading: buying and selling over days to months with written rules; return comes from price moves; risk is managed by per-trade limits.
  - Speculation: a bet on a short price move with high uncertainty, often with borrowed money. The label describes process and horizon, not the instrument. The same stock can be held in any of the three ways.
  - A price is a meeting point of buyers and sellers' expectations. It is not a guarantee of value or direction.
  - Before costs, trading is a transfer between participants; after costs, a typical active trader starts behind. Later chapters quantify this. Cite the SEBI study on individual traders in T9.4 [VERIFY: study title and figures].
  - Three result types must never be mixed: theoretical (a calculation), backtested (a simulated past), live (real money, real fills).
  - The book promises no income. Learning competence is not profitability.
- **Worked example (rupees):** A hypothetical plan risks Rs 3,000 to make Rs 500 per trade. Break-even win rate W satisfies W x 500 = (1 - W) x 3,000, so W = 3,000 / 3,500 = 85.7%. The reader must win about 86 of every 100 trades just to break even before costs. Show the arithmetic step by step. Label the example "hypothetical".
- **Visual / animation / simulator:** Static three-column card: Investing | Trading | Speculation, rows for horizon, return source, typical risk control, typical mistake. No animation.
- **Guided exercise:** Classify four hypothetical plans: (a) hold a company for 5 years and reinvest dividends; (b) buy before results and sell the next day; (c) borrow money to double a position; (d) monthly fixed purchases held for 10 years. Hints: ask "how long", "where does the return come from", "what limits the loss".
- **Independent exercise:** Write one paragraph describing your own intended activity and classify it. No hints.
- **Quiz focus:**
  - Definitions of investing, trading and speculation (scenario-based).
  - Break-even win rate for Rs 3,000 risk and Rs 500 reward (numeric). Wrong answers: 50% (confuses symmetric outcomes), 14.3% (inverts the ratio), 85% (rounding without working).
  - "A high win rate means I make money" (misconception). Wrong answer: "yes", because wins are frequent. Explanation: size of wins and losses matters (T2.8).
  - Spot the mistake: "The backtest made Rs 1 lakh, so it will earn the same live." Explain theoretical/backtested/live distinction.
  - Scenario: a friend promises steady monthly income from trading. Identify the claim as unsupported.
- **Paper task (journal/Kite demo/lab):** Learning note in Lab 3 (mode: learning note). Write why you want to learn trading and what evidence would make you stop. No trades.
- **Labs used:** none (Lab 3 receives the note).
- **Safety / capital-first note:** Address the misconception that trading is a faster route to income. State that no deposit is needed to learn. Make clear the book never promises or implies returns.
- **Time-sensitive facts to register:**
  - Figures from the SEBI study on individual traders, if quoted anywhere (cited in T9.4, not stated here).
- **Sources to cite:** SEBI investor education pages; SEBI study on F&O trading (cross-reference T9.4); Zerodha Varsity as reference only (link, no text copied).
- **Estimated length:** medium

### T0.2 The capital-first rules
- **Page type:** Concept
- **Prerequisites:** T0.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. List the capital-first rules and explain in one sentence what loss mechanism each prevents.
  2. Calculate trading capital as a percentage of total savings from a given allocation.
  3. Explain why a no-trade day counts as a correct outcome.
  4. Identify a rule violation in a described scenario (leverage, household money, averaging down, increasing size after losses).
  5. Decide whether a proposed action breaks a capital-first rule and give the reason.
- **Key ideas to teach (in order):**
  - Household money is separate: emergency funds and obligations are never trading capital.
  - Trading capital is money the owner can afford to lose entirely. The amount is the owner's decision, set before any trade.
  - No leverage or borrowed money in the learning and early live stages.
  - No F&O as a starting activity; F&O is theory only in Track 9.
  - Never average down into a losing position (adding to a loser to lower the average cost).
  - Never increase position size after losses.
  - No-trade days are a valid result. Not trading is a decision, not a failure.
  - No daily income target as a driver of trades (T2.12).
  - Each rule links to a loss path: leverage magnifies losses (T2.13), averaging down increases exposure to a failing idea (T2.14), size increases after losses accelerate drawdown (T2.9).
- **Worked example (rupees):** Hypothetical household savings of Rs 4,00,000. If trading capital is set at Rs 50,000, it is 12.5% of savings: 50,000 / 4,00,000 = 12.5%. Show the account falling 30%: Rs 50,000 becomes Rs 35,000, a loss of Rs 15,000. The savings remain Rs 3,50,000 untouched. Ask: could the household absorb this loss? The rule is that the answer must be yes before starting. Label as hypothetical.
- **Visual / animation / simulator:** Static rule card: each rule on one row, with the loss mechanism on the right. No animation.
- **Guided exercise:** A friend asks to borrow Rs 2 lakh for "a sure intraday trade". Using the rules, list which rules are broken and what the reader would say. Hints: check the source of money, leverage, the word "sure", and what happens if the trade loses.
- **Independent exercise:** Write your own three capital-first rules with a number attached to each. No hints.
- **Quiz focus:**
  - Leverage misconception: "Borrowing doubles my gain, so it is safe if I am careful." Wrong answer: "yes". Explain losses are doubled too (T2.13).
  - Averaging down: "The price fell, so buying more lowers my average cost and is a good idea." Wrong answer: "yes". Explain increased exposure to an unchanged plan (T2.14).
  - No-trade day: "I earned nothing today, so I failed." Explain the rule.
  - Scenario: using the emergency fund to top up trading capital after losses. Identify the violation.
  - Spot the mistake: "Trading capital is my total savings because I can earn it back." Explain why total savings is not trading capital.
- **Paper task (journal/Kite demo/lab):** Lab 3 learning note: write the capital statement with three lines (total savings, trading capital set by you, untouched amount). Use hypothetical or blank figures. Mode: learning note. Do not record a live account.
- **Labs used:** Lab 3 (capital_at_plan field is the record for the rule).
- **Safety / capital-first note:** The most common path to ruin is trading money that cannot be lost. Make the rule explicit before the first trade and never a judgement made after a loss.
- **Time-sensitive facts to register:**
  - Margin and leverage rules for the cash segment and the broker's margin policy (cross-reference T2.13) [VERIFY: Zerodha margin page; SEBI margin framework circulars].
- **Sources to cite:** SEBI investor education pages on leverage and margin; Zerodha support on margin.
- **Estimated length:** medium
- **Open question:** Should the book suggest a default trading-capital ceiling or leave the number entirely to the owner? Current draft: leave to the owner, illustrate only.

### T0.3 How to use this book
- **Page type:** Concept
- **Prerequisites:** T0.1, T0.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Describe the eleven steps of a chapter pattern and the purpose of each.
  2. Explain the lab build order and why the journal is used from day one.
  3. Explain what a graduation gate tests and what passing does not mean.
  4. Set up a backup routine with the default 14-day reminder.
  5. Decide which journal mode (learning note, paper, kite_demo, live) a given entry belongs to.
- **Key ideas to teach (in order):**
  - Chapter pattern: hook, concept, visual, worked example, demo, guided exercise, independent exercise, quiz, paper task, "what this does not tell you", sources.
  - Reading order follows the track dependencies; Track 2 must be finished before any strategy chapter.
  - Labs: Lab 3 (journal) first, then Labs 2 and 1, then Labs 4 and 5 later.
  - Journal modes: learning note, paper, kite_demo, forward, backtest, live. Entries made before the gates are never marked live.
  - Offline use: after install, every page works without a network. Installing to the home screen is recommended.
  - Backups: export a versioned file regularly and keep a copy outside the device. The app reminds every 14 days by default and after every 10 new trades (configurable).
  - Gates: G1-G7 test educational competence. They can be retaken with no timer. Passing gates does not mean the owner should trade real money; that remains the owner's separate decision.
  - No pressure: there is no deadline to start real trading.
- **Worked example (rupees):** A 20-minute session: read a 5-minute concept, complete a 2-minute exercise, record one learning note. Show a sample learning note with the capital line "trading capital: Rs 50,000 (hypothetical)" and the risk budget "1% = Rs 500". Show the arithmetic 1% of 50,000 = 500.
- **Visual / animation / simulator:** Static flow diagram (Mermaid): read, exercise, quiz, journal, gate. Second diagram: track dependency map for Tracks 0-2.
- **Guided exercise:** Create a learning-note entry in Lab 3 titled "What I expect to learn", set the backup reminder, and export one backup file. Hints: menu location to be confirmed in the Lab 3 build.
- **Independent exercise:** Plan a four-week study schedule for Tracks 0-2 using the dependency map. No hints.
- **Quiz focus:**
  - Journal mode of a reading note (learning note, not live).
  - "Passing G2 means I can start trading real money" (misconception). Wrong answer: "yes". Explain gates are educational competence, not proof of profit.
  - "The book can place orders for me." Wrong answer: "yes". Correct: offline, no broker.
  - Backup timing: "I need a backup only once a year." Correct: default 14 days.
  - Scenario: a gate attempt failed. Identify the retake rule (no timer, retake allowed).
- **Paper task (journal/Kite demo/lab):** Set up the journal, record the first learning note, export the first backup, and store it outside the device.
- **Labs used:** Lab 3 (M1 journal MVP).
- **Safety / capital-first note:** Make clear that a learning record is not a trading record. Entries before the gates must never be labelled live.
- **Time-sensitive facts to register:**
  - iOS Safari storage eviction for sites not added to the Home Screen [VERIFY: Apple WebKit documentation].
  - Browser support for persistent storage requests [VERIFY: MDN storage persistence page].
- **Sources to cite:** Apple WebKit storage policy documentation; MDN storage persistence; the book's own gate definitions (PLAN section 6).
- **Estimated length:** short

---

## Track 1: Market foundations

### T1.1 Companies, shares and why firms list
- **Page type:** Concept
- **Prerequisites:** T0.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate a shareholder's ownership percentage and value from share count and price.
  2. Distinguish primary-market and secondary-market transactions and say where the money goes in each.
  3. Explain what an IPO gives the buyer and what it does not guarantee.
  4. Calculate the change in ownership percentage when a company issues new shares.
- **Key ideas to teach (in order):**
  - A share is a unit of ownership in a company. Ownership percentage = shares held / total shares outstanding.
  - Why companies raise money through shares: to fund operations or growth without taking a loan, and to give existing owners a route to sell. Explain these as general reasons.
  - Primary market: the company issues new shares; the money goes to the company.
  - Secondary market: investors trade existing shares; the money goes to the seller, not the company.
  - IPO: a company's first public offer of shares. The price-setting method and allotment process are described in the chapter only at concept level [VERIFY: SEBI ICDR regulations; book-building method].
  - An IPO is not automatically profitable. Listing-day price can be above or below the issue price.
  - Ownership dilution: new shares reduce each existing holder's percentage.
- **Worked example (rupees):** Hypothetical company with 10,00,000 shares outstanding at Rs 200 each. Company value = 10,00,000 x 200 = Rs 20,00,00,000 (Rs 20 crore). A holder with 1,000 shares owns 1,000 / 10,00,000 = 0.1%, worth 1,000 x 200 = Rs 2,00,000. Secondary trade: buying 100 shares at Rs 200 pays Rs 20,000 to the seller; the company receives nothing. Dilution: the company issues 5,00,000 new shares to new investors; the holder's 1,000 become 1,000 / 15,00,000 = 0.0667%.
- **Visual / animation / simulator:** Static Mermaid diagram of money flows: primary (investor to company) and secondary (buyer to seller via exchange).
- **Guided exercise:** Compute ownership and value for a holder of 250 shares in a company with 20,00,000 shares at Rs 150. Hints: divide, then multiply.
- **Independent exercise:** The company in the worked example issues 10,00,000 new shares. Compute the holder's new ownership and explain why the holder's value is not automatically lower. No hints.
- **Quiz focus:**
  - Ownership percentage calculation (numeric; wrong answers: 1,000 / 200 with no total, 0.1% with wrong total).
  - Primary vs secondary money flow (scenario).
  - "An IPO is guaranteed to rise on listing" (misconception; wrong answer: "yes").
  - Spot the mistake: "I bought shares in the stock market, so the company got my money." Explain secondary trade.
  - Dilution: "New shares increase my ownership." Wrong answer: "yes".
- **Paper task (journal/Kite demo/lab):** Learning note: find a public offer document for any past IPO on the exchange or SEBI site and note the "objects of the issue" section in your own words. No purchase.
- **Labs used:** none.
- **Safety / capital-first note:** IPO hype and allotment excitement drive impulsive purchases. An IPO is not an exception to any capital-first rule.
- **Time-sensitive facts to register:**
  - IPO process, timelines, book-building and allotment rules [VERIFY: SEBI ICDR regulations].
  - Any current IPO figures are out of scope.
- **Sources to cite:** SEBI ICDR regulations; SEBI investor education pages on IPOs; NSE and BSE IPO education pages.
- **Estimated length:** medium

### T1.2 Exchanges, SEBI, NSE, BSE, brokers and participants
- **Page type:** Concept
- **Prerequisites:** T1.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Name the role of SEBI, the exchanges, the clearing corporation, the depository, the broker and the depository participant.
  2. Trace the path of a single buy order through these institutions.
  3. Explain why a broker is not the exchange and why the broker is not the custodian of shares.
  4. Identify the first step for a grievance, as described on the official site [VERIFY].
- **Key ideas to teach (in order):**
  - SEBI: the securities regulator. It sets rules for brokers, exchanges and listed companies.
  - Exchanges (NSE, BSE): run the marketplace where orders are matched [VERIFY: current recognition status and roles].
  - Clearing corporation: stands between buyer and seller after a trade and guarantees settlement [VERIFY: clearing corporation names and role].
  - Depositories: hold shares electronically [VERIFY: NSDL and CDSL roles].
  - Broker (trading member): accepts orders, provides the trading platform, passes orders to the exchange.
  - Depository participant (DP): the intermediary that maintains the demat account on the depository's behalf [VERIFY].
  - Banks: hold funds for trading and settlement; the trading account links to a bank account.
  - Grievance route: start with the broker, then the exchange, then SEBI's complaint portal [VERIFY: SCORES process].
- **Worked example (rupees):** Buy 20 shares at Rs 250 = 20 x 250 = Rs 5,000. Trace: the owner's order goes to the broker, then to the exchange, which matches it; the clearing corporation records the obligation; the shares are credited to the owner's demat account after settlement. Mark which entity holds the money at each step (the exchange does not hold the owner's money; the broker and clearing system move funds).
- **Visual / animation / simulator:** order-flow-sim in conceptual mode (labelled steps: trader, broker, exchange, clearing, depository). Static fallback diagram.
- **Guided exercise:** Label the institutions in a diagram for a sale of 20 shares at Rs 250. Hints: start at the owner, follow the order, then follow the shares.
- **Independent exercise:** Explain to a friend in three sentences why the exchange is not the place where you open an account. No hints.
- **Quiz focus:**
  - Broker vs exchange (misconception: "my broker is the exchange").
  - Role of the clearing corporation (scenario: a trade is executed; who guarantees settlement?).
  - Spot the mistake: "SEBI sets stock prices every day." Correct: prices come from order matching.
  - Grievance route (order question: broker, exchange, SEBI).
  - Who holds shares electronically (wrong answer: broker's office).
- **Paper task (journal/Kite demo/lab):** Learning note: list each institution, its role in your own words, and a link to the official page that describes it. Verify against SEBI, NSE, BSE pages.
- **Labs used:** none.
- **Safety / capital-first note:** Check the broker's registration on official lists before opening an account [VERIFY: SEBI or exchange list of registered brokers]. Never send money to a person claiming to be a broker or advisor without verification.
- **Time-sensitive facts to register:**
  - Clearing corporation and depository names and roles [VERIFY: NSE clearing page; NSDL; CDSL].
  - SCORES complaint process [VERIFY: SEBI SCORES page].
  - Current list of recognised exchanges [VERIFY: SEBI].
- **Sources to cite:** SEBI website (about SEBI, intermediaries, investor grievance); NSE website (clearing, membership); BSE website; NSDL and CDSL websites; Zerodha support pages on accounts (as a broker example, not as a recommendation).
- **Estimated length:** medium

### T1.3 Demat and trading accounts; how a buy becomes a holding; T+1 settlement and clearing
- **Page type:** Concept
- **Prerequisites:** T1.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain what each account holds: trading account (orders, funds), demat account (shares).
  2. Trace a buy from order to demat credit.
  3. Calculate the settlement date of a trade using the rule as verified [VERIFY: T+1 rule and holiday calendar].
  4. Explain why a holding does not appear instantly and what netting does to the cash obligation.
- **Key ideas to teach (in order):**
  - Trading account: where orders are placed and funds are tracked.
  - Demat account: where shares are held in electronic form.
  - Linked bank account: where funds move in and out.
  - Trade execution, then clearing (obligations are calculated and netted), then settlement (shares and money exchange).
  - Netting: many trades in one settlement cycle reduce to a single net obligation per security and per cash amount.
  - T+1: settlement one working day after the trade date [VERIFY: current rule and effective date].
  - Shares must be in the demat account before they can be sold for delivery [VERIFY: rule on selling shares not yet credited].
  - Holding vs position: a delivery holding is settled shares; intraday positions are not delivery holdings (detailed in T4.7).
- **Worked example (rupees):** Netting illustration (concept only): a broker has three buy trades of Rs 5,000 each and one sell trade of Rs 2,000 in the same cycle. Gross buys = 15,000; sell = 2,000; net payable = 15,000 - 2,000 = Rs 13,000. Actual netting rules and who nets for which account [VERIFY]. Timeline example: a buy executed on a hypothetical Monday settles on Tuesday if Tuesday is a working day [VERIFY: holiday calendar].
- **Visual / animation / simulator:** Static Mermaid timeline: order, execution, clearing, settlement, demat credit. Mark the T+1 step with [VERIFY].
- **Guided exercise:** Fill in the blanks of the trace for a buy of 20 shares at Rs 250 (Rs 5,000 trade value). Hints: which account, which institution, which day.
- **Independent exercise:** A trade executed on a Friday before a public holiday. List the sources needed to find the settlement date (do not compute it without the calendar). No hints.
- **Quiz focus:**
  - Holding appears immediately after the order (misconception; wrong answer: "yes").
  - T+1 meaning (wrong answers: next calendar day; two days later).
  - Netting arithmetic (numeric: 13,000).
  - Spot the mistake: "My demat account holds my cash." Correct: funds are in the bank and trading account.
  - Scenario: selling shares bought today in delivery. Identify the constraint [VERIFY].
- **Paper task (journal/Kite demo/lab):** Kite demo task (mode: kite_demo): find where holdings and funds appear in the demo, and note the labels in your own words. Label the layout as "check your own Kite for the current layout".
- **Labs used:** none.
- **Safety / capital-first note:** Settlement risk is low for the reader's learning but real for live trades. Do not assume a sale is possible the same day without verifying the rule.
- **Time-sensitive facts to register:**
  - T+1 settlement rule and effective date [VERIFY: SEBI circular; NSE clearing page].
  - Holiday calendar for settlement days [VERIFY: NSE holiday list].
  - Demat account opening and annual maintenance charges, if mentioned later [VERIFY: Zerodha charges page; CDSL/NSDL tariff].
- **Sources to cite:** SEBI circulars on settlement cycle; NSE clearing and settlement pages; NSDL and CDSL; Zerodha support on demat accounts.
- **Estimated length:** medium

### T1.4 How prices move: supply and demand, the order book
- **Page type:** Concept
- **Prerequisites:** T1.2, T1.3
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain that the displayed price is the last matched trade, not a fixed value.
  2. Calculate the average price of a market buy order that walks up the ask side of an order book.
  3. Explain why a thin order book moves price more for the same order size.
  4. Distinguish a price change from a judgement that the price is right or wrong.
- **Key ideas to teach (in order):**
  - Demand: buy orders at or above a price. Supply: sell orders at or below a price.
  - An order book is a list of resting orders waiting to be matched.
  - The last traded price is what the last matched trade happened at.
  - A market order takes the best available prices; a limit order sets a maximum buy or minimum sell price.
  - Price moves when incoming orders consume the best levels of the book.
  - News changes expectations, which changes orders; the price reflects the orders, not the news directly.
  - No price is "fair" by itself. The price is what buyers and sellers agreed to at that moment.
- **Worked example (rupees):** Hypothetical ask side: 100 shares at Rs 250, 150 at Rs 251, 200 at Rs 252. A market buy of 250 shares fills 100 at 250 (Rs 25,000) and 150 at 251 (Rs 37,650). Total Rs 62,650 for 250 shares. Average price = 62,650 / 250 = Rs 250.60. The last traded price becomes Rs 251. Show each multiplication.
- **Visual / animation / simulator:** order-book-sim, showing a market buy consuming levels and the price stepping up.
- **Guided exercise:** Using the same book, compute the cost of a market buy of 100 shares and of 200 shares. Hints: fill from the lowest ask upward.
- **Independent exercise:** Market buy of 300 shares using the same book. Compute the total and average price and the new last price. No hints.
- **Quiz focus:**
  - Average price of a walked-up market order (numeric: Rs 62,650 and 250.60).
  - "The last price is the fair price" (misconception; wrong answer: "yes").
  - Limit order guarantee: "A buy limit at 250 means I pay exactly 250" (wrong answer: "yes"; explain: maximum, and the order may not fill).
  - Scenario: a thin stock with few sellers; predict the price move for a larger market order.
  - Spot the mistake: "The price went up, so buyers have more information." Explain that price moves reflect order flow, not necessarily information.
- **Paper task (journal/Kite demo/lab):** Kite demo (mode: kite_demo): open the market depth view for one demo stock and record the best bid and ask in your own words. Label the layout as unverified [VERIFY: Kite demo depth view].
- **Labs used:** none.
- **Safety / capital-first note:** In thin stocks a market order can fill far from the last price. Use limit orders with a known maximum and never assume a displayed price is the fill price.
- **Time-sensitive facts to register:**
  - Market depth levels shown in Kite [VERIFY: Zerodha Kite help page].
- **Sources to cite:** NSE education on order matching; Zerodha Varsity as reference (link only); Zerodha support on order types.
- **Estimated length:** medium

### T1.5 Order matching, bid-ask spread, market depth, liquidity
- **Page type:** Concept (with calculator elements)
- **Prerequisites:** T1.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the bid-ask spread in rupees and as a percentage of price.
  2. Calculate the immediate cost of crossing the spread for a round trip.
  3. Explain price-time priority [VERIFY: exchange matching rule] with an example.
  4. Identify three signs of low liquidity from a displayed book.
- **Key ideas to teach (in order):**
  - Best bid: highest buy price waiting. Best ask: lowest sell price waiting.
  - Spread = best ask - best bid. Spread percent = spread / reference price.
  - Buying at the ask and selling at the bid loses the spread on a round trip.
  - Market depth: quantity available at each price level.
  - Liquidity: ability to trade a given size without moving the price much.
  - Matching priority: orders matched first by price, then by time of arrival [VERIFY: NSE and BSE rule].
  - Tick size: the smallest price step [VERIFY: NSE tick size].
- **Worked example (rupees):** Best bid Rs 249.50, best ask Rs 250.50. Spread = 250.50 - 249.50 = Rs 1.00. Spread percent = 1.00 / 250 = 0.40%. Buy 40 shares at the ask: 40 x 250.50 = Rs 10,020. Sell immediately at the bid: 40 x 249.50 = Rs 9,980. Instant loss before any charges = Rs 40 (0.40% of Rs 10,020, approximately).
- **Visual / animation / simulator:** order-book-sim with the spread highlighted and a round-trip counter.
- **Guided exercise:** Compute spread and round-trip spread cost for 100 shares when bid is Rs 99.00 and ask is Rs 101.00. Hints: spread first, then multiply by quantity. Answer: spread Rs 2.00 (2.0% of Rs 100), round-trip cost Rs 200 for 100 shares.
- **Independent exercise:** Stock A has bid 500.00 and ask 500.50; stock B has bid 50.00 and ask 50.20. For 100 shares of each, compute spread cost. Which is cheaper per rupee traded? No hints.
- **Quiz focus:**
  - Spread calculation (numeric).
  - "A deep order book means no slippage at any size" (misconception; wrong answer: "yes").
  - Price-time priority scenario: two buy orders at the same price; which fills first.
  - Spot the mistake: "The spread is a broker fee." Correct: it is the market's price gap.
  - Liquidity signs: wide spread, thin depth, large gaps between levels.
- **Paper task (journal/Kite demo/lab):** Kite demo (mode: kite_demo): record the spread of one demo stock at three times of the day, in the journal. Note that the demo data is dummy.
- **Labs used:** none (spread feeds Lab 2 and Lab 4 slippage later).
- **Safety / capital-first note:** Wide spreads make round trips expensive. Frequent trading in illiquid stocks is an overtrading trap (T2.12).
- **Time-sensitive facts to register:**
  - Matching rules and priority [VERIFY: NSE market rules].
  - Tick size [VERIFY: NSE tick size page].
- **Sources to cite:** NSE market microstructure and trading rules pages; BSE trading rules; Zerodha Varsity as reference only.
- **Estimated length:** medium

### T1.6 Trading sessions, pre-open and closing auctions, market timings and holidays
- **Page type:** Concept
- **Prerequisites:** T1.3, T1.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. List the market phases in order and say what happens in each.
  2. Explain why the opening and closing prices are set by auctions [VERIFY].
  3. Determine the next trading session after a given date using a supplied holiday list.
  4. Explain why a swing trader's end-of-day decisions depend on the closing price and on the next session.
- **Key ideas to teach (in order):**
  - Phases: pre-open (order collection and price discovery), continuous trading, closing session [VERIFY: exact phases, times and mechanics].
  - Auctions: many orders are matched at one price that maximises matched volume [VERIFY: method].
  - Market timings are set by the exchange and can differ for special sessions [VERIFY: NSE timings page].
  - Holidays: the exchange publishes a list each year; trading does not happen on those days [VERIFY: NSE holiday list].
  - Muhurat or special sessions may occur on some days [VERIFY: NSE circular].
  - Weekends are non-trading days.
  - For an end-of-day style, the decision is made after the close and the order is placed in the next session.
  - Orders placed when the market is closed are handled according to the broker and exchange rules [VERIFY].
- **Worked example (rupees):** A hypothetical plan made on a Friday evening at Rs 400 close. Holiday list (dummy, for the exercise): Monday is a holiday. The next session is Tuesday, so the plan's order is placed then. A stop decision based on Friday's close can meet a different price at Tuesday's open (this gap risk is detailed in T2.6). Show the calendar step by step.
- **Visual / animation / simulator:** Static day timeline (Mermaid or SVG) with placeholders for times, each marked [VERIFY]. No real times are stated.
- **Guided exercise:** Given a dummy holiday list, find the next three trading dates after a Thursday. Hints: skip weekends first, then holidays.
- **Independent exercise:** Three scenarios with different dummy holidays: find the next trading session for each. No hints.
- **Quiz focus:**
  - Phases in order (order question).
  - "I can trade on Saturday" (wrong answer: "yes").
  - Next-session calculation with a holiday (numeric/date).
  - Spot the mistake: "The pre-open price is the closing price." Explain the difference.
  - Scenario: a stop-loss placed before a long weekend. Identify the gap risk.
- **Paper task (journal/Kite demo/lab):** Learning note: copy the official holiday list for the current year into a journal note, with the source link and the date you copied it. Add a "next 10 trading dates" list (learning note).
- **Labs used:** none now; Lab 5 uses a verified calendar later.
- **Safety / capital-first note:** Holidays and weekends create gaps. Plans must state what happens if the next session opens far from the close.
- **Time-sensitive facts to register:**
  - Market phases and times [VERIFY: NSE market timings page].
  - Closing price method [VERIFY: NSE closing session rules].
  - Holiday list for the current year [VERIFY: NSE holiday list].
  - Special session dates [VERIFY: NSE circular].
- **Sources to cite:** NSE market timings and holiday pages; NSE circulars; BSE timings page; Zerodha support on market hours.
- **Estimated length:** medium

### T1.7 Circuit limits and price bands, halts
- **Page type:** Concept (with calculator elements)
- **Prerequisites:** T1.4, T1.6
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate upper and lower price bands from a previous close and a band percentage.
  2. Explain what happens to orders that fall outside the band.
  3. Explain why a stock at a circuit may have only buyers or only sellers.
  4. Explain why a stop order may not fill at its trigger when a stock is locked at a circuit.
- **Key ideas to teach (in order):**
  - Price band (circuit limit): maximum allowed move above and below the previous close, set per stock category [VERIFY: band categories and percentages].
  - Upper circuit and lower circuit.
  - Locked circuit: no trades possible at the band price when all orders are on one side.
  - Trading halts and index-level circuit breakers [VERIFY: halt rules].
  - Band changes: bands may change for a stock over time [VERIFY].
  - A circuit limits the price, not the loss. A held position can be unable to exit.
- **Worked example (rupees):** Previous close Rs 400. Dummy band of 10% (for arithmetic only; the real band is [VERIFY]). Upper = 400 x 1.10 = Rs 440. Lower = 400 x 0.90 = Rs 360. Holder of 100 shares with a stop at Rs 380: planned loss = 100 x 20 = Rs 2,000. If the stock locks at the lower band Rs 360 with no buyers, the exit cannot happen at Rs 380. Loss at Rs 360 = 100 x 40 = Rs 4,000 (2x the planned loss).
- **Visual / animation / simulator:** sl-trigger-sim in a circuit-locked scenario, showing the trigger and the blocked fill.
- **Guided exercise:** Previous close Rs 250, band 20% (dummy). Compute upper and lower bands. Answer: Rs 300 and Rs 200. Hints: multiply by 1 plus and 1 minus the band.
- **Independent exercise:** Three stocks with previous closes Rs 120, Rs 800 and Rs 1,500 and dummy bands of 5%, 10% and 20%. Compute each band and say which position is most exposed to a one-day move. No hints.
- **Quiz focus:**
  - Band arithmetic (numeric).
  - "Circuits prevent losses" (misconception; wrong answer: "yes").
  - Stop-loss in a locked circuit (scenario).
  - Spot the mistake: "I bought at upper circuit, so I am guaranteed a profit next day." Explain.
  - "The band is based on today's open" (wrong answer). Correct: previous close [VERIFY].
- **Paper task (journal/Kite demo/lab):** Learning note: write what you would do if a held stock locked at lower circuit for two days. Use a hypothetical plan (no action in a real account).
- **Labs used:** Lab 4 (circuit clipping in synthetic data, later).
- **Safety / capital-first note:** A circuit can trap a position. Position sizing must consider locked days (T2.6).
- **Time-sensitive facts to register:**
  - Band categories and percentages [VERIFY: NSE circuit limits page].
  - Index-level circuit breaker levels and rules [VERIFY: NSE circular].
  - Trading halt rules [VERIFY: SEBI and NSE circulars].
- **Sources to cite:** NSE circuit limits and price band pages; BSE price band pages; SEBI circulars on price bands and circuit breakers.
- **Estimated length:** medium

### T1.8 Indices (Nifty, Sensex) and what they measure
- **Page type:** Concept (with calculator elements)
- **Prerequisites:** T1.1, T1.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain an index as a basket with a weighting method.
  2. Calculate an index's point change and percentage change.
  3. Calculate an index's percentage move from stock weights and stock moves.
  4. Explain why an index move does not tell the trader what a specific stock will do.
- **Key ideas to teach (in order):**
  - An index is a single number that summarises a basket of stocks.
  - Weighting: the method (commonly market capitalisation based, with free-float adjustment [VERIFY: methodology]) determines each stock's influence.
  - Point change and percent change: percent = point change / previous level.
  - Sectoral and broad indices measure different baskets.
  - Breadth: how many stocks rose versus fell.
  - An index is not directly tradable as a share; index-linked products are covered only in Track 9 [VERIFY: product list if mentioned].
  - Rebalancing: composition is reviewed periodically [VERIFY: schedule].
- **Worked example (rupees):** Index moves from 20,000 to 20,400: point change = 400; percent = 400 / 20,000 = 2.0%. Weighted example (illustrative only): stock A has 50% weight and rises 4%; stock B has 30% weight and falls 2%; stock C has 20% weight and rises 1%. Index move = 0.5 x 4 + 0.3 x (-2) + 0.2 x 1 = 2.0 - 0.6 + 0.2 = +1.6%. A holding of Rs 50,000 in stock B would fall 2% = Rs 1,000 while the index rose.
- **Visual / animation / simulator:** Static weighted bar chart with the weights and moves.
- **Guided exercise:** Index falls from 18,000 to 17,640. Compute points and percent. Answer: -360 points, -2.0%. Hints: point change first.
- **Independent exercise:** Three-stock index with weights 40%, 35%, 25% and moves +3%, -1%, -4%. Compute the index move and the effect on a Rs 20,000 holding of the first stock. No hints.
- **Quiz focus:**
  - Point vs percent (numeric).
  - "An index rising means every stock rose" (misconception; wrong answer: "yes").
  - Weights (scenario: which stock moves the index most).
  - Spot the mistake: "Nifty is 20,000 rupees so I can buy it." Correct: index level is a number, not a price.
  - Index as a trading signal (wrong answer: "yes"). Correct: an index is a context measure.
- **Paper task (journal/Kite demo/lab):** Learning note: record the closing values of one broad index for five trading days from the exchange site, with source and date. Do not draw conclusions.
- **Labs used:** none.
- **Safety / capital-first note:** Market context is not a trade signal by itself. Do not treat an index move as permission to trade.
- **Time-sensitive facts to register:**
  - Constituents and weighting methodology for the main indices [VERIFY: NSE indices methodology document].
  - Rebalancing schedule [VERIFY: NSE indices].
- **Sources to cite:** NSE Indices methodology documents; BSE index pages; Zerodha Varsity as reference.
- **Estimated length:** medium

### T1.9 Corporate actions: dividends, splits, bonus, rights and their effect on prices and charts
- **Page type:** Concept (with calculator elements)
- **Prerequisites:** T1.1, T1.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the share count and approximate price after a split or bonus issue, with unchanged total value.
  2. Explain why a dividend lowers the share price on the ex-date by approximately the dividend amount.
  3. Explain why an unadjusted chart can show a false crash after a split, and how adjusted data corrects it.
  4. Identify the key dates (announcement, record, ex-date) [VERIFY: definitions].
- **Key ideas to teach (in order):**
  - A corporate action is a company event that changes shares, price or cash held by holders.
  - Dividend: cash paid per share; ex-date is when the price adjusts [VERIFY: ex-date rules].
  - Split: more shares, each worth less; total value unchanged at the moment of the split.
  - Bonus issue: free additional shares in a stated ratio; value unchanged at the moment of the issue.
  - Rights issue: existing holders can buy new shares at a stated price; mechanics and entitlement rules [VERIFY: SEBI rights issue rules].
  - Adjusted vs unadjusted price history: adjusted charts correct past prices for splits and bonuses; unadjusted charts show the raw trading prices.
  - Corporate action announcements are published by the company and exchange.
- **Worked example (rupees):**
  - Split 1:2 (concept): holder has 100 shares at Rs 1,000 = Rs 1,00,000. After a 1:2 split: 200 shares at about Rs 500 = Rs 1,00,000.
  - Bonus 1:1 (concept): 100 shares become 200 shares; value again Rs 1,00,000 at about Rs 500 each.
  - Dividend Rs 10 per share (dummy): holder's 100 shares receive Rs 1,000 cash. On the ex-date the price falls about Rs 10: from Rs 1,000 to about Rs 990. Holding value = 100 x 990 + 1,000 cash = Rs 1,00,000 (before market movement and before tax).
  - Unadjusted chart: the price drops from Rs 1,000 to Rs 500 on the split day, a 50% fall that is not a loss.
- **Visual / animation / simulator:** Static before-and-after candle chart: unadjusted vs adjusted after a split.
- **Guided exercise:** Holder has 300 shares at Rs 600 (Rs 1,80,000). A 1:1 bonus is announced. Compute new shares and approximate new price. Answer: 600 shares at about Rs 300 = Rs 1,80,000.
- **Independent exercise:** A 3:1 split on a stock at Rs 900 with 50 shares held. Compute new shares, approximate price and value. No hints.
- **Quiz focus:**
  - Split/bonus arithmetic (numeric).
  - "A split increases my wealth" (misconception; wrong answer: "yes").
  - Dividend effect on price (scenario).
  - Spot the mistake: "The stock fell 50% on the split day, so something went wrong." Explain unadjusted chart.
  - Dividend "always increases total value" (wrong answer: "yes"; explain price adjustment and market movement).
- **Paper task (journal/Kite demo/lab):** Learning note: find one past corporate action announcement for a listed company on the exchange site and record dates and terms. Check whether a chart you use is adjusted.
- **Labs used:** Lab 4 (split discontinuity handling in data, later).
- **Safety / capital-first note:** A price drop on ex-date or split is not a sell signal. Never trade on an announcement alone.
- **Time-sensitive facts to register:**
  - Definitions and timelines for record date, ex-date, bonus, split and rights [VERIFY: SEBI LODR regulations; NSE corporate actions pages].
  - Tax treatment of dividends (cross-reference T2.3) [VERIFY].
- **Sources to cite:** SEBI LODR regulations; NSE corporate actions page; BSE corporate actions page; company announcements on exchange filings.
- **Estimated length:** medium

### T1.10 Market participants: retail, institutions, FII/DII; where information comes from; spotting misleading tips
- **Page type:** Concept
- **Prerequisites:** T1.2, T1.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Name the main participant categories and what each typically does [VERIFY: categories].
  2. Explain what a net FII or DII figure measures and what it does not measure.
  3. Identify at least four signs of a misleading or unverified tip.
  4. Name the primary sources to verify a company or market claim.
- **Key ideas to teach (in order):**
  - Retail investors: individuals trading their own money.
  - Institutions: large organisations (funds, insurers, banks) with research teams and different cost structures.
  - FII/FPI: foreign investors; DII: domestic institutions [VERIFY: definitions].
  - Proprietary traders and market makers: firms trading their own capital or providing quotes [VERIFY].
  - FII/DII data: published daily by the exchange [VERIFY: source and timing]. Net = buy value - sell value. It shows aggregate flow, not the reason and not the stock picks.
  - Information sources ladder: primary (company filings, exchange announcements, regulator orders) above secondary (media, analysis) above unverified (tips, forwarded messages, social media).
  - Misleading tip signs: guaranteed returns, urgency, pressure to join a group, no registration, payment for "signals", claims of insider information.
  - Advisers and research analysts must be registered with SEBI [VERIFY: registration categories and lookup].
- **Worked example (rupees):** Hypothetical day (dummy numbers): FII buy value Rs 4,000 crore, sell value Rs 3,500 crore. Net = 4,000 - 3,500 = Rs 500 crore net buying. The figure does not show which stocks were bought or why. Compare with a tip claiming "guaranteed Rs 10,000 a month from my signals" on a Rs 50,000 account: 10,000 / 50,000 = 20% a month, a claim the book treats as a red flag, not as information.
- **Visual / animation / simulator:** Static information-source ladder with warning icons (text-labelled, not colour-only).
- **Guided exercise:** Classify five hypothetical message samples as primary, secondary or unverified, with reasons. Hints: check whether the source is the company, the exchange or the regulator.
- **Independent exercise:** Write a checklist of six steps to verify a tip before acting, and conclude "do nothing" as an allowed result. No hints.
- **Quiz focus:**
  - Net FII figure arithmetic (numeric: Rs 500 crore).
  - "FII buying means the price will rise" (misconception; wrong answer: "yes").
  - Misleading tip signs (scenario, multi-select).
  - Spot the mistake: "The adviser is on a messaging group, so he is registered." Correct: check SEBI register.
  - Scenario: a claim of 20% a month. Identify the red flags.
- **Paper task (journal/Kite demo/lab):** Learning note: log each information source you use, with date, type (primary, secondary, unverified) and verification status. No action on tips.
- **Labs used:** none.
- **Safety / capital-first note:** Never act on a tip, group, or signal service. The book does not recommend stocks. Scams commonly use guaranteed-return and pressure tactics.
- **Time-sensitive facts to register:**
  - FII/DII data source and publication timing [VERIFY: NSE FII/DII page].
  - Participant category definitions [VERIFY: SEBI or NSE].
  - SEBI registration categories and public lookup [VERIFY: SEBI intermediaries page].
  - Current SEBI investor alerts on misleading tips [VERIFY: SEBI investor education].
- **Sources to cite:** SEBI investor education and alerts pages; SEBI registered intermediaries list; NSE FII/DII page; exchange announcement pages.
- **Estimated length:** medium
- **Open question:** Should "how to tell a scam" move into Track 8, given overlap with psychology? Current draft keeps it here as introductory.

---

## Track 2: Money and math (highest priority)

### T2.1 Why money math comes before charts
- **Page type:** Concept
- **Prerequisites:** T0.1, T0.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain why a win rate alone cannot determine the result of a trading approach.
  2. Calculate the equity path of a sequence of hypothetical trades given a fixed R.
  3. Compare two sizing choices on the same sequence and identify which one has the larger drawdown.
  4. Explain why cost and size numbers must be set before any chart is discussed.
- **Key ideas to teach (in order):**
  - A trade result has two parts: the direction (win or loss) and the size in rupees. The direction is uncertain. The size is chosen by the trader.
  - R: the rupee amount risked on a trade. Results are expressed in R so trades can be compared.
  - Win rate describes frequency. Average win and average loss describe size. Both are needed.
  - The same sequence of results with different sizes gives different equity paths and different drawdowns.
  - Charts show price, not size or costs. Money math is the layer that turns a chart idea into a result.
  - All numbers here are hypothetical and do not describe any real strategy.
- **Worked example (rupees):** Two traders each start with Rs 50,000. Both take the same ten hypothetical trades: four losses, then five wins, then one loss (5 wins, 5 losses; each win is 2R, each loss is 1R).
  - Trader A risks R = Rs 500 (1% of 50,000). Wins = +1,000, losses = -500. Path: 50,000 -> 49,500 -> 49,000 -> 48,500 -> 48,000 (four losses), then 49,000 -> 50,000 -> 51,000 -> 52,000 -> 53,000 (five wins), then 52,500 (final loss). Net = +2,500 (+5%). Worst drawdown = 2,000 / 50,000 = 4%.
  - Trader B risks R = Rs 5,000 (10% of 50,000). Wins = +10,000, losses = -5,000. Path: 45,000 -> 40,000 -> 35,000 -> 30,000 (four losses, a 40% drop), then 80,000 after five wins, then 75,000. Net = +25,000 (+50%). Worst drawdown = 20,000 / 50,000 = 40%.
  - Same win rate, same R-multiples, same sequence. The outcomes differ in path and drawdown because of size alone. Show the reversed order (five wins first) for B and show the end is the same but the path differs.
- **Visual / animation / simulator:** drawdown-compounding with two equity traces (A and B) on the same sequence.
- **Guided exercise:** Fill the equity table for Trader A (values above) with blanks for the reader to compute each step. Hints: each loss subtracts 500; each win adds 1,000.
- **Independent exercise:** Trader C uses R = Rs 1,000 (2%) on the same sequence. Compute the final equity, net return and worst drawdown. Answer: 46,000 minimum, 55,000 final, +10%, worst drawdown 8%. No hints.
- **Quiz focus:**
  - Same win rate and same R, different sizes: which drawdown is larger (scenario).
  - "A 50% win rate with 2R wins is profitable" (misconception; wrong answer: "yes"). Explain that the sequence and streaks still matter and this is hypothetical.
  - Spot the mistake: "I have a 60% win rate, so I am profitable." Explain missing size and cost.
  - Equity arithmetic (numeric: final equity for Trader A = 52,500).
- **Paper task (journal/Kite demo/lab):** Learning note in Lab 3: build a hypothetical ten-trade table for Trader A and B, and record worst drawdown. Mark mode: learning note.
- **Labs used:** Lab 1 (sizing), Lab 3 (journal).
- **Safety / capital-first note:** The chapter uses a hypothetical sequence that lets size look benign. Real results have streaks and gaps (T2.6, T2.10). Do not generalise.
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's own worked examples; Zerodha Varsity as reference only for position sizing concepts (link, no text).
- **Estimated length:** medium

### T2.2 Costs on a trade: brokerage, STT, GST, exchange, SEBI, stamp, DP
- **Page type:** Math/Calculator
- **Prerequisites:** T1.3, T2.1
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. List each cost component of a delivery trade and state its basis (per order, percentage of turnover, per scrip per sell day) [VERIFY each basis].
  2. Calculate total round-trip cost for a Rs 5,000 and a Rs 50,000 trade using a supplied rate table.
  3. Calculate the break-even price move from total cost as a percentage of position value.
  4. Explain why fixed charges weigh more on small trades.
  5. Confirm every rate against its official source before using it.
- **Key ideas to teach (in order):**
  - Cost components (names only until verified): brokerage, securities transaction tax (STT), exchange transaction charge, SEBI fee, stamp duty, GST (on some components), depository (DP) charge on sales [VERIFY: each component and basis].
  - Turnover = price x quantity for each leg. Round trip = buy turnover and sell turnover.
  - Proportional charges scale with turnover; fixed charges (per order, per scrip per day) do not.
  - Total cost = sum of components. Break-even move = total cost / position value (approximate; the exact figure depends on the exit price).
  - Costs are a drag on every trade. A small trade with fixed charges can cost a larger share of its value.
  - The book's cost figures come from data/facts.json (Lab 2). The chapter teaches the mechanism with DUMMY rates.
- **Worked example (rupees):** DUMMY MODEL (not any real charge; for arithmetic only): proportional 0.1% of turnover per leg; fixed Rs 20 per order; fixed Rs 50 DP charge per scrip on a sell day.
  - Rs 5,000 round trip, no price change: buy leg = 5.00 + 20 = 25.00. Sell leg = 5.00 + 20 + 50 = 75.00. Total = 100.00 = 2.0% of 5,000. Break-even move about 2.0%.
  - Rs 50,000 round trip: buy leg = 50 + 20 = 70. Sell leg = 50 + 20 + 50 = 120. Total = 190 = 0.38% of 50,000.
  - The DP fixed charge is 50 in both cases, so it is 1.0% of the small trade and 0.1% of the large one. Show the division.
  - These numbers will be replaced by verified rates in Lab 2. Do not quote the dummy figures as Zerodha or statutory figures.
- **Visual / animation / simulator:** lab-costs in a walkthrough mode with dummy rates labelled, and a static stacked bar showing component shares for the two trades.
- **Guided exercise:** DUMMY rates as above. Compute round-trip cost for a Rs 10,000 round trip. Answer: buy 10 + 20 = 30; sell 10 + 20 + 50 = 80; total 110 = 1.1%. Hints: compute each leg, then add.
- **Independent exercise:** Buy 100 shares at Rs 200 (Rs 20,000) and sell at Rs 210 (Rs 21,000) with DUMMY rates. Compute total cost, gross profit (Rs 1,000) and net profit. Answer: buy 20 + 20 = 40; sell 21 + 20 + 50 = 91; total 131; net 869. No hints.
- **Quiz focus:**
  - Fixed vs proportional charges on small trades (numeric and scenario).
  - "Zero brokerage means the trade is free" (misconception; wrong answer: "yes"). Explain other components.
  - Spot the mistake: using a rate from a blog post. Correct: verify from the official source with the date.
  - Basis of each charge: buy-only, sell-only, both legs (order question).
  - Break-even percent for Rs 5,000 with the dummy model (numeric: 2.0%).
- **Paper task (journal/Kite demo/lab):** Learning note: use the official Zerodha charges page and official calculator (online) to record the component list and output for one Rs 5,000 and one Rs 50,000 trade. Note the access date. Do not copy into the book until Lab 2 verifies them.
- **Labs used:** Lab 2 (cost calculator; golden tests against the official calculator).
- **Safety / capital-first note:** Costs can turn a small expected gain into a loss. Frequent round trips multiply costs (T2.12). Costs must be included in every plan.
- **Time-sensitive facts to register:**
  - Zerodha equity delivery brokerage [VERIFY: Zerodha charges page].
  - Zerodha intraday brokerage basis [VERIFY: Zerodha charges page] (for the comparison only).
  - STT rates and basis [VERIFY: official tax or exchange source].
  - Exchange transaction charge rates for NSE and BSE [VERIFY: NSE and BSE circulars or fee pages].
  - SEBI turnover fee [VERIFY: SEBI fees page].
  - Stamp duty rates by state law [VERIFY: relevant state stamp act or Indian Clearing Corporation documentation].
  - GST rate and base [VERIFY: GST portal].
  - DP charge: depository and DP components and the per-scrip-per-day rule [VERIFY: Zerodha charges; CDSL tariff].
  - Rounding rules [VERIFY: Zerodha official calculator].
- **Sources to cite:** Zerodha charges page and brokerage calculator; NSE and BSE fee and circular pages; SEBI fees page; Income Tax Department STT page; GST portal; CDSL and NSDL tariff pages.
- **Estimated length:** long
- **Open question:** Should intraday costs appear in this chapter or only in Lab 2? Current draft: structure only here, numbers in Lab 2.

### T2.3 Taxes on trading profits (concepts; rates [VERIFY])
- **Page type:** Concept
- **Prerequisites:** T2.2, T1.9
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Explain that tax depends on how the activity is classified and on holding period [VERIFY: classification rules].
  2. Distinguish, at concept level, capital gains from business income.
  3. Calculate an after-tax result using a rate symbol t supplied as a parameter.
  4. Identify the questions to take to a qualified tax professional.
  5. Explain loss set-off at concept level [VERIFY: rules].
- **Key ideas to teach (in order):**
  - Tax is separate from trading costs. It applies to net gains according to rules that depend on the activity.
  - Capital gains: the usual treatment when shares are held as investments [VERIFY].
  - Business income: the usual treatment when trading is frequent and treated as a business [VERIFY: classification factors].
  - Holding period determines short-term or long-term treatment for capital gains [VERIFY: thresholds and rates].
  - Intraday and speculative treatment differs from other categories [VERIFY].
  - Loss set-off and carry-forward: which losses can offset which gains, and for how long [VERIFY].
  - Turnover thresholds for tax audit in business treatment [VERIFY].
  - Dividends and their taxation (cross-reference T1.9) [VERIFY].
  - The book does not compute tax now. The calculator is deferred until the rates and rules are verified (PLAN section 4.6).
- **Worked example (rupees):** No rate is stated. Formula in words: net result = gross gain - trading costs - tax, where tax = rate x taxable base, and the taxable base depends on the classification [VERIFY]. Symbolic example: gross gain Rs 10,000; costs Rs 300; taxable base (if costs are deductible) = 9,700; net = 10,000 - 300 - t x 9,700. DUMMY illustration only (not a rate): if t were 20%, tax = 1,940 and net = 7,760. Show the algebra; do not use this number as a tax figure.
- **Visual / animation / simulator:** Static decision tree (Mermaid): "What is the activity?" questions (holding period, frequency, intent) leading to "ask a professional" with [VERIFY] on each branch. No rates.
- **Guided exercise:** Fill the formula with a gross gain of Rs 4,000 and costs of Rs 200 and a placeholder rate t. Write the net expression. Hints: taxable base first, then tax, then net.
- **Independent exercise:** List five questions you would bring to a qualified tax professional before your first year of trading. No hints.
- **Quiz focus:**
  - Tax is a percentage of turnover (misconception; wrong answer: "yes"). Correct: tax is on net gains by rule.
  - Holding period effect (scenario; wrong answer: all gains taxed the same).
  - Spot the mistake: "Delivery and intraday gains are taxed identically." Correct: classification and rates [VERIFY].
  - Loss set-off (scenario; wrong answer: losses are never usable).
  - Algebra: net expression from gross, costs and rate.
- **Paper task (journal/Kite demo/lab):** Learning note: for every trade, add a classification note column (holding period, intent, frequency). This builds the record needed later. No tax figure is calculated.
- **Labs used:** Lab 2 (deferred tax estimate, v1.1, only after verification).
- **Safety / capital-first note:** Tax can reduce the net return and can create a bill larger than expected in a loss year. This is not tax advice. The book does not give tax advice. Consult a qualified professional.
- **Time-sensitive facts to register:**
  - Classification rules for trading income [VERIFY: Income Tax Act; CBDT circulars].
  - Short-term and long-term capital gains rates and holding-period thresholds [VERIFY: Income Tax Act and current Finance Act].
  - Business income and speculative income treatment [VERIFY].
  - Loss set-off and carry-forward rules [VERIFY].
  - Tax audit turnover thresholds [VERIFY].
  - Tax regime choice and any changes [VERIFY].
  - Dividend taxation [VERIFY].
- **Sources to cite:** Income Tax Department website (incometaxindia.gov.in) and the Income Tax Act text; CBDT circulars; current Finance Act; SEBI and NSE tax-information pages where relevant; Zerodha Varsity tax section as reference (link only).
- **Estimated length:** medium
- **Open question:** The owner's own tax status (PLAN section 11, item 7) must be resolved before this chapter is final. The chapter stays conceptual until then.

### T2.4 Risk per trade and stop-loss distance (Lab 1)
- **Page type:** Math/Calculator
- **Prerequisites:** T2.1, T1.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the risk budget as capital x risk percentage.
  2. Calculate risk per share as entry minus stop for a long position.
  3. Calculate the stop distance as a percentage of entry and the planned loss at the stop.
  4. Explain why a tighter stop allows more shares for the same rupee risk, and why a wider stop allows fewer.
  5. Reject a long-trade plan whose stop is at or above entry.
- **Key ideas to teach (in order):**
  - Risk per trade is set before the trade, as a rupee amount derived from capital.
  - The stop is the price at which the trade idea is wrong. It is chosen for a reason, not to fit a budget.
  - Risk per share = entry - stop (long only in this track).
  - Stop distance % = risk per share / entry.
  - Shares = risk budget / risk per share, rounded down.
  - Never move a stop further away after entry to avoid a loss. This converts a planned loss into an unplanned one.
  - Noise and volatility measures for placing stops are taught in Track 5 (ATR); here only the arithmetic.
- **Worked example (rupees):** Capital Rs 50,000; risk 1% = Rs 500.
  - Entry Rs 250, stop Rs 240: risk per share Rs 10; stop distance 4%; shares = 500 / 10 = 50; position = 50 x 250 = Rs 12,500 (25% of capital); planned loss = 50 x 10 = Rs 500.
  - Stop Rs 245 (tighter): risk per share Rs 5; raw shares = 100; position Rs 25,000 (50% of capital, above the 25% default cap); with the cap, 12,500 / 250 = 50 shares. Shows the cap binds (detail in T2.5).
  - Stop Rs 230 (wider): risk per share Rs 20; shares = 25; position Rs 6,250 (12.5%); planned loss Rs 500.
- **Visual / animation / simulator:** position-size-viz (shares vs stop distance for the three stops above).
- **Guided exercise:** Capital Rs 50,000, risk 1%, entry Rs 400, stop Rs 384. Compute risk budget, risk per share, shares (rounded down), position and planned loss. Answer: budget 500; risk per share 16; raw 31.25, so 31 shares; position 12,400 (24.8%); planned loss 496 (Rs 4 of budget unused). Hints: round down, then recompute.
- **Independent exercise:** Capital Rs 30,000; risk 0.5%; entry Rs 120; stop Rs 111. Compute all outputs. Answer: budget 150; risk per share 9; 16 shares; position 1,920 (6.4%); planned loss 144. No hints.
- **Quiz focus:**
  - Stop above entry for a long (scenario; wrong answer: "accept it, it is a breakout"). Correct: invalid for a long stop.
  - Wider stop means more shares (misconception; wrong answer: "yes"; explain the division).
  - Rounding down (numeric; wrong answer: 31.25 shares or 32 shares).
  - Spot the mistake: "I'll widen my stop so I am not stopped out." Explain unplanned loss.
  - Risk % vs position % confusion (wrong answer: 1% risk means 1% position).
- **Paper task (journal/Kite demo/lab):** Lab 1: run the sensitivity strip for stop distances Rs 2, 5, 10 and 20 on one hypothetical entry. Record the shares and planned loss in a learning-note entry, mode learning note.
- **Labs used:** Lab 1.
- **Safety / capital-first note:** A 1% planned risk is not a 1% maximum loss if the stop can be gapped through (T2.6). Never raise the risk percentage after losses.
- **Time-sensitive facts to register:** none (the default 25% concentration cap and 1% risk are design defaults, not facts).
- **Sources to cite:** the book's Lab 1 specification; Zerodha Varsity as reference (link only) on position-sizing concepts.
- **Estimated length:** long

### T2.5 Position sizing step by step, cash cap, concentration cap (Lab 1)
- **Page type:** Math/Calculator
- **Prerequisites:** T2.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate shares using the five-step method with the risk, cash and concentration constraints.
  2. Identify which constraint is binding and explain why.
  3. Calculate position value as a percentage of capital.
  4. Explain how a tight stop can make a cash or concentration cap binding.
  5. Reject a plan whose position exceeds available cash.
- **Key ideas to teach (in order):**
  - Step 1: risk budget = capital x risk %.
  - Step 2: risk per share = entry - stop.
  - Step 3: raw shares = floor(risk budget / risk per share).
  - Step 4: cash cap = floor(capital / entry). Long delivery needs the cash to buy; no leverage.
  - Step 5: concentration cap = floor(capital x max position % / entry). The default 25% is a design setting in Lab 1, configurable by the owner.
  - Shares = minimum of the three. State the binding constraint.
  - Whole shares are used throughout this track.
  - Costs are added in Lab 1 for the true loss (T2.2).
- **Worked example (rupees):**
  - Example A: capital Rs 50,000; entry Rs 250; stop Rs 240. Risk budget 500; risk per share 10; raw = 50; cash cap = floor(50,000 / 250) = 200; concentration = floor(12,500 / 250) = 50. Shares = 50. Binding: risk budget (and the concentration cap ties).
  - Example B: capital Rs 10,000; entry Rs 250; stop Rs 248. Risk budget 100; risk per share 2; raw = 50 (would cost Rs 12,500, more than the account); cash cap = floor(10,000 / 250) = 40; concentration = floor(2,500 / 250) = 10. Shares = 10. Binding: concentration cap. Planned loss = 10 x 2 = Rs 20, only 0.2% of capital. The budget was not used because the cap bound.
  - Lesson: a tighter stop does not mean a larger position. It can mean a larger allowed size that the caps then reduce.
- **Visual / animation / simulator:** position-size-viz with three bars (raw, cash cap, concentration cap) and the minimum highlighted.
- **Guided exercise:** Capital Rs 50,000; risk 1%; entry Rs 400; stop Rs 380. Answer: budget 500; risk per share 20; raw 25; cash cap 125; concentration floor(12,500 / 400) = 31; shares 25; binding risk; position 10,000 (20%); planned loss 500. Hints: compute all three limits before taking the minimum.
- **Independent exercise:** Capital Rs 25,000; risk 1%; entry Rs 200; stop Rs 190. Compute the three limits, the shares, the binding constraint, the position and the planned loss. Answer: raw 25; cash 125; concentration 31; shares 25; binding risk; position 5,000 (20%); planned loss 250. No hints.
- **Quiz focus:**
  - Which cap binds (scenario with three numbers).
  - Cash cap ignored (misconception; wrong answer: shares = risk budget / risk per share is always affordable).
  - Spot the mistake: shares = risk budget / entry (wrong denominator). Correct: risk per share.
  - Rounding up (wrong answer: 26 instead of 25).
  - Tight stop with small account (Example B reasoning).
- **Paper task (journal/Kite demo/lab):** Lab 3 plan entries for three hypothetical setups: planned shares, binding constraint, planned loss. Mode: learning note or paper.
- **Labs used:** Lab 1, Lab 3 (plan form).
- **Safety / capital-first note:** Caps reduce size but do not reduce the risk of the idea. No leverage. No adding shares to a losing position to lower the average (averaging down).
- **Time-sensitive facts to register:**
  - Tick size if prices are rounded in a plan [VERIFY: NSE tick size page].
  - Lot size for cash equity is a design assumption of whole shares; confirm current rule if the owner's data is used [VERIFY].
- **Sources to cite:** Lab 1 specification (LABS.md); NSE tick size page.
- **Estimated length:** long

### T2.6 Slippage, gaps and planned risk vs actual execution risk
- **Page type:** Concept (with Math/Calculator elements)
- **Prerequisites:** T2.4, T2.5, T1.7
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the planned loss and the actual loss when an overnight gap fills below the stop.
  2. Express the actual loss as a multiple of R.
  3. Explain slippage as the difference between an expected and an actual fill price.
  4. Explain why a stop is an instruction, not a guarantee, and why circuits can block an exit.
  5. Size a position so that a stated gap assumption keeps the loss within a stated limit.
- **Key ideas to teach (in order):**
  - Planned risk = (entry - stop) x shares. This is the plan, not the maximum possible loss.
  - Execution risk = the loss actually realised at the fill.
  - Gap: a price opens below the stop (overnight news, global moves, corporate action). A stop triggers at the first available price, which can be far from the stop.
  - Slippage: difference between expected and actual fill, from spread, depth and order type.
  - Circuits can prevent exit altogether (T1.7).
  - End-of-day swing trades carry overnight gap risk by design.
  - Order-type behaviour on stops differs (SL vs SL-M) and must be checked with the official source (T4.4).
  - Stress test: choose a gap assumption (owner's choice) and size so that the gap loss stays within a limit.
- **Worked example (rupees):** Capital Rs 50,000; risk 1% = Rs 500; entry Rs 250; stop Rs 240; shares 50; planned loss Rs 500 (1R).
  - Overnight news: the stock opens at Rs 232. The stop triggers at the open. Assume fill at Rs 232 (gap through the stop): loss = 50 x (250 - 232) = Rs 900 = 1.8R = 1.8% of capital.
  - With additional slippage of Rs 2 per share (illustrative), fill at Rs 230: loss = 50 x 20 = Rs 1,000 = 2R = 2% of capital.
  - Planned 1% became realised 2%.
- **Visual / animation / simulator:** sl-trigger-sim in gap-through-stop mode, showing trigger, open, fill and planned vs actual loss bars.
- **Guided exercise:** Using the example, compute the actual loss in rupees and in R if the open is Rs 236 and fill is at the open. Answer: 50 x 14 = Rs 700 = 1.4R. Hints: loss per share first.
- **Independent exercise:** Stress test: with the same entry (Rs 250) and stop (Rs 240), the owner assumes a gap to Rs 220 and wants the gap loss within Rs 500. How many shares? Answer: loss per share 30; 500 / 30 = 16.67, so 16 shares (loss Rs 480). State that the gap assumption is the owner's choice. No hints.
- **Quiz focus:**
  - A stop guarantees a maximum loss (misconception; wrong answer: "yes").
  - Gap fill price (scenario: fill at stop or at open?).
  - Spot the mistake: "Planned risk equals maximum loss." Correct: not in a gap or circuit.
  - Stress test calculation (numeric: 16 shares).
  - Order-type misconception: a stop-limit order always fills at its trigger (wrong answer: "yes").
- **Paper task (journal/Kite demo/lab):** Lab 3: add planned and actual loss fields for three hypothetical trades, with a gap scenario. Mode: learning note. Record slippage fields (slippage_entry_inr, slippage_exit_inr).
- **Labs used:** Lab 3 (slippage fields), Lab 1 (slippage buffer), Lab 4 (gap fills, later).
- **Safety / capital-first note:** This is the main reason planned risk is not a fixed ceiling. Holidays, news and circuits can produce losses above the plan. Size for the stress test, not only for the chart.
- **Time-sensitive facts to register:**
  - Stop order types and trigger behaviour on Kite [VERIFY: Zerodha support on SL and SL-M orders].
  - Exchange rules for stop and trigger orders [VERIFY: NSE order types].
  - Circuit rules (cross-reference T1.7) [VERIFY].
- **Sources to cite:** Zerodha support on stop-loss orders; NSE order-type documentation; NSE circuit limit pages.
- **Estimated length:** long

### T2.7 Reward-to-risk, win rate, break-even win rate
- **Page type:** Math/Calculator
- **Prerequisites:** T2.1, T2.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the R-multiple of a planned target from entry, stop and target prices.
  2. Calculate the break-even win rate as 1 / (1 + R) and apply it to three R values.
  3. Show how costs raise the break-even win rate.
  4. Reject a plan whose R is below the owner's minimum.
  5. Explain why a high R with a low win rate is a trade-off, not a guarantee.
- **Key ideas to teach (in order):**
  - Reward-to-risk R = (target - entry) / (entry - stop), for a long.
  - Break-even win rate before costs = 1 / (1 + R). Derivation: W x R = (1 - W) x 1, so W = 1 / (1 + R).
  - Costs are a loss on every trade. Express them in R: cost per trade / R. This raises the required win rate.
  - Win rate and R trade off in most approaches; neither alone decides the result.
  - A target is a plan. Many approaches do not use a fixed target (Track 6).
- **Worked example (rupees):** Entry Rs 250; stop Rs 240 (risk Rs 10); target Rs 270 (reward Rs 20). R = 20 / 10 = 2. Break-even before costs = 1 / 3 = 33.3%.
  - Costs (DUMMY): Rs 100 round trip on 50 shares = Rs 2 per share. Per-share risk becomes 10 + 2 = 12 and reward becomes 20 - 2 = 18. Break-even W: W x 18 = (1 - W) x 12, so 30W = 12, W = 40%. Check: 0.4 x 18 = 7.2 and 0.6 x 12 = 7.2.
  - Other R values: target Rs 260 (R = 1): break-even 50%. Target Rs 280 (R = 3): break-even 25%.
- **Visual / animation / simulator:** Static bar chart of break-even win rate against R, with the costed line shown dashed.
- **Guided exercise:** Entry Rs 400; stop Rs 380; target Rs 460. Compute R and break-even before costs. Answer: risk 20; reward 60; R = 3; break-even 25%. Hints: compute risk and reward per share first.
- **Independent exercise:** Entry Rs 150; stop Rs 144; target Rs 165. Compute R and break-even before costs. Answer: R = 2.5; break-even 28.6%. Then, with a DUMMY cost of Rs 0.50 per share, recompute break-even (answer: risk 6.5, reward 14.5, W = 6.5 / 21 = 31.0%). No hints.
- **Quiz focus:**
  - Break-even at R = 2 (numeric: 33.3%). Wrong answers: 50%, 66.7%, 200%.
  - Costs lower break-even (misconception; wrong answer: "yes"). Correct: costs raise it.
  - "Higher R is always better" (wrong answer: "yes"). Explain the trade-off.
  - Spot the mistake: using win rate without R to judge a plan.
  - Scenario: a plan with R = 1.2 and an owner minimum of 1.5 (reject).
- **Paper task (journal/Kite demo/lab):** Lab 1 R field: record planned R for three hypothetical plans, with break-even before and after dummy costs. Mode: learning note.
- **Labs used:** Lab 1 (R and break-even), Lab 3.
- **Safety / capital-first note:** R is a plan, not a forecast. Target prices are not reached reliably. Do not choose targets to make R look good.
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's Lab 1 specification; standard expectancy arithmetic (computed in-book, no external figure).
- **Estimated length:** medium

### T2.8 Expectancy and profit factor; why a 90% win rate can still lose money
- **Page type:** Math/Calculator
- **Prerequisites:** T2.7
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate expectancy in R and in rupees from win rate and average win and loss.
  2. Calculate profit factor from gross profit and gross loss.
  3. Demonstrate that a 90% win rate can have negative expectancy.
  4. Explain why one large loss can dominate a sample.
  5. Choose the system with higher expectancy from supplied numbers, and state the sample-size limit.
- **Key ideas to teach (in order):**
  - Expectancy per trade = (win rate x average win) - (loss rate x average loss). In R: W x avgWinR - (1 - W) x avgLossR.
  - Profit factor = gross profit / gross loss. Above 1 means gross profit exceeds gross loss in the sample; undefined when there are no losses.
  - Expectancy is an average over many trades, not a prediction of the next trade.
  - Costs must be included to get net expectancy.
  - Sample size: a few trades can produce any average. Confidence is taught in T7.8 and Lab 3.
  - Win rate is a frequency, not a result.
- **Worked example (rupees):** R = Rs 1,000 (2% of Rs 50,000).
  - System X (hypothetical): 9 wins of Rs 300 (0.3R) and 1 loss of Rs 4,000 (4R, a gap through the stop). Expectancy = 0.9 x 300 - 0.1 x 4,000 = 270 - 400 = -Rs 130 per trade (-0.13R). Profit factor = 2,700 / 4,000 = 0.675. Over 10 trades: -1,300 = -2.6% of Rs 50,000.
  - System Y (hypothetical): 40% wins of 2R (Rs 2,000) and 60% losses of 1R (Rs 1,000). Expectancy = 0.4 x 2,000 - 0.6 x 1,000 = 800 - 600 = +Rs 200 per trade (+0.2R). Profit factor over 10 trades = 8,000 / 6,000 = 1.33.
  - Y has the higher expectancy despite the lower win rate. Neither example is evidence that either approach works.
- **Visual / animation / simulator:** Static paired bar chart (profit and loss per trade) for X and Y. Spot-the-mistake widget can use the same numbers.
- **Guided exercise:** System Z: 60% wins of Rs 1,000; 40% losses of Rs 800. Compute expectancy and profit factor for 10 trades. Answer: expectancy +280 per trade; profit factor 6,000 / 3,200 = 1.875. Hints: wins and losses per trade, then totals.
- **Independent exercise:** System W: 75% wins of Rs 500; 25% losses of Rs 2,000. Compute expectancy and profit factor on 4 trades. Answer: expectancy -125; profit factor 1,500 / 2,000 = 0.75. No hints.
- **Quiz focus:**
  - Expectancy arithmetic (numeric: -130 for X).
  - "9 wins out of 10 means the system is good" (wrong answer: "yes").
  - Profit factor with no losses (wrong answer: infinity is always useful; correct: undefined and shows that more data is needed).
  - Scenario: two systems; pick higher expectancy (Y).
  - Spot the mistake: judging on win rate alone. Correct: use expectancy and profit factor, and state sample size.
- **Paper task (journal/Kite demo/lab):** Lab 3 statistics: enter ten hypothetical rows for System X and check that the dashboard computes -130 expectancy. Mode: learning note.
- **Labs used:** Lab 3 (statistics), Lab 1 (R).
- **Safety / capital-first note:** High win rates appear in marketing and can hide negative expectancy. Expectancy from few trades is noise. The gate G6 floor of 30 trades is a minimum, not a verdict (PLAN section 6).
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's Lab 3 specification; T7.8 (metrics limits) for further reading.
- **Estimated length:** long

### T2.9 Drawdown and recovery math; compounding; risk of ruin
- **Page type:** Math/Calculator
- **Prerequisites:** T2.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate drawdown as a percentage from a peak and a trough.
  2. Calculate the gain needed to recover a given loss.
  3. Show that equal percentage gains and losses do not cancel.
  4. Explain risk of ruin conceptually and why it rises with risk per trade.
  5. Choose the largest risk percentage that keeps a hypothetical drawdown within a stated limit.
- **Key ideas to teach (in order):**
  - Drawdown = (peak equity - trough equity) / peak equity.
  - Recovery gain = drawdown / (1 - drawdown). A loss of d needs a gain of d / (1 - d) to return to the peak.
  - Asymmetry: losses and gains are not symmetric. A 50% loss needs a 100% gain.
  - Compounding: +10% then -10% gives -1%, not zero.
  - Risk of ruin: the probability that equity falls to a level from which the plan cannot continue. It depends on edge, risk per trade and streaks. The book computes it by simulation in Lab 4, not by a shortcut here.
  - Smaller risk per trade lowers the chance of deep drawdowns for the same sequence of outcomes.
- **Worked example (rupees):** Equity path Rs 50,000 -> 55,000 -> 48,000 -> 52,000. Peak 55,000; trough 48,000; drawdown = 7,000 / 55,000 = 12.7%. Recovery to the peak from 48,000 needs 7,000 / 48,000 = 14.6%.
  - Compounding: Rs 50,000 +10% = 55,000; then -10% = 49,500; net -1%.
  - Table: loss 10% needs 11.1%; loss 20% needs 25%; loss 30% needs 42.9%; loss 50% needs 100%; loss 75% needs 300%. Show one row computed.
- **Visual / animation / simulator:** drawdown-compounding: recovery curve with a slider for loss size, showing the gain required.
- **Guided exercise:** Path Rs 50,000 -> 45,000 -> 39,000 -> 44,000. Compute peak, trough, drawdown and recovery gain from trough. Answer: peak 50,000; trough 39,000; drawdown 22.0%; recovery gain 11,000 / 39,000 = 28.2%. Hints: find the peak before the trough.
- **Independent exercise:** Capital Rs 50,000. The owner's drawdown limit is 15%. The path falls 20% and then recovers. Does the path breach the limit? What gain is needed from the trough? Answer: yes, 20% > 15%; recovery gain 25%. No hints.
- **Quiz focus:**
  - Recovery gain for 50% (numeric: 100%).
  - "Equal up and down percentages cancel" (wrong answer: "yes").
  - Risk of ruin = losing everything once (wrong answer: "yes"). Correct: it is a gradual probability over many trades.
  - Spot the mistake: recovery gain equals the loss percentage.
  - Scenario: a 25% drawdown limit with a 2% risk per trade; identify the number of consecutive losses to breach (see T2.10).
- **Paper task (journal/Kite demo/lab):** Lab 3 drawdown chart from the ten-row hypothetical table in T2.1. Record the max drawdown in Rs and %. Mode: learning note.
- **Labs used:** Lab 3 (drawdown), Lab 4 (risk of ruin simulation, later).
- **Safety / capital-first note:** Deep drawdowns can make recovery impossible within the owner's time or capital. Withdrawals during drawdown are not allowed (T2.17).
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's Lab 3 and Lab 4 specifications; standard drawdown arithmetic (computed in-book).
- **Estimated length:** long

### T2.10 Consecutive losses and losing streaks (streak-sim)
- **Page type:** Math/Calculator
- **Prerequisites:** T2.9, T2.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the probability of k consecutive losses starting at a given trade, assuming independent trades, as (1 - p)^k.
  2. Calculate capital lost over N consecutive losing trades at a fixed risk percentage.
  3. Explain why losing streaks are expected in low-win-rate approaches and why they feel abnormal.
  4. Choose a streak rule (for example, a pause after N losses) and justify it with numbers.
  5. Reject the reasoning "I am due a win".
- **Key ideas to teach (in order):**
  - Probability of a loss on one trade = 1 - p (p is the win rate).
  - Independence: the formula assumes each trade is independent. Real markets may cluster; the Monte Carlo in Lab 4 and T7.9 tests this.
  - Probability of k losses starting at a given trade = (1 - p)^k. Across many trades, the chance of at least one such streak is much larger than for one starting point.
  - Each loss at fixed R% reduces capital, so each later loss is a smaller rupee amount if sized on current capital.
  - Streak rules (owner's choice): pause after N losses, reduce risk after N losses, review. Never increase size after losses.
  - Martingale-style doubling after losses is dangerous (T6.5).
- **Worked example (rupees):**
  - Win rate 60%: probability of a loss = 0.4. Probability of 5 losses starting at a given trade = 0.4^5 = 0.01024, about 1.0%. For 3 losses: 0.4^3 = 0.064, about 6.4%.
  - Win rate 40%: probability of a loss = 0.6. For 5 losses: 0.6^5 = 0.07776, about 7.8%.
  - Capital lost at 1% risk on Rs 50,000 (each loss is 1% of current capital): 5 losses = 50,000 x (1 - 0.99^5) = Rs 2,450 (approx); 10 losses = Rs 4,781 (approx); 15 losses = Rs 6,997 (approx).
  - Capital lost at 2% risk: 5 losses = Rs 4,804; 10 losses = Rs 9,146; 15 losses = Rs 13,072 (approx).
  - Rs 10,000 at 1%: 5 losses about Rs 490; 10 about Rs 956; 15 about Rs 1,399.
- **Visual / animation / simulator:** streak-sim at 40% and 60% win rates: a grid of simulated trades showing streak lengths, with a text summary of the longest streak.
- **Guided exercise:** Win rate 45%: probability of 3 losses in a row starting at a given trade. Answer: 0.55^3 = 0.1664, about 16.6%. Hints: loss probability first.
- **Independent exercise:** Capital Rs 50,000; risk 1% per trade; 7 consecutive losses. Compute remaining capital (50,000 x 0.99^7 = Rs 46,603, approximately) and total lost (about Rs 3,397). No hints.
- **Quiz focus:**
  - Probability arithmetic (numeric: 0.1664 for 45% win rate).
  - "I am due a win after 5 losses" (wrong answer: "yes"). Explain independence and the assumption.
  - Spot the mistake: doubling size after losses to recover faster. Correct: martingale-style, banned by the capital-first rules.
  - Scenario: an owner rule to pause after 5 losses; identify whether a 1% per-trade risk pause is reached first.
  - Streak = system broken (wrong answer: "yes"). Correct: streaks are expected at some frequency; a streak alone is not evidence.
- **Paper task (journal/Kite demo/lab):** Learning note: record a hypothetical streak of seven losses at 1% risk in the journal, with the emotion_before field, and state the capital at each step.
- **Labs used:** Lab 4 (trade-order Monte Carlo, later), Lab 3 (streak statistics).
- **Safety / capital-first note:** Streaks are the period when rule breaks happen (revenge trading, size increases). Write the streak rule before the streak starts.
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's Lab 4 Monte Carlo specification; T7.9; T8.6 (living through streaks).
- **Estimated length:** long
- **Open question:** Should the independence assumption be stated more strongly in this chapter, or left to T7.9 only?

### T2.11 Risk limits: per trade, daily, weekly, monthly; max trades; stop rules; reducing exposure (risk-limit-simulator)
- **Page type:** Math/Calculator
- **Prerequisites:** T2.5, T2.10
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate per-trade, daily, weekly and monthly loss limits in rupees from percentages of capital.
  2. Calculate remaining daily and weekly limit after a sequence of losses.
  3. State the stop-trading action when a limit is reached.
  4. Apply a reduce-exposure rule after a drawdown.
  5. Explain why the owner's Rs 2,000-3,000 figure is a ceiling and not a per-day risk.
- **Key ideas to teach (in order):**
  - Limit hierarchy: per trade (smallest), then daily, weekly, monthly; plus maximum trades per day.
  - Limits are set before trading and written down. They are not adjusted after a loss.
  - Stop rules: when a daily limit is reached, no more trades that day. No revenge trades, no recovery attempts.
  - Reduce exposure: a pre-set rule, for example halving the risk percentage after a set drawdown. Numbers are illustrative.
  - Limits are a rule-based control. They cannot prevent gap losses above the limit (T2.6).
  - Broker and exchange risk controls exist and differ from the book's limits [VERIFY].
  - The base for percentages (starting capital or current equity) must be stated.
- **Worked example (rupees):** Illustrative limits (not recommendations): capital Rs 50,000; per trade 1% = Rs 500; daily 2% = Rs 1,000; weekly 4% = Rs 2,000; monthly 8% = Rs 4,000; maximum 2 trades per day.
  - Day 1: trade 1 loses Rs 500 (remaining daily 500); trade 2 loses Rs 500 (remaining daily 0). Stop for the day. Trade 3 is not allowed.
  - Day 2: loss of Rs 1,000 again. Weekly used = 2,000 = limit. Stop for the week.
  - Reduce exposure example: monthly drawdown reaches 10% (Rs 5,000); per-trade risk halves to 0.5% = Rs 250 on the current capital rule (state the rule's base).
- **Visual / animation / simulator:** risk-limit-simulator: a ladder of limits filling with each trade and turning to a "stop" state at the first breach.
- **Guided exercise:** Capital Rs 30,000 with per-trade 1%, daily 2%, weekly 4%, monthly 8%. Compute each limit. Answers: Rs 300, Rs 600, Rs 1,200, Rs 2,400. After two losses of Rs 300 in a day, remaining daily = 0. Hints: percentage of capital, then subtract losses.
- **Independent exercise:** Capital Rs 20,000; daily limit 3%; weekly limit 6%; monthly 10%. Each trade loses Rs 150. How many losing trades until the daily limit is reached? Answer: 600 / 150 = 4 trades. Then state the stop rule. No hints.
- **Quiz focus:**
  - Limit arithmetic (numeric).
  - "One more trade to recover the day's loss" (wrong answer: "yes"; explain revenge trading).
  - Reduce exposure misread as increase (scenario: after a drawdown, does the rule say increase?).
  - Spot the mistake: computing the daily limit on the day's higher equity without stating the base.
  - Scenario: the owner's daily ceiling Rs 2,000 vs per-trade Rs 500: identify the difference.
- **Paper task (journal/Kite demo/lab):** Learning note: write a one-page limit card with all limits and the stop rule; in the journal, keep a daily remaining-limit line for five hypothetical days. Mode: learning note.
- **Labs used:** Lab 1 (limit inputs), Lab 3 (limit-breach log and daily P&L), gate G4 (risk-limit simulator).
- **Safety / capital-first note:** The limit is the protection. Once it is hit, trading stops. Revenge trading after a breach is the most common way a plan turns into a large loss.
- **Time-sensitive facts to register:**
  - Broker risk controls and intraday auto square-off rules [VERIFY: Zerodha support; SEBI circulars].
- **Sources to cite:** the book's Lab 1 and Lab 3 specifications; Zerodha support pages on risk controls; SEBI circulars on risk management.
- **Estimated length:** long
- **Open question:** Default values for the illustrative limits must be the owner's decision. The chapter uses placeholders only.

### T2.12 Overtrading and why daily profit targets encourage it
- **Page type:** Math/Calculator
- **Prerequisites:** T2.8, T2.11, T0.2
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the number of trades needed per day to reach a target, given an expectancy per trade.
  2. Show that costs multiply the number of trades needed.
  3. Explain how a daily target pushes trades into weaker setups.
  4. Identify four signs of overtrading in a journal.
  5. Set a maximum trades per day rule and justify it.
- **Key ideas to teach (in order):**
  - Trades needed = target / net expectancy per trade.
  - Expectancy per trade is usually small relative to R. Small expectancy means many trades.
  - Costs are paid on every trade; net expectancy = expectancy - cost per trade.
  - More trades mean more exposure to noise, more costs and more chances to break rules.
  - A daily target is a pressure. It makes a no-trade day feel like a loss, which encourages trading when no setup exists.
  - The owner's Rs 2,000-3,000 is a ceiling, not a target (T2.16).
  - Signs of overtrading: trades outside the checklist, trade count above the limit, increased size, trading to recover.
- **Worked example (rupees):** Assumed for arithmetic only, not an estimate: R = Rs 500; expectancy = 0.1R = Rs 50 per trade; target Rs 2,000 per day.
  - Trades needed = 2,000 / 50 = 40 trades per day. Over 250 trading days (assumed), 40 x 250 = 10,000 trades a year.
  - Add a DUMMY cost of Rs 40 per round trip: net expectancy = 50 - 40 = Rs 10. Trades needed = 2,000 / 10 = 200 per day.
  - The cost assumption turns the target into 200 trades. Show the arithmetic step by step.
- **Visual / animation / simulator:** Static chart: trades needed per day against net expectancy per trade, for target Rs 2,000. Mark the 200-trade point.
- **Guided exercise:** Target Rs 1,000 per day; expectancy Rs 25 per trade; dummy cost Rs 15. Compute trades needed before and after costs. Answer: 40 trades; net 10; 100 trades. Hints: net first.
- **Independent exercise:** Target Rs 3,000 per day; R = Rs 400; expectancy 0.15R; dummy cost Rs 30 per trade. Compute net expectancy, trades per day and trades per week (five days). Answer: expectancy 60; net 30; 100 trades per day; 500 per week. No hints.
- **Quiz focus:**
  - Trades-needed arithmetic (numeric).
  - "Trading more when behind target is safer because the average evens out" (wrong answer: "yes").
  - Spot the mistake: "I'll take one more trade to hit the target." Explain.
  - Costs (scenario: why net, not gross, matters).
  - Overtrading signs (multi-select).
- **Paper task (journal/Kite demo/lab):** Lab 3: log trade count per day and a checklist-passed Y/N column for one week of hypothetical or learning entries. Record one no-trade day. Mode: learning note.
- **Labs used:** Lab 3 (trade count, plan adherence), gate G4.
- **Safety / capital-first note:** Overtrading is the most direct path from a small edge to a loss, because costs and noise scale with trade count. A no-trade day is a valid result.
- **Time-sensitive facts to register:** none (costs in this chapter are DUMMY and link to T2.2 verification).
- **Sources to cite:** the book's Lab 3 specification; T8.4 (discipline) and T8.2 (revenge trading) for behavioural links.
- **Estimated length:** medium

### T2.13 Leverage and margin: theory only, how they magnify loss (leverage-demo)
- **Page type:** Math/Calculator (theory only)
- **Prerequisites:** T2.9, T2.4
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the leverage ratio as position value divided by own capital.
  2. Calculate the gain or loss on own capital with and without leverage for a given price move.
  3. Calculate the price move that wipes out own capital for a given leverage ratio (1 / leverage).
  4. Explain, at concept level, margin, margin calls and forced sales, and that the broker's rules must be checked.
  5. Reject leverage as a method to reach a target.
- **Key ideas to teach (in order):**
  - Leverage: controlling a position larger than own capital with borrowed funds or margin.
  - Leverage ratio = position value / own capital.
  - Gains and losses are both multiplied by the ratio, in percent of own capital.
  - Wipe-out move = 1 / leverage ratio (for a long).
  - Margin: funds or securities deposited or borrowed to support the position [VERIFY: current margin rules].
  - Margin calls and forced liquidation can sell at the worst time.
  - Financing costs apply to borrowed funds [VERIFY: rates and policy].
  - Intraday leverage has auto square-off rules [VERIFY].
  - This book does not practise leverage. The demo is theory only.
- **Worked example (rupees):** Own capital Rs 50,000.
  - Unleveraged: buy Rs 50,000 of stock. Price falls 10%: loss Rs 5,000 = 10% of own capital.
  - Hypothetical 2x: position Rs 1,00,000 (Rs 50,000 own and Rs 50,000 borrowed; not an offer or any broker's product). Price falls 10%: loss Rs 10,000 = 20% of own capital. Price rises 10%: gain Rs 10,000 = 20%.
  - Wipe-out move at 2x: 1 / 2 = 50%. Price falls 50%: position value Rs 50,000 = own capital wiped out.
  - Wipe-out at 4x: 1 / 4 = 25%.
- **Visual / animation / simulator:** leverage-demo in theory mode: sliders for leverage ratio and price move, showing gain or loss on own capital and the wipe-out line. No trading controls.
- **Guided exercise:** Own capital Rs 20,000; position Rs 60,000 (3x); price falls 15%. Compute loss in rupees and as % of own capital. Answer: 9,000 loss, 45%. Hints: loss on position first.
- **Independent exercise:** Own capital Rs 25,000 at 4x leverage. Compute the price fall that wipes out capital and the loss at a 10% fall. Answer: 25% wipe-out; loss 10,000 (40%). No hints.
- **Quiz focus:**
  - Leverage increases only gains (misconception; wrong answer: "yes").
  - Wipe-out move (numeric: 50% at 2x).
  - "2x leverage means I can lose only twice my loss" (scenario; explain percentage on own capital).
  - Margin is free money (wrong answer: "yes"; financing and forced sale).
  - Spot the mistake: "A stop protects me from margin calls." Explain gap risk.
- **Paper task (journal/Kite demo/lab):** Learning note: complete the 1x, 2x, 3x and 4x table for a Rs 50,000 own capital and a 10% fall. Do not look for leverage features in the Kite demo; the book has no practice path.
- **Labs used:** Lab 1 (flags leverage above 1x as rejected for cash trades).
- **Safety / capital-first note:** No leverage or margin for beginners. F&O is theory only in Track 9. Leverage is the fastest route to losing the whole account.
- **Time-sensitive facts to register:**
  - Margin framework and collateral rules [VERIFY: SEBI margin circulars; Zerodha margin page].
  - Intraday auto square-off timing and rules [VERIFY: Zerodha support; NSE circulars].
  - Financing or interest rates on margin funding [VERIFY: Zerodha charges page].
  - F&O margin basics (for the theory chapter T9.1) [VERIFY].
- **Sources to cite:** SEBI margin framework circulars; Zerodha support on margin and MIS; NSE margin pages.
- **Estimated length:** medium

### T2.14 Portfolio exposure and concentration
- **Page type:** Math/Calculator
- **Prerequisites:** T2.5, T2.11, T1.8
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate deployed capital, cash and exposure percentages from holdings.
  2. Calculate open risk as the sum of planned losses at each stop, and express it as a percentage of capital.
  3. Calculate sector concentration from holdings.
  4. Explain why correlated positions count as one larger bet.
  5. Reject a new position that breaches the concentration or open-risk limit.
- **Key ideas to teach (in order):**
  - Exposure = value of positions. Exposure is not risk.
  - Open risk = sum over positions of (entry - stop) x shares. It is the planned loss if every stop fills at the stop.
  - Concentration: share of capital in one stock, one sector, or one theme.
  - Correlation: stocks in the same sector often move together. Five stocks in one sector are closer to one bet than five separate bets.
  - Diversification reduces single-event risk, not market risk.
  - Limits: owner's maximum per position, per sector and total open risk.
- **Worked example (rupees):** Capital Rs 50,000. Holdings:
  - Position A (Sector X): value Rs 10,000 (20%); stop loss planned Rs 500.
  - Position B (Sector X): value Rs 12,500 (25%); planned loss Rs 500.
  - Position C (Sector Y): value Rs 7,500 (15%); planned loss Rs 300.
  - Deployed = 30,000 (60%); cash = 20,000 (40%). Open risk = 500 + 500 + 300 = Rs 1,300 = 2.6% of capital.
  - Sector X = 22,500 / 50,000 = 45%.
  - New position D (Sector X): value Rs 6,000, planned loss Rs 300. Sector X would be 28,500 / 50,000 = 57%. With an illustrative 40% sector limit, reject. State the rule that caused the rejection.
- **Visual / animation / simulator:** Static stacked bar: capital split by position and sector, with a limit line. Use text labels (not colour only).
- **Guided exercise:** Using the holdings above, compute deployed %, open risk % and Sector Y share. Answers: 60%, 2.6%, 15%. Hints: sum values, then divide.
- **Independent exercise:** Four positions, each at 25% of capital, each with a planned loss of 1% of capital. Compute total open risk and deployed %. Answer: open risk 4%; deployed 100%, cash 0. Then state why this is a concentration problem if all four are in one sector. No hints.
- **Quiz focus:**
  - Exposure vs risk (misconception; wrong answer: "exposure is the risk").
  - "I have five stocks, so I am diversified" (scenario; wrong answer: "yes" if all in one sector).
  - Open risk arithmetic (numeric: 2.6%).
  - Spot the mistake: adding a position without updating sector totals.
  - Correlation (wrong answer: stocks in one sector move independently).
- **Paper task (journal/Kite demo/lab):** Learning note: weekly portfolio snapshot in the journal with each position's value, sector and planned loss, for hypothetical holdings. Mode: learning note or paper.
- **Labs used:** Lab 3 (open risk), Lab 1 (concentration cap).
- **Safety / capital-first note:** Adding to a losing sector position to lower average cost increases concentration (averaging down). Check limits before adding.
- **Time-sensitive facts to register:**
  - Sector classification source for the owner's data [VERIFY: NSE sectoral index definitions].
- **Sources to cite:** NSE sectoral index methodology; the book's Lab 1 and Lab 3 specifications.
- **Estimated length:** medium

### T2.15 Capital allocation framework: how much to allocate, what stays untouched, when to cut or stop (capital-allocation-planner)
- **Page type:** Math/Calculator
- **Prerequisites:** T0.2, T2.11, T2.14
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Separate total savings into household obligations, emergency reserve and trading capital according to the owner's rules.
  2. Calculate trading capital as a percentage of total savings and the untouched amount.
  3. State cut and stop triggers in rupees and percent of trading capital.
  4. Calculate the per-trade risk from the allocated (current) trading capital.
  5. Explain why trading capital shrinks or pauses after drawdowns, and why it is never topped up from household money.
- **Key ideas to teach (in order):**
  - Layers: (1) household obligations and emergency reserve, never traded; (2) trading capital, a fixed amount set by the owner and affordable to lose; (3) per-trade risk derived from the trading capital.
  - Trading capital is set in rupees before trading. It is not a percentage of growing savings.
  - Cut rule: a drawdown threshold that reduces the risk percentage or the trading capital allocation. Numbers are the owner's.
  - Stop rule: a deeper threshold that pauses trading for review. Linked to T8.7.
  - Additional money comes only from spare income, never household savings (PLAN section 2).
  - Scale-up and withdrawal are in T2.17.
- **Worked example (rupees):** Savings Rs 4,00,000 (hypothetical). Emergency reserve (owner's choice; the book does not set it). Trading capital Rs 50,000 = 12.5% of savings. Untouched = 4,00,000 - 50,000 = Rs 3,50,000 (includes the emergency reserve).
  - Cut at 10% drawdown: 10% of 50,000 = Rs 5,000. Capital falls to 45,000; risk at 1% becomes 450 per trade.
  - Stop review at 20% drawdown: 20% of 50,000 = Rs 10,000. Capital falls to Rs 40,000; trading pauses for review. Risk at 1% of 40,000 = Rs 400.
- **Visual / animation / simulator:** capital-allocation-planner: a stacked bar of savings, untouched amount and trading capital, with cut and stop lines on the trading capital segment.
- **Guided exercise:** Savings Rs 6,00,000; trading capital Rs 30,000. Compute trading share (5%), untouched amount (5,70,000), per-trade risk at 1% (300); at a 15% drawdown, capital (25,500) and per-trade risk at 1% (255). Hints: percentages of the trading capital after the drawdown.
- **Independent exercise:** Write your own allocation with five numbers: total savings, emergency reserve, trading capital, cut threshold, stop threshold. Compute the per-trade risk and the capital at each threshold. No hints.
- **Quiz focus:**
  - Trading share of savings (numeric: 12.5%).
  - "Allocate all savings to trading to grow faster" (wrong answer: "yes").
  - Top-up after drawdown from household money (scenario; violation).
  - Spot the mistake: cut level computed on the original capital when current capital should be used. State the base.
  - Stop rule timing (scenario: pause at stop threshold, not after recovery).
- **Paper task (journal/Kite demo/lab):** Learning note: a one-page allocation sheet in the journal (planned fields only) with five numbers and the threshold table. This is the precursor to G7.
- **Labs used:** Lab 3 (capital_at_plan field), G7 later.
- **Safety / capital-first note:** Household money is never trading capital. The owner decides all numbers. The book does not recommend an amount.
- **Time-sensitive facts to register:** none.
- **Sources to cite:** the book's capital framework (PLAN section 2 and 4.6); Lab 3 specification.
- **Estimated length:** long
- **Open question:** Should emergency reserve months be a default in the planner, or left blank? Current draft: blank, owner decides.

### T2.16 The Rs 2,000-3,000 reality check
- **Page type:** Math/Calculator (module)
- **Prerequisites:** T2.2, T2.4, T2.5, T2.9, T2.10, T2.11, T2.12, T2.15
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the capital needed for a daily profit target at a given annual return and trading-day count.
  2. Calculate the required daily return for capital of Rs 10,000, Rs 50,000 and Rs 10 lakh.
  3. Show the cost drag on a daily target using the dummy cost model.
  4. Calculate capital lost over 5, 10 and 15 losing trading days at 1% and 2% risk for several capital amounts.
  5. Explain why a consistent daily return cannot be guaranteed.
- **Key ideas to teach (in order):**
  - Capital needed = daily target x trading days per year / annual return. Trading-day count is [VERIFY: NSE calendar]; 250 is an assumption for arithmetic.
  - Required daily return = daily target / capital.
  - Sensitivity: show 10%, 20% and 50% annual returns. 20% is the owner's "very good" reference. 50% is shown only to show scale; it is not an expectation.
  - Required risk: a daily target at 1% risk per trade is many R per day, which implies many trades (T2.12).
  - Costs: the dummy round trip from T2.2 adds to every trade. Gross profit must cover costs first.
  - Streaks: losing days at the chosen risk level, and how much capital is at risk (T2.10).
  - Consistent daily returns cannot be guaranteed. Daily results vary, and a few good days say nothing about the next.
  - The conclusion: at Rs 10,000-50,000 the target is unrealistic. The book does not reverse-engineer a strategy to make it look possible.
- **Worked example (rupees):**
  - Capital needed (250 days, 20% a year): Rs 2,000 a day: 2,000 x 250 = 5,00,000; 5,00,000 / 0.20 = Rs 25,00,000 (Rs 25 lakh). Rs 3,000 a day: 7,50,000 / 0.20 = Rs 37,50,000 (Rs 37.5 lakh).
  - At 10% a year: Rs 2,000 a day needs Rs 50 lakh; Rs 3,000 needs Rs 75 lakh. At 50% a year (scale only): Rs 10 lakh and Rs 15 lakh.
  - Required daily return: Rs 10,000 capital: 20% and 30% a day. Rs 50,000: 4% and 6%. Rs 10 lakh: 0.2% and 0.3%.
  - Compounding check: 4% a day for 250 days multiplies capital by about 18,000 (1.04^250, approximately). Show why this is not a sustainable path.
  - Streaks at 1% risk: Rs 10,000 -> about Rs 490, 956, 1,399 for 5, 10, 15 losses. Rs 50,000 -> about Rs 2,450, 4,781, 6,997. At 2% risk: Rs 10,000 -> about Rs 961, 1,829, 2,614. Rs 50,000 -> about Rs 4,804, 9,146, 13,072.
  - Cost drag: with the dummy Rs 190 round trip on Rs 50,000, four round trips a day cost Rs 760 (dummy). Gross must exceed the target by that amount.
- **Visual / animation / simulator:** Static capital-needed chart (target vs capital) and a streak table using streak-sim values. A lab-style calculator is optional, but every figure must be computed by tested code.
- **Guided exercise:** Compute capital needed for Rs 1,500 a day at 20% over 250 days. Answer: 3,75,000 / 0.20 = Rs 18,75,000. Hints: multiply first, then divide by the return.
- **Independent exercise:** Capital Rs 50,000. Compute the required daily return for Rs 2,500 a day, and the capital needed for Rs 2,500 a day at 15% a year over 250 days. Answers: 5%; 6,25,000 / 0.15 = Rs 41.7 lakh (approximately). No hints.
- **Quiz focus:**
  - Capital needed (numeric: Rs 25 lakh for Rs 2,000 a day at 20%).
  - Required daily return for Rs 10,000 (20%) (numeric).
  - "Small capital can reach the target if I trade well" (wrong answer: "yes"). Explain the arithmetic.
  - Spot the mistake: "I made Rs 2,000 on two days, so the target is achievable." Explain sample size and variability.
  - Scenario: an owner plans to add leverage to reach Rs 3,000 a day (reject; T2.13).
- **Paper task (journal/Kite demo/lab):** Learning note: complete the worksheet for your own capital and target in the journal. Record the required daily return and the number of losing days you could absorb under your own cut rule.
- **Labs used:** Lab 1 (sizing), Lab 2 (costs), Lab 4 (trade-order Monte Carlo for streak distribution, later). Gate G2 requires completion of this module (PLAN section 6).
- **Safety / capital-first note:** This is the chapter that confronts the owner's aspirational target. State clearly that the target is unrealistic at this capital, that consistent daily returns cannot be guaranteed, and that the target must not drive trade decisions. Do not present any return as achievable.
- **Time-sensitive facts to register:**
  - Trading days per year [VERIFY: NSE holiday list and calendar].
  - Dummy costs are not facts; replace with verified costs from T2.2 before the module is published.
- **Sources to cite:** NSE holiday calendar; Zerodha charges (cross T2.2); the book's Lab 1, Lab 2 and Lab 4 specifications.
- **Estimated length:** long
- **Open question:** Should the 50% annual-return row be shown at all? Current draft: yes, labelled as scale only, for reviewer decision.

### T2.17 Scaling and withdrawal policy: reinvest, thresholds, never withdraw in drawdown
- **Page type:** Concept (with Math/Calculator elements)
- **Prerequisites:** T2.9, T2.15, T2.16
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Calculate the high-water mark and the current drawdown from it.
  2. Apply a withdrawal rule to a given equity path and state whether a withdrawal is allowed.
  3. Decide between reinvesting and withdrawing using a stated threshold.
  4. Explain why withdrawals during drawdown are not allowed.
  5. State the conditions to scale trading capital up or down.
- **Key ideas to teach (in order):**
  - Reinvest profits first (PLAN section 2).
  - High-water mark (HWM): the highest equity reached so far. Drawdown from HWM = (HWM - current) / HWM.
  - Withdrawal threshold: a rule with a number (owner's choice), for example only above a set multiple of starting capital and only after a stated period of positive results.
  - Never withdraw during a drawdown. Withdrawals reduce the base that must recover.
  - Scale-up: only after gates G6 and G7 and a recorded result, and never by increasing risk after losses.
  - Scale-down: triggered by the cut and stop rules from T2.15.
  - Record every capital change in the journal (capital_at_plan).
  - Withdrawals change the base for drawdown. The method must be stated [VERIFY: owner's choice of method].
- **Worked example (rupees):** Start Rs 50,000; HWM 50,000.
  - Equity 54,000: new HWM 54,000.
  - Equity 51,000: drawdown = (54,000 - 51,000) / 54,000 = 5.6%. No withdrawal.
  - Equity 57,000: new HWM 57,000.
  - Current equity 53,000: drawdown = 4,000 / 57,000 = 7.0%. No withdrawal allowed (drawdown from HWM).
  - Show that a withdrawal rule with a threshold, for example "withdraw only when equity is at a new HWM and above starting capital plus Rs 10,000", is not met at Rs 53,000.
- **Visual / animation / simulator:** capital-allocation-planner (equity path with HWM and threshold lines) or drawdown-compounding with a withdrawal marker.
- **Guided exercise:** Equity path Rs 50,000, 54,000, 51,000, 57,000, 53,000. Compute HWM at each step and the current drawdown at the end. Answer: HWM 57,000; drawdown 7.0%. Hints: track max so far.
- **Independent exercise:** Write a withdrawal policy with three numbers (threshold above starting capital, positive-period length, maximum withdrawal percentage). Then test it on this path: 50,000, 62,000, 58,000, 66,000. State on which step a withdrawal is first allowed under your rule. No hints.
- **Quiz focus:**
  - Withdraw after one good month (wrong answer: "yes" if the rule is not met).
  - Withdraw during drawdown (scenario; not allowed).
  - Spot the mistake: adding household savings to a losing account. Violation.
  - HWM arithmetic (numeric: 7.0%).
  - Scale-up after losses (wrong answer: "yes"; violates risk rules).
- **Paper task (journal/Kite demo/lab):** Learning note: write the owner's scale-up and withdrawal policy as a one-page sheet with numbers; record capital changes in the journal. Mode: learning note.
- **Labs used:** Lab 3 (equity curve, capital changes), G7 (withdrawal policy is a G7 criterion).
- **Safety / capital-first note:** Withdrawals during drawdown and scale-up after losses are both prohibited by the capital-first rules. Policy numbers are the owner's.
- **Time-sensitive facts to register:**
  - Tax on withdrawals or gains (cross T2.3) [VERIFY].
- **Sources to cite:** PLAN section 2 and section 6 (G7); Lab 3 specification.
- **Estimated length:** medium
- **Open question:** How should drawdown be measured after a withdrawal (adjusted base or raw equity)? Reviewer decision.

### T2.18 Money-math assessment (gate G2 prep: randomised numeric questions)
- **Page type:** Assessment
- **Prerequisites:** T2.1 to T2.17 (all of Track 2)
- **Learning objectives (measurable, 3-5):** After this chapter the reader can:
  1. Answer randomised numeric questions on costs, sizing and expectancy within tolerance.
  2. Explain each worked solution in words, including the formula.
  3. Identify which of two rule sets breaks a stated limit.
  4. State the retake rules and what the gate screen says about educational competence.
- **Key ideas to teach (in order):**
  - Gate G2 pass criteria (PLAN section 6): cost, position-size and expectancy numeric questions all correct within tolerance on a fresh randomised set, and the reality-check module (T2.16) completed.
  - Question types: numeric (with tolerance), multiple choice, scenario, spot-the-mistake, order of steps.
  - Randomisation: seeded generator with validity constraints (stop below entry for longs; sensible capital range; quantities whole).
  - Each numeric answer is computed by the tested core functions, never typed by hand.
  - Tolerance: rupee answers exact to the paisa for integer arithmetic; percentages to a stated precision. Tolerance values are open (see below).
  - Cost questions depend on data/facts.json. If a cost fact is stale, the assessment shows a stale warning and does not count those questions.
  - Attempts, per-question results and concept tags stored locally (IndexedDB). Missed questions are scheduled for review after reviewAfterDays.
  - Retake: allowed at any time, with a new randomised set; no timer; attempt history kept.
  - Screen text: "Educational competence is not proof of profitability. There is no pressure to go live."
- **Worked example (rupees):**
  - Generated question: capital Rs 50,000; risk 1%; entry Rs 400; stop Rs 380. Answer: 25 shares (risk budget 500; risk per share 20; raw 25; cash cap 125; concentration cap 31). Show the working.
  - Generated question: win rate 40%, average win 2R, average loss 1R, R = Rs 1,000. Answer: expectancy +Rs 200 per trade (0.2R).
  - Generated question: daily target Rs 2,000 at 20% a year over 250 days. Answer: Rs 25 lakh capital.
- **Visual / animation / simulator:** quiz-block for question types; gate-check for the pass screen.
- **Guided exercise:** Three sample questions with hints: position size with both caps, break-even win rate with R = 3, and drawdown recovery from a 30% loss. Answers: 25 shares (per T2.5 method); 25%; 42.9%.
- **Independent exercise:** A ten-question mini-set on paper, no hints, then enter the answers in the app. Record the score and the missed concepts in the learning log.
- **Quiz focus:** This chapter is itself the assessment. Required coverage: cost basis (fixed vs proportional), sizing with all three limits, break-even win rate, expectancy and profit factor, drawdown recovery, daily-target capital, and two spot-the-mistake items (wrong denominator; averaging down presented as a plan). Common wrong answers to explain: using capital instead of risk per share (sizing); ignoring the lower of the caps (sizing); forgetting the loss on the fixed charge (costs); treating expectancy as the next trade (expectancy).
- **Paper task (journal/Kite demo/lab):** Learning note: complete the mini-set on paper first, then record the missed concepts. Mode: learning note.
- **Labs used:** Lab 1 (sizing), Lab 2 (costs), Lab 3 (statistics).
- **Safety / capital-first note:** Passing G2 unlocks no live trading. The gate screen must say so. Numeric success does not show that a strategy works.
- **Time-sensitive facts to register:**
  - Any cost question depends on verified cost facts (cross T2.2). Stale facts block those questions.
- **Sources to cite:** PLAN section 6 (G2 pass criteria); PLAN section 4.4 (quiz format); LABS.md Lab 2 and Lab 3 specifications.
- **Estimated length:** long
- **Open question:** What numeric tolerance applies to percentages (for example 0.05 percentage points)? Also, how many questions make up the randomised set? Both need the owner's decision.

---

## Open questions for the reviewer

1. T0.2: Should the book suggest a default trading-capital ceiling, or leave the number entirely to the owner?
2. T1.10: Should "how to spot a scam" move to Track 8 because it overlaps with psychology?
3. T2.2: Should intraday cost structure appear in the chapter, or only in Lab 2?
4. T2.3: The owner's tax status (PLAN section 11, item 7) must be resolved before this chapter is final.
5. T2.10: Should the independence assumption be stated more strongly here, or left to T7.9?
6. T2.11: Default values for the illustrative limits are placeholders and must be the owner's decision.
7. T2.16: Should the 50% annual-return row be shown at all, given it is for scale only?
8. T2.17: How is drawdown measured after a withdrawal (adjusted base or raw equity)?
9. T2.18: Numeric tolerance for percentages, and size of the randomised question set.
10. Track-wide: all rates in Track 2 use DUMMY values for arithmetic only. The reviewer must replace each with verified facts from data/facts.json before any chapter is published, and recompute every example that uses them.
11. Track-wide: the curriculum/README.md referenced by PLAN section 4.6 was not provided to this writer. Chapter IDs, prerequisites and sizes were written from the brief alone and should be cross-checked against it.

## Facts to register (collected)

Each entry names the value to verify and the authoritative source page. No values are stated here.

**Costs (T2.2, T2.12, T2.16, T2.18)**
- Zerodha equity delivery brokerage. Source: Zerodha charges page.
- Zerodha intraday brokerage basis. Source: Zerodha charges page.
- STT rates and the buy/sell basis for delivery and intraday. Source: Income Tax Department STT page; NSE or exchange circular.
- Exchange transaction charge, NSE and BSE. Source: NSE and BSE fee or circular pages.
- SEBI turnover fee. Source: SEBI fees page.
- Stamp duty rates (state-specific). Source: applicable state stamp act; Indian Clearing Corporation documentation.
- GST rate and base on brokerage and charges. Source: GST portal.
- DP charge: depository and DP components and the per-scrip-per-sell-day rule. Source: Zerodha charges page; CDSL tariff page.
- Rounding rules used by the official calculator. Source: Zerodha brokerage calculator.

**Tax (T2.3, T0.2, T1.9, T2.17)**
- Classification rules for trading income (capital gains, business income, speculative income). Source: Income Tax Act text; CBDT circulars.
- Short-term and long-term capital gains rates and holding-period thresholds. Source: Income Tax Act and current Finance Act.
- Loss set-off and carry-forward rules. Source: Income Tax Act.
- Tax audit turnover thresholds. Source: Income Tax Act.
- Dividend taxation. Source: Income Tax Act; Finance Act.
- Tax regime options and changes. Source: Income Tax Department website.

**Market structure and timings (T1.2, T1.3, T1.5, T1.6, T1.7)**
- T+1 settlement rule and effective date. Source: SEBI circulars; NSE clearing and settlement page.
- Clearing corporation and depository roles and names. Source: NSE clearing page; NSDL; CDSL.
- SCORES complaint process. Source: SEBI SCORES page.
- Current list of recognised exchanges. Source: SEBI website.
- Market phases, pre-open and closing auction mechanics and times. Source: NSE market timings page.
- Special session dates (for example, Muhurat trading). Source: NSE circulars.
- Trading holiday list for the current year. Source: NSE holiday list.
- Matching priority rules. Source: NSE and BSE trading rules pages.
- Tick size. Source: NSE tick size page.
- Price band categories and percentages. Source: NSE circuit limits page; BSE price band page.
- Index-level circuit breaker levels and halt rules. Source: NSE circulars; SEBI circulars.

**Indices and corporate actions (T1.8, T1.9)**
- Index constituents and weighting methodology. Source: NSE indices methodology documents.
- Index rebalancing schedule. Source: NSE indices pages.
- Definitions and timelines for record date, ex-date, bonus, split and rights. Source: SEBI LODR regulations; NSE corporate actions page.
- Rights issue mechanics and entitlement rules. Source: SEBI ICDR regulations.

**Participants and information (T1.1, T1.10)**
- IPO process, book-building and allotment rules. Source: SEBI ICDR regulations.
- Participant category definitions. Source: SEBI or NSE pages.
- FII/DII data source and publication timing. Source: NSE FII/DII page.
- SEBI registration categories and public lookup. Source: SEBI registered intermediaries page.
- Current SEBI investor alerts. Source: SEBI investor education pages.

**Orders, margin and risk controls (T2.6, T2.11, T2.13, T0.2)**
- Stop and SL-M order behaviour on Kite. Source: Zerodha support pages on stop-loss orders.
- Exchange rules for stop and trigger orders. Source: NSE order-type documentation.
- Margin framework and collateral rules. Source: SEBI margin circulars; Zerodha margin page.
- Intraday auto square-off rules and timing. Source: Zerodha support; NSE circulars.
- Financing or interest rate on margin funding. Source: Zerodha charges page.
- Broker risk controls. Source: Zerodha support pages; SEBI circulars.
- Trading days per year (used in T2.16). Source: NSE holiday list and calendar.

**Platform and offline behaviour (T0.3)**
- iOS Safari storage eviction policy for sites not added to the Home Screen. Source: Apple WebKit documentation.
- Persistent storage request support. Source: MDN storage persistence page.

**Kite demo (T1.3, T1.4, T1.5)**
- Demo account has no paper-trading account, with exact wording. Source: Zerodha support (Kite demo FAQ).
- Market depth levels shown in Kite. Source: Zerodha Kite help pages.

**Unresolved owner decisions that touch facts (see also PLAN section 11)**
- Owner's tax status. Source: owner decision; tax professional.
- Numeric tolerances and question-bank size for Track 2 assessment (T2.18).
