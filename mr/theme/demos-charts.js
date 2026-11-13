(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  // Demos for the chart-reading chapters: candles, timeframes, zones, swings,
  // breakouts, formations, Fibonacci levels and the chart-reading check.
  // All prices here are made up. Nothing is real market data.

  // ---------- small helpers ----------
  function r2(n) { return Math.round(n * 100) / 100; }
  function fx(n) { return String(r2(n)); }
  function rs(n) { return L.inr(r2(n)); }
  function empty(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function trim(s) { return String(s).trim(); }
  function nonEmpty(s) { return s !== ""; }
  function setPressed(btn, on) {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.className = "cft-btn" + (on ? " cft-chip-on" : "");
  }
  function liveLine(parent) {
    var e = L.el("p", "cft-live");
    e.setAttribute("role", "status");
    e.setAttribute("aria-live", "polite");
    e.style.margin = "8px 0";
    e.style.fontWeight = "600";
    parent.appendChild(e);
    return e;
  }
  function frame(parent, w, h, label) {
    var g = L.svg(parent, w, h);
    g.svg.setAttribute("aria-label", label);
    return g;
  }
  function niceStep(range, n) {
    var raw = range / n, mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / mag;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
  }
  function yAxis(g, sy, lo, hi, x0, x1) {
    var st = niceStep(hi - lo, 4), v = Math.ceil(lo / st) * st;
    for (; v <= hi; v += st) {
      var y = sy(v);
      g.line(x0, y, x1, y, "cft-ln cft-fade");
      g.text(x0 - 4, y + 3, fx(v), "cft-tx cft-tx-s", "end");
    }
  }
  function stats(o, h, l, c) {
    return { body: Math.abs(c - o), upper: h - Math.max(o, c), lower: Math.min(o, c) - l, range: h - l };
  }
  function dirText(o, c) {
    return c > o ? "Bullish (the close is above the open)" : c < o ? "Bearish (the close is below the open)" : "Flat (the close equals the open)";
  }
  function dirWord(o, c) { return c > o ? "bullish" : c < o ? "bearish" : "flat"; }
  // Converts a click or tap on an svg into svg coordinates.
  function svgPoint(g, ev) {
    var rc = g.svg.getBoundingClientRect();
    var w = rc.width || g.w, h = rc.height || g.h;
    return { x: (ev.clientX - rc.left) * (g.w / w), y: (ev.clientY - rc.top) * (g.h / h) };
  }
  function mkTable(parent, head, rows, strong) {
    var t = L.el("table", "cft-table"), tr = L.el("tr");
    head.forEach(function (h) { tr.appendChild(L.el("th", null, h)); });
    t.appendChild(tr);
    rows.forEach(function (row, ri) {
      var r = L.el("tr");
      row.forEach(function (cell, ci) {
        var td = L.el("td", "cft-val");
        if (strong && strong[ri] && strong[ri].indexOf(ci) > -1) {
          var s = L.el("strong", null, cell); td.appendChild(s);
        } else td.textContent = cell;
        r.appendChild(td);
      });
      t.appendChild(r);
    });
    parent.appendChild(t);
    return t;
  }

  // ---------- made-up price paths ----------
  // points: turning prices. lens: how many candles in each leg. The last candle of each leg
  // is a turning point (pivot). Returns {candles, pivots}.
  function pathCandles(points, lens, seed, noise) {
    var r = L.rng(seed), out = [], piv = [], prevC = points[0], s, j;
    for (s = 1; s < points.length; s++) {
      var a = points[s - 1], b = points[s], n = lens[s - 1], up = b > a;
      for (j = 1; j <= n; j++) {
        var last = j === n, o = prevC, c, h, l;
        if (last) c = b + (up ? -1 : 1) * noise * 0.4;
        else c = a + (b - a) * j / n + (r() - 0.5) * noise * 0.6;
        h = Math.max(o, c) + r() * noise;
        l = Math.min(o, c) - r() * noise;
        if (last) {
          if (up) h = b; else l = b;
          piv.push({ i: out.length, type: up ? "H" : "L", price: b });
        }
        out.push({ o: r2(o), h: r2(h), l: r2(l), c: r2(c), v: Math.round(8000 + r() * 12000) });
        prevC = c;
      }
    }
    piv.forEach(function (pv) {
      var k;
      for (k = Math.max(0, pv.i - 3); k <= Math.min(out.length - 1, pv.i + 3); k++) {
        if (k === pv.i) continue;
        var cd = out[k];
        if (pv.type === "H") cd.h = r2(Math.max(Math.max(cd.o, cd.c), Math.min(cd.h, pv.price - 0.1)));
        else cd.l = r2(Math.min(Math.min(cd.o, cd.c), Math.max(cd.l, pv.price + 0.1)));
      }
    });
    return { candles: out, pivots: piv };
  }
  // Moves every candle from index k onward so that a gap opens before candle k.
  function applyGap(cs, pv, k, dir) {
    var prev = cs[k - 1], cur = cs[k], off, j;
    if (dir > 0) off = Math.max(4, Math.ceil(prev.h - cur.l + 1.5));
    else off = -Math.max(4, Math.ceil(cur.h - prev.l + 1.5));
    for (j = k; j < cs.length; j++) {
      cs[j].o = r2(cs[j].o + off); cs[j].h = r2(cs[j].h + off);
      cs[j].l = r2(cs[j].l + off); cs[j].c = r2(cs[j].c + off);
    }
    pv.forEach(function (x) { if (x.i >= k) x.price = r2(x.price + off); });
    return off;
  }
  // Swing high: a high above the N highs on each side. Swing low: the mirror.
  function detectSwings(cs, N) {
    var out = [], i, k;
    for (i = N; i < cs.length - N; i++) {
      var isH = true, isL = true;
      for (k = 1; k <= N; k++) {
        if (!(cs[i].h > cs[i - k].h && cs[i].h > cs[i + k].h)) isH = false;
        if (!(cs[i].l < cs[i - k].l && cs[i].l < cs[i + k].l)) isL = false;
      }
      if (isH) out.push({ i: i, type: "H", price: cs[i].h });
      if (isL) out.push({ i: i, type: "L", price: cs[i].l });
    }
    return out;
  }
  function labelMarks(marks) {
    var lastH = null, lastL = null;
    return marks.map(function (m) {
      var t, s;
      if (m.type === "H") {
        if (lastH === null) { t = "first high"; s = "H"; }
        else if (m.price > lastH) { t = "higher high"; s = "HH"; }
        else if (m.price < lastH) { t = "lower high"; s = "LH"; }
        else { t = "equal high"; s = "EH"; }
        lastH = m.price;
      } else {
        if (lastL === null) { t = "first low"; s = "L"; }
        else if (m.price > lastL) { t = "higher low"; s = "HL"; }
        else if (m.price < lastL) { t = "lower low"; s = "LL"; }
        else { t = "equal low"; s = "EL"; }
        lastL = m.price;
      }
      return { i: m.i, type: m.type, price: m.price, text: t, short: s };
    });
  }
  function structureOf(marks) {
    var hs = marks.filter(function (m) { return m.type === "H"; });
    var ls = marks.filter(function (m) { return m.type === "L"; });
    if (hs.length < 2 || ls.length < 2) return { name: null, hs: hs.length, ls: ls.length };
    var h1 = hs[hs.length - 2].price, h2 = hs[hs.length - 1].price;
    var l1 = ls[ls.length - 2].price, l2 = ls[ls.length - 1].price;
    if (h2 > h1 && l2 > l1) return { name: "uptrend", brk: l2, brkWhat: "most recent swing low", hs: hs.length, ls: ls.length };
    if (h2 < h1 && l2 < l1) return { name: "downtrend", brk: h2, brkWhat: "most recent swing high", hs: hs.length, ls: ls.length };
    return { name: "range or mixed", brk: null, hs: hs.length, ls: ls.length };
  }
  function sizing(capital, riskPct, entry, stop, capPct) {
    var budget = capital * riskPct / 100, rps = entry - stop;
    if (!(rps > 0) || !(entry > 0)) return null;
    var raw = Math.floor(budget / rps), cash = Math.floor(capital / entry), conc = Math.floor(capital * capPct / 100 / entry);
    var sh = Math.max(0, Math.min(raw, cash, conc));
    var bind = sh === conc ? "concentration cap" : sh === cash ? "cash cap" : "risk budget";
    return { budget: budget, rps: rps, raw: raw, cash: cash, conc: conc, shares: sh, bind: bind, loss: sh * rps };
  }

  // ====================================================================
  // candle-builder
  // ====================================================================
  D["candle-builder"] = function (p, host) {
    var mode = L.S(p, "mode", ""), data = L.S(p, "data", "");
    if (mode === "timeframe-switch") return cbTimeframes(p, host);
    if (data === "five-daily-candles") return cbWeek(p, host);
    if (p && p.range !== undefined) return cbRange(p, host);
    return cbTicks(p, host);
  };

  // --- ticks arrive one by one and one candle forms ---
  function cbTicks(p, host) {
    var ticks = L.list(p, "ticks", [501, 499, 510, 506]).slice(0, 40);
    var shown = 0, an;
    var b = L.box(host, "Build one candle from prices",
      "What to try: press Step to let one price arrive. Watch the open, high, low and close change. Then type your own prices.");
    var body = b.body;

    var lab = L.el("label", "cft-field");
    lab.appendChild(L.el("span", "cft-field-label", "Prices in the order they arrive (separate with commas)"));
    var inp = L.el("input", "cft-num");
    inp.type = "text"; inp.value = ticks.join(", ");
    lab.appendChild(inp);
    body.appendChild(lab);
    var btns = L.el("div", "cft-btn-row");
    body.appendChild(btns);
    function setTicks(arr) {
      ticks = arr.slice(0, 40);
      inp.value = ticks.join(", ");
      an.reset();
    }
    L.button(btns, "Use these prices", function () {
      var arr = String(inp.value).split(/[,\s]+/).map(function (x) { return parseFloat(x); })
        .filter(function (x) { return isFinite(x) && x > 0; });
      if (arr.length < 1) { live.textContent = "Type at least one price, for example 501, 499, 510, 506."; return; }
      setTicks(arr);
    });
    L.button(btns, "Chapter example (500, 497, 512, 509)", function () { setTicks([500, 497, 512, 509]); });
    L.button(btns, "Guided exercise (501, 499, 510, 506, 504)", function () { setTicks([501, 499, 510, 506, 504]); });

    var opts = {
      interval: 900, total: ticks.length,
      step: function (i) { shown = i + 1; render(); },
      reset: function () { opts.total = ticks.length; shown = 0; render(); }
    };
    an = L.anim(body, opts);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var tableDiv = L.el("div"); body.appendChild(tableDiv);
    var live = liveLine(body);

    function render() {
      opts.total = ticks.length;
      empty(chartDiv); empty(tableDiv);
      var W = 560, H = 250, left = 44, n = ticks.length;
      var g = frame(chartDiv, W, H, "Prices arriving one by one on the left and the candle they build on the right");
      var ext = L.extent(ticks, 0.15), sy = L.scale(ext[0], ext[1], H - 24, 22);
      yAxis(g, sy, ext[0], ext[1], left, W - 8);
      var px0 = left + 16, px1 = 330;
      function sx(i) { return n === 1 ? (px0 + px1) / 2 : px0 + (px1 - px0) * i / (n - 1); }
      g.text(px0, 12, "Prices (ticks) as they arrive", "cft-tx cft-tx-s");
      g.text(450, 12, "The candle so far", "cft-tx cft-tx-s", "middle");
      g.path(ticks.map(function (t, i) { return [sx(i), sy(t)]; }), "cft-pl-d");
      var i;
      if (shown > 1) g.path(ticks.slice(0, shown).map(function (t, k) { return [sx(k), sy(t)]; }), "cft-pl");
      for (i = 0; i < n; i++) {
        if (i < shown) g.circle(sx(i), sy(ticks[i]), 4, i === shown - 1 ? "cft-dot" : "cft-dot-b");
        if (n <= 14 || i % 2 === 0) g.text(sx(i), H - 8, String(i + 1), "cft-tx cft-tx-s", "middle");
      }
      g.line(350, 18, 350, H - 24, "cft-ln-d");
      var rows;
      if (shown === 0) {
        g.text(450, H / 2, "No price yet", "cft-tx", "middle");
        rows = [["Open (first price)", "-"], ["High (largest price)", "-"], ["Low (smallest price)", "-"], ["Close (last price)", "-"]];
        L.table(tableDiv, rows);
        live.textContent = "No price has arrived yet. Press Step or Play. " + ticks.length + " prices are waiting.";
        return;
      }
      var seen = ticks.slice(0, shown);
      var o = seen[0], c = seen[seen.length - 1], h = Math.max.apply(null, seen), l = Math.min.apply(null, seen);
      var cx = 450, bw = 46;
      L.candle(g, cx, bw, sy, { o: o, h: h, l: l, c: c });
      g.text(cx - bw / 2 - 4, sy(o) + 3, "O " + fx(o), "cft-tx cft-tx-s", "end");
      g.text(cx + bw / 2 + 4, sy(c) + 3, "C " + fx(c), "cft-tx cft-tx-s", "start");
      g.text(cx, sy(h) - 5, "H " + fx(h), "cft-tx cft-tx-s", "middle");
      g.text(cx, sy(l) + 12, "L " + fx(l), "cft-tx cft-tx-s", "middle");
      var st = stats(o, h, l, c);
      rows = [
        ["Open (first price)", rs(o)], ["High (largest price)", rs(h)],
        ["Low (smallest price)", rs(l)], ["Close (last price so far)", rs(c)],
        ["Body (open to close)", rs(st.body)], ["Upper shadow", rs(st.upper)],
        ["Lower shadow", rs(st.lower)], ["Range (high minus low)", rs(st.range), true],
        ["Direction", dirText(o, c)]
      ];
      L.table(tableDiv, rows);
      live.textContent = "Price " + shown + " of " + n + " is " + rs(ticks[shown - 1]) + ". Open " + rs(o) + ", high " + rs(h) +
        ", low " + rs(l) + ", close " + rs(c) + ". Check: body " + fx(st.body) + " + upper " + fx(st.upper) + " + lower " + fx(st.lower) +
        " = range " + fx(st.range) + ". The candle is " + dirWord(o, c) + " so far.";
    }
    render();
  }

  // --- the same minutes drawn at different timeframes ---
  function cbTimeframes(p, host) {
    var names = L.S(p, "timeframes", "1-minute, 5-minute, daily").split(",").map(trim).filter(nonEmpty);
    if (!names.length) names = ["1-minute", "5-minute", "daily"];
    var first = [
      { o: 500, h: 501, l: 499, c: 500.5 }, { o: 500.5, h: 503, l: 500, c: 502 },
      { o: 502, h: 504, l: 501, c: 501 }, { o: 501, h: 502, l: 498, c: 499 },
      { o: 499, h: 500, l: 497, c: 498.5 }
    ];
    var mins = first.concat(L.fakeCandles(55, 11, 498.5, 0.002));
    mins = mins.map(function (m) { return { o: r2(m.o), h: r2(m.h), l: r2(m.l), c: r2(m.c) }; });
    var total = mins.length;

    function groupSize(name) {
      var t = name.toLowerCase(), m = /(\d+)/.exec(t);
      if (/day|daily/.test(t)) return total;
      if (/hour/.test(t)) return Math.min(total, 60 * (m ? parseInt(m[1], 10) : 1));
      if (m) return Math.max(1, Math.min(total, parseInt(m[1], 10)));
      return 1;
    }
    function build(size) {
      var out = [], i, k;
      for (i = 0; i < total; i += size) {
        var part = mins.slice(i, i + size), hi = 0, lo = 0;
        for (k = 1; k < part.length; k++) {
          if (part[k].h > part[hi].h) hi = k;
          if (part[k].l < part[lo].l) lo = k;
        }
        out.push({ o: part[0].o, h: part[hi].h, l: part[lo].l, c: part[part.length - 1].c, from: i, to: i + part.length - 1, hi: i + hi, lo: i + lo });
      }
      return out;
    }
    var cur = 0, k;
    for (k = 0; k < names.length; k++) if (/(^|[^\d])5[\s-]*min/.test(names[k])) { cur = k; break; }
    var pick = 1;

    var b = L.box(host, "The same prices at different timeframes",
      "What to try: switch the timeframe and watch the same minutes join into fewer, longer candles. Then pick a candle and see which minutes built it.");
    var body = b.body;
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var tfBtns = names.map(function (nm, i) {
      var bt = L.button(btns, nm, function () { cur = i; pick = 1; update(); });
      return bt;
    });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var sl = null, slHost = L.el("div"); body.appendChild(slHost);
    var detail = L.el("div"); body.appendChild(detail);
    var live = liveLine(body);
    var exts = L.extent(mins.map(function (m) { return m.h; }).concat(mins.map(function (m) { return m.l; })), 0.06);

    function update() {
      tfBtns.forEach(function (bt, i) { setPressed(bt, i === cur); });
      var size = groupSize(names[cur]), cs = build(size);
      if (pick > cs.length) pick = cs.length;
      empty(slHost);
      sl = L.slider(slHost, {
        label: "Look at candle number", min: 1, max: cs.length, step: 1, value: pick,
        fmt: function (v) { return v + " of " + cs.length; },
        onInput: function (v) { pick = v; draw(cs, size); }
      });
      if (cs.length === 1) slHost.style.display = "none"; else slHost.style.display = "";
      draw(cs, size);
    }
    function draw(cs, size) {
      empty(chartDiv); empty(detail);
      var W = 560, H = 240, left = 44, right = 10;
      var g = frame(chartDiv, W, H, "The same made-up minutes drawn as " + cs.length + " candles");
      var sy = L.scale(exts[0], exts[1], H - 20, 10);
      yAxis(g, sy, exts[0], exts[1], left, W - right);
      var slot = (W - left - right) / cs.length, bw = Math.max(2, Math.min(40, slot * 0.6));
      cs.forEach(function (cd, i) {
        var x = left + slot * (i + 0.5);
        if (i === pick - 1) g.rect(x - slot / 2, 6, slot, H - 26, "cft-rc-band");
        L.candle(g, x, bw, sy, cd);
        if (cs.length <= 12) g.text(x, H - 6, String(i + 1), "cft-tx cft-tx-s", "middle");
      });
      var cd = cs[pick - 1], st = stats(cd.o, cd.h, cd.l, cd.c);
      L.table(detail, [
        ["Open (from minute " + (cd.from + 1) + ")", rs(cd.o)],
        ["High (largest high, from minute " + (cd.hi + 1) + ")", rs(cd.h)],
        ["Low (smallest low, from minute " + (cd.lo + 1) + ")", rs(cd.l)],
        ["Close (from minute " + (cd.to + 1) + ")", rs(cd.c)],
        ["Range (high minus low)", rs(st.range), true],
        ["Direction", dirText(cd.o, cd.c)]
      ]);
      if (size > 1 && size <= 5) {
        var rows = [], strong = [];
        mins.slice(cd.from, cd.to + 1).forEach(function (m, i) {
          var idx = cd.from + i, st2 = [];
          if (idx === cd.from) st2.push(1);
          if (idx === cd.hi) st2.push(2);
          if (idx === cd.lo) st2.push(3);
          if (idx === cd.to) st2.push(4);
          rows.push([String(idx + 1), fx(m.o), fx(m.h), fx(m.l), fx(m.c)]);
          strong.push(st2);
        });
        detail.appendChild(L.el("p", "cft-note", "The one-minute candles inside this candle. The numbers in bold are the ones it keeps."));
        mkTable(detail, ["Minute", "Open", "High", "Low", "Close"], rows, strong);
      } else if (size > 5) {
        L.note(detail, "This candle joins " + (cd.to - cd.from + 1) + " one-minute candles: minutes " + (cd.from + 1) + " to " + (cd.to + 1) + ".");
      }
      var span = size === 1 ? "minute " + (cd.from + 1) : "minutes " + (cd.from + 1) + " to " + (cd.to + 1);
      live.textContent = names[cur] + " candle " + pick + " (" + span + "): open " + rs(cd.o) + ", high " + rs(cd.h) + ", low " + rs(cd.l) +
        ", close " + rs(cd.c) + ", range " + rs(st.range) + ". It is " + dirWord(cd.o, cd.c) + ". The prices did not change. Only the way they are grouped did.";
    }
    update();
  }

  // --- five daily candles joined into one weekly candle ---
  function cbWeek(p, host) {
    var names = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    var days = [
      { o: 290, h: 296, l: 288, c: 294 }, { o: 294, h: 301, l: 293, c: 299 }, { o: 299, h: 300, l: 292, c: 293 },
      { o: 293, h: 297, l: 290, c: 291 }, { o: 291, h: 298, l: 289, c: 296 }
    ];
    var avg = 285, joined = 5, weekly = L.S(p, "timeframe", "daily") === "weekly", an;
    var b = L.box(host, "Five days, one week",
      "What to try: switch to the weekly view, or press Step to join the days one at a time. Then change the average and see if the filter still passes.");
    var body = b.body;
    var row = L.row(body), wk = null;
    if (L.S(p, "weeklyToggle", "on") !== "off") {
      wk = L.toggle(row, { label: "Show as one weekly candle", value: weekly, onChange: function (v) { weekly = v; render(); } });
    }
    var nf = L.numberField(row, { label: "10-week average (illustrative number)", value: avg, step: 1, onInput: function (v) { avg = v; render(); } });
    an = L.anim(body, {
      interval: 900, total: 5,
      step: function (i) { joined = i + 1; weekly = true; if (wk) wk.set(true); render(); },
      reset: function () { joined = 1; weekly = true; if (wk) wk.set(true); render(); }
    });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var detail = L.el("div"); body.appendChild(detail);
    var live = liveLine(body);
    var allV = [];
    days.forEach(function (d) { allV.push(d.h, d.l); });
    var ext0 = L.extent(allV, 0.1);

    function wcandle(n) {
      var part = days.slice(0, n), hi = 0, lo = 0, i;
      for (i = 1; i < part.length; i++) { if (part[i].h > part[hi].h) hi = i; if (part[i].l < part[lo].l) lo = i; }
      return { o: part[0].o, h: part[hi].h, l: part[lo].l, c: part[n - 1].c, hi: hi, lo: lo };
    }
    function render() {
      empty(chartDiv); empty(detail);
      var W = 560, H = 250, left = 44, right = 150;
      var g = frame(chartDiv, W, H, weekly ? "Five faded daily candles and the one weekly candle they make" : "Five daily candles for one made-up week");
      var ext = L.extent([ext0[0], ext0[1], avg], 0.02), sy = L.scale(ext[0], ext[1], H - 22, 10);
      yAxis(g, sy, ext[0], ext[1], left, W - 8);
      var w = wcandle(joined), px1 = weekly ? 330 : W - 14, slot = (px1 - left) / 5;
      var i;
      for (i = 0; i < 5; i++) {
        var x = left + slot * (i + 0.5);
        if (weekly && i >= joined) { g.text(x, H - 6, names[i], "cft-tx cft-tx-s", "middle"); continue; }
        L.candle(g, x, Math.min(26, slot * 0.5), sy, days[i], weekly ? "cft-fade" : "");
        g.text(x, H - 6, names[i], "cft-tx cft-tx-s", "middle");
      }
      g.line(left, sy(avg), W - 8, sy(avg), "cft-ln-hi");
      g.text(left + 4, sy(avg) - 4, "10-week average " + fx(avg), "cft-tx cft-tx-s");
      if (weekly) {
        g.line(left, sy(w.h), 450, sy(w.h), "cft-ln-d");
        g.line(left, sy(w.l), 450, sy(w.l), "cft-ln-d");
        var cx = 450;
        L.candle(g, cx, 54, sy, w);
        g.text(cx, 10, joined === 5 ? "One weekly candle" : "Week so far (" + joined + " days)", "cft-tx cft-tx-s", "middle");
        g.text(cx - 32, sy(w.o) + 3, "O " + fx(w.o), "cft-tx cft-tx-s", "end");
        g.text(cx + 32, sy(w.c) + 3, "C " + fx(w.c), "cft-tx cft-tx-s", "start");
        g.text(cx, sy(w.h) - 5, "H " + fx(w.h), "cft-tx cft-tx-s", "middle");
        g.text(cx, sy(w.l) + 12, "L " + fx(w.l), "cft-tx cft-tx-s", "middle");
        var st = stats(w.o, w.h, w.l, w.c);
        L.table(detail, [
          ["Open (" + names[0] + " open)", rs(w.o)],
          ["High (largest high, " + names[w.hi] + ")", rs(w.h)],
          ["Low (smallest low, " + names[w.lo] + ")", rs(w.l)],
          ["Close (" + names[joined - 1] + " close)", rs(w.c)],
          ["Range", rs(st.range), true],
          ["Direction", dirText(w.o, w.c)]
        ]);
        var pass = w.c > avg;
        live.textContent = (joined === 5 ? "Weekly candle" : "Week so far") + ": open " + rs(w.o) + ", high " + rs(w.h) + ", low " + rs(w.l) +
          ", close " + rs(w.c) + " (" + dirWord(w.o, w.c) + "). Illustrative filter: the weekly close must be above " + rs(avg) + ". " +
          rs(w.c) + (pass ? " is above it, so the filter passes." : " is not above it, so the filter does not pass.") +
          " A pass is not a forecast. It only says the rule allows a look.";
      } else {
        var rows = days.map(function (d, k) {
          return [names[k], fx(d.o), fx(d.h), fx(d.l), fx(d.c)];
        });
        mkTable(detail, ["Day", "Open", "High", "Low", "Close"], rows);
        live.textContent = "Five daily candles for one made-up week. The daily closes are " + days.map(function (d) { return fx(d.c); }).join(", ") +
          ". Switch to the weekly view to join them into one candle.";
      }
    }
    render();
  }

  // --- a range drawn as a band, with a breakout rule ---
  function cbRange(p, host) {
    var m = /^\s*([\d.]+)\s*-\s*([\d.]+)\s*$/.exec(L.S(p, "range", "300-310"));
    var lo = m ? parseFloat(m[1]) : 300, hi = m ? parseFloat(m[2]) : 310;
    if (!(hi > lo)) { lo = 300; hi = 310; }
    var W0 = hi - lo;
    var base = [
      [305, 307, 303, 306], [306, 309, 305, 308], [308, 310, 304, 305], [305, 306, 301, 302], [302, 305, 300, 304],
      [304, 311, 303, 308], [308, 309, 304, 305], [305, 306, 301, 303], [303, 307, 302, 306], [306, 310, 305, 309],
      [309, 313, 308.5, 312], [311.5, 312.5, 306, 307]
    ];
    var days = base.map(function (a) {
      function f(v) { return r2(lo + (v - 300) / 10 * W0); }
      return { o: f(a[0]), h: f(a[1]), l: f(a[2]), c: f(a[3]) };
    });
    var shown = 10, rule = "close", showTrade = false, an;
    var b = L.box(host, "A range and a breakout rule",
      "What to try: choose a rule, then press Step to add day 11 and day 12. See which days meet the rule and which breakouts hold.");
    var body = b.body;
    var row = L.row(body);
    L.select(row, {
      label: "Breakout rule", value: "close",
      options: [["close", "Close-based: the candle must close above the top"], ["touch", "Touch-based: price only needs to trade above the top"]],
      onChange: function (v) { rule = v; render(); }
    });
    L.toggle(row, { label: "Show the example entry and stop", value: false, onChange: function (v) { showTrade = v; render(); } });
    an = L.anim(body, {
      interval: 1100, total: 2,
      step: function (i) { shown = 11 + i; render(); },
      reset: function () { shown = 10; render(); }
    });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var detail = L.el("div"); body.appendChild(detail);
    var live = liveLine(body);
    var allV = [];
    days.forEach(function (d) { allV.push(d.h, d.l); });
    var ext = L.extent(allV, 0.1);
    var entry = days[10].c, stop = r2(entry - 0.4 * W0);

    function render() {
      empty(chartDiv); empty(detail);
      var W = 560, H = 260, left = 44, right = 10;
      var g = frame(chartDiv, W, H, "Twelve made-up days with the range drawn as a band");
      var sy = L.scale(ext[0], ext[1], H - 22, 10);
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      g.rect(left, sy(hi), W - right - left, sy(lo) - sy(hi), "cft-rc-band");
      g.line(left, sy(hi), W - right, sy(hi), "cft-ln-hi");
      g.text(W - right - 2, sy(hi) - 4, "Top of the range " + fx(hi), "cft-tx cft-tx-s", "end");
      g.text(W - right - 2, sy(lo) + 11, "Bottom " + fx(lo), "cft-tx cft-tx-s", "end");
      var slot = (W - left - right) / days.length, bw = Math.min(20, slot * 0.6), met = [], i;
      for (i = 0; i < shown; i++) {
        var x = left + slot * (i + 0.5), d = days[i];
        L.candle(g, x, bw, sy, d);
        g.text(x, H - 6, String(i + 1), "cft-tx cft-tx-s", "middle");
        var ok = rule === "close" ? d.c > hi : d.h > hi;
        if (ok) {
          met.push(i);
          g.path([[x, sy(d.h) - 16], [x - 5, sy(d.h) - 25], [x + 5, sy(d.h) - 25], [x, sy(d.h) - 16]], "cft-pl-o");
        }
      }
      if (showTrade && shown >= 11) {
        g.line(left, sy(entry), W - right, sy(entry), "cft-pl-d");
        g.line(left, sy(stop), W - right, sy(stop), "cft-pl-r");
        g.text(left + 4, sy(entry) - 3, "Example entry " + fx(entry), "cft-tx cft-tx-s");
        g.text(left + 4, sy(stop) + 11, "Example stop " + fx(stop), "cft-tx cft-tx-s");
      }
      var lines = [], falseOnes = [];
      met.forEach(function (i2) {
        var nxt = days[i2 + 1];
        if (i2 + 1 < shown && nxt && nxt.c <= hi) falseOnes.push(i2 + 1);
      });
      var rows = [];
      met.forEach(function (i2) {
        rows.push(["Day " + (i2 + 1), "high " + fx(days[i2].h) + ", close " + fx(days[i2].c) + (days[i2].c > hi ? " (closed above the top)" : " (closed inside the range)")]);
      });
      if (!rows.length) rows.push(["No day meets this rule yet", "-"]);
      L.table(detail, rows);
      var msg;
      if (!met.length) msg = "Under the " + (rule === "close" ? "close-based" : "touch-based") + " rule, no day has broken out yet.";
      else msg = "Under the " + (rule === "close" ? "close-based" : "touch-based") + " rule, the days that count: " + met.map(function (i2) { return "day " + (i2 + 1); }).join(", ") + ".";
      if (falseOnes.length) msg += " " + falseOnes.map(function (i2) { return "Day " + i2 + " closed back inside the range"; }).join(", ") + ", so that breakout did not hold (a false breakout).";
      if (rule === "touch") msg += " Day 6 only touched " + fx(days[5].h) + " and closed at " + fx(days[5].c) + ". The touch rule counts it. The close rule does not.";
      if (shown >= 11 && showTrade) {
        msg += " Example risk per share: " + fx(entry) + " minus " + fx(stop) + " = " + rs(entry - stop) + ".";
        if (shown >= 12) msg += " Day 12 closes at " + fx(days[11].c) + ", " + (days[11].c < stop ? "below" : "not below") + " the example stop.";
      }
      if (shown >= 11) msg += " Day 11 volume is 1,80,000 shares against a 20-day average of 1,00,000, so relative volume is 1.8. That is context only, not proof.";
      msg += " All numbers are made up.";
      live.textContent = msg;
    }
    render();
  }

  // ====================================================================
  // predict-next
  // ====================================================================
  D["predict-next"] = function (p, host) {
    var ctx = L.S(p, "context", "close beyond range top");
    var lo = 300, hi = 310;
    // Each scenario: breakout close above the top, then the next candle as offsets [o, h, l, c] from that close.
    var scen = [
      { seed: 3, b: 312, nx: [-0.5, 0.5, -6, -5] },
      { seed: 5, b: 311.5, nx: [0.3, 3.8, -0.2, 3] },
      { seed: 8, b: 313, nx: [-0.4, 0.6, -2.8, -2.2] },
      { seed: 12, b: 312, nx: [1, 4, 0.6, 3.5] },
      { seed: 14, b: 311, nx: [-1, 0.2, -5.5, -4] },
      { seed: 17, b: 312.5, nx: [0.2, 2.6, -1, 1.8] },
      { seed: 21, b: 311.8, nx: [0, 1.4, -0.6, 0.8] },
      { seed: 25, b: 312.2, nx: [0.8, 1.2, -2.4, -1.6] }
    ];
    function rangeCandles(sc) {
      var r = L.rng(sc.seed), out = [], px = lo + 5, i;
      if (sc.seed === 3) {
        return [[305, 307, 303, 306], [306, 309, 305, 308], [308, 310, 304, 305], [305, 306, 301, 302], [302, 305, 300, 304],
          [304, 308, 303, 305], [305, 309, 304, 308], [308, 309, 304, 305], [305, 307, 302, 306], [306, 310, 305, 309]].map(function (a) {
          return { o: a[0], h: a[1], l: a[2], c: a[3] };
        });
      }
      for (i = 0; i < 10; i++) {
        var o = px, c = lo + 1 + r() * (hi - lo - 2);
        var h = Math.min(hi, Math.max(o, c) + r() * 1.5), l = Math.max(lo, Math.min(o, c) - r() * 1.5);
        out.push({ o: r2(o), h: r2(h), l: r2(l), c: r2(c) });
        px = c;
      }
      return out;
    }
    function brk(sc, prev) {
      var o = prev.c;
      if (sc.seed === 3) return { o: 309, h: 313, l: 308.5, c: 312 };
      return { o: r2(o), h: r2(sc.b + 0.8), l: r2(Math.min(o, sc.b) - 0.6), c: sc.b };
    }
    var idx = 0, answered = false, right = 0, total = 0, ups = 0, downs = 0, nextBtn;
    var b = L.box(host, "Guess the next candle",
      "What to try: the last candle closed above the top of the range (" + ctx + "). Guess what the next candle does, then check. Try several charts.");
    var body = b.body;
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var bUp = L.button(btns, "Next candle closes higher than it opens", function () { guess("up"); });
    var bDn = L.button(btns, "Next candle closes lower than it opens", function () { guess("down"); });
    nextBtn = L.button(btns, "Next chart", function () { idx = (idx + 1) % scen.length; answered = false; render(); });
    var fb = L.el("div"); body.appendChild(fb);
    var live = liveLine(body);
    var data = {};

    function build() {
      var sc = scen[idx], rc = rangeCandles(sc), bk = brk(sc, rc[rc.length - 1]);
      var nx = { o: r2(sc.b + sc.nx[0]), h: r2(sc.b + sc.nx[1]), l: r2(sc.b + sc.nx[2]), c: r2(sc.b + sc.nx[3]) };
      if (sc.seed === 3) { nx = { o: 311.5, h: 312.5, l: 306, c: 307 }; }
      data = { rc: rc, bk: bk, nx: nx };
    }
    function render() {
      build();
      empty(chartDiv); empty(fb);
      var W = 560, H = 230, left = 44, right = 10, cs = data.rc.concat([data.bk]);
      var all = [lo, hi + 6];
      cs.forEach(function (c) { all.push(c.h, c.l); });
      all.push(data.nx.h, data.nx.l);
      var ext = L.extent(all, 0.06), sy = L.scale(ext[0], ext[1], H - 22, 10);
      var g = frame(chartDiv, W, H, "Ten made-up days inside a range, then a close above the top, then a question mark");
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      g.rect(left, sy(hi), W - right - left, sy(lo) - sy(hi), "cft-rc-band");
      g.line(left, sy(hi), W - right, sy(hi), "cft-ln-hi");
      g.text(left + 4, sy(hi) - 4, "Top of the range " + hi, "cft-tx cft-tx-s");
      var slot = (W - left - right) / 12, bw = Math.min(20, slot * 0.6);
      cs.forEach(function (c, i) {
        var x = left + slot * (i + 0.5);
        L.candle(g, x, bw, sy, c, i === 10 ? "cft-hl" : "");
        g.text(x, H - 6, String(i + 1), "cft-tx cft-tx-s", "middle");
      });
      var xn = left + slot * 11.5;
      if (answered) {
        L.candle(g, xn, bw, sy, data.nx);
        g.text(xn, H - 6, "12", "cft-tx cft-tx-s", "middle");
      } else {
        g.text(xn, sy(data.bk.c) + 4, "?", "cft-tx cft-tx-b", "middle");
      }
      bUp.disabled = answered; bDn.disabled = answered; nextBtn.disabled = !answered;
      live.textContent = answered ? "" : "Day 11 closed at " + rs(data.bk.c) + ", above the top of the range (" + rs(hi) + "). What will day 12 do? One close tells you very little. Make a guess.";
      if (!answered && total > 0) live.textContent += " So far: " + right + " right out of " + total + ".";
    }
    function guess(g2) {
      var nx = data.nx, up = nx.c > nx.o;
      var ok = (g2 === "up") === up;
      answered = true; total++; if (ok) right++;
      if (up) ups++; else downs++;
      render();
      var inside = nx.c <= hi;
      L.feedback(fb, ok, (ok ? "Your guess matches. " : "Your guess does not match. ") + "Day 12 opened at " + rs(nx.o) + " and closed at " + rs(nx.c) +
        ", so it closed " + (up ? "higher" : "lower") + " than it opened. " + (inside ? "It also closed back inside the range, which makes day 11 a false breakout." : "It closed above the top of the range again."));
      live.textContent = "You were right " + right + " out of " + total + ". In the charts you have seen, the next candle closed higher " + ups + " times and lower " + downs +
        " times. These charts are made up to show a mix. Even a good guess here is not a method. One close beyond the range tells you little about the next candle.";
    }
    render();
  };

  // ====================================================================
  // pattern-quiz
  // ====================================================================
  var PAIRS = [
    { a: { o: 100, h: 105, l: 99, c: 104 }, b: { o: 105, h: 106, l: 97, c: 98 }, ans: "bearish" },
    { a: { o: 100, h: 105, l: 99, c: 104 }, b: { o: 103, h: 108, l: 102, c: 107 }, ans: "none" },
    { a: { o: 110, h: 111, l: 103, c: 104 }, b: { o: 103, h: 113, l: 102, c: 112 }, ans: "bullish" },
    { a: { o: 105, h: 111, l: 104, c: 110 }, b: { o: 111, h: 112, l: 101, c: 102 }, ans: "bearish" },
    { a: { o: 100, h: 110, l: 99, c: 108 }, b: { o: 104, h: 106, l: 103, c: 105 }, ans: "none" },
    { a: { o: 110, h: 111, l: 105, c: 106 }, b: { o: 112, h: 113, l: 102, c: 103 }, ans: "none" },
    { a: { o: 55, h: 56, l: 51, c: 52 }, b: { o: 51, h: 58, l: 50, c: 57 }, ans: "bullish" },
    { a: { o: 200, h: 208, l: 199, c: 206 }, b: { o: 205, h: 206, l: 197, c: 199 }, ans: "none" }
  ];
  function judgePair(a, b) {
    var a1 = Math.min(a.o, a.c), a2 = Math.max(a.o, a.c), b1 = Math.min(b.o, b.c), b2 = Math.max(b.o, b.c);
    var covers = b1 <= a1 && b2 >= a2;
    var aGreen = a.c > a.o, aRed = a.c < a.o, bGreen = b.c > b.o, bRed = b.c < b.o;
    var opposite = (aGreen && bRed) || (aRed && bGreen);
    var ans = "none";
    if (covers && aGreen && bRed) ans = "bearish";
    else if (covers && aRed && bGreen) ans = "bullish";
    return { a1: a1, a2: a2, b1: b1, b2: b2, covers: covers, opposite: opposite, ans: ans, aGreen: aGreen, bGreen: bGreen, aRed: aRed, bRed: bRed };
  }
  function colourName(c) { return c.c > c.o ? "green, closed above its open" : c.c < c.o ? "red, closed below its open" : "flat"; }
  function pairChart(parent, a, b) {
    var W = 300, H = 170, g = frame(parent, W, H, "Two candles side by side, day 1 and day 2");
    var ext = L.extent([a.h, a.l, b.h, b.l], 0.15), sy = L.scale(ext[0], ext[1], H - 20, 10);
    var x1 = 90, x2 = 210, bw = 50;
    L.candle(g, x1, bw, sy, a); L.candle(g, x2, bw, sy, b);
    g.text(x1, H - 5, "Day 1", "cft-tx", "middle");
    g.text(x2, H - 5, "Day 2", "cft-tx", "middle");
    var a1 = Math.min(a.o, a.c), a2 = Math.max(a.o, a.c);
    g.line(x1, sy(a2), x2 + bw / 2 + 6, sy(a2), "cft-ln-d");
    g.line(x1, sy(a1), x2 + bw / 2 + 6, sy(a1), "cft-ln-d");
    g.text(W - 4, sy(a2) + 3, "top of day 1 body", "cft-tx cft-tx-s", "end");
    g.text(W - 4, sy(a1) + 11, "bottom of day 1 body", "cft-tx cft-tx-s", "end");
    return g;
  }
  D["pattern-quiz"] = function (p, host) {
    var N = Math.max(1, Math.min(PAIRS.length, Math.round(L.P(p, "pairs", 3))));
    var idx = 0, picked = null, right = 0, done = 0, answered = [];
    var b = L.box(host, "Name the formation",
      "What to try: look at the two candles. Pick a formation or pick none. Then check the bodies. Green means the close is above the open.");
    var body = b.body;
    L.note(body, "The rules used here. Bearish engulfing: day 1 is green, day 2 is red, and the day 2 body covers the day 1 body at both ends. Bullish engulfing: day 1 is red, day 2 is green, and the day 2 body covers the day 1 body at both ends. Other books may use other rules.");
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var valDiv = L.el("div"); body.appendChild(valDiv);
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var fb = L.el("div"); body.appendChild(fb);
    var nav = L.el("div", "cft-btn-row"); body.appendChild(nav);
    var live = liveLine(body);

    function show() {
      var pr = PAIRS[idx];
      empty(chartDiv); empty(valDiv); empty(btns); empty(fb); empty(nav);
      pairChart(chartDiv, pr.a, pr.b);
      mkTable(valDiv, ["", "Open", "High", "Low", "Close"], [
        ["Day 1", fx(pr.a.o), fx(pr.a.h), fx(pr.a.l), fx(pr.a.c)],
        ["Day 2", fx(pr.b.o), fx(pr.b.h), fx(pr.b.l), fx(pr.b.c)]
      ]);
      var opts = [["bearish", "Bearish engulfing"], ["bullish", "Bullish engulfing"], ["none", "None of these"]];
      opts.forEach(function (op) {
        L.button(btns, op[1], function () { choose(op[0]); });
      });
      live.textContent = "Pair " + (idx + 1) + " of " + N + ". Which rule is met? So far: " + right + " right out of " + done + ".";
    }
    function choose(c) {
      if (picked !== null) return;
      picked = c;
      var pr = PAIRS[idx], j = judgePair(pr.a, pr.b), ok = c === j.ans;
      done++; if (ok) right++;
      Array.prototype.forEach.call(btns.querySelectorAll ? btns.querySelectorAll("button") : [], function (bt) { bt.disabled = true; });
      var f = L.feedback(fb, ok, ok ? "Correct." : "Not quite.");
      var lines = [
        "Day 1 body runs from " + rs(j.a1) + " to " + rs(j.a2) + " (" + colourName(pr.a) + ").",
        "Day 2 body runs from " + rs(j.b1) + " to " + rs(j.b2) + " (" + colourName(pr.b) + ").",
        "Does the day 2 body cover the day 1 body at both ends? " + (j.covers ? "Yes." : "No. " + (j.b1 > j.a1 ? "Day 2 starts above the bottom of day 1." : "Day 2 stops below the top of day 1.")),
        "Are the colours opposite? " + (j.opposite ? "Yes." : "No.")
      ];
      lines.push(j.ans === "bearish" ? "Both checks pass, and day 2 is red. The bearish engulfing rule is met." :
        j.ans === "bullish" ? "Both checks pass, and day 2 is green. The bullish engulfing rule is met." :
        "At least one check fails, so neither rule is met.");
      lines.push("This describes the shapes of two past candles. It does not say what price did next.");
      lines.forEach(function (t) { f.appendChild(L.el("div", null, t)); });
      var last = idx >= N - 1;
      if (!last) L.button(nav, "Next pair", function () { idx++; picked = null; show(); });
      L.button(nav, last ? "Start again" : "Start again from pair 1", function () { idx = 0; picked = null; right = 0; done = 0; show(); });
      live.textContent = "You have " + right + " right out of " + done + ". " + (last ? "That was the last pair." : "Press Next pair to continue.");
    }
    show();
  };

  // ====================================================================
  // formation-checker
  // ====================================================================
  D["formation-checker"] = function (p, host) {
    var mode = "two";
    var s = { o1: 105, c1: 110, o2: 111, c2: 102, ho: 200, hc: 199, hl: 192, hh: 201 };
    var b = L.box(host, "Check a shape against its rule",
      "What to try: move the sliders. Watch the rule checks change. A rule only describes a shape. It does not say what price does next.");
    var body = b.body;
    var sel = L.select(body, {
      label: "What to check", value: "two",
      options: [["two", "Two candles: the engulfing rules"], ["one", "One candle: a hammer-shaped rule"]],
      onChange: function (v) { mode = v; twoDiv.style.display = v === "two" ? "" : "none"; oneDiv.style.display = v === "one" ? "" : "none"; render(); }
    });
    var twoDiv = L.el("div"), oneDiv = L.el("div");
    body.appendChild(twoDiv); body.appendChild(oneDiv);
    oneDiv.style.display = "none";
    function sl(parent, label, key, min, max) {
      L.slider(parent, { label: label, min: min, max: max, step: 1, value: s[key], fmt: function (v) { return rs(v); }, onInput: function (v) { s[key] = v; render(); } });
    }
    sl(twoDiv, "Day 1 open", "o1", 90, 125); sl(twoDiv, "Day 1 close", "c1", 90, 125);
    sl(twoDiv, "Day 2 open", "o2", 90, 125); sl(twoDiv, "Day 2 close", "c2", 90, 125);
    sl(oneDiv, "Open", "ho", 190, 210); sl(oneDiv, "Close", "hc", 190, 210);
    sl(oneDiv, "Low", "hl", 180, 210); sl(oneDiv, "High", "hh", 190, 215);
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var detail = L.el("div"); body.appendChild(detail);
    var live = liveLine(body);

    function render() {
      empty(chartDiv); empty(detail);
      var msg;
      if (mode === "two") {
        var a = { o: s.o1, c: s.c1, h: Math.max(s.o1, s.c1) + 1, l: Math.min(s.o1, s.c1) - 1 };
        var bb = { o: s.o2, c: s.c2, h: Math.max(s.o2, s.c2) + 1, l: Math.min(s.o2, s.c2) - 1 };
        pairChart(chartDiv, a, bb);
        var j = judgePair(a, bb);
        L.table(detail, [
          ["Day 1 body", rs(j.a1) + " to " + rs(j.a2) + " (" + colourName(a) + ")"],
          ["Day 2 body", rs(j.b1) + " to " + rs(j.b2) + " (" + colourName(bb) + ")"],
          ["Day 2 body covers day 1 body at both ends?", j.covers ? "Yes" : "No"],
          ["Colours are opposite?", j.opposite ? "Yes" : "No"],
          ["Result", j.ans === "bearish" ? "Bearish engulfing rule is met" : j.ans === "bullish" ? "Bullish engulfing rule is met" : "Neither rule is met", true]
        ]);
        msg = (j.ans === "none" ? "Neither engulfing rule is met." : (j.ans === "bearish" ? "The bearish" : "The bullish") + " engulfing rule is met.") +
          " Day 1 body " + fx(j.a1) + " to " + fx(j.a2) + ". Day 2 body " + fx(j.b1) + " to " + fx(j.b2) + ". The numbers are made up. A met rule does not say what comes next.";
      } else {
        var o = s.ho, c = s.hc, h = Math.max(s.hh, o, c), l = Math.min(s.hl, o, c);
        var W = 300, H = 190, g = frame(chartDiv, W, H, "One candle with its body and shadows");
        var ext = L.extent([h, l], 0.2), sy = L.scale(ext[0], ext[1], H - 14, 10);
        L.candle(g, 120, 50, sy, { o: o, h: h, l: l, c: c });
        var body2 = Math.abs(c - o), low = Math.min(o, c) - l, up = h - Math.max(o, c);
        g.text(160, sy(Math.max(o, c)) + 3, "body " + fx(body2), "cft-tx cft-tx-s");
        g.text(130, sy(l) - 4, "lower shadow " + fx(low), "cft-tx cft-tx-s");
        g.text(130, sy(h) + 10, "upper shadow " + fx(up), "cft-tx cft-tx-s");
        var lowOk = low > 0 && low >= 2 * body2, upOk = up <= body2;
        L.table(detail, [
          ["Body (open to close)", rs(body2)],
          ["Lower shadow (lowest body edge minus low)", rs(low)],
          ["Lower shadow against body", body2 > 0 ? fx(low / body2) + " times the body" : "the body is zero"],
          ["Upper shadow (high minus top of body)", rs(up)],
          ["Lower shadow at least twice the body?", lowOk ? "Yes" : "No"],
          ["Upper shadow small (here: not bigger than the body)?", upOk ? "Yes" : "No"],
          ["Result", lowOk && upOk ? "Hammer-shaped rule is met" : "Hammer-shaped rule is not met", true]
        ]);
        msg = "Body " + fx(body2) + ", lower shadow " + fx(low) + ", upper shadow " + fx(up) + ". " + (lowOk && upOk ? "This version of the hammer-shaped rule is met." : "This version of the hammer-shaped rule is not met.") +
          " Other authors use other rules. The shape does not say what price did next.";
      }
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // sr-zones
  // ====================================================================
  D["sr-zones"] = function (p, host) {
    var d = pathCandles([246, 251, 245, 252, 246.5, 250.5, 245.5, 258, 250.8, 256], [5, 4, 5, 4, 4, 4, 7, 5, 4], 21, 0.3);
    var cs = d.candles, n = cs.length, hist = 26;
    var swings = d.pivots.filter(function (x) { return x.type === "H" && x.i < hist; });
    var vis = hist, zone = null, tap = 0, checked = false, stopGap = 2, capital = 50000, riskPct = 1;
    var lo0 = 240, hi0 = 262;
    var b = L.box(host, "Mark a support and resistance zone",
      "What to try: tap the chart twice to mark the top and the bottom of a zone where price turned down. Or use the sliders. Then press Check, and play the chart forward.");
    var body = b.body;
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var row = L.row(body);
    var slTop = L.slider(row, {
      label: "Top of zone", min: lo0, max: hi0, step: 0.5, value: 252, fmt: function (v) { return rs(v); },
      onInput: function (v) { ensureZone(); zone.top = v; if (zone.bot > v) { zone.bot = v; slBot.set(v); } render(); }
    });
    var slBot = L.slider(row, {
      label: "Bottom of zone", min: lo0, max: hi0, step: 0.5, value: 250, fmt: function (v) { return rs(v); },
      onInput: function (v) { ensureZone(); zone.bot = v; if (zone.top < v) { zone.top = v; slTop.set(v); } render(); }
    });
    function ensureZone() { if (!zone) zone = { top: slTop.get(), bot: slBot.get() }; }
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    L.button(btns, "Check my zone", function () { ensureZone(); checked = true; render(); });
    L.button(btns, "Use the chapter's zone (249 to 252)", function () { zone = { top: 252, bot: 249 }; slTop.set(252); slBot.set(249); stopSl.set(2); stopGap = 2; checked = true; render(); });
    L.button(btns, "Clear the zone", function () { zone = null; tap = 0; checked = false; render(); });
    var an = L.anim(body, {
      interval: 600, total: n - hist,
      step: function (i) { vis = hist + i + 1; render(); },
      reset: function () { vis = hist; render(); }
    });
    L.note(body, "Press Play to see what price did after the part you marked. These later candles are made up.");
    var out = L.el("div"); body.appendChild(out);
    var sizeRow = L.row(body);
    var stopSl = L.slider(sizeRow, { label: "Stop below the zone", min: 0, max: 6, step: 0.5, value: stopGap, fmt: function (v) { return rs(v); }, onInput: function (v) { stopGap = v; render(); } });
    L.numberField(sizeRow, { label: "Capital (example)", value: capital, step: 1000, onInput: function (v) { capital = v; render(); } });
    L.numberField(sizeRow, { label: "Risk per trade in percent (example)", value: riskPct, step: 0.5, onInput: function (v) { riskPct = v; render(); } });
    var sizeOut = L.el("div"); body.appendChild(sizeOut);
    var live = liveLine(body);
    L.note(body, "Honest limit: zones are approximate. Another careful reader can draw a different zone on the same chart. A zone shows where price turned before. It does not promise a turn next time.");

    var W = 620, H = 300, left = 44, right = 12;
    var all = []; cs.forEach(function (c) { all.push(c.h, c.l); });
    var ext = L.extent(all, 0.05), sy = L.scale(ext[0], ext[1], H - 20, 10);
    var slot = (W - left - right) / n, bw = Math.max(3, Math.min(12, slot * 0.6));
    function inv(y) { return ext[0] + (H - 20 - y) / (H - 30) * (ext[1] - ext[0]); }

    function onTap(ev) {
      var pt = svgPoint(g0, ev), price = Math.round(inv(pt.y) * 2) / 2;
      price = L.clamp(price, lo0, hi0);
      ensureZone();
      if (tap % 2 === 0) { zone.top = price; zone.bot = price; } else { var t = Math.max(zone.top, price), bt = Math.min(zone.top, price); zone.top = t; zone.bot = bt; }
      tap++;
      slTop.set(zone.top); slBot.set(zone.bot);
      render();
    }
    var g0 = null;
    function render() {
      empty(chartDiv); empty(out); empty(sizeOut);
      var g = g0 = frame(chartDiv, W, H, "A made-up price chart. Tap twice to mark a zone.");
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      var i;
      if (zone) {
        g.rect(left, sy(zone.top), W - right - left, Math.max(2, sy(zone.bot) - sy(zone.top)), "cft-rc-band");
        g.line(left, sy(zone.top), W - right, sy(zone.top), "cft-ln-hi");
        g.line(left, sy(zone.bot), W - right, sy(zone.bot), "cft-ln-hi");
      }
      for (i = 0; i < vis; i++) L.candle(g, left + slot * (i + 0.5), bw, sy, cs[i]);
      if (vis < n) g.text(left + slot * (vis + 1), 20, "Later candles are hidden", "cft-tx cft-tx-s");
      if (checked && zone) {
        swings.forEach(function (sw) {
          var inside = sw.price >= zone.bot && sw.price <= zone.top;
          g.circle(left + slot * (sw.i + 0.5), sy(sw.price) - 8, 4, inside ? "cft-dot" : "cft-dot-b");
          g.text(left + slot * (sw.i + 0.5), sy(sw.price) - 14, fx(sw.price), "cft-tx cft-tx-s", "middle");
        });
      }
      var hit = g.rect(left, 0, W - left - right, H - 20, "cft-hit", { fill: "transparent", style: "cursor:crosshair" });
      hit.addEventListener("click", onTap);

      if (!zone) {
        live.textContent = "No zone yet. Tap the chart twice, or move a slider. " + swings.length + " swing highs are marked after you press Check.";
        out.appendChild(L.el("p", "cft-note", "Tip: look for a band of prices where the price turned down more than once."));
        return;
      }
      var inCount = 0;
      swings.forEach(function (sw) { if (sw.price >= zone.bot && sw.price <= zone.top) inCount++; });
      var touches = 0;
      for (i = 0; i < hist; i++) if (cs[i].h >= zone.bot && cs[i].l <= zone.top) touches++;
      var pct = (zone.top - zone.bot) / (ext[1] - ext[0]) * 100;
      var rows = [
        ["Your zone", rs(zone.bot) + " to " + rs(zone.top) + " (" + rs(zone.top - zone.bot) + " wide)"],
        ["Share of the chart's price range", L.pct(pct, 0)]
      ];
      var msg = "Your zone runs from " + rs(zone.bot) + " to " + rs(zone.top) + ", " + rs(zone.top - zone.bot) + " wide. ";
      if (checked) {
        rows.push(["Swing highs inside your zone", inCount + " of " + swings.length + " (" + swings.map(function (s2) { return fx(s2.price); }).join(", ") + ")"]);
        rows.push(["Candles that traded inside the zone", touches + " of " + hist]);
        msg += "It holds " + inCount + " of the " + swings.length + " swing highs (" + swings.map(function (s2) { return fx(s2.price); }).join(", ") + "). Price traded inside it on " + touches + " of " + hist + " candles. " +
          "A wider zone catches more turns but tells you less. ";
        if (vis > hist) {
          var br = -1, k;
          for (k = hist; k < vis; k++) if (cs[k].c > zone.top) { br = k; break; }
          if (br < 0) msg += "So far price has not closed above your zone. ";
          else {
            var rl = Infinity;
            for (k = br; k < vis; k++) rl = Math.min(rl, cs[k].l);
            rows.push(["Price closed above the zone on", "day " + (br + 1)]);
            if (vis >= n || rl < cs[br].l) rows.push(["Lowest price after that", rs(rl)]);
            msg += "Price closed above the zone on day " + (br + 1) + ". The lowest price after that, so far, is " + rs(rl) + ". ";
            if (rl <= zone.top && rl >= zone.bot - 0.5) msg += "That came back into your zone. In this made-up chart the old top acted as a floor. Real charts often do not. ";
            else if (rl > zone.top) msg += "Price turned above your zone, so a wider zone would have caught it. ";
            else msg += "Price fell below the bottom of your zone. ";
          }
        }
      } else msg += "Press Check to see where price turned. ";
      L.table(out, rows);

      // size block
      var entry = zone.top, stop = zone.bot - stopGap, z = sizing(capital, riskPct, entry, stop, 25);
      sizeOut.appendChild(L.el("p", "cft-note", "Example only: a hypothetical entry at the top of the zone and a stop below the bottom, as in the chapter. Capital and risk are example numbers. This is not advice."));
      if (!z) {
        sizeOut.appendChild(L.el("p", "cft-note", "The stop must be below the entry to work out a size."));
      } else {
        L.table(sizeOut, [
          ["Entry and stop", rs(entry) + " and " + rs(stop)],
          ["Risk budget (capital x risk percent)", rs(z.budget)],
          ["Risk per share", rs(z.rps)],
          ["Shares allowed by the risk budget", String(z.raw)],
          ["Shares allowed by cash", String(z.cash)],
          ["Shares allowed by the 25 percent cap", String(z.conc)],
          ["Shares (the smallest of the three)", z.shares + " (" + z.bind + ")", true],
          ["Planned loss if the stop is hit", rs(z.loss)]
        ]);
        msg += "With a stop " + rs(stopGap) + " below the zone, the size is " + z.shares + " shares and the planned loss is " + rs(z.loss) + ", limited by the " + z.bind + ".";
      }
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // swing-labeler
  // ====================================================================
  D["swing-labeler"] = function (p, host) {
    var d = pathCandles([210, 200, 230, 215, 245, 222, 238], [4, 6, 4, 7, 5, 4], 9, 0.6);
    var cs = d.candles, n = cs.length;
    var N = Math.max(1, Math.min(4, Math.round(L.P(p, "n", 2))));
    var vis = n, marks = [], ruleOn = false, startVis = 10;
    var b = L.box(host, "Find the swings and label them",
      "What to try: tap near the top of a candle to mark a swing high, or near the bottom to mark a swing low. The demo names each swing. Then compare with the rule and change N.");
    var body = b.body;
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var row = L.row(body);
    var slN = L.slider(row, { label: "N: candles needed on each side", min: 1, max: 4, step: 1, value: N, fmt: function (v) { return String(v); }, onInput: function (v) { N = v; render(); } });
    L.toggle(row, { label: "Show where the rule finds swings", value: false, onChange: function (v) { ruleOn = v; render(); } });
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    L.button(btns, "Copy the rule's swings into my marks", function () { marks = detectSwings(cs.slice(0, vis), N); render(); });
    L.button(btns, "Clear my marks", function () { marks = []; render(); });
    var an = L.anim(body, {
      interval: 600, total: n - startVis,
      step: function (i) { vis = startVis + i + 1; render(); },
      reset: function () { vis = startVis; render(); }
    });
    L.note(body, "To replay: press Reset, then Step or Play. Candles arrive one at a time. A swing can only be confirmed N candles later, and labels can change as new candles arrive.");
    var out = L.el("div"); body.appendChild(out);
    var live = liveLine(body);

    var W = 620, H = 300, left = 44, right = 12;
    var all = []; cs.forEach(function (c) { all.push(c.h, c.l); });
    var ext = L.extent(all, 0.06), sy = L.scale(ext[0], ext[1], H - 20, 14);
    var slot = (W - left - right) / n, bw = Math.max(4, Math.min(14, slot * 0.6));
    var g0 = null;

    function onTap(ev) {
      var pt = svgPoint(g0, ev), i = Math.floor((pt.x - left) / slot);
      i = L.clamp(i, 0, vis - 1);
      var type = Math.abs(pt.y - sy(cs[i].h)) <= Math.abs(pt.y - sy(cs[i].l)) ? "H" : "L";
      var at = -1, k;
      for (k = 0; k < marks.length; k++) if (marks[k].i === i && marks[k].type === type) at = k;
      if (at > -1) marks.splice(at, 1);
      else marks.push({ i: i, type: type, price: type === "H" ? cs[i].h : cs[i].l });
      render();
    }
    function render() {
      empty(chartDiv); empty(out);
      var g = g0 = frame(chartDiv, W, H, "A made-up chart. Tap a candle to mark a swing high or a swing low.");
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      var i;
      for (i = 0; i < vis; i++) {
        var x = left + slot * (i + 0.5);
        L.candle(g, x, bw, sy, cs[i]);
        if (n <= 20 || i % 2 === 0) g.text(x, H - 6, String(i + 1), "cft-tx cft-tx-s", "middle");
      }
      var rule = detectSwings(cs.slice(0, vis), N);
      if (ruleOn) rule.forEach(function (sw) {
        var c = g.circle(left + slot * (sw.i + 0.5), sy(sw.price) + (sw.type === "H" ? -6 : 6), 5, "cft-dot-b");
        c.setAttribute("style", "opacity:.35");
      });
      var vm = marks.filter(function (m) { return m.i < vis; }).sort(function (a, c) { return a.i - c.i; });
      var lab = labelMarks(vm);
      lab.forEach(function (m) {
        var x2 = left + slot * (m.i + 0.5), y2 = sy(m.price);
        g.circle(x2, y2, 3.5, "cft-dot");
        g.text(x2, y2 + (m.type === "H" ? -9 : 15), m.short, "cft-tx cft-tx-b", "middle");
      });
      var hit = g.rect(left, 0, W - left - right, H - 20, "cft-hit", { fill: "transparent", style: "cursor:pointer" });
      hit.addEventListener("click", onTap);

      var st = structureOf(lab);
      if (lab.length) L.table(out, lab.map(function (m) { return ["Day " + (m.i + 1) + ", swing " + (m.type === "H" ? "high" : "low"), rs(m.price) + " - " + m.text]; }));
      var rl = labelMarks(rule), rst = structureOf(rl);
      var hc = rule.filter(function (x) { return x.type === "H"; }).length, lc = rule.length - hc;
      var match = 0;
      vm.forEach(function (m) { rule.forEach(function (r) { if (r.i === m.i && r.type === m.type) match++; }); });
      var msg = "";
      if (!lab.length) msg = "You have not marked any swing yet. ";
      else if (st.name === null) msg = "You marked " + st.hs + " high" + (st.hs === 1 ? "" : "s") + " and " + st.ls + " low" + (st.ls === 1 ? "" : "s") + ". Mark at least two of each to name a structure. ";
      else {
        msg = "From your marks the structure is: " + st.name + ". ";
        if (st.brk !== null) msg += "The level to watch is " + rs(st.brk) + " (the " + st.brkWhat + "). A close beyond it would mean the pattern has failed. ";
        else msg += "Neither higher highs with higher lows, nor lower highs with lower lows. ";
      }
      msg += "With N = " + N + " the rule finds " + hc + " swing high" + (hc === 1 ? "" : "s") + " and " + lc + " swing low" + (lc === 1 ? "" : "s") + ", and reads the structure as: " + (rst.name || "not enough swings yet") + ".";
      if (lab.length) msg += " " + match + " of your " + vm.length + " marks match the rule.";
      if (vis < n) msg += " Showing " + vis + " of " + n + " candles. The last " + N + " are not confirmed yet.";
      msg += " Labels describe the past and can change.";
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // fib-tool
  // ====================================================================
  D["fib-tool"] = function (p, host) {
    var ratios = [0.236, 0.382, 0.5, 0.618, 0.786];
    var rname = ["23.6%", "38.2%", "50% (a convention)", "61.8%", "78.6%"];
    var which = "A", data = null, cs, n, lowIdx = 3, highIdx = 13, pickMode = "low", vis = 14, halfPct = 0, an;
    function load() {
      data = which === "B" ? pathCandles([212, 200, 260, 203, 213], [4, 10, 8, 5], 5, 1.0) : pathCandles([212, 200, 260, 231, 248], [4, 10, 6, 5], 3, 1.0);
      cs = data.candles; n = cs.length;
    }
    load();
    var b = L.box(host, "Fibonacci retracement levels",
      "What to try: tap the chart to pick the swing low and the swing high. Watch the five levels move. Then play the pullback and see how price meets the lines.");
    var body = b.body;
    var row = L.row(body);
    L.select(row, {
      label: "Made-up chart", value: "A",
      options: [["A", "Made-up chart A"], ["B", "Made-up chart B"]],
      onChange: function (v) { which = v; load(); lowIdx = 3; highIdx = 13; vis = 14; if (an) an.reset(); else render(); }
    });
    L.slider(row, { label: "Make each line a zone (percent of the swing, each side)", min: 0, max: 10, step: 1, value: 0, fmt: function (v) { return v + "%"; }, onInput: function (v) { halfPct = v; render(); } });
    var btns = L.el("div", "cft-btn-row"); body.appendChild(btns);
    var bLow = L.button(btns, "Tap picks the swing low", function () { pickMode = "low"; render(); });
    var bHigh = L.button(btns, "Tap picks the swing high", function () { pickMode = "high"; render(); });
    L.button(btns, "Use the chapter's swing (200 to 260)", function () { lowIdx = 3; highIdx = 13; render(); });
    L.button(btns, "Show the whole chart", function () { vis = n; an.setIndex(n - 14); render(); });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    an = L.anim(body, {
      interval: 600, total: 11,
      step: function (i) { vis = Math.min(n, 14 + i + 1); render(); },
      reset: function () { vis = 14; render(); }
    });
    var out = L.el("div"); body.appendChild(out);
    var live = liveLine(body);
    L.note(body, "Honest limit: the evidence that these levels predict price is contested. Two careful readers can pick different swing points and get different lines. Many traders may watch the same lines, but that is a hypothesis, not a fact. This book gives no hit rate for any level.");

    var W = 620, H = 300, left = 44, right = 140, g0 = null;
    function extentAll() {
      var v = []; cs.forEach(function (c) { v.push(c.h, c.l); });
      return L.extent(v, 0.06);
    }
    function render() {
      an.reset; // keep reference used
      empty(chartDiv); empty(out);
      setPressed(bLow, pickMode === "low"); setPressed(bHigh, pickMode === "high");
      var ext = extentAll(), sy = L.scale(ext[0], ext[1], H - 20, 10);
      var slot = (W - left - right) / 31, bw = Math.max(4, Math.min(11, slot * 0.6));
      var g = g0 = frame(chartDiv, W, H, "A made-up chart with Fibonacci retracement lines between a swing low and a swing high");
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      var i;
      for (i = 0; i < vis; i++) L.candle(g, left + slot * (i + 0.5), bw, sy, cs[i]);
      var lowP = cs[lowIdx].l, highP = cs[highIdx].h, range = highP - lowP, valid = lowIdx < highIdx && range > 0;
      var lx = left + slot * (lowIdx + 0.5), hx = left + slot * (highIdx + 0.5);
      g.circle(lx, sy(lowP), 4, "cft-dot"); g.circle(hx, sy(highP), 4, "cft-dot");
      g.text(lx + 6, sy(lowP) + 4, "Swing low " + fx(lowP), "cft-tx cft-tx-s");
      g.text(hx - 6, sy(highP) - 6, "Swing high " + fx(highP), "cft-tx cft-tx-s", "end");
      var rows = [], levels = [];
      if (valid) {
        var hw = range * halfPct / 100;
        ratios.forEach(function (r, k) {
          var lv = r2(highP - r * range);
          levels.push(lv);
          var y = sy(lv);
          if (hw > 0) g.rect(left, sy(lv + hw), W - right - left, Math.max(2, sy(lv - hw) - sy(lv + hw)), "cft-rc-band");
          g.line(left, y, W - right, y, "cft-ln-hi");
          g.text(W - right + 6, y + 3, rname[k].split(" ")[0] + "  " + fx(lv), "cft-tx cft-tx-s");
          rows.push([rname[k] + ": " + fx(highP) + " - (" + r + " x " + fx(range) + ")", rs(lv)]);
        });
      }
      var hit = g.rect(left, 0, W - left - right, H - 20, "cft-hit", { fill: "transparent", style: "cursor:crosshair" });
      hit.addEventListener("click", function (ev) {
        var pt = svgPoint(g, ev), k = L.clamp(Math.floor((pt.x - left) / slot), 0, vis - 1);
        if (pickMode === "low") lowIdx = k; else highIdx = k;
        render();
      });

      if (!valid) {
        live.textContent = "Pick a swing low that comes before the swing high, and make sure the high is above the low. Then the levels appear.";
        return;
      }
      L.table(out, [["Swing low", rs(lowP)], ["Swing high", rs(highP)], ["Range (high minus low)", rs(range), true]].concat(rows));
      var msg = "Swing low " + rs(lowP) + ", swing high " + rs(highP) + ", range " + rs(range) + ". The 38.2% level is " + rs(levels[1]) + ", the 50% level is " + rs(levels[2]) + " and the 61.8% level is " + rs(levels[3]) + ". ";
      if (halfPct > 0) {
        var ivs = levels.map(function (lv) { return [Math.max(lowP, lv - range * halfPct / 100), Math.min(highP, lv + range * halfPct / 100)]; }).sort(function (a, c) { return a[0] - c[0]; });
        var cover = 0, curS = null, curE = null;
        ivs.forEach(function (iv) {
          if (curS === null) { curS = iv[0]; curE = iv[1]; }
          else if (iv[0] <= curE) curE = Math.max(curE, iv[1]);
          else { cover += curE - curS; curS = iv[0]; curE = iv[1]; }
        });
        if (curS !== null) cover += curE - curS;
        msg += "With zones " + halfPct + "% each side, the five zones cover " + L.pct(cover / range * 100, 0) + " of the swing's height, so a pause inside a zone can happen by chance. ";
      }
      if (vis > highIdx + 1) {
        var m = Infinity, mi = -1, k2;
        for (k2 = highIdx + 1; k2 < vis; k2++) if (cs[k2].l < m) { m = cs[k2].l; mi = k2; }
        var near = 0, nd = Infinity;
        levels.forEach(function (lv, k3) { if (Math.abs(lv - m) < nd) { nd = Math.abs(lv - m); near = k3; } });
        if (m < Math.min.apply(null, levels)) msg += "The lowest price after the swing high is " + rs(m) + " (day " + (mi + 1) + "). That is below all five lines. ";
        else msg += "The lowest price after the swing high is " + rs(m) + " (day " + (mi + 1) + "). The nearest line is the " + rname[near].split(" ")[0] + " line at " + rs(levels[near]) + ", " + rs(nd) + " away. ";
        msg += "One pause near one line proves nothing. Real charts show both stories.";
      } else msg += "Press Play to see the pullback.";
      live.textContent = msg;
    }
    render();
  };

  // ====================================================================
  // chart-id-quiz
  // ====================================================================
  function buildChartSet() {
    var out = [];
    // Chart 1: uptrend with a gap up on day 12
    var d1 = pathCandles([100, 112, 106, 122, 116, 130, 124, 133], [5, 4, 6, 4, 6, 4, 4], 31, 0.6);
    applyGap(d1.candles, d1.pivots, 11, 1);
    var pv1 = d1.pivots;
    out.push({
      title: "Chart 1", cs: d1.candles, band: null,
      qs: [
        { q: "What is the structure of this chart?", opts: ["Uptrend", "Downtrend", "Range"], ans: 0,
          why: "The swing highs rise (" + fx(pv1[0].price) + ", " + fx(pv1[2].price) + ", " + fx(pv1[4].price) + ") and the swing lows rise (" + fx(pv1[1].price) + ", " + fx(pv1[3].price) + ", " + fx(pv1[5].price) + "). Higher highs and higher lows describe an uptrend." },
        { q: "Is there a gap? If so, on which day?", opts: ["No gap", "Day 5", "Day 12", "Day 20"], ans: 2,
          why: "Day 12 has a lowest price of " + rs(d1.candles[11].l) + ", above the highest price of day 11, which is " + rs(d1.candles[10].h) + ". Nothing traded in between. That is a gap up." },
        { q: "In an uptrend, which level is the structure-break level (the one to watch)?",
          opts: [rs(pv1[4].price) + " (the last swing high)", rs(pv1[5].price) + " (the most recent swing low)", rs(pv1[1].price) + " (the first swing low)"], ans: 1,
          why: "In an uptrend, the most recent swing low is the last higher low. A close below it means the pattern of higher lows has failed. That level is " + rs(pv1[5].price) + "." }
      ]
    });
    // Chart 2: range, then a close above the top
    var base2 = [[105, 107, 103, 106], [106, 109, 105, 108], [108, 110, 104, 105], [105, 106, 101, 102], [102, 105, 100, 104],
      [104, 111, 103, 108], [108, 109, 104, 105], [105, 106, 101, 103], [103, 107, 102, 106], [106, 110, 105, 109],
      [109, 113, 108, 112], [112, 113, 107, 108]];
    var c2 = base2.map(function (a) { return { o: a[0], h: a[1], l: a[2], c: a[3] }; });
    out.push({
      title: "Chart 2", cs: c2, band: { lo: 100, hi: 110 },
      qs: [
        { q: "Look at the first 10 candles inside the band. What is the structure?", opts: ["Uptrend", "Downtrend", "Range"], ans: 2,
          why: "The highs and lows move sideways between about Rs 100 and Rs 110. Neither higher highs with higher lows, nor lower highs with lower lows. That is a range." },
        { q: "Day 6 traded up to Rs 111 and closed at Rs 108. Under a close-based rule, is day 6 a breakout?", opts: ["Yes", "No"], ans: 1,
          why: "A close-based rule needs the close above the top of the range (Rs 110). Day 6 closed at Rs 108, inside the range. Only a touch-based rule would count it." },
        { q: "Day 11 closed above the top at Rs 112. Day 12 closed back at Rs 108. What do we call day 11 now?", opts: ["A breakout that held", "A false breakout", "A gap"], ans: 1,
          why: "Price closed beyond the level, then closed back inside the range. The move did not hold. That is a false breakout. It also is not a gap, because day 12 opened at Rs 112, where day 11 closed." }
      ]
    });
    // Chart 3: downtrend with a gap down on day 12
    var d3 = pathCandles([150, 138, 145, 128, 136, 118, 124, 112], [5, 4, 6, 4, 6, 4, 4], 37, 0.6);
    applyGap(d3.candles, d3.pivots, 11, -1);
    var pv3 = d3.pivots;
    out.push({
      title: "Chart 3", cs: d3.candles, band: null,
      qs: [
        { q: "What is the structure of this chart?", opts: ["Uptrend", "Downtrend", "Range"], ans: 1,
          why: "The swing highs fall (" + fx(pv3[1].price) + ", " + fx(pv3[3].price) + ", " + fx(pv3[5].price) + ") and the swing lows fall (" + fx(pv3[0].price) + ", " + fx(pv3[2].price) + ", " + fx(pv3[4].price) + "). Lower highs and lower lows describe a downtrend." },
        { q: "Is there a gap? If so, on which day?", opts: ["No gap", "Day 3", "Day 12", "Day 25"], ans: 2,
          why: "Day 12 has a highest price of " + rs(d3.candles[11].h) + ", below the lowest price of day 11, which is " + rs(d3.candles[10].l) + ". Nothing traded in between. That is a gap down." },
        { q: "For a downtrend view, which level is the structure-break level?",
          opts: [rs(pv3[5].price) + " (the most recent swing high)", rs(pv3[4].price) + " (the most recent swing low)", rs(pv3[1].price) + " (the first swing high)"], ans: 0,
          why: "In a downtrend, the most recent swing high is the last lower high. A close above it means the pattern of lower highs has failed. That level is " + rs(pv3[5].price) + "." }
      ]
    });
    return out;
  }
  D["chart-id-quiz"] = function (p, host) {
    var set = buildChartSet(), cur = 0, answers = [[], [], []];
    var b = L.box(host, "Read a chart you have not seen",
      "What to try: look at the chart first. Mark the highs and lows in your head. Then answer each question and read the reason.");
    var body = b.body;
    var tabs = L.el("div", "cft-btn-row"); body.appendChild(tabs);
    var tabBtns = set.map(function (c, i) { return L.button(tabs, c.title, function () { cur = i; render(); }); });
    var chartDiv = L.el("div"); body.appendChild(chartDiv);
    var qDiv = L.el("div"); body.appendChild(qDiv);
    var live = liveLine(body);

    function drawChart() {
      empty(chartDiv);
      var c = set[cur], cs = c.cs, nn = cs.length, W = 620, H = 270, left = 44, right = 12;
      var all = []; cs.forEach(function (x) { all.push(x.h, x.l); });
      if (c.band) all.push(c.band.lo, c.band.hi);
      var ext = L.extent(all, 0.06), sy = L.scale(ext[0], ext[1], H - 22, 10);
      var g = frame(chartDiv, W, H, "An unseen made-up chart of " + nn + " days");
      yAxis(g, sy, ext[0], ext[1], left, W - right);
      if (c.band) {
        g.rect(left, sy(c.band.hi), W - right - left, sy(c.band.lo) - sy(c.band.hi), "cft-rc-band");
        g.line(left, sy(c.band.hi), W - right, sy(c.band.hi), "cft-ln-hi");
        g.text(left + 4, sy(c.band.hi) - 4, "Top of the band " + c.band.hi, "cft-tx cft-tx-s");
        g.text(left + 4, sy(c.band.lo) + 11, "Bottom of the band " + c.band.lo, "cft-tx cft-tx-s");
      }
      var slot = (W - left - right) / nn, bw = Math.max(4, Math.min(14, slot * 0.6)), step = Math.ceil(nn / 16), i;
      for (i = 0; i < nn; i++) {
        var x = left + slot * (i + 0.5);
        L.candle(g, x, bw, sy, cs[i]);
        if (i % step === 0 || i === 11) g.text(x, H - 6, String(i + 1), "cft-tx cft-tx-s", "middle");
      }
    }
    function score() {
      var s = 0, t = 0;
      set.forEach(function (c, ci) { c.qs.forEach(function (q, qi) { t++; if (answers[ci][qi] === q.ans) s++; }); });
      return { s: s, t: t };
    }
    function render() {
      tabBtns.forEach(function (bt, i) { setPressed(bt, i === cur); });
      drawChart(); empty(qDiv);
      var c = set[cur];
      c.qs.forEach(function (q, qi) {
        var wrap = L.el("div", "cft-q");
        wrap.appendChild(L.el("p", "cft-tx-b", "Question " + (qi + 1) + ". " + q.q));
        var row = L.el("div", "cft-btn-row"); wrap.appendChild(row);
        var done = answers[cur][qi] !== undefined;
        q.opts.forEach(function (op, oi) {
          var bt = L.button(row, op, function () { if (answers[cur][qi] === undefined) { answers[cur][qi] = oi; render(); } });
          bt.disabled = done;
          if (done && oi === answers[cur][qi]) bt.className = "cft-btn cft-chip-on";
        });
        if (done) {
          var ok = answers[cur][qi] === q.ans;
          L.feedback(wrap, ok, (ok ? "Correct. " : "Not quite. ") + q.why);
        }
        qDiv.appendChild(wrap);
      });
      var sc = score();
      live.textContent = "Score so far: " + sc.s + " correct out of " + sc.t + " questions across the three charts. Passing shows you can read these items. It does not show that any chart method works.";
    }
    render();
  };
})();
