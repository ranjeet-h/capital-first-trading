(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  // Demos for the strategy and testing chapters: styles, edge, the strategy simulator,
  // hypotheses, data checks, look-ahead, survivorship, overfitting, walk-forward,
  // Monte Carlo of trade order and the validation verdict.
  // Every price, result and rate here is made up. Nothing is real data, a real fee or advice.

  var LIMIT = "Results on past or paper data are not proof of future results.";

  // ---------- small helpers ----------
  function r2(n) { return Math.round(n * 100) / 100; }
  function fx(n) { return String(r2(n)); }
  function rs(n) { return L.inr(r2(n)); }
  function empty(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function liveLine(parent) {
    var e = L.el("p", "cft-live");
    e.setAttribute("role", "status");
    e.setAttribute("aria-live", "polite");
    e.style.margin = "8px 0";
    e.style.fontWeight = "600";
    parent.appendChild(e);
    return e;
  }
  function limitNote(parent) { return L.note(parent, LIMIT); }
  function frame(parent, w, h, label) {
    var g = L.svg(parent, w, h);
    g.svg.setAttribute("aria-label", label);
    return g;
  }
  function niceStep(range, n) {
    var raw = range / n, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }
  function kfmt(n) {
    var a = Math.abs(n), s = n < 0 ? "-" : "";
    if (a >= 1000) return s + (Math.round(a / 100) / 10) + "k";
    return s + Math.round(a);
  }
  function yAxis(g, sy, lo, hi, x0, x1, fmt) {
    if (!(hi > lo)) return;
    var st = niceStep(hi - lo, 4), v = Math.ceil(lo / st) * st, k = 0;
    for (; v <= hi && k < 12; v += st, k++) {
      var y = sy(v);
      g.line(x0, y, x1, y, "cft-ln cft-fade");
      g.text(x0 - 4, y + 3, fmt ? fmt(v) : fx(v), "cft-tx cft-tx-s", "end");
    }
  }
  function mkTable(parent, head, rows, wrapStyle) {
    var wrap = L.el("div");
    wrap.style.overflowX = "auto";
    var t = L.el("table", "cft-table"), tr = L.el("tr");
    head.forEach(function (h) { tr.appendChild(L.el("th", null, h)); });
    t.appendChild(tr);
    rows.forEach(function (row) {
      var r = L.el("tr");
      row.forEach(function (cell) { r.appendChild(L.el("td", "cft-val", cell)); });
      t.appendChild(r);
    });
    wrap.appendChild(t);
    parent.appendChild(wrap);
    return t;
  }
  function sgn(n, d) { return (n > 0 ? "+" : "") + n.toFixed(d === undefined ? 1 : d); }
  // A rect with a chosen fill and opacity (works in light and dark themes).
  function cell(g, x, y, w, h, color, op) {
    return g.rect(x, y, w, h, "cft-rc", { style: "fill:" + color + ";opacity:" + op });
  }

  // ====================================================================
  // style-compare
  // ====================================================================
  D["style-compare"] = function (p, host) {
    var ACCOUNT = L.P(p, "account", 50000), DAYS = 250;
    var hold = L.P(p, "hold", 14), watch = L.P(p, "watch", 20), cost = L.P(p, "cost", 50);
    var margin = false, fixedLoss = true;
    var b = L.box(host, "Compare trading styles",
      "What to try: pick a style button, or move the sliders. See how the holding time changes the number of trades, the costs and the time at the screen.");
    var body = b.body;

    var presets = L.el("div", "cft-btn-row");
    body.appendChild(presets);
    var sH, sW, sC, tM, tF;
    function setAll(h, w, m) {
      sH.set(h); sW.set(w); tM.set(m);
      upd();
    }
    L.button(presets, "Intraday", function () { setAll(1, 360, true); });
    L.button(presets, "Swing (end of day)", function () { setAll(14, 20, false); });
    L.button(presets, "Positional", function () { setAll(60, 10, false); });

    var fields = L.row(body);
    sH = L.slider(fields, { label: "How long you hold each trade", min: 1, max: 90, step: 1, value: hold, fmt: function (v) { return v + (v === 1 ? " day (same session)" : " days"); }, onInput: upd });
    sW = L.slider(fields, { label: "Time watching the screen each day", min: 5, max: 480, step: 5, value: watch, fmt: function (v) { return v + " minutes"; }, onInput: upd });
    sC = L.slider(fields, { label: "Cost of one round trip (dummy rate)", min: 0, max: 150, step: 10, value: cost, fmt: function (v) { return rs(v); }, onInput: upd });
    var tg = L.el("div");
    body.appendChild(tg);
    tM = L.toggle(tg, { label: "The style uses borrowed money (margin)", value: margin, onChange: upd });
    tF = L.toggle(tg, { label: "The loss is fixed before you enter", value: fixedLoss, onChange: upd });

    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var tabDiv = L.el("div"); body.appendChild(tabDiv);
    var critDiv = L.el("div"); body.appendChild(critDiv);
    var live = liveLine(body);
    L.note(body, "Dummy numbers. The cost is a made-up rate, not a real charge. The scores are the book's judgement, not evidence about how any style performs. This is not advice.");
    limitNote(body);

    function trips(h) { return Math.max(1, Math.floor(DAYS / h)); }
    function upd() {
      var h = sH.get(), w = sW.get(), c = sC.get();
      var n = trips(h), total = n * c, pc = total / ACCOUNT * 100, hours = w * DAYS / 60;
      var tenCost = 10 * c;
      empty(chartDiv); empty(tabDiv); empty(critDiv);

      var bars = [["Intraday (1 day)", 1], ["Swing (14 days)", 14], ["Positional (60 days)", 60], ["Your setting (" + h + (h === 1 ? " day)" : " days)"), h]];
      var vals = bars.map(function (x) { return trips(x[1]) * c; });
      var mx = Math.max.apply(null, vals) || 1;
      var W = 560, H = 190, left = 130, g = frame(chartDiv, W, H, "Bar chart of the yearly cost of round trips for three styles and your own setting");
      g.text(left, 12, "Yearly cost of round trips, if you held one position after another", "cft-tx cft-tx-s");
      bars.forEach(function (bar, i) {
        var y = 24 + i * 40, wd = (W - left - 70) * vals[i] / mx;
        g.text(left - 6, y + 17, bar[0], "cft-tx cft-tx-s", "end");
        cell(g, left, y + 4, Math.max(2, wd), 24, i === 3 ? "var(--cft-orange)" : "var(--cft-blue)", 0.85);
        g.text(left + Math.max(2, wd) + 4, y + 20, rs(vals[i]), "cft-tx cft-tx-s");
      });

      L.table(tabDiv, [
        ["Round trips in a year (about " + DAYS + " trading days)", String(n)],
        ["Cost of all round trips (dummy rate)", rs(total)],
        ["As a share of a " + rs(ACCOUNT) + " account", L.pct(pc, 1), true],
        ["Ten round trips cost", rs(tenCost) + " (" + L.pct(tenCost / ACCOUNT * 100, 1) + " of the account)"],
        ["Time at the screen in a year", Math.round(hours) + " hours"]
      ]);

      var checks = [
        [w <= 60, "Needs no watching all day", "Time at the screen is " + w + " minutes a day."],
        [!tM.get(), "No borrowed money", tM.get() ? "Borrowed money makes gains and losses bigger. The book does not use it." : "No margin is used."],
        [tF.get(), "A fixed loss per trade", tF.get() ? "The loss is set before you enter." : "Without a fixed loss, one trade can hurt a lot."]
      ];
      var okN = checks.filter(function (c2) { return c2[0]; }).length;
      critDiv.appendChild(L.el("div", "cft-tx-b", "Fit with three of the book's seven criteria: " + okN + " of 3"));
      checks.forEach(function (c2) {
        var line = L.el("div", null, (c2[0] ? "Fits: " : "Does not fit: ") + c2[1] + ". " + c2[2]);
        line.className = c2[0] ? "cft-pos" : "cft-neg";
        critDiv.appendChild(line);
      });

      var near = h === 1 ? "close to intraday" : h <= 21 ? "close to swing" : "close to positional";
      live.textContent = "Holding about " + h + (h === 1 ? " day" : " days") + " (" + near + ") means about " + n +
        " round trips in a year. At " + rs(c) + " each (dummy rate) that is " + rs(total) + ", which is " + L.pct(pc, 1) +
        " of " + rs(ACCOUNT) + ". Ten round trips cost " + rs(tenCost) + ", which is " + L.pct(tenCost / ACCOUNT * 100, 1) + " of the account.";
    }
    upd();
  };

  // ====================================================================
  // edge-explorer
  // ====================================================================
  D["edge-explorer"] = function (p, host) {
    var TOTAL = 100, PER = 2;
    var seed = 5, u = [], an;
    var b = L.box(host, "Explore a trading edge",
      "What to try: change the win rate and the size of wins and losses. Then press Play to see 100 made-up trades arrive. Short runs bounce around. The long-run average is what counts.");
    var body = b.body;

    function newU() {
      var r = L.rng(seed), i;
      u = [];
      for (i = 0; i < TOTAL; i++) u.push(r());
    }
    newU();

    var shown = 0, sW, sA, sL, sC;
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    L.button(btns, "Chapter example (40%, win Rs 1,000, loss Rs 500)", function () { setP(40, 1000, 500, 50); });
    L.button(btns, "A friend's 80% method (win Rs 100, loss Rs 900)", function () { setP(80, 100, 900, 0); });
    L.button(btns, "New random run", function () { seed += 7; newU(); an.reset(); });

    var fields = L.row(body);
    sW = L.slider(fields, { label: "Win rate", min: 5, max: 95, step: 1, value: L.P(p, "winRate", 40), fmt: function (v) { return v + "%"; }, onInput: function () { render(); } });
    sA = L.slider(fields, { label: "Average win", min: 50, max: 3000, step: 50, value: L.P(p, "avgWin", 1000), fmt: function (v) { return rs(v); }, onInput: function () { render(); } });
    sL = L.slider(fields, { label: "Average loss (this is 1R)", min: 50, max: 2000, step: 50, value: L.P(p, "avgLoss", 500), fmt: function (v) { return rs(v); }, onInput: function () { render(); } });
    sC = L.slider(fields, { label: "Cost per trade (dummy rate)", min: 0, max: 200, step: 10, value: L.P(p, "cost", 50), fmt: function (v) { return rs(v); }, onInput: function () { render(); } });
    function setP(w, a, l, c) { sW.set(w); sA.set(a); sL.set(l); sC.set(c); render(); }

    var opts = {
      interval: 250, total: TOTAL / PER,
      step: function (i) { shown = (i + 1) * PER; render(); },
      reset: function () { shown = 0; render(); }
    };
    an = L.anim(body, opts);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var tabDiv = L.el("div"); body.appendChild(tabDiv);
    var live = liveLine(body);
    L.note(body, "Made-up trades drawn at random. Costs are a dummy rate. An edge is only a hypothesis until it is measured on real, honest tests. This is not advice.");

    function render() {
      var w = sW.get() / 100, aw = sA.get(), al = sL.get(), c = sC.get();
      var exp = w * aw - (1 - w) * al, expR = exp / al, net = exp - c;
      var beWin = (al + c) / (aw + al) * 100;
      var i, eq = [0], wins = 0, run = 0;
      for (i = 0; i < TOTAL; i++) {
        var win = u[i] < w;
        run += (win ? aw : -al) - c;
        eq.push(run);
      }
      for (i = 0; i < shown; i++) if (u[i] < w) wins++;
      var allv = eq.concat([net * TOTAL, 0]);
      var ext = L.extent(allv, 0.12);
      empty(chartDiv);
      var W = 560, H = 250, left = 54, g = frame(chartDiv, W, H, "Line chart of the total result after each simulated trade, with the long-run average as a dashed line");
      var sx = L.scale(0, TOTAL, left, W - 10), sy = L.scale(ext[0], ext[1], H - 26, 14);
      yAxis(g, sy, ext[0], ext[1], left, W - 10, function (v) { return kfmt(v); });
      g.line(left, sy(0), W - 10, sy(0), "cft-ln");
      g.path([[sx(0), sy(0)], [sx(TOTAL), sy(net * TOTAL)]], "cft-pl-d");
      g.text(W - 12, sy(net * TOTAL) - 5, "Long-run average", "cft-tx cft-tx-s", "end");
      g.text(left, H - 8, "0", "cft-tx cft-tx-s", "middle");
      g.text(W - 10, H - 8, TOTAL + " trades", "cft-tx cft-tx-s", "end");
      if (shown > 0) {
        var pts = [], k;
        for (k = 0; k <= shown; k++) pts.push([sx(k), sy(eq[k])]);
        g.path(pts, "cft-pl");
        g.circle(sx(shown), sy(eq[shown]), 4, "cft-dot");
      }

      empty(tabDiv);
      L.table(tabDiv, [
        ["Win rate x average win", L.pct(sW.get(), 0) + " x " + rs(aw) + " = " + rs(w * aw)],
        ["Loss rate x average loss", L.pct(100 - sW.get(), 0) + " x " + rs(al) + " = " + rs((1 - w) * al)],
        ["Expectancy (average per trade)", rs(exp) + ", which is " + (expR >= 0 ? "+" : "") + expR.toFixed(2) + "R"],
        ["After the dummy cost of " + rs(c), rs(net) + " per trade", true],
        ["Win rate needed to break even after cost", L.pct(beWin, 1)]
      ]);

      var sofar = shown > 0 ? eq[shown] / shown : 0;
      var msg = "Expected result per trade after cost: " + rs(net) + " (" + (net >= 0 ? "a positive average" : "a negative average") + ").";
      if (shown > 0) msg += " After " + shown + " simulated trades: " + wins + " wins, " + (shown - wins) + " losses, average " + rs(sofar) + " per trade. A short run can look very different from the long-run average.";
      else msg += " Press Play or Step to start the 100 made-up trades.";
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // strategy-simulator  (modes: step, trailing-stop, rules)
  // ====================================================================
  var SS_WARM = 55, SS_SHOW = 12, SS_CAPITAL = 50000;

  // 55 made-up bars that come before the signal. Highs stay below the signal close.
  function ssWarm(level, seed) {
    var r = L.rng(seed), out = [], i, mid, o, c, h, l;
    for (i = 0; i < SS_WARM; i++) {
      mid = level + 4 * Math.sin(i / 5) + (r() - 0.5) * 3;
      o = mid + (r() - 0.5) * 2; c = mid + (r() - 0.5) * 2;
      h = Math.max(o, c) + r() * 1.5; l = Math.min(o, c) - r() * 1.5;
      out.push({ o: r2(o), h: r2(h), l: r2(l), c: r2(c), atr: 4 });
    }
    return out;
  }
  var SS_SC = {
    swing: {
      label: "Full example trade (the stop rises with price)", signal: 255, seed: 11, edit: false,
      bars: [
        { o: 251, h: 256, l: 250, c: 255, atr: 4 },
        { o: 257, h: 262, l: 256, c: 261, atr: 4 },
        { o: 261, h: 266, l: 260, c: 265, atr: 4.2 },
        { o: 265, h: 271, l: 264, c: 270, atr: 4.5 },
        { o: 270, h: 276, l: 269, c: 275, atr: 4.8 },
        { o: 275, h: 282, l: 274, c: 280, atr: 5 },
        { o: 279, h: 281, l: 268, c: 270, atr: 5 },
        { o: 271, h: 272, l: 263, c: 266, atr: 5 }
      ]
    },
    gap: {
      label: "Gap down past the stop (opens at Rs 240)", signal: 255, seed: 11, edit: true, open: 240, low: 236,
      pre: [{ o: 251, h: 256, l: 250, c: 255, atr: 4 }, { o: 257, h: 259, l: 255, c: 258, atr: 4 }]
    },
    guided: {
      label: "Dip through the stop (opens at Rs 250)", signal: 255, seed: 11, edit: true, open: 250, low: 246,
      pre: [{ o: 251, h: 256, l: 250, c: 255, atr: 4 }, { o: 257, h: 259, l: 255, c: 258, atr: 4 }]
    },
    practice: {
      label: "Practice numbers (signal close Rs 200)", signal: 200, seed: 23, edit: true, open: 193, low: 190,
      pre: [{ o: 197, h: 201, l: 196, c: 200, atr: 2 }, { o: 202, h: 204, l: 200.5, c: 202.5, atr: 2 }]
    }
  };
  function ssBars(key, st) {
    var sc = SS_SC[key];
    if (!sc.edit) return sc.bars;
    var o = st.open, l = Math.min(st.low, o), c = r2((o + l) / 2), h = r2(Math.max(o, c) + 1);
    return sc.pre.concat([{ o: o, h: h, l: l, c: c, atr: sc.pre[1].atr }]);
  }
  function ssDay(j) { return j === 0 ? "Day t" : "Day t+" + j; }
  function ssSize(capital, riskPct, entry, rps, capPct) {
    var budget = capital * riskPct / 100, e = 1e-9;
    var raw = Math.floor(budget / rps + e), cash = Math.floor(capital / entry + e), conc = Math.floor(capital * capPct / 100 / entry + e);
    var sh = Math.max(0, Math.min(raw, cash, conc));
    var bind = sh === conc ? "the concentration cap" : sh === cash ? "the cash cap" : "the risk budget";
    return { budget: budget, raw: raw, cash: cash, conc: conc, shares: sh, bind: bind };
  }

  // Runs the example rules over the bars. Decision at the close, fill at the next open.
  function ssRun(key, st) {
    var sc = SS_SC[key], warm = ssWarm(sc.signal - 13, sc.seed), sbars = ssBars(key, st);
    var bars = warm.concat(sbars), N0 = warm.length;
    var rows = [], pos = null, pend = null, done = false, res = { shares: 0, siz: null };
    var j, i, k, b, row, hh, sum, sma, exitP, how;
    for (j = 0; j < sbars.length; j++) {
      i = N0 + j; b = bars[i];
      row = { j: j, b: b, label: ssDay(j), kind: "idle", rule: "", action: "", stopIn: null, stopOut: null, moved: false };
      if (done) {
        row.kind = "after"; row.rule = "The trade is already closed."; row.action = "Nothing to do."; rows.push(row); continue;
      }
      if (!pos && !pend) {
        hh = 0; for (k = i - 55; k < i; k++) hh = Math.max(hh, bars[k].h);
        sum = 0; for (k = i - 49; k <= i; k++) sum += bars[k].c;
        sma = sum / 50;
        row.hh = r2(hh); row.sma = r2(sma); row.ok1 = b.c > hh; row.ok2 = b.c > sma;
        if (row.ok1 && row.ok2) {
          pend = { atr: b.atr, close: b.c };
          row.kind = "signal";
          row.rule = "Setup met. The close " + rs(b.c) + " is above the highest high of the previous 55 bars (" + rs(row.hh) + ") and above the 50-day average (" + rs(row.sma) + ").";
          row.action = "Plan to buy at the next open.";
        } else {
          row.kind = "nosetup";
          row.rule = "Setup not met. The close must be above " + rs(row.hh) + " and above " + rs(row.sma) + ".";
          row.action = "No trade.";
        }
        rows.push(row); continue;
      }
      var entering = false;
      if (pend) {
        entering = true;
        var entry = b.o, stop0 = r2(entry - st.stopMult * pend.atr), rps = r2(entry - stop0);
        var sz = rps > 0 ? ssSize(SS_CAPITAL, st.risk, entry, rps, st.cap) : { shares: 0, budget: 0, raw: 0, cash: 0, conc: 0, bind: "" };
        pos = { entry: entry, stop0: stop0, stop: stop0, hc: entry, shares: sz.shares, rps: rps, atr0: pend.atr, signalClose: pend.close, entryJ: j };
        res.shares = sz.shares; res.entry = entry; res.stop0 = stop0; res.rps = rps; res.siz = sz; res.signalClose = pend.close;
        res.planned = sz.shares * rps; res.atr0 = pend.atr; res.entryJ = j;
        pend = null;
        if (sz.shares < 1) {
          row.kind = "skip"; row.rule = "The size works out to zero shares."; row.action = "No trade."; done = true; rows.push(row); continue;
        }
        row.stopIn = stop0;
      } else {
        row.stopIn = pos.stop;
      }
      exitP = null; how = "";
      if (!entering && b.o <= pos.stop) { exitP = b.o; how = "gap"; }
      else if (b.l <= pos.stop) { exitP = pos.stop; how = "stop"; }
      if (exitP !== null) {
        row.kind = "exit"; row.exitP = exitP; row.how = how; row.stopOut = pos.stop;
        var pnl = (exitP - pos.entry) * pos.shares;
        res.exitP = exitP; res.how = how; res.pnl = pnl; res.exitJ = j;
        if (pnl < 0) res.ratio = (-pnl) / res.planned;
        if (how === "gap") {
          row.rule = "The open " + rs(b.o) + " is at or below the stop " + rs(pos.stop) + ".";
          row.action = "Exit at the open, " + rs(exitP) + ", not at the stop.";
        } else {
          row.rule = (entering ? "The bar opens at " + rs(b.o) + " and trades down to " : "The open " + rs(b.o) + " is above the stop, but the low " + rs(b.l) + " reaches ") + "the stop " + rs(pos.stop) + ".";
          row.action = "Exit at the stop, " + rs(exitP) + ".";
        }
        if (entering) row.action = "Buy " + pos.shares + " shares at " + rs(pos.entry) + ". " + row.action;
        done = true; rows.push(row); continue;
      }
      pos.hc = Math.max(pos.hc, b.c);
      var trail = r2(pos.hc - st.trailMult * b.atr), ns = Math.max(pos.stop, trail);
      row.hc = pos.hc; row.trail = trail; row.moved = ns > pos.stop; row.stopOut = ns;
      var stopTxt = row.moved ? "Stop for the next bar rises to " + rs(ns) + "." : "Stop stays at " + rs(ns) + ". It never moves down.";
      if (entering) {
        row.kind = "enter";
        row.rule = "Entry check passed. The fill is the open " + rs(pos.entry) + ", not the signal close " + rs(pos.signalClose) + ".";
        row.action = "Buy " + pos.shares + " shares at " + rs(pos.entry) + ". Initial stop " + rs(pos.stop0) + ". " + stopTxt;
      } else {
        row.kind = "hold";
        row.rule = "The open " + rs(b.o) + " and the low " + rs(b.l) + " are above the stop " + rs(pos.stop) + ".";
        row.action = "Hold. Highest close " + rs(pos.hc) + ". " + stopTxt;
      }
      pos.stop = ns;
      rows.push(row);
    }
    if (pos && !done) res.open = true;
    return { rows: rows, warm: warm, sbars: sbars, res: res };
  }

  // The rule check for one row, as [rule, result] pairs.
  function ssRuleRows(row, sim, st) {
    var res = sim.res, out = [];
    if (row.kind === "signal") {
      out.push(["Setup: close above the highest high of the previous 55 bars", (row.ok1 ? "Yes. " : "No. ") + rs(row.b.c) + " vs " + rs(row.hh)]);
      out.push(["Setup: close above the 50-day average", (row.ok2 ? "Yes. " : "No. ") + rs(row.b.c) + " vs " + rs(row.sma)]);
      out.push(["Entry", "Buy at the next day's open"]);
      out.push(["Stop and exit", "Not set yet"]);
      out.push(["Size", "Worked out when the entry price is known"]);
    } else if (row.kind === "nosetup") {
      out.push(["Setup: close above the highest high of the previous 55 bars", (row.ok1 ? "Yes. " : "No. ") + rs(row.b.c) + " vs " + rs(row.hh)]);
      out.push(["Setup: close above the 50-day average", (row.ok2 ? "Yes. " : "No. ") + rs(row.b.c) + " vs " + rs(row.sma)]);
      out.push(["Entry", "None"]);
    } else if (row.kind === "enter") {
      out.push(["Setup", "Met on the bar before"]);
      out.push(["Entry", "Buy at the open " + rs(res.entry)]);
      out.push(["Initial stop", "Entry minus " + st.stopMult + " x ATR " + fx(res.atr0) + " = " + rs(res.stop0)]);
      out.push(["Exit", "Trailing stop: highest close minus " + st.trailMult + " x ATR. It only moves up. Next stop: " + rs(row.stopOut)]);
      out.push(["Size", res.shares + " shares. The smallest limit is " + (res.siz ? res.siz.bind : "")]);
    } else if (row.kind === "hold") {
      out.push(["Setup", "Not needed. Already in a trade"]);
      out.push(["Stop in force", rs(row.stopIn)]);
      out.push(["Exit check", "Open and low are above the stop. No exit"]);
      out.push(["Trailing stop for the next bar", rs(row.stopOut) + (row.moved ? " (moved up)" : " (unchanged)")]);
    } else if (row.kind === "exit") {
      out.push(["Stop in force", rs(row.stopIn)]);
      out.push(["Exit check", row.how === "gap" ? "The open is at or below the stop. Fill at the open" : "The bar trades down to the stop. Fill at the stop"]);
      out.push(["Exit price", rs(row.exitP)]);
    } else {
      out.push(["Rules", row.rule]);
    }
    return out;
  }

  D["strategy-simulator"] = function (p, host) {
    var mode = L.S(p, "mode", "step");
    if (mode !== "trailing-stop" && mode !== "rules") mode = "step";
    var key0 = L.S(p, "scenario", "swing");
    if (!SS_SC[key0]) key0 = "swing";
    var st = {
      key: key0, open: SS_SC[key0].open || 240, low: SS_SC[key0].low || 236,
      stopMult: 2.5, trailMult: 3, risk: 1, cap: 25, shown: 0
    };
    var sim = null, an, opts;
    var titles = { step: "Step through the rules one bar at a time", "trailing-stop": "Watch a trailing stop move", rules: "The example rule set, bar by bar" };
    var hints = {
      step: "What to try: press Step. Each step reveals one bar. Read the rule result and the action. Then try a gap scenario and see where the exit happens.",
      "trailing-stop": "What to try: press Step or Play and watch the stop line. It rises as price makes new highest closes. It never falls. Then change the stop distance.",
      rules: "What to try: press Step and read the rule check for each bar. Then change a number, such as the risk percent or the share cap, and see how the size changes."
    };
    var b = L.box(host, titles[mode], hints[mode]);
    var body = b.body;

    var fields = L.row(body);
    var selSc = L.select(fields, {
      label: "Example", value: key0,
      options: Object.keys(SS_SC).map(function (k) { return [k, SS_SC[k].label]; }),
      onChange: function (v) {
        st.key = v;
        if (SS_SC[v].edit) { st.open = SS_SC[v].open; st.low = SS_SC[v].low; fOpen.set(st.open); fLow.set(st.low); }
        syncEdit(); recompute(true);
      }
    });
    var fOpen = L.numberField(fields, { label: "Day t+2 opens at (Rs)", value: st.open, step: 1, onInput: function (v) { st.open = v; recompute(false); } });
    var fLow = L.numberField(fields, { label: "Day t+2 low (Rs)", value: st.low, step: 1, onInput: function (v) { st.low = v; recompute(false); } });
    function syncEdit() {
      var e = SS_SC[st.key].edit ? "" : "none";
      fOpen.el.style.display = e; fLow.el.style.display = e;
    }
    var sTrail, sStop, sRisk, sCap;
    if (mode === "trailing-stop" || mode === "rules") {
      sTrail = L.slider(fields, { label: "Trailing stop distance", min: 1, max: 5, step: 0.5, value: 3, fmt: function (v) { return v + " x ATR"; }, onInput: function (v) { st.trailMult = v; recompute(false); } });
    }
    if (mode === "rules") {
      sStop = L.slider(fields, { label: "Initial stop distance", min: 1, max: 4, step: 0.5, value: 2.5, fmt: function (v) { return v + " x ATR"; }, onInput: function (v) { st.stopMult = v; recompute(false); } });
      sRisk = L.slider(fields, { label: "Risk per trade", min: 0.25, max: 2, step: 0.25, value: 1, fmt: function (v) { return v + "% of capital"; }, onInput: function (v) { st.risk = v; recompute(false); } });
      sCap = L.slider(fields, { label: "Most capital in one share", min: 10, max: 40, step: 5, value: 25, fmt: function (v) { return v + "%"; }, onInput: function (v) { st.cap = v; recompute(false); } });
    }
    syncEdit();

    opts = {
      interval: 1000, total: 1,
      step: function (i) { st.shown = i + 1; render(); },
      reset: function () { st.shown = 0; render(); }
    };
    an = L.anim(body, opts);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var panel = L.el("div"); body.appendChild(panel);
    var live = liveLine(body);
    L.note(body, "Hypothetical. Made-up prices, shown as a rule set to study. It is not advice and it says nothing about future results. Costs and taxes are not included. Day t is the day the signal appears.");
    if (mode === "rules") L.note(body, "The filter values and the 55-bar and 50-day settings are choices made for this example, not market facts.");

    function recompute(resetRun) {
      sim = ssRun(st.key, st);
      opts.total = sim.sbars.length;
      if (resetRun) { an.reset(); return; }
      if (st.shown > opts.total) st.shown = opts.total;
      render();
    }

    function drawChart() {
      empty(chartDiv);
      var view = sim.warm.slice(-SS_SHOW).concat(sim.sbars), nb = view.length;
      var W = 640, H = 300, left = 46, right = 10, pitch = (W - left - right) / nb, bw = pitch * 0.6;
      var res = sim.res, rows = sim.rows, shown = st.shown, vals = [], k;
      view.forEach(function (c) { vals.push(c.h, c.l); });
      if (res.stop0) vals.push(res.stop0);
      rows.forEach(function (r) { if (r.stopOut) vals.push(r.stopOut); if (r.stopIn) vals.push(r.stopIn); });
      var ext = L.extent(vals, 0.08);
      var g = frame(chartDiv, W, H, "Candlestick chart of made-up prices with the stop line and the entry and exit marks");
      var sy = L.scale(ext[0], ext[1], H - 22, 12);
      function sx(idx) { return left + pitch * (idx + 0.5); }
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      view.forEach(function (c, idx) {
        var j = idx - SS_SHOW;
        if (j >= shown) return;
        L.candle(g, sx(idx), bw, sy, c, j < 0 ? "cft-fade" : "");
      });
      for (k = 0; k < shown && k < rows.length; k++) g.text(sx(SS_SHOW + k), H - 6, k === 0 ? "t" : "t+" + k, "cft-tx cft-tx-s", "middle");
      if (shown > 0 && rows[0].hh) {
        g.line(left, sy(rows[0].hh), sx(SS_SHOW), sy(rows[0].hh), "cft-ln-d");
        g.text(left + 4, sy(rows[0].hh) - 4, "Level to beat " + fx(rows[0].hh), "cft-tx cft-tx-s");
      }
      // stop line: one segment for each bar in the trade. A stop set at a close applies from the next bar.
      rows.forEach(function (r, j) {
        if (j >= shown || r.stopIn === null || r.stopIn === undefined) return;
        var x = sx(SS_SHOW + j), y = sy(r.stopIn);
        g.line(x - pitch / 2, y, x + pitch / 2, y, "cft-ln-hi");
        if (r.kind !== "exit" && r.stopOut !== null && r.stopOut !== r.stopIn) {
          g.line(x + pitch / 2, y, x + pitch / 2, sy(r.stopOut), "cft-ln-d");
        }
      });
      if (res.entry !== undefined && shown > res.entryJ) {
        var xe = sx(SS_SHOW + res.entryJ);
        g.circle(xe, sy(res.entry), 4, "cft-dot-b");
        g.text(xe - 8, sy(res.entry) + 14, "Buy " + fx(res.entry), "cft-tx cft-tx-s", "end");
      }
      if (res.exitP !== undefined && shown > res.exitJ) {
        var xx = sx(SS_SHOW + res.exitJ);
        g.circle(xx, sy(res.exitP), 4, "cft-dot");
        g.text(xx + 8, sy(res.exitP) + 14, "Exit " + fx(res.exitP), "cft-tx cft-tx-s", "start");
      }
      g.text(W - right, 11, "Orange line: the stop", "cft-tx cft-tx-s", "end");
    }

    function logTable() {
      var head = ["Bar", "Open", "High", "Low", "Close", "Rule result", "Action"], data = [], k;
      for (k = 0; k < st.shown && k < sim.rows.length; k++) {
        var r = sim.rows[k];
        data.push([r.label, fx(r.b.o), fx(r.b.h), fx(r.b.l), fx(r.b.c), r.rule, r.action]);
      }
      if (!data.length) { L.note(panel, "The step log is empty. Press Step."); return; }
      panel.appendChild(L.el("div", "cft-tx-b", "Step log"));
      mkTable(panel, head, data);
    }
    function trailTable() {
      var head = ["Bar", "Close", "Highest close", "ATR", "Stop for the next bar", "Moved?"], data = [], k;
      for (k = 0; k < st.shown && k < sim.rows.length; k++) {
        var r = sim.rows[k];
        if (r.stopOut === null || r.stopOut === undefined) continue;
        data.push([r.label, fx(r.b.c), r.hc !== undefined ? fx(r.hc) : "-", fx(r.b.atr), r.kind === "exit" ? "Exit" : fx(r.stopOut), r.kind === "exit" ? "Stopped out" : r.moved ? "Up" : "No change"]);
      }
      if (!data.length) { L.note(panel, "The stop appears after the entry. Press Step."); return; }
      panel.appendChild(L.el("div", "cft-tx-b", "The stop bar by bar"));
      mkTable(panel, head, data);
    }

    function render() {
      drawChart();
      empty(panel);
      var res = sim.res, shown = st.shown, row = shown > 0 ? sim.rows[shown - 1] : null;
      if (mode === "trailing-stop") trailTable();
      else if (mode === "rules") {
        if (row) {
          panel.appendChild(L.el("div", "cft-tx-b", "Rule check for " + row.label));
          L.table(panel, ssRuleRows(row, sim, st));
        } else L.note(panel, "Press Step to see the rule check for the first bar.");
        if (res.entry !== undefined && shown > res.entryJ && res.siz) {
          var z = res.siz;
          panel.appendChild(L.el("div", "cft-tx-b", "How the size is worked out"));
          L.table(panel, [
            ["Entry price (the next open)", rs(res.entry)],
            ["Initial stop: entry minus " + st.stopMult + " x ATR " + fx(res.atr0), rs(res.stop0)],
            ["Risk per share", rs(res.rps)],
            ["Risk budget: " + st.risk + "% of " + rs(SS_CAPITAL), rs(z.budget)],
            ["Shares from the risk budget", String(z.raw)],
            ["Shares from the cash cap", String(z.cash)],
            ["Shares from the concentration cap (" + st.cap + "%)", String(z.conc)],
            ["Shares to buy (the smallest)", z.shares + ", set by " + z.bind, true],
            ["Planned loss", rs(res.planned) + ", which is " + L.pct(res.planned / SS_CAPITAL * 100, 2) + " of capital", true]
          ]);
        }
        logTable();
      } else logTable();

      if (!row) { live.textContent = "Press Step to read the first bar. Nothing has happened yet."; return; }
      var msg = row.label + ": " + row.rule + " " + row.action;
      if (row.kind === "exit" && res.pnl !== undefined) {
        if (res.pnl < 0) {
          msg += " Planned loss was " + rs(res.planned) + ". Actual loss is " + rs(-res.pnl) + ", which is " + (res.ratio).toFixed(1) + " times the plan.";
          if (res.how === "gap") msg += " The price was already past the stop when the bar opened.";
        } else msg += " Gross gain " + rs(res.pnl) + ", which is " + (res.pnl / res.planned).toFixed(1) + "R (1R is the planned loss " + rs(res.planned) + "). Before costs and taxes.";
      } else if (shown >= sim.rows.length && res.open) msg += " The data ends here and the trade is still open.";
      live.textContent = msg;
    }

    recompute(false);
  };

  // ====================================================================
  // hypothesis-builder
  // ====================================================================
  D["hypothesis-builder"] = function (p, host) {
    var b = L.box(host, "From a feeling to a rule you can test",
      "What to try: in part 1, pick one answer for each question and see which rules a test could check. In part 2, lock the pass rule first, then see what happens if you move it after the result.");
    var body = b.body;

    // ---- part 1 ----
    body.appendChild(L.el("div", "cft-tx-b", "Part 1. The idea: \"Buy strong stocks.\""));
    var parts = [
      { label: "When do you buy?", opts: [
        ["a", "When the stock looks strong to me", false],
        ["b", "At the next day's open, after a close above the highest close of the last 20 days", true],
        ["c", "Soon after it starts to rise", false]] },
      { label: "Where is the stop?", opts: [
        ["a", "I will decide after I see how the price moves", false],
        ["b", "Somewhere below the price", false],
        ["c", "2.5 times ATR below the entry price (ATR is how far a price usually moves in a day)", true]] },
      { label: "When do you sell?", opts: [
        ["a", "When I have made a good profit", false],
        ["b", "At the next day's open, after a close below the lowest close of the last 10 days", true],
        ["c", "When I feel it is time", false]] },
      { label: "How many shares?", opts: [
        ["a", "Risk 1% of Rs 50,000, which is Rs 500 per trade", true],
        ["b", "As many as I feel sure about", false],
        ["c", "Whatever cash is left", false]] },
      { label: "What result counts as \"works\"?", opts: [
        ["a", "It makes money", false],
        ["b", "It feels right", false],
        ["c", "The average result per trade after costs is above zero in the kept-back period", true]] }
    ];
    var picks = [], sels = [];
    var f1 = L.row(body);
    parts.forEach(function (pt, i) {
      picks.push("");
      var options = [["", "Choose one"]].concat(pt.opts.map(function (o) { return [o[0], o[1]]; }));
      sels.push(L.select(f1, { label: pt.label, options: options, value: "", onChange: function (v) { picks[i] = v; check(); } }));
    });
    var res1 = L.el("div"); body.appendChild(res1);
    var live1 = liveLine(body);

    function check() {
      empty(res1);
      var chosen = 0, good = 0;
      parts.forEach(function (pt, i) {
        if (!picks[i]) return;
        chosen++;
        var o = pt.opts.filter(function (x) { return x[0] === picks[i]; })[0];
        var line = L.el("div", o[2] ? "cft-pos" : "cft-neg",
          (o[2] ? "Clear: " : "Vague: ") + pt.label + " " + (o[2] ? "Two people could follow this and get the same trade. A test can show it wrong." : "No number or check. A test could not show this wrong, so it cannot be tested yet."));
        res1.appendChild(line);
        if (o[2]) good++;
      });
      if (chosen < parts.length) live1.textContent = "You have answered " + chosen + " of " + parts.length + " questions. " + good + " are clear so far.";
      else if (good === parts.length) live1.textContent = "All " + parts.length + " answers are clear. This is now a hypothesis, a rule that can be wrong. A test can check it.";
      else live1.textContent = good + " of " + parts.length + " answers are clear. The rest are still feelings. Change them to rules with numbers or checks.";
    }
    check();

    // ---- part 2 ----
    var h2 = L.el("div", "cft-tx-b", "Part 2. Fix the pass rule before you look at the result");
    h2.style.marginTop = "14px";
    body.appendChild(h2);
    var MINTR = 30, locked = null;
    var f2 = L.row(body);
    var level = L.numberField(f2, { label: "Pass rule: the average result per trade after costs must be above this (Rs)", value: 0, step: 5, onInput: function () { part2(); } });
    var sTr = L.slider(f2, { label: "Trades in the kept-back period", min: 5, max: 120, step: 5, value: 60, fmt: function (v) { return v + " trades"; }, onInput: part2 });
    var sRes = L.slider(f2, { label: "Result of the test, per trade after costs", min: -100, max: 100, step: 5, value: -20, fmt: function (v) { return rs(v); }, onInput: part2 });
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var bLock = L.button(btns, "Lock the pass rule", function () {
      locked = level.get(); level.input.disabled = true; part2();
    });
    L.button(btns, "Change the rule anyway", function () {
      if (locked === null) return;
      level.input.disabled = false; part2();
    });
    L.button(btns, "Start again", function () {
      locked = null; level.input.disabled = false; level.set(0); sTr.set(60); sRes.set(-20); part2();
    });
    var out2 = L.el("div"); body.appendChild(out2);
    var live2 = liveLine(body);

    function verdictFor(lv) {
      var n = sTr.get(), r = sRes.get();
      if (n < MINTR) return "Inconclusive";
      return r > lv ? "Supported" : "Not supported";
    }
    function part2() {
      empty(out2);
      var cur = level.get(), n = sTr.get(), r = sRes.get();
      var changed = locked !== null && cur !== locked;
      var original = verdictFor(locked !== null ? locked : cur);
      var rows = [
        ["Pass rule", "Above " + rs(cur) + " per trade, with at least " + MINTR + " trades (an example number)"],
        ["Rule status", locked === null ? "Not locked yet. Lock it before you look at the result." : changed ? "Changed after the result was seen" : "Locked at " + rs(locked)],
        ["Result", rs(r) + " per trade over " + n + " trades"],
        ["Verdict under the original rule", original, true]
      ];
      if (changed) rows.push(["Verdict under the new rule (a different, untested idea)", verdictFor(cur)]);
      L.table(out2, rows);
      var msg;
      if (changed) msg = "You moved the rule after you saw the result. That makes a new idea that has not been tested. The first test still says: " + original.toLowerCase() + ".";
      else if (original === "Inconclusive") msg = "Inconclusive. " + n + " trades is below " + MINTR + ", too few to say much.";
      else if (original === "Supported") msg = "Supported. The idea survived this one test under its rules. That is weak evidence, not proof.";
      else msg = "Not supported. Drop the idea or write a new one. Do not move the rule to save it.";
      live2.textContent = msg;
    }
    part2();
    limitNote(body);
  };

  // ====================================================================
  // data-quality-check
  // ====================================================================
  var DQ_FILES = {
    guided: {
      label: "File 1 (guided exercise)",
      rows: [
        ["2026-03-02", 100, 102, 99, 101, 50000], ["2026-03-03", 101, 103, 100, 102, 60000],
        ["2026-03-03", 102, 104, 101, 103, 55000], ["2026-03-04", 103, 104, 101, 102, 0],
        ["2026-03-05", 130, 132, 128, 131, 90000], ["2026-03-06", 131, 130, 129, 132, 85000]]
    },
    worked: {
      label: "File 2 (worked example)",
      rows: [
        ["2026-03-02", 250, 254, 248, 252, 120000], ["2026-03-03", 252, 256, 250, 255, 98000],
        ["2026-03-04", 255, 257, 253, 254, 110000], ["2026-03-05", 255, 258, 252, 251, 105000],
        ["2026-03-06", 251, 253, 249, 252, 101000], ["2026-03-09", 252, 255, 251, 254, 99000]]
    },
    split: {
      label: "File 3 (a missing day and a split)",
      rows: [
        ["2026-03-09", 1000, 1012, 995, 1008, 40000], ["2026-03-10", 1008, 1015, 1001, 1010, 38000],
        ["2026-03-12", 1010, 1018, 1004, 1004, 36000], ["2026-03-13", 500, 506, 495, 502, 80000]],
      splitRow: 3
    }
  };
  function dqDate(s) { var a = s.split("-"); return Date.UTC(+a[0], +a[1] - 1, +a[2]); }
  function dqMissing(d0, d1) {
    var n = 0, d;
    for (d = d0 + 86400000; d < d1; d += 86400000) { var w = new Date(d).getUTCDay(); if (w !== 0 && w !== 6) n++; }
    return n;
  }
  function dqRun(file, splitNote) {
    var rows = file.rows, issues = [], i, r, pr;
    var checks = [
      { name: "Sorted dates", rows: [], text: "Each date comes after the one before." },
      { name: "Duplicate dates", rows: [], text: "No day appears twice." },
      { name: "Gaps in the dates", rows: [], text: "No trading day is missing." },
      { name: "Zero or negative prices", rows: [], text: "All prices are above zero." },
      { name: "High and low make sense (OHLC)", rows: [], text: "Every high is at or above the open and close, and every low is at or below them." },
      { name: "Jumps over 20%", rows: [], text: "No close-to-close move over 20%." },
      { name: "Zero volume", rows: [], text: "Shares traded on every day." }
    ];
    function add(ci, row, msg) { checks[ci].rows.push(row + 1); issues.push({ row: row + 1, ci: ci, msg: msg }); }
    for (i = 0; i < rows.length; i++) {
      r = rows[i]; pr = i > 0 ? rows[i - 1] : null;
      if (pr) {
        var d0 = dqDate(pr[0]), d1 = dqDate(r[0]);
        if (d1 < d0) add(0, i, "Row " + (i + 1) + " is dated before row " + i + ".");
        if (d1 === d0) { add(1, i - 1, "Rows " + i + " and " + (i + 1) + " both show " + r[0] + "."); add(1, i, ""); }
        if (d1 > d0) { var m = dqMissing(d0, d1); if (m > 0) add(2, i, m + " weekday(s) missing before row " + (i + 1) + ". Compare with the exchange holiday list."); }
      }
      if (r[1] <= 0 || r[2] <= 0 || r[3] <= 0 || r[4] <= 0) add(3, i, "Row " + (i + 1) + " has a price of zero or below.");
      if (r[2] < Math.max(r[1], r[4], r[3]) || r[3] > Math.min(r[1], r[4], r[2])) {
        add(4, i, "Row " + (i + 1) + ": the high " + r[2] + " is below the open " + r[1] + " or close " + r[4] + ", or the low is above them. Check it against the source.");
      }
      if (pr && pr[4] > 0) {
        var ch = (r[4] - pr[4]) / pr[4] * 100;
        if (Math.abs(ch) > 20) {
          var explained = splitNote && file.splitRow === i;
          if (!explained) add(5, i, "Row " + (i + 1) + ": the close moves " + sgn(ch, 1) + "% from the day before. Is there a flagged split? Ask the source. Do not delete the row on sight.");
          else checks[5].explained = "Row " + (i + 1) + " moved " + sgn(ch, 1) + "%, and the source flags a 1 for 2 split. This matches the split, so it is not an error. Use one price series only, adjusted or unadjusted.";
        }
      }
      if (r[5] === 0) add(6, i, "Row " + (i + 1) + " shows no shares traded. Check the day with the source before you use it.");
    }
    var bad = {};
    issues.forEach(function (x) { bad[x.row] = true; });
    return { checks: checks, issues: issues, bad: bad };
  }

  D["data-quality-check"] = function (p, host) {
    var key = L.S(p, "file", "guided");
    if (!DQ_FILES[key]) key = "guided";
    var marks = {}, splitNote = false;
    var b = L.box(host, "Check a file of old prices",
      "What to try: look at the table and tick any row that looks wrong. Press Check my answer. Then press Show the seven checks to see each problem and what to do next.");
    var body = b.body;
    var f = L.row(body);
    var sel = L.select(f, {
      label: "Price file", value: key,
      options: Object.keys(DQ_FILES).map(function (k) { return [k, DQ_FILES[k].label]; }),
      onChange: function (v) { key = v; marks = {}; splitNote = false; tg.set(false); syncTg(); draw(); fb.textContent = ""; checksDiv.textContent = ""; }
    });
    var tg = L.toggle(body, { label: "The source notes a 1 for 2 split on the last day", value: false, onChange: function (v) { splitNote = v; checksDiv.textContent = ""; fb.textContent = ""; } });
    function syncTg() { tg.el.style.display = DQ_FILES[key].splitRow !== undefined ? "" : "none"; }
    syncTg();
    var tabDiv = L.el("div"); body.appendChild(tabDiv);
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var fb = liveLine(body);
    var checksDiv = L.el("div"); body.appendChild(checksDiv);
    L.button(btns, "Check my answer", function () {
      var run = dqRun(DQ_FILES[key], splitNote), n = DQ_FILES[key].rows.length, i;
      var ok = [], missed = [], wrong = [];
      for (i = 1; i <= n; i++) {
        if (run.bad[i] && marks[i]) ok.push(i);
        else if (run.bad[i]) missed.push(i);
        else if (marks[i]) wrong.push(i);
      }
      var total = Object.keys(run.bad).length;
      var msg = "You found " + ok.length + " of " + total + " rows with a problem.";
      if (missed.length) msg += " Still missing: " + missed.length + " row(s). Look again at the dates, the volume, the highs and lows, and the size of price moves.";
      if (wrong.length) msg += " Row(s) " + wrong.join(", ") + " pass every check.";
      if (!missed.length && !wrong.length) msg += " That is all of them. Press Show the seven checks to read each problem.";
      fb.textContent = msg;
    });
    L.button(btns, "Show the seven checks", function () {
      var run = dqRun(DQ_FILES[key], splitNote);
      empty(checksDiv);
      var rows = run.checks.map(function (c) {
        return [c.name, c.rows.length ? "Problem in row(s) " + c.rows.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", ") : (c.explained ? "Explained" : "Passes")];
      });
      mkTable(checksDiv, ["Check", "Result"], rows);
      var seen = {};
      run.issues.forEach(function (x) {
        if (!x.msg || seen[x.msg]) return;
        seen[x.msg] = true;
        checksDiv.appendChild(L.el("div", "cft-neg", x.msg));
      });
      if (run.checks[5].explained) checksDiv.appendChild(L.el("div", "cft-pos", run.checks[5].explained));
      var clean = DQ_FILES[key].rows.length - Object.keys(run.bad).length;
      fb.textContent = Object.keys(run.bad).length + " row(s) need a question answered. " + clean + " row(s) pass every check. The checks find some problems, not all of them.";
    });
    L.button(btns, "Clear my ticks", function () { marks = {}; draw(); fb.textContent = ""; });
    L.note(body, "Made-up prices. Free data is not always complete or correct. Never assume you may share or sell a data file. The source sets its terms.");
    limitNote(body);

    function draw() {
      empty(tabDiv);
      var t = L.el("table", "cft-table"), tr = L.el("tr");
      ["Row", "Date", "Open (Rs)", "High (Rs)", "Low (Rs)", "Close (Rs)", "Volume", "Looks wrong?"].forEach(function (h) { tr.appendChild(L.el("th", null, h)); });
      t.appendChild(tr);
      DQ_FILES[key].rows.forEach(function (r, i) {
        var row = L.el("tr");
        row.appendChild(L.el("td", "cft-val", String(i + 1)));
        row.appendChild(L.el("td", "cft-val", r[0]));
        [1, 2, 3, 4].forEach(function (k) { row.appendChild(L.el("td", "cft-val", String(r[k]))); });
        row.appendChild(L.el("td", "cft-val", r[5].toLocaleString("en-IN")));
        var td = L.el("td", "cft-val"), cb = L.el("input");
        cb.type = "checkbox"; cb.checked = !!marks[i + 1];
        cb.setAttribute("aria-label", "Row " + (i + 1) + " looks wrong");
        cb.addEventListener("change", function () { marks[i + 1] = cb.checked; });
        td.appendChild(cb); row.appendChild(td);
        t.appendChild(row);
      });
      var w = L.el("div"); w.style.overflowX = "auto"; w.appendChild(t); tabDiv.appendChild(w);
    }
    draw();
    fb.textContent = "Tick the rows you think have a problem, then press Check my answer.";
  };

  // ====================================================================
  // lookahead-peek
  // ====================================================================
  D["lookahead-peek"] = function (p, host) {
    var N = 40, SHARES = L.P(p, "shares", 10), moves = [], shown = 0, an;
    var r = L.rng(L.P(p, "seed", 21)), i;
    for (i = 0; i < N; i++) moves.push(Math.round(r() * 24 - 8));
    var b = L.box(host, "The peek: same rules, two different fills",
      "What to try: press Play to run 40 made-up trades two ways. The peek run fills at the same close that gave the signal. The honest run fills at the next open. Then change the gap and see the difference.");
    var body = b.body;

    // picture of the two bars
    var pic = L.el("div"); body.appendChild(pic);
    var fields = L.row(body);
    var sGap = L.slider(fields, { label: "How much higher the next open is than the signal close", min: 0, max: 8, step: 1, value: L.P(p, "gap", 3), fmt: function (v) { return rs(v); }, onInput: function () { render(); } });
    var tPeek = L.toggle(body, { label: "Show the peek line", value: true, onChange: function () { render(); } });
    an = L.anim(body, {
      interval: 300, total: N,
      step: function (k) { shown = k + 1; render(); },
      reset: function () { shown = 0; render(); }
    });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var live = liveLine(body);

    function drawPic() {
      empty(pic);
      var g = frame(pic, 560, 150, "Two daily bars. The first closes at Rs 300. The second opens at Rs 303.");
      var gap = sGap.get(), sy = L.scale(288, 320, 135, 14);
      L.candle(g, 150, 40, sy, { o: 296, h: 301, l: 294, c: 300 });
      L.candle(g, 330, 40, sy, { o: 300 + gap, h: 308 + gap, l: 298 + gap, c: 305 + gap });
      g.line(170, sy(300), 440, sy(300), "cft-ln-d");
      g.line(350, sy(300 + gap), 440, sy(300 + gap), "cft-ln-d");
      g.text(150, 146, "Day of the signal", "cft-tx cft-tx-s", "middle");
      g.text(330, 146, "Next day", "cft-tx cft-tx-s", "middle");
      g.text(444, sy(300) + 3, "Peek fill " + rs(300) + " (not known until the close)", "cft-tx cft-tx-s");
      g.text(444, sy(300 + gap) + (gap === 0 ? 14 : 3), "Honest fill " + rs(300 + gap) + " (the next open)", "cft-tx cft-tx-s");
    }

    function render() {
      drawPic();
      var gap = sGap.get(), k, peek = [0], hon = [0], a = 0, c = 0;
      for (k = 0; k < N; k++) {
        a += moves[k] * SHARES; c += (moves[k] - gap) * SHARES;
        peek.push(a); hon.push(c);
      }
      var ext = L.extent(peek.concat(hon, [0]), 0.1);
      empty(chartDiv);
      var W = 560, H = 240, left = 56, g = frame(chartDiv, W, H, "Two lines of running total result over 40 made-up trades: the peek run and the honest run");
      var sx = L.scale(0, N, left, W - 10), sy = L.scale(ext[0], ext[1], H - 24, 14);
      yAxis(g, sy, ext[0], ext[1], left, W - 10, function (v) { return kfmt(v); });
      g.line(left, sy(0), W - 10, sy(0), "cft-ln");
      g.text(W - 10, H - 8, N + " trades", "cft-tx cft-tx-s", "end");
      var pa = [], ph = [];
      for (k = 0; k <= shown; k++) { pa.push([sx(k), sy(peek[k])]); ph.push([sx(k), sy(hon[k])]); }
      if (tPeek.get() && shown > 0) { g.path(pa, "cft-pl-o"); g.circle(sx(shown), sy(peek[shown]), 4, "cft-dot"); }
      if (shown > 0) { g.path(ph, "cft-pl"); g.circle(sx(shown), sy(hon[shown]), 4, "cft-dot-b"); }
      g.text(left + 4, 24, "Orange: peek run. Blue: honest run.", "cft-tx cft-tx-s");

      var per = SHARES * gap;
      if (shown === 0) live.textContent = "Press Play or Step. Each trade buys " + SHARES + " shares. The honest fill costs " + rs(gap) + " more per share, so " + rs(per) + " more per trade.";
      else live.textContent = "After " + shown + " trades: peek run " + rs(peek[shown]) + ", honest run " + rs(hon[shown]) + ". The peek run looks " + rs(peek[shown] - hon[shown]) +
        " better. Each trade: " + SHARES + " x " + rs(gap) + " = " + rs(per) + ". Over 40 trades that is " + rs(per * N) + ". The leak, not the idea, made the difference.";
    }
    render();
    limitNote(body);

    // spot the leak
    var h = L.el("div", "cft-tx-b", "Spot the leak. Which line uses information that did not exist yet?");
    h.style.marginTop = "14px"; body.appendChild(h);
    var lines = [
      "1. Calculate the 20-day average close, using closes up to and including today.",
      "2. Calculate the median close across all years in the data, and use it as the level to beat.",
      "3. Buy at the next day's open when today's close is above the 20-day average close.",
      "4. Sell at the next day's open when today's close is below the 20-day average close."
    ];
    lines.forEach(function (t) { L.note(body, t); });
    var fbk = L.el("div");
    var lr = L.el("div", "cft-btn-row"); body.appendChild(lr);
    lines.forEach(function (t, idx) {
      var bt = L.button(lr, "Line " + (idx + 1), function () {
        empty(fbk);
        if (idx === 1) L.feedback(fbk, true, "Yes. The median uses all years, including years after the signal. A fix: use the median of all closes up to and including today, worked out again each day.");
        else L.feedback(fbk, false, "Line " + (idx + 1) + " only uses data known at the close of that day. Look for a number worked out over all the data.");
      });
      bt.title = t;
    });
    body.appendChild(fbk);
  };

  // ====================================================================
  // survivorship-demo
  // ====================================================================
  D["survivorship-demo"] = function (p, host) {
    var stocks = [
      { n: "A", v: 50, inc: true, drop: false }, { n: "B", v: 20, inc: true, drop: false },
      { n: "C", v: -100, inc: true, drop: true }, { n: "D", v: -40, inc: true, drop: true },
      { n: "E", v: 10, inc: false, drop: false }
    ];
    var STAKE = 10000, k = 0, an, opts;
    var b = L.box(host, "Who is missing from the list?",
      "What to try: press Play. The stocks that failed leave the list one by one, and the average rises. Then add stock E or change a result and compare the two averages.");
    var body = b.body;
    var ctl = L.el("div"); body.appendChild(ctl);
    var ui = [];
    stocks.forEach(function (s, idx) {
      var line = L.row(ctl);
      var nf = L.numberField(line, { label: "Stock " + s.n + ": two-year result (%)", value: s.v, step: 5, onInput: function (v) { s.v = v; render(); } });
      var t1 = L.toggle(line, { label: "In the test", value: s.inc, onChange: function (v) { s.inc = v; render(); } });
      var t2 = L.toggle(line, { label: "Left today's list (delisted or stopped trading)", value: s.drop, onChange: function (v) { s.drop = v; render(); } });
      ui.push([nf, t1, t2]);
    });
    opts = {
      interval: 1100, total: 2,
      step: function (i) { k = i + 1; render(); },
      reset: function () { k = 0; render(); }
    };
    an = L.anim(body, opts);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var tabDiv = L.el("div"); body.appendChild(tabDiv);
    var live = liveLine(body);
    L.note(body, "Made-up results. A test list built from today's companies leaves out the ones that dropped away, so it looks better than the market really was.");
    limitNote(body);

    function avg(arr) { return arr.length ? arr.reduce(function (a, s) { return a + s.v; }, 0) / arr.length : 0; }
    function render() {
      var inc = stocks.filter(function (s) { return s.inc; });
      var dropped = inc.filter(function (s) { return s.drop; });
      opts.total = Math.max(1, dropped.length);
      if (k > opts.total) k = opts.total;
      var removed = dropped.slice(0, k);
      var current = inc.filter(function (s) { return removed.indexOf(s) < 0; });
      var surv = inc.filter(function (s) { return !s.drop; });
      var aFull = avg(inc), aSurv = avg(surv), aNow = avg(current);

      empty(chartDiv);
      var W = 560, H = 230, left = 44, lo = -110, hi = Math.max(70, Math.max.apply(null, stocks.map(function (s) { return s.v; })) + 15);
      var g = frame(chartDiv, W, H, "Bars showing the two-year result of each stock in the test");
      var sy = L.scale(lo, hi, H - 26, 14);
      yAxis(g, sy, lo, hi, left, W - 10, function (v) { return Math.round(v) + "%"; });
      g.line(left, sy(0), W - 10, sy(0), "cft-ln");
      var bw = (W - left - 20) / stocks.length;
      stocks.forEach(function (s, idx) {
        var x = left + 10 + idx * bw + bw * 0.15, w = bw * 0.7;
        var y0 = sy(0), y1 = sy(s.v), top = Math.min(y0, y1), h = Math.abs(y1 - y0);
        var visible = s.inc && removed.indexOf(s) < 0;
        cell(g, x, top, w, Math.max(1, h), s.v >= 0 ? "var(--cft-up)" : "var(--cft-down)", visible ? 0.85 : (s.inc ? 0.18 : 0.08));
        g.text(x + w / 2, H - 8, s.n + (s.inc ? (s.drop ? " (left)" : "") : " (off)"), "cft-tx cft-tx-s", "middle");
        g.text(x + w / 2, s.v >= 0 ? top - 4 : top + h + 11, sgn(s.v, 0) + "%", "cft-tx cft-tx-s", "middle");
      });

      empty(tabDiv);
      L.table(tabDiv, [
        ["List the test sees right now (" + current.length + " stocks)", sgn(aNow, 1) + "%"],
        ["Survivors only (" + surv.length + " stocks)", sgn(aSurv, 1) + "%, " + (aSurv >= 0 ? rs(STAKE * aSurv / 100) + " gain" : rs(-STAKE * aSurv / 100) + " loss") + " on " + rs(STAKE)],
        ["Full list (" + inc.length + " stocks)", sgn(aFull, 1) + "%, " + (aFull >= 0 ? rs(STAKE * aFull / 100) + " gain" : rs(-STAKE * aFull / 100) + " loss") + " on " + rs(STAKE), true],
        ["Gap between them", (aSurv - aFull).toFixed(1) + " percentage points"]
      ]);
      if (!inc.length) live.textContent = "Switch at least one stock into the test.";
      else live.textContent = "Survivors-only test: " + sgn(aSurv, 1) + "%. Full test: " + sgn(aFull, 1) + "%. Same stocks, only the list differs. The gap is " + (aSurv - aFull).toFixed(1) + " percentage points" +
        (k > 0 ? ". Now showing the list after " + k + " failed stock(s) left: " + sgn(aNow, 1) + "%." : ".");
    }
    render();
  };

  // ====================================================================
  // overfit-demo
  // ====================================================================
  D["overfit-demo"] = function (p, host) {
    var LB = [10, 20, 30, 40, 55], AT = [1.5, 2, 2.5, 3], NC = 20, CAP = 50000;
    var rr = L.rng(L.P(p, "seed", 5)), ins = [], oos = [], i, order = [], j, t;
    var BEST = 10;
    for (i = 0; i < NC; i++) {
      ins.push(Math.round((1200 + (rr() - 0.35) * 8000) / 100) * 100);
      oos.push(Math.round(((rr() - 0.5) * 7000) / 100) * 100);
    }
    ins[BEST] = 12000; oos[BEST] = -3000;
    for (i = 0; i < NC; i++) order.push(i);
    for (i = NC - 1; i > 0; i--) { j = Math.floor(rr() * (i + 1)); t = order[i]; order[i] = order[j]; order[j] = t; }
    j = order.indexOf(BEST); order.splice(j, 1); order.splice(13, 0, BEST);

    var tried = NC, reveal = false, revealAll = false, an, sTried;
    var b = L.box(host, "Try many settings and keep the best",
      "What to try: press Play to try the settings one at a time. Watch the best result on the old data climb. Then switch on the check on new data and see how the chosen setting does.");
    var body = b.body;
    var f = L.row(body);
    sTried = L.slider(f, { label: "How many settings you try", min: 0, max: NC, step: 1, value: NC, fmt: function (v) { return v + " of " + NC; }, onInput: function (v) { tried = v; an.setIndex(v); render(); } });
    var tg = L.el("div"); body.appendChild(tg);
    L.toggle(tg, { label: "Check the best setting on new data", value: false, onChange: function (v) { reveal = v; render(); } });
    L.toggle(tg, { label: "Show new data for every setting", value: false, onChange: function (v) { revealAll = v; render(); } });
    an = L.anim(body, {
      interval: 450, total: NC,
      step: function (k) { tried = k + 1; sTried.set(tried); render(); },
      reset: function () { tried = 0; sTried.set(0); render(); }
    });
    an.setIndex(NC);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var live = liveLine(body);

    function best() {
      var bi = -1, k;
      for (k = 0; k < tried; k++) if (bi < 0 || ins[order[k]] > ins[bi]) bi = order[k];
      return bi;
    }
    function tone(v, scale) {
      var a = Math.min(1, Math.abs(v) / scale) * 0.75 + 0.12;
      return [v >= 0 ? "var(--cft-up)" : "var(--cft-down)", a];
    }
    function render() {
      var bi = best(), isTried = {}, k;
      for (k = 0; k < tried; k++) isTried[order[k]] = true;
      empty(chartDiv);
      var W = 640, H = 262, cw = 54, ch = 34, y0 = 52;
      var g = frame(chartDiv, W, H, "Two grids of results for 20 settings. Left: old data used to choose. Right: new data kept back.");
      function grid(x0, title, which) {
        g.text(x0 + cw * 2, 16, title, "cft-tx cft-tx-b", "middle");
        AT.forEach(function (a, c) { g.text(x0 + 46 + c * cw + cw / 2 - 2, y0 - 6, "x" + a, "cft-tx cft-tx-s", "middle"); });
        LB.forEach(function (l, r) { g.text(x0 + 40, y0 + r * ch + ch / 2 + 3, l + " days", "cft-tx cft-tx-s", "end"); });
        var r, c;
        for (r = 0; r < LB.length; r++) for (c = 0; c < AT.length; c++) {
          var idx = r * AT.length + c, x = x0 + 46 + c * cw, y = y0 + r * ch, v = which === 0 ? ins[idx] : oos[idx];
          var show = isTried[idx] && (which === 0 || revealAll || (reveal && idx === bi));
          if (show) { var tn = tone(v, 9000); cell(g, x + 1, y + 1, cw - 2, ch - 2, tn[0], tn[1]); g.text(x + cw / 2, y + ch / 2 + 3, kfmt(v), "cft-tx cft-tx-s", "middle"); }
          else {
            cell(g, x + 1, y + 1, cw - 2, ch - 2, "var(--cft-grey)", isTried[idx] ? 0.35 : 0.12);
            if (isTried[idx]) g.text(x + cw / 2, y + ch / 2 + 3, "?", "cft-tx cft-tx-s", "middle");
          }
          if (idx === bi) g.rect(x + 1, y + 1, cw - 2, ch - 2, "cft-hl", { fill: "none" });
        }
      }
      grid(0, "Old data (used to choose)", 0);
      grid(330, "New data (kept back)", 1);
      g.text(0, H - 6, "Rows: days in the average. Columns: stop distance in times ATR. Numbers: result in Rs on Rs 50,000.", "cft-tx cft-tx-s");

      if (tried === 0) { live.textContent = "No setting tried yet. Press Play. Each step tries one more setting."; return; }
      var a = ins[bi], o = oos[bi];
      var msg = "You tried " + tried + " setting(s). Best on old data: " + LB[Math.floor(bi / AT.length)] + " days, stop x" + AT[bi % AT.length] + ", result " + rs(a) + " (" + L.pct(a / CAP * 100, 0) + " of " + rs(CAP) + ").";
      if (reveal) msg += " On new data the same setting made " + rs(o) + " (" + L.pct(o / CAP * 100, 0) + ").";
      else msg += " Switch on the check on new data to see how it does.";
      msg += " Luck check: " + tried + " x 0.05 = " + (tried * 0.05).toFixed(2) + " lucky results expected.";
      live.textContent = msg;
    }
    render();

    // count calculator
    var h = L.el("div", "cft-tx-b", "Count your tries");
    h.style.marginTop = "14px"; body.appendChild(h);
    var f2 = L.row(body), a1, a2, a3, out = L.el("p", "cft-live");
    out.style.fontWeight = "600"; out.setAttribute("aria-live", "polite");
    function calc() {
      var n = Math.max(0, Math.round(a1.get())) * Math.max(0, Math.round(a2.get())) * Math.max(0, Math.round(a3.get()));
      out.textContent = "Combinations: " + Math.round(a1.get()) + " x " + Math.round(a2.get()) + " x " + Math.round(a3.get()) + " = " + n + ". With a 5% chance of looking good by luck, about " + (n * 0.05).toFixed(1) + " lucky results are expected.";
    }
    a1 = L.numberField(f2, { label: "Lookbacks tried", value: 6, step: 1, onInput: calc });
    a2 = L.numberField(f2, { label: "ATR multiples tried", value: 5, step: 1, onInput: calc });
    a3 = L.numberField(f2, { label: "Filters tried", value: 3, step: 1, onInput: calc });
    body.appendChild(out);
    calc();
    L.note(body, "Made-up numbers. Keep a log with one row for every variant, even the ones you drop. The number of rows is the number of tries.");
    limitNote(body);
  };

  // ====================================================================
  // walk-forward-demo
  // ====================================================================
  D["walk-forward-demo"] = function (p, host) {
    var Y0 = L.P(p, "start", 2016), NY = L.P(p, "years", 10);
    var mode = L.S(p, "mode", "walk");
    if (mode !== "split" && mode !== "shuffle") mode = "walk";
    var shown = 0, peek = false, an, opts;
    var b = L.box(host, "Keep some years aside",
      "What to try: press Play to roll the training and test windows forward. Blue years choose the settings. Orange years only test them. Then try the other ways to split, and switch on the peek.");
    var body = b.body;
    var f = L.row(body);
    var selM = L.select(f, {
      label: "How to split the years", value: mode,
      options: [["walk", "Walk-forward (rolling windows)"], ["split", "One split by time (70 and 30)"], ["shuffle", "Random shuffle (the wrong way)"]],
      onChange: function (v) { mode = v; syncSl(); an.reset(); }
    });
    var sTr = L.slider(f, { label: "Training years", min: 1, max: 6, step: 1, value: 3, fmt: function (v) { return v + (v === 1 ? " year" : " years"); }, onInput: function () { an.reset(); } });
    var sTe = L.slider(f, { label: "Test years", min: 1, max: 3, step: 1, value: 1, fmt: function (v) { return v + (v === 1 ? " year" : " years"); }, onInput: function () { an.reset(); } });
    var sSt = L.slider(f, { label: "Roll forward by", min: 1, max: 3, step: 1, value: 1, fmt: function (v) { return v + (v === 1 ? " year" : " years"); }, onInput: function () { an.reset(); } });
    function syncSl() { var d = mode === "walk" ? "" : "none"; sTr.el.style.display = d; sTe.el.style.display = d; sSt.el.style.display = d; }
    L.toggle(body, { label: "I look at the test years and change the rule", value: false, onChange: function (v) { peek = v; render(); } });
    opts = {
      interval: 900, total: 1,
      step: function (i) { shown = i + 1; render(); },
      reset: function () { shown = 0; render(); }
    };
    an = L.anim(body, opts);
    syncSl();
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var live = liveLine(body);
    L.note(body, "Made-up years and no prices. A passed test on kept-back years is one more piece of evidence, not proof.");
    limitNote(body);

    function windows() {
      var tr = sTr.get(), te = sTe.get(), st = sSt.get(), out = [], s;
      for (s = 0; s + tr + te <= NY; s += st) out.push({ tr0: s, tr1: s + tr - 1, te0: s + tr, te1: s + tr + te - 1 });
      return out;
    }
    function yr(i) { return Y0 + i; }
    function span(a, b2) { return a === b2 ? String(yr(a)) : yr(a) + " to " + yr(b2); }
    function render() {
      var win = windows(), rowsData = [], msg;
      var BLUE = "var(--cft-blue)", ORG = "var(--cft-orange)", GREY = "var(--cft-grey)";
      if (mode === "walk") { opts.total = Math.max(1, win.length); if (shown > opts.total) shown = opts.total; }
      else opts.total = 1;
      var left = 12, W = 640, cw = (W - left - 150) / NY, rh = 24, top = 30;
      var nRows = mode === "walk" ? Math.max(1, win.length) + 1 : 1;
      var H = top + nRows * (rh + 4) + 14;
      empty(chartDiv);
      var g = frame(chartDiv, W, H, "A timeline of years. Blue years are for training. Orange years are for testing.");
      var i;
      for (i = 0; i < NY; i++) g.text(left + i * cw + cw / 2, 20, String(yr(i)), "cft-tx cft-tx-s", "middle");
      function bar(row, a, b2, color, label) {
        var y = top + row * (rh + 4);
        cell(g, left + a * cw + 1, y, (b2 - a + 1) * cw - 2, rh, color, 0.8);
        if (label) g.text(left + (a + b2 + 1) / 2 * cw, y + rh / 2 + 3, label, "cft-tx cft-tx-s", "middle");
      }
      if (mode === "walk") {
        var joined = {}, jMin = 99, jMax = -1;
        win.forEach(function (w, r) {
          var y = top + r * (rh + 4);
          g.text(left + NY * cw + 8, y + rh / 2 + 3, "Run " + (r + 1), "cft-tx cft-tx-s");
          if (r >= shown) { cell(g, left, y, NY * cw, rh, GREY, 0.08); return; }
          bar(r, w.tr0, w.tr1, BLUE, "train");
          bar(r, w.te0, w.te1, peek ? GREY : ORG, peek ? "used" : "test");
          for (i = w.te0; i <= w.te1; i++) { joined[i] = true; jMin = Math.min(jMin, i); jMax = Math.max(jMax, i); }
        });
        var jr = win.length;
        g.text(left + NY * cw + 8, top + jr * (rh + 4) + rh / 2 + 3, "Joined results", "cft-tx cft-tx-s");
        for (i = 0; i < NY; i++) if (joined[i]) cell(g, left + i * cw + 1, top + jr * (rh + 4), cw - 2, rh, peek ? GREY : ORG, 0.8);
        if (shown === 0) msg = "No window yet. There will be " + win.length + " windows. Press Play or Step.";
        else {
          var w2 = win[shown - 1];
          msg = "Run " + shown + " of " + win.length + ": train " + span(w2.tr0, w2.tr1) + ", test " + span(w2.te0, w2.te1) + ". Joined test results so far cover " + span(jMin, jMax) + ".";
          if (shown === win.length) msg += " That is " + win.length + " windows.";
        }
        if (peek) msg += " You used the test years to change the rule, so they are in-sample again. They no longer test the rule.";
      } else if (mode === "split") {
        var cut = Math.round(NY * 0.7);
        bar(0, 0, cut - 1, BLUE, "in-sample " + span(0, cut - 1));
        bar(0, cut, NY - 1, peek ? GREY : ORG, (peek ? "used " : "test ") + span(cut, NY - 1));
        msg = "Cut by time: the first " + cut + " years (" + span(0, cut - 1) + ") choose the settings. The last " + (NY - cut) + " years (" + span(cut, NY - 1) + ") test once. " + cut + " of " + NY + " years is " + Math.round(cut / NY * 100) + " percent.";
        if (peek) msg += " You used the test years to change the rule, so they are in-sample again.";
      } else {
        var testSet = { 1: true, 4: true, 8: true }, leak = 0, first = 99;
        for (i = 0; i < NY; i++) if (testSet[i]) { first = Math.min(first, i); }
        for (i = 0; i < NY; i++) {
          var isTest = !!testSet[i];
          if (!isTest && i > first) leak++;
          cell(g, left + i * cw + 1, top, cw - 2, rh, isTest ? (peek ? GREY : ORG) : BLUE, 0.8);
          g.text(left + i * cw + cw / 2, top + rh / 2 + 3, isTest ? "test" : "train", "cft-tx cft-tx-s", "middle");
        }
        msg = "Years picked at random. " + leak + " training years come after the first test year (" + yr(first) + "). The training learns from prices that come after the test days. This leaks the future into the past. The test is less honest, not fairer.";
      }
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // monte-carlo-shuffle
  // ====================================================================
  D["monte-carlo-shuffle"] = function (p, host) {
    var CAPITAL = 50000, BATCH = 10, STEPS = 100, KEEP = 25;
    var rng, original = [], stats = [], paths = [], ranRuns = 0, started = false, curPath = null, an, opts;
    var b = L.box(host, "Shuffle the order of the same trades",
      "What to try: press Play. Each step shuffles the same trades into new orders. The total never changes, but the fall from a peak and the longest losing run do. Read the table with the percentiles.");
    var body = b.body;
    var f = L.row(body);
    var sW = L.slider(f, { label: "Win rate", min: 10, max: 70, step: 5, value: L.P(p, "winRate", 35), fmt: function (v) { return v + "%"; }, onInput: reset });
    var sA = L.slider(f, { label: "Average win", min: 1, max: 4, step: 0.5, value: L.P(p, "avgWin", 2), fmt: function (v) { return v + "R"; }, onInput: reset });
    var sN = L.slider(f, { label: "Number of trades", min: 20, max: 100, step: 10, value: L.P(p, "trades", 40), fmt: function (v) { return v + " trades"; }, onInput: reset });
    var sR = L.slider(f, { label: "Risk per trade (1R)", min: 200, max: 2000, step: 100, value: L.P(p, "R", 500), fmt: function (v) { return rs(v); }, onInput: reset });
    var fRuin = L.numberField(f, { label: "Ruin level: account value you chose before the run (Rs)", value: L.P(p, "ruin", 25000), step: 1000, onInput: function () { } });
    opts = {
      interval: 120, total: STEPS,
      step: function () { doBatch(); },
      reset: function () { reset(); }
    };
    an = L.anim(body, opts);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var histDiv = L.el("div"); body.appendChild(histDiv);
    var tabDiv = L.el("div"); body.appendChild(tabDiv);
    var live = liveLine(body);
    var calc = L.el("p", "cft-note"); body.appendChild(calc);
    L.note(body, "Made-up trades. The test treats each trade as independent, but real losses often cluster, so real streaks can be longer. The result is a range of paths for the same trades. It is not a forecast of your next drawdown.");
    limitNote(body);

    function makeTrades() {
      var n = sN.get(), nw = Math.round(n * sW.get() / 100), R = sR.get(), aw = sA.get(), arr = [], i;
      for (i = 0; i < n; i++) arr.push(i < nw ? aw * R : -R);
      return arr;
    }
    function shuffle(arr, rnd) {
      var a = arr.slice(), i, j, t;
      for (i = a.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    function analyse(trades) {
      var eq = CAPITAL, peak = CAPITAL, dd = 0, run = 0, streak = 0, minEq = CAPITAL, path = [CAPITAL], i;
      for (i = 0; i < trades.length; i++) {
        eq += trades[i]; path.push(eq);
        if (eq > peak) peak = eq;
        if (peak - eq > dd) dd = peak - eq;
        if (eq < minEq) minEq = eq;
        if (trades[i] < 0) { run++; if (run > streak) streak = run; } else run = 0;
      }
      return { dd: dd, streak: streak, minEq: minEq, path: path, end: eq };
    }
    function pctile(arr, q) {
      var s = arr.slice().sort(function (a, c) { return a - c; });
      return s[Math.floor(q / 100 * (s.length - 1))];
    }
    function reset() {
      rng = L.rng(2024);
      var base = makeTrades();
      original = analyse(shuffle(base, L.rng(77)));
      stats = []; paths = []; ranRuns = 0; started = false; curPath = null;
      fRuin.input.disabled = false;
      render();
    }
    function doBatch() {
      var base = makeTrades(), k, a;
      started = true; fRuin.input.disabled = true;
      for (k = 0; k < BATCH; k++) {
        a = analyse(shuffle(base, rng));
        stats.push(a); paths.push(a.path); curPath = a.path;
        if (paths.length > KEEP) paths.shift();
      }
      ranRuns = stats.length;
      render();
    }
    function render() {
      var n = sN.get(), R = sR.get(), W = 560, H = 240, left = 56, ruin = fRuin.get();
      empty(chartDiv); empty(histDiv); empty(tabDiv);
      var all = [CAPITAL, ruin].concat(original.path);
      paths.forEach(function (pt) { all = all.concat(pt); });
      var ext = L.extent(all, 0.08);
      var g = frame(chartDiv, W, H, "Account value paths for the same trades in many shuffled orders");
      var sx = L.scale(0, n, left, W - 10), sy = L.scale(ext[0], ext[1], H - 22, 12);
      yAxis(g, sy, ext[0], ext[1], left, W - 10, function (v) { return kfmt(v); });
      g.line(left, sy(ruin), W - 10, sy(ruin), "cft-ln-hi");
      g.text(W - 12, sy(ruin) - 4, "Ruin level " + rs(ruin), "cft-tx cft-tx-s", "end");
      function toPts(pt) { return pt.map(function (v, i) { return [sx(i), sy(v)]; }); }
      paths.forEach(function (pt) { var e = g.path(toPts(pt), "cft-pl"); if (e) e.setAttribute("style", "opacity:0.18;stroke-width:1"); });
      if (curPath) g.path(toPts(curPath), "cft-pl-g");
      g.path(toPts(original.path), "cft-pl-o");
      g.text(left + 4, 22, "Orange: the original order. Green: the newest shuffle. Grey: earlier shuffles.", "cft-tx cft-tx-s");
      g.text(W - 10, H - 6, n + " trades", "cft-tx cft-tx-s", "end");

      var m = ranRuns;
      if (m > 0) {
        var dds = stats.map(function (s) { return s.dd; }), sts = stats.map(function (s) { return s.streak; });
        var mx = Math.max.apply(null, dds) || 1, bins = 10, cnt = [], i;
        for (i = 0; i < bins; i++) cnt.push(0);
        dds.forEach(function (d) { cnt[Math.min(bins - 1, Math.floor(d / mx * bins))]++; });
        var cm = Math.max.apply(null, cnt) || 1;
        var hg = frame(histDiv, W, 150, "Histogram of the largest fall from a peak across all shuffled runs");
        var hx = L.scale(0, mx, left, W - 14), bwid = (W - 14 - left) / bins;
        cnt.forEach(function (c, k2) { var hh = 100 * c / cm; cell(hg, left + k2 * bwid + 1, 118 - hh, bwid - 2, hh, "var(--cft-blue)", 0.7); });
        hg.line(left, 118, W - 14, 118, "cft-ln");
        [[5, "5th"], [50, "50th"], [95, "95th"]].forEach(function (q) {
          var v = pctile(dds, q[0]), x = hx(v);
          hg.line(x, 14, x, 118, "cft-ln-hi");
          hg.text(x, 11, q[1], "cft-tx cft-tx-s", "middle");
        });
        hg.text(left, 140, "0", "cft-tx cft-tx-s", "middle");
        hg.text(W - 14, 140, rs(mx) + " largest fall from a peak", "cft-tx cft-tx-s", "end");

        var ruined = stats.filter(function (s) { return s.minEq <= ruin; }).length;
        var rows = [5, 50, 95].map(function (q) {
          var d = pctile(dds, q);
          return [q + "th", rs(d) + " (" + L.pct(d / CAPITAL * 100, 1) + " of capital)", String(pctile(sts, q))];
        });
        mkTable(tabDiv, ["Percentile", "Largest fall from a peak (Rs)", "Longest losing streak (trades)"], rows);
        L.table(tabDiv, [
          ["Every shuffle ends at", rs(stats[0].end) + " (same trades, same total)"],
          ["Your original order", "fall " + rs(original.dd) + ", longest losing streak " + original.streak],
          ["Chance the account touches the ruin level " + rs(ruin), L.pct(ruined / m * 100, 1)]
        ]);
        live.textContent = "After " + m + " shuffles: in 95 runs out of 100 the largest fall was " + rs(pctile(dds, 95)) + " or less. About 5 in 100 were worse. The longest losing streak in the 95th row is " + pctile(sts, 95) + " trades.";
      } else {
        L.note(tabDiv, "The percentile table fills in as the shuffles run.");
        live.textContent = "Press Play or Step. Each step makes " + BATCH + " new orders of the same " + n + " trades. Your original order has a fall of " + rs(original.dd) + ".";
      }
      var w = sW.get() / 100, five = Math.pow(1 - w, 5);
      var exp = w * sA.get() - (1 - w);
      calc.textContent = "Expectancy per trade: " + exp.toFixed(2) + "R, which is " + rs(exp * R) + ". The chance of five losses in a row from a given trade is " + (1 - w).toFixed(2) + " to the power of 5, which is " + L.pct(five * 100, 1) + ". Five losses cost " + rs(5 * R) + ", which is " + L.pct(5 * R / CAPITAL * 100, 0) + " of capital. Shuffling does not change the expectancy.";
    }
    reset();
  };

  // ====================================================================
  // validation-verdict
  // ====================================================================
  var VV_ITEMS = [
    "Costs are on in the run", "The held-out period was used once", "The look-ahead demo was run",
    "The survivorship demo was run", "The number of trials is recorded", "The Monte Carlo run is done", "The sample size is stated"
  ];
  D["validation-verdict"] = function (p, host) {
    var b = L.box(host, "Write a verdict the evidence supports",
      "What to try: load the worked example, then change the numbers or tick the checklist. See which verdict the written rules give and why. Try to reach each of the three verdicts.");
    var body = b.body;
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var f = L.row(body);
    var sIs = L.slider(f, { label: "In-sample expectancy", min: -0.5, max: 1, step: 0.05, value: L.P(p, "inSample", 0.4), fmt: function (v) { return sgn(v, 2) + "R"; }, onInput: update });
    var sOos = L.slider(f, { label: "Out-of-sample expectancy after costs", min: -0.5, max: 0.5, step: 0.05, value: L.P(p, "outSample", 0.05), fmt: function (v) { return sgn(v, 2) + "R"; }, onInput: update });
    var sTr = L.slider(f, { label: "Out-of-sample trades", min: 5, max: 120, step: 1, value: L.P(p, "trades", 18), fmt: function (v) { return v + " trades"; }, onInput: update });
    body.appendChild(L.el("div", "cft-tx-b", "The seven-item checklist (tick only what you can show evidence for)"));
    var done = [1, 0, 0, 0, 0, 0, 1], tgs = [];
    var cl = L.el("div"); body.appendChild(cl);
    VV_ITEMS.forEach(function (t, i) {
      tgs.push(L.toggle(cl, { label: (i + 1) + ". " + t + ": done", value: !!done[i], onChange: update }));
    });
    function load(is, oos, tr, d) {
      sIs.set(is); sOos.set(oos); sTr.set(tr);
      d.forEach(function (v, i) { tgs[i].set(!!v); });
      update();
    }
    L.button(btns, "Worked example (18 trades)", function () { load(0.4, 0.05, 18, [1, 0, 0, 0, 0, 0, 1]); });
    L.button(btns, "Second memo (35 trades, negative)", function () { load(0.3, -0.1, 35, [1, 0, 0, 0, 0, 0, 1]); });
    L.button(btns, "Everything passes (made up)", function () { load(0.4, 0.3, 60, [1, 1, 1, 1, 1, 1, 1]); });
    var card = L.el("div", "cft-screen"); body.appendChild(card);
    var live = liveLine(body);
    L.note(body, "The written rules in this demo: at least 30 out-of-sample trades, an out-of-sample result above zero after costs, an edge that still stays above zero if costs rise by 0.05R, and all seven checklist items done. The 30 and the 0.05R are example numbers.");
    L.note(body, "Validated for further forward testing does not mean profitable, and it does not mean ready for real money. Nothing here supports using real money.");
    limitNote(body);

    function update() {
      var is = r2(sIs.get()), oos = r2(sOos.get()), n = sTr.get(), reasons = [], v;
      var miss = tgs.filter(function (t) { return !t.get(); }).length;
      var few = n < 30, neg = oos <= 0, thin = oos > 0 && r2(oos - 0.05) <= 0;
      if (few) reasons.push("Only " + n + " out-of-sample trades. That is below the 30-trade threshold, so the sample is too small to read.");
      if (is > 0 && neg) reasons.push("In-sample and out-of-sample results disagree. The out-of-sample result decides.");
      if (neg && !few) reasons.push("The out-of-sample expectancy after costs is " + sgn(oos, 2) + "R, not above zero. It fails the written criteria.");
      if (thin) reasons.push("The out-of-sample edge is small, " + sgn(oos, 2) + "R. A rise in costs of 0.05R would erase it.");
      if (miss > 0) reasons.push(miss + " of 7 checklist items are not done. They stop a write-up from calling the result validated.");
      if (few) v = "Inconclusive";
      else if (neg) v = "Not validated";
      else if (thin || miss > 0) v = "Inconclusive";
      else v = "Validated for further forward testing";
      empty(card);
      var t = L.el("div", "cft-big", "Verdict: " + v);
      card.appendChild(t);
      if (reasons.length) {
        card.appendChild(L.el("div", "cft-tx-b", "Reasons"));
        var ul = L.el("ul");
        reasons.forEach(function (r) { ul.appendChild(L.el("li", null, r)); });
        card.appendChild(ul);
      } else card.appendChild(L.el("div", null, "Every written rule is met. This means the rule is worth testing forward. It does not mean it is profitable."));
      card.appendChild(L.el("div", "cft-tx-b", "Memo"));
      card.appendChild(L.el("div", null, "Hypothetical result on Rs 50,000 of capital. In-sample expectancy " + sgn(is, 2) + "R. Out-of-sample expectancy after costs " + sgn(oos, 2) + "R across " + n +
        " trades. Verdict: " + v.toLowerCase() + ". Checklist: " + (7 - miss) + " of 7 items done."));
      live.textContent = "Verdict: " + v + ". " + (7 - miss) + " of 7 checklist items done. " + n + " out-of-sample trades. Out-of-sample " + sgn(oos, 2) + "R after costs.";
    }
    update();
  };
})();
