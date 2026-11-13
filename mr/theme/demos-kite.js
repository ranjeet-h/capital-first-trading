(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});
  var el = L.el, inr = L.inr, P = L.P, S = L.S;

  var KNOTE = "Illustration. Your Kite may look different. The Kite demo is view-only. This book never asks you to place a real order.";
  var ORANGE = "#e0883a";

  // ---------- small helpers ----------
  function st(e, css) { e.style.cssText += ";" + css; return e; }
  function clr(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function uid() { return "k" + Math.random().toString(36).slice(2, 8); }
  function trim(s) { return String(s).replace(/^\s+|\s+$/g, ""); }
  function live(parent) {
    var e = el("div", "cft-live");
    e.setAttribute("aria-live", "polite");
    st(e, "margin:10px 0 6px;padding:6px 10px;border-left:3px solid " + ORANGE + ";background:rgba(127,127,127,.1);font-weight:600");
    parent.appendChild(e);
    return e;
  }
  function textField(parent, label, value, onInput) {
    var w = el("label", "cft-field");
    w.appendChild(el("span", "cft-field-label", label));
    var i = el("input", "cft-num");
    i.type = "text"; i.value = value || "";
    i.addEventListener("input", function () { if (onInput) onInput(i.value); });
    w.appendChild(i); parent.appendChild(w);
    return { el: w, input: i, get: function () { return i.value; }, set: function (v) { i.value = v; } };
  }
  // A row of toggle buttons. opts: [[value, text]]. Returns {get,set}.
  function seg(parent, label, opts, value, onChange) {
    var wrap = el("div", "cft-seg");
    st(wrap, "display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;align-items:center");
    wrap.setAttribute("role", "group");
    if (label) {
      var lb = el("span", "cft-field-label", label);
      st(lb, "font-size:.85em;margin-right:4px;display:inline");
      wrap.appendChild(lb);
    }
    var btns = [], cur = value;
    function paint() {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-v") === cur;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.style.background = on ? ORANGE : "rgba(127,127,127,.15)";
        b.style.color = on ? "#fff" : "inherit";
      });
    }
    opts.forEach(function (o) {
      var b = el("button", "cft-btn", o[1]);
      b.type = "button";
      b.setAttribute("data-v", o[0]);
      st(b, "margin-top:0;min-height:36px;border:1px solid rgba(127,127,127,.55);border-radius:6px");
      b.addEventListener("click", function () { cur = o[0]; paint(); if (onChange) onChange(cur); });
      wrap.appendChild(b); btns.push(b);
    });
    paint();
    parent.appendChild(wrap);
    return { el: wrap, get: function () { return cur; }, set: function (v) { cur = v; paint(); } };
  }
  function screen(parent, title, tag) {
    var s = el("div", "cft-screen");
    var bar = el("div", "cft-screen-bar");
    bar.appendChild(el("span", null, title));
    if (tag) bar.appendChild(el("span", "cft-tag cft-tag-o", tag));
    s.appendChild(bar);
    parent.appendChild(s);
    return s;
  }
  function kbox(host, title, hint) {
    var b = L.box(host, title, hint);
    b.title.appendChild(el("span", "cft-tag cft-tag-o", "Illustration"));
    return b;
  }
  function knote(b) { L.note(b.body, KNOTE); }
  // A plain label/value table that can be re-rendered. rows: [[a, b, strong?]]
  function kv(target, rows) { clr(target); L.table(target, rows); }

  // =====================================================================
  // Flow player: numbered click paths for real Kite tasks.
  // Not a copy of the Kite screens. Only labelled boxes that say which
  // area of the screen a step happens in.
  // =====================================================================
  var PRACTICE = "The Kite demo is view-only. You can look at screens but not place orders. This is not a trading signal.";
  var CHANGE = "Screens and button names can change. Check Kite's help pages.";
  var CS = " [check source]";
  var SRCNOTE = "A note marked [check source] is a time, charge or limit that Zerodha can change. Read Zerodha's current page before you rely on it.";

  // Screen areas for the small schematic strip.
  var REGIONS = {
    web: {
      areas: "'top top user' 'watch page order'",
      cols: "1fr 1fr 1fr",
      list: [["top", "Top menu"], ["user", "User ID menu"], ["watch", "Left watchlist"], ["page", "Main page"], ["order", "Order window"]]
    },
    mobile: {
      areas: "'top' 'screen' 'sheet' 'bottom'",
      cols: "1fr",
      list: [["top", "Top of screen"], ["screen", "Main screen"], ["sheet", "Order screen"], ["bottom", "Bottom bar"]]
    }
  };

  // One step. more: {note, table, extra}
  function K(chip, doIt, where, why, area, more) {
    var o = { chip: chip, doIt: doIt, where: where, why: why, area: area };
    if (more) for (var k in more) if (more.hasOwnProperty(k)) o[k] = more[k];
    return o;
  }

  var FLOWS = {};
  var FLOW_ORDER = [];
  function defFlow(name, f) { f.name = name; FLOWS[name] = f; FLOW_ORDER.push(name); }

  // ---------------------------------------------------------------------
  defFlow("find-your-way-around", {
    short: "Find your way around",
    title: "Find your way around Kite",
    intro: "Learn where the main pages are. You only look. You do not place any order.",
    web: [
      K("Top menu", "Look at the bar along the top of Kite on the web.",
        "Look for page names such as Dashboard, Orders, Holdings, Positions, Funds and Apps. The order can change. Shortcut keys: A, O, H, P and F open Dashboard, Orders, Holdings, Positions and Funds.",
        "Every task starts from this bar. Learn its names first.", "top"),
      K("Watchlist", "Find the watchlist. It is a list of shares you follow.",
        "Look for a price (LTP) and a change figure on each row. Look for the numbers 1 to 7. Each number is its own list. One list holds up to 50 shares.",
        "Most tasks start from a row in this list.", "watch"),
      K("Hover a row", "Move your mouse over one row. Do not click Buy or Sell.",
        "Look for small buttons: Buy (B), Sell (S), Market depth, Chart and a delete button. Also look for a three-dot More menu. It holds Create GTT and Create alert.",
        "These buttons lead to depth, charts, GTT and alerts.", "watch"),
      K("Orders", "Click Orders in the top menu, or press O.",
        "Look for tabs on the page such as Orders, GTT, Baskets, SIPs and Alerts.",
        "Your orders, GTTs and alerts are kept here.", ["top", "page"]),
      K("Holdings", "Click Holdings in the top menu, or press H.",
        "Look for the shares you own. A share you buy for delivery shows here from the next trading day.",
        "Holdings is the list of what you keep.", ["top", "page"]),
      K("Positions", "Click Positions in the top menu, or press P.",
        "Look for today's trades, including intraday trades. A delivery buy shows here on the day you buy it.",
        "Positions is for today. Holdings is for what you keep.", ["top", "page"]),
      K("Funds", "Click Funds in the top menu, or press F.",
        "Look for Available margin, Used margin and Available cash. Look for the Add funds and Withdraw buttons. Do not click them in this practice.",
        "Check your money here before you plan an order.", ["top", "page"]),
      K("User ID menu", "Click your user ID at the top right.",
        "Look for My profile, Settings and the Sticky order window switch. Look for a way to open the tour again.",
        "Settings change how lists and windows behave.", "user")
    ],
    mobile: [
      K("Bottom bar", "Look at the bar at the bottom of the app.",
        "Look for sections such as Watchlist, Orders and Portfolio. The names can differ in your app version. Check your own app.",
        "Every task starts from one of these sections.", "bottom"),
      K("Watchlist", "Open the watchlist. Swipe left or right to move between your lists.",
        "Look for a price and a change figure on each row. Your app may keep several lists.",
        "Most tasks start from a row in this list.", "screen"),
      K("Tap a share", "Tap one share. Do not tap BUY or SELL.",
        "Look for a screen with BUY and SELL, and details such as open, high, low and volume. Scroll to find market depth.",
        "This screen is the doorway to orders, depth and charts.", "sheet"),
      K("Orders", "Open Orders. Swipe left or right between Open, Executed and GTT.",
        "Look for these three tabs. Open shows waiting orders. Executed shows finished and rejected orders.",
        "Your orders and GTTs are kept here.", "screen"),
      K("Portfolio", "Open Portfolio. Swipe between Holdings and Positions.",
        "Look for the shares you keep in Holdings and today's trades in Positions.",
        "Positions is for today. Holdings is for what you keep.", "screen"),
      K("Funds and profile", "Look for Funds and your profile.",
        "They may sit under a profile or account section. Check your own app.",
        "Check your money before you plan an order.", "bottom")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("add-to-watchlist", {
    short: "Add a share to the watchlist",
    title: "Add a share to your watchlist",
    intro: "A watchlist only lists shares. Nothing is bought. The exact symbol matters, so go slowly. The names below are made up.",
    web: [
      K("Pick a list", "Choose the watchlist number you want to add to.",
        "Look for the numbers 1 to 7 near the watchlist. Each number is a separate list of up to 50 shares.",
        "A new share goes into the list that is open.", "watch"),
      K("Search box", "Click the search box above the watchlist, or press the ~ key.",
        "Look for a box at the top of the watchlist. Zerodha calls this Universal search.",
        "One box searches shares, futures and options on all exchanges.", "watch"),
      K("Type the exact symbol", "Type the exact symbol, for example ZETATOOL (a made-up name).",
        "A list of results shows under the box. Read each line slowly.",
        "A few extra letters can mean a different company.", "watch"),
      K("Check NSE or BSE", "Read the exchange tag on each result. NSE and BSE are two different markets.",
        "Look for NSE or BSE next to the symbol.",
        "The same company can be listed on both. Prices can differ a little. Some order types differ too: SL-M orders are blocked on BSE.", "watch"),
      K("Compare similar names", "Compare the full company name, not only the first letters.",
        "Look at the full name next to the symbol. Look for extra letters at the end of a symbol.",
        "Adding the wrong share means you follow, and later may act on, the wrong company.", "watch"),
      K("Click Add", "Click Add next to the right result.",
        "Look for an Add button on the result row.",
        "This only adds a row to your list. It places no order.", "watch"),
      K("Check the row", "Look at your list. The new row should be there.",
        "Look for the symbol, the exchange tag and the price (LTP). Kite saves the list for you.",
        "Make sure you added what you meant. Click the delete button on the row to remove a wrong one.", "watch")
    ],
    mobile: [
      K("Open search", "Open the watchlist and use the search bar.",
        "Look for a search bar or a magnifier icon.",
        "Search is how you find a share.", "top"),
      K("Type the exact symbol", "Type the exact symbol, for example ZETATOOL (a made-up name).",
        "Results appear below. Some results, such as mutual funds or IPOs, cannot be added to a watchlist.",
        "A few extra letters can mean a different company.", "screen"),
      K("Check NSE or BSE", "Read the exchange tag on each result.",
        "Look for NSE or BSE next to the symbol.",
        "The same company can be listed on both markets.", "screen"),
      K("Compare similar names", "Compare the full company name, not only the first letters.",
        "Look at the name next to the symbol.",
        "Adding the wrong share means you follow the wrong company.", "screen"),
      K("Tap +", "Tap the + next to the right result.",
        "Look for a + on the result row.",
        "This only adds a row to your list. It places no order.", "screen"),
      K("Check or remove", "Look at your list. To remove a share, tap the bin icon.",
        "Look for the new row. Your app may allow several lists. Swipe left or right between them.",
        "Make sure you added what you meant.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("read-market-depth", {
    short: "Read market depth",
    title: "Read market depth",
    intro: "Market depth shows the waiting buy and sell orders near the price. Reading it does not place an order.",
    web: [
      K("Hover the row", "Move your mouse over the share in your watchlist.",
        "Look for the small buttons that appear on the row.",
        "The depth button is on that row.", "watch"),
      K("Market depth", "Click Market depth, or select the row and press D.",
        "Look for a panel with two tables. You can keep several depth windows open.",
        "Depth shows who is waiting to buy and who is waiting to sell.", ["watch", "page"]),
      K("Bid and Offer", "Find the two sides. Bid is buyers. Offer is sellers.",
        "Look for the word Bid on one side and Offer on the other. Kite writes Offer, not Ask. Check the colours in your own Kite.",
        "The best bid is the highest price a buyer will pay. The best offer is the lowest price a seller will accept. The gap between them is the spread.", "page"),
      K("Five levels", "Count the rows on each side. There are 5 by default.",
        "Look for the price at each level. The top row is the best price.",
        "Five levels show only the nearest waiting orders.", "page"),
      K("Orders and Qty", "Read the Orders and Qty columns.",
        "Look for Orders (how many separate orders wait at that price) and Qty (how many shares wait at that price).",
        "One big Qty at a price can be one order or many small ones. Orders tells you which.", "page"),
      K("Other numbers", "Look at the other numbers in the panel.",
        "Look for Open, High, Low, Prev. Close, Volume, Avg. Price, LTQ (last traded quantity), LTT (last traded time) and the lower and upper circuit limits.",
        "Circuit limits are the lowest and highest prices the share may trade at today.", "page"),
      K("View 20 depth", "Look for View 20 depth.",
        "Look for a link or arrow in the panel. For some shares it shows 20 levels.",
        "More levels show how many shares wait further from the price.", "page"),
      K("Close it", "Close the panel. Do not click a price in the depth.",
        "Clicking a price level can fill an order window with that price.",
        "Click a price only when you mean to start an order.", "page")
    ],
    mobile: [
      K("Tap a share", "Tap the share in your watchlist.",
        "Look for the screen with the price and the BUY and SELL buttons.",
        "Depth is inside this screen.", "screen"),
      K("Scroll for depth", "Scroll up on that screen to find market depth.",
        "Look for the word Bid on one side and Offer on the other.",
        "Depth shows who is waiting to buy and who is waiting to sell.", "sheet"),
      K("Bid and Offer", "Find the two sides. Bid is buyers. Offer is sellers.",
        "The best bid is the highest price a buyer will pay. The best offer is the lowest price a seller will accept.",
        "The gap between them is the spread.", "sheet"),
      K("Orders and Qty", "Read the Orders and Qty columns.",
        "Orders is how many separate orders wait at a price. Qty is how many shares wait there.",
        "Orders tells you if one big order or many small ones wait.", "sheet"),
      K("View 20 depth", "Look for View 20 depth.",
        "Look for a button below the five levels.",
        "More levels show how many shares wait further from the price.", "sheet")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("place-a-limit-buy-cnc", {
    short: "Place a limit buy (CNC)",
    title: "Place a limit buy order for delivery (CNC)",
    intro: "Follow your written plan. This book never asks you to place a real order. In the demo you can only look at this screen.",
    web: [
      K("Pick the share", "Find the share in your watchlist. Check the name and the exchange tag.",
        "Look for the symbol and NSE or BSE on the row.",
        "A wrong share is the easiest mistake to make.", "watch"),
      K("B (Buy)", "Hover the row and click B, or select the row and press B.",
        "Look for the order window. It floats and you can drag it.",
        "This opens the buy order window for that share.", ["watch", "order"]),
      K("Quantity", "Type the number of shares from your plan.",
        "Look for the box named Qty.",
        "A typed extra zero makes the order ten times bigger.", "order"),
      K("Price", "Type the limit price from your plan.",
        "Look for the box named Price.",
        "A buy limit fills at your price or lower. It may not fill at all.", "order"),
      K("Product: CNC", "Choose Longterm CNC for delivery.",
        "Look for Intraday MIS and Longterm CNC. On some versions it is a tick box named Intraday. Keep it off for CNC.",
        "CNC means you can keep the shares as long as you like. It is not closed for you at the end of the day.", "order"),
      K("Type: Limit", "Choose Limit as the order type.",
        "Look for Market, Limit, SL and SL-M. Pick Limit.",
        "A market order takes the best price now. That price can be far from the price you saw.", "order"),
      K("Validity", "Leave Validity as Day unless your plan says otherwise.",
        "Look under Advanced or More options. Look for Day, Immediate or Cancel and Minutes.",
        "Day means the order ends when the market closes if it has not filled.", "order"),
      K("Check margin", "Read the margin line in the window.",
        "Look for the margin you need and the margin you have. Charges are counted in it.",
        "If you need more than you have, Kite refuses the order with an Insufficient funds message.", "order"),
      K("Click Buy", "Check side, product, quantity and price against your plan. Then click Buy, or press Enter.",
        "Kite sends the order at once. There is no extra are-you-sure step. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "A slip here is not easy to undo. Check before you click.", "order"),
      K("Check Orders", "Open Orders (press O) and find your order.",
        "Look at the Status. OPEN means it is waiting. COMPLETE means it filled. REJECTED means Kite or the exchange refused it. For a reason, open the options menu and click Info.",
        "Always check that the order is what you meant. A delivery buy shows in Positions today and in Holdings from the next trading day.", ["top", "page"],
        { table: [["OPEN", "Waiting to fill"], ["COMPLETE", "Filled"], ["REJECTED", "Refused. Read the reason"], ["CANCELLED", "Cancelled"]] })
    ],
    mobile: [
      K("Tap the share", "Tap the share in your watchlist. Check the name and the exchange tag.",
        "Look for the symbol and NSE or BSE.",
        "A wrong share is the easiest mistake to make.", "screen"),
      K("BUY", "Tap BUY.",
        "Look for the order window with the BUY button.",
        "This opens the order window for a buy.", "sheet"),
      K("Variety", "Choose Regular.",
        "Look for Regular, MTF, Cover, AMO and Iceberg. Swipe to move between them.",
        "Regular is the normal order. The others are special cases.", "sheet"),
      K("Quantity", "Type the number of shares from your plan.",
        "Look for the quantity box and the + and - buttons.",
        "A typed extra zero makes the order ten times bigger.", "sheet"),
      K("Limit and price", "Use the switch icon to pick Limit. Type the limit price from your plan.",
        "Look for a switch icon that moves between Limit and Market. Look for a dropper icon that picks a price from market depth.",
        "A buy limit fills at your price or lower. It may not fill at all.", "sheet"),
      K("Product: CNC", "Leave the Intraday option unticked for delivery (CNC).",
        "Look for a tick box named Intraday. Ticked means MIS. Unticked means delivery.",
        "CNC means you can keep the shares as long as you like.", "sheet"),
      K("More: Validity", "Tap More and look at Validity.",
        "Look for Stoploss, GTT and Validity. Validity choices include Day, Immediate and Minutes.",
        "Day means the order ends when the market closes if it has not filled.", "sheet"),
      K("Check margin", "Look for the margin you need and the margin you have.",
        "Look on the order window. Check your own app for where it shows.",
        "If you need more than you have, Kite refuses the order.", "sheet"),
      K("Swipe to buy", "Check everything. Then swipe the button to buy.",
        "Look for the words Swipe to buy or sell. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "The swipe is the safety step. A tap alone does not place the order.", "sheet"),
      K("Check Orders", "Open Orders. Look at Open and Executed.",
        "A waiting order is in Open. A finished or rejected order is in Executed. Tap an order to see details.",
        "Always check that the order is what you meant.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("place-a-stop-sl-order", {
    short: "Place a stop-loss order",
    title: "Place a stop-loss order (SL or SL-M)",
    intro: "A stop-loss order is a sell order that wakes up when the price falls to your trigger. A plain stop-loss order lasts one trading day only.",
    web: [
      K("Sell window", "Hover the share you hold and click S, or select the row and press S.",
        "Look for the order window. Check the share name and the exchange tag.",
        "A stop on shares you hold is a sell order. A buy would add more shares.", ["watch", "order"]),
      K("Product", "Choose the same product as your position.",
        "Look for Longterm CNC and Intraday MIS. Use CNC for shares in Holdings. Use MIS for an intraday position.",
        "A different product makes a separate position.", "order"),
      K("Type: SL or SL-M", "Choose SL or SL-M.",
        "Look for Market, Limit, SL and SL-M. SL-M is blocked for index options and for BSE shares.",
        "SL is stop-loss limit. You control the lowest price, but it may not fill. SL-M is stop-loss market. It fills, but you do not control the price.", "order"),
      K("Trigger price", "Type the trigger price from your plan.",
        "Look for the Trigger price box. It may stay grey until you pick SL or SL-M.",
        "The trigger is the price that wakes the order up. Nothing happens before it.", "order"),
      K("Price (SL only)", "For SL, also type Price. This is the lowest price you will accept. For SL-M there is no Price.",
        "Look for the Price box. On a sell stop, Price is at or below the trigger. Zerodha's own example: trigger 95 and price 94.90.",
        "When the trigger is reached, a limit order goes to the exchange. If the price falls past your limit, the order stays open. If trigger and price are on the wrong sides, Kite refuses it.", "order"),
      K("Quantity", "Type the number of shares to sell. Do not type more than you hold.",
        "Look for the box named Qty.",
        "More than you hold is refused.", "order"),
      K("One day only", "Read the Validity. A stop-loss order lasts one trading day only.",
        "Look under Advanced or More options. Day is the usual choice.",
        "If it does not trigger, it ends when the session ends. Tomorrow you have no stop. For a longer stop, use a GTT.", "order",
        { note: "A stop-loss order is not a promise to leave at your trigger. In a fast fall it may fill lower, or not at all." }),
      K("Click Sell", "Check side, product, quantity, trigger and price. Then click Sell, or press Enter.",
        "Kite sends the order at once. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "Check before you click.", "order"),
      K("Check Orders", "Open Orders (press O) and find the order.",
        "Look for TRIGGER PENDING. That means it is waiting for the trigger price. If it was rejected, open the options menu and click Info.",
        "Check that the stop is really there. Place it again tomorrow, or use a GTT.", ["top", "page"])
    ],
    mobile: [
      K("Tap the share", "Tap the share you hold, then tap SELL.",
        "Look for the order window with the SELL button.",
        "A stop on shares you hold is a sell order.", "sheet"),
      K("Product", "Set the product to match your position.",
        "Look for the Intraday tick box. Ticked means MIS. Unticked means delivery (CNC).",
        "A different product makes a separate position.", "sheet"),
      K("Quantity", "Type the number of shares to sell.",
        "Look for the quantity box. Do not type more than you hold.",
        "More than you hold is refused.", "sheet"),
      K("More: Stoploss", "Tap More and look for Stoploss.",
        "Look for Stoploss, GTT and Validity. Look for a switch icon to pick SL or SL-M.",
        "SL gives you price control but may not fill. SL-M fills but the price is not controlled. SL-M is blocked for index options and BSE shares.", "sheet"),
      K("Trigger and price", "Type the trigger price. For SL, also type the price.",
        "On a sell stop, the price is at or below the trigger.",
        "If trigger and price are on the wrong sides, Kite refuses the order.", "sheet"),
      K("One day only", "Look at Validity. A stop-loss order lasts one trading day only.",
        "Look under More. Day is the usual choice.",
        "If it does not trigger, it ends when the session ends. For a longer stop, use a GTT.", "sheet"),
      K("Swipe to sell", "Check everything. Then swipe the button to sell.",
        "Look for the words Swipe to buy or sell. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "The swipe is the safety step.", "sheet"),
      K("Check Orders", "Open Orders and look at Open.",
        "Look for the status TRIGGER PENDING.",
        "Check that the stop is really there.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  var GTT_STATUSES = [
    ["active", "The trigger is live and waiting"],
    ["triggered", "The price reached the trigger. Kite placed your order"],
    ["disabled", "Needs you. For example after a bonus or a split. Place a new GTT"],
    ["expired", "A year passed with no trigger, or the contract ended"],
    ["cancelled", "Kite cancelled it. For example the share was delisted"],
    ["rejected", "Kite refused it"],
    ["deleted", "You deleted it"]
  ];
  defFlow("create-a-gtt", {
    short: "Create a GTT",
    title: "Create a GTT (Good Till Triggered)",
    intro: "A GTT waits for a price for up to one year. When the price reaches your trigger, Kite places an order for you. It is a stored order, not a promise to fill.",
    web: [
      K("Way in", "Pick one way in. Way A: hover the share, click the three dots (More), then Create GTT. Way B: click Orders, then the GTT tab, and look for a button to make a new GTT.",
        "Way A also works from Holdings and Positions. The GTT tab under Orders is also where you see, change and cancel your GTTs.",
        "A GTT needs no cash to create. Funds and holdings are checked later, when the order is placed.", ["watch", "page"]),
      K("Buy or Sell", "Pick Buy or Sell at the top left of the form.",
        "Look for the choice at the top left.",
        "A stop on shares you hold is a Sell GTT.", "page"),
      K("Single or OCO", "Pick Single or OCO at the top right.",
        "Look for the choice at the top right. Single has one trigger. OCO (one cancels the other) has two: a stop-loss and a target.",
        "In OCO, when one trigger fires, the other is cancelled.", "page"),
      K("Trigger price", "Type the trigger price. For OCO, type two: the stop-loss trigger and the target trigger.",
        "Look for the Trigger price box. Each trigger fires only once.",
        "Nothing happens until the last traded price (LTP) reaches the trigger.", "page"),
      K("Quantity", "Type the number of shares.",
        "Look for the Quantity box. Do not type more than you hold if you sell.",
        "A sell GTT without enough shares is refused when it fires.", "page"),
      K("Limit or Market, and limit price", "Choose Limit or Market. For Limit, type a limit price.",
        "Look for the choice of Limit or Market and a limit price box. For a Buy GTT, set the limit above the trigger. For a Sell GTT, set it below the trigger, or use Market, to help it fill.",
        "At the trigger, Kite places a limit order. If the price moves past your limit, it may not fill. A fill is not promised.", "page"),
      K("Lasts 365 days", "Look at how long it lasts. A GTT stays active for up to 365 days (one year).",
        "Look for an expiry box on your form. The help pages describe a fixed one-year life, so you may find none.",
        "After a year it expires and you must place a new one." + CS, "page"),
      K("Place", "Click Place.",
        "Look for a Trailing tick box in the stoploss part. It is newer, so it may not be on your screen.",
        "Placing a GTT does not send an order to the exchange yet. It waits.", "page"),
      K("Check the GTT tab", "Open Orders, then the GTT tab. Find your GTT.",
        "Look at the Status. There are seven: active, triggered, disabled, expired, cancelled, rejected and deleted. They may be written in capitals.",
        "Check every GTT after you place it, and after any bonus or split.", ["top", "page"],
        { table: GTT_STATUSES }),
      K("At the trigger", "Know what happens at the trigger.",
        "Kite places your limit order. A sell also needs your CDSL TPIN authorisation unless you have DDPI or POA. If it is not filled by the end of the day, it is cancelled like a normal order. You then need a new GTT.",
        "A GTT is not a guaranteed exit. A gap past your limit can leave you in the share.", "page",
        { note: "Zerodha can cancel or disable a GTT after a bonus, split or large dividend. You must place a fresh one." })
    ],
    mobile: [
      K("Tap the share", "Tap the share you want the GTT for.",
        "Look for the order window.",
        "A GTT starts from a share, like any order.", "sheet"),
      K("Create GTT", "Tap Create GTT.",
        "Look for a Create GTT button. The order window also has a GTT option under More, with stoploss and target as percent.",
        "A GTT needs no cash to create.", "sheet"),
      K("Trigger and quantity", "Type the trigger price and the quantity.",
        "Look for the trigger price and quantity boxes.",
        "Nothing happens until the last traded price (LTP) reaches the trigger.", "sheet"),
      K("Market or limit", "Choose market or limit. For limit, type the limit price.",
        "A Buy GTT limit goes above the trigger. A Sell GTT limit goes below the trigger.",
        "A limit order may not fill if the price moves past it.", "sheet"),
      K("Slide to create", "Slide the Create GTT button.",
        "Look for a slider at the bottom.",
        "The slide is the safety step. A GTT lasts up to 365 days" + CS + ".", "sheet"),
      K("Orders > GTT", "Open Orders and swipe to the GTT tab.",
        "Look at the Status of your GTT. There are seven: active, triggered, disabled, expired, cancelled, rejected and deleted.",
        "Check every GTT after you place it.", "screen",
        { table: GTT_STATUSES })
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("create-an-alert-and-ato", {
    short: "Create an alert (and ATO)",
    title: "Create an alert, and what ATO adds",
    intro: "A simple alert only tells you. ATO (Alert Triggers Order) can also place orders for you. Start with simple alerts.",
    web: [
      K("Way in", "Hover the share, click More, then Create alert. Or click Orders, then Alerts, then New alert.",
        "Look for Create alert in the More menu. Look for Alerts as a tab on the Orders page.",
        "An alert starts from a share.", ["watch", "page"]),
      K("Name", "Type a name for the alert.",
        "Look for the Name box.",
        "A clear name helps you remember why you made it.", "page"),
      K("Property", "Choose the property to watch.",
        "Look for a list of data points. It can include price (open, high, low, close), last or average price, % change, volume, open interest and quantity.",
        "The alert watches this number.", "page"),
      K("Operator", "Choose the operator.",
        "Look for greater than, greater than or equal to, less than, less than or equal to, and equal to.",
        "This says which side of the value fires the alert.", "page"),
      K("Value", "Type the value.",
        "Look for the Value box.",
        "Read the three together as a sentence: property, operator, value. If it is true, the alert fires.", "page"),
      K("Create", "Click Create.",
        "Look for a message that the alert was made. When it fires you get a note in Kite and an email.",
        "An alert is free and lasts 365 days" + CS + ". Zerodha sets a limit on how many you can have" + CS + ".", "page",
        { note: "An alert tells you something happened. It is not a reason to act. Check your plan first." }),
      K("Optional: ATO", "Look for Alert Triggers Order (ATO) in the same form. Click it only if you understand it.",
        "Look for an ATO option in the alert form. Not for currency and commodity.",
        "ATO links the alert to a basket of up to 20 orders. When the alert fires, the orders go to the exchange with no action from you.", "page",
        { note: "Treat ATO as an advanced tool. Practise simple alerts first." }),
      K("ATO basket", "Search a share for the basket. Click B, S or +. Enter the order details. Click Add to basket.",
        "Look for the basket in the form. A market order in an ATO gets market price protection. The default validity is Day.",
        "The order of the basket changes how much margin you need.", "page"),
      K("Create the ATO", "Click Create. Later, check Orders for the ATO.",
        "Look for a bell icon on the order history. You get a push note and an email when it fires and when it fills.",
        "An order placed by ATO may still not fill. Check it like any order.", ["top", "page"])
    ],
    mobile: [
      K("Tap the share", "Tap the share, then Set alert. Or open Orders, then Alerts, then + New alert.",
        "Look for Set alert on the share screen.",
        "An alert starts from a share.", "sheet"),
      K("Name and rule", "Type a name. Pick the property, the operator and type the value.",
        "Look for the same four items as on the web: name, property, operator, value.",
        "Read them together as a sentence. If it is true, the alert fires.", "sheet"),
      K("Swipe to create", "Swipe the button to create the alert.",
        "Look for the swipe button at the bottom.",
        "An alert is free and lasts 365 days" + CS + ".", "sheet",
        { note: "An alert tells you something happened. It is not a reason to act. Check your plan first." }),
      K("Optional: ATO", "Look for the ATO switch. Turn it on only if you understand it.",
        "Look for a toggle named ATO. Then search a share, tap B, S or +, enter details and tap Add to basket.",
        "ATO links the alert to up to 20 orders that go to the exchange with no action from you.", "sheet",
        { note: "Treat ATO as an advanced tool. Practise simple alerts first." })
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("check-orders-trades-positions-holdings", {
    short: "Follow one order",
    title: "Follow one order through Kite",
    intro: "Follow one delivery buy order of 10 shares. Ask the same question on each page: do the numbers agree?",
    web: [
      K("Orders", "Open Orders (press O). Find your order.",
        "Look at the Status and the filled quantity. A part-filled order stays open.",
        "The order is your request. It is not the same as a fill.", ["top", "page"],
        { table: [["OPEN", "Waiting, or part-filled"], ["COMPLETE", "Filled in full"], ["REJECTED", "Refused. Options menu, then Info"], ["CANCELLED", "Cancelled"], ["TRIGGER PENDING", "Waiting for a trigger price"], ["AMO REQ RECEIVED", "After-market order waiting"]] }),
      K("Trades (fills)", "Look for the fills of your order.",
        "Look for a trades list or the fill details under your order. The name can differ. One order can have several fills at different prices.",
        "A fill is one trade. The average price of the fills is what you paid.", ["top", "page"]),
      K("Positions", "Open Positions (press P).",
        "Look for columns such as Product, Instrument, Qty., Avg., LTP and P&L. A delivery buy shows here on the day you buy it.",
        "The Avg. covers all of today's trades in that share.", ["top", "page"]),
      K("Holdings", "Open Holdings (press H) on the next trading day.",
        "Look for T1 holdings. These are shares bought but not yet delivered to your demat. After delivery they move into your main holding.",
        "Holdings is what you really own.", ["top", "page"]),
      K("Do the numbers agree?", "Compare: order quantity, total fills, Positions quantity, Holdings quantity.",
        "They should all say 10 for this order. Write down any difference.",
        "A difference means a part-fill, a second trade, or a mistake. Find out which.", "page")
    ],
    mobile: [
      K("Orders", "Open Orders. Look at Open and Executed.",
        "Open shows waiting orders. Executed shows finished and rejected ones. Swipe between Open, Executed and GTT.",
        "The order is your request. It is not the same as a fill.", "screen"),
      K("Order details", "Tap your order.",
        "Look for the status, the quantity filled and the price.",
        "The average price of the fills is what you paid.", "screen"),
      K("Positions", "Open Portfolio and swipe to Positions.",
        "Look for your share and its quantity and average price.",
        "A delivery buy shows here on the day you buy it.", "screen"),
      K("Holdings", "Swipe to Holdings on the next trading day.",
        "A summary at the top shows what you invested, the current value and the profit or loss.",
        "Holdings is what you really own.", "screen"),
      K("Do the numbers agree?", "Compare: order quantity, total fills, Positions quantity, Holdings quantity.",
        "They should all say 10 for this order.",
        "A difference means a part-fill, a second trade, or a mistake.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("cancel-or-modify-an-order", {
    short: "Cancel or change an order",
    title: "Cancel or change an order that is waiting",
    intro: "You can only change an order that has not filled yet. A filled order cannot be cancelled.",
    web: [
      K("Open Orders", "Open Orders (press O).",
        "Look for your order in the list.",
        "All your orders for the day are here.", ["top", "page"]),
      K("Find a waiting order", "Find the order. Check its Status.",
        "Look for OPEN or TRIGGER PENDING. COMPLETE, REJECTED and CANCELLED cannot be changed.",
        "Only waiting orders can be changed.", "page"),
      K("Hover the row", "Move your mouse over the row.",
        "Look for Modify and Cancel on the row. You may also find an options menu at the right edge.",
        "These are the doors to change or cancel.", "page"),
      K("Modify", "To change it, click Modify. Change quantity, price or trigger. Confirm.",
        "Look for the order window with your order filled in.",
        "Change only what your plan says. Then check the row again.", ["page", "order"]),
      K("Cancel", "To stop it, click Cancel.",
        "Look for a note that the order was cancelled.",
        "A waiting order holds some of your margin. Cancelling frees it.", "page"),
      K("Check the status", "Look at the row again.",
        "Look for CANCELLED. CANCEL PENDING means Kite is still working on it. If it says COMPLETE, it filled before you cancelled.",
        "You must know the order is really gone.", "page")
    ],
    mobile: [
      K("Open Orders", "Open Orders. Stay on the Open tab.",
        "Open shows waiting orders.",
        "Only waiting orders can be changed.", "screen"),
      K("Tap the order", "Tap the order you want to change.",
        "Look for its details and the choices to modify, repeat or cancel.",
        "Check the details before you act.", "screen"),
      K("Modify or Cancel", "Tap Modify to change it, or Cancel to stop it.",
        "Look for the buttons on the order screen.",
        "A waiting order holds some of your margin. Cancelling frees it.", "sheet"),
      K("Many at once", "To cancel several, press and hold one order. Then tick the others.",
        "Look for Select all. It cancels every waiting order, not just one.",
        "Use it with care. Read what you selected first.", "screen"),
      K("Check the status", "Look at the Open and Executed tabs again.",
        "Look for CANCELLED. If it says COMPLETE, it filled first.",
        "You must know the order is really gone.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("convert-position-and-mis-square-off", {
    short: "Convert a position, MIS square-off",
    title: "Convert a position, and the MIS square-off",
    intro: "An intraday (MIS) position is closed for you at a set time, and Zerodha charges for it. Convert it before then if your plan is to keep it.",
    web: [
      K("Know your product", "Check the product on your position. MIS is intraday. CNC and NRML can be kept.",
        "Open Positions (press P). Look for the Product column or label.",
        "MIS is closed for you at the end of the day. CNC is not.", ["top", "page"]),
      K("Square-off times", "Know the times. Most equity MIS: 3:25 PM" + CS + ". Futures and options MIS: 3:26 PM" + CS + ".",
        "Shares in the Closing Auction Session close at 3:12 PM" + CS + ". Zerodha changed the times on 26 December 2025.",
        "After the time, the position is closed for you at the price then.", "page"),
      K("The charge", "Know the charge. Zerodha charges Rs 50 plus 18% GST for each order it squares off" + CS + ".",
        "18% of Rs 50 is Rs 9. So the charge is Rs 59 for one order.",
        "The charge is on top of any loss or profit.", "page",
        { note: "The times and the charge can change. Read Zerodha's current page." }),
      K("Open the options menu", "Hover the row of the position. Look for Convert.",
        "Look for Convert in the row buttons or in the options menu at the right edge. A Cover order cannot be converted.",
        "Convert changes the product of the same position.", "page"),
      K("Choose the new product", "Click Convert. Choose the new product, for example CNC for a share.",
        "Look for a window with the product choices and the quantity.",
        "Use it only if your plan says to keep the position. Look for a message if there is not enough money.", "page"),
      K("Do it before the time", "Do the conversion before the square-off time.",
        "After the time you cannot turn CNC or NRML into MIS. You also cannot place new MIS orders.",
        "Late is too late.", "page"),
      K("Or exit", "To close the position yourself, hover the row and click Exit.",
        "Look for Exit in the row buttons or the options menu.",
        "Exit places the opposite order with the same product.", "page")
    ],
    mobile: [
      K("Open Positions", "Open Portfolio and swipe to Positions.",
        "Look for your position and its product.",
        "MIS is closed for you at the end of the day. CNC is not.", "screen"),
      K("Square-off times", "Know the times. Most equity MIS: 3:25 PM" + CS + ". Futures and options MIS: 3:26 PM" + CS + ".",
        "Shares in the Closing Auction Session close at 3:12 PM" + CS + ".",
        "After the time, the position is closed for you.", "screen"),
      K("The charge", "Know the charge: Rs 50 plus 18% GST, so Rs 59, for each order Zerodha squares off" + CS + ".",
        "18% of Rs 50 is Rs 9. 50 plus 9 is 59.",
        "The charge is on top of any loss or profit.", "screen"),
      K("Convert", "Tap the position. Swipe up on it to find Convert.",
        "Look for Convert and the new product choices.",
        "Use it only if your plan says to keep the position.", "sheet"),
      K("Or exit", "To close it yourself, tap the position, then tap Exit.",
        "Look for the Exit button.",
        "Exit places the opposite order.", "sheet")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("sell-holdings-with-tpin", {
    short: "Sell holdings (authorise)",
    title: "Sell shares you hold (and authorise the sale)",
    intro: "To sell shares from your demat, you may need to authorise the sale with a CDSL TPIN. This book never asks you to place a real order. In the demo you can only look at this screen.",
    web: [
      K("Open Holdings", "Open Holdings (press H).",
        "Look for the share you want to sell.",
        "Shares you own are here.", ["top", "page"]),
      K("Authorise", "Click Authorise.",
        "Look for an Authorise button on the Holdings page. You may also see a prompt when you try to sell.",
        "Unless you have DDPI or POA, you must authorise a sale of delivery shares.", "page"),
      K("TPIN and OTP", "Follow the steps. Get your TPIN by email and SMS. Enter it with the OTP on the CDSL page.",
        "Look for the CDSL page that opens. Do not share your TPIN or OTP with anyone.",
        "The TPIN is the key to your demat. Keep it private.", "page"),
      K("One day only", "Know that the approval is good for one day.",
        "You must do this again on another day.",
        "It is a daily safety check.", "page"),
      K("Sell", "Hover the share and open the Options drop-down. Click Exit. Or use a CNC sell from the watchlist.",
        "Look for the exchange choice. The default is the exchange with the higher previous-day close. You can choose NSE or BSE.",
        "Check the exchange tag, the quantity and the price before you click.", ["page", "order"]),
      K("Check Orders and Positions", "Open Orders and then Positions.",
        "Look for the order status. A sold holding shows as a negative quantity in Positions for the rest of the day.",
        "If you buy it back the same day, it counts as an intraday trade for charges.", ["top", "page"])
    ],
    mobile: [
      K("Open Holdings", "Open Portfolio and look at Holdings.",
        "Look for the share you want to sell.",
        "Shares you own are here.", "screen"),
      K("Authorise", "Tap Authorise.",
        "Look for an Authorise button or a prompt when you try to sell.",
        "Unless you have DDPI or POA, you must authorise a sale of delivery shares.", "screen"),
      K("TPIN and OTP", "Follow the steps with your TPIN and OTP.",
        "Do not share your TPIN or OTP with anyone.",
        "The approval is good for one day.", "screen"),
      K("Exit", "Tap the share, then Exit.",
        "Look for the exchange choice, the quantity and the price.",
        "Check them before you swipe.", "sheet"),
      K("Check Orders", "Open Orders. Then look at Positions.",
        "A sold holding shows as a negative quantity in Positions for the rest of the day.",
        "Check that the sale is what you meant.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("funds-and-margin", {
    short: "Funds and margin",
    title: "Funds and margin",
    intro: "Margin is the money Kite sets aside for an order. Learn where the numbers are. In the demo, only read.",
    web: [
      K("Open Funds", "Click Funds in the top menu, or press F.",
        "Look for the Funds page.",
        "This page shows your money.", ["top", "page"]),
      K("Available margin", "Read Available margin.",
        "Look for Available margin (cash plus collateral). This is what you can use for new trades.",
        "It is the first number to check before an order.", "page"),
      K("Used margin", "Read Used margin.",
        "Look for Used margin. It is money held for open trades and waiting orders.",
        "A waiting order holds margin. Cancel it to free the money.", "page"),
      K("Available cash", "Read Available cash.",
        "Look for Available cash, Opening balance and Payin. A negative cash balance pays interest at about 0.05% a day" + CS + ".",
        "Cash is what you really hold.", "page"),
      K("Add funds", "Know how to add money. Click Add funds, type an amount, then choose UPI or net banking.",
        "UPI is free and instant. Net banking has a fee" + CS + ". Do not do this in the demo.",
        "Know the way before you need it.", "page"),
      K("Withdraw", "Know how to take money out. Click Withdraw.",
        "Look for a request page on Console. Requests are handled at set cut-off times" + CS + ".",
        "Plan ahead. Money does not move at once.", "page"),
      K("Margin in the order window", "Open an order window (press B) and read the margin line.",
        "Look for the margin needed and the margin you have.",
        "If you need more than you have, Kite refuses the order with Insufficient funds.", "order")
    ],
    mobile: [
      K("Find Funds", "Look for Funds in the app.",
        "It may sit under a profile or account section. Check your own app.",
        "This page shows your money.", "bottom"),
      K("Read the numbers", "Read Available margin, Used margin and Available cash.",
        "Available margin is what you can use. Used margin is held for open trades and waiting orders.",
        "A waiting order holds margin. Cancel it to free the money.", "screen"),
      K("Add funds and Withdraw", "Know where to add and take out money. Do not do this in the demo.",
        "Look for Add funds and Withdraw. UPI is free and instant" + CS + ".",
        "Know the way before you need it.", "screen"),
      K("Margin in the order window", "Open an order window and read the margin line.",
        "Look for the margin needed and the margin you have.",
        "If you need more than you have, Kite refuses the order.", "sheet")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("amo", {
    short: "After-market order (AMO)",
    title: "Place an after-market order (AMO)",
    intro: "An AMO is an order placed when the market is closed. It waits and goes to the exchange next morning. It is not a promise to fill.",
    web: [
      K("Know the window", "Know when AMO time is. For equity it is about 4:00 PM to 8:58 AM" + CS + ".",
        "Futures and options, currency and commodity times differ" + CS + ".",
        "Outside this time, an order is a normal order.", "page"),
      K("Open the order window", "Hover the share and click B or S.",
        "Look for the order window. Outside market hours, a regular order becomes an AMO on its own.",
        "You do not need to pick a special button.", ["watch", "order"]),
      K("Fill in the order", "Type quantity and price. Choose product and Limit, as in a normal order.",
        "Look for the AMO choice in the order window. Do not tick the GTT box: it is refused.",
        "An AMO can be CNC, MIS or NRML. It cannot be Iceberg or Cover.", "order"),
      K("Click Buy or Sell", "Check everything. Click Buy or Sell. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "Kite takes the order.",
        "Check before you click.", "order"),
      K("Check Orders", "Open Orders (press O).",
        "Look for the status AMO REQ RECEIVED.",
        "It is not yet at the exchange. You can still modify or cancel it.", ["top", "page"]),
      K("At the open", "Know when it goes out. Equity market and limit orders go to the exchange at 9:00 AM" + CS + ". Stop-loss orders go at 9:15 AM" + CS + ".",
        "Look at Orders after the open. The status changes.",
        "The price at the open can be very different from yesterday's close.", "page"),
      K("It may not fill", "Know the limit. Zerodha says AMOs are not guaranteed to fill.",
        "Look at Orders after 9:15 AM.",
        "Plan for the case where it does not fill.", "page")
    ],
    mobile: [
      K("Tap the share", "Tap the share, then BUY or SELL.",
        "Look for the order window.",
        "Outside market hours, a regular order becomes an AMO on its own.", "sheet"),
      K("Variety: AMO", "Swipe to AMO if you want to be sure.",
        "Look for Regular, MTF, Cover, AMO and Iceberg.",
        "AMO is the after-market choice.", "sheet"),
      K("Fill in the order", "Type quantity and price. Choose Limit.",
        "Look for the same boxes as a normal order.",
        "An AMO cannot be Iceberg or Cover.", "sheet"),
      K("Swipe", "Check everything. Then swipe. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "Look for the words Swipe to buy or sell.",
        "The swipe is the safety step.", "sheet"),
      K("Check Orders", "Open Orders.",
        "Look for AMO REQ RECEIVED. It goes to the exchange next morning" + CS + ".",
        "AMOs are not guaranteed to fill.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("chart-basics", {
    short: "Chart basics",
    title: "Chart basics",
    intro: "Practise on charts only. Do not place orders from a chart. The reader's task is to find and use the chart tools.",
    web: [
      K("Open the chart", "Hover the share and click Chart, or select the row and press C.",
        "Look for a chart with daily candles by default.",
        "The chart is where you read the past.", ["watch", "page"]),
      K("Interval", "Find the interval (the time of one candle).",
        "Look for a time picker at the top of the chart. It can include 1 minute up to daily.",
        "The same prices look different at a different interval.", "page"),
      K("Chart type", "Find the chart type. Candles are the default.",
        "Look for a candle icon you can click to change the style.",
        "A candle shows open, high, low and close of one period.", "page"),
      K("Indicators", "Open the indicators menu. Zerodha calls them Studies.",
        "Look for a search box that lists over 100 indicators. Add one, for example a moving average.",
        "An indicator is a calculation on past prices. It describes the past.", "page"),
      K("Remove an indicator", "Remove the indicator you added.",
        "Right-click it, or click the X next to it in Studies.",
        "Know how to clean up the chart.", "page"),
      K("Drawing tools", "Open the drawing tools. Draw a line.",
        "Look for a tool panel with 30 or more tools, such as lines. Each can be changed.",
        "Lines you draw are for study. They place no order.", "page"),
      K("Chart engine", "Know that Kite has two chart engines: ChartIQ and TradingView.",
        "Look in your profile settings for the choice.",
        "Menus can differ between the two.", "user"),
      K("Stay on charts", "Close the chart. Do not use any Buy or Sell button on a chart.",
        "Some charts let you place orders by dragging on the chart. Do not.",
        "This practice is for charts only.", "page")
    ],
    mobile: [
      K("Open the chart", "Tap the share, then the chart icon.",
        "Look for a chart screen.",
        "The chart is where you read the past.", "screen"),
      K("Interval", "Find the interval.",
        "Look for a time picker on the chart.",
        "The same prices look different at a different interval.", "screen"),
      K("Indicators", "Open the indicators menu. Add one, for example a moving average.",
        "Look for an indicators or studies button.",
        "An indicator is a calculation on past prices. It describes the past.", "screen"),
      K("Drawing tools", "Open the drawing tools. Draw a line.",
        "Look for a tool button. Lines you draw place no order.",
        "Lines are for study.", "screen"),
      K("Stay on charts", "Do not tap the Buy or Sell buttons at the bottom of the chart.",
        "Look for them so that you know where they are.",
        "This practice is for charts only.", "bottom")
    ]
  });

  // ---------------------------------------------------------------------
  defFlow("mobile-swipe-to-place", {
    short: "Mobile: swipe to place",
    title: "Mobile: swipe to place an order",
    intro: "On the Kite app you place an order by swiping a button. This flow shows the full path. This book never asks you to place a real order. In the demo you can only look at this screen.",
    mobileOnly: true,
    steps: [
      K("Tap the share", "Tap the share in your watchlist.",
        "Look for the screen with BUY and SELL.",
        "Check the name and the exchange tag first.", "screen"),
      K("BUY or SELL", "Tap BUY or SELL.",
        "The order window opens. Since July 2024 it first shows only the quantity and the price.",
        "The essentials come first. The rest is under More.", "sheet"),
      K("Variety", "Pick the variety. Swipe between them.",
        "Look for Regular, MTF, Cover, AMO and Iceberg.",
        "Regular is the normal choice.", "sheet"),
      K("Quantity", "Type the quantity. Use + and - to change it by one.",
        "Look for the quantity box. A switch icon can change it to lots or amount.",
        "Check it against your plan.", "sheet"),
      K("Limit or Market", "Use the switch icon to pick Limit or Market. For Limit, type the price.",
        "Look for the dropper icon. It picks a price from market depth.",
        "Limit controls the price. Market does not.", "sheet"),
      K("Intraday tick", "Tick Intraday for MIS. Leave it unticked for delivery (CNC).",
        "Look for the tick box named Intraday.",
        "The wrong product is a common slip.", "sheet"),
      K("More", "Tap More.",
        "Look for Stoploss, GTT and Validity.",
        "Extras live here.", "sheet"),
      K("Swipe", "Check everything. Then swipe the button.",
        "Look for the words Swipe to buy or sell. A plain tap does not place the order.",
        "The swipe is the safety step. This book never asks you to place a real order. In the demo you can only look at this screen.", "sheet"),
      K("Check Orders", "Open Orders. Look at Open and Executed.",
        "Look for the status and the filled quantity.",
        "Always check that the order is what you meant.", "screen")
    ]
  });

  // ---------------------------------------------------------------------
  // The paper walkthrough (plan, size, find entry fields, find stop fields, record).
  // Steps carry an id so a chapter can show only some of them.
  // ---------------------------------------------------------------------
  var WT = { cap: 50000, risk: 1, entry: 250, stop: 240, conc: 25, gap: 2 };
  function wtCalc() {
    var budget = WT.cap * WT.risk / 100, rps = WT.entry - WT.stop;
    if (!(rps > 0) || !(WT.entry > 0)) return { ok: false, budget: budget, rps: rps };
    var raw = Math.floor(budget / rps), cash = Math.floor(WT.cap / WT.entry), conc = Math.floor(WT.cap * WT.conc / 100 / WT.entry);
    var shares = Math.max(0, Math.min(raw, cash, conc)), names = [];
    if (raw === shares) names.push("the risk budget");
    if (cash === shares) names.push("the cash cap");
    if (conc === shares) names.push("the concentration cap");
    return { ok: true, budget: budget, rps: rps, raw: raw, cash: cash, conc: conc, shares: shares, names: names, loss: shares * rps, value: shares * WT.entry };
  }
  function wtRows(id) {
    var c = wtCalc();
    if (!c.ok) return [["Check", "For a long trade the stop must be below the entry."]];
    if (id === "plan") return [["Entry", inr(WT.entry)], ["Stop", inr(WT.stop)], ["Risk per share", inr(c.rps)], ["Risk budget", inr(c.budget)], ["Product", "CNC"], ["Review date", "Written down"]];
    if (id === "size") return [
      ["Risk budget: " + WT.cap + " x " + WT.risk + "%", inr(c.budget)],
      ["Raw shares: floor(" + c.budget + " / " + c.rps + ")", String(c.raw)],
      ["Cash cap: floor(" + WT.cap + " / " + WT.entry + ")", String(c.cash)],
      ["Concentration cap (" + WT.conc + "%)", String(c.conc)],
      ["Shares: the smallest of the three", String(c.shares), true],
      ["Planned loss: " + c.shares + " x " + c.rps, inr(c.loss), true]
    ];
    if (id === "place-entry") return [["Side", "Buy"], ["Product", "CNC"], ["Quantity", String(c.shares)], ["Type", "Limit"], ["Price", inr(WT.entry)], ["Order value", inr(c.value)]];
    if (id === "place-stop") return [["Type", "GTT, Sell, Single"], ["Trigger", inr(WT.stop)], ["Quantity", String(c.shares)], ["Limit", inr(WT.stop - WT.gap)], ["Lasts", "up to 365 days"]];
    return [["Mode", "paper (never live)"], ["Planned loss", inr(c.loss)], ["Binding limit", c.names.join(" and ")], ["What happened on paper", "Write it here"], ["Compared with plan", "Write one line"]];
  }
  defFlow("demo-walkthrough", {
    short: "Paper walkthrough",
    title: "The paper walkthrough: plan, size, find the entry fields, find the stop fields, record",
    intro: "The steps in order for one paper trade. The first numbers are the book's worked example. No step places an order. You only write, work out numbers and look at screens.",
    hasInputs: true,
    steps: [
      K("Plan", "Write your plan on paper before you open Kite: entry, stop, size, product and review date.",
        "This step is outside Kite. Use your notebook or journal.",
        "Plan first. Screen second.", "off", { id: "plan", tbl: "plan" }),
      K("Size", "Work out the number of shares from your risk budget. Do it on paper.",
        "This step is outside Kite. Use the numbers above.",
        "The size comes from your risk, not from a feeling.", "off", { id: "size", tbl: "size" }),
      K("Find the entry fields", "Open the buy window (B on web, BUY on mobile) and look at the fields. Match each one to your paper plan. Do not click Buy.",
        "Look for Qty, Price, product CNC, type Limit and the margin line. This book never asks you to place a real order. In the demo you can only look at this screen.",
        "Know which field holds side, product, quantity and price.", ["watch", "order"], { id: "place-entry", tbl: "place-entry", note: "These numbers are for your paper plan. Nothing is sent." }),
      K("Find the stop fields", "For a hold of weeks, a stop is a GTT: Sell, Single, trigger, limit and quantity. Look at the GTT screen and match its fields to your paper plan. See the flow Create a GTT.",
        "A plain SL order lasts one trading day only. A GTT lasts up to 365 days" + CS + ". Look in Orders, then GTT. Do not create one here.",
        "A stop that ends tonight does not protect you tomorrow.", ["page", "order"], { id: "place-stop", tbl: "place-stop", note: "In a live account, a GTT sell may need CDSL TPIN authorisation. A fill at the trigger is not promised." }),
      K("Record", "Write down your paper trade and compare it with your plan.",
        "This step is outside Kite. Use your journal.",
        "A paper trade gives no real profit or loss. It does not prove your plan works.", "off", { id: "record", tbl: "record" })
    ]
  });

  // ---------------------------------------------------------------------
  // The player
  // ---------------------------------------------------------------------
  function flowSteps(f, plat) {
    var a = plat === "mobile" ? (f.mobile || f.steps) : (f.web || f.steps);
    return a || f.steps || f.web || f.mobile || [];
  }
  function hasToggle(f) { return !!(f.mobile && (f.web || f.steps)) && !f.mobileOnly; }

  function schematic(parent, plat, area) {
    var R = REGIONS[plat] || REGIONS.web, wrap = el("div", "cft-flow-map");
    wrap.setAttribute("role", "img");
    var hit = (area instanceof Array) ? area : (area ? [area] : []);
    var names = [];
    var style = "display:grid;gap:4px;margin:8px 0;grid-template-columns:" + R.cols + ";grid-template-areas:" + R.areas;
    if (plat === "mobile") style += ";max-width:240px";
    st(wrap, style);
    R.list.forEach(function (r) {
      var on = hit.indexOf(r[0]) > -1;
      if (on) names.push(r[1]);
      var b = el("div", "cft-flow-box" + (on ? " cft-flow-on" : ""), r[1]);
      st(b, "grid-area:" + r[0] + ";text-align:center;font-size:.8em;padding:6px 4px;border-radius:4px;" +
        (on ? "border:2px solid " + ORANGE + ";background:rgba(224,136,58,.25);font-weight:700"
            : "border:1px dashed rgba(127,127,127,.6);opacity:.65"));
      wrap.appendChild(b);
    });
    wrap.setAttribute("aria-label", names.length ? "Where on the screen: " + names.join(" and ") : "This step happens outside Kite");
    parent.appendChild(wrap);
    var cap = el("div", "cft-note", names.length ? "Where on the screen: " + names.join(", then ") + ". (Plain boxes, not the real layout.)" : "This step happens outside Kite, on paper or in your journal.");
    parent.appendChild(cap);
  }

  function flowPlayer(host, names, o) {
    o = o || {};
    var fname = o.start && FLOWS[o.start] ? o.start : names[0];
    var plat = o.platform === "mobile" ? "mobile" : "web";
    var idx = 0, timer = null, only = o.only || null;
    var b = L.box(host, "Click path: follow the steps",
      "What to try: press Next to walk the path one step at a time, or press Play. Click a step in the path to jump to it." + (names.length > 1 ? " Pick a task first." : ""));
    b.title.appendChild(el("span", "cft-tag cft-tag-o", "Path guide"));
    var body = b.body;

    var taskSeg = null;
    if (names.length > 1) taskSeg = seg(body, "Task", names.map(function (n) { return [n, FLOWS[n].short]; }), fname, function (v) { fname = v; idx = 0; stopPlay(); render(); });
    var head = el("div"); st(head, "margin:6px 0"); body.appendChild(head);
    var platSeg = seg(body, "Version", [["web", "Web"], ["mobile", "Mobile app"]], plat, function (v) { plat = v; idx = 0; stopPlay(); render(); });
    var inputsBox = el("div"); body.appendChild(inputsBox);
    var crumb = el("div", "cft-flow-path");
    crumb.setAttribute("role", "navigation"); crumb.setAttribute("aria-label", "Click path");
    st(crumb, "display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:8px 0");
    body.appendChild(crumb);
    var mapBox = el("div"); body.appendChild(mapBox);
    var card = screen(body, "");
    var cardBar = card.firstChild;
    var cardBody = el("div"); card.appendChild(cardBody);
    var bar = el("div", "cft-btn-row");
    body.appendChild(bar);
    var bBack = L.button(bar, "Back", function () { stopPlay(); go(idx - 1); });
    var bNext = L.button(bar, "Next", function () { stopPlay(); go(idx + 1); });
    var bPlay = L.button(bar, "Play", function () { if (timer) stopPlay(); else startPlay(); });
    var out = live(body);
    var foot = el("div"); body.appendChild(foot);

    function cur() {
      var f = FLOWS[fname], all = flowSteps(f, plat);
      if (only) {
        var sub = all.filter(function (s) { return s.id && only.indexOf(s.id) > -1; });
        if (sub.length) return { f: f, steps: sub };
      }
      return { f: f, steps: all };
    }
    function stopPlay() {
      if (timer) { clearInterval(timer); timer = null; }
      bPlay.textContent = "Play";
    }
    function startPlay() {
      var c = cur();
      if (timer) return;
      if (idx >= c.steps.length - 1) { idx = 0; render(); }
      bPlay.textContent = "Pause";
      timer = setInterval(function () {
        if (host.isConnected === false) { stopPlay(); return; }
        var n = cur().steps.length;
        if (idx < n - 1) { idx++; render(); }
        if (idx >= n - 1) stopPlay();
      }, 4500);
    }
    function go(i) {
      var n = cur().steps.length;
      idx = Math.max(0, Math.min(n - 1, i));
      render();
    }
    function render() {
      var c = cur(), f = c.f, steps = c.steps, n = steps.length;
      if (idx > n - 1) idx = n - 1;
      var s = steps[idx];
      if (f.mobileOnly) plat = "mobile";
      // toggle
      var tog = hasToggle(f);
      platSeg.el.style.display = tog ? "flex" : "none";
      platSeg.set(plat);
      if (taskSeg) taskSeg.set(fname);
      // head
      clr(head);
      var t = el("div", null, f.title); st(t, "font-weight:700;font-size:1.05em"); head.appendChild(t);
      head.appendChild(el("p", "cft-note", f.intro));
      if (f.mobileOnly) head.appendChild(el("p", "cft-note", "This flow is for the Kite mobile app only."));
      // inputs for the walkthrough
      clr(inputsBox);
      if (f.hasInputs) {
        var row = L.row(inputsBox);
        L.numberField(row, { label: "Capital (Rs)", value: WT.cap, step: "any", onInput: function (v) { WT.cap = v; render2(); } });
        L.numberField(row, { label: "Risk per trade (%)", value: WT.risk, step: "any", onInput: function (v) { WT.risk = v; render2(); } });
        L.numberField(row, { label: "Entry price (Rs)", value: WT.entry, step: "any", onInput: function (v) { WT.entry = v; render2(); } });
        L.numberField(row, { label: "Stop trigger (Rs)", value: WT.stop, step: "any", onInput: function (v) { WT.stop = v; render2(); } });
      }
      // breadcrumb
      clr(crumb);
      var plain = [];
      steps.forEach(function (st1, i) {
        if (i > 0) { var ar = el("span", null, "→"); ar.setAttribute("aria-hidden", "true"); st(ar, "opacity:.6"); crumb.appendChild(ar); }
        var on = i === idx;
        var cb = el("button", "cft-btn cft-flow-chip" + (on ? " cft-chip-on" : ""), (i + 1) + ". " + st1.chip);
        cb.type = "button";
        if (on) cb.setAttribute("aria-current", "step");
        st(cb, "margin-top:0;min-height:32px;padding:3px 10px;border-radius:14px;font-size:.85em;border:1px solid " + (on ? ORANGE : "rgba(127,127,127,.55)") +
          ";background:" + (on ? ORANGE : (i < idx ? "rgba(127,127,127,.28)" : "rgba(127,127,127,.12)")) + ";color:" + (on ? "#fff" : "inherit") + (on ? ";font-weight:700" : ""));
        (function (k) { cb.addEventListener("click", function () { stopPlay(); go(k); }); })(i);
        crumb.appendChild(cb);
        plain.push(st1.chip);
      });
      // map
      clr(mapBox);
      schematic(mapBox, plat, s.area === "off" ? null : s.area);
      // card
      cardBar.firstChild.textContent = "Step " + (idx + 1) + " of " + n + ": " + s.chip;
      clr(cardBody);
      var p1 = el("p", null, s.doIt); st(p1, "font-weight:600"); cardBody.appendChild(p1);
      var p2 = el("p", null, ""); p2.appendChild(el("strong", null, "Where to look: ")); p2.appendChild(document.createTextNode(s.where)); cardBody.appendChild(p2);
      var p3 = el("p", null, ""); p3.appendChild(el("strong", null, "Why this step: ")); p3.appendChild(document.createTextNode(s.why)); cardBody.appendChild(p3);
      if (s.note) L.note(cardBody, s.note);
      var tb = s.table || (s.tbl ? wtRows(s.tbl) : null);
      if (tb) { var tbox = el("div"); cardBody.appendChild(tbox); L.table(tbox, tb); }
      // buttons
      bBack.disabled = idx === 0;
      bNext.disabled = idx >= n - 1;
      // footer
      clr(foot);
      var anySrc = steps.some(function (x) { return (x.doIt + x.where + x.why).indexOf("[check source]") > -1; });
      if (anySrc) L.note(foot, SRCNOTE);
      L.note(foot, CHANGE);
      L.note(foot, PRACTICE);
      // live line
      var lt = "Step " + (idx + 1) + " of " + n + " (" + (plat === "mobile" ? "mobile app" : "web") + "). Path: " + plain.join(" > ") + ". Now: " + s.chip + ". " + s.doIt;
      out.textContent = lt;
    }
    function render2() { // inputs changed: redraw the card and live line only
      var keepIdx = idx;
      var active = document.activeElement;
      var c = cur(), s = c.steps[keepIdx];
      var tb = s && (s.table || (s.tbl ? wtRows(s.tbl) : null));
      if (tb) {
        // find the table box (last child that holds a table) and redraw it
        var kids = cardBody.childNodes, last = kids[kids.length - 1];
        if (last) { clr(last); L.table(last, tb); }
      }
      var cc = wtCalc();
      if (cc.ok) out.textContent = "Risk budget " + inr(cc.budget) + " and " + inr(cc.rps) + " at risk per share gives " + cc.shares + " shares. Planned loss " + cc.shares + " x " + inr(cc.rps) + " = " + inr(cc.loss) + ". The binding limit is " + cc.names.join(" and ") + ". A paper trade gives no real profit or loss. It does not prove your plan works.";
      else out.textContent = "The stop must be below the entry for a long trade, so no size can be worked out yet.";
      void active;
    }
    render();
    return { body: body };
  }

  // ---------------------------------------------------------------------
  // Small helper panels for older placeholders
  // ---------------------------------------------------------------------
  var PROD = {
    CNC: { name: "Longterm (CNC)", lines: [
      "CNC is for delivery. You can keep the shares as long as you like.",
      "There is no leverage and no auto square-off.",
      "You cannot short sell under CNC. You can sell shares you hold.",
      "If you buy and sell the same share on the same day under CNC, Zerodha treats it as intraday for charges."
    ] },
    MIS: { name: "Intraday (MIS)", lines: [
      "MIS is meant to be closed the same day. It uses margin, so you control more shares than your cash would buy. That is leverage.",
      "Open MIS positions are closed for you at the square-off time: about 3:25 PM for most equity" + CS + ". Zerodha charges Rs 50 plus 18% GST for each order it squares off" + CS + ".",
      "Leverage can be cut or removed during the day.",
      "This book explains MIS as theory only. It does not teach MIS practice."
    ] },
    NRML: { name: "Overnight (NRML)", lines: [
      "NRML is for futures and options positions that can be held until expiry.",
      "There is no intraday leverage.",
      "Theory only. No practice trades."
    ] }
  };
  function productPanel(host, sel) {
    var prod = PROD[sel] ? sel : "CNC", hold = "weeks";
    var b = L.box(host, "What each product means in Kite", "What to try: pick a product and read what it means. Say how long you plan to hold, and see whether the product fits.");
    var body = b.body;
    seg(body, "Product", [["CNC", "Longterm CNC"], ["MIS", "Intraday MIS"], ["NRML", "Overnight NRML"]], prod, function (v) { prod = v; render(); });
    L.select(body, { label: "How long do you plan to hold?", options: [["weeks", "About three weeks"], ["day", "Only today"]], value: hold, onChange: function (v) { hold = v; render(); } });
    var ul = el("ul"); body.appendChild(ul);
    var out = live(body);
    L.note(body, SRCNOTE);
    function render() {
      clr(ul);
      PROD[prod].lines.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      var t = PROD[prod].name + ". ";
      if (prod === "NRML") t += "This is for futures and options, which this book covers as theory only.";
      else if (hold === "weeks") t += prod === "CNC" ? "CNC fits a plan to hold for about three weeks." : "Your plan is to hold for weeks, but MIS is closed for you the same day. The product does not match the plan. Fix the product before you submit.";
      else t += prod === "MIS" ? "MIS fits a same-day plan. This book teaches MIS as theory only." : "Your plan is only for today, but CNC is for holding overnight or longer. Check that the product matches your plan.";
      out.textContent = t;
    }
    render();
  }

  var OT = {
    "Market": { fill: "Qty. only. No price.", when: "Now", get: "The best price available now", life: "Day", risk: "The price can be far from the price you last saw.", note: "Blocked for stock options. Some option contracts also block it." },
    "Limit": { fill: "Qty. and Price", when: "Now", get: "Your price or better", life: "Day, unless you pick another validity", risk: "It may never fill.", note: "A buy fills at your price or lower. A sell fills at your price or higher." },
    "SL": { fill: "Qty., Trigger price and Price", when: "When the price reaches the trigger", get: "Your limit price or better", life: "One trading day only", risk: "It may not fill if the price jumps past your limit.", note: "On a sell stop, Price is at or below the trigger." },
    "SL-M": { fill: "Qty. and Trigger price. No price.", when: "When the price reaches the trigger", get: "The best price available then", life: "One trading day only", risk: "The fill can be far from the trigger.", note: "Blocked for index options and for all BSE shares." }
  };
  function orderTypesPanel(host) {
    var type = "SL";
    var b = L.box(host, "The four order types in Kite", "What to try: pick an order type and read what you fill in, when it wakes up, how long it lasts and its main risk.");
    var body = b.body;
    seg(body, "Order type", [["Market", "Market"], ["Limit", "Limit"], ["SL", "SL"], ["SL-M", "SL-M"]], type, function (v) { type = v; render(); });
    var tbl = el("div"); body.appendChild(tbl);
    var out = live(body);
    function render() {
      var o = OT[type];
      kv(tbl, [["What you fill in", o.fill], ["When it wakes up", o.when], ["Price you may get", o.get], ["How long it lasts", o.life], ["Main risk", o.risk, true], ["Kite note", o.note]]);
      out.textContent = type + ": " + o.fill + " " + o.risk + " It lasts: " + o.life + ".";
    }
    render();
  }

  // =====================================================================
  // kite-illustration (kept name) and kite-flow
  // =====================================================================
  function parseOnly(p) {
    var s = S(p, "steps", "");
    if (!s) return null;
    var a = s.split(",").map(trim).filter(function (v) { return v; });
    return a.length ? a : null;
  }
  function pickNames(str) {
    var a = String(str || "").split(",").map(trim).filter(function (v) { return FLOWS[v]; });
    return a;
  }
  // Which flows each older view or screen now shows.
  var OLD_MAP = {
    "tour": ["find-your-way-around"],
    "watchlist-and-alerts": ["add-to-watchlist", "create-an-alert-and-ato"],
    "depth-panel": ["read-market-depth", "chart-basics"],
    "order-preview": ["place-a-limit-buy-cnc", "convert-position-and-mis-square-off"],
    "gtt-form-and-status": ["create-a-gtt"],
    "one-order-four-views": ["check-orders-trades-positions-holdings"],
    "order-types": ["place-a-stop-sl-order"],
    "order-steps": ["demo-walkthrough"]
  };

  D["kite-illustration"] = function (p, host) {
    var screenName = S(p, "screen", ""), view = S(p, "view", ""), steps = S(p, "steps", "");
    var key = steps ? "order-steps" : (OLD_MAP[screenName] ? screenName : (OLD_MAP[view] ? view : "tour"));
    var names = OLD_MAP[key].slice();
    var plat = S(p, "platform", "web") === "mobile" ? "mobile" : "web";
    var start = names[0];
    if (key === "order-preview" && S(p, "selected", "CNC").toUpperCase() === "MIS") start = "convert-position-and-mis-square-off";
    flowPlayer(host, names, { platform: plat, start: start, only: key === "order-steps" ? parseOnly(p) : null });
    if (key === "order-preview") productPanel(host, S(p, "selected", "CNC").toUpperCase());
    if (key === "order-types") orderTypesPanel(host);
  };

  D["kite-flow"] = function (p, host) {
    var names = pickNames(S(p, "flows", "") || S(p, "flow", ""));
    var plat = S(p, "platform", "web") === "mobile" ? "mobile" : "web";
    if (!names.length) names = FLOW_ORDER.slice();
    flowPlayer(host, names, { platform: plat, start: names[0], only: parseOnly(p) });
  };
  D["kite-flow"].flows = FLOW_ORDER;

  // =====================================================================
  // order-preview-check (spot the mistake in three recreated previews)
  // =====================================================================
  var OPC = [
    {
      plan: "A sell stop for 100 shares you hold, with a trigger at Rs 240.",
      rows: [["Side", "BUY"], ["Product", "as in plan"], ["Quantity", "100"], ["Trigger price", "Rs 240"], ["Validity", "Day"]],
      kind: "Stop order", wrong: "Side", hint: "A stop for a holding is a sell order.",
      fix: "Wrong side. The stop must be a sell stop. Correction: change the side to sell. Also remember that a stop-loss (SL) order lasts one trading day only. For a longer stop, use a GTT."
    },
    {
      plan: "Buy 25 shares at Rs 300.",
      rows: [["Side", "BUY"], ["Product", "as in plan"], ["Quantity", "250"], ["Price", "Rs 300"]],
      kind: "Limit order", wrong: "Quantity", hint: "Count the digits of the quantity against the plan.",
      fix: "Wrong quantity. The order is ten times the plan: 250 x 300 = Rs 75,000, not 25 x 300 = Rs 7,500. Correction: 25 shares."
    },
    {
      plan: "CNC, because you will hold for three weeks.",
      rows: [["Side", "as in plan"], ["Product", "MIS"], ["Quantity", "as in plan"], ["Price", "as in plan"]],
      kind: "Order", wrong: "Product", hint: "The product follows the holding period.",
      fix: "Wrong product. The holding is for three weeks, so the product is CNC. Correction: change the product to CNC. MIS is meant to be closed the same day. Zerodha closes open MIS positions at the square-off time (about 3:25 PM for most equity [check source]) and charges for it [check source]."
    }
  ];
  D["order-preview-check"] = function (p, host) {
    var b = kbox(host, "Spot the mistake: three order previews",
      "What to try: read the plan. Compare it with the recreated preview. Pick the one field that breaks the plan, then press Check.");
    var found = 0, solved = [];
    var out;
    OPC.forEach(function (o, idx) {
      var card = screen(b.body, "Order " + (idx + 1) + " of " + OPC.length);
      var pl = el("p", null, ""); pl.appendChild(el("strong", null, "Plan: ")); pl.appendChild(document.createTextNode(o.plan));
      card.appendChild(pl);
      var tk = el("div"); st(tk, "border:1px dashed rgba(127,127,127,.7);border-radius:6px;padding:6px 10px;margin:6px 0");
      var h = el("div", null, "Entered: " + o.kind + " "); st(h, "font-weight:700"); h.appendChild(el("span", "cft-tag cft-tag-o", "Recreated preview"));
      tk.appendChild(h);
      var tb = el("div"); tk.appendChild(tb);
      card.appendChild(tk);
      var pick = "";
      var sg = seg(card, "Which field is wrong?", o.rows.map(function (r) { return [r[0], r[0]]; }), "", function (v) { pick = v; if (!solved[idx]) { draw(); } });
      var fb = el("div"); card.appendChild(fb);
      var btnRow = el("div", "cft-btn-row"); card.appendChild(btnRow);
      var done = false, revealed = false;
      function draw() {
        clr(tb);
        var rows = o.rows.map(function (r) { return [r[0], r[1], (pick === r[0]) || (done && r[0] === o.wrong)]; });
        L.table(tb, rows);
      }
      L.button(btnRow, "Check", function () {
        clr(fb);
        if (!pick) { L.feedback(fb, false, "Pick a field first."); return; }
        if (done) return;
        if (pick === o.wrong) {
          done = true; if (!revealed) found++; solved[idx] = true;
          L.feedback(fb, true, o.fix);
          draw(); say();
        } else {
          L.feedback(fb, false, "Not that one. " + pick + " matches the plan. Compare each field with the plan again.");
        }
      });
      L.button(btnRow, "Hint", function () { clr(fb); L.note(fb, "Hint: " + o.hint); });
      L.button(btnRow, "Show the answer", function () {
        clr(fb); revealed = true; done = true; solved[idx] = true;
        L.feedback(fb, true, o.fix); draw(); say();
      });
      draw();
    });
    out = live(b.body);
    knote(b);
    function say() {
      out.textContent = "You found " + found + " of " + OPC.length + " errors yourself. Before you submit an order, check side, product, quantity and price against the written plan.";
    }
    say();
  };

  // =====================================================================
  // lab-journal (plan and execution, practice only)
  // =====================================================================
  var MODES = { paper: "paper", kite_demo: "Kite demo screens (look only, trade on paper)", forward: "forward", backtest: "backtest", learning: "learning note" };
  D["lab-journal"] = function (p, host) {
    var modeKey = S(p, "mode", "paper");
    if (!MODES[modeKey]) modeKey = "paper";
    var weekly = S(p, "weekly", modeKey === "kite_demo" ? "no" : "yes") === "yes";
    var v = { capital: 50000, risk: 1, entry: 250, stop: 240, target: 270, shares: modeKey === "kite_demo" ? 50 : 40, fill: modeKey === "kite_demo" ? 250 : 251, exit: 0, followed: true, tag: "none" };
    var wk = { trades: 10, followed: 9 };
    var locked = false;
    var b = L.box(host, "Practice journal: plan and execution",
      "What to try: fill in the plan, then press Lock the plan. Then fill in what happened. The tool compares the two. This is one hypothetical trade.");
    b.title.appendChild(el("span", "cft-tag cft-tag-o", "Mode: " + MODES[modeKey]));
    var body = b.body;
    L.note(body, "This is practice, nothing is saved. When you close or reload the page, the entry is gone. A practice entry is never marked live.");
    if (modeKey === "kite_demo") L.note(body, "In this mode you look at the screens in the Kite demo. The demo is view-only, so you write the trade here and on paper. No order is placed.");
    var s1 = screen(body, "1. Plan form (written before entry)");
    var planFields = [];
    var row1 = L.row(s1);
    function nf(parent, label, key, list, step) {
      var f = L.numberField(parent, { label: label, value: v[key], step: step || "any", onInput: function (x) { v[key] = x; render(); } });
      if (list) list.push(f.input);
      return f;
    }
    nf(row1, "Capital (Rs)", "capital", planFields);
    nf(row1, "Risk per trade (%)", "risk", planFields);
    nf(row1, "Planned entry (Rs)", "entry", planFields);
    nf(row1, "Planned stop (Rs)", "stop", planFields);
    nf(row1, "Planned target (Rs)", "target", planFields);
    nf(row1, "Planned shares", "shares", planFields, 1);
    var planTbl = el("div"); s1.appendChild(planTbl);
    var lockBtn = L.button(s1, "Lock the plan (practice)", function () {
      locked = true;
      planFields.forEach(function (i) { i.disabled = true; });
      execFields.forEach(function (i) { i.disabled = false; });
      lockBtn.disabled = true; lockBtn.textContent = "Plan locked";
      s2.style.opacity = "1"; render();
    });
    var s2 = screen(body, "2. Execution form (written after the trade)");
    s2.style.opacity = ".55";
    var execFields = [];
    var row2 = L.row(s2);
    nf(row2, "Fill price (Rs)", "fill", execFields);
    nf(row2, "Exit price (Rs, 0 = not exited yet)", "exit", execFields);
    L.toggle(s2, { label: "I followed my plan", value: v.followed, onChange: function (c) { v.followed = c; render(); } });
    L.select(s2, { label: "Rule break, if any", options: [["none", "None"], ["size", "Size"], ["exit late", "Exit late"], ["entry late", "Entry late"], ["stop moved", "Stop moved"], ["other", "Other"]], value: v.tag, onChange: function (x) { v.tag = x; render(); } });
    execFields.forEach(function (i) { i.disabled = true; });
    var execTbl = el("div"); s2.appendChild(execTbl);
    var wkOut = null;
    if (weekly) {
      var s3 = screen(body, "3. Weekly review");
      var row3 = L.row(s3);
      L.numberField(row3, { label: "Trades this week", value: wk.trades, step: 1, onInput: function (x) { wk.trades = Math.max(0, Math.round(x)); render(); } });
      L.numberField(row3, { label: "Trades that followed the plan", value: wk.followed, step: 1, onInput: function (x) { wk.followed = Math.max(0, Math.round(x)); render(); } });
      textField(s3, "One change for next week (not saved)", "", null);
      wkOut = el("div"); s3.appendChild(wkOut);
    }
    L.button(body, "Clear the practice entry", function () { host.innerHTML = ""; D["lab-journal"](p, host); });
    var out = live(body);
    L.note(body, "This is practice, nothing is saved. The tool names rule conflicts. It does not call a trade good or bad.");

    function render() {
      var budget = v.capital * v.risk / 100, rps = v.entry - v.stop;
      if (!(rps > 0) || !(v.capital > 0)) {
        kv(planTbl, [["Check", "For a long trade the stop must be below the entry."]]);
        kv(execTbl, []);
        out.textContent = "The stop must be below the entry for a long trade. Change the plan numbers.";
        return;
      }
      var loss = v.shares * rps, lossPct = loss / v.capital * 100, reward = v.shares * (v.target - v.entry);
      var R = (v.target - v.entry) / rps, allowed = Math.floor(budget / rps);
      var rows = [
        ["Risk budget", inr(budget)], ["Risk per share", inr(rps)],
        ["Planned loss (shares x risk per share)", inr(loss), true], ["Planned loss as % of capital", L.pct(lossPct, 2)],
        ["Planned reward", inr(reward)], ["Planned R (reward / risk)", String(+R.toFixed(2)), true],
        ["Shares the risk budget allows", String(allowed)]
      ];
      if (loss > budget + 1e-9) rows.push(["Rule conflict", "Planned loss is above the risk budget"]);
      kv(planTbl, rows);
      var slip = (v.fill - v.entry) * v.shares;
      var erows = [["Slippage ((fill - plan price) x shares)", inr(slip), true]];
      var res = null, Ra = null;
      if (v.exit > 0) { res = (v.exit - v.fill) * v.shares; Ra = (v.exit - v.fill) / rps; erows.push(["Result", inr(res)], ["R achieved (result / planned risk per share)", String(+Ra.toFixed(2))]); }
      erows.push(["Plan followed", v.followed ? "Yes" : "No"], ["Rule-break tag", v.tag]);
      if (!locked) erows = [["Status", "Lock the plan first, then fill in what happened."]];
      kv(execTbl, erows);
      if (wkOut) {
        var ad = wk.trades > 0 ? wk.followed / wk.trades * 100 : 0;
        kv(wkOut, [["Plan adherence (followed / trades x 100)", wk.trades > 0 ? wk.followed + " / " + wk.trades + " x 100 = " + L.pct(ad, 0) : "-", true]]);
      }
      var t = "Planned loss " + inr(loss) + ", which is " + L.pct(lossPct, 2) + " of " + inr(v.capital) + ". Planned R is " + +R.toFixed(2) + ".";
      if (locked) t += " Slippage " + inr(slip) + ".";
      if (locked && res !== null) t += " Result " + inr(res) + ", which is " + +Ra.toFixed(2) + " R.";
      if (loss > budget + 1e-9) t += " Rule conflict: the planned loss is above the risk budget of " + inr(budget) + ".";
      out.textContent = t;
    }
    render();
  };

  // =====================================================================
  // exercise-block (pre-trade checklist with a reject rule)
  // =====================================================================
  D["exercise-block"] = function (p, host) {
    var ITEMS = [
      "Is the entry price written in my plan?",
      "Is the stop price written in my plan, before entry?",
      "Is this setup one that my plan accepts?",
      "Is my number of shares worked out from my risk budget?",
      "Is today a day my no-trade rules allow me to trade?"
    ];
    var ans = [], evi = [], entry = 250, stop = 240, target = 270, minR = 1.5;
    var b = L.box(host, "Pre-trade checklist with a reject rule",
      "What to try: answer each item yes or no and write the evidence you used. An item with no evidence is not a yes. Then change the target and watch the reject rule.");
    var body = b.body;
    L.note(body, "Practice only. Nothing is saved. All numbers are hypothetical.");
    var s = screen(body, "Checklist");
    ITEMS.forEach(function (q, i) {
      var r = el("div"); st(r, "padding:6px 0;border-bottom:1px solid rgba(127,127,127,.3)");
      r.appendChild(el("div", null, (i + 1) + ". " + q));
      var name = uid(), line = el("div"); st(line, "display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:4px");
      ["yes", "no"].forEach(function (o) {
        var lb = el("label", "cft-toggle"); var inp = el("input"); inp.type = "radio"; inp.name = name; inp.value = o;
        inp.addEventListener("change", function () { ans[i] = o; render(); });
        lb.appendChild(inp); lb.appendChild(el("span", null, " " + (o === "yes" ? "Yes" : "No")));
        line.appendChild(lb);
      });
      var ev = el("input", "cft-num"); ev.type = "text"; ev.placeholder = "Evidence: what did you look at?";
      ev.setAttribute("aria-label", "Evidence for item " + (i + 1));
      st(ev, "flex:1;min-width:12em");
      ev.addEventListener("input", function () { evi[i] = ev.value; render(); });
      line.appendChild(ev);
      r.appendChild(line); s.appendChild(r);
    });
    var rItem = el("div"); st(rItem, "padding:6px 0");
    s.appendChild(rItem);
    var s2 = screen(body, "Reject rule: R at least the plan minimum");
    var row = L.row(s2);
    L.numberField(row, { label: "Entry (Rs)", value: entry, step: "any", onInput: function (x) { entry = x; render(); } });
    L.numberField(row, { label: "Stop (Rs)", value: stop, step: "any", onInput: function (x) { stop = x; render(); } });
    var tField = L.numberField(row, { label: "Target (Rs)", value: target, step: "any", onInput: function (x) { target = x; render(); } });
    L.numberField(row, { label: "Plan minimum R", value: minR, step: "any", onInput: function (x) { minR = x; render(); } });
    var br = el("div", "cft-btn-row"); s2.appendChild(br);
    [270, 260, 275].forEach(function (t) { L.button(br, "Target Rs " + t, function () { target = t; tField.set(t); render(); }); });
    s2.appendChild(el("p", "cft-note", "Reject rule: if R is below the plan minimum, or any item is not a yes with evidence, the setup is rejected. A reject is the plan working."));
    var out = live(body);

    function render() {
      var rps = entry - stop, R = rps > 0 ? (target - entry) / rps : NaN;
      var rOk = isFinite(R) && R >= minR;
      clr(rItem);
      var tt = el("div", null, "6. Is R at least my plan minimum of " + minR + "? "); tt.appendChild(el("strong", null, rOk ? "Yes" : "No"));
      rItem.appendChild(tt);
      rItem.appendChild(el("div", "cft-note", isFinite(R)
        ? "Evidence: R = (" + target + " - " + entry + ") / (" + entry + " - " + stop + ") = " + +R.toFixed(2) + ". Break-even win rate before costs = 1 / (1 + " + +R.toFixed(2) + ") = " + L.pct(100 / (1 + R), 1) + "."
        : "For a long trade the stop must be below the entry."));
      var stops = [];
      ITEMS.forEach(function (q, i) { if (!(ans[i] === "yes" && trim(evi[i] || "") !== "")) stops.push(i + 1); });
      if (!rOk) stops.push(6);
      var t;
      if (!stops.length) t = "All six items are yes with evidence, and R is " + +R.toFixed(2) + ", at least " + minR + ". The plan lets this setup go on. That says nothing about how the trade will end.";
      else t = "The checklist rejects this setup. Items not met: " + stops.join(", ") + ". A reject is the plan working. It is not a judgement of the share or the market.";
      out.textContent = t;
    }
    render();
  };

  // =====================================================================
  // gate-check (overrides the older one)
  // =====================================================================
  function pctCalc(label, passPct, total, ok) {
    return {
      fields: [{ k: "total", label: label[0], v: total }, { k: "ok", label: label[1], v: ok }],
      fn: function (x) {
        if (x.total <= 0) return { rows: [["Check", "Enter at least one question."]], text: "Enter the number of questions." };
        var pc = x.ok / x.total * 100, need = Math.ceil(passPct / 100 * x.total - 1e-9), met = pc >= passPct - 1e-9;
        return {
          rows: [["Score", x.ok + " / " + x.total + " = " + pc.toFixed(1) + "%"], ["Pass mark", passPct + "% (you need " + need + " correct)"], ["This part", met ? "Met" : "Not met", true]],
          text: x.ok + " of " + x.total + " is " + pc.toFixed(1) + "%. The pass mark is " + passPct + "%, so you need " + need + " correct. This part is " + (met ? "met." : "not met.")
        };
      }
    };
  }
  var GATES = {
    G1: {
      name: "Gate G1: market knowledge",
      items: [
        "I scored at least 85% correct on a full quiz set (a set has at least 30 questions).",
        "I wrote an answer in my own words for every prompt, and no text box is empty.",
        "I ticked every point in every prompt."
      ],
      notes: ["Both parts must be passed. A quiz pass alone is not enough."],
      calc: pctCalc(["Questions in the set", "Correct answers"], 85, 30, 26)
    },
    G2: {
      name: "Gate G2: money math",
      items: [
        "Every numeric question in a fresh set was correct. One miss fails the attempt.",
        "I answered the scenario and multiple-choice questions correctly.",
        "I finished The Rs 2,000-3,000 reality check and ticked its checklist."
      ],
      notes: ["Position-size answers must match exactly, in whole shares. Rupee answers must be within Rs 1 of the worked solution."],
      calc: {
        fields: [{ k: "sol", label: "Worked solution (Rs)", v: 20 }, { k: "mine", label: "Your answer (Rs)", v: 20 }],
        fn: function (x) {
          var d = Math.abs(x.sol - x.mine), ok = d <= 1 + 1e-9;
          return { rows: [["Difference", inr(r2(d), 2)], ["Within Rs 1?", ok ? "Yes" : "No", true]], text: "Your answer is " + inr(r2(d), 2) + " from the worked solution. A rupee answer must be within Rs 1, so this is " + (ok ? "within the limit." : "outside the limit.") };
        }
      }
    },
    G3: {
      name: "Gate G3: Kite readiness",
      items: [
        "Every item on the Kite screen-reading checklist is ticked. I looked at each screen myself.",
        "Every item has a reflection that I wrote. An empty reflection fails that item.",
        "I scored at least 90% correct on the execution quiz."
      ],
      notes: ["The checklist is self-attested. You tick it yourself. The book cannot check what you looked at."],
      calc: pctCalc(["Quiz questions drawn", "Correct answers"], 90, 10, 9)
    },
    G4: {
      name: "Gate G4: risk discipline",
      items: [
        "In every one of the 10 simulated days, I made no further entry after the daily limit was hit.",
        "In no day did I raise my size after a loss.",
        "I answered both multiple-choice questions on the rule set correctly."
      ],
      notes: ["This gate tests whether you follow a written limit. It is not a test of market skill."],
      calc: {
        fields: [{ k: "kept", label: "Simulated days where you kept the rules (out of 10)", v: 9 }],
        fn: function (x) {
          var k = Math.max(0, Math.min(10, Math.round(x.kept))), met = k === 10;
          return { rows: [["Days kept", k + " of 10 = " + (k * 10) + "%"], ["Needed", "10 of 10"], ["This part", met ? "Met" : "Not met", true]], text: k + " of 10 days is " + (k * 10) + "%. The gate needs 10 of 10. This part is " + (met ? "met." : "not met. The result would show the day that broke the rule.") };
        }
      }
    },
    G5: {
      name: "Gate G5: strategy validation",
      items: [
        "I saved a run with its record (data code, strategy settings, parameters, test program version, random setting).",
        "Costs were turned on in the run.",
        "I reported the in-sample period and the held-out period separately.",
        "My explanation covers the result and checks at least three biases, such as look-ahead, survivorship or overfitting.",
        "I gave the trial count: how many settings I tried.",
        "I gave at least three reasons the result may not hold live.",
        "I ticked every point in the rubric, with text written for it.",
        "I did not call the result \"profitable\" or \"ready\"."
      ],
      notes: ["A passing explanation is not a validation of a strategy. It still needs forward evidence, and it may still fail live."],
      calc: {
        fields: [{ k: "cap", label: "Made-up capital (Rs)", v: 50000 }, { k: "ins", label: "In-sample result (Rs)", v: 4000 }, { k: "out", label: "Held-out result (Rs)", v: -500 }],
        fn: function (x) {
          if (x.cap <= 0) return { rows: [["Check", "Capital must be above zero."]], text: "Enter a capital above zero." };
          var a = x.ins / x.cap * 100, o = x.out / x.cap * 100;
          return {
            rows: [["In-sample", inr(x.ins) + " = " + L.pct(a, 1) + " of capital"], ["Held-out", inr(x.out) + " = " + L.pct(o, 1) + " of capital"], ["Gap to explain", inr(x.ins - x.out), true]],
            text: "The held-out result is " + inr(x.ins - x.out) + " " + (x.ins - x.out >= 0 ? "lower" : "higher") + " than the in-sample result. Keep the two periods apart. That gap is the point to explain."
          };
        }
      }
    },
    G6: {
      name: "Gate G6: paper and forward record",
      items: [
        "My journal has at least 30 trades in mode forward or paper for the period.",
        "At least 90% of those trades followed my plan.",
        "The limit-breach log shows no breach for the same period."
      ],
      notes: ["Backtest rows and live rows are not counted. Forward-script rows and manual paper rows are counted on their own."],
      calc: {
        fields: [{ k: "n", label: "Trades in the record", v: 30 }, { k: "f", label: "Trades that followed the plan", v: 27 }, { k: "br", label: "Limit breaches", v: 0 }],
        fn: function (x) {
          var n = Math.max(0, Math.round(x.n)), f = Math.max(0, Math.min(n, Math.round(x.f))), ad = n ? f / n * 100 : 0;
          var c1 = n >= 30, c2 = ad >= 90 - 1e-9, c3 = x.br === 0;
          return {
            rows: [["Trade count", n + " (needs at least 30)", false], ["Plan adherence", f + " of " + n + " = " + ad.toFixed(1) + "%"], ["Count met", c1 ? "Met" : "Not met"], ["Adherence met", c2 ? "Met" : "Not met"], ["No breaches", c3 ? "Met" : "Not met"]],
            text: "Trade count " + n + ", plan adherence " + ad.toFixed(1) + "%, breaches " + x.br + ". " + ((c1 && c2 && c3) ? "All three checks are met." : "At least one check is not met.")
          };
        }
      }
    },
    G7: {
      name: "Gate G7: live-readiness review and one-page plan",
      items: [
        "Every field of the form is filled in: capital, risk per trade, daily, weekly and monthly loss limits, stop rules, most trades a day, withdrawal policy, and the amount that stays untouched.",
        "My risk per trade is at or below 2%.",
        "My capital figure is inside the range the book states for live money.",
        "Gates G1 to G6 are all passed."
      ],
      notes: ["The form checks the capital range in the app. This page only checks the risk line."],
      calc: {
        fields: [{ k: "cap", label: "Capital (Rs)", v: 50000 }, { k: "rk", label: "Risk per trade (%)", v: 1.5 }],
        fn: function (x) {
          var rs = x.cap * x.rk / 100, res;
          if (x.rk > 5) res = "Fails, with the hard note";
          else if (x.rk > 2) res = "Fails, with a note";
          else res = "Passes";
          return { rows: [["Rupees at risk on one trade", inr(r2(rs), 2)], ["2% of capital", inr(r2(x.cap * 0.02), 2)], ["5% of capital", inr(r2(x.cap * 0.05), 2)], ["Risk check", res, true]], text: x.rk + "% of " + inr(x.cap) + " is " + inr(r2(rs), 2) + " on one trade. The risk check " + res.toLowerCase() + "." };
        }
      }
    }
  };
  var GATE_MSG = "A gate checks what you learned. It is not permission to trade. Real money is a separate personal decision.";

  D["gate-check"] = function (p, host) {
    var key = S(p, "gate", "G1").toUpperCase();
    if (!GATES[key]) key = "G1";
    var G = GATES[key];
    var items = G.items.slice();
    if (key === "G3" && S(p, "statement", "") !== "") items.push("For one paper trade I stated the planned loss, the binding constraint, and the stop order type (SL, SL-M or GTT) with how long it lasts and how it behaves on a gap.");
    var b = L.box(host, G.name + ": self-check", "What to try: tick each item only when it is true for you. Use the number check to see how a pass mark works.");
    var body = b.body;
    var msg = el("p", null, GATE_MSG); st(msg, "font-weight:600"); body.appendChild(msg);
    var list = el("div", "cft-checklist");
    var boxes = [];
    items.forEach(function (t, i) {
      var lb = el("label"); var inp = el("input"); inp.type = "checkbox";
      inp.addEventListener("change", render);
      lb.appendChild(inp); lb.appendChild(el("span", null, " " + t));
      list.appendChild(lb); boxes.push(inp);
    });
    body.appendChild(list);
    var prog = el("div", "cft-progress"); var bar = el("span"); prog.appendChild(bar);
    prog.setAttribute("role", "progressbar"); prog.setAttribute("aria-valuemin", "0"); prog.setAttribute("aria-valuemax", String(items.length));
    body.appendChild(prog);
    G.notes.forEach(function (n) { L.note(body, n); });
    var out = live(body);
    // number check
    var cv = {}, cbox = null, ctext = null;
    if (G.calc) {
      var s = screen(body, "Number check (hypothetical)");
      var row = L.row(s);
      G.calc.fields.forEach(function (f) {
        cv[f.k] = f.v;
        L.numberField(row, { label: f.label, value: f.v, step: "any", onInput: function (x) { cv[f.k] = x; renderCalc(); } });
      });
      cbox = el("div"); s.appendChild(cbox);
      ctext = el("div", "cft-note"); s.appendChild(ctext);
    }
    function renderCalc() { var r = G.calc.fn(cv); kv(cbox, r.rows); ctext.textContent = r.text; }
    function render() {
      var n = boxes.filter(function (x) { return x.checked; }).length;
      bar.style.width = Math.round(n / items.length * 100) + "%";
      prog.setAttribute("aria-valuenow", String(n));
      var t = n + " of " + items.length + " criteria ticked. ";
      t += n === items.length
        ? "All ticked. This is your own self-check. Passing a gate shows you learned something. It does not show you will make money."
        : "Keep going when you are ready. There is no timer and no pressure.";
      out.textContent = t;
    }
    if (G.calc) renderCalc();
    render();
  };

  // =====================================================================
  // study-loop (how to use this book)
  // =====================================================================
  D["study-loop"] = function (p, host) {
    var NODES = [
      ["Read", "Read the idea and follow each step of the worked example."],
      ["Exercise", "Try the guided exercise, then the independent one. Try before you open the answer."],
      ["Quiz", "Take the quiz. Read why each wrong option is wrong."],
      ["Journal", "Write one learning note or do the paper task in your journal."]
    ];
    var cur = -1, mins = { read: 5, ex: 2, note: 13 }, session = 20;
    var b = L.box(host, "The study loop and a 20-minute session",
      "What to try: press Step to walk round the loop. Then use the sliders to plan one short session.");
    var body = b.body;
    var g = L.svg(body, 360, 112);
    var info = el("div", "cft-note"); st(info, "min-height:2.6em"); body.appendChild(info);
    var an = L.anim(body, {
      total: NODES.length, interval: 1400,
      step: function (i) { cur = i; draw(); },
      reset: function () { cur = -1; draw(); }
    });
    var s = screen(body, "Plan one session");
    L.select(s, { label: "Session length", options: [["10", "10 minutes"], ["15", "15 minutes"], ["20", "20 minutes"], ["30", "30 minutes"], ["45", "45 minutes"]], value: String(session), onChange: function (x) { session = +x; plan(); } });
    var fmt = function (v) { return v + " min"; };
    L.slider(s, { label: "Read a chapter", min: 1, max: 20, step: 1, value: mins.read, fmt: fmt, onInput: function (x) { mins.read = x; plan(); } });
    L.slider(s, { label: "Do one exercise", min: 0, max: 15, step: 1, value: mins.ex, fmt: fmt, onInput: function (x) { mins.ex = x; plan(); } });
    L.slider(s, { label: "Write a note and take the quiz", min: 1, max: 25, step: 1, value: mins.note, fmt: fmt, onInput: function (x) { mins.note = x; plan(); } });
    var bar = el("div"); st(bar, "display:flex;height:22px;border-radius:6px;overflow:hidden;background:rgba(127,127,127,.2);margin:8px 0");
    s.appendChild(bar);
    var out = live(body);
    L.note(body, "A gate is not part of a chapter. It is a separate check you take later. There is no deadline to start real trading.");

    function draw() {
      g.clear();
      g.svg.setAttribute("aria-label", "The study loop: read, exercise, quiz, journal. A gate comes later and is separate.");
      var w = 74, gapx = 20, x0 = 8;
      NODES.forEach(function (n, i) {
        var x = x0 + i * (w + gapx), on = i === cur;
        g.rect(x, 12, w, 38, "cft-ln", { fill: on ? "rgba(224,136,58,.3)" : "rgba(127,127,127,.1)", stroke: on ? ORANGE : "rgba(127,127,127,.6)", "stroke-width": on ? 2.5 : 1, rx: 6 });
        g.text(x + w / 2, 35, n[0], "cft-tx cft-tx-b", "middle");
        if (i < NODES.length - 1) { g.line(x + w, 31, x + w + gapx - 3, 31, "cft-ln"); g.text(x + w + gapx - 5, 34, ">", "cft-tx cft-tx-s", "end"); }
      });
      var lx = x0 + 3 * (w + gapx) + w / 2;
      g.line(lx, 50, lx, 70, "cft-ln-d");
      g.rect(lx - 62, 70, 124, 30, "cft-ln", { fill: "none", "stroke-dasharray": "4 3", stroke: "rgba(127,127,127,.7)", rx: 6 });
      g.text(lx, 89, "Gate, later and separate", "cft-tx cft-tx-s", "middle");
      g.text(8, 89, "One chapter is one trip round the loop.", "cft-tx cft-tx-s");
      info.textContent = cur >= 0 ? (NODES[cur][0] + ": " + NODES[cur][1]) : "Press Step or Play to walk round the loop.";
    }
    function plan() {
      var tot = mins.read + mins.ex + mins.note, base = Math.max(session, tot);
      clr(bar);
      [[mins.read, "var(--cft-blue)", "Read"], [mins.ex, "var(--cft-orange)", "Exercise"], [mins.note, "var(--cft-up)", "Note and quiz"]].forEach(function (x) {
        var seg1 = el("div", null, x[0] > 0 && x[0] / base > 0.12 ? x[2] : "");
        st(seg1, "width:" + (x[0] / base * 100) + "%;background:" + x[1] + ";color:#fff;font-size:.7em;display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap");
        seg1.setAttribute("title", x[2] + ": " + x[0] + " min");
        bar.appendChild(seg1);
      });
      var t = "Your session is " + session + " minutes: " + mins.read + " to read, " + mins.ex + " for the exercise and " + mins.note + " for the note and quiz. That is " + tot + " minutes. ";
      if (tot === session) t += "It fits your session exactly.";
      else if (tot < session) t += (session - tot) + " minutes are left. Use them to re-read the worked example.";
      else t += "That is " + (tot - session) + " minutes more than your session. Shorten one part, or split the chapter over two sessions.";
      out.textContent = t;
    }
    draw(); plan();
  };

  // =====================================================================
  // trading-plan: the one-page trading plan form (Gate G7)
  // Saves only on this device (localStorage key cft.plan.v1). Never sent anywhere.
  // =====================================================================
  var PLAN_KEY = "cft.plan.v1";
  var PLAN_END = "This plan is a personal record. It is not permission to trade and not a promise of any result.";
  var PLAN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var PLAN_NOTE_MID = "This is above the 2% level. Lower the risk per trade and check the figure again.";
  var PLAN_NOTE_HARD = "This is above 5%, the hard level. It is far above the 2% level. Even a short run of losses could take a large part of your capital. Lower the risk per trade and check the figure again.";
  var PLAN_FIELDS = [
    { k: "capital", t: "num", label: "Capital I plan to use (Rs)", pr: "Capital (Rs)", hint: "Your own figure. It should be money you could lose without hardship. The book does not pick a number for you." },
    { k: "riskPct", t: "num", label: "Risk per trade (% of my capital)", pr: "Risk per trade (% of capital)", hint: "The share of your capital you accept losing on one trade if the stop is hit." },
    { k: "daily", t: "num", label: "Daily loss limit (Rs)", pr: "Daily loss limit (Rs)", hint: "The most you allow yourself to lose in one day." },
    { k: "weekly", t: "num", label: "Weekly loss limit (Rs)", pr: "Weekly loss limit (Rs)", hint: "The most you allow yourself to lose in one week." },
    { k: "monthly", t: "num", label: "Monthly loss limit (Rs)", pr: "Monthly loss limit (Rs)", hint: "The most you allow yourself to lose in one month." },
    { k: "maxTrades", t: "num", label: "Most trades I will take in one day", pr: "Most trades in one day", hint: "A whole number, such as 2." },
    { k: "stopRules", t: "area", label: "My stop rules", pr: "Stop rules", ph: "Example: when the daily limit is reached, no more trades that day. When the weekly limit is reached, no more trades that week." },
    { k: "withdrawal", t: "area", label: "My withdrawal policy", pr: "Withdrawal policy", ph: "Example: reinvest profits first. Take money out only at a new high, never during a drawdown." },
    { k: "untouched", t: "num", label: "Amount that stays untouched (Rs)", pr: "Amount that stays untouched (Rs)", hint: "Money kept apart from trading. It is never topped into trading capital." },
    { k: "ifBreak", t: "area", label: "If I break a rule, I will", pr: "If I break a rule, I will", ph: "Example: stop for the day, write down what happened, and read my plan again before I trade." },
    { k: "whenStop", t: "area", label: "I stop trading altogether when", pr: "I stop trading altogether when", ph: "Example: I reach my monthly limit, or my account falls by the amount I wrote in advance. I restart only after a written review." }
  ];
  var PLAN_EXAMPLE = {
    capital: "50000", riskPct: "1", daily: "1000", weekly: "2000", monthly: "4000", maxTrades: "2",
    stopRules: "When the daily limit is reached, no more trades that day. When the weekly limit is reached, no more trades that week. No trade to win back a loss.",
    withdrawal: "Reinvest profits first. Take money out only when the account is at a new high and above the starting amount plus Rs 10,000. Never during a drawdown.",
    untouched: "350000",
    ifBreak: "Stop for the day. Write down which rule I broke and why. Read my plan again before the next trade.",
    whenStop: "My monthly limit is reached. I restart only after a written review and a waiting period I wrote in advance.",
    afford: true
  };

  function planEmpty() {
    var d = { afford: false };
    PLAN_FIELDS.forEach(function (f) { d[f.k] = ""; });
    return d;
  }
  function planCopy(d) {
    var o = planEmpty();
    PLAN_FIELDS.forEach(function (f) { o[f.k] = d && d[f.k] !== undefined && d[f.k] !== null ? String(d[f.k]) : ""; });
    o.afford = !!(d && d.afford);
    return o;
  }
  function planRead() {
    try {
      var raw = window.localStorage.getItem(PLAN_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o && o.v === 1 && o.history && o.history.length) return o;
    } catch (e) { /* storage blocked or text damaged: carry on without it */ }
    return null;
  }
  function planWrite(hist) {
    try { window.localStorage.setItem(PLAN_KEY, JSON.stringify({ v: 1, history: hist })); return true; } catch (e) { return false; }
  }
  function planRemove() {
    try { window.localStorage.removeItem(PLAN_KEY); return true; } catch (e) { return false; }
  }
  function planDateOnly(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.getDate() + " " + PLAN_MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function planDateTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    function z(n) { return (n < 10 ? "0" : "") + n; }
    return planDateOnly(iso) + ", " + z(d.getHours()) + ":" + z(d.getMinutes());
  }

  // Works out every check from the plan values. Pure function.
  function planEval(d) {
    function num(k) {
      var s = trim(d[k] || "");
      if (s === "") return NaN;
      var n = Number(s);
      return isFinite(n) ? n : NaN;
    }
    var cap = num("capital"), rk = num("riskPct"), dl = num("daily"), wk = num("weekly"), mo = num("monthly");
    var mt = num("maxTrades"), un = num("untouched");
    var missing = [];
    function need(ok, label) { if (!ok) missing.push(label); }
    need(cap > 0, "capital");
    need(rk > 0, "risk per trade");
    need(dl > 0, "daily limit");
    need(wk > 0, "weekly limit");
    need(mo > 0, "monthly limit");
    need(trim(d.stopRules || "") !== "", "stop rules");
    need(mt >= 1, "most trades in a day");
    need(trim(d.withdrawal || "") !== "", "withdrawal policy");
    need(un >= 0, "untouched amount");
    need(trim(d.ifBreak || "") !== "", "what I do if I break a rule");
    need(trim(d.whenStop || "") !== "", "when I stop altogether");
    var checks = [];
    // 1. all fields filled
    checks.push({
      name: "Every field is filled in",
      ok: missing.length === 0,
      text: missing.length === 0 ? "Every field has an entry." : "Still to fill in: " + missing.join(", ") + "."
    });
    // 2. risk per trade
    var rc;
    if (!(rk > 0)) rc = { ok: null, text: "Enter your risk per trade to see this check." };
    else if (rk <= 2 + 1e-9) rc = { ok: true, text: "Passes. " + +rk.toFixed(2) + "% is at or below the 2% level." };
    else if (rk <= 5 + 1e-9) rc = { ok: false, text: "Fails, with a note. " + +rk.toFixed(2) + "%. " + PLAN_NOTE_MID };
    else rc = { ok: false, text: "Fails, with the hard note. " + +rk.toFixed(2) + "%. " + PLAN_NOTE_HARD };
    checks.push({ name: "Risk per trade is at or below 2%", ok: rc.ok, text: rc.text });
    // 3. capital
    var cc;
    if (!(cap > 0)) cc = { ok: null, text: "Enter your capital to see this check." };
    else if (!d.afford) cc = { ok: false, text: "Tick the box only when it is true: this is money you could lose without hardship. If it is not true, lower the figure." };
    else cc = { ok: true, text: inr(cap) + " is filled in, and you say it is money you could lose without hardship. Only you can know this." };
    checks.push({ name: "Capital is money I could lose without hardship", ok: cc.ok, text: cc.text });
    // 4. limits in order
    var oc;
    if (!(dl > 0 && wk > 0 && mo > 0)) oc = { ok: null, text: "Enter all three limits to see this check." };
    else if (dl > wk + 1e-9) oc = { ok: false, text: "Your daily limit (" + inr(dl) + ") is above your weekly limit (" + inr(wk) + "). A longer period should allow at least as much as a shorter one." };
    else if (wk > mo + 1e-9) oc = { ok: false, text: "Your weekly limit (" + inr(wk) + ") is above your monthly limit (" + inr(mo) + "). A longer period should allow at least as much as a shorter one." };
    else oc = { ok: true, text: "Daily " + inr(dl) + " is at most weekly " + inr(wk) + ", which is at most monthly " + inr(mo) + "." };
    checks.push({ name: "Limits are in a sensible order", ok: oc.ok, text: oc.text });

    // numbers
    var rows = [], rupee = NaN, mult = NaN, losses = NaN, line;
    if (cap > 0 && rk > 0) rupee = cap * rk / 100;
    rows.push(["Planned risk on one trade", isFinite(rupee) ? inr(r2(rupee)) + " (" + +rk.toFixed(2) + "% of " + inr(cap) + ")" : "Enter capital and risk per trade"]);
    if (cap > 0) rows.push(["2% of your capital (pass line)", inr(r2(cap * 0.02))], ["5% of your capital (hard level)", inr(r2(cap * 0.05))]);
    var multText = "Enter risk per trade and the daily limit";
    if (isFinite(rupee) && dl > 0) {
      mult = dl / rupee;
      losses = Math.max(1, Math.ceil(mult - 1e-9));
      multText = +mult.toFixed(1) + " times that risk. " + (mult < 1 - 1e-9 ? "The limit is smaller than one full loss. " : "") + losses + " full-size " + (losses === 1 ? "loss reaches" : "losses reach") + " the daily limit.";
    }
    rows.push(["Daily limit compared with risk on one trade", multText]);
    if (cap > 0) {
      if (dl > 0) rows.push(["Daily limit as share of capital", L.pct(dl / cap * 100, 1)]);
      if (wk > 0) rows.push(["Weekly limit as share of capital", L.pct(wk / cap * 100, 1)]);
      if (mo > 0) rows.push(["Monthly limit as share of capital", L.pct(mo / cap * 100, 1)]);
    }
    var tradeNote = "";
    if (isFinite(rupee) && mt >= 1 && dl > 0 && mt * rupee > dl + 1e-9) {
      tradeNote = " If all " + Math.round(mt) + " trades lost their full planned risk, that is " + inr(r2(mt * rupee)) + ", which is more than your daily limit. The daily limit would stop you first.";
    }
    var met = checks.filter(function (c) { return c.ok === true; }).length;
    if (isFinite(rupee)) {
      line = "Planned risk on one trade: " + inr(r2(rupee)) + " (" + +rk.toFixed(2) + "% of " + inr(cap) + ")." +
        (isFinite(mult) ? " Your daily limit is " + +mult.toFixed(1) + " times that risk." : "") + " " + met + " of 4 form checks met. This form is a record, not permission to trade.";
    } else {
      line = "Fill in your capital and risk per trade to see the planned risk in rupees. " + met + " of 4 form checks met.";
    }
    return { checks: checks, rows: rows, met: met, line: line, tradeNote: tradeNote, missing: missing };
  }

  function planText(d, iso) {
    var ev = planEval(d), out = [];
    out.push("My one-page trading plan");
    out.push("Date: " + (planDateOnly(iso) || "not saved yet"));
    out.push("");
    PLAN_FIELDS.forEach(function (f) {
      var v = trim(d[f.k] || "");
      if (f.t === "num" && v !== "" && isFinite(Number(v)) && f.k !== "riskPct" && f.k !== "maxTrades") v = inr(Number(v));
      if (f.k === "riskPct" && v !== "") v = v + "%";
      out.push(f.pr + ": " + (v === "" ? "(not filled in)" : v));
      if (f.k === "capital") out.push("Money I could lose without hardship: " + (d.afford ? "yes, I say so" : "not ticked"));
    });
    out.push("");
    out.push("Checks");
    ev.checks.forEach(function (c) {
      out.push("- " + c.name + ": " + (c.ok === true ? "met" : c.ok === false ? "not met" : "waiting") + ". " + c.text);
    });
    ev.rows.forEach(function (r) { out.push("- " + r[0] + ": " + r[1]); });
    if (ev.tradeNote) out.push("-" + ev.tradeNote);
    out.push("");
    out.push(PLAN_END);
    return out.join("\n");
  }

  // The printed page. Built from the SAVED plan, then shown only when printing.
  function planSheet(d, iso) {
    var ev = planEval(d);
    var sheet = el("div", "cft-plan-sheet");
    sheet.appendChild(el("h1", null, "My one-page trading plan"));
    sheet.appendChild(el("p", "cft-plan-date", "Date: " + (planDateOnly(iso) || "")));
    var t = el("table", "cft-plan-tab");
    PLAN_FIELDS.forEach(function (f) {
      var v = trim(d[f.k] || "");
      if (f.t === "num" && v !== "" && isFinite(Number(v)) && f.k !== "riskPct" && f.k !== "maxTrades") v = inr(Number(v));
      if (f.k === "riskPct" && v !== "") v = v + "%";
      var tr = el("tr");
      tr.appendChild(el("th", null, f.pr));
      tr.appendChild(el("td", null, v === "" ? "(not filled in)" : v));
      t.appendChild(tr);
      if (f.k === "capital") {
        var tr2 = el("tr");
        tr2.appendChild(el("th", null, "Money I could lose without hardship"));
        tr2.appendChild(el("td", null, d.afford ? "Yes, I say so" : "Not ticked"));
        t.appendChild(tr2);
      }
    });
    sheet.appendChild(t);
    sheet.appendChild(el("h2", null, "Checks"));
    var ul = el("ul", "cft-plan-checks");
    ev.checks.forEach(function (c) {
      ul.appendChild(el("li", null, c.name + ": " + (c.ok === true ? "met" : c.ok === false ? "not met" : "waiting") + ". " + c.text));
    });
    ev.rows.forEach(function (r) { ul.appendChild(el("li", null, r[0] + ": " + r[1])); });
    if (ev.tradeNote) ul.appendChild(el("li", null, ev.tradeNote.replace(/^\s+/, "")));
    sheet.appendChild(ul);
    sheet.appendChild(el("p", "cft-plan-end", PLAN_END));
    return sheet;
  }

  var PLAN_CSS =
    ".cft-plan-sheet{display:none}" +
    ".cft-plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px 14px;margin-bottom:10px}" +
    ".cft-plan-grid .cft-field-hint{font-size:.8em;opacity:.75;margin-top:2px}" +
    ".cft-plan-grid textarea.cft-num{min-height:5.2em;resize:vertical;font:inherit}" +
    ".cft-plan-wide{grid-column:1/-1}" +
    ".cft-plan-hist{font-size:.9em;margin:6px 0}" +
    ".cft-plan-hist div{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:3px 0}" +
    ".cft-plan-copy{width:100%;box-sizing:border-box;min-height:9em;font:inherit;font-size:.85em;margin-top:6px}" +
    ".cft-plan-wait{border:1px solid rgba(127,127,127,.5);background:rgba(127,127,127,.12)}" +
    "@page{size:A4;margin:12mm}" +
    "@media print{" +
    "body.cft-plan-printing>*:not(.cft-plan-sheet){display:none!important}" +
    "body.cft-plan-printing{background:#fff!important;color:#000!important}" +
    "body.cft-plan-printing>.cft-plan-sheet{display:block;background:#fff;color:#000;font-family:Georgia,'Times New Roman',serif;font-size:11pt;line-height:1.28}" +
    ".cft-plan-sheet h1{font-size:22pt;margin:0 0 2pt}" +
    ".cft-plan-sheet h2{font-size:14pt;margin:8pt 0 3pt}" +
    ".cft-plan-sheet .cft-plan-date{font-size:12pt;margin:0 0 6pt}" +
    ".cft-plan-sheet table{width:100%;border-collapse:collapse}" +
    ".cft-plan-sheet th,.cft-plan-sheet td{border:1px solid #000;padding:2pt 5pt;vertical-align:top;text-align:left;white-space:pre-wrap}" +
    ".cft-plan-sheet th{width:38%;font-weight:700}" +
    ".cft-plan-sheet tr{page-break-inside:avoid}" +
    ".cft-plan-sheet ul{margin:0;padding-left:16pt}" +
    ".cft-plan-sheet li{margin:1pt 0}" +
    ".cft-plan-sheet .cft-plan-end{border:1.5px solid #000;padding:5pt 8pt;margin-top:8pt;font-weight:700}" +
    "}";

  function planStyle() {
    if (document.getElementById("cft-plan-style")) return;
    var s = document.createElement("style");
    s.id = "cft-plan-style";
    s.appendChild(document.createTextNode(PLAN_CSS));
    (document.head || document.documentElement).appendChild(s);
  }

  D["trading-plan"] = function (p, host) {
    planStyle();
    var b = L.box(host, "My one-page trading plan",
      "What to try: fill in each box with your own figures. Watch the checks change as you type. Press Save, then Print plan. Use made-up numbers while you practise.");
    var body = b.body;
    body.appendChild(el("p", "cft-note", "This is a personal record. It is not advice, not permission to trade and not a promise of any result."));

    var inputs = {};
    var grid = el("div", "cft-plan-grid");
    body.appendChild(grid);
    var uidn = uid();
    PLAN_FIELDS.forEach(function (f, i) {
      var w = el("label", "cft-field" + (f.t === "area" ? " cft-plan-wide" : ""));
      w.appendChild(el("span", "cft-field-label", f.label));
      var inp;
      if (f.t === "area") {
        inp = el("textarea", "cft-num");
        inp.rows = 3;
        if (f.ph) inp.setAttribute("placeholder", f.ph);
      } else {
        inp = el("input", "cft-num");
        inp.type = "number";
        inp.step = "any";
        inp.min = "0";
        inp.setAttribute("inputmode", "decimal");
      }
      inp.id = uidn + "-" + f.k;
      inp.addEventListener("input", onEdit);
      w.appendChild(inp);
      if (f.hint) w.appendChild(el("span", "cft-field-hint", f.hint));
      grid.appendChild(w);
      inputs[f.k] = inp;
      if (f.k === "capital") {
        var tw = el("label", "cft-toggle cft-plan-wide");
        var cb = el("input"); cb.type = "checkbox";
        cb.addEventListener("change", onEdit);
        tw.appendChild(cb);
        tw.appendChild(el("span", null, " This is money I could lose without hardship. I will tick this only when it is true."));
        grid.appendChild(tw);
        inputs.afford = cb;
      }
    });

    var btns = el("div", "cft-btn-row");
    body.appendChild(btns);
    var status = el("div", "cft-note");
    status.setAttribute("aria-live", "polite");
    var histBox = el("div", "cft-plan-hist");
    var copyBox = el("div");
    var checkBox = el("div");
    var numBox = el("div");
    var tradeEl = el("p", "cft-note");
    var out = live(body);   // moved to the bottom below

    var hist = [];
    var storageOk = true, dirty = false, clearArmed = false;
    var printSheet = null;

    function readForm() {
      var d = planEmpty();
      PLAN_FIELDS.forEach(function (f) { d[f.k] = inputs[f.k].value; });
      d.afford = !!inputs.afford.checked;
      return d;
    }
    function fillForm(d) {
      var c = planCopy(d);
      PLAN_FIELDS.forEach(function (f) { inputs[f.k].value = c[f.k]; });
      inputs.afford.checked = c.afford;
    }
    function lastSaved() { return hist.length ? hist[hist.length - 1] : null; }
    function setStatus() {
      var ls = lastSaved();
      var t;
      if (!ls) t = "Not saved yet. Press Save to keep this plan on this device.";
      else {
        t = (dirty ? "You have changes that are not saved. Last saved " : "Saved ") + planDateTime(ls.at) + ". ";
        t += storageOk ? "Saved on this device only. It is not sent anywhere." : "This device is blocking storage, so the plan could not be kept after you close this page. Use Print plan or Copy as text to keep it.";
      }
      status.textContent = t;
    }
    function renderHist() {
      clr(histBox);
      if (hist.length < 2) return;
      histBox.appendChild(el("div", "cft-note", "Older saved versions on this device (newest first):"));
      for (var i = hist.length - 2; i >= 0 && i >= hist.length - 6; i--) {
        (function (h) {
          var row = el("div");
          var cap = trim(h.data.capital || "");
          row.appendChild(el("span", null, planDateTime(h.at) + (cap !== "" && isFinite(Number(cap)) ? ", capital " + inr(Number(cap)) : "") + (trim(h.data.riskPct || "") !== "" ? ", risk " + h.data.riskPct + "%" : "")));
          L.button(row, "Load this version", function () { fillForm(h.data); dirty = true; update(); }, "");
          histBox.appendChild(row);
        })(hist[i]);
      }
    }
    function update() {
      var ev = planEval(readForm());
      clr(checkBox);
      ev.checks.forEach(function (c) {
        var f = el("div", "cft-feedback " + (c.ok === true ? "cft-ok" : c.ok === false ? "cft-bad" : "cft-plan-wait"));
        f.appendChild(el("strong", null, (c.ok === true ? "Met: " : c.ok === false ? "Not met: " : "Waiting: ") + c.name + ". "));
        f.appendChild(document.createTextNode(c.text));
        checkBox.appendChild(f);
      });
      clr(numBox);
      L.table(numBox, ev.rows);
      tradeEl.textContent = ev.tradeNote ? ev.tradeNote.replace(/^\s+/, "") : "";
      out.textContent = ev.line;
      setStatus();
      renderHist();
    }
    function onEdit() {
      dirty = true;
      clearArmed = false; bClear.textContent = "Clear";
      clr(copyBox);
      update();
    }
    function save() {
      hist.push({ at: new Date().toISOString(), data: readForm() });
      if (hist.length > 10) hist = hist.slice(hist.length - 10);
      storageOk = planWrite(hist);
      dirty = false;
      update();
    }
    function printPlan() {
      if (dirty || !lastSaved()) save();
      var ls = lastSaved();
      if (printSheet && printSheet.parentNode) printSheet.parentNode.removeChild(printSheet);
      printSheet = planSheet(ls.data, ls.at);
      document.body.appendChild(printSheet);
      document.body.classList.add("cft-plan-printing");
      var done = false;
      function cleanup() {
        if (done) return;
        done = true;
        window.removeEventListener("afterprint", cleanup);
        document.body.classList.remove("cft-plan-printing");
        if (printSheet && printSheet.parentNode) printSheet.parentNode.removeChild(printSheet);
        printSheet = null;
      }
      window.addEventListener("afterprint", cleanup);
      try { window.print(); } catch (e) { cleanup(); }
    }
    function copyText() {
      var ls = lastSaved();
      var txt = planText(readForm(), ls ? ls.at : "");
      clr(copyBox);
      var ta = el("textarea", "cft-num cft-plan-copy");
      ta.readOnly = true;
      ta.value = txt;
      ta.setAttribute("aria-label", "Your plan as plain text");
      copyBox.appendChild(ta);
      var msg = el("p", "cft-note", "");
      copyBox.appendChild(msg);
      var ok = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () { msg.textContent = "Copied. You can paste it into a note or a message to yourself."; },
            function () { msg.textContent = "Could not copy by itself. Select the text above and copy it."; });
          msg.textContent = "Copying...";
          ok = true;
        }
      } catch (e) { ok = false; }
      if (!ok) {
        try { ta.focus(); ta.select(); ok = document.execCommand && document.execCommand("copy"); } catch (e2) { ok = false; }
        msg.textContent = ok ? "Copied. You can paste it into a note or a message to yourself." : "Select the text above and copy it.";
      }
    }
    function clearAll() {
      if (!clearArmed) {
        clearArmed = true;
        bClear.textContent = "Press again to clear the form and delete saved versions";
        return;
      }
      clearArmed = false;
      bClear.textContent = "Clear";
      fillForm(planEmpty());
      hist = [];
      storageOk = planRemove();
      dirty = false;
      clr(copyBox);
      update();
    }

    L.button(btns, "Save", save, "");
    var bPrint = L.button(btns, "Print plan", printPlan, "");
    L.button(btns, "Copy as text", copyText, "");
    var bClear = L.button(btns, "Clear", clearAll, "");
    L.button(btns, "Fill with a made-up example", function () { fillForm(PLAN_EXAMPLE); onEdit(); }, "");
    bPrint.setAttribute("title", "Saves your plan first, then prints only the saved one-page plan");
    body.appendChild(status);
    body.appendChild(copyBox);
    body.appendChild(histBox);
    body.appendChild(el("div", "cft-box-title", "Live checks"));
    body.appendChild(checkBox);
    body.appendChild(el("div", "cft-box-title", "Numbers from your plan"));
    body.appendChild(numBox);
    body.appendChild(tradeEl);
    body.appendChild(out);
    L.note(body, "Your plan is kept in this browser only. It is not sent anywhere. Print plan saves first, then prints the saved plan on one A4 page. Passing these checks does not mean you should trade. Gates G1 to G6 must also be passed, and this form cannot check that.");

    var stored = planRead();
    if (stored) {
      hist = stored.history.filter(function (h) { return h && h.data && h.at; }).map(function (h) { return { at: String(h.at), data: planCopy(h.data) }; });
      if (hist.length > 10) hist = hist.slice(hist.length - 10);
      if (hist.length) fillForm(lastSaved().data);
    }
    update();
  };
})();
