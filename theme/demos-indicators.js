(function () {
  "use strict";
  var L = window.CFT_LIB, D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  // =====================================================================
  // Indicator demos: indicator-playground, indicator-disagree, lab-position-size.
  // All data is made up. Nothing here is advice or a forecast.
  // =====================================================================

  // ---------- small helpers ----------
  function clr(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function t2(x) { return String(+x.toFixed(2)); }
  function t4(x) { return String(+x.toFixed(4)); }
  function m(x) { return L.inr(x, 2); }
  function ni(x) { return Math.round(x).toLocaleString("en-IN"); }
  function sgn(x, d) { return (x >= 0 ? "+" : "-") + Math.abs(x).toFixed(d === undefined ? 2 : d); }
  function sumRange(a, i0, i1) { var s = 0, i; for (i = i0; i <= i1; i++) s += a[i]; return s; }
  function listStr(a, f) {
    f = f || t2;
    var s = a.map(f);
    if (s.length > 8) s = s.slice(0, 3).concat(["..."], s.slice(-2));
    return s.join(" + ");
  }
  function parseNums(s) {
    return String(s).split(",").map(function (x) { return parseFloat(x); }).filter(function (x) { return !isNaN(x); });
  }
  function onOff(p, k, d) {
    var v = L.S(p, k, d ? "on" : "off").toLowerCase();
    return v === "on" || v === "true" || v === "yes" || v === "1";
  }
  function textField(parent, label, value, onInput) {
    var wrap = L.el("label", "cft-field");
    wrap.appendChild(L.el("span", "cft-field-label", label));
    var i = L.el("input", "cft-num");
    i.type = "text"; i.value = value;
    i.addEventListener("input", function () { onInput(i.value); });
    wrap.appendChild(i); parent.appendChild(wrap);
    return i;
  }
  // A real table with a header row. rows: [[cell,...]]
  function mkTable(parent, head, rows, boldLast) {
    var t = L.el("table", "cft-table");
    var tr = L.el("tr");
    head.forEach(function (h) { tr.appendChild(L.el("th", null, h)); });
    t.appendChild(tr);
    rows.forEach(function (r, ri) {
      var row = L.el("tr", boldLast && ri === rows.length - 1 ? "cft-strong" : "");
      r.forEach(function (c) { row.appendChild(L.el("td", null, c)); });
      t.appendChild(row);
    });
    parent.appendChild(t);
    return t;
  }

  // ---------- indicator maths ----------
  function smaArr(a, n) {
    var out = [], i;
    for (i = 0; i < a.length; i++) out.push(n >= 1 && i >= n - 1 ? sumRange(a, i - n + 1, i) / n : null);
    return out;
  }
  // EMA. seed "sma": first value is the SMA of the first n values. seed "first": first value is the first value.
  function emaFrom(a, n, seed) {
    var out = [], i, f = -1, k = 2 / (n + 1);
    for (i = 0; i < a.length; i++) { out.push(null); if (f < 0 && a[i] !== null && a[i] !== undefined) f = i; }
    if (f < 0) return out;
    if (seed === "first") {
      out[f] = a[f];
      for (i = f + 1; i < a.length; i++) out[i] = k * a[i] + (1 - k) * out[i - 1];
      return out;
    }
    var e = f + n - 1;
    if (e >= a.length) return out;
    out[e] = sumRange(a, f, e) / n;
    for (i = e + 1; i < a.length; i++) out[i] = k * a[i] + (1 - k) * out[i - 1];
    return out;
  }
  function rsiVal(g, l) {
    if (l === 0) return g === 0 ? 50 : 100;
    return 100 - 100 / (1 + g / l);
  }
  function rsiCalc(c, n) {
    var o = { rsi: [], ag: [], al: [], chg: [] }, i;
    for (i = 0; i < c.length; i++) {
      o.chg.push(i ? c[i] - c[i - 1] : null); o.rsi.push(null); o.ag.push(null); o.al.push(null);
    }
    if (c.length <= n || n < 1) return o;
    var g = 0, ls = 0;
    for (i = 1; i <= n; i++) { g += Math.max(0, o.chg[i]); ls += Math.max(0, -o.chg[i]); }
    o.ag[n] = g / n; o.al[n] = ls / n;
    for (i = n + 1; i < c.length; i++) {
      o.ag[i] = (o.ag[i - 1] * (n - 1) + Math.max(0, o.chg[i])) / n;
      o.al[i] = (o.al[i - 1] * (n - 1) + Math.max(0, -o.chg[i])) / n;
    }
    for (i = n; i < c.length; i++) o.rsi[i] = rsiVal(o.ag[i], o.al[i]);
    return o;
  }
  function atrCalc(h, l, c, n) {
    var o = { tr: [], atr: [] }, i;
    for (i = 0; i < c.length; i++) {
      o.atr.push(null);
      o.tr.push(i ? Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1])) : null);
    }
    if (c.length <= n || n < 1) return o;
    o.atr[n] = sumRange(o.tr, 1, n) / n;
    for (i = n + 1; i < c.length; i++) o.atr[i] = (o.atr[i - 1] * (n - 1) + o.tr[i]) / n;
    return o;
  }
  function bollCalc(c, n, k, sample) {
    var o = { mid: [], sd: [], up: [], lo: [] }, i, j;
    for (i = 0; i < c.length; i++) {
      var ok = i >= n - 1 && n >= 1 && !(sample && n < 2);
      if (!ok) { o.mid.push(null); o.sd.push(null); o.up.push(null); o.lo.push(null); continue; }
      var mean = sumRange(c, i - n + 1, i) / n, sq = 0;
      for (j = i - n + 1; j <= i; j++) sq += (c[j] - mean) * (c[j] - mean);
      var sd = Math.sqrt(sq / (sample ? n - 1 : n));
      o.mid.push(mean); o.sd.push(sd); o.up.push(mean + k * sd); o.lo.push(mean - k * sd);
    }
    return o;
  }
  function obvCalc(c, v, start) {
    var o = [], i;
    for (i = 0; i < c.length; i++) {
      if (i === 0) o.push(start);
      else o.push(o[i - 1] + (c[i] > c[i - 1] ? v[i] : c[i] < c[i - 1] ? -v[i] : 0));
    }
    return o;
  }
  function vwapCalc(h, l, c, v, session) {
    var o = { tp: [], pv: [], cpv: [], cv: [], vwap: [], start: [] }, i, cpv = 0, cv = 0;
    for (i = 0; i < c.length; i++) {
      var st = i % session === 0;
      if (st) { cpv = 0; cv = 0; }
      var tp = (h[i] + l[i] + c[i]) / 3;
      cpv += tp * v[i]; cv += v[i];
      o.tp.push(tp); o.pv.push(tp * v[i]); o.cpv.push(cpv); o.cv.push(cv);
      o.vwap.push(cv > 0 ? cpv / cv : null); o.start.push(st);
    }
    return o;
  }
  // Average of the PREVIOUS n days (today is not in its own average).
  function relVolCalc(v, n) {
    var o = { avg: [], rv: [] }, i;
    for (i = 0; i < v.length; i++) {
      if (n >= 1 && i >= n) {
        var a = sumRange(v, i - n, i - 1) / n;
        o.avg.push(a); o.rv.push(a > 0 ? v[i] / a : null);
      } else { o.avg.push(null); o.rv.push(null); }
    }
    return o;
  }
  function firstIdx(a) { var i; for (i = 0; i < a.length; i++) if (a[i] !== null && a[i] !== undefined) return i; return -1; }

  // ---------- made-up data ----------
  // A smooth-ish made-up chart: flat, rise, flat, fall, rise. Same seed gives the same chart.
  function makeSeries(n, seed, start) {
    var r = L.rng(seed), px = start, d = { o: [], h: [], l: [], c: [], v: [] }, i, j;
    var segs = [[0.14, 0], [0.26, 1], [0.14, 0], [0.2, -1], [0.26, 1]], drift = [];
    segs.forEach(function (s, si) {
      var cnt = si === segs.length - 1 ? n - drift.length : Math.round(s[0] * n);
      for (j = 0; j < cnt; j++) drift.push(s[1] * 0.011);
    });
    for (i = 0; i < n; i++) {
      var ret = drift[i] + (r() - 0.5) * 0.012;
      var o = px, c = Math.max(1, +(o * (1 + ret)).toFixed(2));
      var h = +(Math.max(o, c) * (1 + r() * 0.005)).toFixed(2);
      var l = +(Math.min(o, c) * (1 - r() * 0.005)).toFixed(2);
      var v = Math.round((8000 + r() * 7000 + Math.abs(ret) * 500000) / 100) * 100;
      d.o.push(o); d.h.push(h); d.l.push(l); d.c.push(c); d.v.push(v);
      px = c;
    }
    return d;
  }
  // The volume chapter's chart: 20 quiet days (average exactly 1,00,000), a breakout day of 1,80,000, then 10 more.
  function relVolData() {
    var pre = [92, 98, 95, 101, 90, 97, 99, 94, 96, 98, 102, 105, 99, 108, 103, 106, 101, 104, 107, 105];
    var post = [130, 120, 110, 105, 100, 98, 102, 95, 100, 97];
    var v = pre.concat([180], post).map(function (x) { return x * 1000; });
    var c = [300, 301, 299, 302, 303, 301, 300, 304, 305, 303, 302, 304, 306, 305, 303, 304, 306, 307, 305, 306, 312,
      313, 311, 314, 315, 313, 312, 314, 316, 315, 317];
    var d = { o: [], h: [], l: [], c: c, v: v };
    c.forEach(function (x, i) { d.o.push(i ? c[i - 1] : x); d.h.push(x + 1.5); d.l.push(x - 1.5); });
    return d;
  }

  // =====================================================================
  // Chart drawing. One function for every demo.
  // spec = {N, n, focus, panes:[{title,h,legend:[{cls,name}],items:[...],lo,hi,fmt,zeroBase}], unit, hiddenMsg}
  // item types: close, candles, line, band, bars, hist, hline, marks, vlines
  // =====================================================================
  var CW = 640, PADL = 54, PADR = 10;
  function chartHeight(panes) {
    var h = 14;
    panes.forEach(function (pn) { h += 16 + pn.h + 4; });
    return h;
  }
  function pickIndex(svgEl, ev, N) {
    var r = svgEl.getBoundingClientRect();
    if (!r.width) return -1;
    var x = ((ev.clientX - r.left) / r.width) * CW;
    var i = Math.floor((x - PADL) / ((CW - PADL - PADR) / N));
    return i < 0 || i >= N ? -1 : i;
  }
  function drawChart(g, spec) {
    g.clear();
    var N = spec.N, n = spec.n, step = (CW - PADL - PADR) / N;
    var bw = Math.max(2, Math.min(14, step * 0.62));
    function sx(i) { return PADL + (i + 0.5) * step; }
    var y0 = 0, tops = [];
    spec.panes.forEach(function (pn) {
      var top = y0 + 16, bot = top + pn.h;
      tops.push([top, bot]);
      // title and legend
      g.text(2, y0 + 11, pn.title || "", "cft-tx cft-tx-b");
      var lx = 2 + (pn.title || "").length * 6.4 + 12;
      (pn.legend || []).forEach(function (lg) {
        g.line(lx, y0 + 8, lx + 16, y0 + 8, lg.cls);
        g.text(lx + 20, y0 + 11, lg.name, "cft-tx cft-tx-s");
        lx += 26 + lg.name.length * 5.2;
      });
      g.line(PADL, bot, CW - PADR, bot, "cft-ln");
      g.line(PADL, top, PADL, bot, "cft-ln");
      if (pn.hidden) {
        g.text((PADL + CW - PADR) / 2, (top + bot) / 2, pn.hidden, "cft-tx cft-tx-s", "middle");
        y0 = bot + 4;
        return;
      }
      // value range
      var lo = Infinity, hi = -Infinity, rN = spec.scaleAll ? N : n, i;
      function take(v) { if (v !== null && v !== undefined && isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; } }
      pn.items.forEach(function (it) {
        for (i = 0; i < rN; i++) {
          if (it.type === "candles") { take(it.h[i]); take(it.l[i]); }
          else if (it.type === "band") { take(it.up[i]); take(it.lo[i]); }
          else if (it.vals) take(it.vals[i]);
        }
        if (it.type === "hline" && !it.noScale) take(it.y);
      });
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      if (pn.lo !== undefined) lo = pn.lo;
      if (pn.hi !== undefined) hi = pn.hi;
      if (pn.zeroBase) lo = 0;
      if (pn.symmetric) { var mx = Math.max(Math.abs(lo), Math.abs(hi)); lo = -mx; hi = mx; }
      if (pn.lo === undefined && !pn.zeroBase && !pn.symmetric) { var pd = (hi - lo) * 0.08 || 1; lo -= pd; hi += pd; }
      else if (pn.zeroBase || pn.symmetric) { var pd2 = (hi - lo) * 0.06 || 1; hi += pd2; if (pn.symmetric) lo -= pd2; }
      if (hi === lo) hi = lo + 1;
      var sy = L.scale(hi, lo, top + 2, bot - 2);
      var fmt = pn.fmt || t2;
      g.text(PADL - 4, top + 8, fmt(hi), "cft-tx cft-tx-s", "end");
      g.text(PADL - 4, bot - 2, fmt(lo), "cft-tx cft-tx-s", "end");
      if (pn.symmetric) g.line(PADL, sy(0), CW - PADR, sy(0), "cft-ln-d");

      pn.items.forEach(function (it) {
        var pts, k;
        function flush() {
          if (pts.length > 1) g.path(pts, it.cls || "cft-pl");
          else if (pts.length === 1) g.circle(pts[0][0], pts[0][1], 3, it.dotCls || "cft-dot");
          pts = [];
        }
        if (it.type === "line" || it.type === "close") {
          pts = [];
          for (i = 0; i < n; i++) {
            if (it.vals[i] === null || it.vals[i] === undefined) flush();
            else pts.push([sx(i), sy(it.vals[i])]);
          }
          flush();
          if (N <= 12) {
            for (i = 0; i < n; i++) {
              if (it.vals[i] !== null && it.vals[i] !== undefined) g.circle(sx(i), sy(it.vals[i]), 3, it.dotCls || (it.type === "close" ? "cft-dot-b" : "cft-dot"));
            }
          }
        } else if (it.type === "candles") {
          for (i = 0; i < n; i++) L.candle(g, sx(i), bw, sy, { o: it.o[i], h: it.h[i], l: it.l[i], c: it.c[i] });
        } else if (it.type === "band") {
          var run = [];
          var closeRun = function () {
            if (run.length === 1) {
              g.rect(sx(run[0]) - bw / 2, sy(it.up[run[0]]), bw, sy(it.lo[run[0]]) - sy(it.up[run[0]]), "cft-rc-band");
              g.line(sx(run[0]) - bw, sy(it.up[run[0]]), sx(run[0]) + bw, sy(it.up[run[0]]), "cft-hl");
              g.line(sx(run[0]) - bw, sy(it.lo[run[0]]), sx(run[0]) + bw, sy(it.lo[run[0]]), "cft-hl");
            } else if (run.length > 1) {
              var d = "";
              for (k = 0; k < run.length; k++) d += (k ? "L" : "M") + sx(run[k]).toFixed(1) + " " + sy(it.up[run[k]]).toFixed(1) + " ";
              for (k = run.length - 1; k >= 0; k--) d += "L" + sx(run[k]).toFixed(1) + " " + sy(it.lo[run[k]]).toFixed(1) + " ";
              g.mk("path", { d: d + "Z", "class": "cft-rc-band" });
              var u = run.map(function (q) { return [sx(q), sy(it.up[q])]; });
              var w = run.map(function (q) { return [sx(q), sy(it.lo[q])]; });
              g.path(u, "cft-pl-d"); g.path(w, "cft-pl-d");
            }
            run = [];
          };
          for (i = 0; i < n; i++) {
            if (it.up[i] === null || it.up[i] === undefined) closeRun(); else run.push(i);
          }
          closeRun();
        } else if (it.type === "bars") {
          var base = sy(0 < lo ? lo : 0);
          for (i = 0; i < n; i++) {
            if (it.vals[i] === null || it.vals[i] === undefined) continue;
            var yy = sy(it.vals[i]);
            g.rect(sx(i) - bw / 2, yy, bw, base - yy, i === it.hiIdx ? "cft-rc" : (it.cls || "cft-rc-grey"));
          }
        } else if (it.type === "hist") {
          var zy = sy(0);
          for (i = 0; i < n; i++) {
            var hv = it.vals[i];
            if (hv === null || hv === undefined) continue;
            var hy = sy(hv);
            g.rect(sx(i) - bw / 2, Math.min(hy, zy), bw, Math.abs(hy - zy), hv >= 0 ? "cft-rc-up" : "cft-rc-down");
          }
          (it.cross || []).forEach(function (ci) { if (ci < n) g.circle(sx(ci), zy, 3, "cft-dot"); });
        } else if (it.type === "hline") {
          g.line(PADL, sy(it.y), CW - PADR, sy(it.y), "cft-ln-d");
          if (it.label) g.text(CW - PADR - 2, sy(it.y) - 2, it.label, "cft-tx cft-tx-s", "end");
        } else if (it.type === "vlines") {
          it.idx.forEach(function (ii) { if (ii < n) g.line(sx(ii) - step / 2, top, sx(ii) - step / 2, bot, it.cls || "cft-ln-d"); });
        }
      });
      y0 = bot + 4;
    });
    // day numbers
    var every = N <= 12 ? 1 : Math.ceil(N / 10), yb = y0 + 8;
    for (var xi = 0; xi < N; xi += every) g.text(sx(xi), yb, String(xi + 1), "cft-tx cft-tx-s", "middle");
    g.text(PADL - 4, yb, spec.unit || "Day", "cft-tx cft-tx-s", "end");
    // focus marker
    if (spec.focus !== null && spec.focus !== undefined && spec.focus >= 0 && spec.focus < n) {
      var fx = sx(spec.focus);
      spec.panes.forEach(function (pn, pi) { g.line(fx, tops[pi][0], fx, tops[pi][1], "cft-ln-hi"); });
    }
    // lag marks
    (spec.marks || []).forEach(function (mk) {
      if (mk.idx >= n) return;
      spec.panes.forEach(function (pn, pi) {
        if (pi === 0) g.line(sx(mk.idx), tops[pi][0], sx(mk.idx), tops[pi][1], mk.cls);
      });
      g.text(sx(mk.idx), tops[0][0] + 9 + (mk.row || 0) * 10, mk.label, "cft-tx cft-tx-s", "middle");
    });
  }

  // =====================================================================
  // indicator-playground
  // =====================================================================
  var ALIAS = { "relative-volume": "relative-volume", relvol: "relative-volume", "rel-volume": "relative-volume",
    "relative volume": "relative-volume", relativevolume: "relative-volume", bollinger: "bollinger", bb: "bollinger",
    "bollinger-bands": "bollinger" };
  var KNOWN = ["sma", "ema", "rsi", "macd", "bollinger", "obv", "vwap", "relative-volume", "atr"];

  D["indicator-playground"] = function (p, host) {
    var ind = L.S(p, "indicator", "sma").toLowerCase();
    ind = ALIAS[ind] || ind;
    if (KNOWN.indexOf(ind) < 0) ind = "sma";
    var NAMES = { sma: "Simple moving average (SMA)", ema: "Exponential moving average (EMA)", rsi: "RSI",
      macd: "MACD", bollinger: "Bollinger Bands", obv: "On-balance volume (OBV)", vwap: "VWAP",
      "relative-volume": "Relative volume", atr: "Average True Range (ATR)" };
    var HINTS = {
      sma: "Slide the window longer and shorter. Press Play to watch the bars arrive one by one. Look at how late the line turns after the price does.",
      ema: "Look at the EMA and the SMA on the same prices. Switch the starting value and see how the first days change. Press Play to watch the bars arrive.",
      rsi: "Press Play and watch RSI move as the bars arrive. Switch the 70 and 30 lines on and off. Look at what RSI does in a long rise.",
      macd: "Press Play and watch the bars under the zero line. Each time the bars change sign, that is a crossover. Count them in a flat stretch.",
      bollinger: "Switch between population and sample SD. Change k. Click a bar on the chart to see the steps for that day.",
      obv: "Press Play and watch the OBV line. It goes up on a day with a higher close, and down on a lower close. Turn VWAP on too.",
      vwap: "Press Play. VWAP restarts at the start of each session. Click a bar on the chart to see the steps for that bar.",
      "relative-volume": "Find the tall volume bar. Click it, then read the relative volume. Change the lookback and watch the average move.",
      atr: "Press Play and watch ATR. Change the stop multiple. Click a bar to see how its true range was found.",
    };
    var b = L.box(host, NAMES[ind] + " (made-up numbers)", "What to try: " + (p.hint || HINTS[ind]));
    var body = b.body;

    // ----- manual MACD calculator (no chart) -----
    if (ind === "macd" && onOff(p, "manual", false)) { macdManual(p, body); return; }

    // ----- data -----
    var ex = { c: L.list(p, "closes", null), h: L.list(p, "highs", null), l: L.list(p, "lows", null), v: L.list(p, "volumes", null) };
    var built = !ex.c;
    var dat, session, unit = "Day", defFocus = null;
    if (!built) {
      dat = fitData(ex.c, ex.h, ex.l, ex.v);
      session = L.P(p, "session", dat.c.length);
    } else if (ind === "relative-volume") {
      dat = relVolData(); session = dat.c.length; defFocus = 20;
    } else {
      var nb = Math.round(L.clamp(L.P(p, "bars", 60), 20, 120));
      dat = makeSeries(nb, ind === "vwap" ? 23 : 11, 100);
      session = ind === "vwap" ? Math.max(5, Math.round(L.P(p, "session", 20))) : nb;
      if (ind === "vwap") unit = "Bar";
    }
    if (ex.v && built) { dat.v = ex.v.slice(0, dat.c.length); while (dat.v.length < dat.c.length) dat.v.push(10000); }
    if (p.focus !== undefined) defFocus = Math.max(0, L.P(p, "focus", 1) - 1);
    var N0 = dat.c.length;

    // ----- settings -----
    var short = N0 < 35;
    var st = {
      period: Math.round(L.P(p, "period", L.P(p, "lookback", 0))),
      k: L.P(p, "k", 2),
      sample: L.S(p, "sdMode", "population").toLowerCase().indexOf("sample") === 0,
      fast: Math.round(L.P(p, "fast", short ? 3 : 12)),
      slow: Math.round(L.P(p, "slow", short ? 6 : 26)),
      sig: Math.round(L.P(p, "signal", short ? 3 : 9)),
      mult: L.P(p, "mult", 2),
      seed: L.S(p, "emaSeed", "sma").toLowerCase().indexOf("first") === 0 ? "first" : "sma",
      levels: onOff(p, "levels", true),
      vwapOn: onOff(p, "vwap", ind === "vwap"),
      lag: onOff(p, "lag", (ind === "sma" || ind === "ema") && !onOff(p, "predict", false)),
      focus: defFocus,
      n: N0,
      plan: L.P(p, "plan", 50),
      entry: L.P(p, "entry", 0),
    };
    if (!st.period) {
      st.period = ind === "sma" || ind === "ema" ? (built ? 10 : Math.min(5, N0))
        : ind === "rsi" ? (built ? 14 : Math.min(4, Math.max(2, N0 - 1)))
        : ind === "bollinger" ? (built ? 20 : Math.min(5, N0))
        : ind === "atr" ? (built ? 14 : Math.min(3, Math.max(2, N0 - 1)))
        : ind === "relative-volume" ? 20 : 5;
    }
    var cmpTokens = L.S(p, "compareTo", "").toLowerCase().split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s; });
    var volPane = onOff(p, "volumePane", ind === "obv" || ind === "vwap" || ind === "relative-volume");
    var canPredict = onOff(p, "predict", false) && ["sma", "ema", "rsi", "macd", "bollinger"].indexOf(ind) >= 0;
    var showSeedToggle = ind === "ema" || cmpTokens.indexOf("ema") >= 0;
    var useCandles = ind === "atr" || ind === "vwap";

    var DEFSL = { sma: ["period"], ema: ["period"], rsi: ["period"], macd: ["fast", "slow", "signal"],
      bollinger: ["period", "k"], atr: ["period", "mult"], "relative-volume": ["period"], obv: [], vwap: [] };
    var sl = L.S(p, "sliders", "") ? L.S(p, "sliders", "").toLowerCase().split(",").map(function (s) {
      s = s.trim(); return s === "lookback" ? "period" : s;
    }) : DEFSL[ind];
    if (!built && p.sliders === undefined && !onOff(p, "edit", false)) sl = DEFSL[ind];

    // ----- layout (fixed once) -----
    var res = {};
    var sub = ind === "rsi" || ind === "macd" || ind === "atr" || ind === "obv" || ind === "relative-volume";
    var layout = [];
    layout.push({ id: "price", h: ind === "relative-volume" ? 80 : (sub || volPane ? 140 : 190) });
    if (ind === "relative-volume") layout.push({ id: "vol", h: 90 });
    else if (volPane) layout.push({ id: "vol", h: 70 });
    if (ind === "rsi") layout.push({ id: "rsi", h: 90 });
    if (ind === "macd") layout.push({ id: "macd", h: 100 });
    if (ind === "atr") layout.push({ id: "atr", h: 80 });
    if (ind === "obv") layout.push({ id: "obv", h: 80 });
    if (ind === "relative-volume") layout.push({ id: "rv", h: 80 });
    var g = L.svg(body, CW, chartHeight(layout));
    g.svg.setAttribute("aria-label", NAMES[ind] + " drawn on made-up prices. Click a bar to see the steps for that day.");
    g.svg.style.cursor = "pointer";

    // ----- controls -----
    var ctr = L.row(body);
    var sliders = {};
    function cap(name) {
      var N = st.data.c.length;
      if (name === "period") {
        var mx = ind === "sma" || ind === "ema" ? 50 : ind === "bollinger" ? 40 : ind === "relative-volume" ? 25 : 30;
        return [2, Math.max(2, Math.min(mx, ind === "rsi" || ind === "atr" ? N - 1 : N))];
      }
      return null;
    }
    st.data = dat;
    function addSlider(name, o) {
      if (sl.indexOf(name) < 0) return;
      sliders[name] = L.slider(ctr, o);
    }
    var pr = cap("period") || [2, 30];
    addSlider("period", { label: ind === "relative-volume" ? "Lookback (days)" : "Window length (days)", min: pr[0], max: pr[1], step: 1,
      value: L.clamp(st.period, pr[0], pr[1]), fmt: function (v) { return v + " days"; },
      onInput: function (v) { st.period = v; update(true); } });
    addSlider("k", { label: "k (how many SDs)", min: 0.5, max: 3, step: 0.5, value: st.k, fmt: function (v) { return "k = " + v; },
      onInput: function (v) { st.k = v; update(false); } });
    addSlider("mult", { label: "Stop multiple (x ATR)", min: 1, max: 4, step: 0.5, value: st.mult, fmt: function (v) { return v + " x ATR"; },
      onInput: function (v) { st.mult = v; update(false); } });
    addSlider("fast", { label: "Fast EMA", min: 2, max: 20, step: 1, value: st.fast, fmt: function (v) { return v + " days"; },
      onInput: function (v) { st.fast = v; update(true); } });
    addSlider("slow", { label: "Slow EMA", min: 4, max: 40, step: 1, value: st.slow, fmt: function (v) { return v + " days"; },
      onInput: function (v) { st.slow = v; update(true); } });
    addSlider("signal", { label: "Signal line", min: 2, max: 15, step: 1, value: st.sig, fmt: function (v) { return v + " days"; },
      onInput: function (v) { st.sig = v; update(true); } });
    var tg = L.el("div", "cft-btn-row");
    body.appendChild(tg);
    if (ind === "bollinger") {
      L.select(tg, { label: "Standard deviation", value: st.sample ? "sample" : "population",
        options: [["population", "Population SD (divide by N)"], ["sample", "Sample SD (divide by N - 1)"]],
        onChange: function (v) { st.sample = v === "sample"; update(false); } });
    }
    if (showSeedToggle) {
      L.select(tg, { label: "EMA starting value", value: st.seed,
        options: [["sma", "First SMA (common choice)"], ["first", "First close"]],
        onChange: function (v) { st.seed = v; update(false); } });
    }
    if (ind === "rsi") L.toggle(tg, { label: "Show the 70 and 30 lines", value: st.levels, onChange: function (v) { st.levels = v; update(false); } });
    if (ind === "obv") L.toggle(tg, { label: "Show VWAP on the price", value: st.vwapOn, onChange: function (v) { st.vwapOn = v; update(false); } });
    if ((ind === "sma" || ind === "ema") && N0 >= 12) {
      L.toggle(tg, { label: "Mark the turns and show the lag", value: st.lag, onChange: function (v) { st.lag = v; update(false); } });
    }
    var inputs = {};
    if (onOff(p, "edit", false)) {
      var er = L.el("div", "cft-fields"); body.appendChild(er);
      inputs.c = textField(er, "Closes (comma between numbers, you can change them)", dat.c.join(", "), reparse);
      if (ex.h) inputs.h = textField(er, "Highs", dat.h.join(", "), reparse);
      if (ex.l) inputs.l = textField(er, "Lows", dat.l.join(", "), reparse);
      if (ex.v || ind === "vwap" || ind === "obv") inputs.v = textField(er, "Volumes", dat.v.join(", "), reparse);
    }
    function reparse() {
      var c = parseNums(inputs.c.value);
      if (c.length < 2) return;
      c = c.slice(0, 120);
      st.data = fitData(c, inputs.h ? parseNums(inputs.h.value) : null, inputs.l ? parseNums(inputs.l.value) : null,
        inputs.v ? parseNums(inputs.v.value) : null);
      if (ind === "vwap" || ind === "obv") session = st.data.c.length;
      st.n = st.data.c.length; st.focus = null;
      if (sliders.period) {
        var q = cap("period"); sliders.period.input.max = q[1]; sliders.period.input.min = q[0];
        st.period = Math.round(L.clamp(st.period, q[0], q[1])); sliders.period.set(st.period);
      }
      update(true);
    }

    // ----- animation -----
    var anim = null, pred = null;
    var animHost = L.el("div"); body.appendChild(animHost);
    var predHost = L.el("div"); body.appendChild(predHost);
    var focusSl = null;
    var stepsHost = L.el("div", "cft-steps"); body.appendChild(stepsHost);
    var lagHost = L.el("div"); body.appendChild(lagHost);
    var out = L.el("p", "cft-note cft-big-line"); out.setAttribute("aria-live", "polite");
    out.style.fontWeight = "600"; out.style.opacity = "1";
    body.appendChild(out);
    var honest = L.el("p", "cft-note", p.limit || "An indicator is a formula on past prices. It describes the past. It does not forecast. All numbers here are made up.");
    body.appendChild(honest);

    function compute() {
      var d = st.data, c = d.c, i, r = {};
      var P = Math.max(1, st.period);
      r.fv = 0;
      if (ind === "sma" || ind === "ema") {
        r.sma = smaArr(c, P); r.ema = emaFrom(c, P, st.seed);
        r.main = ind === "sma" ? r.sma : r.ema;
        r.over = [];
        r.over.push({ vals: r.main, cls: ind === "sma" ? "cft-pl-o" : "cft-pl-g", name: P + "-day " + (ind === "sma" ? "SMA" : "EMA") });
        var cls = ["cft-pl-r", "cft-pl-d", "cft-pl-g", "cft-pl-o"], ci = 0;
        cmpTokens.forEach(function (tk) {
          var arr, nm;
          if (tk === "sma" || tk === "ema") {
            if (tk === ind) return;
            arr = tk === "sma" ? r.sma : r.ema; nm = P + "-day " + tk.toUpperCase();
            r.over.push({ vals: arr, cls: tk === "sma" ? "cft-pl-o" : "cft-pl-g", name: nm });
          } else {
            var q = Math.round(parseFloat(tk)); if (!q || q < 1) return;
            arr = smaArr(c, q); nm = q + "-day SMA";
            r.over.push({ vals: arr, cls: cls[ci % cls.length], name: nm, period: q }); ci++;
          }
        });
        r.fv = 0; r.over.forEach(function (o) { r.fv = Math.max(r.fv, firstIdx(o.vals)); });
        if (r.fv < 0) r.fv = N0;
      } else if (ind === "rsi") {
        r.rsi = rsiCalc(c, P); r.fv = firstIdx(r.rsi.rsi);
      } else if (ind === "macd") {
        var fa = Math.max(1, st.fast), sa = Math.max(fa + 1, st.slow);
        r.fa = fa; r.sa = sa;
        r.ef = emaFrom(c, fa, "sma"); r.es = emaFrom(c, sa, "sma");
        r.line = c.map(function (x, j) { return r.ef[j] !== null && r.es[j] !== null ? r.ef[j] - r.es[j] : null; });
        r.sig = emaFrom(r.line, Math.max(1, st.sig), "sma");
        r.hist = r.line.map(function (x, j) { return x !== null && r.sig[j] !== null ? x - r.sig[j] : null; });
        r.cross = [];
        for (i = 1; i < c.length; i++) {
          if (r.hist[i] !== null && r.hist[i - 1] !== null && ((r.hist[i] > 0) !== (r.hist[i - 1] > 0)) && r.hist[i] !== 0) r.cross.push(i);
        }
        r.fv = firstIdx(r.hist);
      } else if (ind === "bollinger") {
        r.b = bollCalc(c, P, st.k, st.sample); r.fv = firstIdx(r.b.mid);
      } else if (ind === "atr") {
        r.a = atrCalc(d.h, d.l, c, P); r.fv = firstIdx(r.a.atr);
      } else if (ind === "obv") {
        r.obv = obvCalc(c, d.v, L.P(p, "obvStart", 0)); r.fv = 0;
        r.vw = vwapCalc(d.h, d.l, c, d.v, Math.max(1, session));
      } else if (ind === "vwap") {
        r.vw = vwapCalc(d.h, d.l, c, d.v, Math.max(1, session)); r.fv = 0;
      } else if (ind === "relative-volume") {
        r.rv = relVolCalc(d.v, P); r.fv = firstIdx(r.rv.rv);
      }
      if (r.fv < 0) r.fv = d.c.length;
      return r;
    }

    function curFocus() {
      var n = st.n;
      var f = st.focus === null || st.focus === undefined ? n - 1 : st.focus;
      return Math.max(0, Math.min(n - 1, f));
    }

    function update(rebuildAnim) {
      res = compute();
      if (canPredict) setupPred(!!rebuildAnim);
      if (rebuildAnim && !pred) setupAnim();
      render();
    }

    function setupAnim() {
      var N = st.data.c.length;
      var start = Math.max(2, Math.min(N, res.fv + 1));
      if (anim) { anim.pause(); }
      clr(animHost);
      var total = N - start + 1;
      anim = L.anim(animHost, {
        interval: N > 20 ? 220 : 700, total: total,
        step: function (i) { st.n = start + i; st.focus = null; render(); },
        reset: function () { st.n = start; st.focus = null; render(); },
      });
      anim.setIndex(total);
      st.n = N;
      var tip = L.el("div", "cft-hint", "Press Play to watch the bars arrive one at a time. Step moves one bar. Reset starts again.");
      animHost.appendChild(tip);
      if (!focusSl) {
        focusSl = L.slider(animHost, { label: "Day to explain in the steps below", min: 1, max: N, step: 1, value: N,
          fmt: function (v) { return "Day " + v; },
          onInput: function (v) { st.focus = Math.min(v, st.n) - 1; render(); } });
      } else { animHost.appendChild(focusSl.el); }
      focusSl.input.max = N;
    }

    // ----- predict mode -----
    function qDef(r, day) {
      var c = st.data.c, P = st.period;
      if (ind === "sma" || ind === "ema") {
        var a = r.main[day];
        return { text: "Day " + (day + 1) + ": the close is " + m(c[day]) + ". Will the " + P + "-day " + (ind === "sma" ? "average" : "EMA") + " sit above or below that close?",
          a: "Above the close", b: "Below the close", ans: a > c[day] ? "a" : "b",
          why: "The " + P + "-day " + ind.toUpperCase() + " is " + m(a) + ", so it sits " + (a > c[day] ? "above" : "below") + " the close of " + m(c[day]) + "." +
            (r.over.length > 1 ? " " + r.over.slice(1).map(function (o) { return o.name + ": " + m(o.vals[day]) + " (" + (o.vals[day] > c[day] ? "above" : "below") + ")"; }).join(". ") + "." : "") };
      }
      if (ind === "rsi") {
        var v = r.rsi.rsi[day];
        return { text: "Day " + (day + 1) + ": will the " + P + "-day RSI be above 50 or at or below 50?", a: "Above 50", b: "50 or below", ans: v > 50 ? "a" : "b",
          why: "RSI is " + t2(v) + ". It compares recent gains with recent losses. 50 means they were equal." };
      }
      if (ind === "macd") {
        var hv = r.hist[day];
        return { text: "Day " + (day + 1) + ": will the MACD histogram be positive or negative?", a: "Positive", b: "Negative or zero", ans: hv > 0 ? "a" : "b",
          why: "MACD line " + sgn(r.line[day]) + ", signal line " + sgn(r.sig[day]) + ", so the histogram is " + sgn(hv) + "." };
      }
      var mid = r.b.mid[day];
      return { text: "Day " + (day + 1) + ": the close is " + m(c[day]) + ". Will it sit above or below the middle band?", a: "Above the middle band", b: "At or below it",
        ans: c[day] > mid ? "a" : "b", why: "The middle band is " + m(mid) + ", so the close is " + (c[day] > mid ? "above" : "at or below") + " it." };
    }
    function pickDay() {
      var N = st.data.c.length, lo = Math.min(N - 1, res.fv), rg = L.rng(101 + pred.asked * 7 + 3), d;
      var tries = 0;
      do { d = lo + Math.floor(rg() * (N - lo)); tries++; } while (d === pred.day && tries < 8);
      pred.day = d; pred.done = false; pred.guess = null;
    }
    function setupPred(fresh) {
      if (!pred) { pred = { day: -1, done: false, guess: null, right: 0, asked: 0 }; pickDay(); }
      else if (fresh || pred.day < res.fv) { pickDay(); }
      st.n = pred.day + 1; st.focus = null;
      renderPred();
    }
    function renderPred() {
      clr(predHost);
      if (!pred) return;
      var q = qDef(res, pred.day);
      var bx = L.el("div", "cft-screen");
      bx.appendChild(L.el("div", "cft-box-title", "Predict, then check"));
      bx.appendChild(L.el("p", null, "Look at the price up to this day. The lines are hidden until you answer. This is practice in reading a formula. It is not a forecast."));
      bx.appendChild(L.el("p", "cft-tx-b", q.text));
      var br = L.el("div", "cft-btn-row"); bx.appendChild(br);
      function ans(which) {
        if (pred.done) return;
        pred.done = true; pred.guess = which; pred.asked++;
        var ok = which === q.ans; if (ok) pred.right++;
        render(); renderPred();
      }
      var ba = L.button(br, q.a, function () { ans("a"); });
      var bb = L.button(br, q.b, function () { ans("b"); });
      if (pred.done) {
        ba.disabled = true; bb.disabled = true;
        L.feedback(bx, pred.guess === q.ans, (pred.guess === q.ans ? "You guessed right. " : "Not this time. ") + q.why);
        L.note(bx, "Score so far: " + pred.right + " right out of " + pred.asked + ". Just practice. A lucky guess or a miss here says nothing about the future.");
        L.button(bx, "Next question", function () { pred.asked = pred.asked; pickDay(); st.n = pred.day + 1; render(); renderPred(); });
      }
      predHost.appendChild(bx);
    }

    // ----- chart panes -----
    function buildPanes() {
      var d = st.data, c = d.c, n = st.n, N = c.length;
      var hide = pred && !pred.done;
      var panes = [], hid = "Hidden until you answer";
      layout.forEach(function (ly) {
        var pn = { h: ly.h, items: [], legend: [] };
        if (ly.id === "price") {
          pn.title = ind === "relative-volume" ? "Price" : "Price";
          if (useCandles) pn.items.push({ type: "candles", o: d.o, h: d.h, l: d.l, c: c });
          else { pn.items.push({ type: "close", vals: c, cls: "cft-pl" }); pn.legend.push({ cls: "cft-pl", name: "Close" }); }
          if (!hide) {
            if (res.over) res.over.forEach(function (o) { pn.items.push({ type: "line", vals: o.vals, cls: o.cls }); pn.legend.push({ cls: o.cls, name: o.name }); });
            if (ind === "bollinger") {
              pn.items.push({ type: "band", up: res.b.up, lo: res.b.lo });
              pn.items.push({ type: "line", vals: res.b.mid, cls: "cft-pl-o" });
              pn.legend.push({ cls: "cft-pl-o", name: "Middle" }); pn.legend.push({ cls: "cft-pl-d", name: "Upper and lower" });
            }
            if ((ind === "vwap" || (ind === "obv" && st.vwapOn)) && res.vw) {
              var vv = res.vw.vwap.map(function (x, j) { return x; });
              pn.items.push({ type: "line", vals: vv, cls: "cft-pl-o" }); pn.legend.push({ cls: "cft-pl-o", name: "VWAP" });
              var ss = []; res.vw.start.forEach(function (s, j) { if (s && j > 0) ss.push(j); });
              if (ss.length) pn.items.push({ type: "vlines", idx: ss });
            }
          }
        } else if (ly.id === "vol") {
          pn.title = "Volume (shares)"; pn.zeroBase = true; pn.fmt = ni;
          pn.items.push({ type: "bars", vals: d.v, hiIdx: ind === "relative-volume" ? curFocus() : -1 });
          if (ind === "relative-volume") {
            pn.items.push({ type: "line", vals: res.rv.avg, cls: "cft-pl-o" }); pn.legend.push({ cls: "cft-pl-o", name: st.period + "-day average of the days before" });
          }
        } else if (hide) {
          pn.title = ly.id.toUpperCase(); pn.hidden = hid;
        } else if (ly.id === "rsi") {
          pn.title = st.period + "-day RSI"; pn.lo = 0; pn.hi = 100;
          pn.items.push({ type: "line", vals: res.rsi.rsi, cls: "cft-pl" });
          if (st.levels) { pn.items.push({ type: "hline", y: 70, label: "70" }); pn.items.push({ type: "hline", y: 30, label: "30" }); }
        } else if (ly.id === "macd") {
          pn.title = "MACD"; pn.symmetric = true;
          pn.items.push({ type: "hist", vals: res.hist, cross: res.cross });
          pn.items.push({ type: "line", vals: res.line, cls: "cft-pl" });
          pn.items.push({ type: "line", vals: res.sig, cls: "cft-pl-o" });
          pn.legend.push({ cls: "cft-pl", name: "MACD line" }); pn.legend.push({ cls: "cft-pl-o", name: "Signal line" });
        } else if (ly.id === "atr") {
          pn.title = st.period + "-day ATR (Rs)"; pn.zeroBase = true;
          pn.items.push({ type: "line", vals: res.a.atr, cls: "cft-pl-o" });
        } else if (ly.id === "obv") {
          pn.title = "OBV (running total)";
          pn.items.push({ type: "line", vals: res.obv, cls: "cft-pl", dotCls: "cft-dot-b" }); pn.fmt = ni;
        } else if (ly.id === "rv") {
          pn.title = "Relative volume (today / average)"; pn.zeroBase = true;
          pn.items.push({ type: "line", vals: res.rv.rv, cls: "cft-pl" });
          pn.items.push({ type: "hline", y: 1, label: "1.0 = usual" });
        }
        panes.push(pn);
      });
      return panes;
    }

    // ----- lag demo -----
    function lagFor(arr, idxTurn, dir, nn) {
      // dir -1: peak (average turns down), +1: trough (average turns up). Returns the day index where the average turns, or -1.
      var i;
      for (i = idxTurn + 1; i < nn; i++) {
        if (arr[i] === null || arr[i - 1] === null) continue;
        if (dir < 0 && arr[i] < arr[i - 1]) return i;
        if (dir > 0 && arr[i] > arr[i - 1]) return i;
      }
      return -1;
    }
    function turns(nn) {
      // The swing high with the biggest fall after it, then the swing low after it with the biggest rise after that.
      var c = st.data.c, hiI = -1, loI = -1, bestD = 0, bestR = 0, i, j;
      for (i = 1; i < nn - 3; i++) {
        var mn = Infinity;
        for (j = i + 1; j < nn; j++) if (c[j] < mn) mn = c[j];
        if (c[i] - mn > bestD) { bestD = c[i] - mn; hiI = i; }
      }
      for (i = Math.max(1, hiI + 1); i < nn - 3; i++) {
        var mx = -Infinity;
        for (j = i + 1; j < nn; j++) if (c[j] > mx) mx = c[j];
        if (mx - c[i] > bestR) { bestR = mx - c[i]; loI = i; }
      }
      return { hi: hiI, lo: loI };
    }
    function renderLag(nn) {
      clr(lagHost);
      if (!st.lag || (ind !== "sma" && ind !== "ema") || (pred && !pred.done) || st.data.c.length < 12) return [];
      var tr = turns(nn), marks = [];
      var arr = res.main;
      var box = L.el("div", "cft-screen");
      box.appendChild(L.el("div", "cft-box-title", "How late is the line?"));
      var lines = [], rows = [];
      function one(idx, dir, word, row) {
        if (idx < 0) return;
        var tl = lagFor(arr, idx, dir, nn);
        marks.push({ idx: idx, cls: "cft-ln-hi", label: "price " + word, row: row });
        if (tl < 0) lines.push("Price " + word + " on day " + (idx + 1) + ". In the days shown, the line has not turned yet.");
        else {
          marks.push({ idx: tl, cls: "cft-ln-d", label: "line turns", row: row + 1 });
          lines.push("Price " + word + " on day " + (idx + 1) + ". The line turned on day " + (tl + 1) + ". That is " + (tl - idx) + " day" + (tl - idx === 1 ? "" : "s") + " later.");
        }
      }
      one(tr.hi, -1, "peaked", 0);
      one(tr.lo, 1, "bottomed", 1);
      lines.forEach(function (t) { box.appendChild(L.el("p", null, t)); });
      // table for several windows
      var wins = [3, 5, 10, 20], trows = [];
      wins.forEach(function (w) {
        var a = ind === "sma" ? smaArr(st.data.c, w) : emaFrom(st.data.c, w, st.seed);
        var x1 = tr.hi >= 0 ? lagFor(a, tr.hi, -1, nn) : -1, x2 = tr.lo >= 0 ? lagFor(a, tr.lo, 1, nn) : -1;
        trows.push([w + " days", x1 < 0 ? "not yet" : (x1 - tr.hi) + " day(s)", x2 < 0 ? "not yet" : (x2 - tr.lo) + " day(s)"]);
      });
      box.appendChild(L.el("p", "cft-hint", "The same two turns, measured for four window lengths. A longer window turns later."));
      mkTable(box, ["Window", "Days late after the peak", "Days late after the low"], trows);
      lagHost.appendChild(box);
      return marks;
    }

    // ----- steps and result -----
    function stepRows(f) {
      var d = st.data, c = d.c, P = st.period, rows = [], k;
      var need = function (what, have) { return [["Not enough days yet", "Need " + what + ". Day " + (f + 1) + " has " + have + "."]]; };
      if (ind === "sma") {
        if (f < P - 1) return need(P + " closes", f + 1);
        var s = sumRange(c, f - P + 1, f), a = s / P;
        rows.push(["The last " + P + " closes (days " + (f - P + 2) + " to " + (f + 1) + ")", listStr(c.slice(f - P + 1, f + 1)) + (P > 8 ? "" : "")]);
        rows.push(["Add them up", m(s)]);
        rows.push(["Divide by " + P, m(s) + " / " + P + " = " + m(a), true]);
        rows.push(["Latest close minus the average", m(c[f]) + " - " + m(a) + " = " + sgn(c[f] - a)]);
        if (f >= P) {
          var prev = res.sma[f - 1];
          rows.push(["Rolling check: old average + (new close - close " + P + " days ago) / " + P,
            m(prev) + " + (" + t2(c[f]) + " - " + t2(c[f - P]) + ") / " + P + " = " + m(prev + (c[f] - c[f - P]) / P)]);
        }
        return rows;
      }
      if (ind === "ema") {
        var kk = 2 / (P + 1);
        rows.push(["Smoothing factor k = 2 / (N + 1)", "2 / (" + P + " + 1) = " + t4(kk)]);
        var firstDay = st.seed === "first" ? 0 : P - 1;
        if (f < firstDay) return need(P + " closes", f + 1);
        if (f === firstDay) {
          rows.push(["Starting value", st.seed === "first" ? "The first close: " + m(c[f]) : "The first SMA: " + m(res.ema[f]), true]);
          return rows;
        }
        var y = res.ema[f - 1], ch = c[f] - y;
        rows.push(["Yesterday's EMA", m(y)]);
        rows.push(["Today's close", m(c[f])]);
        rows.push(["Change from yesterday's EMA", t2(c[f]) + " - " + t2(y) + " = " + sgn(ch)]);
        rows.push(["Weighted change", t4(kk) + " x " + t2(ch) + " = " + sgn(kk * ch)]);
        rows.push(["Today's EMA", m(y) + (ch >= 0 ? " + " : " - ") + m(Math.abs(kk * ch)).replace("Rs ", "") + " = " + m(res.ema[f]), true]);
        if (res.sma[f] !== null) rows.push(["The SMA on the same day, for comparison", m(res.sma[f])]);
        return rows;
      }
      if (ind === "rsi") {
        var R = res.rsi;
        if (f < P) return need(P + " changes, so " + (P + 1) + " closes", f + 1);
        if (f === P) {
          var gs = 0, ls = 0, gl = [], ll = [], j;
          for (j = 1; j <= P; j++) { gl.push(Math.max(0, R.chg[j])); ll.push(Math.max(0, -R.chg[j])); }
          gs = sumRange(gl, 0, gl.length - 1); ls = sumRange(ll, 0, ll.length - 1);
          rows.push(["Changes (close minus the close before)", R.chg.slice(1, P + 1).map(function (x) { return sgn(x); }).join(", ")]);
          rows.push(["Gains added up", gl.map(t2).join(" + ") + " = " + t2(gs)]);
          rows.push(["Losses added up (as positive numbers)", ll.map(t2).join(" + ") + " = " + t2(ls)]);
          rows.push(["Average gain (simple average)", t2(gs) + " / " + P + " = " + t4(R.ag[f])]);
          rows.push(["Average loss (simple average)", t2(ls) + " / " + P + " = " + t4(R.al[f])]);
        } else {
          var gn = Math.max(0, R.chg[f]), lo = Math.max(0, -R.chg[f]);
          rows.push(["Today's change", sgn(R.chg[f]) + " (gain " + t2(gn) + ", loss " + t2(lo) + ")"]);
          rows.push(["New average gain (Wilder)", "(" + t4(R.ag[f - 1]) + " x " + (P - 1) + " + " + t2(gn) + ") / " + P + " = " + t4(R.ag[f])]);
          rows.push(["New average loss (Wilder)", "(" + t4(R.al[f - 1]) + " x " + (P - 1) + " + " + t2(lo) + ") / " + P + " = " + t4(R.al[f])]);
        }
        if (R.al[f] === 0) rows.push(["RS = average gain / average loss", "No losses at all, so RS cannot be worked out. RSI is shown as " + (R.ag[f] === 0 ? "50" : "100") + "."]);
        else rows.push(["RS = average gain / average loss", t4(R.ag[f]) + " / " + t4(R.al[f]) + " = " + t4(R.ag[f] / R.al[f])]);
        rows.push(["RSI = 100 - 100 / (1 + RS)", t2(R.rsi[f]), true]);
        return rows;
      }
      if (ind === "macd") {
        if (res.ef[f] === null || res.es[f] === null) return need(res.sa + " closes", f + 1);
        rows.push(["EMA(" + res.fa + ") and EMA(" + res.sa + ")", m(res.ef[f]) + " and " + m(res.es[f])]);
        rows.push(["MACD line = fast EMA - slow EMA", t2(res.ef[f]) + " - " + t2(res.es[f]) + " = " + sgn(res.line[f]), true]);
        if (res.sig[f] === null) { rows.push(["Signal line", "Not enough days yet. It needs " + st.sig + " MACD values."]); return rows; }
        rows.push(["Signal line = EMA(" + st.sig + ") of the MACD line", sgn(res.sig[f])]);
        rows.push(["Histogram = MACD line - signal line", sgn(res.line[f]) + " - (" + sgn(res.sig[f]) + ") = " + sgn(res.hist[f]), true]);
        if (f > 0 && res.hist[f - 1] !== null) {
          var cr = (res.hist[f] > 0) !== (res.hist[f - 1] > 0);
          rows.push(["Day before", "Histogram " + sgn(res.hist[f - 1]) + (cr ? ". The sign changed, so this is a crossover." : ". Same sign, so no crossover.")]);
        }
        return rows;
      }
      if (ind === "bollinger") {
        var B = res.b;
        if (B.mid[f] === null) return need(P + " closes" + (st.sample && P < 2 ? " (at least 2 for sample SD)" : ""), f + 1);
        var w = c.slice(f - P + 1, f + 1), mean = B.mid[f];
        rows.push(["Middle band = average of the last " + P + " closes", m(mean), true]);
        var sq = 0; w.forEach(function (x) { sq += (x - mean) * (x - mean); });
        if (P <= 8) {
          rows.push(["Differences from the average", w.map(function (x) { return sgn(x - mean); }).join(", ")]);
          rows.push(["Squared differences", w.map(function (x) { return t2((x - mean) * (x - mean)); }).join(", ")]);
        }
        var dv = st.sample ? P - 1 : P;
        rows.push(["Total of the squares", t2(sq)]);
        rows.push([(st.sample ? "Sample" : "Population") + " variance = total / " + dv, t2(sq) + " / " + dv + " = " + t4(sq / dv)]);
        rows.push(["SD = square root of the variance", m(B.sd[f])]);
        rows.push(["Band distance = k x SD (unrounded SD)", st.k + " x " + t4(B.sd[f]) + " = " + m(st.k * B.sd[f])]);
        rows.push(["Upper band", m(B.up[f]), true]);
        rows.push(["Lower band", m(B.lo[f]), true]);
        return rows;
      }
      if (ind === "atr") {
        var A = res.a;
        if (f < 1) return [["Day 1", "There is no day before it, so it has no true range. It only gives day 2 a previous close."]];
        var v1 = d.h[f] - d.l[f], v2 = Math.abs(d.h[f] - c[f - 1]), v3 = Math.abs(d.l[f] - c[f - 1]);
        rows.push(["High, low, previous close", t2(d.h[f]) + ", " + t2(d.l[f]) + ", " + t2(c[f - 1])]);
        rows.push(["High - low", t2(v1)]);
        rows.push(["High - previous close (absolute)", t2(v2)]);
        rows.push(["Low - previous close (absolute)", t2(v3)]);
        rows.push(["True range = the largest of the three", t2(A.tr[f]), true]);
        if (f < P) { rows.push(["ATR", "Not enough days yet. The first ATR needs " + P + " true ranges."]); return rows; }
        if (f === P) {
          rows.push(["First ATR = simple average of the first " + P + " true ranges", A.tr.slice(1, P + 1).map(t2).join(" + ") + " = " + t2(sumRange(A.tr, 1, P)) + ", / " + P + " = " + t2(A.atr[f]), true]);
        } else {
          rows.push(["Wilder: (yesterday's ATR x (N - 1) + today's TR) / N", "(" + t2(A.atr[f - 1]) + " x " + (P - 1) + " + " + t2(A.tr[f]) + ") / " + P + " = " + t2(A.atr[f]), true]);
        }
        var atr2 = +A.atr[f].toFixed(2), dist = st.mult * atr2;
        var ent = st.entry > 0 ? st.entry : c[f];
        rows.push(["Stop distance = multiple x ATR (ATR rounded to 2 decimals)", st.mult + " x " + t2(atr2) + " = " + m(dist)]);
        rows.push(["Stop price = entry - stop distance", "entry " + m(ent) + " - " + m(dist) + " = " + m(ent - dist)]);
        rows.push(["ATR as a share of the close", t2(A.atr[f] / c[f] * 100) + "%"]);
        return rows;
      }
      if (ind === "relative-volume") {
        var Rv = res.rv;
        if (Rv.avg[f] === null) return need(P + " earlier days of volume", f);
        rows.push(["Volume on day " + (f + 1), ni(d.v[f]) + " shares"]);
        rows.push(["Average volume of the " + P + " days before", ni(Rv.avg[f]) + " shares"]);
        rows.push(["Relative volume = today / average", ni(d.v[f]) + " / " + ni(Rv.avg[f]) + " = " + t2(Rv.rv[f]), true]);
        rows.push(["Traded value = volume x price", ni(d.v[f]) + " x " + m(c[f]) + " = " + L.inr(d.v[f] * c[f], 0)]);
        if (st.plan > 0) rows.push(["Your planned " + ni(st.plan) + " shares as a part of the day", t2(st.plan / d.v[f] * 100) + "%"]);
        return rows;
      }
      return rows;
    }
    function stepsExtra(f) {
      // multi-column tables for OBV and VWAP when short
      var d = st.data, c = d.c;
      if (ind === "obv") {
        var o = res.obv;
        if (c.length <= 10) {
          var rows = [];
          for (var i = 0; i <= f; i++) {
            var how = i === 0 ? "no earlier close" : c[i] > c[i - 1] ? "higher, so add" : c[i] < c[i - 1] ? "lower, so subtract" : "same, so no change";
            rows.push([String(i + 1), m(c[i]), ni(d.v[i]), how, ni(o[i])]);
          }
          mkTable(stepsHost, ["Day", "Close", "Volume", "Compared with the day before", "OBV"], rows);
        } else {
          var rr = [["OBV the day before", ni(o[Math.max(0, f - 1)])]];
          if (f > 0) rr.push(["Close compared with the day before", c[f] > c[f - 1] ? "higher, so add " + ni(d.v[f]) : c[f] < c[f - 1] ? "lower, so subtract " + ni(d.v[f]) : "same, so no change"]);
          rr.push(["OBV today", ni(o[f]), true]);
          L.table(stepsHost, rr);
        }
      }
      if (ind === "vwap" || (ind === "obv" && st.vwapOn)) {
        var V = res.vw, s0 = f - (f % Math.max(1, session));
        if (f - s0 + 1 <= 8) {
          var vr = [];
          for (var j = s0; j <= f; j++) vr.push([String(j + 1), t2(d.h[j]) + " / " + t2(d.l[j]) + " / " + t2(c[j]), m(V.tp[j]), ni(d.v[j]), L.inr(V.pv[j], 0)]);
          vr.push(["Total", "", "", ni(V.cv[f]), L.inr(V.cpv[f], 0)]);
          stepsHost.appendChild(L.el("div", "cft-hint", "VWAP steps. Typical price = (high + low + close) / 3. Each one is multiplied by its volume."));
          mkTable(stepsHost, [unit, "High / low / close", "Typical price", "Volume", "Typical price x volume"], vr, true);
          L.table(stepsHost, [["VWAP = total of products / total volume", L.inr(V.cpv[f], 0) + " / " + ni(V.cv[f]) + " = " + m(V.vwap[f]), true]]);
        } else {
          L.table(stepsHost, [["Bars since this session started", String(f - s0 + 1)], ["Total of typical price x volume", L.inr(V.cpv[f], 0)],
            ["Total volume", ni(V.cv[f])], ["VWAP = total of products / total volume", m(V.vwap[f]), true]]);
        }
      }
    }
    function resultText(f) {
      var d = st.data, c = d.c, P = st.period, dayW = unit.toLowerCase() + " " + (f + 1);
      if (pred && !pred.done) return "Answer the question above to see the numbers.";
      try {
        if (ind === "sma") { var a = res.sma[f]; return a === null ? "On " + dayW + " there are not enough closes for a " + P + "-day average." :
          "On " + dayW + " the " + P + "-day average is " + m(a) + ". The close of " + m(c[f]) + " is " + m(Math.abs(c[f] - a)) + " " + (c[f] >= a ? "above" : "below") + " it. The average only describes the past."; }
        if (ind === "ema") { var e = res.ema[f]; return e === null ? "On " + dayW + " there are not enough closes for the first EMA." :
          "On " + dayW + " the " + P + "-day EMA is " + m(e) + ". The close of " + m(c[f]) + " is " + m(Math.abs(c[f] - e)) + " " + (c[f] >= e ? "above" : "below") + " it. It starts from the " + (st.seed === "first" ? "first close" : "first SMA") + "."; }
        if (ind === "rsi") { var v = res.rsi.rsi[f]; return v === null ? "On " + dayW + " there are not enough closes for RSI." :
          "On " + dayW + " the RSI is " + t2(v) + (v > 70 ? ", above the common 70 line. That only says recent gains were large. It is not an order to sell." : v < 30 ? ", below the common 30 line. That only says recent losses were large. It is not an order to buy." : ", between 30 and 70.") + " It describes the past, not tomorrow."; }
        if (ind === "macd") { if (res.hist[f] === null) return "On " + dayW + " there are not enough closes yet.";
          var cn = 0; res.cross.forEach(function (q) { if (q <= f) cn++; });
          return "On " + dayW + " the MACD line is " + sgn(res.line[f]) + ", the signal line is " + sgn(res.sig[f]) + " and the histogram is " + sgn(res.hist[f]) + ". So far the histogram changed sign " + cn + " time" + (cn === 1 ? "" : "s") + " (crossovers). A crossover is something to test, not a sure signal."; }
        if (ind === "bollinger") { var B = res.b; if (B.mid[f] === null) return "On " + dayW + " there are not enough closes yet.";
          var pos = c[f] > B.up[f] ? "above the upper band" : c[f] < B.lo[f] ? "below the lower band" : "inside the bands";
          return "On " + dayW + " the middle band is " + m(B.mid[f]) + ", the upper band " + m(B.up[f]) + " and the lower band " + m(B.lo[f]) + ". The close of " + m(c[f]) + " is " + pos + ". The bands show spread, not direction."; }
        if (ind === "atr") { var A = res.a.atr[f]; if (A === null) return "On " + dayW + " there are not enough bars for the first ATR.";
          var a2 = +A.toFixed(2), ent = st.entry > 0 ? st.entry : c[f];
          return "On " + dayW + " the ATR is " + m(A) + ". A stop " + st.mult + " x ATR below an entry of " + m(ent) + " would be " + m(ent - st.mult * a2) + ", which is " + m(st.mult * a2) + " away. A gap can still jump past any stop."; }
        if (ind === "obv") return "After " + dayW + " the OBV is " + ni(res.obv[f]) + ". It adds the volume on higher-close days and takes it away on lower-close days. It does not show who was buying and who was selling.";
        if (ind === "vwap") return "On " + dayW + " the VWAP so far in this session is " + m(res.vw.vwap[f]) + ". It restarts at each session start. It is a reference line, not a forecast.";
        if (ind === "relative-volume") { var rv = res.rv.rv[f]; return rv === null ? "On " + dayW + " there are not enough earlier days for a " + P + "-day average." :
          "On " + dayW + ", " + ni(d.v[f]) + " shares traded. The " + P + " days before averaged " + ni(res.rv.avg[f]) + ". Relative volume is " + t2(rv) + ". It shows how busy the day was, not which side was stronger."; }
      } catch (err) { return ""; }
      return "";
    }

    function render() {
      var N = st.data.c.length, n = Math.min(st.n, N), f = curFocus();
      var panes = buildPanes();
      var marks = renderLag(n);
      var hide = pred && !pred.done;
      drawChart(g, { N: N, n: n, focus: hide ? null : f, panes: panes, unit: unit, scaleAll: !pred, marks: hide ? [] : marks });
      if (focusSl) { focusSl.input.max = N; focusSl.set(f + 1); }
      clr(stepsHost);
      if (!hide) {
        stepsHost.appendChild(L.el("div", "cft-box-title", "Step by step for " + unit.toLowerCase() + " " + (f + 1)));
        var rows = stepRows(f);
        if (ind === "obv" || ind === "vwap") stepsExtra(f);
        else if (rows.length) L.table(stepsHost, rows);
      }
      out.textContent = resultText(f);
      g.svg.setAttribute("aria-label", NAMES[ind] + " on made-up prices, showing " + n + " of " + N + " bars. " + (hide ? "" : resultText(f)));
    }

    g.svg.addEventListener("click", function (ev) {
      if (pred && !pred.done) return;
      var i = pickIndex(g.svg, ev, st.data.c.length);
      if (i >= 0 && i < st.n) { st.focus = i; render(); }
    });

    res = compute();
    if (canPredict) { setupPred(true); }
    else { setupAnim(); }
    render();
  };

  // Pads or trims arrays so all series have the same length as the closes.
  function fitData(c, h, l, v) {
    var n = c.length, d = { o: [], h: [], l: [], c: c.slice(), v: [] }, i;
    for (i = 0; i < n; i++) {
      d.o.push(i ? c[i - 1] : c[0]);
      d.h.push(h && h[i] !== undefined ? h[i] : c[i]);
      d.l.push(l && l[i] !== undefined ? l[i] : c[i]);
      d.v.push(v && v[i] !== undefined ? v[i] : 10000);
    }
    return d;
  }

  // The chapter's own MACD numbers: type EMA(12), EMA(26) and the signal line yourself.
  function macdManual(p, body) {
    var s = { ef: L.P(p, "ema12", 105), es: L.P(p, "ema26", 102), sg: L.P(p, "signal", 2.4), pm: L.P(p, "yesterdayMacd", 2.2), ps: L.P(p, "yesterdaySignal", 2.3) };
    var r = L.row(body);
    var fields = [["ema12", "EMA(12) today (Rs)", "ef"], ["ema26", "EMA(26) today (Rs)", "es"], ["sg", "Signal line today", "sg"],
      ["pm", "MACD line yesterday", "pm"], ["ps", "Signal line yesterday", "ps"]];
    fields.forEach(function (f) {
      L.numberField(r, { label: f[1], value: s[f[2]], step: "0.01", onInput: function (v) { s[f[2]] = v; draw(); } });
    });
    var tb = L.el("div"); body.appendChild(tb);
    var out = L.el("p", "cft-note"); out.style.fontWeight = "600"; out.style.opacity = "1"; out.setAttribute("aria-live", "polite"); body.appendChild(out);
    body.appendChild(L.el("p", "cft-note", "These EMA values are typed in by you. In real life you work them out from closing prices. All numbers are made up."));
    function draw() {
      clr(tb);
      var macd = s.ef - s.es, hist = macd - s.sg, yh = s.pm - s.ps;
      L.table(tb, [
        ["MACD line = EMA(12) - EMA(26)", t2(s.ef) + " - " + t2(s.es) + " = " + sgn(macd), true],
        ["Histogram today = MACD - signal", sgn(macd) + " - (" + sgn(s.sg) + ") = " + sgn(hist), true],
        ["Histogram yesterday", t2(s.pm) + " - " + t2(s.ps) + " = " + sgn(yh)],
      ]);
      var cross = (hist > 0) !== (yh > 0) && hist !== 0 && yh !== 0;
      out.textContent = "The histogram is " + sgn(hist) + " today and was " + sgn(yh) + " yesterday. " +
        (cross ? "The sign changed, so this is a crossover. It is an event to test, not a forecast." : "The sign did not change, so there is no crossover today.");
    }
    draw();
  }

  // =====================================================================
  // indicator-disagree: five readings on one made-up chart, with a predict step
  // =====================================================================
  D["indicator-disagree"] = function (p, host) {
    var b = L.box(host, "When indicators disagree (made-up chart)",
      "What to try: pick a day on the chart. First guess how many of the five readings lean up. Then check. Many days, the readings do not agree.");
    var body = b.body;
    var N = Math.round(L.clamp(L.P(p, "bars", 90), 60, 120));
    var dat = makeSeries(N, L.P(p, "seed", 11), 100), c = dat.c;
    var s10 = smaArr(c, 10), s20 = smaArr(c, 20), s50 = smaArr(c, 50), rs = rsiCalc(c, 14).rsi, bb = bollCalc(c, 20, 2, false);
    var ef = emaFrom(c, 12, "sma"), es = emaFrom(c, 26, "sma");
    var ml = c.map(function (x, i) { return ef[i] !== null && es[i] !== null ? ef[i] - es[i] : null; });
    var sg = emaFrom(ml, 9, "sma");
    var hist = ml.map(function (x, i) { return x !== null && sg[i] !== null ? x - sg[i] : null; });
    var first = 49;
    var st = { day: Math.min(N - 1, 70), revealed: false, guess: null, right: 0, asked: 0 };

    function readings(d) {
      var rows = [];
      rows.push({ name: "1. Close against the 20-day average", val: m(c[d]) + " vs " + m(s20[d]), up: c[d] > s20[d], txt: c[d] > s20[d] ? "Leans up (close above)" : "Leans down (close below)" });
      rows.push({ name: "2. 10-day average against 50-day average", val: m(s10[d]) + " vs " + m(s50[d]), up: s10[d] > s50[d], txt: s10[d] > s50[d] ? "Leans up (short above long)" : "Leans down (short below long)" });
      rows.push({ name: "3. RSI (14 days)", val: t2(rs[d]), up: rs[d] > 50, txt: (rs[d] > 50 ? "Leans up (above 50)" : "Leans down (50 or below)") + (rs[d] > 70 ? ", also above 70, which people call overbought" : rs[d] < 30 ? ", also below 30, which people call oversold" : "") });
      rows.push({ name: "4. MACD histogram", val: sgn(hist[d]), up: hist[d] > 0, txt: hist[d] > 0 ? "Leans up (positive)" : "Leans down (negative)" });
      var inBand = c[d] > bb.up[d] ? "above the upper band" : c[d] < bb.lo[d] ? "below the lower band" : "inside the bands";
      rows.push({ name: "5. Close against the Bollinger middle band", val: "close is " + inBand, up: c[d] > bb.mid[d], txt: c[d] > bb.mid[d] ? "Leans up (above the middle)" : "Leans down (below the middle)" });
      return rows;
    }
    function upCount(d) { return readings(d).filter(function (r) { return r.up; }).length; }

    var g = L.svg(body, CW, chartHeight([{ h: 170 }, { h: 80 }]));
    g.svg.setAttribute("aria-label", "A made-up price chart with a 10-day average, a 50-day average, Bollinger Bands and RSI.");
    g.svg.style.cursor = "pointer";
    var ctr = L.row(body);
    var daySl = L.slider(ctr, { label: "Day to look at", min: first, max: N - 1, step: 1, value: st.day + 0,
      fmt: function (v) { return "Day " + (v + 1); }, onInput: function (v) { st.day = v; st.revealed = false; st.guess = null; draw(); } });
    daySl.input.min = first; daySl.input.max = N - 1; daySl.set(st.day);
    var br = L.el("div", "cft-btn-row"); body.appendChild(br);
    L.button(br, "Find a day where they disagree", function () {
      var rg = L.rng(500 + st.asked * 13 + st.day), d, t = 0;
      do { d = first + Math.floor(rg() * (N - first)); var u = upCount(d); t++; } while ((u === 0 || u === 5 || d === st.day) && t < 60);
      st.day = d; st.revealed = false; st.guess = null; daySl.set(d); draw();
    });
    L.button(br, "Pick any day at random", function () {
      var rg = L.rng(900 + st.asked * 17 + st.day);
      st.day = first + Math.floor(rg() * (N - first)); st.revealed = false; st.guess = null; daySl.set(st.day); draw();
    });
    var ph = L.el("div"); body.appendChild(ph);
    var th = L.el("div"); body.appendChild(th);
    var out = L.el("p", "cft-note"); out.style.fontWeight = "600"; out.style.opacity = "1"; out.setAttribute("aria-live", "polite"); body.appendChild(out);
    body.appendChild(L.el("p", "cft-note", "Readings 1 and 5 use the same 20 closes, so they always agree. That is the point: many indicators are built from the same prices. Counting them does not make a decision. A rule written before you look at the chart does."));

    g.svg.addEventListener("click", function (ev) {
      var i = pickIndex(g.svg, ev, N);
      if (i >= first) { st.day = i; st.revealed = false; st.guess = null; daySl.set(i); draw(); }
    });

    function draw() {
      var d = st.day;
      drawChart(g, { N: N, n: N, focus: d, unit: "Day", scaleAll: true, panes: [
        { title: "Price", h: 170, items: [{ type: "band", up: bb.up, lo: bb.lo }, { type: "close", vals: c, cls: "cft-pl" },
          { type: "line", vals: s10, cls: "cft-pl-o" }, { type: "line", vals: s50, cls: "cft-pl-g" }],
          legend: [{ cls: "cft-pl", name: "Close" }, { cls: "cft-pl-o", name: "10-day" }, { cls: "cft-pl-g", name: "50-day" }] },
        { title: "RSI (14 days)", h: 80, lo: 0, hi: 100, items: [{ type: "line", vals: rs, cls: "cft-pl" }, { type: "hline", y: 70, label: "70" }, { type: "hline", y: 30, label: "30" }] },
      ] });
      clr(ph); clr(th);
      var up = upCount(d);
      if (!st.revealed) {
        var bx = L.el("div", "cft-screen");
        bx.appendChild(L.el("div", "cft-box-title", "Predict, then check"));
        bx.appendChild(L.el("p", "cft-tx-b", "Day " + (d + 1) + ": how many of the five readings below do you think lean up?"));
        var bro = L.el("div", "cft-btn-row"); bx.appendChild(bro);
        [0, 1, 2, 3, 4, 5].forEach(function (k) {
          L.button(bro, String(k), function () { st.guess = k; st.revealed = true; st.asked++; if (k === upCount(st.day)) st.right++; draw(); });
        });
        L.button(bx, "Show me without guessing", function () { st.revealed = true; draw(); });
        if (st.asked) L.note(bx, "Exact guesses so far: " + st.right + " of " + st.asked + ". Just practice.");
        ph.appendChild(bx);
        out.textContent = "Make a guess to see the readings.";
        return;
      }
      var rd = readings(d), rows = rd.map(function (r) { return [r.name, r.val, r.txt]; });
      mkTable(th, ["Reading", "Value", "What it says"], rows);
      var msg = "On day " + (d + 1) + ", " + up + " of the 5 readings " + (up === 1 ? "leans" : "lean") + " up and " + (5 - up) + " " + (5 - up === 1 ? "leans" : "lean") + " down. ";
      if (st.guess !== null) msg += (st.guess === up ? "Your guess of " + st.guess + " was right. " : "You guessed " + st.guess + ". ");
      msg += up === 0 || up === 5 ? "They agree today, but they all use the same closes." : "They disagree. The count does not decide anything. A rule written beforehand does.";
      out.textContent = msg;
      L.button(th, "Ask me again on another day", function () {
        var rg = L.rng(300 + st.asked * 11), dd = first + Math.floor(rg() * (N - first));
        st.day = dd; st.revealed = false; st.guess = null; daySl.set(dd); draw();
      });
    }
    draw();
  };

  // =====================================================================
  // lab-position-size: a plain position-size calculator with three limits
  // =====================================================================
  D["lab-position-size"] = function (p, host) {
    var b = L.box(host, "Position size lab (practice numbers)",
      "What to try: change the stop price and watch the risk limit move. Turn the cash and one-stock limits on and off. The smallest limit sets the number of shares.");
    var body = b.body;
    var s = { capital: L.P(p, "capital", 50000), risk: L.P(p, "riskPct", 1), entry: L.P(p, "entry", 250), stop: L.P(p, "stop", 241.34),
      cash: L.P(p, "cash", L.P(p, "capital", 50000)), maxPct: L.P(p, "maxPct", L.P(p, "maxPositionPct", 25)),
      useCash: onOff(p, "useCash", true), useConc: onOff(p, "useConc", true) };
    var r = L.row(body);
    L.numberField(r, { label: "Capital (Rs)", value: s.capital, onInput: function (v) { s.capital = v; draw(); } });
    L.numberField(r, { label: "Risk per trade (% of capital)", value: s.risk, step: "0.1", onInput: function (v) { s.risk = v; draw(); } });
    L.numberField(r, { label: "Entry price (Rs)", value: s.entry, step: "0.01", onInput: function (v) { s.entry = v; draw(); } });
    L.numberField(r, { label: "Stop-loss price (Rs)", value: s.stop, step: "0.01", onInput: function (v) { s.stop = v; draw(); } });
    L.numberField(r, { label: "Cash you can use (Rs)", value: s.cash, onInput: function (v) { s.cash = v; draw(); } });
    L.numberField(r, { label: "Most in one stock (% of capital)", value: s.maxPct, step: "1", onInput: function (v) { s.maxPct = v; draw(); } });
    var tg = L.el("div", "cft-btn-row"); body.appendChild(tg);
    L.toggle(tg, { label: "Use the cash limit", value: s.useCash, onChange: function (v) { s.useCash = v; draw(); } });
    L.toggle(tg, { label: "Use the one-stock limit", value: s.useConc, onChange: function (v) { s.useConc = v; draw(); } });
    var g = L.svg(body, CW, 130);
    g.svg.setAttribute("aria-label", "Bars for the three share limits. The shortest bar sets the size.");
    var tb = L.el("div"); body.appendChild(tb);
    var out = L.el("p", "cft-note"); out.style.fontWeight = "600"; out.style.opacity = "1"; out.setAttribute("aria-live", "polite"); body.appendChild(out);
    body.appendChild(L.el("p", "cft-note", "Practice numbers only. Costs and slippage are not included. This is not advice to buy or sell."));

    function draw() {
      clr(tb); g.clear();
      if (s.capital <= 0 || s.entry <= 0) { out.textContent = "Enter a capital and an entry price above zero."; return; }
      var rps = s.entry - s.stop;
      if (rps <= 0) { out.textContent = "For a buy, the stop price must be below the entry price."; return; }
      var budget = s.capital * s.risk / 100;
      var raw = Math.floor(budget / rps + 1e-9);
      var lims = [{ name: "Risk limit", v: raw, on: true }];
      lims.push({ name: "Cash limit", v: Math.floor(s.cash / s.entry + 1e-9), on: s.useCash });
      lims.push({ name: "One-stock limit", v: Math.floor(s.capital * s.maxPct / 100 / s.entry + 1e-9), on: s.useConc });
      var shares = Infinity;
      lims.forEach(function (x) { if (x.on && x.v < shares) shares = x.v; });
      shares = Math.max(0, shares);
      var binding = lims.filter(function (x) { return x.on && x.v === shares; }).map(function (x) { return x.name.toLowerCase(); });
      var loss = shares * rps, val = shares * s.entry;
      var mx = Math.max(1, Math.max.apply(null, lims.filter(function (x) { return x.on; }).map(function (x) { return x.v; })));
      var sxx = L.scale(0, mx, 110, CW - 90);
      lims.forEach(function (x, i) {
        var y = 10 + i * 38;
        g.text(4, y + 16, x.name, "cft-tx");
        if (!x.on) { g.text(112, y + 16, "switched off", "cft-tx cft-tx-s"); return; }
        var win = x.v === shares;
        g.rect(110, y, sxx(x.v) - 110, 24, win ? "cft-rc" : "cft-rc-grey");
        g.text(sxx(x.v) + 6, y + 16, x.v + " shares" + (win ? " (smallest)" : ""), "cft-tx");
      });
      L.table(tb, [
        ["Money you accept to lose (risk budget)", m(budget)],
        ["Risk per share (entry - stop)", m(s.entry) + " - " + m(s.stop) + " = " + m(rps)],
        ["Shares allowed by the risk limit", "floor(" + t2(budget) + " / " + t2(rps) + ") = " + raw],
        ["Shares your cash can buy", s.useCash ? String(lims[1].v) : "not used"],
        ["Shares allowed by the one-stock limit", s.useConc ? String(lims[2].v) : "not used"],
        ["Shares to buy (the smallest limit)", String(shares), true],
        ["Position value", m(val) + " (" + t2(val / s.capital * 100) + "% of capital)"],
        ["Loss if the stop is hit", m(loss) + " (" + t2(loss / s.capital * 100) + "% of capital)"],
      ]);
      var bind = binding.length > 1 ? "The " + binding.join(" and the ") + " tie." : "The " + binding[0] + " is the one that decides.";
      out.textContent = "You can buy " + shares + " shares. " + bind + " If the stop is hit, the loss is " + m(loss) + ", which is " + t2(loss / s.capital * 100) + "% of your capital. Your budget was " + m(budget) + ".";
    }
    draw();
  };
})();
