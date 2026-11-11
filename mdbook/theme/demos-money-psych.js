(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  // Demos for: start-here (what trading is, capital-first rules), money and math
  // (taxes, reward-to-risk, overtrading, exposure) and psychology (fear and greed, FOMO and bias).
  // Every number is made up. Nothing here is a real price, a real fee, a real tax rate or advice.

  // ---------- small helpers ----------
  function rs(n) { return L.inr(Math.round(n), 0); }
  function rs2(n) { return L.inr(n, 2); }
  function kfmt(n) {
    var a = Math.abs(n), s = n < 0 ? "-" : "";
    if (a >= 100000) return s + (Math.round(a / 1000) / 100) + " lakh";
    if (a >= 1000) return s + (Math.round(a / 100) / 10) + "k";
    return s + Math.round(a);
  }
  function clearEl(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function liveLine(parent) {
    var n = L.el("p", "cft-note cft-live");
    n.setAttribute("aria-live", "polite");
    n.style.opacity = "1";
    n.style.fontWeight = "600";
    parent.appendChild(n);
    return n;
  }
  function sub(parent, text) {
    var h = L.el("div", "cft-tx-b", text);
    h.style.margin = "12px 0 4px";
    parent.appendChild(h);
    return h;
  }
  function ticks(lo, hi, n) {
    var span = hi - lo, out = [];
    if (!(span > 0)) return [lo];
    var raw = span / n, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), s = raw / mag;
    var step = (s < 1.5 ? 1 : s < 3 ? 2 : s < 7 ? 5 : 10) * mag;
    for (var t = Math.ceil(lo / step) * step; t <= hi + 1e-9 && out.length < 12; t += step) out.push(t);
    return out;
  }
  // A chart frame with scales. o: {x0,x1,y0,y1,h}
  function frame(parent, label, o) {
    var W = 360, H = o.h || 200, m = { l: 48, r: 10, t: 10, b: 24 };
    var g = L.svg(parent, W, H);
    g.svg.setAttribute("aria-label", label);
    return {
      g: g, W: W, H: H, m: m,
      X: L.scale(o.x0, o.x1, m.l, W - m.r),
      Y: L.scale(o.y0, o.y1, H - m.b, m.t),
    };
  }
  function gridY(f, tk, fmt) {
    tk.forEach(function (v) {
      var y = f.Y(v);
      f.g.line(f.m.l, y, f.W - f.m.r, y, "cft-ln-d");
      f.g.text(f.m.l - 4, y + 3, fmt(v), "cft-tx cft-tx-s", "end");
    });
  }
  function pathOf(f, arr, xOf) {
    var pts = [];
    for (var i = 0; i < arr.length; i++) pts.push([f.X(xOf ? xOf(i) : i), f.Y(arr[i])]);
    return pts;
  }
  function table3(parent, head, rows) {
    var t = L.el("table", "cft-table");
    var tr0 = L.el("tr", "cft-strong");
    head.forEach(function (h) { tr0.appendChild(L.el("td", null, h)); });
    t.appendChild(tr0);
    rows.forEach(function (r) {
      var tr = L.el("tr");
      r.forEach(function (c, i) { tr.appendChild(L.el("td", i ? "cft-val" : null, c)); });
      t.appendChild(tr);
    });
    parent.appendChild(t);
    return t;
  }

  // =====================================================================
  // 1. trading-reality (chapter: what trading is and is not)
  // =====================================================================
  D["trading-reality"] = function (p, host) {
    var cap = L.P(p, "capital", 50000), N = 100, MONTHS = 12;
    var b = L.box(host, "A made-up year of 100 beginners",
      "What to try: press Play and watch 100 made-up accounts month by month. Then make the bets smaller and press Reset.");
    var body = b.body;
    var r = L.rng(L.P(p, "seed", 11));
    function gauss() {
      var u = Math.max(1e-9, r()), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    var z = [], edge = [], i, m;
    for (i = 0; i < N; i++) {
      edge.push(i % 8 === 0 ? 1.2 : 0); // a few made-up beginners have a small edge
      var zi = [];
      for (m = 0; m < MONTHS; m++) zi.push(gauss());
      z.push(zi);
    }
    var bet = 2, cost = 1, shown = 0, vals = [];
    var controls = L.row(body);
    L.slider(controls, { label: "Size of each bet (% of account at risk)", min: 0.5, max: 5, step: 0.5, value: bet,
      fmt: function (v) { return v + "%"; }, onInput: function (v) { bet = v; compute(); draw(); } });
    L.slider(controls, { label: "Costs and tax each month (made-up %)", min: 0, max: 3, step: 0.25, value: cost,
      fmt: function (v) { return v + "%"; }, onInput: function (v) { cost = v; compute(); draw(); } });
    var chartBox = L.el("div");
    body.appendChild(chartBox);
    var live = liveLine(body);

    function compute() {
      var sd = 3 * bet;
      vals = [];
      for (var a = 0; a < N; a++) {
        var v = cap, row = [v];
        for (var mo = 0; mo < MONTHS; mo++) {
          v = Math.max(0, v * (1 + (edge[a] - cost + sd * z[a][mo]) / 100));
          row.push(v);
        }
        vals.push(row);
      }
    }
    function median(arr) {
      var s = arr.slice().sort(function (x, y) { return x - y; });
      return (s[49] + s[50]) / 2;
    }
    function draw() {
      clearEl(chartBox);
      var all = [cap];
      vals.forEach(function (row) { row.forEach(function (v) { all.push(v); }); });
      var ex = L.extent(all, 0.05);
      var f = frame(chartBox, "Lines for 100 made-up beginner accounts over 12 months, most ending below the start.",
        { x0: 0, x1: MONTHS, y0: Math.max(0, ex[0]), y1: ex[1], h: 220 });
      var g = f.g;
      gridY(f, ticks(Math.max(0, ex[0]), ex[1], 4), function (v) { return kfmt(v); });
      for (var mm = 0; mm <= MONTHS; mm += 3) g.text(f.X(mm), f.H - 8, mm === 0 ? "Start" : "Month " + mm, "cft-tx cft-tx-s", "middle");
      g.line(f.m.l, f.Y(cap), f.W - f.m.r, f.Y(cap), "cft-ln-hi");
      g.text(f.W - f.m.r, f.Y(cap) - 3, "Start: " + rs(cap), "cft-tx cft-tx-s", "end");
      var ahead = 0, down20 = 0, meds = [];
      for (var a = 0; a < N; a++) {
        var cur = vals[a][shown];
        if (cur > cap) ahead++;
        if (cur < cap * 0.8) down20++;
        if (shown > 0) {
          var pl = g.path(pathOf(f, vals[a].slice(0, shown + 1)), cur >= cap ? "cft-pl-g" : "cft-pl-r");
          pl.setAttribute("stroke-width", "1");
          pl.setAttribute("opacity", "0.35");
        }
      }
      for (var q = 0; q <= shown; q++) meds.push(median(vals.map(function (row) { return row[q]; })));
      if (shown > 0) g.path(pathOf(f, meds), "cft-pl-o");
      var col = vals.map(function (row) { return row[shown]; });
      var med = median(col);
      if (shown === 0) {
        live.textContent = "All 100 beginners start with " + rs(cap) + ". Press Play to see each month.";
      } else {
        live.textContent = "After month " + shown + ": " + ahead + " of 100 are ahead of where they started, " +
          (N - ahead) + " are behind, and " + down20 + " are down by more than a fifth. The middle account is at " + rs(med) + ".";
      }
    }
    compute();
    L.anim(body, {
      interval: 650, total: MONTHS,
      step: function (idx) { shown = idx + 1; draw(); },
      reset: function () { shown = 0; draw(); },
    });
    draw();
    L.note(body, "Made-up numbers, not a study of real people. The orange line is the middle account. Green lines are ahead, red lines are behind. A few do well, some by luck and some by skill, and nobody can tell which at the start. Costs and big bets make losing common. The aim of this book is to help you lose little while you learn. It does not promise a profit.");
  };

  // =====================================================================
  // 2. capital-first-rules
  // =====================================================================
  D["capital-first-rules"] = function (p, host) {
    var START = L.P(p, "capital", 50000);
    var HH = Math.max(0, L.P(p, "savings", 400000) - START);
    var DAYS = 60, COST = 40;
    var SEEDS = [3, 4, 6, 2, 1, 5], seedIdx = 0;
    var RULES = [
      ["household", "Household money is separate", "Off: when the account is low, you top it up from household money."],
      ["capital", "Trading capital is set before the first trade", "Off: size comes from all your savings, not the money you set aside."],
      ["lev", "No leverage or borrowed money", "Off: positions are three times bigger than your own money pays for."],
      ["fo", "No F&O as a starting activity (theory only)", "Off: some bets are fast ones that swing four times as far."],
      ["avg", "Never average down", "Off: you add more to losing ideas, so each loss is one and a half times bigger."],
      ["size", "Never increase size after losses", "Off: after a loss you double the size, up to four times."],
      ["notrade", "No-trade days are valid", "Off: you also trade on days with no signal."],
      ["target", "No daily income target drives trades", "Off: after a losing trade you take up to two more to get back."],
    ];
    var on = {};
    RULES.forEach(function (r) { on[r[0]] = true; });

    function draws(seed) {
      var rr = L.rng(seed), d = [];
      for (var i = 0; i < DAYS; i++) {
        var o = { setup: rr() < 0.5, w: [], f: [] };
        for (var j = 0; j < 3; j++) { o.w.push(rr()); o.f.push(rr()); }
        d.push(o);
      }
      return d;
    }
    function runSim(rules, dr) {
      var WIN = 0.42, RR = 1.5, R0 = START * 0.01;
      var T = START, H = HH, loss = 0, dead = false;
      var out = [{ t: T, h: H, ev: "Start", up: false }];
      for (var d = 0; d < DAYS; d++) {
        var x = dr[d], pnl = 0, trades = 0, up = false, ev = "";
        if (dead) { out.push({ t: T, h: H, ev: "Day " + (d + 1) + ": the account is empty. No more trades.", up: false }); continue; }
        if (rules.notrade && !x.setup) {
          out.push({ t: T, h: H, ev: "Day " + (d + 1) + ": no signal, so no trade. That is a valid day.", up: false });
          continue;
        }
        var n = 1, j = 0;
        while (j < n && j < 3) {
          var win = x.w[j] < (x.setup || j > 0 ? WIN : WIN - 0.04);
          var R = rules.capital ? R0 : 0.01 * (T + H);
          var mult = 1;
          if (!rules.lev) mult *= 3;
          if (!rules.size && loss > 0) mult *= Math.min(4, Math.pow(2, loss));
          var fast = !rules.fo && x.f[j] < 0.2, amt;
          if (fast) { win = x.w[j] < 0.4; amt = (win ? 4 : -4) * R * mult; }
          else if (win) amt = RR * R * mult;
          else { amt = -R * mult; if (!rules.avg) amt *= 1.5; }
          amt -= COST;
          pnl += amt; trades++;
          loss = amt < 0 ? loss + 1 : 0;
          T += amt;
          if (!rules.target && pnl < 0 && j === n - 1 && n < 3) n++;
          j++;
        }
        if (!rules.household && T < START * 0.6 && H > 0) {
          var top = Math.min(10000, H);
          H -= top; T = Math.max(0, T) + top; up = true;
        }
        if (T <= 0) { T = 0; dead = true; }
        ev = "Day " + (d + 1) + ": " + trades + (trades === 1 ? " trade" : " trades") + ", result " + rs(pnl) + ".";
        if (trades > 1) ev += " Extra trades to get back.";
        if (up) ev += " Household money moved into trading.";
        if (dead) ev += " The trading account is empty.";
        out.push({ t: T, h: H, ev: ev, up: up });
      }
      return out;
    }

    var b = L.box(host, "Switch the rules on and off",
      "What to try: leave every rule on and press Play. Then switch some off and play again. The luck is the same each time. Only your rules change.");
    var body = b.body;
    var dr = draws(SEEDS[seedIdx]), cur, ref, shown = 0;
    var toggles = {};
    var list = L.el("div", "cft-checklist");
    RULES.forEach(function (r) {
      var wrap = L.el("div");
      toggles[r[0]] = L.toggle(wrap, { label: r[1], value: true, onChange: function (v) { on[r[0]] = v; recalc(); } });
      var hint = L.note(wrap, r[2]);
      hint.style.margin = "0 0 6px 22px";
      list.appendChild(wrap);
    });
    body.appendChild(list);
    var presets = L.el("div", "cft-btn-row");
    body.appendChild(presets);
    function setAll(v) {
      RULES.forEach(function (r) { on[r[0]] = v; toggles[r[0]].set(v); });
      recalc();
    }
    L.button(presets, "All rules on", function () { setAll(true); });
    L.button(presets, "All rules off", function () { setAll(false); });
    L.button(presets, "New luck", function () {
      seedIdx = (seedIdx + 1) % SEEDS.length;
      dr = draws(SEEDS[seedIdx]);
      recalc();
    });
    var chartBox = L.el("div");
    body.appendChild(chartBox);
    var live = liveLine(body);
    var logLine = L.note(body, "");

    function recalc() {
      var allOn = {};
      RULES.forEach(function (r) { allOn[r[0]] = true; });
      cur = runSim(on, dr);
      ref = runSim(allOn, dr);
      draw();
    }
    function draw() {
      clearEl(chartBox);
      var mx = START * 1.25, i;
      for (i = 0; i <= DAYS; i++) mx = Math.max(mx, cur[i].t * 1.05, ref[i].t * 1.05);
      var f = frame(chartBox, "Trading account over 60 made-up days. The solid line uses your rules. The dashed line has every rule on.",
        { x0: 0, x1: DAYS, y0: 0, y1: mx, h: 210 });
      var g = f.g;
      gridY(f, ticks(0, mx, 4), function (v) { return kfmt(v); });
      for (i = 0; i <= DAYS; i += 15) g.text(f.X(i), f.H - 8, i === 0 ? "Day 0" : "Day " + i, "cft-tx cft-tx-s", "middle");
      g.line(f.m.l, f.Y(START), f.W - f.m.r, f.Y(START), "cft-ln-hi");
      g.text(f.W - f.m.r, f.Y(START) - 3, "Start " + rs(START), "cft-tx cft-tx-s", "end");
      var allT = ref.map(function (e) { return e.t; });
      g.path(pathOf(f, allT, null).slice(0, shown + 1), "cft-pl-d");
      var curT = cur.map(function (e) { return e.t; });
      g.path(pathOf(f, curT, null).slice(0, shown + 1), "cft-pl");
      for (i = 1; i <= shown; i++) if (cur[i].up) g.circle(f.X(i), f.Y(cur[i].t), 3.5, "cft-dot");
      var e = cur[shown], low = START;
      for (i = 0; i <= shown; i++) low = Math.min(low, cur[i].t);
      var total = e.t + e.h, base = START + HH, chg = ((total - base) / base) * 100;
      if (shown === 0) {
        live.textContent = "Pick your rules, then press Play. The trading account starts at " + rs(START) + " and household savings are " + rs(HH) + ".";
        logLine.textContent = "Costs are a dummy " + rs(COST) + " per trade. Dashed grey line: every rule on. Orange dots: household money moved into trading.";
      } else {
        live.textContent = "Day " + shown + " of " + DAYS + ". Trading account " + rs(e.t) + ". Household savings " + rs(e.h) +
          ". Total savings " + rs(total) + ", which is " + L.pct(Math.abs(chg), 1) + (chg < 0 ? " below" : " above") + " the start. Lowest the trading account has been: " + rs(low) + ". Household money used: " + rs(HH - e.h) + ".";
        logLine.textContent = e.ev;
      }
    }
    L.anim(body, {
      interval: 280, total: DAYS,
      step: function (idx) { shown = idx + 1; draw(); },
      reset: function () { shown = 0; draw(); },
    });
    L.note(body, "Made-up run. Rules do not make money. Even with every rule on, this account can end a little lower after costs. The rules keep a bad run from becoming a disaster. Breaking the rules can still win in a lucky run (press New luck). That is luck, not a plan. When the account is empty the picture stops at zero.");
    recalc();
  };

  // =====================================================================
  // 3. tax-calc (dummy rates, symbolic)
  // =====================================================================
  D["tax-calc"] = function (p, host) {
    var b = L.box(host, "Tax on trading profit: a practice sum with a DUMMY rate",
      "What to try: change the results of the sample trades, the costs and the dummy tax rate. Switch the two assumptions on and off and watch the net result change.");
    var body = b.body;
    var tr = L.list(p, "trades", [6000, 3000, 1000, 0, 0]);
    while (tr.length < 5) tr.push(0);
    var fields = [], i;
    var rowT = L.row(body);
    for (i = 0; i < 5; i++) {
      fields.push(L.numberField(rowT, { label: "Sample trade " + (i + 1) + " result (Rs). Use a minus sign for a loss.", value: tr[i], onInput: draw }));
    }
    var rowC = L.row(body);
    var costF = L.numberField(rowC, { label: "Trading costs for the year (Rs)", value: L.P(p, "costs", 300), onInput: draw });
    var rate = L.P(p, "rate", 20);
    var rateS = L.slider(rowC, { label: "Tax rate (DUMMY rate, not a real rate)", min: 0, max: 40, step: 1, value: rate,
      fmt: function (v) { return v + "% dummy"; }, onInput: draw });
    var dedCost = true, setOff = true;
    var tg = L.el("div", "cft-checklist");
    body.appendChild(tg);
    L.toggle(tg, { label: "Costs can be taken off before tax (an assumption to check)", value: true, onChange: function (v) { dedCost = v; draw(); } });
    L.toggle(tg, { label: "Losses can cancel gains (an assumption to check)", value: true, onChange: function (v) { setOff = v; draw(); } });
    var pre = L.el("div", "cft-btn-row");
    body.appendChild(pre);
    function setTrades(a, c) {
      for (var q = 0; q < 5; q++) fields[q].set(a[q] || 0);
      costF.set(c);
      draw();
    }
    L.button(pre, "Chapter example", function () { setTrades([6000, 3000, 1000], 300); });
    L.button(pre, "Guided exercise", function () { setTrades([4000], 200); });
    L.button(pre, "A year with a loss", function () { setTrades([5000, -3000, 2000, -1500], 300); });
    var out = L.el("div");
    body.appendChild(out);
    var live = liveLine(body);
    var tags = L.el("div");
    body.appendChild(tags);
    ["classification", "holding period", "loss set-off and carry forward", "audit limits", "tax regime"].forEach(function (t) {
      var s = L.el("span", "cft-verify", "check: " + t);
      s.style.marginRight = "6px";
      tags.appendChild(s);
    });
    L.note(body, "The rate above is a DUMMY rate for practice sums only. This book does not give real tax rates. Rules differ by type of activity and change over time. Check the official source or ask a qualified tax professional.");

    function draw() {
      clearEl(out);
      var gains = 0, losses = 0, t = rateS.get();
      fields.forEach(function (fl) {
        var v = fl.get();
        if (v > 0) gains += v; else losses += -v;
      });
      var C = Math.max(0, costF.get());
      var result = setOff ? gains - losses : gains;
      var B = Math.max(0, result - (dedCost ? C : 0));
      var tax = (t / 100) * B;
      var X = gains - losses - C;
      var net = X - tax;
      L.table(out, [
        ["Gains from winning trades", rs(gains)],
        ["Losses from losing trades", rs(-losses)],
        ["Trading costs", rs(-C)],
        ["Amount tax is worked out on (taxable base)", rs(B), true],
        ["Tax at " + t + "% (DUMMY rate)", rs(-tax)],
        ["Money left after costs and tax", rs(net), true],
      ]);
      var Bp = Math.round(B * 100) / 100, Xp = Math.round(X * 100) / 100;
      L.note(out, "In symbols: net = " + rs(Xp) + " - " + rs(Bp) + " x t. When there are no losses and costs come off first, this is the taxable base times (1 - t).");
      var f = frame(out, "Money left after costs and tax as the dummy tax rate goes from 0 to 40 percent.",
        { x0: 0, x1: 40, y0: Math.min(X, X - 0.4 * B) - Math.abs(X) * 0.1 - 1, y1: Math.max(X, X - 0.4 * B) + Math.abs(X) * 0.1 + 1, h: 170 });
      var g = f.g;
      gridY(f, ticks(Math.min(X, X - 0.4 * B), Math.max(X, X - 0.4 * B), 3), function (v) { return kfmt(v); });
      [0, 10, 20, 30, 40].forEach(function (v) { g.text(f.X(v), f.H - 8, v + "%", "cft-tx cft-tx-s", "middle"); });
      g.line(f.X(0), f.Y(X), f.X(40), f.Y(X - 0.4 * B), "cft-pl");
      g.circle(f.X(t), f.Y(net), 5, "cft-dot");
      g.text(f.W - f.m.r, f.H - 8 - 12, "dummy tax rate", "cft-tx cft-tx-s", "end");
      if (result < 0) {
        live.textContent = "The trades lost " + rs(-result) + " overall, so there is no tax in this practice sum. After costs you are down " + rs(-(X)) + ". Whether the loss can carry forward is a rule to check.";
      } else {
        live.textContent = "Gains " + rs(gains) + " minus losses " + rs(losses) + " minus costs " + rs(C) + " is " + rs(X) + " before tax. At a DUMMY " + t + "%, tax on " + rs(B) + " is " + rs(tax) + ", so you keep " + rs(net) + ".";
      }
    }
    draw();
  };

  // =====================================================================
  // 4. rr-breakeven
  // =====================================================================
  D["rr-breakeven"] = function (p, host) {
    var b = L.box(host, "Reward-to-risk and the win rate you need to break even",
      "What to try: move the target and watch the break-even win rate fall as reward-to-risk rises. Then add a cost per share and see the break-even rise.");
    var body = b.body;
    var row = L.row(body);
    var eF = L.numberField(row, { label: "Entry price (Rs)", value: L.P(p, "entry", 250), onInput: draw });
    var sF = L.numberField(row, { label: "Stop price (Rs)", value: L.P(p, "stop", 240), onInput: draw });
    var tF = L.numberField(row, { label: "Target price (Rs)", value: L.P(p, "target", 270), onInput: draw });
    var row2 = L.row(body);
    var cS = L.slider(row2, { label: "Cost per share (DUMMY, not a real charge)", min: 0, max: 5, step: 0.25, value: L.P(p, "cost", 2),
      fmt: function (v) { return rs2(v) + " dummy"; }, onInput: draw });
    var wS = L.slider(row2, { label: "Your win rate", min: 5, max: 90, step: 1, value: L.P(p, "winRate", 40),
      fmt: function (v) { return v + "%"; }, onInput: draw });
    var out = L.el("div");
    body.appendChild(out);
    var live = liveLine(body);
    sub(body, "Play 60 trades at your win rate");
    var eqBox = L.el("div");
    body.appendChild(eqBox);
    var eqLive = liveLine(body);
    var seed = 5, u = L.rng(seed), draws = [], shown = 0, risk = 10, reward = 20, c = 0, W = 0.4, valid = true;
    function newDraws() { u = L.rng(seed); draws = []; for (var i = 0; i < 60; i++) draws.push(u()); }
    newDraws();
    var bar = L.el("div", "cft-btn-row");
    body.appendChild(bar);
    L.button(bar, "New luck", function () { seed++; newDraws(); drawEq(); });

    function draw() {
      clearEl(out);
      var entry = eF.get(), stop = sF.get(), target = tF.get();
      c = cS.get(); W = wS.get() / 100;
      risk = entry - stop; reward = target - entry;
      valid = risk > 0 && reward > 0;
      if (!valid) {
        L.feedback(out, false, "For a buy, the stop must be below the entry and the target above it.");
        live.textContent = "Fix the prices to see the numbers.";
        drawEq();
        return;
      }
      var R = reward / risk, be = 1 / (1 + R);
      var rc = risk + c, wc = reward - c;
      var rows = [
        ["Risk per share (entry - stop)", rs2(risk)],
        ["Reward per share (target - entry)", rs2(reward)],
        ["Reward-to-risk (R)", R.toFixed(2)],
        ["Break-even win rate before costs", L.pct(be * 100, 1), true],
      ];
      var bec = null;
      if (c > 0) {
        if (wc <= 0) {
          rows.push(["After the dummy cost", "The cost eats the whole reward. No win rate breaks even."]);
        } else {
          bec = rc / (rc + wc);
          rows.push(["Risk with cost / reward after cost", rs2(rc) + " / " + rs2(wc)]);
          rows.push(["Reward-to-risk with cost", (wc / rc).toFixed(2)]);
          rows.push(["Break-even win rate with cost", L.pct(bec * 100, 1), true]);
        }
      }
      L.table(out, rows);
      // curve chart
      var f = frame(out, "Break-even win rate against reward-to-risk. The line falls as reward-to-risk rises. The dashed line is with the dummy cost.",
        { x0: 0.5, x1: 5, y0: 0, y1: 100, h: 200 });
      var g = f.g, k;
      gridY(f, [0, 25, 50, 75, 100], function (v) { return v + "%"; });
      [1, 2, 3, 4, 5].forEach(function (v) { g.text(f.X(v), f.H - 8, "R " + v, "cft-tx cft-tx-s", "middle"); });
      var pts = [], ptsC = [];
      for (k = 0.5; k <= 5.001; k += 0.25) {
        pts.push([f.X(k), f.Y(100 / (1 + k))]);
        if (c > 0) {
          var rw = k * risk - c;
          ptsC.push([f.X(k), f.Y(rw <= 0 ? 100 : (100 * (risk + c)) / (risk + c + rw))]);
        }
      }
      g.path(pts, "cft-pl");
      if (c > 0) g.path(ptsC, "cft-pl-d");
      g.line(f.m.l, f.Y(W * 100), f.W - f.m.r, f.Y(W * 100), "cft-ln-hi");
      g.text(f.W - f.m.r, f.Y(W * 100) - 3, "your win rate " + Math.round(W * 100) + "%", "cft-tx cft-tx-s", "end");
      var rx = L.clamp(R, 0.5, 5);
      g.circle(f.X(rx), f.Y(be * 100), 5, "cft-dot-b");
      if (bec !== null) g.circle(f.X(rx), f.Y(bec * 100), 5, "cft-dot");
      var useBe = bec !== null ? bec : be;
      var gap = W * 100 - useBe * 100;
      live.textContent = "R is " + R.toFixed(2) + ". You need to win at least " + L.pct(be * 100, 1) + " of trades to break even before costs" +
        (bec !== null ? ", and " + L.pct(bec * 100, 1) + " with the dummy cost" : "") + ". At your " + Math.round(W * 100) + "% win rate you are " +
        (Math.abs(gap) < 0.05 ? "right on" : gap > 0 ? L.pct(gap, 1) + " above" : L.pct(-gap, 1) + " below") + " that line. Break-even leaves out slippage and gaps.";
      drawEq();
    }
    function drawEq() {
      clearEl(eqBox);
      if (!valid) { eqLive.textContent = "Fix the prices above first."; return; }
      var win = reward - c, lose = -(risk + c), eq = [0], i, wins = 0;
      for (i = 0; i < 60; i++) {
        var w = draws[i] < W;
        eq.push(eq[i] + (w ? win : lose));
      }
      var ex = L.extent(eq.concat([0]), 0.1);
      var f = frame(eqBox, "Made-up running result per share over 60 trades at your win rate.", { x0: 0, x1: 60, y0: ex[0], y1: ex[1], h: 170 });
      gridY(f, ticks(ex[0], ex[1], 4), function (v) { return rs(v).replace("Rs ", ""); });
      [0, 20, 40, 60].forEach(function (v) { f.g.text(f.X(v), f.H - 8, v === 0 ? "Start" : "Trade " + v, "cft-tx cft-tx-s", "middle"); });
      f.g.line(f.m.l, f.Y(0), f.W - f.m.r, f.Y(0), "cft-ln-hi");
      f.g.path(pathOf(f, eq.slice(0, shown + 1)), eq[shown] >= 0 ? "cft-pl-g" : "cft-pl-r");
      for (i = 0; i < shown; i++) if (draws[i] < W) wins++;
      var avg = W * win + (1 - W) * lose;
      eqLive.textContent = shown === 0
        ? "Press Play. On average each trade should return " + rs2(avg) + " per share at this win rate, but a short run moves a lot."
        : "After " + shown + " trades: " + wins + " wins and " + (shown - wins) + " losses, running result " + rs2(eq[shown]) + " per share. The long-run average is " + rs2(avg) + " per trade.";
    }
    L.anim(body, {
      interval: 200, total: 60,
      step: function (idx) { shown = idx + 1; drawEq(); },
      reset: function () { shown = 0; drawEq(); },
    });
    draw();
  };

  // =====================================================================
  // 5. overtrading-drain
  // =====================================================================
  D["overtrading-drain"] = function (p, host) {
    var b = L.box(host, "How many trades does a daily target need?",
      "What to try: raise the cost per trade and watch the trades needed jump. Then press Play to see one made-up day of trades arrive.");
    var body = b.body;
    var row = L.row(body);
    var tF = L.numberField(row, { label: "Daily target (Rs)", value: L.P(p, "target", 2000), onInput: update });
    var eF = L.numberField(row, { label: "Average result per trade before costs (Rs)", value: L.P(p, "expectancy", 50), onInput: update });
    var cF = L.numberField(row, { label: "Cost per trade (DUMMY, not a real charge) (Rs)", value: L.P(p, "cost", 40), onInput: update });
    var nS;
    var out = L.el("div");
    var chartBox = L.el("div");
    var live = liveLine(body);
    var shown = 0, n = 100, u = L.rng(21), draws = [], i;
    for (i = 0; i < 300; i++) draws.push(u());
    var nBox = L.row(body);
    function nets() {
      var T = tF.get(), E = eF.get(), C = cF.get();
      return { T: T, E: E, C: C, En: E - C };
    }
    var init = nets();
    var defN = init.En > 0 ? Math.min(300, Math.max(5, Math.ceil(init.T / init.En / 5) * 5)) : 100;
    nS = L.slider(nBox, { label: "Trades in the day", min: 5, max: 300, step: 5, value: defN,
      fmt: function (v) { return v + " trades"; }, onInput: function (v) { n = v; shown = Math.min(shown, n); drawChart(); } });
    n = defN;
    body.appendChild(out);
    body.appendChild(chartBox);
    body.insertBefore(live, null);

    function update() { drawOut(); drawChart(); }
    function drawOut() {
      clearEl(out);
      var v = nets();
      var rows = [];
      if (v.E > 0) rows.push(["Trades needed before costs", Math.ceil(v.T / v.E - 1e-9) + " a day (" + (Math.ceil(v.T / v.E - 1e-9) * 250).toLocaleString("en-IN") + " a year)"]);
      else rows.push(["Trades needed before costs", "No count reaches the target on average"]);
      if (v.En > 0) {
        var nn = Math.ceil(v.T / v.En - 1e-9);
        rows.push(["Average result per trade after costs", rs(v.En)]);
        rows.push(["Trades needed after costs", nn + " a day (" + (nn * 250).toLocaleString("en-IN") + " a year)", true]);
      } else {
        rows.push(["Average result per trade after costs", rs(v.En)]);
        rows.push(["Trades needed after costs", "No count reaches the target on average", true]);
      }
      L.table(out, rows);
    }
    function drawChart() {
      clearEl(chartBox);
      var v = nets();
      var R = Math.max(1, v.E / 0.1), gross = [0], net = [0], avgG = [0], avgN = [0], k;
      for (k = 0; k < n; k++) {
        var g1 = draws[k] < 0.5 ? 1.2 * R : -R;
        gross.push(gross[k] + g1);
        net.push(net[k] + g1 - v.C);
      }
      for (k = 0; k <= n; k++) { avgG.push(k * v.E); avgN.push(k * v.En); }
      avgG.shift(); avgN.shift();
      var all = gross.concat(net, avgG, avgN, [0, v.T]);
      var ex = L.extent(all, 0.06);
      var f = frame(chartBox, "Running result of one made-up day of trades, before and after costs, against the daily target.",
        { x0: 0, x1: n, y0: ex[0], y1: ex[1], h: 220 });
      var g = f.g;
      gridY(f, ticks(ex[0], ex[1], 4), function (x) { return kfmt(x); });
      [0, 0.5, 1].forEach(function (fr) { g.text(f.X(n * fr), f.H - 8, Math.round(n * fr) + " trades", "cft-tx cft-tx-s", fr === 0 ? "start" : fr === 1 ? "end" : "middle"); });
      g.line(f.m.l, f.Y(v.T), f.W - f.m.r, f.Y(v.T), "cft-ln-hi");
      g.text(f.m.l + 4, f.Y(v.T) - 3, "target " + rs(v.T), "cft-tx cft-tx-s");
      g.line(f.m.l, f.Y(0), f.W - f.m.r, f.Y(0), "cft-ln");
      g.path(pathOf(f, avgG), "cft-pl-d");
      g.path(pathOf(f, avgN), "cft-pl-d");
      if (shown > 0) {
        g.path(pathOf(f, gross.slice(0, shown + 1)), "cft-pl");
        g.path(pathOf(f, net.slice(0, shown + 1)), "cft-pl-r");
      }
      if (shown === 0) {
        live.textContent = v.En > 0
          ? "On average the target needs about " + Math.ceil(v.T / v.En - 1e-9) + " trades after costs. Press Play. Each step adds 5 trades. Blue is before costs, red is after costs, dashed lines are the averages."
          : "After costs the average trade does not make money, so no number of trades reaches the target. Press Play to watch the costs add up.";
      } else {
        live.textContent = "After " + shown + " trades: costs paid " + rs(shown * v.C) + ". This made-up day is at " + rs(gross[shown]) + " before costs and " + rs(net[shown]) + " after costs. The target is " + rs(v.T) + ".";
      }
    }
    L.anim(body, {
      interval: 350,
      step: function () {
        if (shown >= n) return false;
        shown = Math.min(n, shown + 5);
        drawChart();
        if (shown >= n) return false;
      },
      reset: function () { shown = 0; drawChart(); },
    });
    L.note(body, "Made-up numbers. This is not a target to chase. The cost is a dummy figure. The lines wander because luck is bigger than the small average gain, so one day can end far from the dashed line. More trades mean more cost, more noise and more chances to break a rule. A daily target can push you to trade when no signal is there.");
    update();
  };

  // =====================================================================
  // 6. exposure-meter
  // =====================================================================
  D["exposure-meter"] = function (p, host) {
    var b = L.box(host, "How much of your account is in each position and sector?",
      "What to try: press 'Add position D' and see which limit it breaks. Then tick the box that says the sectors move together.");
    var body = b.body;
    var row0 = L.row(body);
    var capF = L.numberField(row0, { label: "Account size (Rs)", value: L.P(p, "capital", 50000), onInput: draw });
    var capS = L.slider(row0, { label: "Most in one position", min: 5, max: 50, step: 1, value: L.P(p, "positionCap", 25),
      fmt: function (v) { return v + "%"; }, onInput: draw });
    var secS = L.slider(row0, { label: "Most in one sector (an example limit)", min: 10, max: 100, step: 5, value: L.P(p, "sectorCap", 50),
      fmt: function (v) { return v + "%"; }, onInput: draw });
    var corr = L.toggle(body, { label: "These sectors move together (treat them as one bet)", value: false, onChange: draw });
    var names = ["A", "B", "C", "D"];
    var def = [["X", 10000, 500, true], ["X", 12500, 500, true], ["Y", 7500, 300, true], ["X", 6000, 300, L.P(p, "addD", 0) === 1]];
    var rows = [];
    names.forEach(function (nm, i) {
      var r = L.row(body);
      var inc = L.toggle(r, { label: "Position " + nm, value: def[i][3], onChange: draw });
      var sec = L.select(r, { label: "Sector", options: [["X", "Sector X"], ["Y", "Sector Y"]], value: def[i][0], onChange: draw });
      var val = L.numberField(r, { label: "Value (Rs)", value: def[i][1], onInput: draw });
      var loss = L.numberField(r, { label: "Planned loss at stop (Rs)", value: def[i][2], onInput: draw });
      rows.push({ inc: inc, sec: sec, val: val, loss: loss });
    });
    var pre = L.el("div", "cft-btn-row");
    body.appendChild(pre);
    function setRows(a) {
      a.forEach(function (d, i) {
        rows[i].inc.set(d[3]); rows[i].sec.set(d[0]); rows[i].val.set(d[1]); rows[i].loss.set(d[2]);
      });
      draw();
    }
    L.button(pre, "Three positions", function () { setRows(def.map(function (d, i) { return [d[0], d[1], d[2], i < 3]; })); });
    L.button(pre, "Add position D", function () { setRows(def.map(function (d) { return [d[0], d[1], d[2], true]; })); });
    L.button(pre, "Four equal positions, one sector", function () {
      var cp = capF.get();
      setRows([0, 1, 2, 3].map(function () { return ["X", cp * 0.25, cp * 0.01, true]; }));
    });
    var chartBox = L.el("div");
    body.appendChild(chartBox);
    var table = L.el("div");
    body.appendChild(table);
    var live = liveLine(body);
    L.note(body, "Made-up positions. Open risk is the planned loss if every stop fills at its price. It is not the worst case, because gaps can make a real loss bigger. The limits here are examples. You choose your own.");

    function draw() {
      var cap = capF.get();
      clearEl(chartBox); clearEl(table);
      if (!(cap > 0)) { live.textContent = "Enter an account size above zero."; return; }
      var pos = [], secs = {}, secOrder = [], deployed = 0, risk = 0;
      rows.forEach(function (r, i) {
        if (!r.inc.get()) return;
        var v = Math.max(0, r.val.get()), l = Math.max(0, r.loss.get());
        var sec = corr.get() ? "All (together)" : "Sector " + r.sec.get();
        pos.push({ n: names[i], sec: sec, raw: r.sec.get(), v: v, l: l, pc: (v / cap) * 100 });
        deployed += v; risk += l;
        if (!(sec in secs)) { secs[sec] = 0; secOrder.push(sec); }
        secs[sec] += v;
      });
      var cash = cap - deployed;
      var pcap = capS.get(), scap = secS.get();
      var issues = [];
      pos.forEach(function (q) { if (q.pc > pcap + 1e-9) issues.push("Position " + q.n + " is " + L.pct(q.pc, 1) + " of capital, above the " + pcap + "% limit"); });
      secOrder.forEach(function (s) { var sp = (secs[s] / cap) * 100; if (sp > scap + 1e-9) issues.push(s + " is " + L.pct(sp, 1) + " of capital, above the " + scap + "% limit"); });
      if (deployed > cap) issues.push("Positions add up to more than your account");
      // chart
      var W = 360, rowH = 22, H = 100 + pos.length * rowH + secOrder.length * rowH;
      var g = L.svg(chartBox, W, H);
      g.svg.setAttribute("aria-label", "Bars showing each position and each sector as a share of the account, with the limit lines.");
      var x0 = 78, x1 = W - 10, top = Math.max(100, deployed / cap * 100);
      var X = L.scale(0, top, x0, x1);
      g.text(4, 22, "Account", "cft-tx cft-tx-b");
      var acc = 0;
      pos.forEach(function (q) {
        var w = X(q.pc) - x0;
        g.rect(x0 + (X(acc) - x0), 10, w, 18, q.raw === "Y" && !corr.get() ? "cft-dot" : "cft-rc");
        acc += q.pc;
      });
      if (cash > 0) g.rect(X(acc), 10, X((cash / cap) * 100 + acc) - X(acc), 18, "cft-rc-grey");
      g.text(x0 + 2, 42, "Blue: sector X. Orange: sector Y. Grey: cash " + L.pct((Math.max(0, cash) / cap) * 100, 0), "cft-tx cft-tx-s");
      var y = 52;
      g.text(4, y + 4, "Each position", "cft-tx cft-tx-b");
      pos.forEach(function (q, i) {
        var yy = y + 8 + i * rowH;
        g.text(4, yy + 13, "Position " + q.n, "cft-tx");
        g.rect(x0, yy, X(q.pc) - x0, 16, q.pc > pcap + 1e-9 ? "cft-rc-down" : "cft-rc-up");
        g.text(X(q.pc) + 4, yy + 12, L.pct(q.pc, 1), "cft-tx cft-tx-s");
      });
      var ys = y + 8 + pos.length * rowH;
      g.line(X(pcap), y + 4, X(pcap), ys, "cft-ln-hi");
      g.text(X(pcap), y, "limit " + pcap + "%", "cft-tx cft-tx-s", "middle");
      var y2 = ys + 14;
      g.text(4, y2 + 4, "Each sector", "cft-tx cft-tx-b");
      secOrder.forEach(function (s, i) {
        var yy = y2 + 8 + i * rowH, sp = (secs[s] / cap) * 100;
        g.text(4, yy + 13, s.length > 11 ? "All" : s, "cft-tx");
        g.rect(x0, yy, X(sp) - x0, 16, sp > scap + 1e-9 ? "cft-rc-down" : "cft-rc-up");
        g.text(X(sp) + 4, yy + 12, L.pct(sp, 1), "cft-tx cft-tx-s");
      });
      var ys2 = y2 + 8 + secOrder.length * rowH;
      g.line(X(scap), y2 + 4, X(scap), ys2, "cft-ln-hi");
      g.text(X(scap), y2, "limit " + scap + "%", "cft-tx cft-tx-s", "middle");
      // numbers
      var tr = [
        ["Deployed (position values)", rs(deployed) + " (" + L.pct((deployed / cap) * 100, 1) + ")"],
        ["Cash", rs(cash) + " (" + L.pct((cash / cap) * 100, 1) + ")"],
        ["Open risk (planned losses added up)", rs(risk) + " (" + L.pct((risk / cap) * 100, 1) + ")", true],
      ];
      secOrder.forEach(function (s) { tr.push([s + " share of capital", L.pct((secs[s] / cap) * 100, 1)]); });
      L.table(table, tr);
      var dIn = rows[3].inc.get();
      if (!issues.length) {
        live.textContent = "All limits are met. Deployed " + L.pct((deployed / cap) * 100, 1) + ", cash " + L.pct((cash / cap) * 100, 1) + ", open risk " + L.pct((risk / cap) * 100, 1) + " of capital.";
      } else {
        live.textContent = (dIn ? "With position D added: " : "") + issues.join(". ") + ". Open risk is " + rs(risk) + ", or " + L.pct((risk / cap) * 100, 1) + " of capital." +
          (dIn ? " A limit is broken, so the rule says reject D." : "");
      }
    }
    draw();
  };

  // =====================================================================
  // 7. fear-greed-curve
  // =====================================================================
  D["fear-greed-curve"] = function (p, host) {
    var cap = L.P(p, "capital", 50000), R = cap * 0.01;
    var b = L.box(host, "A made-up trading day: feelings and rules",
      "What to try: press Step to move through the day. At each moment, name the feeling and choose what you do. Then compare your day with the day that follows the rule.");
    var body = b.body;
    var moments = [
      { when: "After a loss", scene: "Trade 1 hit its stop. You lost 1R (" + rs(R) + ").", both: -R,
        rule: "The plan says: take a new trade only when the checklist shows a signal. There is none.", urge: "Take a trade now to win it back.", plan: 0, you: -R,
        youText: "The unplanned trade lost another 1R." },
      { when: "When price moves without you", scene: "A share on your list jumps 3% while you wait. You have no signal.", both: 0,
        rule: "No signal, no trade.", urge: "Jump in so you do not miss it.", plan: 0, you: -R,
        youText: "The late jump in lost 1R." },
      { when: "After a win", scene: "Trade 2 came from the checklist and won 2R (" + rs(2 * R) + ").", both: 2 * R,
        rule: "Keep the same size. A win does not change the size.", urge: "Add size, because you feel lucky.", plan: 0, you: -2 * R,
        youText: "The bigger unplanned trade lost 2R." },
      { when: "When your plan says no trade", scene: "It is 1 pm. Still no signal.", both: 0,
        rule: "No trade is a valid result.", urge: "Do something. Sitting still feels like losing.", plan: 0, you: R,
        youText: "This one happened to win 1R. Sometimes the urge trade wins. That is luck. It still broke the plan." },
      { when: "When price comes near your stop", scene: "A checklist trade is close to its stop.", both: 0,
        rule: "Leave the stop where the plan put it. It is stopped for 1R.", urge: "Move the stop away and hope it turns.", plan: -R, you: -2 * R,
        youText: "The moved stop was hit later, for 2R." },
      { when: "After a win", scene: "Trade 5 won 1R (" + rs(R) + ").", both: R,
        rule: "Write it in the journal. Then stop looking for more.", urge: "Keep going while you feel hot.", plan: 0, you: -R,
        youText: "The extra trade lost 1R." },
    ];
    var tags = [
      ["", "Pick a feeling"], ["calm", "Calm"], ["fear", "Fear"], ["greed", "Greed"],
      ["frustration", "Frustration"], ["relief", "Relief"], ["excitement", "Excitement"],
    ];
    var tagText = {
      calm: "Calm lets the plan decide.",
      fear: "Fear often says: leave early, skip a good signal, or move a stop.",
      greed: "Greed often says: add size or hold on for more.",
      frustration: "Frustration often says: act now to get the money back.",
      relief: "Relief often says: relax and skip the checks.",
      excitement: "Excitement often says: do more than the plan.",
    };
    var shown = 0;
    var chartBox = L.el("div");
    var live = liveLine(body);
    var cards = [], feel = [], choice = [];
    var cardBox = L.el("div");
    body.appendChild(cardBox);
    moments.forEach(function (m, i) {
      var card = L.el("div", "cft-screen");
      card.style.display = "none";
      card.appendChild(L.el("div", "cft-tx-b", "Moment " + (i + 1) + ": " + m.when));
      card.appendChild(L.el("p", null, m.scene));
      card.appendChild(L.el("p", "cft-note", "The rule: " + m.rule));
      card.appendChild(L.el("p", "cft-note", "The urge: " + m.urge));
      var fs = L.select(card, { label: "What do you feel?", options: tags, value: "", onChange: function (v) {
        info.textContent = v ? tagText[v] + " Naming it gives you a pause." : "";
        update();
      } });
      var cs = L.select(card, { label: "What do you do?", options: [["rule", "Follow the rule"], ["urge", "Act on the urge"]], value: "rule", onChange: function () { update(); } });
      var info = L.el("p", "cft-note");
      card.appendChild(info);
      var res = L.el("p", "cft-note");
      card.appendChild(res);
      cardBox.appendChild(card);
      cards.push({ card: card, res: res });
      feel.push(fs); choice.push(cs);
    });
    body.appendChild(chartBox);
    body.appendChild(live);

    function totals() {
      var plan = [0], you = [0], i, a = 0, c = 0;
      for (i = 0; i < moments.length; i++) {
        var m = moments[i];
        a += m.both + m.plan;
        c += m.both + (choice[i].get() === "urge" ? m.you : m.plan);
        plan.push(a); you.push(c);
      }
      return { plan: plan, you: you };
    }
    function update() {
      var t = totals(), i;
      for (i = 0; i < moments.length; i++) {
        cards[i].card.style.display = i < shown ? "" : "none";
        cards[i].res.textContent = choice[i].get() === "urge" ? "You acted on the urge. " + moments[i].youText : "You followed the rule.";
      }
      clearEl(chartBox);
      var f = frame(chartBox, "Running result of the day for the rule path and for your choices.", { x0: 0, x1: moments.length, y0: -2500, y1: 1000, h: 190 });
      var g = f.g;
      gridY(f, [-2000, -1000, 0, 1000], function (v) { return kfmt(v); });
      for (i = 0; i <= moments.length; i++) g.text(f.X(i), f.H - 8, i === 0 ? "Open" : "M" + i, "cft-tx cft-tx-s", "middle");
      g.line(f.m.l, f.Y(0), f.W - f.m.r, f.Y(0), "cft-ln");
      g.path(pathOf(f, t.plan.slice(0, shown + 1)), "cft-pl-d");
      g.path(pathOf(f, t.you.slice(0, shown + 1)), "cft-pl-o");
      var yv = t.you[shown], pv = t.plan[shown];
      if (shown === 0) {
        live.textContent = "Press Step to start the day. Dashed line: the day that follows the rule. Orange line: your choices.";
      } else {
        live.textContent = "After moment " + shown + ", your day is at " + rs(yv) + " (" + (yv / R).toFixed(1).replace(".0", "") + "R, " + L.pct((yv / cap) * 100, 1) +
          " of " + rs(cap) + "). The day that follows the rule is at " + rs(pv) + ".";
        if (shown === moments.length) {
          var allUrge = true;
          for (i = 0; i < choice.length; i++) if (choice[i].get() !== "urge") allUrge = false;
          live.textContent += allUrge ? " Acting on every urge ends the day at -Rs 2,000, which is 4R or 4% of the account." : "";
        }
      }
    }
    L.anim(body, {
      interval: 3500, total: moments.length,
      step: function (idx) { shown = idx + 1; update(); },
      reset: function () {
        shown = 0;
        for (var i = 0; i < moments.length; i++) { feel[i].set(""); choice[i].set("rule"); }
        update();
      },
    });
    L.note(body, "Made-up moments. Feelings like these are normal, and nobody is judging you here. A feeling is not a rule. The pause between the feeling and the action is the skill. Following the rule does not promise a profit, because a stop can still be hit. This book does not diagnose anyone. If trading causes you real distress, read 'When to stop trading altogether'.");
    update();
  };

  // =====================================================================
  // 8. bias-lab
  // =====================================================================
  D["bias-lab"] = function (p, host) {
    var part = L.S(p, "part", "all");
    var planEntry = L.P(p, "plannedEntry", 400), planStop = L.P(p, "plannedStop", 390), budget = L.P(p, "risk", 500);
    var b = L.box(host, part === "fomo" ? "FOMO: the planned trade and the late trade" : part === "evidence" ? "Evidence and luck" : "Three habits that bend your thinking",
      part === "fomo" ? "What to try: press Step to watch the jump, then change the new stop and see how the late trade differs from the plan."
        : part === "evidence" ? "What to try: pick the notes you would read first. Then run 100 traders who only have luck."
        : "What to try: change the new stop and watch how the late trade differs from the plan. Then pick the notes you would read first. Last, run 100 traders who only have luck.");
    var body = b.body;

    // ---- Part 1: FOMO ----
    if (part === "all" || part === "fomo") {
      sub(body, "1. FOMO: the price jumps and your plan is gone");
      var row = L.row(body);
      var jump = L.P(p, "jump", 12), stop2 = L.P(p, "stop", 420);
      var jS = L.slider(row, { label: "Jump on the day", min: 0, max: 25, step: 1, value: jump, fmt: function (v) { return v + "%"; }, onInput: function () { drawF(); } });
      var sF = L.numberField(row, { label: "Your new stop for the late entry (Rs)", value: stop2, onInput: function () { drawF(); } });
      var chartF = L.el("div");
      body.appendChild(chartF);
      var tblF = L.el("div");
      body.appendChild(tblF);
      var liveF = liveLine(body);
      var pre = [planEntry - 6, planEntry - 4, planEntry - 5, planEntry - 3, planEntry - 4, planEntry - 2, planEntry - 3, planEntry - 1];
      var shownF = 0;
      var drawF = function () {
        var price = Math.round(planEntry * (1 + jS.get() / 100) * 100) / 100;
        var ns = sF.get();
        clearEl(chartF); clearEl(tblF);
        var all = pre.concat([price, planStop, planEntry, ns]);
        var lo = Math.min.apply(null, all) - 8, hi = Math.max.apply(null, all) + 8;
        var f = frame(chartF, "Made-up price hovering below the planned entry, then jumping. Lines mark the planned entry, the planned stop, the late entry and the new stop.",
          { x0: 0, x1: 8, y0: lo, y1: hi, h: 210 });
        var g = f.g;
        gridY(f, ticks(lo, hi, 4), function (v) { return Math.round(v); });
        g.line(f.m.l, f.Y(planEntry), f.W - f.m.r, f.Y(planEntry), "cft-ln-d");
        g.text(f.m.l + 4, f.Y(planEntry) - 3, "planned entry " + rs(planEntry), "cft-tx cft-tx-s");
        var ls = g.line(f.m.l, f.Y(planStop), f.W - f.m.r, f.Y(planStop), "cft-pl-r");
        ls.setAttribute("stroke-dasharray", "4 3"); ls.setAttribute("stroke-width", "1.5");
        g.text(f.m.l + 4, f.Y(planStop) + 11, "planned stop " + rs(planStop), "cft-tx cft-tx-s");
        var series = pre.concat([price]);
        if (shownF > 0) g.path(pathOf(f, series.slice(0, shownF)), "cft-pl");
        if (shownF >= 9) {
          g.circle(f.X(8), f.Y(price), 5, "cft-dot");
          g.text(f.X(8) - 8, f.Y(price) - 8, "late entry " + rs(price), "cft-tx cft-tx-s", "end");
          var ln = g.line(f.m.l, f.Y(ns), f.W - f.m.r, f.Y(ns), "cft-pl-o");
          ln.setAttribute("stroke-dasharray", "4 3"); ln.setAttribute("stroke-width", "1.5");
          g.text(f.m.l + 4, f.Y(ns) + 11, "new stop " + rs(ns), "cft-tx cft-tx-s");
        }
        var planRisk = planEntry - planStop, planSh = planRisk > 0 ? Math.floor(budget / planRisk) : 0;
        if (ns >= price) { liveF.textContent = "The new stop must be below the late entry price of " + rs(price) + "."; return; }
        var risk2 = price - ns, sh2 = Math.floor(budget / risk2);
        table3(tblF, ["", "The plan", "The late entry"], [
          ["Entry price", rs(planEntry), rs(price)],
          ["Stop", rs(planStop), rs(ns)],
          ["Risk per share", rs(planRisk), rs(risk2)],
          ["Shares for " + rs(budget) + " of risk", planSh + "", sh2 + ""],
          ["Cash used", rs(planSh * planEntry), rs(sh2 * price)],
          ["Reason for the trade", "Your written plan", "Fear of missing out"],
        ]);
        liveF.textContent = "The planned trade buys " + planSh + " shares at " + rs(planEntry) + " with a stop at " + rs(planStop) +
          ". The late entry buys " + sh2 + " shares at " + rs(price) + " with a stop at " + rs(ns) + ", using " + rs(sh2 * price) +
          ". The entry, the stop and the cash all differ, so this is a new trade, not the planned one. Fewer shares do not make it the planned trade.";
      };
      L.anim(body, {
        interval: 600, total: 9,
        step: function (idx) { shownF = idx + 1; drawF(); },
        reset: function () { shownF = 0; drawF(); },
      });
      drawF();
    }

    // ---- Part 2: confirmation bias ----
    if (part === "all" || part === "evidence") {
      sub(body, "2. Confirmation bias: which notes would you read first?");
      L.note(body, "You like a made-up company, Company Z. Tick the four notes you would read first.");
      var ev = [
        ["A friend says the share will rise.", true],
        ["The company's debt has gone up for three years in a row.", false],
        ["A post says big buyers are coming.", true],
        ["Its biggest customer cut its orders.", false],
        ["Sales went up last quarter.", true],
        ["The share already rose 12% this week.", false],
        ["The chart made a higher low last week.", true],
        ["Profit fell in two of the last four quarters.", false],
      ];
      var evBox = L.el("div", "cft-checklist");
      body.appendChild(evBox);
      var evTags = [];
      ev.forEach(function (e, i) {
        var wrap = L.el("div");
        L.toggle(wrap, { label: e[0], value: false, onChange: function () { evUpdate(); } });
        var tg = L.el("span", "cft-tag", "");
        tg.style.display = "none";
        wrap.appendChild(tg);
        evBox.appendChild(wrap);
        evTags.push({ tg: tg, wrap: wrap });
      });
      var liveE = liveLine(body);
      var evUpdate = function () {
        var picks = 0, agree = 0, dis = 0;
        ev.forEach(function (e, i) {
          var chk = evTags[i].wrap.querySelector("input").checked;
          var tg = evTags[i].tg;
          if (chk) { picks++; if (e[1]) agree++; else dis++; }
          tg.style.display = chk ? "" : "none";
          tg.textContent = e[1] ? "agrees with your idea" : "disagrees";
          tg.className = "cft-tag" + (e[1] ? "" : " cft-tag-o");
        });
        if (!picks) liveE.textContent = "Pick a few notes to see what you chose.";
        else if (!dis) liveE.textContent = "You picked " + picks + " notes, and all " + agree + " agree with your idea. That is confirmation bias: looking only for evidence that agrees. Try including at least one note that disagrees.";
        else liveE.textContent = "You picked " + agree + " that agree and " + dis + " that disagree. Looking at what could go wrong is the habit this chapter suggests. Before you enter, write at least one reason the trade could fail.";
      };
      evUpdate();
    }

    // ---- Part 3: luck and overconfidence ----
    if (part !== "fomo") {
      sub(body, "3. Overconfidence: a short run of wins can be luck");
      L.note(body, "Each of 100 made-up traders makes 5 trades. Every trade is a fair coin flip, so nobody has any skill. Press the button and see how many still win 4 or 5 of 5.");
      var seed = 100;
      var luckBox = L.el("div");
      var liveL = liveLine(body);
      var runLuck = function () {
        seed++;
        var r = L.rng(seed), hits = 0, cells = [], i, j;
        for (i = 0; i < 100; i++) {
          var w = 0;
          for (j = 0; j < 5; j++) if (r() < 0.5) w++;
          cells.push(w);
          if (w >= 4) hits++;
        }
        clearEl(luckBox);
        var g = L.svg(luckBox, 360, 120);
        g.svg.setAttribute("aria-label", "100 squares. Orange squares are traders who won 4 or 5 of 5 coin-flip trades by luck.");
        for (i = 0; i < 100; i++) {
          var cx = 8 + (i % 20) * 17, cy = 8 + Math.floor(i / 20) * 22;
          g.rect(cx, cy, 14, 18, cells[i] >= 4 ? "cft-dot" : "cft-rc-grey");
        }
        liveL.textContent = hits + " of 100 traders won 4 or 5 of their 5 trades by luck alone. In theory it is 6 chances in 32, about 18.8%. A short run is a small sample, not a trend.";
      };
      body.appendChild(luckBox);
      var bar = L.el("div", "cft-btn-row");
      body.appendChild(bar);
      L.button(bar, "Run 100 luck-only traders", runLuck);
      body.appendChild(liveL);
      runLuck();
    }
    L.note(body, "All figures are made up. Seeing these habits does not remove them. It gives you a pause before you act.");
  };
})();
