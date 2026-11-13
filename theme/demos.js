(function () {
  "use strict";

  // Interactive and animated demos for the money-core and market-foundation chapters.
  // Each demo is registered as CFT_DEMOS[name](params, host).
  // All numbers are practice numbers. Nothing here places an order or gives advice.
  // Uses window.CFT_LIB (cft-lib.js), which loads first.

  var L = window.CFT_LIB;
  var D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  var el = L.el, num = L.num, inr = L.inr, pct = L.pct, P = L.P;

  // ---------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------

  // Whole-number text with Indian grouping, no "Rs" (for chart axes).
  function kfmt(v) { return Math.round(v).toLocaleString("en-IN"); }
  function r2(v) { return Math.round(v * 100) / 100; }
  function plainNum(v) { return (Math.round(v * 100) / 100).toString(); }
  function hasOnlyCaption(p) {
    var n = 0;
    for (var k in p) { if (Object.prototype.hasOwnProperty.call(p, k) && k !== "caption") n++; }
    return n === 0;
  }

  // Result line: the plain-English sentence at the bottom of a demo.
  function resultLine(parent) {
    var r = el("p", "cft-result");
    r.setAttribute("aria-live", "polite");
    parent.appendChild(r);
    return r;
  }

  // A text input with a label. Returns the same shape as L.numberField.
  function textField(parent, s, onChange) {
    var wrap = el("label", "cft-field");
    wrap.appendChild(el("span", "cft-field-label", s.label));
    var i = el("input", "cft-num");
    i.type = "text";
    i.value = s.value;
    i.addEventListener("input", function () { if (onChange) onChange(i.value); });
    wrap.appendChild(i);
    parent.appendChild(wrap);
    return { el: wrap, input: i, get: function () { return i.value; }, set: function (v) { i.value = v; } };
  }

  // A row of inputs. specs: [{key,label,value,step,text,options}].
  // vals() gives numbers (or strings for text and drop-down fields).
  function fieldSet(parent, specs, onChange) {
    var row = L.row(parent), f = {};
    specs.forEach(function (s) {
      if (s.options) {
        f[s.key] = L.select(row, { label: s.label, options: s.options, value: s.value, onChange: function () { if (onChange) onChange(); } });
      } else if (s.text) {
        f[s.key] = textField(row, s, function () { if (onChange) onChange(); });
      } else {
        f[s.key] = L.numberField(row, { label: s.label, value: s.value, step: s.step, onInput: function () { if (onChange) onChange(); } });
      }
    });
    return {
      f: f,
      vals: function () {
        var v = {};
        specs.forEach(function (s) { v[s.key] = f[s.key].get(); });
        return v;
      },
    };
  }

  function parseList(text) {
    return String(text).split(",").map(function (s) { return num(s, NaN); }).filter(function (x) { return !isNaN(x); });
  }

  // Draws table, bars and notes from a result object {rows,bars,notes}.
  function renderResult(out, r) {
    if (r.rows) L.table(out, r.rows);
    if (r.bars) {
      var max = Math.max.apply(null, r.bars.map(function (b) { return b.value; }).concat([1]));
      r.bars.forEach(function (b) {
        var line = el("div", "cft-bar-line");
        line.appendChild(el("span", "cft-bar-label", b.label));
        var track = el("span", "cft-bar-track");
        var fill = el("span", "cft-bar-fill" + (b.hi ? " cft-bar-hi" : ""));
        fill.style.width = Math.max(1, Math.min(100, (b.value / max) * 100)) + "%";
        track.appendChild(fill);
        line.appendChild(track);
        line.appendChild(el("span", "cft-bar-val", b.text));
        out.appendChild(line);
      });
    }
    (r.notes || []).forEach(function (n) { out.appendChild(el("p", "cft-note", n)); });
  }

  // Builds a demo box: input fields on top, results (table, bars, notes) below.
  // spec: { title, hint, fields:[{key,label,value,step,text}], compute(vals)->{rows,bars,notes,warn,pre,summary,extra} }
  function build(host, spec) {
    var box = el("div", "cft-box cft-demo");
    box.appendChild(el("div", "cft-box-title", spec.title));
    if (spec.hint) box.appendChild(el("div", "cft-hint", spec.hint));
    var form = el("div", "cft-fields");
    var inputs = {};
    spec.fields.forEach(function (f) {
      var wrap = el("label", "cft-field");
      wrap.appendChild(el("span", "cft-field-label", f.label));
      var i = el("input", "cft-num");
      i.type = f.text ? "text" : "number";
      if (!f.text) i.step = f.step || "any";
      i.value = f.value;
      i.addEventListener("input", draw);
      inputs[f.key] = i;
      wrap.appendChild(i);
      form.appendChild(wrap);
    });
    box.appendChild(form);
    var out = el("div", "cft-out");
    box.appendChild(out);
    host.appendChild(box);

    function vals() {
      var v = {};
      spec.fields.forEach(function (f) {
        v[f.key] = f.text ? inputs[f.key].value : num(inputs[f.key].value, 0);
      });
      return v;
    }
    function draw() {
      out.textContent = "";
      var r = spec.compute(vals(), draw, out);
      if (!r) return;
      if (r.warn) {
        out.appendChild(el("div", "cft-feedback cft-bad", r.warn));
        return;
      }
      if (r.pre) r.pre(out);
      renderResult(out, r);
      if (r.extra) r.extra(out);
      if (r.summary) {
        var s = el("p", "cft-result", r.summary);
        s.setAttribute("aria-live", "polite");
        out.appendChild(s);
      }
    }
    draw();
    return { draw: draw, inputs: inputs, box: box };
  }

  // Line chart helper. o: {series:[{pts,cls,dot}], hlines:[{v,label,cls}], reveal, fmt, ext}
  // Draws into g (an L.svg result) and returns the scales.
  function lineChart(g, o) {
    g.clear();
    var w = g.w, h = g.h, ml = 46, mr = o.mr === undefined ? 12 : o.mr, mt = 12, mb = 22, n = 1, all = [];
    o.series.forEach(function (s) { n = Math.max(n, s.pts.length); all = all.concat(s.pts); });
    (o.hlines || []).forEach(function (l) { all.push(l.v); });
    var ext = o.ext || L.extent(all, 0.1);
    var sx = L.scale(0, Math.max(1, n - 1), ml, w - mr);
    var sy = L.scale(ext[0], ext[1], h - mb, mt);
    var fmt = o.fmt || kfmt;
    [0, 0.5, 1].forEach(function (t) {
      var v = ext[0] + (ext[1] - ext[0]) * t;
      g.line(ml, sy(v), w - mr, sy(v), "cft-ln-d");
      g.text(ml - 4, sy(v) + 4, fmt(v), "cft-tx cft-tx-s", "end");
    });
    (o.hlines || []).forEach(function (l) {
      g.line(ml, sy(l.v), w - mr, sy(l.v), l.cls || "cft-ln-hi");
      if (l.label) g.text(w - mr + 3, sy(l.v) + 3, l.label, "cft-tx cft-tx-s", "start");
    });
    var rev = o.reveal === undefined ? n : o.reveal;
    o.series.forEach(function (s) {
      var pts = s.pts.slice(0, rev).map(function (v, i) { return [sx(i), sy(v)]; });
      if (pts.length > 1) g.path(pts, s.cls || "cft-pl");
      if (pts.length && !s.noDot) {
        var lp = pts[pts.length - 1];
        g.circle(lp[0], lp[1], 4, s.dot || "cft-dot-b");
      }
    });
    if (o.xlabel) g.text((ml + w - mr) / 2, h - 5, o.xlabel, "cft-tx cft-tx-s", "middle");
    return { sx: sx, sy: sy, n: n };
  }

  // Generic animated lab. o: {title,hint,aria,w,h,fields,interval,compute(vals)->model,extra(row,ctl)}
  // model: {warn, total, rows, bars, notes, summary, draw(g, shown), status(shown)->string|node}
  // The picture starts finished. Press Step or Play to replay it from the start.
  function lab(host, o) {
    var b = L.box(host, o.title, o.hint);
    var shown = 0, model = null, an = null;
    var form = fieldSet(b.body, o.fields, function () { recompute(true); });
    var stage = el("div", "cft-stage");
    b.body.appendChild(stage);
    var g = L.svg(stage, o.w || 340, o.h || 210);
    g.svg.setAttribute("aria-label", o.aria || o.title);
    var status = el("div", "cft-status");
    stage.appendChild(status);
    var animBox = el("div");
    b.body.appendChild(animBox);
    var extraRow = null;
    if (o.extra) { extraRow = el("div", "cft-btn-row"); b.body.appendChild(extraRow); }
    var out = el("div", "cft-out");
    b.body.appendChild(out);
    var res = resultLine(b.body);

    function setStatus(st) {
      status.textContent = "";
      if (st && typeof st === "object") status.appendChild(st);
      else if (st) status.textContent = st;
    }
    function paint() {
      if (!model || model.warn) return;
      model.draw(g, shown);
      setStatus(model.status ? model.status(shown) : "");
    }
    function recompute(resetAnim) {
      model = o.compute(form.vals());
      out.textContent = "";
      if (model.warn) {
        out.appendChild(el("div", "cft-feedback cft-bad", model.warn));
        res.textContent = "";
        g.clear();
        setStatus("");
        return;
      }
      renderResult(out, model);
      res.textContent = model.summary || "";
      if (resetAnim && an) { an.pause(); an.setIndex(0); }
      shown = model.total;
      paint();
    }
    an = L.anim(animBox, {
      interval: o.interval || 800,
      step: function (i) {
        if (!model || model.warn) return false;
        var n = model.total;
        if (i >= n) { an.setIndex(0); i = 0; }
        shown = i + 1;
        paint();
        return shown < n;
      },
      reset: function () { shown = 0; paint(); },
    });
    var ctl = {
      showAll: function () {
        if (!model || model.warn) return;
        an.pause();
        an.setIndex(model.total);
        shown = model.total;
        paint();
      },
      refresh: function () { recompute(true); },
      anim: an,
    };
    if (o.extra) o.extra(extraRow, ctl);
    recompute(false);
    return { form: form, ctl: ctl, box: b };
  }

  // Multiple-choice check. o: {q, options:[text], correct:index, explain(i)->string, intro}
  function pickOne(parent, o) {
    var b = L.box(parent, o.title || "Your turn", o.intro);
    b.body.appendChild(el("p", "cft-q-prompt", o.q));
    var name = "pick-" + Math.random().toString(36).slice(2, 8);
    var inputs = [], fb = el("div");
    o.options.forEach(function (t, i) {
      var lab2 = el("label", "cft-opt");
      var inp = el("input");
      inp.type = "radio"; inp.name = name; inp.value = String(i);
      inp.addEventListener("change", function () { fb.textContent = ""; });
      inputs.push(inp);
      lab2.appendChild(inp);
      lab2.appendChild(el("span", null, " " + t));
      b.body.appendChild(lab2);
    });
    L.button(b.body, "Check my answer", function () {
      fb.textContent = "";
      var pick = -1;
      inputs.forEach(function (inp, i) { if (inp.checked) pick = i; });
      if (pick < 0) { L.feedback(fb, false, "Pick one answer first."); return; }
      var ok = pick === o.correct;
      L.feedback(fb, ok, (ok ? "Correct. " : "Not quite. ") + o.explain(pick));
    });
    b.body.appendChild(fb);
    return b;
  }

  // ---------------------------------------------------------------
  // Position size
  // ---------------------------------------------------------------
  D["position-size-viz"] = function (p, host) {
    build(host, {
      title: "Position size calculator (practice numbers)",
      hint: "What to try: move the stop-loss price closer to or further from the entry, and watch which bar is the shortest. The shortest bar decides how many shares you may buy.",
      fields: [
        { key: "capital", label: "Capital (Rs)", value: P(p, "capital", 50000) },
        { key: "riskPct", label: "Risk per trade (%)", value: P(p, "riskPct", 1), step: 0.1 },
        { key: "entry", label: "Entry price (Rs)", value: P(p, "entry", 250) },
        { key: "stop", label: "Stop-loss price (Rs)", value: P(p, "stop", 240) },
        { key: "maxPct", label: "Max in one stock (% of capital)", value: P(p, "maxPositionPct", 25) },
      ],
      compute: function (v) {
        var rps = v.entry - v.stop;
        if (v.entry <= 0 || v.capital <= 0) return { warn: "Enter a capital and an entry price above zero." };
        if (rps <= 0) return { warn: "For a buy, the stop must be below the entry price." };
        var budget = (v.capital * v.riskPct) / 100;
        var raw = Math.floor(budget / rps);
        var cash = Math.floor(v.capital / v.entry);
        var conc = Math.floor((v.capital * v.maxPct) / 100 / v.entry);
        var shares = Math.min(raw, cash, conc);
        var bind = shares === raw ? "your risk limit" : shares === conc ? "the max-in-one-stock limit" : "the cash you have";
        return {
          pre: function (out) {
            var g = L.svg(out, 340, 124);
            g.svg.setAttribute("aria-label", "Three bars: shares allowed by the risk limit (" + raw + "), the cash limit (" + cash + ") and the one-stock limit (" + conc + "). The shortest bar decides: " + shares + " shares.");
            var items = [["Risk limit", raw], ["Cash limit", cash], ["One-stock limit", conc]];
            var mx = Math.max(raw, cash, conc, 1);
            var sx = L.scale(0, mx, 110, 250);
            items.forEach(function (it, i) {
              var y = 10 + i * 30;
              var hi = it[1] === shares;
              g.text(104, y + 13, it[0], hi ? "cft-tx cft-tx-b" : "cft-tx", "end");
              g.rect(110, y, Math.max(2, sx(it[1]) - 110), 18, hi ? "cft-dot" : "cft-rc");
              g.text(Math.max(sx(it[1]), 112) + 5, y + 13, it[1] + " shares", hi ? "cft-tx cft-tx-b" : "cft-tx");
            });
            g.text(110, 114, "Orange bar = the shortest one. It decides.", "cft-tx cft-tx-s");
          },
          rows: [
            ["Money you accept to lose (risk budget)", inr(budget)],
            ["Risk per share (entry - stop)", inr(rps)],
            ["Shares allowed by risk (budget / risk per share)", raw + ""],
            ["Shares your cash can buy", cash + ""],
            ["Shares allowed by the one-stock limit", conc + ""],
            ["Shares to buy (the smallest of the three)", shares + "", true],
            ["Position value", inr(shares * v.entry)],
            ["Loss if the stop is hit", inr(shares * rps)],
            ["That loss as % of capital", pct((shares * rps * 100) / v.capital, 2)],
          ],
          notes: ["The smallest limit decides. Here it is " + bind + ". Costs and slippage are not included."],
          summary: "You may buy " + shares + " shares. If the stop is hit you lose " + inr(shares * rps) + ", which is " + pct((shares * rps * 100) / v.capital, 2) + " of your capital.",
        };
      },
    });
    if (hasOnlyCaption(p)) doublingStake(host);
  };

  // Theory only: what happens to the stake if you double after each loss.
  function doublingStake(host) {
    var shown = 8;
    var b = L.box(host, "Doubling the stake after each loss (theory only)", "What to try: press Play. Each loss doubles the next stake. Watch the stake and the total lost grow faster than your capital can follow. This is a warning, not a method.");
    var form = fieldSet(b.body, [
      { key: "base", label: "First stake (Rs)", value: 500 },
      { key: "cap", label: "Capital (Rs)", value: 50000 },
    ], function () { an.pause(); an.setIndex(0); shown = 8; paint(); });
    var g = L.svg(b.body, 340, 190);
    g.svg.setAttribute("aria-label", "Bars showing the stake after each losing trade when the stake doubles every time.");
    var animBox = el("div");
    b.body.appendChild(animBox);
    var res = resultLine(b.body);
    function paint() {
      var v = form.vals(), base = Math.max(1, v.base), cap = Math.max(1, v.cap);
      g.clear();
      var maxStake = base * Math.pow(2, 7);
      var sx = L.scale(0, maxStake, 0, 130);
      g.text(8, 12, "Stake on each trade after a run of losses (Rs)", "cft-tx cft-tx-s");
      for (var k = 0; k < 8; k++) {
        var y = 20 + k * 20;
        var stake = base * Math.pow(2, k);
        var lostBefore = base * (Math.pow(2, k) - 1);
        g.text(46, y + 12, k === 0 ? "1st" : (k + 1) + "th", "cft-tx cft-tx-s", "end");
        if (k < shown) {
          var over = lostBefore + stake > cap;
          g.rect(52, y, Math.max(2, sx(stake)), 14, over ? "cft-rc-down" : "cft-rc");
          g.text(52 + Math.max(2, sx(stake)) + 4, y + 11, inr(stake), "cft-tx cft-tx-s");
        }
      }
      var lost = base * (Math.pow(2, shown) - 1), next = base * Math.pow(2, shown);
      g.text(8, 184, "Red bar: lost so far plus this stake is more than your capital.", "cft-tx cft-tx-s");
      res.textContent = "After " + shown + " losses in a row you have lost " + inr(lost) + " (" + pct((lost * 100) / cap, 1) + " of " + inr(cap) + "). The next stake would be " + inr(next) + (next + lost > cap ? ", which you could not cover." : ".");
    }
    var an = L.anim(animBox, {
      interval: 800,
      total: 8,
      step: function (i) { shown = i + 1; paint(); },
      reset: function () { shown = 0; paint(); },
    });
    paint();
  }

  // ---------------------------------------------------------------
  // Stop-loss, gaps and circuits
  // ---------------------------------------------------------------

  // One-day price chart with stop lines. o: {pts, gapAt, lines:[{v,label,cls}], marks:[{i,v,label,cls}], band:{from,to}, reveal}
  function dayChart(g, o) {
    g.clear();
    var w = g.w, h = g.h, ml = 46, mr = 74, mt = 14, mb = 24, n = o.pts.length;
    var vals = o.pts.slice();
    o.lines.forEach(function (l) { vals.push(l.v); });
    var ext = L.extent(vals, 0.12);
    var sx = L.scale(0, n - 1, ml, w - mr);
    var sy = L.scale(ext[0], ext[1], h - mb, mt);
    if (o.band) g.rect(ml, sy(o.band.from), w - mr - ml, Math.abs(sy(o.band.to) - sy(o.band.from)), "cft-rc-band");
    o.lines.forEach(function (l) {
      g.line(ml, sy(l.v), w - mr, sy(l.v), l.cls || "cft-ln-d");
      g.text(w - mr + 3, sy(l.v) + 3, l.label, "cft-tx cft-tx-s");
    });
    [0, 1].forEach(function (t) {
      var v = ext[0] + (ext[1] - ext[0]) * t;
      g.text(ml - 4, sy(v) + 4, kfmt(v), "cft-tx cft-tx-s", "end");
    });
    var rev = Math.min(o.reveal, n);
    var seg = [];
    for (var i = 0; i < rev; i++) {
      if (o.gapAt >= 0 && i === o.gapAt && seg.length) {
        g.path(seg, "cft-pl");
        g.path([seg[seg.length - 1], [sx(i), sy(o.pts[i])]], "cft-pl-d");
        seg = [];
      }
      seg.push([sx(i), sy(o.pts[i])]);
    }
    if (seg.length > 1) g.path(seg, "cft-pl");
    if (rev > 0) g.circle(sx(rev - 1), sy(o.pts[rev - 1]), 4, "cft-dot-b");
    if (o.gapAt >= 0) {
      g.text(sx(o.gapAt - 1), h - 6, "Close", "cft-tx cft-tx-s", "end");
      g.text(sx(o.gapAt), h - 6, "Next open", "cft-tx cft-tx-s", "start");
    }
    (o.marks || []).forEach(function (m) {
      if (rev > m.i) {
        g.circle(sx(m.i), sy(m.v), 5, m.cls || "cft-dot");
        var x = sx(m.i);
        g.text(x > w - mr - 70 ? x - 8 : x + 8, sy(m.v) + (m.up ? -8 : 15), m.label, "cft-tx cft-tx-s cft-tx-b", x > w - mr - 70 ? "end" : "start");
      }
    });
  }

  D["sl-trigger-sim"] = function (p, host) {
    var mode = L.S(p, "mode", "");
    if (p.limit !== undefined || mode === "normal" || mode === "compare") {
      slCompare(p, host);
    } else if (p.bandPct !== undefined || p.scenario !== undefined || mode === "circuit-lock" || (p.prevClose !== undefined && mode !== "gap-through-stop")) {
      slCircuit(p, host);
    } else {
      slGap(p, host);
    }
  };

  // Mode: gap through the stop (the original demo, now a picture that moves).
  function slGap(p, host) {
    var stopP = p.stop !== undefined ? p.stop : p.trigger;
    var openP = p.open !== undefined ? p.open : p.openPrice;
    var entryDef = p.entry !== undefined ? num(p.entry, 250) : (stopP !== undefined ? num(stopP, 240) + 10 : 250);
    var wig = [0, 0.15, -0.1, 0.2, -0.05, 0.1];
    var drift = [0, -0.05, 0.08, 0.02, -0.04, 0.03];
    lab(host, {
      title: "Stop-loss and an overnight gap (practice numbers)",
      hint: "What to try: press Play and watch one day and one night. Then change the next day's opening price. Put it above the stop, then well below it, and compare the planned loss with the actual loss.",
      aria: "Price chart. The price falls toward the stop-loss, then the market opens the next day and the fill happens near the open, which can be below the stop.",
      h: 215,
      interval: 700,
      fields: [
        { key: "capital", label: "Capital (Rs)", value: P(p, "capital", 50000) },
        { key: "riskPct", label: "Risk per trade (%)", value: P(p, "riskPct", 1), step: 0.1 },
        { key: "entry", label: "Entry price (Rs)", value: entryDef },
        { key: "stop", label: "Stop-loss (Rs)", value: stopP !== undefined ? num(stopP, 240) : 240 },
        { key: "open", label: "Next day's opening price (Rs)", value: openP !== undefined ? num(openP, 232) : 232 },
        { key: "slip", label: "Extra slippage per share (Rs)", value: P(p, "slippage", 0) },
      ],
      compute: function (v) {
        var rps = v.entry - v.stop;
        if (rps <= 0) return { warn: "For a buy, the stop must be below the entry price." };
        var budget = (v.capital * v.riskPct) / 100;
        var fixedQty = p.shares !== undefined ? num(p.shares, 0) : 0;
        var qty = fixedQty > 0 ? fixedQty : Math.floor(budget / rps);
        var planned = qty * rps;
        var fill = Math.min(v.open, v.stop) - v.slip;
        var actual = qty * (v.entry - fill);
        var gapped = v.open < v.stop;
        var total = 12, gapAt = 6, pts = [], k;
        for (k = 0; k < gapAt; k++) pts.push(v.entry - rps * 0.65 * (k / (gapAt - 1)) + wig[k] * rps * 0.2);
        pts[0] = v.entry;
        if (gapped) {
          for (k = gapAt; k < total; k++) pts.push(v.open + drift[k - gapAt] * rps);
        } else {
          for (k = gapAt; k < total; k++) {
            var t = Math.min(1, (k - gapAt) / 3);
            pts.push(v.open - (v.open - v.stop) * t);
          }
        }
        var fillIdx = gapped ? gapAt + 1 : gapAt + 3;
        var rows = [
          ["Shares (risk budget / risk per share)", qty + ""],
          ["Planned loss if the stop fills exactly", inr(planned)],
          ["Where your sell order really fills", inr(fill)],
          ["Actual loss", inr(actual), true],
          ["Actual loss compared with planned", planned > 0 ? (actual / planned).toFixed(2) + " x" : "-"],
          ["Actual loss as % of capital", pct((actual * 100) / v.capital, 2)],
        ];
        if (fixedQty > 0) rows[0] = ["Shares you hold", qty + ""];
        if (p.prevClose !== undefined && num(p.prevClose, 0) > 0) {
          var pc = num(p.prevClose, 0);
          rows.push(["Gap from yesterday's close (" + inr(pc) + ")", pct(((v.open - pc) * 100) / pc, 2)]);
        }
        return {
          total: total,
          rows: rows,
          bars: [
            { label: "Planned loss", value: planned, text: inr(planned) },
            { label: "Actual loss", value: actual, text: inr(actual), hi: actual > planned },
          ],
          notes: [
            gapped
              ? "The price opened below your stop, so the stop turned into a sell order at the opening price or worse."
              : "The price did not gap below the stop, so the fill is at the stop (less any slippage).",
          ],
          summary: "Planned loss " + inr(planned) + ". Actual loss " + inr(actual) + (planned > 0 ? ", which is " + (actual / planned).toFixed(2) + " times the plan" : "") + " and " + pct((actual * 100) / v.capital, 2) + " of your capital.",
          draw: function (g, shownN) {
            dayChart(g, {
              pts: pts, gapAt: gapAt, reveal: shownN,
              band: { from: v.entry, to: v.stop },
              lines: [
                { v: v.entry, label: "Entry " + plainNum(v.entry), cls: "cft-ln" },
                { v: v.stop, label: "Stop " + plainNum(v.stop), cls: "cft-ln-hi" },
              ],
              marks: [
                { i: gapAt, v: v.open, label: "Open " + plainNum(v.open), cls: "cft-dot-b", up: true },
                { i: fillIdx, v: fill, label: "Fill " + plainNum(r2(fill)), cls: "cft-dot" },
              ],
            });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step to watch one day and one night.";
            if (s < gapAt) return "Day 1. The price drifts lower. Your stop is at " + inr(v.stop) + ".";
            if (s === gapAt) return "The market closes. Your stop was not hit today. You still hold the shares.";
            if (s === gapAt + 1) return gapped
              ? "Next morning the price opens at " + inr(v.open) + ". That is below your stop of " + inr(v.stop) + ". No trade happened at " + inr(v.stop) + "."
              : "Next morning the price opens at " + inr(v.open) + ", still above your stop.";
            if (s < total) return gapped ? "Your stop turns into a sell order. It fills near the open, not at the stop." : "The price falls to your stop and the sell order fills there.";
            return "Done. Planned loss " + inr(planned) + ". Actual loss " + inr(actual) + ".";
          },
        };
      },
    });
  }

  // Mode: circuit lock. The price falls to the lower limit and there are no buyers.
  function slCircuit(p, host) {
    lab(host, {
      title: "Price band and stop-loss (practice numbers)",
      hint: "What to try: set a stop above the lower limit and press Play. The price falls past your stop and locks at the lower limit. Then set how far the price falls to see when the lock does not happen.",
      aria: "Price chart. The price falls from yesterday's close, passes the stop-loss and stops at the lower price limit, where there are no buyers.",
      h: 215,
      interval: 650,
      fields: [
        { key: "prev", label: "Yesterday's close (Rs)", value: P(p, "prevClose", 400) },
        { key: "band", label: "Price band (%)", value: P(p, "bandPct", 10), step: 0.5 },
        { key: "qty", label: "Shares you hold", value: P(p, "qty", 100) },
        { key: "stop", label: "Your stop-loss (Rs)", value: P(p, "stop", 0) },
        { key: "fall", label: "How far the price falls (% of the allowed fall)", value: 100, step: 5 },
      ],
      compute: function (v) {
        if (v.prev <= 0) return { warn: "Enter yesterday's close." };
        var low = v.prev * (1 - v.band / 100);
        var high = v.prev * (1 + v.band / 100);
        var fall = L.clamp(v.fall, 0, 100);
        var bottom = v.prev - (v.prev - low) * (fall / 100);
        var locked = fall >= 100 && v.band > 0;
        var rows = [
          ["Lowest price allowed today", inr(low)],
          ["Highest price allowed today", inr(high)],
          ["Most the price can fall from yesterday's close", inr((v.prev - low) * v.qty) + " on " + v.qty + " shares"],
        ];
        var notes = ["If a stock is locked at its lower price limit, there may be no buyers. Your sell order can wait without filling."];
        var stopHit = v.stop > 0 && bottom <= v.stop;
        if (v.stop > 0) {
          if (v.stop > low) {
            rows.push(["Stop is above the lower limit by", inr(v.stop - low) + " per share"]);
            rows.push(["Extra loss if you can only exit at the lower limit", inr((v.stop - low) * v.qty), true]);
            rows.push(["Planned loss if you sell at your stop", inr((v.prev - v.stop) * v.qty)]);
            rows.push(["Loss if you are stuck at the lower limit", inr((v.prev - low) * v.qty)]);
            notes.push("The stop is what you planned. The lower limit is where you might really be stuck.");
          } else {
            notes.push("This stop is at or below the lower limit, so it cannot trigger today.");
          }
        }
        var total = 12, pts = [], k;
        for (k = 0; k < total; k++) {
          var t = Math.min(1, k / 8);
          var e = 1 - Math.pow(1 - t, 1.6);
          pts.push(v.prev - (v.prev - bottom) * e);
        }
        var hitIdx = -1;
        if (stopHit) { for (k = 0; k < total; k++) { if (pts[k] <= v.stop) { hitIdx = k; break; } } }
        var lines = [
          { v: v.prev, label: "Close " + plainNum(r2(v.prev)), cls: "cft-ln" },
          { v: low, label: "Limit " + plainNum(r2(low)), cls: "cft-ln-hi" },
        ];
        if (v.stop > 0 && v.stop > low) lines.push({ v: v.stop, label: "Stop " + plainNum(r2(v.stop)), cls: "cft-ln-d" });
        var sum;
        if (stopHit && locked && v.stop > low) {
          sum = "The price passed your stop of " + inr(v.stop) + " and locked at " + inr(low) + ". If you could only sell there, the loss is " + inr((v.prev - low) * v.qty) + " instead of the planned " + inr((v.prev - v.stop) * v.qty) + ".";
        } else if (stopHit) {
          sum = "The price reached your stop. Whether you can sell at " + inr(v.stop) + " depends on buyers being there.";
        } else if (v.stop > 0) {
          sum = "In this picture the price did not reach your stop of " + inr(v.stop) + ". It fell to " + inr(r2(bottom)) + ".";
        } else {
          sum = "The price can fall at most to " + inr(low) + " today. That is " + inr((v.prev - low) * v.qty) + " on " + v.qty + " shares.";
        }
        return {
          total: total,
          rows: rows,
          notes: notes,
          summary: sum,
          draw: function (g, s) {
            var marks = [];
            if (hitIdx >= 0) marks.push({ i: hitIdx, v: v.stop, label: "Stop reached", cls: "cft-dot", up: true });
            if (locked) marks.push({ i: total - 1, v: low, label: "Locked", cls: "cft-dot-b" });
            dayChart(g, { pts: pts, gapAt: -1, reveal: s, lines: lines, marks: marks });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. The price starts at yesterday's close.";
            var cur = pts[Math.min(s, total) - 1];
            if (s >= total) {
              return locked
                ? "Locked at the lower limit. There are only sellers. Your sell order waits. You still hold the shares."
                : "The price stopped at " + inr(r2(bottom)) + ", above the lower limit.";
            }
            if (v.stop > 0 && cur <= v.stop) return "The price has reached your stop. A sale needs a buyer at that price, and buyers are disappearing.";
            return "The price is falling. It is now about " + inr(r2(cur)) + ".";
          },
        };
      },
    });
  }

  // Mode: normal. Compare SL (stop-loss limit) with SL-M (stop-loss market).
  function slCompare(p, host) {
    var trig = p.trigger !== undefined ? p.trigger : p.stop;
    var openP = p.openPrice !== undefined ? p.openPrice : p.open;
    lab(host, {
      title: "SL and SL-M for a long holding (practice numbers)",
      hint: "What to try: start with an orderly fall and press Play. Then switch to a gap and compare what the SL order and the SL-M order do. Try an opening price between the limit and the trigger.",
      aria: "Price chart comparing an SL order and an SL-M order. In an orderly fall both fill near the trigger or limit. In a gap the SL order may not fill and the SL-M order fills near the open.",
      h: 215,
      interval: 650,
      fields: [
        { key: "entry", label: "Entry price (Rs)", value: P(p, "entry", 250) },
        { key: "trigger", label: "Trigger price (Rs)", value: trig !== undefined ? num(trig, 240) : 240 },
        { key: "limit", label: "SL limit price (Rs)", value: P(p, "limit", 238) },
        { key: "open", label: "Opening price in a gap (Rs)", value: openP !== undefined ? num(openP, 232) : 232 },
        { key: "qty", label: "Shares you hold", value: P(p, "shares", 50) },
        { key: "kind", label: "What happens to the price", value: L.S(p, "mode", "normal") === "gap" ? "gap" : "normal", options: [["normal", "Orderly fall"], ["gap", "Gap at the open"]] },
      ],
      compute: function (v) {
        if (v.entry <= v.trigger) return { warn: "For a long holding, the trigger must be below the entry price." };
        if (v.limit > v.trigger) return { warn: "The limit should be at or below the trigger for a sell stop." };
        var planned = v.qty * (v.entry - v.trigger);
        var gap = v.kind === "gap" && v.open < v.trigger;
        var slFill, slLoss, slmFill, slmLoss;
        if (!gap) {
          slFill = v.limit; slLoss = v.qty * (v.entry - v.limit);
          slmFill = v.trigger; slmLoss = v.qty * (v.entry - v.trigger);
        } else {
          slmFill = v.open; slmLoss = v.qty * (v.entry - v.open);
          if (v.open >= v.limit) { slFill = v.open; slLoss = v.qty * (v.entry - v.open); }
          else { slFill = null; slLoss = null; }
        }
        var rows = [
          ["Planned loss at the trigger", inr(planned)],
          ["SL order: fill", slFill === null ? "No fill. The order stays open." : (gap ? inr(slFill) : inr(slFill))],
          ["SL order: loss", slLoss === null ? "Not sold yet. The loss is still open and can grow." : inr(slLoss), true],
          ["SL-M order: fill", gap ? "About " + inr(slmFill) : "About " + inr(slmFill) + " (can be a little worse)"],
          ["SL-M order: loss", inr(slmLoss), true],
        ];
        var total = 12, gapAt = 6, pts = [], k, span = v.entry - v.limit;
        if (!gap) {
          for (k = 0; k < total; k++) pts.push(v.entry - (span + 2) * (k / (total - 1)));
        } else {
          for (k = 0; k < gapAt; k++) pts.push(v.entry - (v.entry - v.trigger - 0.5) * (k / (gapAt - 1)));
          var dd = Math.max(0.2, (v.entry - v.trigger) * 0.04);
          for (k = gapAt; k < total; k++) pts.push(v.open + [0, -1, 1, 0.5, -0.5, 0.5][k - gapAt] * dd);
        }
        var trigIdx = 0, limIdx = 0;
        if (!gap) {
          for (k = 0; k < total; k++) { if (pts[k] <= v.trigger) { trigIdx = k; break; } }
          for (k = 0; k < total; k++) { if (pts[k] <= v.limit) { limIdx = k; break; } }
        }
        var sum;
        if (!gap) sum = "In an orderly fall the SL order fills at " + inr(v.limit) + " (loss " + inr(slLoss) + ") and the SL-M order fills near " + inr(v.trigger) + " (loss about " + inr(slmLoss) + "). The plan was " + inr(planned) + ".";
        else if (slFill === null) sum = "In the gap the SL order does not fill (the open of " + inr(v.open) + " is below its limit of " + inr(v.limit) + "). The SL-M order fills near " + inr(v.open) + " and loses " + inr(slmLoss) + ".";
        else sum = "In the gap both orders fill near the open of " + inr(v.open) + ", for a loss of " + inr(slmLoss) + ".";
        return {
          total: total,
          rows: rows,
          notes: ["Illustration with made-up numbers. Real fills depend on the market at that moment."],
          summary: sum,
          draw: function (g, s) {
            var marks = [];
            if (!gap) {
              marks.push({ i: trigIdx, v: v.trigger, label: "SL-M sells", cls: "cft-dot-b", up: true });
              marks.push({ i: Math.max(limIdx, trigIdx + 1 > total - 1 ? total - 1 : limIdx), v: v.limit, label: "SL sells", cls: "cft-dot" });
            } else {
              marks.push({ i: gapAt, v: v.open, label: "Open", cls: "cft-dot-b", up: true });
              marks.push({ i: gapAt + 1, v: slFill === null ? v.limit : slFill, label: slFill === null ? "SL waits" : "SL sells", cls: slFill === null ? "cft-dot-b" : "cft-dot" });
            }
            dayChart(g, {
              pts: pts, gapAt: gap ? gapAt : -1, reveal: s,
              band: { from: v.entry, to: v.trigger },
              lines: [
                { v: v.entry, label: "Entry " + plainNum(v.entry), cls: "cft-ln" },
                { v: v.trigger, label: "Trigger " + plainNum(v.trigger), cls: "cft-ln-hi" },
                { v: v.limit, label: "Limit " + plainNum(v.limit), cls: "cft-ln-d" },
              ],
              marks: marks,
            });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. You hold " + v.qty + " shares bought at " + inr(v.entry) + ".";
            if (!gap) {
              var cur = pts[Math.min(s, total) - 1];
              if (cur > v.trigger) return "The price falls steadily. Nothing happens until it reaches the trigger of " + inr(v.trigger) + ".";
              if (cur > v.limit) return "Trigger reached. The SL order becomes a limit order at " + inr(v.limit) + ". The SL-M order becomes a market order.";
              return "The price passed the limit. Both orders have a chance to fill close to where you planned.";
            }
            if (s < gapAt) return "Day 1. The price drifts down but has not reached the trigger.";
            if (s === gapAt) return "The market closes above the trigger. You still hold the shares.";
            if (s < total) return slFill === null
              ? "The price opens at " + inr(v.open) + ", below the limit. The SL order waits (a limit sell needs " + inr(v.limit) + " or more). The SL-M order sells near the open."
              : "The price opens at " + inr(v.open) + ". Both orders fill near the open.";
            return "Done. Compare the two results in the table.";
          },
        };
      },
    });
  }

  // ---------------------------------------------------------------
  // Drawdown and compounding
  // ---------------------------------------------------------------
  D["drawdown-compounding"] = function (p, host) {
    if (p.path !== undefined) return ddPath(p, host);
    if (p.sequence !== undefined) return ddSequence(p, host);
    if (p.trades !== undefined) return ddTrades(p, host);
    return ddRecovery(p, host);
  };

  function ddPath(p, host) {
    lab(host, {
      title: "Equity path and the peak so far (practice numbers)",
      hint: "What to try: press Play and watch the account value move. The dashed line is the peak so far (the high-water mark). Change a number in the list and see how far below the peak you are.",
      aria: "Line chart of the account value after each step, with a dashed line for the highest value so far.",
      interval: 800,
      fields: [
        { key: "path", label: "Account value after each step (Rs, comma separated)", value: p.path, text: true },
        { key: "wd", label: "Money taken out after the last step (Rs, optional)", value: 0 },
      ],
      compute: function (v) {
        var pts = parseList(v.path);
        if (pts.length < 2) return { warn: "Enter at least two numbers separated by commas." };
        var peak = pts[0], rows = [], worst = 0, peaks = [], dds = [];
        pts.forEach(function (x, i) {
          peak = Math.max(peak, x);
          var dd = ((peak - x) * 100) / peak;
          worst = Math.max(worst, dd);
          peaks.push(peak); dds.push(dd);
          var need = x > 0 ? ((peak - x) * 100) / x : 0;
          rows.push(["Step " + (i + 1) + ": " + inr(x) + " (peak " + inr(peak) + ")", pct(dd) + " below peak" + (dd > 0 ? ", needs +" + pct(need, 2) + " to recover" : "")]);
        });
        rows.push(["Deepest drop from a peak", pct(worst), true]);
        var last = pts[pts.length - 1], hw = peaks[peaks.length - 1];
        if (v.wd > 0) {
          rows.push(["After taking out " + inr(v.wd) + ": gap to the old peak", inr(hw - (last - v.wd))]);
          rows.push(["If the peak is lowered by the same amount, the gap stays", inr(hw - last)]);
        }
        var lastNeed = last > 0 ? ((hw - last) * 100) / last : 0;
        return {
          total: pts.length,
          rows: rows,
          notes: ["The peak so far is called the high-water mark. A drawdown is how far you are below it."],
          summary: "At the last step the account is " + inr(last) + ", which is " + pct(dds[dds.length - 1], 2) + " below the peak of " + inr(hw) + (dds[dds.length - 1] > 0 ? ". To get back to the peak it needs a gain of " + pct(lastNeed, 2) + "." : ". It is at its peak.") + " The deepest drop was " + pct(worst, 2) + ".",
          draw: function (g, s) {
            lineChart(g, { series: [{ pts: peaks, cls: "cft-pl-d", noDot: true }, { pts: pts, cls: "cft-pl" }], reveal: s, xlabel: "Step (values in Rs)" });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step to add one point at a time.";
            var i = Math.min(s, pts.length) - 1;
            return "Step " + (i + 1) + ": " + inr(pts[i]) + ". Peak so far " + inr(peaks[i]) + ". " + (dds[i] > 0 ? pct(dds[i], 2) + " below the peak." : "A new high.");
          },
        };
      },
    });
  }

  function ddSequence(p, host) {
    lab(host, {
      title: "Same results, different bet size (practice numbers)",
      hint: "What to try: press Play. Both traders get the same wins and losses. Change the amount at risk for trader A and see how the two lines and the deepest drops change.",
      aria: "Two lines of account value after each trade. Both traders have the same wins and losses, but one risks a bigger amount each time.",
      interval: 700,
      fields: [
        { key: "cap", label: "Starting capital (Rs)", value: P(p, "capital", 50000) },
        { key: "a", label: "Trader A: Rs at risk per trade (R)", value: P(p, "traderA_R", 500) },
        { key: "b", label: "Trader B: Rs at risk per trade (R)", value: P(p, "traderB_R", 5000) },
        { key: "winR", label: "A win pays this many R", value: P(p, "winR", 2), step: 0.5 },
        { key: "seq", label: "Results (W = win, L = loss)", value: p.sequence, text: true },
      ],
      compute: function (v) {
        var seq = v.seq.toUpperCase().replace(/[^WL]/g, "");
        if (!seq) return { warn: "Type W and L letters, for example LLLLWWWWWL." };
        function run(R) {
          var eq = v.cap, peak = eq, worst = 0, line = [eq];
          for (var i = 0; i < seq.length; i++) {
            eq += seq[i] === "W" ? R * v.winR : -R;
            peak = Math.max(peak, eq);
            worst = Math.max(worst, ((peak - eq) * 100) / peak);
            line.push(eq);
          }
          return { end: eq, dd: worst, line: line };
        }
        var A = run(v.a), B = run(v.b);
        var wins = seq.split("W").length - 1;
        return {
          total: seq.length + 1,
          rows: [
            ["Trades / wins / losses", seq.length + " / " + wins + " / " + (seq.length - wins)],
            ["Trader A ends at", inr(A.end)],
            ["Trader A deepest drop", pct(A.dd), true],
            ["Trader B ends at", inr(B.end)],
            ["Trader B deepest drop", pct(B.dd), true],
          ],
          bars: [
            { label: "A drop", value: A.dd, text: pct(A.dd) },
            { label: "B drop", value: B.dd, text: pct(B.dd), hi: true },
          ],
          notes: ["Both traders get exactly the same wins and losses. Only the amount at risk changes."],
          summary: "Trader A ends at " + inr(A.end) + " after a deepest drop of " + pct(A.dd) + ". Trader B ends at " + inr(B.end) + " after a deepest drop of " + pct(B.dd) + ". Same results, very different ride.",
          draw: function (g, s) {
            lineChart(g, { series: [{ pts: A.line, cls: "cft-pl", dot: "cft-dot-b" }, { pts: B.line, cls: "cft-pl-o", dot: "cft-dot" }], reveal: s, xlabel: "Trade number. Blue = A, orange = B (values in Rs)" });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. Both traders start with " + inr(v.cap) + ".";
            var i = Math.min(s, seq.length + 1) - 1;
            if (i === 0) return "Start: both at " + inr(v.cap) + ".";
            return "Trade " + i + ": " + (seq[i - 1] === "W" ? "win" : "loss") + ". A is at " + inr(A.line[i]) + ". B is at " + inr(B.line[i]) + ".";
          },
        };
      },
    });
  }

  function ddTrades(p, host) {
    lab(host, {
      title: "Equity after each trade, and the maximum drawdown (practice numbers)",
      hint: "What to try: press Play and watch the equity line. Find the highest point before the biggest fall, then the lowest point after it. Change a trade result and see the maximum drawdown change.",
      aria: "Line chart of total profit after each trade, with the peak and the lowest point after it marked.",
      interval: 800,
      fields: [
        { key: "trades", label: "Result of each trade (Rs, comma separated)", value: p.trades, text: true },
        { key: "start", label: "Starting equity (Rs)", value: P(p, "start", 0) },
      ],
      compute: function (v) {
        var res = parseList(v.trades);
        if (res.length < 1) return { warn: "Enter at least one trade result, for example 1000, -500, 1500." };
        var eq = [v.start], i, rows = [];
        for (i = 0; i < res.length; i++) eq.push(eq[i] + res[i]);
        var peak = eq[0], peakI = 0, bestDD = 0, ddPeakI = 0, ddLowI = 0;
        for (i = 0; i < eq.length; i++) {
          if (eq[i] > peak) { peak = eq[i]; peakI = i; }
          if (peak - eq[i] > bestDD) { bestDD = peak - eq[i]; ddPeakI = peakI; ddLowI = i; }
        }
        for (i = 0; i < res.length; i++) rows.push(["Trade " + (i + 1) + ": " + (res[i] >= 0 ? "+" : "") + kfmt(res[i]), "Equity " + inr(eq[i + 1])]);
        rows.push(["Highest point before the biggest fall", inr(eq[ddPeakI])]);
        rows.push(["Lowest point after it", inr(eq[ddLowI])]);
        rows.push(["Maximum drawdown", inr(bestDD), true]);
        if (eq[ddPeakI] > 0 && bestDD > 0) rows.push(["As % of that highest point", pct((bestDD * 100) / eq[ddPeakI], 1)]);
        return {
          total: eq.length,
          rows: rows,
          notes: ["A few trades say little. This picture describes these trades only."],
          summary: bestDD > 0
            ? "The equity peaked at " + inr(eq[ddPeakI]) + " after trade " + ddPeakI + " and fell to " + inr(eq[ddLowI]) + " after trade " + ddLowI + ". The maximum drawdown is " + inr(bestDD) + "."
            : "The equity never fell below an earlier high. The maximum drawdown is Rs 0.",
          draw: function (g, s) {
            var sc = lineChart(g, { series: [{ pts: eq, cls: "cft-pl" }], reveal: s, xlabel: "Trade number (values in Rs)" });
            if (bestDD > 0 && s > ddPeakI) {
              g.circle(sc.sx(ddPeakI), sc.sy(eq[ddPeakI]), 5, "cft-dot");
              g.text(sc.sx(ddPeakI), sc.sy(eq[ddPeakI]) - 9, "Peak", "cft-tx cft-tx-s cft-tx-b", "middle");
            }
            if (bestDD > 0 && s > ddLowI) {
              g.circle(sc.sx(ddLowI), sc.sy(eq[ddLowI]), 5, "cft-dot");
              g.text(sc.sx(ddLowI), sc.sy(eq[ddLowI]) + 15, "Low", "cft-tx cft-tx-s cft-tx-b", "middle");
            }
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step to add one trade at a time.";
            var i = Math.min(s, eq.length) - 1;
            if (i === 0) return "Start at " + inr(eq[0]) + ".";
            return "Trade " + i + ": " + (res[i - 1] >= 0 ? "+" : "") + inr(res[i - 1]) + ". Equity is now " + inr(eq[i]) + ".";
          },
        };
      },
    });
  }

  function ddRecovery(p, host) {
    lab(host, {
      title: "How much gain you need to recover a loss (practice numbers)",
      hint: "What to try: press Play and watch the loss grow. The gain needed to get back climbs faster and faster. Then type your own loss percentage.",
      aria: "Curve of the gain needed to recover against the size of the loss. The curve gets steeper as the loss gets bigger.",
      interval: 650,
      fields: [
        { key: "cap", label: "Starting capital (Rs)", value: P(p, "startCapital", 50000) },
        { key: "loss", label: "Loss (%)", value: P(p, "lossPct", 30), step: 1 },
      ],
      compute: function (v) {
        if (v.loss <= 0 || v.loss >= 100) return { warn: "Enter a loss between 0 and 100." };
        var left = v.cap * (1 - v.loss / 100);
        var need = (v.loss / (100 - v.loss)) * 100;
        var rows = [
          ["Capital left after the loss", inr(left)],
          ["Gain needed to get back to the start", pct(need), true],
        ];
        [10, 20, 30, 50, 70].forEach(function (l) {
          rows.push(["A " + l + "% loss needs a gain of", pct((l / (100 - l)) * 100)]);
        });
        var total = 12;
        return {
          total: total,
          rows: rows,
          bars: [
            { label: "Loss", value: v.loss, text: pct(v.loss) },
            { label: "Gain needed", value: Math.min(need, 400), text: pct(need), hi: true },
          ],
          notes: ["Gains are measured on a smaller base, so the climb back is always steeper than the fall."],
          summary: "After a " + pct(v.loss, 0) + " loss you have " + inr(left) + " left. You need a gain of " + pct(need) + " to get back to " + inr(v.cap) + ".",
          draw: function (g, s) {
            g.clear();
            var w = g.w, h = g.h, ml = 46, mr = 12, mt = 14, mb = 24;
            var sx = L.scale(0, 80, ml, w - mr), sy = L.scale(0, 400, h - mb, mt);
            [0, 100, 200, 300, 400].forEach(function (y) {
              g.line(ml, sy(y), w - mr, sy(y), "cft-ln-d");
              g.text(ml - 4, sy(y) + 4, y + "%", "cft-tx cft-tx-s", "end");
            });
            [0, 20, 40, 60, 80].forEach(function (x) { g.text(sx(x), h - 8, x + "%", "cft-tx cft-tx-s", "middle"); });
            g.text((ml + w - mr) / 2 + 20, h - 0, "Loss", "cft-tx cft-tx-s", "middle");
            var full = [], part = [], x;
            var curLoss = Math.min(v.loss, 79.5) * (s / total);
            for (x = 0; x <= 79.5; x += 1) full.push([sx(x), sy((x / (100 - x)) * 100)]);
            g.path(full, "cft-pl-d");
            for (x = 0; x <= curLoss; x += 0.5) part.push([sx(x), sy((x / (100 - x)) * 100)]);
            if (part.length > 1) g.path(part, "cft-pl-o");
            if (s > 0) {
              var cl = (s / total) * v.loss, cg = (cl / (100 - cl)) * 100;
              var px = sx(Math.min(cl, 80)), py = sy(Math.min(cg, 400));
              g.line(px, py, px, h - mb, "cft-ln-hi");
              g.circle(px, py, 5, "cft-dot");
              g.text(px + (px > w - 100 ? -8 : 8), py - 6, "Loss " + pct(cl, 0) + ", needs +" + pct(cg, 0), "cft-tx cft-tx-s cft-tx-b", px > w - 100 ? "end" : "start");
            }
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. The loss grows a little each step.";
            var cl = (Math.min(s, total) / total) * v.loss;
            return "A loss of " + pct(cl, 1) + " needs a gain of " + pct((cl / (100 - cl)) * 100, 1) + " to get back.";
          },
        };
      },
    });
  }

  // ---------------------------------------------------------------
  // Streaks
  // ---------------------------------------------------------------
  function feeling(win, wRun, prevL, lRun, ddPct) {
    if (win) {
      if (wRun >= 3) return "Too sure of myself";
      if (prevL >= 3) return "Relief, but still shaky";
      return "Calm and pleased";
    }
    if (lRun >= 4) return "Tempted to break my rules";
    if (lRun === 3) return "Fearful and doubting";
    if (lRun === 2) return "Frustrated, want it back";
    if (ddPct >= 10) return "Worried about the account";
    return "Disappointed but steady";
  }

  D["streak-sim"] = function (p, host) {
    if (p.losingDays !== undefined) return streakDays(p, host);
    return streakTrades(p, host);
  };

  function streakDays(p, host) {
    lab(host, {
      title: "A run of losing days (practice numbers)",
      hint: "What to try: press Play and watch the account fall one losing day at a time. The dashed line is a straight fall. Your real fall is a little slower, because each loss is a share of what is left.",
      aria: "Line chart of capital after each losing day, compared with a straight-line fall.",
      interval: 600,
      fields: [
        { key: "cap", label: "Capital (Rs)", value: P(p, "capital", 50000) },
        { key: "r", label: "Loss each day (% of capital left)", value: P(p, "riskPct", 1), step: 0.1 },
        { key: "n", label: "Losing days in a row", value: P(p, "losingDays", 5) },
      ],
      compute: function (v) {
        var f = 1 - v.r / 100;
        function lost(n) { return v.cap * (1 - Math.pow(f, n)); }
        var n = Math.max(1, Math.min(60, Math.floor(v.n)));
        var rows = [[v.n + " losing days: capital lost", inr(lost(v.n)) + " (" + pct((lost(v.n) * 100) / v.cap, 2) + ")", true]];
        [5, 10, 15].forEach(function (k) { rows.push(["After " + k + " losing days", inr(lost(k))]); });
        var curve = [], straight = [], k;
        for (k = 0; k <= n; k++) { curve.push(v.cap * Math.pow(f, k)); straight.push(v.cap - k * (v.cap * v.r / 100)); }
        return {
          total: n + 1,
          rows: rows,
          notes: ["Each day loses a share of what is left, so the loss grows a little slower than a straight line."],
          summary: "After " + v.n + " losing days at " + pct(v.r, 1) + " a day you have lost " + inr(lost(v.n)) + " (" + pct((lost(v.n) * 100) / v.cap, 2) + " of " + inr(v.cap) + ").",
          draw: function (g, s) {
            lineChart(g, { series: [{ pts: straight, cls: "cft-pl-d", noDot: true }, { pts: curve, cls: "cft-pl-r", dot: "cft-dot" }], reveal: s, xlabel: "Losing day (values in Rs)" });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. Each step is one more losing day.";
            var i = Math.min(s, n + 1) - 1;
            return i === 0 ? "Start at " + inr(v.cap) + "." : "After " + i + " losing days: " + inr(curve[i]) + " left. Lost " + inr(v.cap - curve[i]) + " (" + pct(((v.cap - curve[i]) * 100) / v.cap, 2) + ").";
          },
        };
      },
    });
  }

  function streakTrades(p, host) {
    var seed = Math.floor(Math.random() * 1000000) + 1;
    var marti = hasOnlyCaption(p);
    var capDef = p.startCapital !== undefined ? num(p.startCapital, 50000) : P(p, "capital", 50000);
    var riskDef = p.risk !== undefined ? num(p.risk, 1) : P(p, "riskPct", 1);
    if (p.R !== undefined && capDef > 0) riskDef = (num(p.R, 500) * 100) / capDef;
    var api = lab(host, {
      title: "Losing streaks in a run of trades (practice numbers)",
      hint: "What to try: press Play and watch the account and the feelings tag after each trade. Use 'Run again' for a new random run. Change the win rate and watch how long the losing runs get.",
      aria: "Account value after each simulated trade, with a strip of wins and losses below it.",
      h: 270,
      interval: 260,
      fields: [
        { key: "w", label: "Win rate (%)", value: P(p, "winRate", 50) },
        { key: "n", label: "Number of trades", value: 100 },
        { key: "k", label: "Streak length to look at", value: 3 },
        { key: "cap", label: "Starting capital (Rs)", value: capDef },
        { key: "risk", label: "Risk per trade, 1R (% of starting capital)", value: riskDef, step: 0.1 },
        { key: "winR", label: "A win pays this many R", value: P(p, "winR", 1), step: 0.5 },
        { key: "mart", label: "Double the stake after each loss? (theory only)", value: marti ? "yes" : "no", options: [["no", "No, same stake every trade"], ["yes", "Yes, show the danger"]] },
      ],
      compute: function (v) {
        var w = v.w / 100;
        if (w < 0 || w > 1) return { warn: "Win rate must be between 0 and 100." };
        var n = Math.min(Math.max(Math.floor(v.n), 1), 2000);
        var unit = (v.cap * v.risk) / 100;
        if (unit <= 0 || v.cap <= 0) return { warn: "Enter a capital and a risk above zero." };
        var rnd = L.rng(seed), eq = [v.cap], res = [], tags = [], i;
        var wins = 0, best = 0, cur = 0, bestW = 0, curW = 0, peak = v.cap, low = v.cap, prevL = 0, busted = false, stakeTxt = [];
        var martingale = v.mart === "yes";
        for (i = 0; i < n; i++) {
          var u = rnd();
          var win = u < w;
          var stake = martingale ? unit * Math.pow(2, cur) : unit;
          var bal = eq[i];
          if (stake > bal && martingale) { busted = true; break; }
          var change = win ? stake * v.winR : -stake;
          var next = bal + change;
          if (next <= 0) { eq.push(0); res.push(win); tags.push("Account is empty"); stakeTxt.push(change); busted = true; i++; break; }
          if (win) { wins++; prevL = cur; cur = 0; curW++; bestW = Math.max(bestW, curW); }
          else { cur++; best = Math.max(best, cur); curW = 0; prevL = 0; }
          peak = Math.max(peak, next); low = Math.min(low, next);
          eq.push(next); res.push(win); stakeTxt.push(change);
          tags.push(feeling(win, curW, prevL, cur, ((peak - next) * 100) / peak));
          if (win) prevL = 0;
        }
        var done = res.length;
        var losses = done - wins;
        var line = "";
        for (i = 0; i < Math.min(done, 60); i++) line += res[i] ? "W" : "L";
        var end = eq[eq.length - 1];
        var expected = (w * v.winR - (1 - w)) * unit;
        var rows = [
          ["Wins / losses in this run", wins + " / " + losses],
          ["Longest losing streak in this run", best + "", true],
          ["Chance of " + v.k + " losses in a row (next " + v.k + " trades)", pct(Math.pow(1 - w, v.k) * 100, 2)],
          ["Longest winning run in this run", bestW + ""],
          ["Account at the end / lowest point", inr(end) + " / " + inr(low)],
          ["Average result you would expect per trade (long run)", inr(expected, 0)],
        ];
        var notes = ["First trades: " + line + (done > 60 ? "..." : ""), "Each press of 'Run again' is a new random run. Real markets can cluster losses even more than this.", "The feelings tags are examples of common feelings. Yours may be different."];
        if (busted) notes.push(martingale ? "The next stake was bigger than the account. This is how doubling after losses ends." : "The account ran out of money in this run.");
        var sum = "In this run of " + done + " trades there were " + wins + " wins and " + losses + " losses. The longest losing streak was " + best + ". The account went from " + inr(v.cap) + " to " + inr(end) + ". This is one random run, not a forecast.";
        return {
          total: done + 1,
          rows: rows,
          notes: notes,
          summary: sum,
          draw: function (g, s) {
            var eqShown = eq;
            var sc = lineChart(g, { series: [{ pts: eqShown, cls: "cft-pl" }], hlines: [{ v: v.cap, label: "Start", cls: "cft-ln-d" }], mr: 40, reveal: s, xlabel: "Trade number (values in Rs)" });
            void sc;
            var show = Math.min(done, 100), cell = 13, gap = 3, perRow = 20, x0 = 12, y0 = 188;
            g.text(x0, y0 - 6, "Wins (green) and losses (red), first " + show + " trades", "cft-tx cft-tx-s");
            for (var j = 0; j < show; j++) {
              var rx = x0 + (j % perRow) * (cell + gap), ry = y0 + Math.floor(j / perRow) * (cell + gap);
              g.rect(rx, ry, cell, cell, j < s - 1 ? (res[j] ? "cft-rc-up" : "cft-rc-down") : "cft-rc-grey");
            }
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. One trade is added each step.";
            var t = Math.min(s - 1, done);
            var wrap = el("div");
            if (t === 0) { wrap.appendChild(el("p", "cft-note", "Start: " + inr(v.cap) + ".")); return wrap; }
            var runNow = 0, j;
            for (j = t - 1; j >= 0; j--) { if (!res[j]) runNow++; else break; }
            var longest = 0, c2 = 0;
            for (j = 0; j < t; j++) { if (!res[j]) { c2++; longest = Math.max(longest, c2); } else c2 = 0; }
            wrap.appendChild(el("p", "cft-note", "After " + t + " trades: account " + inr(eq[t]) + ". Losing run now: " + runNow + ". Longest losing run so far: " + longest + "."));
            var ul = el("ul", "cft-feel");
            for (j = Math.max(0, t - 4); j < t; j++) {
              var li = el("li", res[j] ? "cft-pos" : "cft-neg");
              li.appendChild(el("strong", null, "Trade " + (j + 1) + ": " + (res[j] ? "win " : "loss ") + (stakeTxt[j] >= 0 ? "+" : "") + inr(stakeTxt[j]) + " "));
              li.appendChild(el("span", "cft-chip", tags[j]));
              ul.appendChild(li);
            }
            wrap.appendChild(ul);
            return wrap;
          },
        };
      },
      extra: function (row, ctl) {
        L.button(row, "Run again", function () { seed = Math.floor(Math.random() * 1000000) + 1; ctl.refresh(); });
        L.button(row, "Show all trades", function () { ctl.showAll(); });
      },
    });
    void api;
  }

  // ---------------------------------------------------------------
  // Leverage (theory only)
  // ---------------------------------------------------------------
  D["leverage-demo"] = function (p, host) {
    lab(host, {
      title: "Leverage: theory only (practice numbers)",
      hint: "What to try: press Play and watch the price move against you. Compare your own money with no borrowing and with leverage. Raise the leverage and see how small a fall wipes you out. Theory only. No practice trades.",
      aria: "Two bars showing how much of your own money is left after a price move, with and without leverage.",
      interval: 600,
      fields: [
        { key: "cap", label: "Your own money (Rs)", value: P(p, "ownCapital", 50000) },
        { key: "lev", label: "Leverage (x)", value: P(p, "leverage", 2), step: 0.5 },
        { key: "mv", label: "Price move (%)", value: P(p, "priceMovePct", -10), step: 0.5 },
      ],
      compute: function (v) {
        if (v.cap <= 0 || v.lev < 1) return { warn: "Own money must be above zero and leverage at least 1." };
        var pos = v.cap * v.lev;
        var pl = (pos * v.mv) / 100;
        var rows = [
          ["Size of the position", inr(pos)],
          ["Gain or loss", inr(pl), true],
          ["As % of your own money", pct((pl * 100) / v.cap)],
          ["A fall of this much wipes out all your money", pct(-100 / v.lev) + " (before costs)"],
        ];
        var notes = [];
        if (pl < -v.cap) notes.push("This loss is bigger than all your own money. You would owe the difference.");
        notes.push("This is a theory demo. This book does not teach or allow leveraged trading for beginners.");
        var total = 10;
        return {
          total: total,
          rows: rows,
          notes: notes,
          summary: "A price move of " + pct(v.mv) + " with " + v.lev + "x leverage is " + inr(pl) + ", which is " + pct((pl * 100) / v.cap) + " of your own " + inr(v.cap) + (pl < -v.cap ? ". That is more than all your money." : ".") + " Without leverage the same move is " + pct(v.mv) + ".",
          draw: function (g, s) {
            g.clear();
            var t = s / total, move = v.mv * t;
            var plain = v.cap * (1 + move / 100), lever = v.cap * (1 + (v.lev * move) / 100);
            var top = Math.max(v.cap * 1.25, plain, lever);
            var low = Math.min(0, lever);
            var sx = L.scale(low, top, 96, 260);
            g.text(8, 14, "Your own money after a " + pct(move, 1) + " move in the price", "cft-tx cft-tx-s");
            var rowsD = [["No leverage", plain, "cft-rc"], [v.lev + "x leverage", lever, lever < 0 ? "cft-rc-down" : (lever < v.cap ? "cft-dot" : "cft-rc-up")]];
            rowsD.forEach(function (rd, i) {
              var y = 28 + i * 44;
              g.text(90, y + 14, rd[0], "cft-tx", "end");
              var x0 = sx(0), x1 = sx(Math.max(rd[1], 0));
              g.rect(x0, y, Math.max(1, x1 - x0), 22, rd[2]);
              if (rd[1] < 0) g.rect(sx(rd[1]), y, x0 - sx(rd[1]), 22, "cft-rc-down");
              g.text(Math.max(x1, x0) + 5, y + 15, rd[1] < 0 ? "owe " + inr(-rd[1]) : inr(rd[1]), "cft-tx cft-tx-s cft-tx-b");
            });
            g.line(sx(v.cap), 22, sx(v.cap), 112, "cft-ln-hi");
            g.text(sx(v.cap), 124, "Start " + inr(v.cap), "cft-tx cft-tx-s", "middle");
            g.text(8, 150, "Wipe-out line: a fall of " + pct(100 / v.lev, 1) + " with " + v.lev + "x leverage (before costs).", "cft-tx cft-tx-s");
            g.text(8, 168, "Theory only. This book does not teach leveraged trading.", "cft-tx cft-tx-s");
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. The price moves a little more against you each step.";
            var move = v.mv * (Math.min(s, total) / total);
            return "Price move so far: " + pct(move, 1) + ". With leverage your own money changes by " + pct(move * v.lev, 1) + ".";
          },
        };
      },
    });
  };

  // ---------------------------------------------------------------
  // Capital allocation
  // ---------------------------------------------------------------
  D["capital-allocation-planner"] = function (p, host) {
    if (p.path !== undefined) return capPath(p, host);
    return capStack(p, host);
  };

  function capPath(p, host) {
    lab(host, {
      title: "Withdrawal threshold check (practice numbers)",
      hint: "What to try: press Play. The line shows the account, the dashed line is the highest value so far and the orange line is the threshold. Change the last number to 61000 and see if the rule now allows a withdrawal.",
      aria: "Line chart of the account value with the high-water mark and the withdrawal threshold.",
      interval: 900,
      fields: [
        { key: "path", label: "Account value after each step (Rs, comma separated)", value: p.path, text: true },
        { key: "th", label: "Withdrawal threshold (Rs)", value: P(p, "threshold", 60000) },
      ],
      compute: function (v) {
        var pts = parseList(v.path);
        if (pts.length < 1) return { warn: "Enter numbers separated by commas." };
        var peak = Math.max.apply(null, pts), last = pts[pts.length - 1];
        var hwm = [], run = -Infinity, newHigh = [], i;
        for (i = 0; i < pts.length; i++) { newHigh.push(pts[i] > run); run = Math.max(run, pts[i]); hwm.push(run); }
        var okLast = newHigh[pts.length - 1] && last >= v.th;
        return {
          total: pts.length,
          rows: [
            ["Highest value so far (high-water mark)", inr(peak)],
            ["Latest value", inr(last)],
            ["Below the high-water mark by", inr(peak - last)],
            ["Threshold reached?", peak >= v.th ? "Yes, at some point" : "No. Short by " + inr(v.th - peak), true],
            ["Does the rule allow a withdrawal at the last step? (new high and at or above the threshold)", okLast ? "Yes" : "No"],
          ],
          notes: ["A common rule is to take money out only when the account is at a new high, never while it is in a drawdown."],
          summary: "The account is at " + inr(last) + ". The high-water mark is " + inr(peak) + ". At the last step the rule " + (okLast ? "allows" : "does not allow") + " a withdrawal (it needs a new high and at least " + inr(v.th) + ").",
          draw: function (g, s) {
            lineChart(g, { series: [{ pts: hwm, cls: "cft-pl-d", noDot: true }, { pts: pts, cls: "cft-pl" }], hlines: [{ v: v.th, label: "Limit", cls: "cft-ln-hi" }], mr: 40, reveal: s, xlabel: "Step (values in Rs)" });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step to add one point at a time.";
            var k = Math.min(s, pts.length) - 1;
            var allow = newHigh[k] && pts[k] >= v.th;
            return "Step " + (k + 1) + ": " + inr(pts[k]) + ". " + (newHigh[k] ? "A new high." : "Not a new high (peak " + inr(hwm[k]) + ").") + (pts[k] >= v.th ? " At or above the threshold." : " Below the threshold.") + " Withdrawal allowed: " + (allow ? "yes." : "no.");
          },
        };
      },
    });
  }

  function capStack(p, host) {
    lab(host, {
      title: "Where does your money sit? (practice numbers)",
      hint: "What to try: press Play to let the trading account fall step by step. Watch when it passes the line where you cut your size, and the line where you stop and review. Then change the cut and stop percentages.",
      aria: "Bar of total savings split into money never traded and trading capital, and a second bar showing the trading account falling past the cut-size line and the stop line.",
      h: 175,
      interval: 650,
      fields: [
        { key: "sav", label: "Total savings (Rs)", value: P(p, "savings", 400000) },
        { key: "tc", label: "Trading capital (Rs)", value: P(p, "tradingCapital", 50000) },
        { key: "cut", label: "Cut size after losing (%)", value: P(p, "cutPct", 10) },
        { key: "stop", label: "Stop trading after losing (%)", value: P(p, "stopPct", 20) },
        { key: "risk", label: "Risk per trade (%)", value: P(p, "riskPct", 1), step: 0.1 },
      ],
      compute: function (v) {
        if (v.tc > v.sav) return { warn: "Trading capital cannot be more than your savings." };
        if (v.sav <= 0 || v.tc <= 0) return { warn: "Enter savings and trading capital above zero." };
        var untouched = v.sav - v.tc;
        var cutVal = v.tc * (1 - v.cut / 100), stopVal = v.tc * (1 - v.stop / 100);
        var total = 12, floor = Math.max(v.stop, v.cut) + 5;
        function valueAt(s) { return v.tc * (1 - ((s / total) * floor) / 100); }
        function stateAt(val) { return val <= stopVal ? "stop" : val <= cutVal ? "cut" : "full"; }
        return {
          total: total,
          rows: [
            ["Money you never trade with", inr(untouched)],
            ["Trading capital as % of savings", pct((v.tc * 100) / v.sav)],
            ["Account value where you cut your size", inr(cutVal)],
            ["Account value where you stop and review", inr(stopVal)],
            ["Rs at risk on one trade", inr((v.tc * v.risk) / 100), true],
          ],
          bars: [
            { label: "Untouched", value: untouched, text: inr(untouched) },
            { label: "Trading", value: v.tc, text: inr(v.tc), hi: true },
          ],
          summary: "Only " + pct((v.tc * 100) / v.sav) + " of your savings is trading money. You cut your size if the account falls to " + inr(cutVal) + " and stop to review at " + inr(stopVal) + ". At the start, one trade risks " + inr((v.tc * v.risk) / 100) + ".",
          draw: function (g, s) {
            g.clear();
            var x0 = 10, wid = 320, uw = (untouched / v.sav) * wid;
            g.text(x0, 12, "All your savings: " + inr(v.sav), "cft-tx cft-tx-s");
            g.rect(x0, 18, uw, 24, "cft-rc-grey");
            g.rect(x0 + uw, 18, wid - uw, 24, "cft-rc");
            g.text(x0, 56, "Never traded " + inr(untouched), "cft-tx cft-tx-s");
            g.text(x0 + wid, 56, "Trading " + inr(v.tc), "cft-tx cft-tx-s cft-tx-b", "end");
            var cur = s === 0 ? v.tc : valueAt(s);
            var st = stateAt(cur);
            g.text(x0, 82, "Trading account now: " + inr(Math.max(0, cur)), "cft-tx cft-tx-s cft-tx-b");
            g.rect(x0, 88, wid, 24, "cft-rc-grey");
            g.rect(x0, 88, Math.max(0, (cur / v.tc) * wid), 24, st === "full" ? "cft-rc-up" : st === "cut" ? "cft-dot" : "cft-rc-down");
            var cx = x0 + (cutVal / v.tc) * wid, sx2 = x0 + (stopVal / v.tc) * wid;
            g.line(cx, 84, cx, 116, "cft-ln-hi");
            g.line(sx2, 84, sx2, 116, "cft-ln-hi");
            g.text(cx, 130, "Cut size", "cft-tx cft-tx-s", "middle");
            g.text(sx2, 144, "Stop and review", "cft-tx cft-tx-s", "middle");
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. The trading account falls a little each step.";
            var cur = valueAt(Math.min(s, total)), st = stateAt(cur);
            return st === "full" ? "Account " + inr(cur) + ". Normal size. You follow your plan."
              : st === "cut" ? "Account " + inr(cur) + ". You have passed the cut-size line. Your written plan says to trade smaller now."
              : "Account " + inr(cur) + ". You have passed the stop line. Your written plan says to stop and review.";
          },
        };
      },
    });
  }

  // ---------------------------------------------------------------
  // Risk limits
  // ---------------------------------------------------------------
  D["risk-limit-simulator"] = function (p, host) {
    var state = { day: 0, week: 0, month: 0, trades: 0 };
    var log = [];
    var capDef = P(p, "capital", 50000);
    var dailyDef = p.dailyLossLimit !== undefined && capDef > 0 ? (num(p.dailyLossLimit, 0) * 100) / capDef : P(p, "dailyPct", 2);
    var lossDef = p.lossPerTrade !== undefined ? P(p, "lossPerTrade", 0) : p.tradeLoss !== undefined ? P(p, "tradeLoss", 0) : (capDef * P(p, "perTradePct", 1)) / 100;
    var b = L.box(host, "Risk limit ladder (practice numbers)", "What to try: press Play, or press 'Take a losing trade'. Each loss fills the ladder. When a limit is reached, the stop-trading state appears and no more trades are allowed. Press 'New day' to start the next day.");
    var form = fieldSet(b.body, [
      { key: "cap", label: "Capital (Rs)", value: capDef },
      { key: "pt", label: "Per trade (%)", value: P(p, "perTradePct", 1), step: 0.1 },
      { key: "d", label: "Per day (%)", value: dailyDef, step: 0.1 },
      { key: "w", label: "Per week (%)", value: P(p, "weeklyPct", 4), step: 0.1 },
      { key: "m", label: "Per month (%)", value: P(p, "monthlyPct", 8), step: 0.1 },
      { key: "mt", label: "Max trades per day", value: P(p, "maxTradesPerDay", 2) },
      { key: "loss", label: "Loss on each losing trade (Rs)", value: lossDef },
    ], function () { paint(); });
    var g = L.svg(b.body, 340, 190);
    g.svg.setAttribute("aria-label", "Ladder of three bars for the day, week and month loss limits. Each bar fills as losses add up. A red banner appears when trading must stop.");
    var animBox = el("div");
    b.body.appendChild(animBox);
    var btns = el("div", "cft-btn-row");
    b.body.appendChild(btns);
    var out = el("div", "cft-out");
    b.body.appendChild(out);
    var res = resultLine(b.body);

    function limits(v) { return { d: (v.cap * v.d) / 100, w: (v.cap * v.w) / 100, m: (v.cap * v.m) / 100 }; }
    function status(v) {
      var lim = limits(v);
      if (state.month >= lim.m) return { stop: true, text: "STOP: monthly limit reached. No more trades this month." };
      if (state.week >= lim.w) return { stop: true, text: "STOP: weekly limit reached. No more trades this week." };
      if (state.day >= lim.d) return { stop: true, text: "STOP: daily limit reached. No more trades today." };
      if (state.trades >= v.mt) return { stop: true, text: "STOP: you used all your trades for today." };
      return { stop: false, text: "You can keep trading by your rules." };
    }
    function paint() {
      var v = form.vals(), lim = limits(v), st = status(v);
      g.clear();
      var items = [["Today", state.day, lim.d], ["This week", state.week, lim.w], ["This month", state.month, lim.m]];
      items.forEach(function (it, i) {
        var y = 14 + i * 38, frac = it[2] > 0 ? Math.min(it[1] / it[2], 1) : 0;
        g.text(8, y + 12, it[0], "cft-tx cft-tx-s");
        g.rect(70, y, 200, 18, "cft-rc-grey");
        g.rect(70, y, 200 * frac, 18, frac >= 1 ? "cft-rc-down" : frac >= 0.7 ? "cft-dot" : "cft-rc-up");
        g.line(270, y - 3, 270, y + 21, "cft-ln-hi");
        g.text(274, y + 8, inr(it[1]), "cft-tx cft-tx-s cft-tx-b");
        g.text(274, y + 19, "of " + inr(it[2]), "cft-tx cft-tx-s");
      });
      for (var k = 0; k < Math.min(v.mt, 10); k++) {
        g.rect(70 + k * 22, 128, 18, 14, k < state.trades ? "cft-dot" : "cft-rc-grey");
      }
      g.text(8, 140, "Trades", "cft-tx cft-tx-s");
      if (st.stop) {
        g.rect(8, 152, 324, 30, "cft-rc-down");
        g.text(170, 172, st.text, "cft-tx cft-tx-b", "middle");
      } else {
        g.text(8, 172, st.text, "cft-tx cft-tx-s");
      }
      out.textContent = "";
      var rows = [
        ["Most you accept to lose on one trade", inr((v.cap * v.pt) / 100)],
        ["Today: lost / limit", inr(state.day) + " / " + inr(lim.d)],
        ["This week: lost / limit", inr(state.week) + " / " + inr(lim.w)],
        ["This month: lost / limit", inr(state.month) + " / " + inr(lim.m)],
        ["Trades today / max", state.trades + " / " + v.mt],
        ["Status", st.text, true],
      ];
      L.table(out, rows);
      if (log.length) {
        var ul = el("ul", "cft-feel");
        log.slice(-6).forEach(function (e) {
          ul.appendChild(el("li", null, e));
        });
        out.appendChild(el("p", "cft-note", "Latest events:"));
        out.appendChild(ul);
      }
      res.textContent = st.stop
        ? st.text + " Today you have lost " + inr(state.day) + " of your " + inr(lim.d) + " daily limit."
        : "Today you have lost " + inr(state.day) + " of your " + inr(lim.d) + " daily limit, with " + Math.max(0, v.mt - state.trades) + " trade(s) left. " + st.text;
    }
    function takeLoss() {
      var v = form.vals();
      if (status(v).stop) { log.push("Trade refused. " + status(v).text); paint(); return false; }
      var loss = Math.max(0, v.loss);
      state.day += loss; state.week += loss; state.month += loss; state.trades++;
      log.push("Trade " + state.trades + " today: lost " + inr(loss) + ". Today total " + inr(state.day) + ".");
      paint();
      return !status(v).stop;
    }
    function resetAll() { state.day = state.week = state.month = state.trades = 0; log = []; paint(); }
    var an = L.anim(animBox, {
      interval: 900,
      step: function () { return takeLoss(); },
      reset: function () { resetAll(); },
    });
    L.button(btns, "Take a losing trade", function () { an.pause(); takeLoss(); });
    L.button(btns, "New day", function () { an.pause(); state.day = 0; state.trades = 0; log.push("A new day starts. Today's loss is back to Rs 0."); paint(); });
    L.button(btns, "Reset all", function () { an.pause(); an.setIndex(0); resetAll(); });
    paint();
  };

  // ---------------------------------------------------------------
  // Order book
  // ---------------------------------------------------------------
  function bookRows(g, o) {
    // o: {asks:[{p,q,taken}], bids:[{p,q,taken}], spreadText, hi, topLabel, botLabel}
    g.clear();
    var rowH = 20, y = 16, k;
    var maxQ = 1;
    o.asks.concat(o.bids).forEach(function (l) { maxQ = Math.max(maxQ, l.q); });
    var sx = L.scale(0, maxQ, 0, 150);
    g.text(8, 11, o.topLabel, "cft-tx cft-tx-s");
    function row(l, i, cls, takenCls) {
      var yy = y + i * rowH;
      var hl = o.hi && Math.abs(o.hi - l.p) < 1e-6;
      g.text(70, yy + 14, plainNum(r2(l.p)), hl ? "cft-tx cft-tx-b" : "cft-tx", "end");
      var bw = Math.max(2, sx(l.q));
      g.rect(78, yy + 2, bw, rowH - 6, cls);
      if (l.taken) g.rect(78, yy + 2, Math.max(2, (l.taken / l.q) * bw), rowH - 6, takenCls || "cft-dot");
      g.text(78 + bw + 5, yy + 14, l.note || String(l.q), hl ? "cft-tx cft-tx-s cft-tx-b" : "cft-tx cft-tx-s");
      if (hl) g.rect(76, yy + 1, 262, rowH - 4, "cft-hl-box", { fill: "none", stroke: "currentColor", "stroke-width": 1.5, rx: 3 });
    }
    for (k = 0; k < o.asks.length; k++) row(o.asks[k], k, "cft-rc-down");
    var sy = y + o.asks.length * rowH;
    g.rect(8, sy + 2, 324, 24, "cft-rc-band");
    g.text(170, sy + 18, o.spreadText, "cft-tx cft-tx-b", "middle");
    for (k = 0; k < o.bids.length; k++) {
      var yy2 = sy + 28 + k * rowH;
      var l2 = o.bids[k];
      var hl2 = o.hi && Math.abs(o.hi - l2.p) < 1e-6;
      g.text(70, yy2 + 14, plainNum(r2(l2.p)), hl2 ? "cft-tx cft-tx-b" : "cft-tx", "end");
      var bw2 = Math.max(2, sx(l2.q));
      g.rect(78, yy2 + 2, bw2, rowH - 6, "cft-rc-up");
      if (l2.taken) g.rect(78, yy2 + 2, Math.max(2, (l2.taken / l2.q) * bw2), rowH - 6, "cft-dot");
      g.text(78 + bw2 + 5, yy2 + 14, l2.note || String(l2.q), hl2 ? "cft-tx cft-tx-s cft-tx-b" : "cft-tx cft-tx-s");
      if (hl2) g.rect(76, yy2 + 1, 262, rowH - 4, "cft-hl-box", { fill: "none", stroke: "currentColor", "stroke-width": 1.5, rx: 3 });
    }
    g.text(8, sy + 28 + o.bids.length * rowH + 10, o.botLabel, "cft-tx cft-tx-s");
  }

  D["order-book-sim"] = function (p, host) {
    var askText = p.ask !== undefined ? p.ask : p.asks;
    if (askText !== undefined) return bookWalk(p, askText, host);
    return bookLive(p, host);
  };

  // A market order walks through the price levels, one level at a time.
  function bookWalk(p, askText, host) {
    var levels = String(askText).split(",").map(function (s) {
      var a = s.trim().split("x");
      return { price: num(a[0], 0), qty: num(a[1], 0) };
    }).filter(function (l) { return l.price > 0 && l.qty > 0; });
    var side = "buy", qtyDef = P(p, "market_buy_qty", 250);
    if (p.order !== undefined) {
      var m = String(p.order).match(/(buy|sell)\s+(\d+)/i);
      if (m) { side = m[1].toLowerCase(); qtyDef = num(m[2], qtyDef); }
    }
    var step = levels.length > 1 ? Math.abs(levels[1].price - levels[0].price) : 0.5;
    if (!(step > 0)) step = 0.5;
    var bidsMade = [120, 150, 200].map(function (q, i) { return { price: r2(levels[0].price - step * (i + 1)), qty: q }; });
    var walkSide = side === "sell" ? bidsMade : levels;
    var shown = 0, fills = [];
    var b = L.box(host, "A market " + side + " walks through the " + (side === "sell" ? "buyers" : "sellers") + " (practice numbers)",
      "What to try: press Play or Step. The order takes the cheapest " + (side === "sell" ? "buyers" : "sellers") + " first. When a price level is used up, the order moves to the next price. Then change the number of shares.");
    var form = fieldSet(b.body, [{ key: "q", label: "Shares you want to " + side + " at market", value: qtyDef }], function () { an.pause(); an.setIndex(0); recompute(); });
    var g = L.svg(b.body, 340, 280);
    g.svg.setAttribute("aria-label", "Order book ladder. A market order takes shares from each price level in turn, starting with the best price.");
    var status = el("div", "cft-status");
    b.body.appendChild(status);
    var animBox = el("div");
    b.body.appendChild(animBox);
    var out = el("div", "cft-out");
    b.body.appendChild(out);
    var res = resultLine(b.body);

    function recompute() {
      var v = form.vals(), left = v.q, cost = 0, rows = [], last = 0;
      fills = [];
      out.textContent = "";
      walkSide.forEach(function (l) {
        if (left <= 0) return;
        var take = Math.min(left, l.qty);
        fills.push({ price: l.price, take: take, qty: l.qty });
        rows.push(["" + (side === "sell" ? "Sell " : "Buy ") + take + " at " + inr(l.price) + " (" + l.qty + " were on offer)", inr(take * l.price)]);
        cost += take * l.price; left -= take; last = l.price;
      });
      var got = v.q - left;
      if (got <= 0) {
        out.appendChild(el("div", "cft-feedback cft-bad", "Enter a quantity above zero."));
        res.textContent = ""; g.clear(); status.textContent = "";
        return;
      }
      var avg = cost / got, best = walkSide[0].price;
      rows.push(["Shares " + (side === "sell" ? "sold" : "bought") + " / total " + (side === "sell" ? "received" : "paid"), got + " / " + inr(cost), true]);
      rows.push(["Average price per share", inr(avg, 2)]);
      rows.push(["Last traded price", inr(last)]);
      rows.push(["Best price when you started", inr(best)]);
      rows.push(["Slippage against the best price", inr(Math.abs(avg - best) * got, 2)]);
      L.table(out, rows);
      out.appendChild(el("p", "cft-note", left > 0 ? left + " shares could not be filled: no more " + (side === "sell" ? "buyers" : "sellers") + " in this list." : "Your big order used up the best prices first, so the price you get gets worse."));
      shown = fills.length;
      res.textContent = "Your " + got + "-share market " + side + " " + (side === "sell" ? "received " : "cost ") + inr(cost) + ", an average of " + inr(avg, 2) + " per share. The best price was " + inr(best) + ", so the order cost " + inr(Math.abs(avg - best) * got, 2) + " more than one price level would suggest.";
      paint();
    }
    function paint() {
      if (!fills.length) return;
      var asks = [], bids = [], paid = 0, got = 0, lastP = null, i;
      var src = side === "sell" ? levels.slice() : walkSide;
      var dst = side === "sell" ? walkSide : bidsMade;
      // asks are drawn top to bottom from the highest price to the lowest
      var A = (side === "sell" ? levels : walkSide).slice().reverse();
      var B = (side === "sell" ? walkSide : bidsMade);
      void src; void dst;
      A.forEach(function (l) {
        var f = null;
        fills.forEach(function (x, idx) { if (idx < shown && x.price === l.price && side !== "sell") f = x; });
        asks.push({ p: l.price, q: l.qty, taken: f ? f.take : 0, note: f ? "took " + f.take + " of " + l.qty : String(l.qty) });
      });
      B.forEach(function (l) {
        var f = null;
        fills.forEach(function (x, idx) { if (idx < shown && x.price === l.price && side === "sell") f = x; });
        bids.push({ p: l.price, q: l.qty, taken: f ? f.take : 0, note: f ? "took " + f.take + " of " + l.qty : String(l.qty) });
      });
      for (i = 0; i < shown; i++) { paid += fills[i].take * fills[i].price; got += fills[i].take; lastP = fills[i].price; }
      bookRows(g, {
        asks: asks, bids: bids,
        spreadText: "Gap: " + inr(r2(levels[0].price - bidsMade[0].price), 2),
        topLabel: "Sellers (ask), lowest price at the bottom",
        botLabel: "Buyers (bid). Made-up numbers. Orange = taken by your order.",
        hi: lastP,
      });
      status.textContent = shown === 0 ? "Press Play or Step. Your order is about to arrive." : "So far: " + got + " shares for " + inr(paid) + (got ? " (average " + inr(paid / got, 2) + ")" : "") + ". Last traded price " + inr(lastP) + ".";
    }
    var an = L.anim(animBox, {
      interval: 900,
      step: function (i) {
        if (!fills.length) return false;
        if (i >= fills.length) { an.setIndex(0); i = 0; }
        shown = i + 1;
        paint();
        return shown < fills.length;
      },
      reset: function () { shown = 0; paint(); },
    });
    recompute();
  }

  // Live book: orders arrive and the gap (spread) opens and closes.
  function bookLive(p, host) {
    var b = L.box(host, "The gap between buyers and sellers (practice numbers)",
      "What to try: press Play and watch new orders arrive. The gap between the best buyer and the best seller opens and closes. Then send a practice market order and see the price you really get. The data is made up.");
    var form = fieldSet(b.body, [
      { key: "bid", label: "Best buyer price (bid, Rs)", value: P(p, "bestBid", 249.5), step: 0.05 },
      { key: "ask", label: "Best seller price (ask, Rs)", value: P(p, "bestAsk", 250.5), step: 0.05 },
      { key: "q", label: "Shares", value: P(p, "qty", 40) },
    ], function () { an.pause(); an.setIndex(0); init(); });
    var g = L.svg(b.body, 340, 280);
    g.svg.setAttribute("aria-label", "Order book ladder with sellers above and buyers below, and the gap between the best prices highlighted. New orders arrive one by one.");
    var status = el("div", "cft-status");
    b.body.appendChild(status);
    var animBox = el("div");
    b.body.appendChild(animBox);
    var btns = el("div", "cft-btn-row");
    b.body.appendChild(btns);
    var out = el("div", "cft-out");
    b.body.appendChild(out);
    var res = resultLine(b.body);

    var bids = [], asks = [], tick = 0.5, rnd = null, note = "", spMin = 0, spMax = 0, warned = false, touched = 0;

    function lot() { return Math.round((30 + rnd() * 220) / 10) * 10; }
    function topUp() {
      while (bids.length < 5) bids.push({ p: r2((bids.length ? bids[bids.length - 1].p : asks[0].p - tick) - tick), q: lot() });
      while (asks.length < 5) asks.push({ p: r2((asks.length ? asks[asks.length - 1].p : bids[0].p + tick) + tick), q: lot() });
    }
    function addLimit(arr, price, q, desc) {
      price = r2(price);
      for (var i = 0; i < arr.length; i++) {
        if (Math.abs(arr[i].p - price) < 1e-6) { arr[i].q += q; return; }
      }
      arr.push({ p: price, q: q });
      arr.sort(function (a, c) { return desc ? c.p - a.p : a.p - c.p; });
    }
    function consume(arr, qty) {
      var cost = 0, got = 0;
      while (qty > 0) {
        if (!arr.length) topUp();
        var lvl = arr[0], take = Math.min(qty, lvl.q);
        lvl.q -= take; qty -= take; cost += take * lvl.p; got += take;
        touched = lvl.p;
        if (lvl.q <= 0) arr.shift();
        topUp();
      }
      return { got: got, cost: cost, avg: got ? cost / got : 0 };
    }
    function init() {
      var v = form.vals();
      out.textContent = "";
      if (v.ask < v.bid) {
        out.appendChild(el("div", "cft-feedback cft-bad", "The ask must be at or above the bid."));
        res.textContent = ""; g.clear(); status.textContent = ""; warned = true;
        return;
      }
      warned = false;
      var spread = v.ask - v.bid;
      tick = spread >= 1 ? r2(spread / 2) : spread > 0 ? r2(spread) : 0.05;
      if (!(tick > 0)) tick = 0.05;
      rnd = L.rng(11);
      bids = []; asks = [];
      for (var k = 0; k < 5; k++) { bids.push({ p: r2(v.bid - k * tick), q: lot() }); asks.push({ p: r2(v.ask + k * tick), q: lot() }); }
      spMin = spMax = spread;
      touched = 0;
      note = "Press Play or Step to let orders arrive.";
      // the original numbers, unchanged
      L.table(out, [
        ["Spread (ask - bid)", inr(spread, 2)],
        ["Spread as % of the middle price", pct((spread * 100) / ((v.ask + v.bid) / 2), 2)],
        ["Buy at ask, sell right back at bid", inr(v.ask * v.q, 2) + " paid, " + inr(v.bid * v.q, 2) + " received"],
        ["Lost to the spread on a round trip", inr(spread * v.q, 2), true],
      ]);
      out.appendChild(el("p", "cft-note", "If the price does not move at all, you still lose the spread. Brokerage and taxes come on top."));
      paint();
    }
    function paint() {
      if (warned) return;
      var v = form.vals();
      var sp = asks[0].p - bids[0].p;
      spMin = Math.min(spMin, sp); spMax = Math.max(spMax, sp);
      bookRows(g, {
        asks: asks.slice(0, 5).slice().reverse(),
        bids: bids.slice(0, 5),
        spreadText: "Gap (spread): " + inr(r2(sp), 2),
        topLabel: "Sellers (ask): the best seller is at the bottom of this group",
        botLabel: "Buyers (bid): the best buyer is at the top of this group",
        hi: touched,
      });
      status.textContent = note;
      res.textContent = "Best buyer " + inr(bids[0].p, 2) + ", best seller " + inr(asks[0].p, 2) + ", gap " + inr(r2(sp), 2) + " (smallest seen " + inr(r2(spMin), 2) + ", widest " + inr(r2(spMax), 2) + "). Buying " + v.q + " shares at the ask and selling straight back at the bid loses " + inr(r2(sp * v.q), 2) + ".";
    }
    function arrive() {
      var r = rnd(), sz = Math.round((20 + rnd() * 100) / 10) * 10, price, j, rr;
      touched = 0;
      if (r < 0.3) {
        j = Math.floor(rnd() * 4) - 2;
        price = bids[0].p + j * tick;
        if (price >= asks[0].p - 1e-9) price = bids[0].p;
        addLimit(bids, price, sz, true);
        touched = r2(price);
        note = "A buyer queues up to buy " + sz + " shares at " + inr(r2(price), 2) + "." + (price > bids[0].p - 1e-9 && j > 0 ? " The best buyer price rose, so the gap got smaller." : "");
      } else if (r < 0.6) {
        j = Math.floor(rnd() * 4) - 2;
        price = asks[0].p - j * tick;
        if (price <= bids[0].p + 1e-9) price = asks[0].p;
        addLimit(asks, price, sz, false);
        touched = r2(price);
        note = "A seller queues up to sell " + sz + " shares at " + inr(r2(price), 2) + "." + (j > 0 ? " The best seller price fell, so the gap got smaller." : "");
      } else if (r < 0.8) {
        rr = consume(asks, sz);
        note = "A market buy of " + sz + " shares takes the cheapest sellers. Average price " + inr(rr.avg, 2) + ". The best seller price may move up.";
      } else {
        rr = consume(bids, sz);
        note = "A market sell of " + sz + " shares takes the highest buyers. Average price " + inr(rr.avg, 2) + ". The best buyer price may move down.";
      }
      topUp();
    }
    var an = L.anim(animBox, {
      interval: 1000,
      step: function () { if (warned) return false; arrive(); paint(); },
      reset: function () { init(); },
    });
    L.button(btns, "Practice market buy", function () {
      if (warned) return;
      an.pause();
      var v = form.vals(), bestA = asks[0].p, rr = consume(asks, Math.max(1, Math.floor(v.q)));
      topUp();
      note = "Your practice market buy of " + rr.got + " shares cost " + inr(rr.cost, 2) + ", an average of " + inr(rr.avg, 2) + ". The best seller price was " + inr(bestA, 2) + ", so you paid " + inr(rr.cost - bestA * rr.got, 2) + " extra.";
      paint();
    });
    L.button(btns, "Practice market sell", function () {
      if (warned) return;
      an.pause();
      var v = form.vals(), bestB = bids[0].p, rr = consume(bids, Math.max(1, Math.floor(v.q)));
      topUp();
      note = "Your practice market sell of " + rr.got + " shares brought " + inr(rr.cost, 2) + ", an average of " + inr(rr.avg, 2) + ". The best buyer price was " + inr(bestB, 2) + ", so you received " + inr(bestB * rr.got - rr.cost, 2) + " less.";
      paint();
    });
    init();
  }

  // ---------------------------------------------------------------
  // Order flow
  // ---------------------------------------------------------------
  D["order-flow-sim"] = function (p, host) {
    var side = L.S(p, "side", "buy") === "sell" ? "sell" : "buy";
    var qty = P(p, "quantity", 20), price = P(p, "price", 250);
    var value = qty * price;
    var text = {
      trader: "You decide and enter the order in your trading app.",
      broker: side === "buy"
        ? "Your broker checks that you have the money (" + inr(value) + " here) and sends the order to the exchange."
        : "Your broker checks that you hold the shares and sends the order to the exchange.",
      exchange: "The exchange matches your order with " + (side === "buy" ? "a seller" : "a buyer") + " at an agreed price.",
      clearing: "The clearing house makes sure both sides do their part: money from the buyer, shares from the seller.",
      depository: side === "buy" ? "The depository records the shares in your demat account." : "The depository moves the shares out of your demat account to the buyer.",
    };
    var titles = { trader: "You", broker: "Broker", exchange: "Exchange", clearing: "Clearing", depository: "Depository", matching: "Matching" };
    var steps = String(p.steps || "trader, broker, exchange, clearing, depository").split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s; });
    if (!steps.length) steps = ["trader", "broker", "exchange", "clearing", "depository"];
    var b = L.box(host, "Follow one order: " + side + " " + qty + " shares at " + inr(price) + " (practice)",
      "What to try: press Play or Step and watch the order move from step to step. Then choose 'What if' to see where an order can stop.");
    var form = fieldSet(b.body, [
      { key: "what", label: "What if...", value: "normal", options: [["normal", "Everything goes smoothly"], ["reject", "Broker says: not enough money"], ["wait", "No one wants to trade at your price"]] },
    ], function () { an.pause(); an.setIndex(0); pos = 0; paint(); });
    var n = steps.length, bw = 58, gapX = n > 1 ? Math.max(6, (350 - 12 - n * bw) / (n - 1)) : 0;
    var g = L.svg(b.body, 350, 120);
    g.svg.setAttribute("aria-label", "Boxes for each step an order passes through, with a dot that moves from you to the broker, the exchange, the clearing house and the depository.");
    var xs = [], i;
    for (i = 0; i < n; i++) xs.push(6 + i * (bw + gapX));
    var boxes = [];
    for (i = 0; i < n; i++) {
      if (i > 0) g.line(xs[i - 1] + bw, 52, xs[i], 52, "cft-ln");
      boxes.push(g.rect(xs[i], 30, bw, 44, "cft-rc-grey", { rx: 6 }));
      var nm = titles[steps[i]] || (steps[i].charAt(0).toUpperCase() + steps[i].slice(1)).slice(0, 10);
      g.text(xs[i] + bw / 2, 56, nm, "cft-tx cft-tx-s cft-tx-b", "middle");
      g.text(xs[i] + bw / 2, 90, String(i + 1), "cft-tx cft-tx-s", "middle");
    }
    g.text(6, 14, "Order: " + side + " " + qty + " shares at " + inr(price) + " = " + inr(value), "cft-tx cft-tx-s");
    var token = g.circle(0, 52, 9, "cft-dot cft-token");
    var stateTxt = g.text(6, 112, "", "cft-tx cft-tx-s cft-tx-b");
    var list = el("div", "cft-out");
    b.body.appendChild(list);
    var animBox = el("div");
    b.body.appendChild(animBox);
    var res = resultLine(b.body);
    var pos = 0;

    function limit() {
      var what = form.vals().what, idx = steps.length - 1;
      if (what === "reject") { idx = steps.indexOf("broker"); }
      else if (what === "wait") { idx = steps.indexOf("exchange"); }
      return idx < 0 ? steps.length - 1 : idx;
    }
    function stateFor(k) {
      var what = form.vals().what, s = steps[k];
      if (what === "reject" && s === "broker" && k === limit()) return "Rejected by your broker";
      if (what === "wait" && s === "exchange" && k === limit()) return "Waiting in the order book";
      return ["Order typed", "Accepted by broker", "Sent to the exchange", "Trade matched", "Settling", "Shares recorded"][Math.min(k, 5)];
    }
    function paint() {
      var lim = limit();
      var k = Math.min(pos, lim);
      token.style.transform = "translate(" + (xs[k] + bw / 2) + "px, 0px)";
      boxes.forEach(function (bx, j) {
        bx.setAttribute("class", j === k ? "cft-dot" : j < k ? "cft-rc-up" : "cft-rc-grey");
      });
      stateTxt.textContent = "Order state: " + stateFor(k);
      list.textContent = "";
      steps.forEach(function (s, j) {
        var line = el("div", "cft-step" + (j === k ? " cft-step-on" : j < k ? " cft-step-done" : ""));
        line.appendChild(el("strong", null, (j + 1) + ". " + s.charAt(0).toUpperCase() + s.slice(1) + ": "));
        var t = "";
        if (j <= k) {
          t = text[s] || "";
          var what = form.vals().what;
          if (j === lim && what === "reject" && s === "broker") t = "Your broker checks the money and finds you do not have enough. The order stops here. Nothing is sent to the exchange.";
          if (j === lim && what === "wait" && s === "exchange") t = "The exchange finds no " + (side === "buy" ? "seller" : "buyer") + " at your price. The order waits in the order book. It may fill later, or never.";
        }
        line.appendChild(document.createTextNode(t));
        list.appendChild(line);
      });
      res.textContent = k === lim
        ? (form.vals().what === "normal" ? "The order has passed every step. Each step has its own job, and your broker is only one of them." : "The order stopped at step " + (k + 1) + " (" + steps[k] + "). " + (form.vals().what === "reject" ? "No trade happened." : "No trade has happened yet."))
        : "The order is at step " + (k + 1) + " of " + steps.length + " (" + steps[k] + ").";
    }
    var an = L.anim(animBox, {
      interval: 1100,
      step: function (idx) {
        var lim = limit();
        if (idx + 1 > lim) { paint(); return false; }
        pos = idx + 1;
        paint();
        return pos < lim;
      },
      reset: function () { pos = 0; paint(); },
    });
    paint();
  };

  // ---------------------------------------------------------------
  // Costs
  // ---------------------------------------------------------------
  D["lab-costs"] = function (p, host) {
    lab(host, {
      title: "Trade cost walk-through (DUMMY rates, not your broker's)",
      hint: "What to try: press Play and watch the costs pile up leg by leg. Then lower the trade value. The fixed fees stay the same in rupees, so a small trade pays a bigger share. All rates here are DUMMY rates.",
      aria: "A bar that grows as each cost is added, and a curve showing the cost as a percentage of the trade value, which is higher for small trades.",
      h: 235,
      interval: 800,
      fields: [
        { key: "tv", label: "Trade value each way (Rs)", value: P(p, "tradeValue", 5000) },
        { key: "rate", label: "DUMMY percentage per leg (%)", value: 0.1, step: 0.01 },
        { key: "fixed", label: "DUMMY fixed fee per order (Rs)", value: 20 },
        { key: "dp", label: "DUMMY sell-side depository fee (Rs)", value: 50 },
      ],
      compute: function (v) {
        if (v.tv <= 0) return { warn: "Enter a trade value above zero." };
        var prop = (v.tv * v.rate) / 100;
        var buy = prop + v.fixed, sell = prop + v.fixed + v.dp, total = buy + sell;
        var segs = [
          ["Buy: percentage (dummy rate)", prop, "cft-rc"],
          ["Buy: fixed fee (dummy)", v.fixed, "cft-dot"],
          ["Sell: percentage (dummy rate)", prop, "cft-rc"],
          ["Sell: fixed fee (dummy)", v.fixed, "cft-dot"],
          ["Sell: depository fee (dummy)", v.dp, "cft-rc-down"],
        ];
        function costPct(tv) { return 2 * v.rate + ((2 * v.fixed + v.dp) / tv) * 100; }
        return {
          total: segs.length + 1,
          rows: [
            ["Buy leg: percentage + fixed", inr(prop, 2) + " + " + inr(v.fixed, 2) + " = " + inr(buy, 2)],
            ["Sell leg: percentage + fixed + depository fee", inr(prop, 2) + " + " + inr(v.fixed, 2) + " + " + inr(v.dp, 2) + " = " + inr(sell, 2)],
            ["Total cost of buying and selling", inr(total, 2), true],
            ["As % of the trade value", pct((total * 100) / v.tv, 2)],
            ["The price must move this much just to break even", pct((total * 100) / v.tv, 2)],
          ],
          notes: ["Change the trade value: the fixed fees stay the same in rupees, so small trades pay a bigger share. Look up your broker's real charges before relying on any figure."],
          summary: "Buying and selling " + inr(v.tv) + " costs " + inr(total, 2) + " in total at these DUMMY rates. That is " + pct((total * 100) / v.tv, 2) + " of the trade value, so the price must move that much just to break even.",
          draw: function (g, s) {
            g.clear();
            var x0 = 10, wid = 320, run = 0, i;
            g.text(x0, 12, "Cost pile: DUMMY rates", "cft-tx cft-tx-s cft-tx-b");
            g.rect(x0, 18, wid, 20, "cft-rc-grey");
            var sc = L.scale(0, total, 0, wid);
            for (i = 0; i < Math.min(s, segs.length); i++) {
              g.rect(x0 + sc(run), 18, Math.max(1, sc(segs[i][1])), 20, segs[i][2]);
              run += segs[i][1];
            }
            g.text(x0, 54, "So far: " + inr(run, 2) + (s > 0 && s <= segs.length ? ". Just added: " + segs[Math.min(s, segs.length) - 1][0] + " " + inr(segs[Math.min(s, segs.length) - 1][1], 2) : ""), "cft-tx cft-tx-s");
            // curve of cost % against trade value (log scale)
            var cx0 = 46, cx1 = 330, cy0 = 205, cy1 = 82;
            var lo = Math.log(1000), hi = Math.log(100000);
            var ymax = Math.max(costPct(1000), 1);
            var sx = function (t) { return cx0 + ((Math.log(t) - lo) / (hi - lo)) * (cx1 - cx0); };
            var sy = function (c) { return cy0 - (c / ymax) * (cy0 - cy1); };
            g.text(x0, 74, "Total cost as % of trade value, for different trade sizes", "cft-tx cft-tx-s");
            g.line(cx0, cy0, cx1, cy0, "cft-ln");
            g.line(cx0, cy1, cx0, cy0, "cft-ln");
            [1000, 5000, 10000, 50000, 100000].forEach(function (t) {
              g.text(sx(t), cy0 + 14, t >= 100000 ? "1L" : t >= 1000 ? (t / 1000) + "k" : t, "cft-tx cft-tx-s", "middle");
            });
            g.text(cx0 - 4, cy1 + 4, pct(ymax, 1), "cft-tx cft-tx-s", "end");
            g.text(cx0 - 4, cy0 + 4, "0%", "cft-tx cft-tx-s", "end");
            var pts = [];
            for (i = 0; i <= 30; i++) { var t2 = Math.exp(lo + ((hi - lo) * i) / 30); pts.push([sx(t2), sy(costPct(t2))]); }
            g.path(pts, "cft-pl");
            if (s >= segs.length + 1 || s === 0) {
              var tvc = L.clamp(v.tv, 1000, 100000);
              g.circle(sx(tvc), sy(costPct(v.tv) > ymax ? ymax : costPct(v.tv)), 5, "cft-dot");
              g.text(sx(tvc), sy(Math.min(costPct(v.tv), ymax)) - 9, "You: " + pct(costPct(v.tv), 2), "cft-tx cft-tx-s cft-tx-b", sx(tvc) > 250 ? "end" : "start");
            }
            g.text(cx1, cy0 + 26, "Trade value (Rs)", "cft-tx cft-tx-s", "end");
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. Each step adds one cost.";
            if (s <= segs.length) return "Step " + s + ": " + segs[s - 1][0] + " is " + inr(segs[s - 1][1], 2) + ".";
            return "Total: " + inr(total, 2) + ". Below, see how this share changes with the size of the trade.";
          },
        };
      },
    });
  };

  // ---------------------------------------------------------------
  // Gate check
  // ---------------------------------------------------------------
  D["gate-check"] = function (p, host) {
    var box = el("div", "cft-box cft-demo");
    box.appendChild(el("div", "cft-box-title", "Gate " + (p.gate || "") + " check"));
    box.appendChild(el("p", null, "Passing this check shows you know the money math. It does not show that you will make money, and it never means you should start trading with real money."));
    host.appendChild(box);
  };

  // ---------------------------------------------------------------
  // Spot the mistake
  // ---------------------------------------------------------------
  D["spot-the-mistake"] = function (p, host) {
    var set = L.S(p, "set", "");
    if (set === "order-previews") return spotOrders(p, host);
    if (set === "late-entry" || (p.wins === undefined && p.system === undefined && /late entry/i.test(String(p.caption || "")))) return spotLate(p, host);
    return spotSystem(p, host);
  };

  function spotSystem(p, host) {
    var order = 0;
    var shuffleSeed = 3;
    var api = lab(host, {
      title: "A system that wins often (practice numbers)",
      hint: "What to try: press Play and watch the account trade by trade. Then change the size of the loss. Find the point where winning often stops being enough.",
      aria: "Line chart of the running total after each trade. Many small wins are followed by one large loss.",
      interval: 600,
      fields: [
        { key: "wins", label: "Number of wins", value: P(p, "wins", 9) },
        { key: "ws", label: "Rs won each time", value: P(p, "winSize", 300) },
        { key: "loss", label: "Number of losses", value: P(p, "losses", 1) },
        { key: "ls", label: "Rs lost each time", value: P(p, "lossSize", 4000) },
      ],
      compute: function (v) {
        var w = Math.max(0, Math.floor(v.wins)), l = Math.max(0, Math.floor(v.loss));
        var n = w + l;
        if (n <= 0) return { warn: "Enter at least one trade." };
        if (n > 200) return { warn: "Keep the total number of trades at 200 or fewer." };
        var net = v.wins * v.ws - v.loss * v.ls;
        var seq = [], j, k;
        for (k = 0; k < n; k++) seq.push("W");
        for (j = 0; j < l; j++) seq[Math.min(n - 1, Math.floor(((j + 1) * n) / (l + 1)))] = "L";
        var eq = [0];
        for (k = 0; k < n; k++) eq.push(eq[k] + (seq[k] === "W" ? v.ws : -v.ls));
        return {
          total: n + 1,
          rows: [
            ["Win rate", pct((v.wins * 100) / n, 0)],
            ["Total won", inr(v.wins * v.ws)],
            ["Total lost", inr(v.loss * v.ls)],
            ["Net result over " + n + " trades", inr(net), true],
            ["Average per trade (expectancy)", inr(net / n, 2)],
          ],
          notes: [net < 0 ? "A high win rate can still lose money when the losses are much bigger than the wins." : "Here the system is ahead. Change the numbers to see where it turns negative."],
          summary: "The win rate is " + pct((v.wins * 100) / n, 0) + ", but the net result over " + n + " trades is " + inr(net) + ", an average of " + inr(net / n, 2) + " per trade.",
          draw: function (g, s) {
            lineChart(g, { series: [{ pts: eq, cls: net < 0 ? "cft-pl-r" : "cft-pl-g" }], hlines: [{ v: 0, label: "Rs 0", cls: "cft-ln" }], mr: 36, reveal: s, xlabel: "Trade number (running total in Rs)" });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. One trade is added each step.";
            var i = Math.min(s, n + 1) - 1;
            if (i === 0) return "Start at Rs 0.";
            return "Trade " + i + ": " + (seq[i - 1] === "W" ? "win " + inr(v.ws) : "loss " + inr(v.ls)) + ". Running total " + inr(eq[i]) + ".";
          },
        };
      },
    });
    void api; void order; void shuffleSeed;
    var wins = P(p, "wins", 9), ws = P(p, "winSize", 300), losses = P(p, "losses", 1), ls = P(p, "lossSize", 4000);
    var n = wins + losses, sys = L.S(p, "system", "X");
    pickOne(host, {
      title: "Spot the mistake",
      intro: "What to try: read the three claims about System " + sys + ". One of them does not follow from the numbers.",
      q: "Which claim does NOT follow from the numbers?",
      options: [
        "System " + sys + " wins " + wins + " of every " + n + " trades.",
        "Each win is " + inr(ws) + " and each loss is " + inr(ls) + ".",
        "A system that wins this often must make money.",
      ],
      correct: 2,
      explain: function (i) {
        var net = wins * ws - losses * ls;
        if (i === 2) return "How often you win is only half of the story. Here the net result is " + inr(net) + " over " + n + " trades, because the size of the loss matters as much as the number of wins.";
        return "That one is a plain fact from the numbers. The claim that does not follow is the third one: winning often does not mean making money.";
      },
    });
  }

  function spotLate(p, host) {
    lab(host, {
      title: "Chasing a move: the planned trade and the late trade (practice numbers)",
      hint: "What to try: press Play and watch the price jump after your planned entry. Change the late stop and see how many shares the same Rs 500 of risk buys. Then find the line in the journal note that breaks the plan.",
      aria: "Price chart. The price sits near the planned entry, then jumps up. A late entry is shown far above the plan.",
      h: 215,
      interval: 600,
      fields: [
        { key: "pe", label: "Planned entry (Rs)", value: 400 },
        { key: "ps", label: "Planned stop (Rs)", value: 390 },
        { key: "late", label: "Late entry price (Rs)", value: 448 },
        { key: "ns", label: "New stop for the late entry (Rs)", value: 420 },
        { key: "risk", label: "Risk budget (Rs)", value: 500 },
      ],
      compute: function (v) {
        var prps = v.pe - v.ps, lrps = v.late - v.ns;
        if (prps <= 0 || lrps <= 0) return { warn: "Each stop must be below its entry price." };
        var pq = Math.floor(v.risk / prps), lq = Math.floor(v.risk / lrps);
        var total = 12, pts = [], k, wg = [-2, -1, 0, 1, -1, 0];
        for (k = 0; k < 6; k++) pts.push(v.pe + wg[k]);
        for (k = 6; k < total; k++) pts.push(v.pe + (v.late - v.pe) * ((k - 5) / 6));
        return {
          total: total,
          rows: [
            ["Planned shares (risk budget / risk per share)", pq + " shares"],
            ["Planned cash", inr(pq * v.pe)],
            ["Price now compared with the plan", pct(((v.late - v.pe) * 100) / v.pe, 1) + " higher"],
            ["New risk per share (late entry - new stop)", inr(lrps)],
            ["Late-entry shares", lq + " shares", true],
            ["Late-entry cash", inr(lq * v.late)],
          ],
          notes: ["Fewer shares do not make it the planned trade. The entry, the stop and the reason are all different."],
          summary: "Planned trade: " + pq + " shares at " + inr(v.pe) + " (" + inr(pq * v.pe) + "). Late trade: " + lq + " shares at " + inr(v.late) + " (" + inr(lq * v.late) + "). Same risk budget, but not the same trade.",
          draw: function (g, s) {
            dayChart(g, {
              pts: pts, gapAt: -1, reveal: s,
              lines: [
                { v: v.late, label: "Late " + plainNum(v.late), cls: "cft-ln-hi" },
                { v: v.new === undefined ? v.ns : v.ns, label: "New stop " + plainNum(v.ns), cls: "cft-ln-d" },
                { v: v.pe, label: "Plan " + plainNum(v.pe), cls: "cft-ln" },
                { v: v.ps, label: "Stop " + plainNum(v.ps), cls: "cft-ln-d" },
              ],
              marks: [{ i: total - 1, v: v.late, label: "Late entry", cls: "cft-dot", up: true }],
            });
          },
          status: function (s) {
            if (s <= 0) return "Press Play or Step. The price starts near your planned entry.";
            if (s < 6) return "The price sits near your planned entry. Nothing has fired yet.";
            if (s < total) return "The price jumps up. Others seem to be buying. The planned price is gone.";
            return "You are tempted to buy now, at a new price, with a new stop.";
          },
        };
      },
    });
    pickOne(host, {
      title: "Find the line that breaks the plan",
      intro: "A trader wrote this journal note after the jump. Hypothetical.",
      q: "Which line breaks the plan?",
      options: [
        "Line 1: The plan was to buy at Rs 400 with a stop at Rs 390.",
        "Line 2: The stock jumped 12% today and I saw others buying.",
        "Line 3: I bought at Rs 448 with a stop at Rs 420 because I did not want to miss it.",
        "Line 4: My risk is still Rs 500, so this is my plan.",
      ],
      correct: 2,
      explain: function (i) {
        if (i === 2) return "The plan said Rs 400 with a stop at Rs 390. A buy at Rs 448 is a new trade. Line 4 then calls it the plan, which it is not: the same risk does not make it the planned trade.";
        if (i === 3) return "Line 4 is the excuse, but the break happens earlier, in line 3, when the buy was made at a price that was not in the plan.";
        return "That line only describes what happened or what was planned. The break is in line 3, where the buy was made at a price that was not in the plan.";
      },
    });
  }

  // Three recreated order previews, each with one error. Illustration only.
  function spotOrders(p, host) {
    var cases = [
      {
        plan: "Plan: a sell stop for 100 shares you hold, trigger at Rs 240.",
        screen: [["Side", "BUY"], ["Order type", "SL-M (stop)"], ["Quantity", "100"], ["Trigger", "Rs 240"], ["Product", "CNC"]],
        wrong: 0,
        fix: "Wrong side. A stop for a holding must be a sell stop. Change the side to sell. (A buy order does not sell your shares.)",
      },
      {
        plan: "Plan: buy 25 shares at Rs 300.",
        screen: [["Side", "BUY"], ["Order type", "Limit"], ["Quantity", "250"], ["Price", "Rs 300"], ["Product", "CNC"]],
        wrong: 2,
        fix: "Wrong quantity. The order is ten times the plan: 250 x Rs 300 = " + inr(250 * 300) + " instead of 25 x Rs 300 = " + inr(25 * 300) + ". Change it to 25.",
      },
      {
        plan: "Plan: CNC, because you will hold for three weeks.",
        screen: [["Side", "BUY"], ["Order type", "Limit"], ["Quantity", "25"], ["Price", "Rs 300"], ["Product", "MIS"]],
        wrong: 4,
        fix: "Wrong product. MIS is a same-day product, so it does not match a three-week hold. Change the product to CNC.",
      },
    ];
    var names = ["Side", "Order type", "Quantity", "Price or trigger", "Product"];
    var b = L.box(host, "Spot the mistake in each order (illustration)", "What to try: compare each order preview with its plan. Pick the one part that is wrong. Write the correction in your head, then check. Illustration. Your Kite may look different.");
    cases.forEach(function (c, ci) {
      var scr = el("div", "cft-screen");
      scr.appendChild(el("div", "cft-screen-bar", "Order preview " + (ci + 1) + " of 3"));
      scr.appendChild(el("p", null, c.plan));
      L.table(scr, c.screen.map(function (r) { return [r[0], r[1]]; }));
      scr.appendChild(el("p", "cft-note", "Illustration. Your Kite may look different."));
      var sel = L.select(scr, { label: "Which part is wrong?", value: "-", options: [["-", "Choose one"]].concat(names.map(function (nm, i) { return [String(i), nm]; })), onChange: function () { fb.textContent = ""; } });
      var fb = el("div");
      L.button(scr, "Check", function () {
        fb.textContent = "";
        var v = sel.get();
        if (v === "-") { L.feedback(fb, false, "Choose one part first."); return; }
        var ok = Number(v) === c.wrong;
        L.feedback(fb, ok, ok ? "Correct. " + c.fix : "Not quite. Compare each line with the plan once more. Hint: the error is in " + names[c.wrong].toLowerCase() + "." );
      });
      scr.appendChild(fb);
      b.body.appendChild(scr);
    });
    resultLine(b.body).textContent = "Check each order against your plan before you send it: side, product, quantity, then price.";
  }

  // ---------------------------------------------------------------
  // Generic fallback (used by components.js when a demo is missing)
  // ---------------------------------------------------------------
  D.__fallback = function (c, host) {
    var box = el("div", "cft-box cft-placeholder");
    box.appendChild(el("div", "cft-box-title", "Interactive demo: " + c.name));
    var cap = null;
    (c.params || []).forEach(function (x) { if (x[0] === "caption") cap = x[1]; });
    if (cap) box.appendChild(el("p", "cft-caption", cap));
    box.appendChild(el("div", "cft-note", "Coming soon."));
    host.appendChild(box);
  };
})();
