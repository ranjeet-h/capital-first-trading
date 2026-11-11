(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  // Demos for the advanced F&O chapters (theory only) and the market foundations chapters.
  // All numbers are made up. Nothing here places an order or gives advice.

  var THEORY = "Theory only. No practice trades.";
  var DAYN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  function clr(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function live(body) {
    var n = L.el("p", "cft-note");
    n.setAttribute("aria-live", "polite");
    n.style.fontWeight = "600";
    body.appendChild(n);
    return n;
  }
  function theory(body) {
    var d = L.el("div");
    d.appendChild(L.el("span", "cft-tag cft-tag-o", THEORY));
    body.appendChild(d);
  }
  function spct(n, d) {
    d = d === undefined ? 1 : d;
    var v = +n.toFixed(d);
    return (v > 0 ? "+" : v < 0 ? "-" : "") + Math.abs(v).toFixed(d) + "%";
  }
  function plainPct(n, d) { return parseFloat(n.toFixed(d === undefined ? 4 : d)) + "%"; }
  function gl(n) { return n >= 0 ? "gain of " + L.inr(n) : "loss of " + L.inr(-n); }
  function checkTag(text) { return L.el("span", "cft-verify", "check: " + text); }

  // A row of day buttons. Click a weekday to switch a made-up holiday on or off.
  // Returns {cells, paint(k, tag, mode)}. mode: "", "now", "skip", "target".
  function strip(parent, n, startIdx, hol, onToggle, canToggle) {
    var wrap = L.el("div");
    wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin:8px 0";
    var cells = [];
    function isWeekend(k) { return ((startIdx() + k) % 7) >= 5; }
    function mk(k) {
      var b = L.el("button", "cft-btn");
      b.type = "button";
      b.style.cssText = "min-width:64px;min-height:48px;padding:4px 6px;font-size:.8em;line-height:1.25;background:transparent;color:inherit;border:1px solid var(--cft-grey);border-radius:8px;";
      var l1 = L.el("div"), l2 = L.el("div");
      l1.style.fontWeight = "700";
      b.appendChild(l1); b.appendChild(l2);
      b.addEventListener("click", function () {
        if (isWeekend(k) || (canToggle && !canToggle(k))) return;
        hol[k] = !hol[k];
        onToggle();
      });
      wrap.appendChild(b);
      cells.push({ b: b, l1: l1, l2: l2 });
    }
    for (var i = 0; i < n; i++) mk(i);
    parent.appendChild(wrap);
    return {
      wrap: wrap, cells: cells,
      refreshNames: function () {
        cells.forEach(function (c, k) { c.l1.textContent = DAYN[(startIdx() + k) % 7].slice(0, 3); });
      },
      paint: function (k, tag, mode) {
        var c = cells[k];
        var wk = isWeekend(k);
        c.l2.textContent = tag || (hol[k] ? "Holiday" : wk ? "Weekend" : "");
        c.b.style.opacity = (mode === "skip" || (wk && mode !== "target")) ? ".55" : "1";
        c.b.style.borderStyle = hol[k] ? "dashed" : "solid";
        c.b.style.borderWidth = mode === "now" ? "2px" : "1px";
        c.b.style.borderColor = mode === "now" ? "var(--cft-orange)" : "var(--cft-grey)";
        c.b.style.background = mode === "target" ? "var(--cft-up)" : "transparent";
        c.b.style.color = mode === "target" ? "#fff" : "inherit";
        c.b.setAttribute("aria-label", DAYN[(startIdx() + k) % 7] + (hol[k] ? ", made-up holiday" : wk ? ", weekend" : "") + (tag ? ", " + tag : ""));
      },
    };
  }

  // ---------------------------------------------------------------- 09-01 futures
  D["futures-payoff"] = function (p, host) {
    var b = L.box(host, "Futures: the same price move on cash and on a futures contract",
      "What to try: slide the price move to -2%, then change the margin percent. See how big the move is against your own deposit.");
    var body = b.body;
    theory(body);
    var st = {
      contract: L.P(p, "contract", 1000000),
      mpct: L.clamp(L.P(p, "marginPct", 10), 2, 50),
      mv: L.clamp(L.P(p, "move", -2), -10, 10),
    };
    var row = L.row(body);
    var fC = L.numberField(row, { label: "Contract value (Rs). Lot size x price.", value: st.contract, step: 10000, onInput: function (v) { st.contract = v; update(); } });
    var sM = L.slider(body, { label: "Margin (your deposit) as a share of the contract", min: 2, max: 50, step: 1, value: st.mpct, fmt: function (v) { return v + "% (dummy rate)"; }, onInput: function (v) { st.mpct = v; update(); } });
    var sP = L.slider(body, { label: "Price move against (-) or for (+) you", min: -10, max: 10, step: 0.5, value: st.mv, fmt: function (v) { return spct(v, 1); }, onInput: function (v) { st.mv = v; update(); } });
    var g = L.svg(body, 340, 150, "");
    g.svg.setAttribute("aria-label", "Bars comparing the gain or loss as a share of your money, for cash and for futures");
    var tbl = L.el("div");
    body.appendChild(tbl);
    var out = live(body);

    function update() {
      var contract = Math.max(1, st.contract);
      var margin = contract * st.mpct / 100;
      var fut = contract * st.mv / 100;
      var cash = margin * st.mv / 100;
      var futPct = st.mv * 100 / st.mpct;
      var cashPct = st.mv;
      var lev = 100 / st.mpct;

      g.clear();
      var maxAbs = Math.max(25, Math.abs(futPct), Math.abs(cashPct), 100) * 1.05;
      var sx = L.scale(-maxAbs, maxAbs, 70, 300);
      var zero = sx(0);
      g.line(zero, 10, zero, 110, "cft-ln");
      g.text(zero, 124, "0%", "cft-tx cft-tx-s", "middle");
      var xl = sx(-100);
      g.line(xl, 10, xl, 110, "cft-ln-hi");
      g.text(xl, 138, "All of your deposit", "cft-tx cft-tx-s", "middle");
      [["Cash", cashPct, 22, "cft-rc"], ["Futures", futPct, 66, "cft-rc"]].forEach(function (r) {
        var x1 = zero, x2 = sx(r[1]);
        g.rect(Math.min(x1, x2), r[2], Math.abs(x2 - x1), 26, r[1] >= 0 ? "cft-rc-up" : "cft-rc-down");
        g.text(4, r[2] + 17, r[0], "cft-tx cft-tx-b");
        var lbl = spct(r[1], 1);
        g.text(r[1] >= 0 ? x2 + 4 : x2 - 4, r[2] + 17, lbl, "cft-tx", r[1] >= 0 ? "start" : "end");
      });

      clr(tbl);
      L.table(tbl, [
        ["Money you put in (cash, or margin)", L.inr(margin)],
        ["Value you control with futures (leverage " + lev.toFixed(1).replace(/\.0$/, "") + "x)", L.inr(contract)],
        ["Futures: rupee " + (fut >= 0 ? "gain" : "loss"), L.inr(fut), true],
        ["Futures: as a share of your deposit", spct(futPct, 1)],
        ["Same move on cash of " + L.inr(margin) + ": rupees", L.inr(cash)],
        ["Cash: as a share of your money", spct(cashPct, 1)],
      ]);

      var dir = st.mv < 0 ? "fall" : "rise";
      var t = st.mv === 0 ? "No price move, so no gain and no loss." : "A " + Math.abs(st.mv) + "% price " + dir + " is a " + gl(fut) + " on the contract. That is " + Math.abs(futPct).toFixed(1) + "% of your " + L.inr(margin) + " deposit. On " + L.inr(margin) + " of cash, the same " + dir + " is a " + gl(cash) + ", or " + Math.abs(cashPct).toFixed(1) + "% of the cash.";
      if (fut < -margin) t += " This loss is bigger than the whole deposit. You would have to pay in more money.";
      else t += " Losses can also pass the deposit if the price moves far enough.";
      out.textContent = t;
    }
    update();
  };

  // ---------------------------------------------------------------- 09-02 options
  D["option-payoff"] = function (p, host) {
    var b = L.box(host, "Option at expiry: profit or loss per share",
      "What to try: pick call or put, buyer or seller, then slide the price at expiry. Find the break-even price.");
    var body = b.body;
    theory(body);
    var st = {
      type: L.S(p, "type", "call") === "put" ? "put" : "call",
      side: L.S(p, "side", "buy") === "sell" ? "sell" : "buy",
      K: Math.max(1, L.P(p, "strike", 500)),
      prem: Math.max(0, L.P(p, "premium", 20)),
      S: L.P(p, "price", 530),
    };
    var row = L.row(body);
    L.select(row, { label: "Option type", options: [["call", "Call (right to buy)"], ["put", "Put (right to sell)"]], value: st.type, onChange: function (v) { st.type = v; update(); } });
    L.select(row, { label: "You are the", options: [["buy", "Buyer (you pay the premium)"], ["sell", "Seller (you get the premium)"]], value: st.side, onChange: function (v) { st.side = v; update(); } });
    var row2 = L.row(body);
    L.numberField(row2, { label: "Strike price (Rs)", value: st.K, onInput: function (v) { st.K = Math.max(1, v); update(); } });
    L.numberField(row2, { label: "Premium per share (Rs)", value: st.prem, onInput: function (v) { st.prem = Math.max(0, v); update(); } });
    var sl = L.slider(body, { label: "Share price at expiry", min: Math.round(st.K * 0.8), max: Math.round(st.K * 1.2), step: 1, value: st.S, fmt: function (v) { return L.inr(v); }, onInput: function (v) { st.S = v; update(); } });
    var g = L.svg(body, 340, 210, "");
    var out = live(body);

    function intr(S) { return st.type === "call" ? Math.max(0, S - st.K) : Math.max(0, st.K - S); }
    function pay(S) { var buyer = intr(S) - st.prem; return st.side === "buy" ? buyer : -buyer; }

    function update() {
      var lo = Math.round(st.K * 0.8), hi = Math.round(st.K * 1.2);
      sl.input.min = lo; sl.input.max = hi;
      st.S = L.clamp(st.S, lo, hi);
      sl.set(st.S);
      var be = st.type === "call" ? st.K + st.prem : st.K - st.prem;
      g.svg.setAttribute("aria-label", "Payoff line for a " + st.type + " " + (st.side === "buy" ? "buyer" : "seller") + ", strike " + st.K + ", premium " + st.prem + ", break-even " + be);
      g.clear();
      var ext = L.extent([pay(lo), pay(hi), 0, st.prem, -st.prem], 0.15);
      var sx = L.scale(lo, hi, 44, 330), sy = L.scale(ext[0], ext[1], 176, 14);
      g.line(44, sy(0), 330, sy(0), "cft-ln");
      g.text(40, sy(0) + 3, "0", "cft-tx cft-tx-s", "end");
      g.line(sx(st.K), 14, sx(st.K), 176, "cft-ln-d");
      g.text(sx(st.K), 190, "Strike " + L.inr(st.K), "cft-tx cft-tx-s", "middle");
      if (be >= lo && be <= hi) {
        g.line(sx(be), 14, sx(be), 176, "cft-ln-hi");
        g.text(sx(be), 204, "Break-even " + L.inr(be), "cft-tx cft-tx-s", "middle");
      }
      g.text(44, 190, L.inr(lo), "cft-tx cft-tx-s", "start");
      g.text(330, 190, L.inr(hi), "cft-tx cft-tx-s", "end");
      var steps = 90, x0 = lo;
      for (var i = 0; i < steps; i++) {
        var a = lo + (hi - lo) * i / steps, c = lo + (hi - lo) * (i + 1) / steps;
        var mid = pay((a + c) / 2);
        g.line(sx(a), sy(pay(a)), sx(c), sy(pay(c)), mid >= 0 ? "cft-pl-g" : "cft-pl-r");
      }
      var pv = pay(st.S);
      g.circle(sx(st.S), sy(pv), 5, "cft-dot");
      g.text(8, 14, "Profit", "cft-tx cft-tx-s");
      g.text(8, 176, "Loss", "cft-tx cft-tx-s");

      var who = st.side === "buy" ? "buyer" : "seller";
      var t = "At " + L.inr(st.S) + " the " + who + "'s " + (pv >= 0 ? "profit" : "loss") + " is " + L.inr(Math.abs(pv)) + " per share (strike " + L.inr(st.K) + ", premium " + L.inr(st.prem) + "). Break-even is " + L.inr(be) + ".";
      if (st.side === "buy") t += " The most a buyer can lose is the premium, " + L.inr(st.prem) + " per share. Costs are left out.";
      else t += " The most a seller can gain is the premium, " + L.inr(st.prem) + " per share. The seller's loss can grow far bigger. Costs are left out.";
      out.textContent = t;
    }
    update();
  };

  D["option-time-value"] = function (p, host) {
    var b = L.box(host, "Time value fades as expiry gets closer",
      "What to try: press Play and watch the orange part (time value) shrink day by day. Then move the share price and try delta and theta.");
    var body = b.body;
    theory(body);
    var K = Math.max(1, L.P(p, "strike", 500)), tv0 = Math.max(1, L.P(p, "premium", 20));
    var D0 = 30, S = L.P(p, "price", 500), days = D0;
    function tv(d, price) {
      var z = (price - K) / (0.04 * K);
      return tv0 * Math.sqrt(Math.max(0, d) / D0) / (1 + z * z);
    }
    var sP = L.slider(body, { label: "Share price today", min: Math.round(K * 0.9), max: Math.round(K * 1.1), step: 1, value: S, fmt: L.inr, onInput: function (v) { S = v; draw(); } });
    var sD = L.slider(body, { label: "Days left to expiry", min: 0, max: D0, step: 1, value: days, fmt: function (v) { return v + " days"; }, onInput: function (v) { days = v; an.setIndex(D0 - v); draw(); } });
    var an = L.anim(body, {
      interval: 250, total: D0,
      step: function (i) { days = D0 - i - 1; sD.set(days); draw(); },
      reset: function () { days = D0; sD.set(days); draw(); },
    });
    var g = L.svg(body, 340, 200, "");
    g.svg.setAttribute("aria-label", "A bar showing premium split into intrinsic value and time value, and a line showing time value falling as days pass");
    var out = live(body);
    L.note(body, "The time-value shape here is made up to show the idea. Real option prices follow other things too.");

    function draw() {
      var intr = Math.max(0, S - K);
      var t = tv(days, S), prem = intr + t;
      var maxPrem = Math.max(1, Math.max(intr, 0) + tv0, prem);
      g.clear();
      var sx = L.scale(0, maxPrem, 10, 330);
      g.text(10, 14, "Premium today = intrinsic value + time value", "cft-tx cft-tx-b");
      g.rect(10, 22, sx(intr) - 10, 24, "cft-rc");
      g.rect(sx(intr), 22, sx(prem) - sx(intr), 24, "cft-dot");
      g.text(10, 60, "Intrinsic " + L.inr(intr, 1) + " (blue)", "cft-tx cft-tx-s");
      g.text(330, 60, "Time value " + L.inr(t, 1) + " (orange)", "cft-tx cft-tx-s", "end");
      // line of time value against days left
      var lx = L.scale(D0, 0, 40, 320), ly = L.scale(0, tv0, 170, 84);
      g.line(40, 170, 320, 170, "cft-ln");
      g.line(40, 84, 40, 170, "cft-ln");
      g.text(36, 88, L.inr(tv0), "cft-tx cft-tx-s", "end");
      g.text(36, 170, "0", "cft-tx cft-tx-s", "end");
      g.text(40, 186, "30 days left", "cft-tx cft-tx-s", "start");
      g.text(320, 186, "Expiry", "cft-tx cft-tx-s", "end");
      var pts = [];
      for (var d = D0; d >= 0; d--) pts.push([lx(d), ly(tv(d, S))]);
      g.path(pts, "cft-pl-d");
      var shown = [];
      for (var e = D0; e >= days; e--) shown.push([lx(e), ly(tv(e, S))]);
      g.path(shown, "cft-pl-o");
      g.circle(lx(days), ly(t), 5, "cft-dot");
      g.text(180, 80, "Time value over the days left", "cft-tx cft-tx-s", "middle");
      out.textContent = days + " days left. Premium " + L.inr(prem, 1) + " = intrinsic " + L.inr(intr, 1) + " + time value " + L.inr(t, 1) + "." + (days === 0 ? " At expiry only the intrinsic value is left." : "");
    }
    draw();

    // Delta and theta in words and sliders (theory)
    var gb = L.el("div", "cft-screen");
    body.appendChild(gb);
    gb.appendChild(L.el("div", "cft-box-title", "Delta and theta, as theory"));
    var dl = 0.5, mv = 10, th = 0.7, dp = 5;
    L.slider(gb, { label: "Delta: how closely the premium follows the share", min: 0.05, max: 1, step: 0.05, value: dl, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { dl = v; g2(); } });
    L.slider(gb, { label: "Share moves by (Rs)", min: -30, max: 30, step: 1, value: mv, fmt: L.inr, onInput: function (v) { mv = v; g2(); } });
    var o1 = live(gb);
    L.slider(gb, { label: "Theta: premium lost each day, other things equal (Rs per share)", min: 0, max: 3, step: 0.1, value: th, fmt: function (v) { return L.inr(v, 1); }, onInput: function (v) { th = v; g2(); } });
    L.slider(gb, { label: "Days that pass", min: 1, max: 30, step: 1, value: dp, fmt: function (v) { return v + " days"; }, onInput: function (v) { dp = v; g2(); } });
    var o2 = live(gb);
    function g2() {
      o1.textContent = "With delta " + dl.toFixed(2) + ", if the share moves " + L.inr(mv) + ", the premium moves about " + L.inr(dl * mv, 2) + ".";
      o2.textContent = "With theta of " + L.inr(th, 1) + " a day, " + dp + " days cost about " + L.inr(th * dp, 2) + " per share of premium, if nothing else changes. Time works against the buyer.";
    }
    g2();
    L.note(gb, "Real Greeks change all the time. These sliders show the idea only.");
  };

  // ---------------------------------------------------------------- 09-03 hedging
  D["hedge-demo"] = function (p, host) {
    var b = L.box(host, "Hedge: a holding with and without a put",
      "What to try: slide the price at expiry down to Rs 400. See the loss stop getting worse. Then slide to Rs 500 and see what the hedge cost.");
    var body = b.body;
    theory(body);
    var st = { n: Math.max(1, L.P(p, "shares", 100)), entry: Math.max(1, L.P(p, "entry", 500)), K: L.P(p, "strike", 470), prem: Math.max(0, L.P(p, "premium", 12)), S: L.P(p, "price", 400) };
    var row = L.row(body);
    L.numberField(row, { label: "Put strike (Rs)", value: st.K, onInput: function (v) { st.K = v; update(); } });
    L.numberField(row, { label: "Put premium per share (Rs)", value: st.prem, onInput: function (v) { st.prem = Math.max(0, v); update(); } });
    var showH = true;
    L.toggle(body, { label: "Show the hedged line", value: true, onChange: function (v) { showH = v; update(); } });
    var lo = Math.round(st.entry * 0.7), hi = Math.round(st.entry * 1.2);
    var sl = L.slider(body, { label: "Share price at expiry", min: lo, max: hi, step: 5, value: L.clamp(st.S, lo, hi), fmt: L.inr, onInput: function (v) { st.S = v; update(); } });
    var g = L.svg(body, 340, 220, "");
    var tbl = L.el("div");
    body.appendChild(tbl);
    var out = live(body);
    L.note(body, "Real hedges may not match the holding exactly. That gap is basis risk. Costs other than the premium are left out.");

    function unh(S) { return st.n * (S - st.entry); }
    function put(S) { return st.n * Math.max(0, st.K - S); }
    function hed(S) { return unh(S) + put(S) - st.n * st.prem; }

    function update() {
      st.S = L.clamp(st.S, lo, hi);
      g.svg.setAttribute("aria-label", "Result against share price at expiry, with and without the put. The hedged line stops falling below the strike.");
      g.clear();
      var ext = L.extent([unh(lo), unh(hi), hed(lo), hed(hi), 0], 0.1);
      var sx = L.scale(lo, hi, 50, 330), sy = L.scale(ext[0], ext[1], 190, 14);
      g.line(50, sy(0), 330, sy(0), "cft-ln");
      g.text(46, sy(0) + 3, "0", "cft-tx cft-tx-s", "end");
      g.text(46, 18, L.inr(Math.round(ext[1] / 1000) * 1000), "cft-tx cft-tx-s", "end");
      g.text(46, 190, L.inr(Math.round(ext[0] / 1000) * 1000), "cft-tx cft-tx-s", "end");
      g.text(50, 206, L.inr(lo), "cft-tx cft-tx-s", "start");
      g.text(330, 206, L.inr(hi), "cft-tx cft-tx-s", "end");
      g.line(sx(st.K), 14, sx(st.K), 190, "cft-ln-d");
      g.text(sx(st.K), 218, "Put strike " + L.inr(st.K), "cft-tx cft-tx-s", "middle");
      var xs = [lo, Math.max(lo, Math.min(hi, st.K)), hi];
      g.path(xs.map(function (x) { return [sx(x), sy(unh(x))]; }), "cft-pl-o");
      if (showH) g.path(xs.map(function (x) { return [sx(x), sy(hed(x))]; }), "cft-pl");
      g.circle(sx(st.S), sy(unh(st.S)), 5, "cft-dot");
      if (showH) g.circle(sx(st.S), sy(hed(st.S)), 5, "cft-dot-b");
      g.text(54, 28, "Orange: no hedge. Blue: with the put.", "cft-tx cft-tx-s");

      var hold = st.n * st.entry, cost = st.n * st.prem;
      clr(tbl);
      L.table(tbl, [
        ["Value of the holding (" + st.n + " x " + L.inr(st.entry) + ")", L.inr(hold)],
        ["Result on the shares, no hedge", L.inr(unh(st.S))],
        ["Put pays out", L.inr(put(st.S))],
        ["Put premium paid (the cost)", L.inr(-cost)],
        ["Result with the hedge", L.inr(hed(st.S)), true],
      ]);
      out.textContent = "At " + L.inr(st.S) + ": no hedge gives " + L.inr(unh(st.S)) + " (" + spct(unh(st.S) * 100 / hold, 1) + " of the holding). With the put it is " + L.inr(hed(st.S)) + " (" + spct(hed(st.S) * 100 / hold, 1) + "). The put costs " + L.inr(cost) + " (" + plainPct(cost * 100 / hold, 1) + " of the holding) whatever happens.";
    }
    update();
  };

  // ---------------------------------------------------------------- 09-04 studies
  D["sebi-study-bars"] = function (p, host) {
    var b = L.box(host, "An average can hide a spread",
      "What to try: keep 40% winners, then change the average gain to 4,000. See how the whole group's result flips, though 60% still lose.");
    var body = b.body;
    var st = { n: Math.max(10, L.P(p, "traders", 1000)), wp: L.clamp(L.P(p, "winnersPct", 40), 5, 95), gain: Math.max(0, L.P(p, "avgGain", 1000)), loss: Math.max(0, L.P(p, "avgLoss", 2000)), spread: false };
    var row = L.row(body);
    L.numberField(row, { label: "Traders in the group", value: st.n, step: 10, onInput: function (v) { st.n = Math.max(10, v); update(); } });
    L.numberField(row, { label: "Average gain per winner (Rs)", value: st.gain, step: 100, onInput: function (v) { st.gain = Math.max(0, v); update(); } });
    L.numberField(row, { label: "Average loss per loser (Rs)", value: st.loss, step: 100, onInput: function (v) { st.loss = Math.max(0, v); update(); } });
    L.slider(body, { label: "Share of traders who ended with a net gain", min: 5, max: 95, step: 1, value: st.wp, fmt: function (v) { return v + "%"; }, onInput: function (v) { st.wp = v; update(); } });
    L.toggle(body, { label: "Show 20 example traders behind the averages", value: false, onChange: function (v) { st.spread = v; update(); } });
    var g = L.svg(body, 340, 212, "");
    var out = live(body);
    L.note(body, "Hypothetical group. Figures from a real study must be taken from the study itself, with its name, date and period, and checked.");
    var r = L.rng(11), w = [];
    for (var i = 0; i < 20; i++) w.push(0.2 + 1.6 * r());

    function group(k, avg, sign) {
      var ws = w.slice(sign > 0 ? 0 : 20 - k, sign > 0 ? k : 20), sum = 0;
      ws.forEach(function (x) { sum += x; });
      var mean = ws.length ? sum / ws.length : 1;
      return ws.map(function (x) { return sign * avg * x / mean; }).sort(function (a, c) { return sign > 0 ? c - a : a - c; });
    }

    function update() {
      var wn = Math.round(st.n * st.wp / 100), ln = st.n - wn;
      var tg = wn * st.gain, tl = ln * st.loss, net = tg - tl, avg = net / st.n;
      g.svg.setAttribute("aria-label", st.spread ? "Twenty example traders as bars, winners and losers, with the group average shown as a line" : "Bars for total gains of winners, total losses of losers, and the net result");
      g.clear();
      if (!st.spread) {
        var m = Math.max(tg, tl, Math.abs(net), 1);
        var sy = L.scale(-m, m, 180, 20), z = sy(0);
        g.line(20, z, 330, z, "cft-ln");
        [["Winners' total", tg, 40], ["Losers' total", -tl, 140], ["Whole group", net, 240]].forEach(function (c) {
          var y2 = sy(c[1]);
          g.rect(c[2], Math.min(z, y2), 70, Math.abs(y2 - z), c[1] >= 0 ? "cft-rc-up" : "cft-rc-down");
          g.text(c[2] + 35, 207, c[0], "cft-tx cft-tx-s", "middle");
          g.text(c[2] + 35, c[1] >= 0 ? y2 - 4 : y2 + 12, L.inr(c[1]), "cft-tx cft-tx-s", "middle");
        });
      } else {
        var k = Math.round(20 * st.wp / 100);
        var vals = group(k, st.gain, 1).concat(group(20 - k, st.loss, -1));
        var mx = Math.max.apply(null, vals.map(Math.abs).concat([Math.abs(avg), 1]));
        var s2 = L.scale(-mx, mx, 180, 16), z2 = s2(0), bw = 300 / 20;
        g.line(20, z2, 330, z2, "cft-ln");
        vals.forEach(function (v, j) {
          var y3 = s2(v);
          g.rect(24 + j * bw, Math.min(z2, y3), bw - 3, Math.abs(y3 - z2), v >= 0 ? "cft-rc-up" : "cft-rc-down");
        });
        g.line(20, s2(avg), 330, s2(avg), "cft-ln-hi");
        g.text(330, s2(avg) - 3, "Group average " + L.inr(avg), "cft-tx cft-tx-s", "end");
        g.text(20, 196, "Each bar is one made-up trader, standing for " + Math.round(st.n / 20) + " traders.", "cft-tx cft-tx-s");
        g.text(20, 208, "The averages match the numbers above.", "cft-tx cft-tx-s");
      }
      out.textContent = wn + " winners gained " + L.inr(tg) + " (average " + L.inr(st.gain) + "). " + ln + " losers lost " + L.inr(tl) + " (average " + L.inr(st.loss) + "). Whole group: " + (net >= 0 ? "net gain " : "net loss ") + L.inr(Math.abs(net)) + ", which is " + L.inr(avg) + " per trader. " + (100 - st.wp) + "% of traders lost money.";
    }
    update();
  };

  // ---------------------------------------------------------------- 09-05 algo
  D["algo-pipeline"] = function (p, host) {
    var b = L.box(host, "From an idea to an order: where a person must check",
      "What to try: press Play or Step in the first mode. Then switch the mode to see why this book does not let a program send orders.");
    var body = b.body;
    var mode = L.S(p, "mode", "alert") === "auto" ? "auto" : "alert";
    var stages = [
      ["1. An idea", "You have an idea. For example: tell me when a price crosses a level I wrote down."],
      ["2. Written rules", "You turn the idea into exact rules. A program can follow only what is written. It cannot guess what you meant."],
      ["3. Price data", "Price data reaches the program. Some plans may not include the data you need. Check the plan."],
      ["4. The rule fires", "The price crosses your level. The rule is met."],
      ["5. You check", "An alert reaches you. A person reads it, looks at the journal and decides."],
      ["6. Order to a broker", "An instruction to buy or sell goes to the broker. This step is regulated. It is not part of this book."],
    ];
    L.select(body, { label: "Mode", options: [["alert", "Alert, then you decide (this book)"], ["auto", "Program sends the order itself (not in this book)"]], value: mode, onChange: function (v) { mode = v; an.reset(); } });
    var cur = -1, repeats = 0;
    var an = L.anim(body, {
      interval: 900, total: 10,
      step: function (i) {
        if (mode === "alert") {
          cur = i; repeats = 0; draw();
          return i < 4;
        }
        if (i <= 3) { cur = i; repeats = 0; }
        else { cur = 5; repeats = i - 3; }
        draw();
        return true;
      },
      reset: function () { cur = -1; repeats = 0; draw(); },
    });
    var list = L.el("div");
    list.style.cssText = "display:flex;flex-direction:column;gap:6px;margin:8px 0";
    body.appendChild(list);
    var out = live(body);
    L.note(body, "Made-up illustration. No order is sent. This book has no broker link, no saved login and no order placement. A program repeats its mistakes quickly.");

    function draw() {
      clr(list);
      stages.forEach(function (s, i) {
        var d = L.el("div", "cft-screen");
        d.style.margin = "0";
        var active = i === cur, skipped = mode === "auto" && i === 4 && cur >= 5;
        var notInBook = i === 5 && mode === "alert";
        d.style.borderColor = active ? "var(--cft-orange)" : "";
        d.style.borderWidth = active ? "2px" : "1px";
        d.style.opacity = (notInBook || skipped || (i > cur && cur >= 0)) ? ".5" : "1";
        var h = L.el("strong", null, s[0]);
        d.appendChild(h);
        if (skipped) d.appendChild(L.el("span", "cft-tag cft-tag-o", "skipped: no person checks"));
        if (notInBook) d.appendChild(L.el("span", "cft-tag cft-tag-o", "not in this book"));
        if (active || cur < 0) d.appendChild(L.el("div", "cft-hint", s[1]));
        list.appendChild(d);
      });
      if (cur < 0) out.textContent = "Press Play or Step to follow one idea along the path.";
      else if (mode === "alert") {
        out.textContent = cur < 4 ? stages[cur][0] + ". " + stages[cur][1] : "The path stops at step 5. A person decides. Sending an order is not part of this book.";
      } else if (cur < 5) out.textContent = stages[cur][0] + ". " + stages[cur][1];
      else out.textContent = repeats <= 1 ? "The program sent an order by itself. Nobody checked it first." : "The rule has a mistake. The same wrong order went out again. Orders sent so far: " + repeats + ". A person reading an alert would have caught it at step 5.";
    }
    draw();
  };

  // ---------------------------------------------------------------- 09-07 flows
  D["flow-bars"] = function (p, host) {
    var b = L.box(host, "Net and gross flow, side by side",
      "What to try: change the buy and sell numbers. Then raise the extra activity slider. The net stays the same but the gross grows.");
    var body = b.body;
    var st = { buy: Math.max(0, L.P(p, "buy", 3000)), sell: Math.max(0, L.P(p, "sell", 2400)), extra: 0 };
    var row = L.row(body);
    L.numberField(row, { label: "Gross buy (Rs crore)", value: st.buy, step: 100, onInput: function (v) { st.buy = Math.max(0, v); update(); } });
    L.numberField(row, { label: "Gross sell (Rs crore)", value: st.sell, step: 100, onInput: function (v) { st.sell = Math.max(0, v); update(); } });
    L.slider(body, { label: "Extra activity added to both buy and sell (Rs crore)", min: 0, max: 10000, step: 500, value: 0, fmt: function (v) { return L.inr(v); }, onInput: function (v) { st.extra = v; update(); } });
    var g = L.svg(body, 340, 150, "");
    var out = live(body);
    L.note(body, "Made-up day. 1 crore = Rs 1,00,00,000. The table shows what happened in a day. It does not show what will happen next.");

    function update() {
      var buy = st.buy + st.extra, sell = st.sell + st.extra;
      var net = buy - sell, gross = buy + sell;
      g.svg.setAttribute("aria-label", "Bars for gross buy, gross sell, net and gross turnover in crore rupees");
      g.clear();
      var m = Math.max(gross, 1), sx = L.scale(0, m, 0, 170);
      [["Gross buy", buy, "cft-rc"], ["Gross sell", sell, "cft-rc"], ["Net", net, net >= 0 ? "cft-rc-up" : "cft-rc-down"], ["Gross turnover", gross, "cft-rc-grey"]].forEach(function (r, i) {
        var y = 10 + i * 34, w = Math.abs(sx(r[1]));
        g.text(4, y + 17, r[0], "cft-tx cft-tx-b");
        g.rect(100, y, w, 24, r[2]);
        g.text(100 + w + 4, y + 17, L.inr(r[1]), "cft-tx");
      });
      var share = gross > 0 ? net * 100 / gross : 0;
      out.textContent = "Net = " + L.inr(buy) + " - " + L.inr(sell) + " = " + L.inr(net) + " crore (" + (net >= 0 ? "net buying" : "net selling") + "). Gross turnover = " + L.inr(gross) + " crore. Net is " + spct(share, 1) + " of gross.";
    }
    update();
  };

  // ---------------------------------------------------------------- 01-01 shares
  D["share-slices"] = function (p, host) {
    var b = L.box(host, "A company cut into equal shares",
      "What to try: press Play to let the company issue new shares. Your share count stays the same. Your percentage shrinks.");
    var body = b.body;
    var st = { total: Math.max(1, L.P(p, "totalShares", 1000000)), price: Math.max(0, L.P(p, "price", 200)), held: Math.max(0, L.P(p, "held", 1000)), buy: Math.max(0, L.P(p, "buyShares", 100)), nw: 0 };
    var row = L.row(body);
    L.numberField(row, { label: "Total shares of the company", value: st.total, step: 10000, onInput: function (v) { st.total = Math.max(1, v); update(); } });
    L.numberField(row, { label: "Price of one share (Rs)", value: st.price, onInput: function (v) { st.price = Math.max(0, v); update(); } });
    var row2 = L.row(body);
    L.numberField(row2, { label: "Shares you hold", value: st.held, step: 10, onInput: function (v) { st.held = Math.max(0, v); update(); } });
    L.numberField(row2, { label: "Shares someone buys from another investor", value: st.buy, step: 10, onInput: function (v) { st.buy = Math.max(0, v); update(); } });
    var sl = L.slider(body, { label: "New shares the company issues", min: 0, max: 1000000, step: 50000, value: 0, fmt: function (v) { return L.inr(v).replace("Rs ", ""); }, onInput: function (v) { st.nw = v; an.setIndex(Math.round(v / 50000)); update(); } });
    var an = L.anim(body, {
      interval: 500, total: 10,
      step: function (i) { st.nw = (i + 1) * 50000; sl.set(st.nw); update(); },
      reset: function () { st.nw = 0; sl.set(0); update(); },
    });
    var g = L.svg(body, 340, 110, "");
    g.svg.setAttribute("aria-label", "Two bars of company shares, before and after new shares are issued, with your small part marked");
    var tbl = L.el("div");
    body.appendChild(tbl);
    var out = live(body);

    function update() {
      var t2 = st.total + st.nw, p1 = st.held * 100 / st.total, p2 = st.held * 100 / t2;
      g.clear();
      var max = st.total + 1000000, sx = L.scale(0, max, 0, 300);
      g.text(20, 14, "Today", "cft-tx cft-tx-b");
      g.rect(20, 20, sx(st.total), 22, "cft-rc");
      g.rect(20, 20, Math.max(2, sx(st.held)), 22, "cft-dot");
      g.text(20, 60, "After new shares", "cft-tx cft-tx-b");
      g.rect(20, 66, sx(st.total), 22, "cft-rc");
      if (st.nw > 0) g.rect(20 + sx(st.total), 66, sx(st.nw), 22, "cft-rc-grey");
      g.rect(20, 66, Math.max(2, sx(st.held)), 22, "cft-dot");
      g.text(20, 104, "Orange: your shares (shown larger than true size). Grey: new shares.", "cft-tx cft-tx-s");
      var cv = st.total * st.price;
      clr(tbl);
      L.table(tbl, [
        ["Value of the company (shares x price)", L.inr(cv) + " (Rs " + parseFloat((cv / 1e7).toFixed(2)) + " crore)"],
        ["Your ownership today", plainPct(p1, 4)],
        ["Your holding value (shares x price)", L.inr(st.held * st.price)],
        ["Your ownership after new shares", plainPct(p2, 4), true],
        ["Sale of " + st.buy + " shares between investors", L.inr(st.buy * st.price) + " goes to the seller. The company gets Rs 0."],
      ]);
      out.textContent = "You hold " + st.held + " of " + t2 + " shares, so you own " + plainPct(p2, 4) + (st.nw > 0 ? " (it was " + plainPct(p1, 4) + ")" : "") + ". Your " + st.held + " shares at " + L.inr(st.price) + " are worth " + L.inr(st.held * st.price) + ". The new share count does not decide the price. Trading does.";
    }
    update();
  };

  // ---------------------------------------------------------------- 01-03 settlement
  D["settlement-timeline"] = function (p, host) {
    var b = L.box(host, "Buy now, shares arrive later",
      "What to try: press Play and follow the buy day by day. Tap a weekday to make it a made-up holiday and see the settlement day move.");
    var body = b.body;
    var qty = Math.max(1, L.P(p, "qty", 20)), price = Math.max(1, L.P(p, "price", 250));
    var start = Math.max(0, Math.min(4, L.P(p, "startDay", 0)));
    var gap = L.clamp(Math.round(L.P(p, "settleDays", 1)), 1, 3);
    var hol = [];
    var row = L.row(body);
    L.select(row, { label: "Day you buy", options: DAYN.slice(0, 5).map(function (d, i) { return [String(i), d]; }), value: String(start), onChange: function (v) { start = +v; hol.length = 0; setup(); } });
    L.slider(row, { label: "Settlement after (working days)", min: 1, max: 3, step: 1, value: gap, fmt: function (v) { return "T+" + v; }, onInput: function (v) { gap = v; setup(); } });
    var rule = L.el("p", "cft-hint", "The chapter uses T+1. ");
    rule.appendChild(checkTag("current rule and holiday list"));
    body.appendChild(rule);
    var sp = strip(body, 10, function () { return start; }, hol, function () { setup(); }, function (k) { return k > 0; });
    var an = L.anim(body, { interval: 1000, step: stepFn, reset: function () { paintAll(-1); show(-1); } });
    var status = L.el("div");
    body.appendChild(status);
    var out = live(body);
    var events = [], settleK = 0;

    function isWk(k) { return ((start + k) % 7) >= 5; }
    function setup() {
      sp.refreshNames();
      var cnt = 0, k = 0;
      while (cnt < gap && k < 9) { k++; if (!isWk(k) && !hol[k]) cnt++; }
      settleK = k;
      events = [
        { k: 0, tag: "Order placed", t: "Trading account: you place the order for " + qty + " shares at " + L.inr(price) + ". Trade value " + L.inr(qty * price) + "." },
        { k: 0, tag: "Trade matched", t: "Execution: the exchange matches your order with a seller. The trade happens now. The shares and money have not moved." },
        { k: 0, tag: "Clearing", t: "Clearing: the clearing corporation works out what each side owes. Many trades are netted into one figure." },
      ];
      for (var j = 1; j < settleK; j++) {
        events.push({ k: j, tag: isWk(j) ? "Weekend" : hol[j] ? "Holiday" : "Working day", t: isWk(j) ? "A weekend day. Nothing settles." : hol[j] ? "A made-up holiday. Nothing settles. It is not counted." : "A working day, counted toward the wait. Still not settled." });
      }
      events.push({ k: settleK, tag: "Settled", t: "Settlement: " + L.inr(qty * price) + " leaves your bank. " + qty + " shares are credited to your demat account." });
      an.reset();
      var wd = DAYN[start], sd = DAYN[(start + settleK) % 7];
      out.textContent = "Bought on " + wd + ", settles on " + sd + " (" + settleK + " calendar day" + (settleK > 1 ? "s" : "") + " later, " + gap + " working day" + (gap > 1 ? "s" : "") + "). Press Play to follow it.";
    }
    function paintAll(upto) {
      for (var k = 0; k < sp.cells.length; k++) {
        var tag = "", mode = "";
        if (k === 0) tag = "Trade day";
        if (upto >= 0 && k === events[upto].k) mode = upto === events.length - 1 ? "target" : "now";
        sp.paint(k, k === 0 ? "Trade day" : (upto >= 0 && k === settleK && upto === events.length - 1 ? "Settled" : ""), mode);
      }
    }
    function show(i) {
      clr(status);
      var settled = i === events.length - 1;
      L.table(status, [
        ["Demat account (shares)", i < 0 ? "0 shares" : settled ? qty + " shares" : "0 shares. Not yet."],
        ["Linked bank (money)", i < 0 ? "Not touched" : settled ? L.inr(qty * price) + " paid" : "Not paid yet"],
      ]);
    }
    function stepFn(i) {
      if (i >= events.length) return false;
      paintAll(i); show(i);
      out.textContent = events[i].tag + ". " + events[i].t;
      return i < events.length - 1;
    }
    setup();
  };

  // ---------------------------------------------------------------- 01-06 sessions
  D["session-clock"] = function (p, host) {
    var b = L.box(host, "A trading day has phases",
      "What to try: press Play or drag the slider through the day. See what happens to an order at each phase.");
    var body = b.body;
    var segs = [
      { n: "Pre-open", w: 12, t: "Pre-open: orders are collected. One opening price is worked out before normal trading starts." },
      { n: "Continuous trading", w: 56, t: "Continuous trading: orders are matched as they arrive, as in the order book." },
      { n: "Closing session", w: 12, t: "Closing session: a closing price is set near the end of the day." },
      { n: "After the close", w: 20, t: "After the close: the market is shut. An order now waits for the next session. That session can open far from today's close." },
    ];
    var pos = 0;
    var sl = L.slider(body, { label: "Moment in the day (not a clock)", min: 0, max: 99, step: 1, value: pos, fmt: function (v) { return v + " of 100"; }, onInput: function (v) { pos = v; an.setIndex(Math.round(v / 5)); draw(); } });
    var an = L.anim(body, {
      interval: 600, total: 20,
      step: function (i) { pos = Math.min(99, i * 5); sl.set(pos); draw(); },
      reset: function () { pos = 0; sl.set(0); draw(); },
    });
    var g = L.svg(body, 340, 100, "");
    g.svg.setAttribute("aria-label", "A day split into pre-open, continuous trading, closing session and after the close, with a marker");
    var out = live(body);
    var n = L.el("p", "cft-hint", "Widths are not to scale. The exchange sets the real times and can change them. This demo shows no clock times. ");
    n.appendChild(checkTag("exchange market timings page"));
    body.appendChild(n);

    function draw() {
      g.clear();
      var x = 20, cur = 0, acc = 0;
      segs.forEach(function (s, i) {
        var wpx = s.w * 3;
        g.rect(x, 22, wpx - 2, 26, i === 3 ? "cft-rc-grey" : (i === 1 ? "cft-rc" : "cft-rc-band"));
        g.text(x, 62 + (i % 2) * 14, s.n, "cft-tx cft-tx-s");
        if (pos >= acc && pos < acc + s.w) cur = i;
        acc += s.w; x += wpx;
      });
      var mx = 20 + pos * 3;
      g.line(mx, 14, mx, 52, "cft-hl");
      g.circle(mx, 14, 5, "cft-dot");
      out.textContent = segs[cur].t;
    }
    draw();
  };

  D["next-session-finder"] = function (p, host) {
    var b = L.box(host, "Find the next trading session",
      "What to try: press Play. Then tap a weekday to add or remove a made-up holiday, or change the day you decide.");
    var body = b.body;
    var start = L.clamp(Math.round(L.P(p, "startDay", 4)), 0, 4);
    var hol = [];
    var ex = Math.max(0, Math.round(L.P(p, "holidayAfter", 3)));
    function defHol() { hol.length = 0; if (start === 4) hol[ex] = true; }
    defHol();
    L.select(body, { label: "Day you write the plan (after the close)", options: DAYN.slice(0, 5).map(function (d, i) { return [String(i), d]; }), value: String(start), onChange: function (v) { start = +v; defHol(); recalc(); } });
    var sp = strip(body, 10, function () { return start; }, hol, function () { recalc(); }, function (k) { return k > 0; });
    var an = L.anim(body, { interval: 800, step: stepFn, reset: function () { neutral(); } });
    var out = live(body);
    L.note(body, "Made-up holidays, for practice. The real holiday list comes from the exchange each year.");
    var nextK = 0;
    function isWk(k) { return ((start + k) % 7) >= 5; }
    function neutral() { for (var k = 0; k < 10; k++) sp.paint(k, k === 0 ? "You decide" : "", k === 0 ? "now" : ""); }
    function recalc() {
      sp.refreshNames();
      var k = 1;
      while (k < 10 && (isWk(k) || hol[k])) k++;
      nextK = k;
      an.reset();
      out.textContent = "You decide after the close on " + DAYN[start] + ". The next session is " + DAYN[(start + nextK) % 7] + ", " + nextK + " calendar day" + (nextK > 1 ? "s" : "") + " later. Press Play to see the days checked one by one. That session can open far from the close your plan used.";
    }
    function stepFn(i) {
      var k = i + 1;
      if (k > nextK) return false;
      var found = k === nextK;
      sp.paint(k, found ? "Next session" : (isWk(k) ? "Weekend: skip" : "Holiday: skip"), found ? "target" : "skip");
      out.textContent = found ? DAYN[(start + k) % 7] + " is a trading day. It is the next session, " + k + " calendar days after " + DAYN[start] + "." : DAYN[(start + k) % 7] + (isWk(k) ? " is a weekend. Skip it." : " is a made-up holiday. Skip it.");
      return !found;
    }
    recalc();
  };

  // ---------------------------------------------------------------- 01-08 index
  D["index-calculator"] = function (p, host) {
    var b = L.box(host, "A tiny made-up index",
      "What to try: move one stock's price and watch the index. Then switch weighting to see how free float changes who matters.");
    var body = b.body;
    var presets = {
      chapter: { names: ["A", "B", "C", "D", "E"], size: [5000, 3000, 2000, 0, 0], ff: [100, 100, 100, 100, 100], mv: [4, -2, 1, 0, 0] },
      five: { names: ["A", "B", "C", "D", "E"], size: [6000, 5000, 3000, 2500, 1500], ff: [70, 40, 90, 100, 60], mv: [2, -1, 0.5, -3, 1] },
    };
    var key = L.S(p, "preset", "chapter") === "five" ? "five" : "chapter";
    var st = { useFF: true, mv: presets[key].mv.slice(), level: Math.max(1, L.P(p, "level", 20000)), hold: 1, amt: Math.max(0, L.P(p, "holding", 50000)) };
    L.select(body, { label: "Example", options: [["chapter", "Three stocks, as in the chapter"], ["five", "Five stocks"]], value: key, onChange: function (v) { key = v; st.mv = presets[v].mv.slice(); buildSliders(); update(); } });
    L.toggle(body, { label: "Weight by free float (shares really free to trade)", value: true, onChange: function (v) { st.useFF = v; update(); } });
    L.note(body, "Free float means the shares that can really be traded. Shares kept by founders or the government are not free. With free-float weights, a stock with many locked-up shares counts for less.");
    var row = L.row(body);
    L.numberField(row, { label: "Index level at the start (points, made up)", value: st.level, step: 100, onInput: function (v) { st.level = Math.max(1, v); update(); } });
    L.numberField(row, { label: "Your holding (Rs)", value: st.amt, step: 1000, onInput: function (v) { st.amt = Math.max(0, v); update(); } });
    var hs = L.select(row, { label: "Your holding is in stock", options: [["0", "A"], ["1", "B"], ["2", "C"], ["3", "D"], ["4", "E"]], value: "1", onChange: function (v) { st.hold = +v; update(); } });
    var panel = L.el("div");
    body.appendChild(panel);
    var g = L.svg(body, 340, 170, "");
    var out = live(body);
    var sliders = [];

    function weights() {
      var pr = presets[key], base = pr.size.map(function (s, i) { return st.useFF ? s * pr.ff[i] / 100 : s; });
      var sum = 0; base.forEach(function (x) { sum += x; });
      return base.map(function (x) { return sum ? x / sum : 0; });
    }
    function buildSliders() {
      clr(panel); sliders = [];
      var pr = presets[key];
      pr.names.forEach(function (n, i) {
        if (!pr.size[i]) return;
        var s = L.slider(panel, { label: "Stock " + n + " price move", min: -10, max: 10, step: 0.5, value: st.mv[i], fmt: function (v) { return spct(v, 1); }, onInput: function (v) { st.mv[i] = v; update(); } });
        s.i = i; sliders.push(s);
      });
    }
    function update() {
      var pr = presets[key], w = weights(), total = 0, rose = 0, fell = 0, act = 0;
      var rows = [];
      pr.names.forEach(function (n, i) {
        if (!pr.size[i]) return;
        var c = w[i] * st.mv[i]; total += c; act++;
        if (st.mv[i] > 0) rose++; else if (st.mv[i] < 0) fell++;
        rows.push([n + " (weight " + (w[i] * 100).toFixed(1) + "%)", c]);
      });
      sliders.forEach(function (s) { s.el.querySelector(".cft-field-label span").textContent = "Stock " + pr.names[s.i] + " price move, weight " + (w[s.i] * 100).toFixed(1) + "%"; });
      rows.push(["Index", total]);
      g.svg.setAttribute("aria-label", "Bars showing how much each stock adds to the index move, and the total");
      g.clear();
      var m = 2;
      rows.forEach(function (r) { m = Math.max(m, Math.abs(r[1])); });
      var sx = L.scale(-m, m, 120, 300), z = sx(0), rh = 26;
      g.line(z, 4, z, rows.length * rh + 6, "cft-ln");
      rows.forEach(function (r, i) {
        var y = 8 + i * rh, x2 = sx(r[1]);
        g.text(4, y + 15, r[0], "cft-tx cft-tx-s" + (i === rows.length - 1 ? " cft-tx-b" : ""));
        g.rect(Math.min(z, x2), y, Math.abs(x2 - z), 18, r[1] >= 0 ? "cft-rc-up" : "cft-rc-down");
        g.text(r[1] >= 0 ? x2 + 3 : x2 - 3, y + 14, spct(r[1], 2), "cft-tx cft-tx-s", r[1] >= 0 ? "start" : "end");
      });
      var nl = st.level * (1 + total / 100), pts = nl - st.level;
      var hi = Math.min(st.hold, pr.names.length - 1);
      var holdTxt = "";
      if (pr.size[hi]) holdTxt = " Your " + L.inr(st.amt) + " in stock " + pr.names[hi] + " moves " + spct(st.mv[hi], 1) + ", which is a " + gl(st.amt * st.mv[hi] / 100) + ".";
      else holdTxt = " Stock " + pr.names[hi] + " is not in this example. Pick another stock.";
      out.textContent = "The index moves " + spct(total, 2) + " (" + (pts >= 0 ? "+" : "") + Math.round(pts) + " points, from " + L.inr(st.level).replace("Rs ", "") + " to " + L.inr(Math.round(nl)).replace("Rs ", "") + "). " + rose + " of " + act + " stocks rose and " + fell + " fell." + holdTxt + " The index describes the group, not your stock.";
    }
    buildSliders();
    update();
  };

  // ---------------------------------------------------------------- 01-09 corporate actions
  D["corporate-action-demo"] = function (p, host) {
    var b = L.box(host, "Split, bonus and dividend: the price changes, the value does not",
      "What to try: press Play and watch the price on the chart drop on the action day. Check that your holding value stays the same.");
    var body = b.body;
    var act = L.S(p, "action", "split");
    if (["split", "bonus", "dividend"].indexOf(act) < 0) act = "split";
    var st = { shares: Math.max(1, L.P(p, "shares", 100)), price: Math.max(1, L.P(p, "price", 1000)), ratio: Math.max(1, L.P(p, "ratio", act === "bonus" ? 1 : act === "split" ? 2 : 2)), div: Math.max(0, L.P(p, "dividend", 10)), adj: false };
    var N = 20, A = 10, cur = N - 1;
    var row = L.row(body);
    var selA = L.select(row, { label: "Corporate action", options: [["split", "Split"], ["bonus", "Bonus issue"], ["dividend", "Dividend"]], value: act, onChange: function (v) { act = v; if (v === "split") { st.ratio = 2; } if (v === "bonus") { st.ratio = 1; } rlab(); rf.set(st.ratio); an.reset(); calc(); } });
    L.numberField(row, { label: "Shares you hold", value: st.shares, step: 10, onInput: function (v) { st.shares = Math.max(1, v); calc(); } });
    L.numberField(row, { label: "Price before (Rs)", value: st.price, step: 10, onInput: function (v) { st.price = Math.max(1, v); calc(); } });
    var rf = L.numberField(row, { label: "", value: st.ratio, step: 1, onInput: function (v) { st.ratio = Math.max(1, v); calc(); } });
    var rlabEl = rf.el.querySelector(".cft-field-label");
    var df = L.numberField(row, { label: "Dividend per share (Rs, made up)", value: st.div, step: 1, onInput: function (v) { st.div = Math.max(0, v); calc(); } });
    L.toggle(body, { label: "Show an adjusted chart (past prices fixed for the split or bonus)", value: false, onChange: function (v) { st.adj = v; draw(); } });
    function rlab() {
      rlabEl.textContent = act === "split" ? "Each share becomes (shares)" : act === "bonus" ? "Free shares per share held" : "Not used for a dividend";
      rf.el.style.display = act === "dividend" ? "none" : "";
      df.el.style.display = act === "dividend" ? "" : "none";
    }
    var sl = L.slider(body, { label: "Day shown", min: 0, max: N - 1, step: 1, value: cur, fmt: function (v) { return v === A ? "Day " + v + " (action day)" : "Day " + v; }, onInput: function (v) { cur = v; an.setIndex(v + 1); draw(); } });
    var an = L.anim(body, {
      interval: 450, total: N,
      step: function (i) { cur = i; sl.set(cur); draw(); },
      reset: function () { cur = N - 1; sl.set(cur); draw(); },
    });
    var g = L.svg(body, 340, 200, "");
    var tbl = L.el("div");
    body.appendChild(tbl);
    var out = live(body);
    L.note(body, "Made-up prices. Before market moves and before tax. Check the real action on the company's and the exchange's own announcement. A price drop on a corporate action is not a sell signal.");
    var ser = null, f = 2;
    var wig = [];
    for (var i = 0; i < N; i++) wig.push(1 + 0.012 * Math.sin(i * 1.3) + 0.006 * Math.cos(i * 2.1));
    wig[A - 1] = 1; wig[A] = 1;

    function calc() {
      f = act === "split" ? st.ratio : act === "bonus" ? 1 + st.ratio : 1;
      ser = { u: [], a: [], sh: [], cash: [], val: [] };
      for (var d = 0; d < N; d++) {
        var base = wig[d] * st.price, u;
        if (d < A) u = base;
        else u = act === "dividend" ? base - st.div : base / f;
        ser.u.push(u);
        ser.a.push(act === "dividend" || d >= A ? u : u / f);
        ser.sh.push(act === "dividend" || d < A ? st.shares : st.shares * f);
        ser.cash.push(act === "dividend" && d >= A ? st.shares * st.div : 0);
        ser.val.push(ser.sh[d] * u + ser.cash[d]);
      }
      draw();
    }
    function draw() {
      if (!ser) return;
      g.svg.setAttribute("aria-label", "Price chart over 20 days with a marked action day. The price drops on that day.");
      g.clear();
      var all = ser.u.concat(st.adj ? ser.a : []);
      var ext = L.extent(all, 0.1), sx = L.scale(0, N - 1, 40, 330), sy = L.scale(ext[0], ext[1], 170, 14);
      g.line(40, 170, 330, 170, "cft-ln");
      g.text(36, 18, L.inr(Math.round(ext[1])), "cft-tx cft-tx-s", "end");
      g.text(36, 170, L.inr(Math.round(ext[0])), "cft-tx cft-tx-s", "end");
      g.line(sx(A), 14, sx(A), 170, "cft-ln-d");
      g.text(sx(A), 186, "Action day (ex-date)", "cft-tx cft-tx-s", "middle");
      if (st.adj && act !== "dividend") {
        var pa = []; for (var j = 0; j <= cur; j++) pa.push([sx(j), sy(ser.a[j])]);
        g.path(pa, "cft-pl-d");
      }
      var pu = []; for (var k = 0; k <= cur; k++) pu.push([sx(k), sy(ser.u[k])]);
      g.path(pu, "cft-pl");
      g.circle(sx(cur), sy(ser.u[cur]), 5, "cft-dot");
      var before = ser.val[A - 1], onDay = ser.val[A];
      clr(tbl);
      L.table(tbl, [
        ["Day " + cur + ": price shown on the chart", L.inr(ser.u[cur])],
        ["Day " + cur + ": shares you hold", String(parseFloat(ser.sh[cur].toFixed(2)))],
        ["Day " + cur + ": cash received", L.inr(ser.cash[cur])],
        ["Value the day before the action", L.inr(before)],
        ["Value on the action day", L.inr(onDay), true],
      ]);
      var drop = (ser.u[A] - ser.u[A - 1]) * 100 / ser.u[A - 1];
      var t = "On the action day the price on the chart changes " + spct(drop, 1) + ", from " + L.inr(ser.u[A - 1]) + " to " + L.inr(ser.u[A]) + ". You hold " + parseFloat(ser.sh[A].toFixed(2)) + " shares" + (act === "dividend" ? " and got " + L.inr(ser.cash[A]) + " in cash" : "") + ". Value " + L.inr(before) + " before and " + L.inr(onDay) + " after. Nothing was lost.";
      if (act === "dividend") t += " (The drop is about the dividend. Methods for adjusting charts for dividends differ.)";
      out.textContent = t;
    }
    rlab();
    calc();
  };

  // ---------------------------------------------------------------- 01-10 tips
  D["tips-checker"] = function (p, host) {
    var b = L.box(host, "Check a made-up tip message",
      "What to try: read each message. Say where it comes from, tick the warning signs you see, then press Check. 'Do nothing' is always an allowed result.");
    var body = b.body;
    var signs = ["Promises or guarantees returns", "Pushes you to hurry", "Pressure to join a group or pay for signals", "Claims to be an adviser but gives no registration details", "Claims inside information"];
    var levels = [["", "Choose one"], ["primary", "Primary: an original document"], ["secondary", "Secondary: a report that explains a primary source"], ["unverified", "Unverified: a claim with no source you can check"]];
    var msgs = [
      { t: "A company's own filing on the exchange website announces the date of a board meeting.", lv: "primary", s: [0, 0, 0, 0, 0], why: "It is the company's own filing on the exchange. You can check the date and the issuer." },
      { t: "A business news article that sums up that filing.", lv: "secondary", s: [0, 0, 0, 0, 0], why: "It repeats and explains a primary source. Use it for context and check it against the filing." },
      { t: "Forwarded message: \"Guaranteed 3x in a month. Join now. Only 10 seats left.\"", lv: "unverified", s: [1, 1, 1, 0, 0], why: "No source. It promises a result, pushes you to hurry and pushes you to join." },
      { t: "Group post: \"I am a top trader. Guaranteed Rs 10,000 a month from my signals on a Rs 50,000 account. Pay Rs 999 to get them.\"", lv: "unverified", s: [1, 0, 1, 1, 0], why: "A guarantee, a payment for signals, and an expert claim with no registration details. Also check the maths: 10,000 / 50,000 = 20% a month. That is a red flag." },
      { t: "Chat message: \"My friend inside the company says big news comes tomorrow. Act before everyone knows.\"", lv: "unverified", s: [0, 1, 0, 0, 1], why: "It claims inside information and pushes you to hurry. There is no source you can check." },
      { t: "A SEBI order published on SEBI's own website.", lv: "primary", s: [0, 0, 0, 0, 0], why: "It is a regulator's own order. Check the date and the name of the issuer." },
      { t: "A social media post with a screenshot of a broker statement showing a big profit. No name and no source.", lv: "unverified", s: [0, 0, 0, 0, 0], why: "No warning sign from the list, but it is still unverified. A screenshot is easy to fake. It is a claim to check against a primary source." },
    ];
    var idx = 0, right = 0, done = [];
    var card = L.el("div", "cft-screen");
    body.appendChild(card);
    var q = L.el("p");
    q.style.fontStyle = "italic";
    card.appendChild(q);
    var lvSel = L.select(card, { label: "Where does this message come from?", options: levels, value: "" });
    var boxes = [];
    var chk = L.el("div", "cft-checklist");
    card.appendChild(chk);
    signs.forEach(function (s) { boxes.push(L.toggle(chk, { label: s, value: false })); });
    var br = L.el("div", "cft-btn-row");
    body.appendChild(br);
    var fb = L.el("div");
    body.appendChild(fb);
    var score = live(body);
    L.button(br, "Check", function () {
      var m = msgs[idx];
      var okLv = lvSel.get() === m.lv, miss = [], extra = [];
      boxes.forEach(function (bx, i) {
        if (m.s[i] && !bx.get()) miss.push(signs[i]);
        if (!m.s[i] && bx.get()) extra.push(signs[i]);
      });
      var ok = okLv && !miss.length && !extra.length;
      if (lvSel.get() === "") { clr(fb); L.feedback(fb, false, "Choose where the message comes from first."); return; }
      if (!done[idx]) { done[idx] = true; if (ok) right++; }
      clr(fb);
      var lines = [ok ? "Correct. " : "Not quite. "];
      if (!okLv) lines.push("This is " + m.lv + ". ");
      if (miss.length) lines.push("Missed: " + miss.join("; ") + ". ");
      if (extra.length) lines.push("Not a sign here: " + extra.join("; ") + ". ");
      lines.push(m.why + " Whatever the message says, doing nothing is an allowed result. Never act on a tip alone.");
      L.feedback(fb, ok, lines.join(""));
      score.textContent = "Messages answered fully right: " + right + " of " + msgs.length + ". This is practice with made-up messages. It is not advice.";
    });
    L.button(br, "Next message", function () { idx = (idx + 1) % msgs.length; show(); });
    function show() {
      q.textContent = "Message " + (idx + 1) + " of " + msgs.length + ": " + msgs[idx].t;
      lvSel.set(""); boxes.forEach(function (bx) { bx.set(false); });
      clr(fb);
    }
    show();
    score.textContent = "Messages answered fully right: 0 of " + msgs.length + ". This is practice with made-up messages. It is not advice.";
  };
})();
