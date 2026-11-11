# Zerodha Kite: what the screens really look like and how they work

Research date: 2026-11-11. Method: public web pages only (no login, no account, no order).
Tags used in this file:

- [CONFIRMED] = stated in an official Zerodha page (URL given).
- [UNCONFIRMED] = no official page found that states it. Either it comes from third-party pages, from user comments, or from general knowledge. Do not put it in the book as fact without checking a live screen.
- [check source] = a number (charge, time, limit) that Zerodha states but can change. Re-read the URL before printing.

Important limits of this research:

1. Zerodha's pages describe features in words. They rarely describe exact pixel layout, field order or colours. Anything about layout that is not in an official sentence is tagged [UNCONFIRMED]. The ASCII sketches below are composite sketches. Items that are confirmed are listed under each sketch.
2. The public demo at https://kite-demo.zerodha.com/dashboard is a script-driven page. My fetch tool could not read it. The book author should open it in a browser and screenshot each screen to settle every [UNCONFIRMED] item. Source for the demo: https://support.zerodha.com/category/trading-and-markets/trading-faqs/general/articles/does-zerodha-offer-demo-accounts-for-paper-trading ("Zerodha does not offer demo accounts for paper trading. You can try a demo version of Kite that uses dummy data at kite-demo.zerodha.com/dashboard.") and the "Try demo" button on https://zerodha.com/products/kite/ . One user report says the demo lets you look at the interface but not place a trade [UNCONFIRMED, tradingqna user post].
3. Several official pages are stale and disagree with each other (for example the Kite user manual still shows old square-off times). Where sources conflict, both are given and the newer one is marked.

---

## 0. Quick change log, 2024 to 2026 (date and source)

| Date | Change | Source |
|---|---|---|
| Mar 2020 | Bracket orders (BO) disabled on Kite. Cover orders stayed. | https://support.zerodha.com/category/trading-and-markets/trading-faqs/general/articles/why-bo-stopped |
| 27 Sep 2021 | NSE stopped SL-M for options. Kite blocks SL-M for index options. | https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/what-are-stop-loss-orders-and-how-to-use-them |
| Sep to Oct 2023 | BSE discontinued SL-M. Kite blocks SL-M on all BSE instruments (equity, BFO, BCD, commodity derivatives). Page links a BSE circular dated 21 Sep 2023. Zerodha suggests SL (stop-loss limit) instead. | https://support.zerodha.com/category/trading-and-markets/alerts-and-nudges/kite-error-messages/articles/slm-discontinued-by-bse |
| 26 Jul 2024 | New mobile order window: only quantity and price shown first; Stoploss, GTT and validity moved under "More". | https://tradingqna.com/t/all-new-order-window-on-the-kite-mobile-app/170793 and https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/kite-app-order-window |
| 21 Sep 2024 | Kite web Positions page: options menu moved to the right side. | https://zerodha.com/z-connect/updates/simplified-options-menu-on-kite-web-positions-page |
| Sep to Oct 2024 | Alert Triggers Order (ATO) launched on web, then on the app (a Business Standard report is dated 17 Sep 2024; Zerodha's X post about the app is from Oct 2024). | https://zerodha.com/z-connect/business-updates/introducing-alert-triggers-order-ato-feature-on-kite and https://zerodha.com/z-connect/updates/alert-triggers-order-ato-now-available-on-the-kite-app |
| Oct 2024 | Orders and Holdings pages: clicking an instrument name opens the order window. | https://support.zerodha.com/category/trading-and-markets/general-kite/others-kite/articles/kite-positions-update (date inferred from image path, [UNCONFIRMED]) |
| 7 Mar 2025 | Web order window: order slicing (freeze quantity), Market protection checkbox, available margin shown in the order window, market depth picker, "Remember quantity" for F&O. | https://tradingqna.com/t/new-features-on-the-order-window-order-slicing-market-protection-more/179984 |
| 25 Mar 2025 | Z-Connect post "Order placement simplified" (same features, plus Basket icon on every web page). | https://zerodha.com/z-connect/featured/order-placement-simplified |
| 25 Jun 2025 | Z-Connect guide to advanced orders (Iceberg, GTT, Basket, ATO, slicing, SIP, limited validity 1 minute to 2 hours). | https://zerodha.com/z-connect/featured/advanced-order-features-on-kite-a-comprehensive-guide |
| 17 Nov 2025 | Kite web Positions: grouping (by Underlying, by Underlying and Expiry) and filters. App version 27 May 2026. | https://zerodha.com/z-connect/business-updates/introducing-position-grouping-and-filters-on-kite-web |
| 28 Nov 2025 | Quick Baskets on Kite web. | https://zerodha.com/z-connect/kite/quick-baskets-on-kite-web |
| 3 Dec 2025 | New chart features on the Kite app. | https://zerodha.com/z-connect/kite/new-charting-features-on-the-kite-app |
| 26 Dec 2025 | MIS auto square-off moved: equity 3:20 PM to 3:25 PM; F&O 3:25 PM to 3:26 PM. | https://zerodha.com/z-connect/updates/changes-to-the-auto-square-off-timings-for-equity-and-fo |
| 27 Feb 2026 | GTT for MCX (commodities) mentioned. | https://zerodha.com/z-connect/business-updates/updates-for-commodity-traders (only seen in feed title, [UNCONFIRMED] detail) |
| 18 Mar 2026 | Kite Terminal Mode (customisable web workspace). | https://zerodha.com/z-connect/business-updates/introducing-kite-terminal-mode |
| 25 Mar 2026 | New mobile marketwatch: up to 25 watchlists, 250 instruments each, groups with colours, "My Watchlists" and "Discover". | https://zerodha.com/z-connect/kite/introducing-new-marketwatch-on-kite-app |
| 1 Apr 2026 | Kite Connect API: MARKET and SL-M orders need `market_protection`. This is from developer-forum posts, not an official notice. | https://kite.trade/forum/discussion/15873/regarding-market-protection-and-static-ip [UNCONFIRMED as official] |
| 23 Jun 2026 | Trailing stoploss for GTT on Kite web (app "soon"). | https://zerodha.com/z-connect/business-updates/introducing-trailing-stoploss-on-kite-web |
| 15 Jul 2026 | Screener on Kite web. | https://zerodha.com/z-connect/kite/introducing-screener-on-kite-web (title only) |
| 7 Aug 2026 | Updated Stock SIP experience on Kite web (SIP orders default to market with market protection). | https://zerodha.com/z-connect/kite/introducing-updated-stock-sip-experience-on-kite-web (from the feed summary) |
| 4 Sep 2026 | Trade from Charts (TFC) on the Kite app. | https://zerodha.com/z-connect/business-updates/introducing-trade-from-charts-tfc-on-kite-app (title only) |

No official page found says market orders were banned for ordinary equity on Kite web or app. What exists: market protection (opt-in on web), market orders blocked for some option contracts, SL-M blocked for index options and for BSE. See section 12.

---

## 1. Kite web home

Sources: https://kite.trade/docs/kite/ , https://kite.trade/docs/kite/marketwatch/ , https://zerodha.com/varsity/chapter/the-trading-terminal/ , https://zerodha.com/products/kite/

### 1.1 Login (public page: https://kite.zerodha.com/)

[CONFIRMED, kite manual] Steps: go to kite.zerodha.com; enter User ID and Password; click "Login"; enter the app code (two-factor, a TOTP that refreshes every 30 seconds) and click "Continue". After first login a tour prompt shows. It can be reopened from the drop-down in the top right corner.

### 1.2 Top navigation

- [UNCONFIRMED, third-party guides 2022 to 2023] Top bar order: Zerodha logo, then index tickers, then Dashboard, Orders, Holdings, Positions, (Bids), Funds, Apps, and the user ID drop-down at the right.
- [CONFIRMED] Pages exist at these paths: /dashboard, /orders (with /orders/gtt, /orders/alerts), /holdings, /positions, /funds, /bids/ipo (IPO page, from Zerodha IPO support pages).
- [CONFIRMED] Keyboard shortcuts: A = Dashboard, O = Orders, H = Holdings, P = Positions, F = Funds, ~ = Universal search, D = market depth, C = chart, B = Buy window, S = Sell window. (Sources: manual pages for marketwatch, orders, portfolio, funds, charting.)
- [CONFIRMED] The user ID menu (top right) holds: My profile, Settings, the "Sticky order window" toggle, and the tour. The manual says "Click your user ID, My profile."
- Index ticker: [UNCONFIRMED] NIFTY 50 and SENSEX shown at the left of the top bar, each with value and change. No official sentence found.

### 1.3 Home screen regions (composite sketch)

```
+-----------------------------------------------------------------------------------+
| NIFTY 50  24,xxx -0.2% | SENSEX 80,xxx -0.1% |  Dashboard Orders Holdings Positions |
|  [index tickers, UNCONFIRMED]                 Bids Funds Apps          [user ID v]  |
+----------------------+------------------------------------------------------------+
| [search: ~ "Search eg: infy bse, nifty fut, ..."]  <- UNCONFIRMED hint text         |
| 1 | 2 | 3 | 4 | 5 | 6 | 7  <- 7 watchlist tabs   Dashboard widgets:                |
| INFY      1,500.00  +0.5%    Equity (margin, opening balance)                       |
|  [B][S][chart][depth][more]  Holdings (P&L, current value, investment)              |
| RELIANCE  2,900.00  -0.1%    Market overview, positions summary                     |
| ...                          (UNCONFIRMED widget names)                             |
+----------------------+------------------------------------------------------------+
```

Confirmed facts for this screen:
- [CONFIRMED] Marketwatch: 7 watchlists numbered 1 to 7 on web; each holds up to 50 instruments (kite manual). Switch with the number or Ctrl+Shift+1 to Ctrl+Shift+7. Instruments are auto-saved on web and app.
- [CONFIRMED] Search: press ~ for Universal search; type; click "Add" next to a result to add it to the active watchlist. "Tens of thousands of instruments and contracts across all segments and exchanges." (Product page: 90,000+ instruments.)
- [CONFIRMED] Hover on a row reveals action buttons. Named in docs: Buy (B), Sell (S), Market depth, Chart, Delete, and a More menu (pin to slot 1 or 2, Create GTT, Create alert, Add to basket, Kite stock widget). The Varsity chapter (2014 screenshots) says hovering reveals Buy, Sell, Market Depth and chart.
- [CONFIRMED] Columns: last traded price (LTP) and a change figure. Change can be Percentage or Absolute, and measured from previous Close or the day's Open (Marketwatch settings). Direction arrow, change and a briefcase "holding" symbol can each be shown or hidden. A briefcase icon marks instruments you hold.
- [CONFIRMED] Sorting (Marketwatch settings): A-Z, % change, LTP, Exchange. Up and Down arrow keys move between rows.
- Colours of Buy and Sell buttons on the hover row: Buy blue, Sell orange [UNCONFIRMED by an official sentence; general knowledge].
- Row hover button names: the user asked "Buy B / Sell S / chart / market depth / delete". The manual confirms hover reveals actions and names Delete and Market depth. Exact icon form is [UNCONFIRMED].
- Index tickers and Dashboard widgets: [UNCONFIRMED].

### 1.4 Market depth (web)

Source: https://kite.trade/docs/kite/marketwatch/ and https://kite.trade/docs/kite/kite-mobile/marketdepth/

[CONFIRMED]
- Open: hover and click "Market depth", or select the row and press D.
- Shows best 5 bids and best 5 offers by default. "View 20 depth" shows best 20 (NSE stocks, Z-Connect says "arrow shows the full 20-depth for NSE stocks").
- Columns per side: Bid or Offer price, Orders, Qty. Each price has a quantity and the number of pending orders at that price.
- Other fields: Open, High, Low, Prev. Close, Volume, Avg. Price (the volume-weighted average price, VWAP), LTQ (last traded quantity), LTT (last traded time), Expiry, Lower and Upper circuit, OI (open interest, for F&O).
- Click a price level to place an order at that price.
- Several depth windows can be open at once.
- Colours: Varsity says offers (sellers) are red and bids (buyers) are blue. [CONFIRMED for 2014 screenshots; current exact shades UNCONFIRMED].

What each part means, in Zerodha's wording:
- Bid: the price buyers are willing to pay. Highest bid has priority. (Varsity)
- Offer: the price sellers are willing to accept. Lowest offer has priority. (Varsity) Kite says "Offer", not "Ask".
- Qty: quantity waiting at that price. Orders: number of orders waiting at that price.
- Circuit limits: the day's lowest and highest price the stock may trade at (Varsity jargon page, https://zerodha.com/varsity/chapter/commonly-used-jargons/ , band is 2%, 5%, 10% or 20%).

### 1.5 Chart panel

See section 10.

---

## 2. Order window (regular)

Sources: https://kite.trade/docs/kite/orders/ , https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/market-price-protection-on-the-order-window , https://tradingqna.com/t/new-features-on-the-order-window-order-slicing-market-protection-more/179984 , https://zerodha.com/z-connect/featured/order-placement-simplified , https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/auto-amo , https://kite.trade/docs/connect/v3/orders/

### 2.1 What is confirmed about the web window

- [CONFIRMED] It opens when you hover a marketwatch row and click Buy or Sell, or select the row and press B or S. It floats and can be dragged anywhere. You place the order with the Buy or Sell button or by pressing Enter. A notification then shows the order as complete or rejected. There is no extra confirmation step described in the manual.
- [CONFIRMED] "Sticky order window" (toggle under the user ID menu) keeps the window open after each order so you can repeat the same input.
- [CONFIRMED] Since 7 Mar 2025 the window shows available margin. Equity CNC shows available cash; F&O and MIS show cash plus collateral. Charges appear between required margin and available margin (a Zerodha staff reply; the text label was removed for space).
- [CONFIRMED] A pen-style icon (market depth picker) shows the depth inside the order window; clicking a bid or offer fills that price in.
- [CONFIRMED] Advanced (a control in the window) holds "Market protection". Click Advanced, then Market protection. (Support article above.)
- [CONFIRMED] Order varieties named in the Kite manual and Kite Connect docs: Regular, Cover (CO), AMO, Iceberg. The mobile order window also offers MTF. Kite Connect also lists "auction". Bracket orders do not exist (see section 0).
- [CONFIRMED] Order types: Market, Limit, SL (stoploss limit), SL-M (stoploss market).
- [CONFIRMED] Products: Longterm CNC, Intraday MIS, Overnight NRML (and MTF). Zerodha's labels in the support article title: "Longterm (CNC), Intraday (MIS) and Overnight (NRML)".
- [CONFIRMED] Validity (under "More options"): Day (default, labelled "Regular" in older UI), Immediate or Cancel (IOC), Minutes (1 to 120 minutes; the Z-Connect advanced orders post says 1 minute to 2 hours).
- [CONFIRMED] Disclosed quantity exists (Kite Connect docs: the part of an equity order shown in the exchange book; equities only). The Varsity chapter mentions it and skips it.
- [CONFIRMED] Order slicing: orders above the exchange freeze quantity are split automatically after you confirm. Sliced orders show a blue layer icon in the order book. Brokerage applies per slice.

### 2.2 Field order and colours: composite sketch [UNCONFIRMED in detail]

No official page gives the exact field order or header colours of the 2025 to 2026 web window. The order below is what the official pages imply (Varsity order list, manual wording) plus general knowledge. Verify against a screenshot of the demo.

```
+----------------------------------------------------------+
| BUY  INFY x 10 Qty    NSE (o)  BSE ( )        [blue bar] |   <- Sell = orange/red bar
+----------------------------------------------------------+
| [ Regular | Cover | AMO | Iceberg ]  (+MTF)   <- varieties |
|                                                          |
|  Qty.        Price         Trigger price                 |
|  [ 10 ]      [ 1500.00 ]   [ 0 ] (greyed unless SL)      |
|                                                          |
|  Product:  (o) Intraday MIS   ( ) Longterm CNC           |
|            (NRML replaces these for F&O)                 |
|  Type:     ( ) Market (o) Limit ( ) SL ( ) SL-M          |
|                                                          |
|  [v] Advanced  -> Validity: Day / IOC / Minutes          |
|                   Disclosed qty                          |
|                   Market protection [ ]                  |
|                   Stoploss / Target GTT checkbox         |
|                                                          |
|  Margin required Rs 15,000   Available Rs 40,000         |
|  [  Buy  ]   [ Cancel ]                                  |
+----------------------------------------------------------+
```

What I can confirm for each element:
- Blue Buy, orange Sell: [UNCONFIRMED] by official text. (Varsity's 2014 text calls offers red and bids blue in the depth, which is the depth, not the window.)
- Tabs Regular / Cover / AMO / Iceberg: the manual and Kite Connect list these varieties; the mobile manual says "Regular, MTF, Cover, AMO, or Iceberg". Whether web shows them as tabs in the 2026 window: [UNCONFIRMED].
- Product label wording: Zerodha says "Intraday MIS" and "Longterm CNC" [CONFIRMED in support article title]. On mobile, product is a toggle named "Intraday" (checked = intraday, unchecked = delivery) [CONFIRMED, support "kite-app-order-window"].
- Qty, Price, Trigger price order: [UNCONFIRMED]. Varsity's older list is Exchange, Order type, Price, Trigger price, Quantity, Disclosed quantity, Product type.
- "Market" and "Limit" on the new window: on mobile a switch icon toggles Limit and Market [CONFIRMED].
- Cancel button: [UNCONFIRMED] label.

### 2.3 Rules per order type (all [CONFIRMED] unless noted)

Sources: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/what-are-stop-loss-orders-and-how-to-use-them , https://kite.trade/docs/kite/orders/

- Market: runs at the best available price. Blocked for stock options (illiquid). For some index options only contracts with open interest above 500 lots or 20,000 quantity allow market orders; some far expiries are blocked [check source: https://support.zerodha.com/category/trading-and-markets/trading-faqs/f-otrading/articles/market-orders-monthly-options].
- Limit: price you set. Buy fills at your price or lower; sell at your price or higher. May not fill.
- SL (stoploss limit): needs a trigger price and a limit price. When the trigger is reached a limit order goes to the exchange. If price runs past the limit, the order stays open.
- SL-M: needs only a trigger price. When triggered it becomes a market order. Blocked for index options and all BSE instruments.
- Example in Zerodha's article: you buy at 100; sell SL trigger 95 and price 94.90. Buy-side stoploss example: trigger 105, price 105.10.
- A stoploss order is valid for one trading day only. If it is not triggered it expires at the end of the session. For longer protection Zerodha points to GTT (source: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/how-to-use-sl-l-order-like-a-sl-m-order, via search summary).
- Error you may see: "Trigger price can't be higher than price" when trigger and price are on the wrong sides for the side of the trade.

### 2.4 Product rules (Zerodha wording)

Source: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/what-does-cnc-mis-and-nrml-mean

- Longterm (CNC, Cash and Carry): delivery equity. Hold as long as you like. No leverage. Not auto-squared-off. No short selling. You can sell holdings under CNC. If you buy and sell the same share on the same day under CNC, Zerodha treats it as intraday and charges brokerage accordingly.
- Intraday (MIS, Margin Intraday Square Off): intraday leverage for equity, equity F&O and commodity futures. Open positions are closed automatically at the square-off time.
- Overnight (NRML, Normal): F&O positions that can be held until expiry. No intraday leverage. Also used for delivery-style currency trading.
- Equity MIS leverage: Zerodha's older article says up to 5 times (20% margin) [check source]. Leverage can be reduced or removed during the day at the risk team's discretion (bulletin: https://zerodha.com/marketintel/bulletin/249809/latest-intraday-leverages-mis-bo-co).
- Cover order (CO): market or limit entry with a stoploss, intraday NSE only. Second leg cannot be cancelled after the first executes. A CO cannot be closed from Positions or converted to CNC or NRML; it is closed from open orders by exiting the second leg (kite manual).

### 2.5 AMO (After Market Order)

Source: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/auto-amo (windows differ from the old kite manual, which says 3:45 PM to 8:57 AM; the support article is newer).

- Regular orders placed outside market hours automatically become AMOs. Basket orders and trade-from-chart orders do too.
- Place, modify or cancel windows [check source]: Equity (NSE and BSE) 4:00 PM to 8:58 AM; Currency 5:00 PM to 8:59 AM; F&O 3:45 PM to 9:11 AM; MCX 11:30 PM to 8:58 AM (Mar to Nov) or 11:55 PM to 8:58 AM (Nov to Mar). No AMO activity between 1:00 AM and 5:30 AM (maintenance).
- Reaches the exchange [check source]: Equity market and limit at 9:00 AM; equity IOC, partial disclosed quantity, SL and SL-M at 9:15 AM; F&O 9:15 AM; currency, MCX 9:00 AM; ETFs 9:15 AM.
- Allowed products: CNC, MIS, NRML. Not allowed: Iceberg and Cover. Orders with the GTT checkbox ticked are rejected. No order slicing for AMOs. No AMO for stocks under periodic call auction.
- Without DDPI or POA: CNC/MTF sell AMO for shares bought on the same day only from 6:30 AM next day; for already delivered shares after 5 PM.
- Order book status shows "AMO REQ RECEIVED" until the order goes to the exchange.
- Zerodha: pre-market and AMO orders are not guaranteed to execute (https://support.zerodha.com/category/trading-and-markets/general-kite/others-kite/articles/order-types-and-execution).

### 2.6 Iceberg

- Steps (kite manual): click "Iceberg", choose "Intraday" or "Overnight", enter Quantity and Price, choose "Market" or "Limit", enter the number of legs, click Buy or Sell.
- Minimums [check source]: Rs 1,00,000 for equity, five lots for F&O. Maximum 10 legs (Z-Connect June 2025: slices capped at 10, each at least 5% of the order). Each leg goes to the exchange only after the previous one fills. Market orders in iceberg need market protection. Not available in pre-open and post-market.

### 2.7 Market protection (web)

Source: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/market-price-protection-on-the-order-window
- A checkbox under Advanced. A market order fills at the best price. If price moves beyond the protection range, the unfilled part becomes a limit order at the protection price and stays open. A shield icon marks protected orders in the order book. [CONFIRMED]
- Bands as % of LTP [check source]: EQ and FUT below Rs 100: 2%; Rs 100 to 500: 1%; above Rs 500: 0.5%. OPT below Rs 10: 5%; Rs 10 to 100: 3%; Rs 100 to 500: 2%; above Rs 500: 1%. Example: stock Rs 90, buy: protection price Rs 91.80.

---

## 3. GTT (Good Till Triggered)

Sources: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/gtt/articles/what-is-the-good-till-triggered-gtt-feature , https://support.zerodha.com/category/trading-and-markets/kite-features/gtt/articles/gtts-disabled-cancelled-expired , https://support.zerodha.com/category/trading-and-markets/charts-and-orders/gtt/articles/why-did-my-gtt-order-trigger-but-was-not-executed , https://kite.trade/docs/connect/v3/gtt/ , https://zerodha.com/z-connect/business-updates/introducing-trailing-stoploss-on-kite-web

### 3.1 What it is
[CONFIRMED] Stays active up to 365 days (one year). When the Last Traded Price (LTP) reaches the trigger, Kite places a limit or market order (market with price protection) on the exchange. Free. Available for CNC, NRML, MTF. No cash or margin is needed to create it; funds, holdings and margin are checked when the order is placed at trigger time. A GTT trigger fires only once.

### 3.2 How to create (web) [CONFIRMED, support article]
1. In Marketwatch (also Holdings or Positions), hover the instrument and click the three dots (More).
2. Choose Create GTT.
3. Pick Buy or Sell (top left).
4. Pick Single or OCO (top right).
5. Enter trigger price(s) and quantity; choose Limit or Market; enter limit price if Limit.
6. Optional: tick Trailing in the Stoploss section and enter a trailing point value (Kite web since 23 Jun 2026).
7. Click Place.

Mobile [CONFIRMED]: tap the instrument; tap Create GTT; enter trigger price and quantity; choose market or limit; slide the Create GTT button. The mobile order window also has a GTT quick toggle (under More) for stoploss and target as percent.

### 3.3 Form fields
Transaction type (Buy/Sell); Trigger type (Single/OCO); Trigger price (one for Single, two for OCO: stoploss trigger and target trigger); Quantity; Price type (Limit or Market); Limit price; Trailing checkbox and trailing point (stoploss section). Also, a percentage entry under the trigger field: positive = target, negative = stoploss (older Z-Connect GTT post). There is no field where you choose the expiry: validity is fixed at one year [inferred from the support article; the kite-connect `expires_at` is set by the system].

Guidance in the article: for a Buy GTT set the limit above the trigger; for a Sell GTT set the limit below the trigger, or use Market, to help the order fill.

### 3.4 Types
- Single: one trigger; enters or exits.
- OCO (One Cancels the Other, called "two-leg" in the API): a stoploss and a target. When either triggers, its order is placed and the other is cancelled. Sell OCO works for equity and F&O. Buy OCO only for F&O. For index F&O OCO only NRML.
- Trailing stoploss (TSL): works with Single and OCO. Equity: sell side only. F&O: buy and sell. NSE, BSE, NFO, BFO, MCX. CNC, MTF, NRML. Trigger and limit move together by the trailing point. A "Trailed" tag appears. Manual edit of the trigger resets the reference.

### 3.5 Statuses
Kite Connect docs define 7 statuses [CONFIRMED]: active (trigger is live), triggered, disabled (needs user action), expired (past expiry date), cancelled (system cancelled), rejected (system rejected), deleted (user deleted). How the labels are cased and which ones the web "GTT" table colours: [UNCONFIRMED]. Zerodha's support page gives these reasons:
- Disabled: placed within 0.25% of the LTP after validation; corporate action such as bonus or split.
- Cancelled or Rejected: delisted or suspended; category or series change; large corporate action (extraordinary dividend above 2%, rights, consolidation, spin-off, capital reduction). Zerodha also states: GTTs are cancelled where the corporate action impact exceeds 2% of market value on the ex-date or record date.
- Expired: one year passed with no trigger; derivative contract expired.
- "You must place a fresh GTT order if your GTT has been disabled or expired."
- A triggered GTT's order history is visible only on the day it triggers.

### 3.6 Where to find it
Orders page, GTT tab: https://kite.zerodha.com/orders/gtt. There you view, modify or cancel. Other tabs on the same page: see section 4.

### 3.7 What happens at trigger
- Trigger hours [check source]: F&O stocks until 3:15 PM, non-F&O stocks until 3:30 PM, F&O contracts until 3:40 PM.
- A GTT still triggers on a gap open beyond the trigger. The limit order is placed. If it does not execute by the end of the day it is cancelled like a normal order. A new GTT is needed.
- Triggered but not executed, reasons (https://support.zerodha.com/category/trading-and-markets/charts-and-orders/gtt/articles/why-did-my-gtt-order-trigger-but-was-not-executed): price never reached your limit; missing CDSL TPIN authorisation for a sell (non-POA/DDPI); insufficient funds; no volume at your limit; price outside circuit limits. Zerodha sends push and email when a GTT is rejected.
- Limit: up to 500 active GTTs [check source]. An older 2019 Z-Connect post said 100 (out of date).
- Zerodha's dealing desk does not support GTT.
- Notifications on trigger: push and email.

---

## 4. Orders page

Sources: https://kite.trade/docs/kite/orders/ , https://kite.trade/docs/kite/kite-mobile/orders/ , https://support.zerodha.com/category/trading-and-markets/general-kite/others-kite/articles/kite-positions-update

### 4.1 Tabs
- Web: the navigation on the Orders page has Orders, GTT, Baskets, SIPs, Alerts (a search listing of kite-demo.zerodha.com shows these labels; official pages use the paths /orders/gtt and /orders/alerts and the phrase "Orders > SIP" and "Orders > Alerts"). A separate Trades (trade book) view: [UNCONFIRMED] on web. Varsity (2014) describes a trade book and an order book as separate screens.
- Mobile [CONFIRMED]: Open (pending orders), Executed (completed and rejected orders), GTT; plus IPO, Baskets and SIPs reached from the Orders area. Swipe left or right to change tabs.

### 4.2 Statuses (Kite Connect docs and forum; the web table may show them in capitals)
- End states: COMPLETE, REJECTED, CANCELLED, OPEN.
- Interim: PUT ORDER REQ RECEIVED, AMO REQ RECEIVED, VALIDATION PENDING (broker risk check), OPEN PENDING (waiting for exchange), MODIFY VALIDATION PENDING, MODIFY PENDING, TRIGGER PENDING (waiting for trigger price), CANCEL PENDING.
- Note: "MODIFIED" is not in the list above; [UNCONFIRMED] whether it is shown. A partly filled order stays OPEN with a filled quantity [UNCONFIRMED label format].
- A rejected order's reason is shown by Options menu, then "Info" (manual). Zerodha also says orders rejected by its own risk system before reaching the exchange may not appear in the order book and the reason is only in the pop-up notification (https://support.zerodha.com/category/trading-and-markets/alerts-and-nudges/kite-error-messages/articles/kite-order-rejections). The manual and the "why is my order getting rejected" page say the reason is displayed in the order book. These two official statements conflict.

### 4.3 Columns
Official pages do not list the web Orders columns. [UNCONFIRMED]. Likely: Time, Type (BUY/SELL), Instrument, Product, Qty. (filled/total), LTP, Price, Status. Do not print without a screenshot.

### 4.4 Per-row actions [CONFIRMED]
- Hover a pending order: Modify, Cancel. Options menu at the right edge since Sep 2024 (click instrument name opens the order window).
- Repeat and "Info" appear in the options menu (manual: Info shows rejection reasons).
- Search bar filters orders; download CSV; shortcut O.
- Mobile: tap an order to see details, modify, repeat or cancel. Long-press to select several pending orders and cancel together; "Select all" cancels all pending orders.

### 4.5 Baskets, SIPs, Alerts (on the same page)
- Baskets: up to 20 orders per basket, 50 baskets per user ID (manual). Execute places orders in sequence. Order sequence changes required margin, not final blocked margin. Place buy options first to lower required margin.
- SIP (stock SIP): CNC only, Market or Limit, up to 50 SIPs.
- Alerts: see section 8.

---

## 5. Positions

Sources: https://kite.trade/docs/kite/portfolio/ , https://zerodha.com/z-connect/business-updates/introducing-position-grouping-and-filters-on-kite-web , https://support.zerodha.com/category/trading-and-markets/general-kite/kite-holdings/articles/intraday-trades-average

- [CONFIRMED] Shortcut P. Covers F&O and intraday equity positions in one window. CNC buys appear in Positions on the purchase day and in Holdings from the next trading day.
- Day / Net tabs: [UNCONFIRMED]. The 2025 grouping post says "By default, all your positions appear in a single list with a combined P&L at the bottom". No official page mentions Day and Net tabs now. The book should not teach Day/Net tabs until seen on the live demo.
- Columns: [UNCONFIRMED]. The brief lists Product, Instrument, Qty, Avg, LTP, P&L, Chg. Third-party sources use the same names. The Zerodha support page says you can enable a "Show Day's P&L" column from Settings.
- [CONFIRMED] Grouping (Settings): Underlying, or Underlying and Expiry; groups collapse and expand; filters by segment, product type, or status (open, closed, long, short, overnight). A red dot next to the settings icon shows an active filter. With a filter on, P&L covers only the filtered positions.
- [CONFIRMED] Convert: hover or options menu, "Convert" lets you change MIS to NRML or CNC and back. Cover orders cannot be converted. After the auto square-off time you cannot convert CNC or NRML to MIS and cannot place fresh MIS orders (support timings page).
- [CONFIRMED] Exit: place an opposite order with the same product, or hover and click "Exit" (options menu). A different product creates a separate position. Multi-select exit with search filters.
- [CONFIRMED] Averages: if you trade the same stock several times in a day, the buy average covers all the day's trades, so the position can show a profit even if the average is above LTP (support article).
- Options menu moved to the right side on 21 Sep 2024; it offers Exit, Add, Convert and position info.

Composite sketch [UNCONFIRMED layout; column names unconfirmed]:

```
Positions (3)                                  [search] [Settings] [options]
Product  Instrument         Qty.   Avg.     LTP      P&L       Chg.
MIS      INFY   NSE          10   1500.00  1502.00  +20.00    +0.13%
NRML     NIFTY25...CE        75    120.00   118.00  -150.00   -1.67%
CNC      TCS    NSE           5   3900.00  3910.00  +50.00    +0.26%
                                              Total  -80.00
```

---

## 6. Holdings

Sources: https://kite.trade/docs/kite/portfolio/ , https://v2.webnotes.in/kite-holdings-tab-explained/ (third-party, columns), https://kite.trade/docs/kite/kite-mobile/portfolio/

- [CONFIRMED] Shortcut H. Delivery buys appear from the next trading day in Holdings (they are in Positions on the buy day).
- [CONFIRMED] T1 holdings: shares bought but not yet delivered to the demat. When delivered, the quantity moves into the main holding.
- Columns: [UNCONFIRMED by Zerodha text]. A third-party guide lists Instrument, Qty, Avg cost, LTP, Cur val, P&L, Net chg, Day chg, and says a briefcase icon and a pledge marker appear on the instrument. Net chg is change since purchase; Day chg is change since previous close.
- [CONFIRMED] Summary at the top of Holdings (invested, current value, P&L) on mobile: "A summary at the top displays invested amount, current value, and P&L" and the day's holdings P&L at the bottom. On web the total or summary row layout: [UNCONFIRMED].
- [CONFIRMED] Authorise (CDSL TPIN): customers without POA or DDPI must authorise delivery sells with a CDSL TPIN and an OTP. TPIN comes by email and SMS. Authorisation is valid for one day. DDPI removes the need. On web the authorise control is on the Holdings page (Authorise button); exact placement [UNCONFIRMED].
- [CONFIRMED] Exit from Holdings: either a CNC sell from Marketwatch, or hover the stock, open the "Options" drop-down and click "Exit". Default exchange is the one with the higher previous-day close; you can pick NSE or BSE.
- [CONFIRMED] Sold holdings show as a negative quantity in Positions for the rest of the day. Buying back that day counts as an intraday trade for STT and charges.
- [CONFIRMED] Analytics, View Breakdown (long-term vs short-term), downloads as CSV or Excel.
- Settlement cycle: the Kite manual says T+2 (outdated). Indian equity settlement has been T+1 since 2023 per general knowledge [UNCONFIRMED in these sources].

---

## 7. Funds

Source: https://kite.trade/docs/kite/funds/ and https://kite.trade/docs/connect/v3/user/

[CONFIRMED] Shortcut F. You can transfer to an equity or a commodity account.
- Available margin (cash + collateral): what you can use for new trades. Includes pledged collateral, option-selling premium, same-day funds, realised P&L and unrealised losses.
- Used margin: blocked in trades and open orders. Can be negative.
- Available cash: current cash balance. A negative balance accrues interest at 0.05% per day [check source].
- Opening balance: cash at the start of the day.
- Payin: money added during the day.
- SPAN, Exposure: exchange margins for F&O.
- Delivery margin, Option premium.
- Collateral (liquid funds) and Total collateral: value from pledged shares or ETFs.
- Add funds: click Add funds, enter amount, pick UPI (free and instant, collect request, enter UPI PIN) or net banking (Rs 9 plus 18% GST [check source]); NEFT/RTGS/IMPS appear in Payin that day.
- Payout: the button is named "Withdraw". It opens a withdrawal request page on Console. Requests are processed at cut-off times. Before cut-off, usually within 24 hours of the cut-off; after, up to 48 hours [check source].
- Instant pledging announced 5 Jan 2026 (https://zerodha.com/z-connect/kite/introducing-instant-pledging).

---

## 8. Alerts and ATO

Sources: https://support.zerodha.com/category/trading-and-markets/alerts-and-nudges/kite-alerts/articles/what-are-kite-alerts-and-how-do-i-use-them , https://support.zerodha.com/category/trading-and-markets/alerts-and-nudges/kite-alerts/articles/what-is-alert-triggers-order-ato

### 8.1 Simple alert [CONFIRMED]
- Web: click More on the instrument, then Create Alert (or Orders, Alerts, New alert). Enter a name. Set the property and value. Click Create.
- App: open the instrument, tap Set alert, name it, set property and value, swipe to create. Or Orders, Alerts, + New alert.
- Fields: Name; Property (data point, for example OHLC, % change, last or average price, quantity, open interest, volume, last traded quantity); Operator (greater than, greater than or equal to, less than, less than or equal to, equal to); Value.
- Free. Up to 500 alerts and 200 ATOs (support). The Kite manual says 200 alerts; the support article is newer. Valid 365 days, then disabled unless triggered or disabled already. Notification on Kite web or app, plus email. Disabled after corporate actions that move price by more than 2%.

### 8.2 ATO (Alert Triggers Order)
- An alert linked to a basket of up to 20 orders. When the alert fires, the basket is placed on the exchange without any action from you.
- Web steps: hover instrument, More, Create alert; keep or change name; click "Alert Triggers Order (ATO)"; choose data point, instrument, operator and price (price can be typed or as a percentage of last price); search an instrument for the basket and click B, S or +; enter order details; click "Add to basket"; edit quantity or price if needed; for a market order click the options icon, then the pencil, then "Market"; click Create.
- App steps: tap instrument, Set alert, turn on the ATO toggle, search and add instruments (B, S or +), enter details, Add to basket, swipe on Create.
- Market orders in ATO carry market price protection. Default validity Day. Alert validity 365 days. ATO not available for currency and commodity segments. ATOs show a bell icon on order history. You get push and email when an ATO triggers and when it executes.
- Sequence of the basket matters for margin required.

---

## 9. Kite mobile app

Sources: https://kite.trade/docs/kite/kite-mobile/ (sub-pages: marketwatch/, orderplacement/, orders/, portfolio/, marketdepth/), https://zerodha.com/z-connect/kite/introducing-new-marketwatch-on-kite-app , https://zerodha.com/z-connect/kite/new-charting-features-on-the-kite-app

### 9.1 Bottom tabs
[UNCONFIRMED]. No official page names the bottom bar. A third-party guide (marketfeed, dated July 2026) says five tabs: "Watchlist & Overview, Orders, Portfolio, Tools, Profile". A Kite 3 launch comment (2019) mentions watchlist, positions, orders and an apps icon. The brief's guess "Watchlist, Orders, Portfolio, Bids, Account" could not be confirmed. IPO bids sit under Orders per that guide, and Zerodha support says "tap Bids" when applying for an IPO, so a "Bids" entry exists in some form. Check the live app.

### 9.2 Watchlist
- Before 25 Mar 2026 (manual): 7 numbered lists, 100 instruments each. After 25 Mar 2026: up to 25 watchlists, 250 instruments each; "My Watchlists" and "Discover" (ready-made lists, such as Nifty 50 stocks, sector indices, global indices, F&O stocks, ETFs); groups inside a watchlist with names and colours; sort within a group by price, % change, name or exchange.
- Gestures [CONFIRMED]: swipe left or right to move between watchlists; long press on a watchlist name to rename; long press an instrument to rearrange (older manual).
- Add: search, tap +. Remove: tap the bin icon. Pin: tap an instrument, scroll down, choose Spot 1 or Spot 2. "Sticky pins" setting under user ID, Settings.
- Search can also open MF (Coin), IPO and G-Secs, which cannot be added to the watchlist.
- Tap an instrument to open detail: OHLC, average price, volume, circuits, LTT, LTQ, OI, day's range, expiry. Market depth: tap an instrument in the watchlist and scroll up; "View 20 depth" for 20 levels.

### 9.3 Placing an order on mobile [CONFIRMED]
Source: https://kite.trade/docs/kite/kite-mobile/orderplacement/ and https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/kite-app-order-window
1. Tap the instrument. The order window opens. Tap BUY or SELL.
2. Pick the variety: Regular, MTF, Cover, AMO or Iceberg (swipe between).
3. Enter quantity (or lots, or amount; a switch icon toggles). +/- change quantity by 1.
4. Use the switch icon to choose Limit or Market. For Limit, type the price or use +/-: price steps 0.01. The dropper icon picks a price from market depth.
5. Tick the "Intraday" option for MIS. (Quantity/Amount toggle is not available with Intraday.) Untick for delivery.
6. Tap "More" for Stoploss (SL and SL-M, with a switch icon), GTT (target and stoploss as percent) and Validity (Day, Immediate, minutes).
7. Swipe to confirm: the button says "Swipe to buy or sell".

Differences from web: swipe to place instead of click; one-screen essentials first; GTT checkbox inside the order window; MTF as its own variety; Terminal Mode is web only; Trailing stoploss GTT web first.

### 9.4 Other mobile gestures [CONFIRMED]
- Orders: swipe between Open, Executed, GTT. Long press to multi-select pending orders.
- Portfolio: swipe between Holdings and Positions. Tap a position then "Exit". Tap and swipe up on a position to Convert. Long press on positions to multi-select and exit all at market price.
- Charts: gestures per the 3 Dec 2025 post: reload, rotate, buy/sell buttons at the bottom; swipe from left edge to close on iOS.
- Mobile Portfolio auto square-off list in the manual (3:20 PM equity, 3:25 PM derivatives) is out of date; see section 12.

---

## 10. Charts

Source: https://kite.trade/docs/kite/charting/

- [CONFIRMED] Two chart engines: ChartIQ (default) and TradingView. Change the default at kite.zerodha.com/profile. Zerodha charts live inside Kite; no Kite Connect or extra login needed to use them. (Kite Connect is the separate paid API product; the charting feature itself is not part of it.)
- Open: hover a marketwatch row and click Chart, or press C. Daily chart opens by default. Candlestick default; the candle symbol changes the style.
- Intraday data from 2015. The manual does not list the intervals; the picker shows 1 minute and up [UNCONFIRMED in detail].
- Indicators: "Studies" search, over 100. 11 types of moving average. Calculated on close by default, can be changed. Views can be saved in ChartIQ.
- Drawing tools: over 30, each customisable. Delete a study by right-click or the X in Studies.
- Trade from charts (ChartIQ): place orders on the chart, drag to modify. A buy order above market is treated as SL buy; a sell below market as SL sell. TradingView version, and app version (4 Sep 2026) are newer.
- Compare feature (no live ticks). Multi-chart layouts: TradingView up to 8; ChartIQ up to 4.
- On a full zoom-out 700 to 2,500 bars show.

---

## 11. Kite's own beginner terms

Sources: https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/what-does-cnc-mis-and-nrml-mean , https://kite.trade/docs/kite/ , https://kite.trade/docs/kite/kite-mobile/marketdepth/ , https://zerodha.com/varsity/chapter/commonly-used-jargons/ , https://kite.trade/docs/connect/v3/orders/

| Term | Zerodha's meaning |
|---|---|
| CNC (Longterm) | Cash and Carry. Delivery equity. No leverage, no auto square-off, no short selling. Buy and sell same day under CNC is treated as intraday for brokerage. |
| MIS (Intraday) | Margin Intraday Square Off. Leverage for intraday. Auto square-off at the cut-off time. |
| NRML (Overnight) | Normal. F&O positions you can hold until expiry. No intraday leverage. |
| MTF | Margin Trading Facility (product listed in Kite Connect docs and mobile order window). |
| LTP | Last traded price. |
| Avg. / Avg. cost | Weighted-average buy price from your trades (the Positions average includes all trades in the stock that day). |
| Avg. Price in depth | Volume-weighted average price (VWAP) of the day so far. |
| Chg. | Change in price against the reference you pick (previous close or day's open); can show % or absolute. |
| Day's P&L / Day chg | Change since previous close (holdings). On Positions, a "Show Day's P&L" setting adds the column. |
| Open / High / Low / Prev. Close | Opening, highest and lowest prices of the day, and the previous day's close. |
| Bid / Offer | Highest price a buyer will pay / lowest price a seller will accept. (Kite writes "Offer".) |
| Qty. | Quantity. In the depth, Qty is the quantity waiting at a price; Orders is how many orders. |
| Trigger price | The price that activates an SL, SL-M or GTT order. |
| Disclosed quantity | The part of an equity order shown to the market; equities only. |
| Used margin / Available margin | See section 7. |
| Circuit limits | The day's lowest and highest prices a stock can trade at (2%, 5%, 10% or 20% bands). |
| Freeze quantity | Exchange maximum quantity per order; Kite slices orders above it. |
| LTQ, LTT, OI, SPAN, Exposure | Last traded quantity; last traded time; open interest; exchange F&O margins. |

---

## 12. Mistakes Zerodha warns about (and rule changes)

Sources noted per line.

1. Wrong product. Using MIS when you plan to hold means the position is squared off by Zerodha; using CNC when you plan to trade intraday means you carry the position. Convert is available only before the square-off time. (support timings page and CNC/MIS page)
2. MIS auto square-off times (support page, [check source]): CAS stocks (Closing Auction Session) 3:12 PM; non-CAS stocks 3:25 PM; F&O 3:26 PM; MCX 10 minutes before close. Changed on 26 Dec 2025 (equity from 3:20 to 3:25; F&O from 3:25 to 3:26). Timings can change at the risk team's discretion. Charge: Rs 50 plus 18% GST per squared-off order [check source: https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings]. A search summary says up to 30,000 quantity per auto square-off order, with a charge per order [check source, UNCONFIRMED from page text]. After the cut-off you cannot place fresh MIS or CO orders and cannot convert CNC or NRML to MIS. You are responsible for closing intraday positions; Zerodha is not obliged to.
3. Market order slippage: "Market orders can lose money in a 'freak trade'". Limit orders avoid freak prices but may not fill. Use a limit like a market order, or an SL like an SL-M, for protection (https://support.zerodha.com/category/trading-and-markets/general-kite/others-kite/articles/order-types-and-execution). Use "Market protection" under Advanced.
4. SL vs SL-M. SL fills only at the limit or better and may stay open in a fast fall. SL-M exits at market but has no price control. SL-M is blocked for index options and for all BSE instruments.
5. Stoploss orders expire daily; use GTT for longer stops.
6. Circuit limits. Orders outside the day's band are rejected ("RMS:Rule: Check circuit limit..."). At the circuit a stock may have only buyers or only sellers; Zerodha says an MIS position that cannot be closed converts to delivery, and a short can lead to auction penalties; Zerodha may block 120% of the closing price (https://support.zerodha.com/category/trading-and-markets/charts-and-orders/order/articles/circuit-limit-hit-intraday-product-type).
7. "Insufficient funds. Required margin is Rs X but available margin is Rs Y": not enough cash margin, or margin already blocked by a pending order. Add funds or cancel pending orders (https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/order-rejection-due-to-margin-unavailability).
8. Other rejection causes (https://support.zerodha.com/category/trading-and-markets/kite-web-and-mobile/holdings/articles/why-is-my-order-getting-rejected): insufficient margin; incorrect order-type use; scrip unavailable; stock group change. Also: insufficient holdings for a sell, wrong-side trigger, order outside trading hours, stock blocked by risk team.
9. GTT is not a guaranteed exit (section 3.7). GTT sells need CDSL TPIN authorisation unless DDPI or POA.
10. AMO may not execute; the status "AMO REQ RECEIVED" is not an exchange order.
11. Quantity typos: Kite shows a nudge when quantity is above the freeze limit and then slices; this is a warning to confirm it is not a typo, not a block.
12. Average-up and "profit while average above LTP" confusion: see section 5.

Market order change summary: no official ban on equity market orders found. API requirement of market_protection from 1 Apr 2026 is a developer-forum statement [UNCONFIRMED as an official notice].

---

## 13. What the current book's Kite chapters and demos probably get wrong

Files read: all 10 chapters in /Users/ranjeetharishchandre/Documents/Personal/capital-first-trading/mdbook/src/04-kite-and-execution/ (index.md and quiz.json for each, plus 04-kite-and-execution/index.md) and /Users/ranjeetharishchandre/Documents/Personal/capital-first-trading/mdbook/theme/demos-kite.js. Paths below are relative to the mdbook folder.

Legend: [M] = clear mismatch with an official source. [P] = probable mismatch or something the book calls unknown that is now answerable.

1. [M] src/04-kite-and-execution/04-order-types/index.md (hook and worked example) and quiz 10: the story is "You set a stop-loss ... The next morning the price opens at Rs 232". A normal SL or SL-M order is valid for one day only and expires if not triggered; it does not survive overnight (Zerodha stoploss article). Only a GTT (or an order placed again) can sit overnight. The scenario needs a GTT, not an SL order.
2. [M] 09-demo-walkthrough/index.md steps 2 to 4 and demo kSteps (theme/demos-kite.js, "place-stop"): a CNC position planned for weeks has its stop placed as a plain SL order ("Order type: SL (stop-loss limit), Trigger, Limit"). On Kite that order dies at end of day. The multi-week stop for CNC is a GTT (Sell, Single or OCO). Also a sell on shares bought today follows CNC rules (they sit in Positions that day) and non-POA accounts need CDSL TPIN authorisation for delivery sells. The chapter says none of this.
3. [M] 10-kite-readiness-assessment/index.md and 09 text: "Stop order: SL trigger Rs 240, limit Rs 238 ... [VERIFY: whether the demo supports this]". Same issue as 2, and the demo has no live order entry per user reports (see 22).
4. [M] 10 quiz: "You want an exit order that always leaves your position once the trigger price is hit ... best: SL-M". On Kite SL-M is not available for index options or any BSE instrument, market orders are subject to market protection that can turn them into limit orders that stay open, and circuit limits can block the exit. "Always leaves" is false.
5. [M] 06-gtt-orders/index.md: "A GTT stays active for a set period ... is [VERIFY]". Known now: 365 days (one year), fixed, not chosen by you; up to 500 active GTTs [check source]. The demo (theme/demos-kite.js kGtt) has an input "Expiry: days from today (example number)" with default 30 and a "review day vs expiry" warning. The real form has no expiry field.
6. [M] theme/demos-kite.js kGtt: form fields are Trigger price, Quantity, Expiry, review day, "Save GTT (demo)". The real form has Buy/Sell, Single/OCO, Trigger price, Quantity, Limit/Market, Limit price, Trailing checkbox, and a "Place" button. The demo has no limit price at all, so "planned loss at trigger" hides the limit-order fill risk that Zerodha warns about.
7. [M] theme/demos-kite.js kGtt status list: shows only Active, Triggered, Expired. Real set: active, triggered, disabled, expired, cancelled, rejected, deleted. The demo's columns "Stock, Trigger, Qty, Ends, Status" are invented ("Ends" is not a Kite label) [column names of the real GTT table UNCONFIRMED].
8. [P] 06-gtt-orders/index.md: "Check after each Corporate actions event ... [VERIFY: Kite handling]". Known: Zerodha cancels or disables GTTs on bonus, split, rights and large dividends (impact above 2%) and you must place a fresh one; also a GTT placed within 0.25% of LTP can be disabled. The chapter does not say the GTT can vanish without you doing anything.
9. [M] 05-product-types/index.md and demo kProduct: only CNC and MIS exist in the book. Kite also has NRML (F&O) and MTF, and Cover as a variety. Kite's own labels are "Longterm CNC", "Intraday MIS", "Overnight NRML"; the demo calls them "CNC (delivery)" and "MIS (intraday)". On mobile and the new window the product is an "Intraday" tick box, not a product dropdown.
10. [P] 05-product-types/index.md: MIS auto square-off "[VERIFY]". Known: 3:25 PM non-CAS equity, 3:12 PM for CAS stocks, 3:26 PM F&O (26 Dec 2025 change), Rs 50 plus 18% GST per squared-off order [check source]. Also you cannot place new MIS or convert to MIS after the cut-off. The chapter and demo never state any time or charge.
11. [M] 05 demo kProduct, "MIS ... uses margin ... leverage": fine, but "Late in the day: auto square-off may close the position" omits that Zerodha charges a fee for it.
12. [M] 02-watchlists-search-and-alerts/index.md: "Whether a Kite alert can ever place an order is [VERIFY]" and "An alert is not an order." Since Sep to Oct 2024 Kite has ATO (Alert Triggers Order): an alert can place a basket of up to 20 orders automatically. Quiz question "What does an alert do?" and demo kWatch text "This is a reminder to review" ignore ATO. The advice is still sensible, but the factual claim needs ATO added.
13. [M] theme/demos-kite.js kWatch alert form: fields "Symbol" and "Alert me when the price reaches (Rs)". Real fields: Name, Property, Operator, Value, plus ATO toggle. Alerts last 365 days and there are limits (500 alerts, 200 ATOs).
14. [M] kWatch watchlist: shows one list of 10 symbols with a price only, no change column, no 7-list tabs, no 50-symbol cap, no hover buttons (B, S, chart, depth, delete, More). It also has "Add to watchlist" where Kite says "Add". Zerodha's search is opened with ~ and results show an Add button.
15. [P] 02 chapter: "The same company can have separate listings on NSE and BSE ... [VERIFY]" - true; Kite rows show an exchange tag (NSE or BSE). Fine, but the demo symbol "ZETATOOL" examples are fictional, so the tag check in the quiz is not practised on real Kite rows.
16. [M] theme/demos-kite.js kTour: web top nav is drawn as three tabs "Orders | Positions | Holdings". Real order is Dashboard, Orders, Holdings, Positions, (Bids), Funds, Apps [third-party; labels UNCONFIRMED but order Holdings then Positions is stable]. Dashboard, Funds, Apps and index ticker are missing. The web order window is drawn as a docked box with a green-ish "Buy" button class (cft-rc-up) and no Sell; real window floats, Buy is blue and Sell is orange [UNCONFIRMED colours].
17. [P] 01-kite-web-and-mobile-tour/index.md: "Account area", "Watchlist", "Chart" are generic area names with [VERIFY]. Real names: user ID menu (profile, settings, tour), Marketwatch, Chart, order window, Orders, Holdings, Positions, Funds, Bids, Apps, Console (separate site at console.zerodha.com).
18. [M] 01 chapter: "How to reach the demo is [VERIFY]" and "Zerodha states its position [VERIFY]". Answer: Zerodha does not offer paper-trading accounts; the dummy-data demo is at kite-demo.zerodha.com/dashboard and the "Try demo" button on zerodha.com/products/kite (support article). The paper tasks across chapters 04 to 09 say "Place one SL order in the demo ... Cancel the order". One user report says the demo cannot place trades [UNCONFIRMED]. If true, every "place in the demo" task is impossible; check before the book is released.
19. [M] 03-market-depth-and-charts-in-kite/index.md and kDepth: depth is "3 levels or 5 levels" in the demo, with columns "Bid qty, Bid price, Ask price, Ask qty". Real: 5 levels by default and "View 20 depth" for 20; columns Bid or Offer price, Orders, Qty; Zerodha says "Offer", not "Ask". Real depth also shows Open, High, Low, Prev. Close, Volume, Avg. Price, LTQ, LTT, circuit limits, OI, none of which the demo shows. Colours: bids blue and offers red in Zerodha's own text; demo uses cft-pos (positive) and cft-neg for them [colours UNCONFIRMED].
20. [P] 03 chapter and kDepth: "Which options Kite offers is [VERIFY]" and the demo chart offers only Daily/Weekly and Candles/Line. Real: ChartIQ (default) or TradingView, intraday and daily intervals, 100+ studies, 30+ drawing tools, many chart types, and trade from charts. A new learner will not find the demo's two toggles.
21. [P] 03 chapter: "An iceberg order shows only a small part of its full size. You cannot see the rest." On Kite an Iceberg order is run on Zerodha's side: each slice goes to the exchange only after the previous slice fills, minimum Rs 1,00,000 equity, max 10 legs. It is a Kite order variety you can place yourself, which the book does not mention.
22. [P] 07-order-book/index.md: "Status labels such as open, executed, rejected or cancelled [VERIFY]". Real web statuses: OPEN, COMPLETE, REJECTED, CANCELLED, TRIGGER PENDING, AMO REQ RECEIVED, VALIDATION PENDING, etc. "Executed" is only the mobile tab name. The demo kFourViews uses "Open, partly filled" and "Complete"; "partly filled" is not a Kite status [UNCONFIRMED label].
23. [P] 07 chapter: where Kite shows the cost preview and final charges is "[VERIFY]". Known: the order window shows required margin and available margin, with charges between them (staff reply, label removed); final charges are in Console (contract note and ledger). The chapter says "The cost preview is an estimate", which is consistent, but never says where.
24. [P] 07 chapter and kFourViews: Holdings stage says "After settlement the shares show in holdings". Kite shows a CNC buy in Positions on the buy day and in Holdings from the next trading day, as T1 holdings until delivered. The demo has no T1 concept and no "Authorise" step for selling.
25. [P] 07 demo kFourViews / quiz: the Positions panel shows only "Quantity (CNC)" and "Average price". Real Positions rows carry Product, Instrument, Qty., Avg., LTP, P&L, Chg. and no Day/Net tabs in the 2025 description.
26. [M] 08-execution-mistakes/index.md: "Kite may show confirmation prompts or price-range messages [VERIFY]". Per the manual, Kite sends the order when you click Buy or Sell or press Enter; there is no extra confirm step. Kite does show a nudge for quantity above the freeze limit (with slicing), rejects orders outside the circuit band with an RMS message, and rejects insufficient margin with an exact message. The chapter's "price-range messages" are rejections, not warnings.
27. [P] 08 chapter: four mistake families list does not include the two most common Zerodha-documented ones: Market order slippage/market protection and SL vs SL-M availability (blocked for index options and BSE); also "Insufficient funds" and circuit-limit rejection messages. No mention of AMO, Validity (Day, IOC, Minutes) or Disclosed quantity, all on the real window.
28. [M] theme/demos-kite.js kOrderTypes "Sell ticket": has only Order type, Shares, Bought at, Trigger price, Limit price. Real sell window also has Product, Validity, Advanced, margin line and the variety tabs; "Shares" is "Qty." and "Limit price" is "Price" on Kite; "Bought at" does not exist on the ticket.
29. [P] 04 chapter: "Which order types you can use for each product, and on each exchange, is [VERIFY]". Known now: SL-M blocked for index options (NSE, from 27 Sep 2021) and all BSE instruments (2023); market orders blocked for stock options and some index option contracts; Iceberg and Cover are not allowed as AMO; Cover is intraday NSE EQ only. The book's table of four order types is right but gives no exceptions.
30. [P] Whole chapter set: the book never covers the Orders page tabs (Orders, GTT, Baskets, SIPs, Alerts), AMO, Cover, Iceberg, Validity, Market protection, Baskets, Funds, Convert position, Authorise (CDSL TPIN), Terminal Mode, or the mobile swipe-to-place gesture. These are omissions, not errors, but a "recreate each screen faithfully" goal needs them.

Count: 30 items in total. 17 are [M] clear mismatches (items 1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 16, 18, 19, 26, 28) and 13 are [P] probable ones (items 8, 10, 15, 17, 20, 21, 22, 23, 24, 25, 27, 29, 30).

---

## 14. Things to verify on the live demo before the book prints a screen

1. Top nav labels and order, and whether the NIFTY 50 and SENSEX tickers sit left of it.
2. The exact web order window: header colours, tab names, field order, button labels (Buy/Sell, Cancel), where Advanced opens, the product control (radio or tick box).
3. Orders page: tab names; whether Trades is a tab; column names and status colours.
4. Positions: whether Day and Net tabs still exist; column names; total row.
5. Holdings: column names; where the Authorise button and the summary row sit.
6. GTT form and GTT table: column names and the status labels shown.
7. Mobile bottom bar names.
8. Whether the demo allows placing and cancelling an order.
