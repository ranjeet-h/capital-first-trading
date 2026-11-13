(function () {
  "use strict";

  // Shared helpers for all interactive demos. Loaded before demos*.js.
  // Everything here is plain DOM + SVG. No network, no storage, no libraries.

  var L = (window.CFT_LIB = {});
  var SVGNS = "http://www.w3.org/2000/svg";

  L.el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  };
  L.num = function (v, d) {
    var n = parseFloat(v);
    return isNaN(n) ? d : n;
  };
  L.P = function (p, k, d) { return p && p[k] !== undefined ? L.num(p[k], d) : d; };
  L.S = function (p, k, d) { return p && p[k] !== undefined ? String(p[k]).trim() : d; };
  // "1, 2, 3" -> [1,2,3]. Returns d when the key is missing or empty.
  L.list = function (p, k, d) {
    if (!p || p[k] === undefined || String(p[k]).trim() === "") return d;
    var a = String(p[k]).split(",").map(function (x) { return parseFloat(x); }).filter(function (x) { return !isNaN(x); });
    return a.length ? a : d;
  };
  L.inr = function (n, dec) {
    if (!isFinite(n)) return "-";
    var s = Math.abs(n).toLocaleString("en-IN", {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec === undefined ? 2 : dec,
    });
    return (n < 0 ? "-" : "") + "Rs " + s;
  };
  L.pct = function (n, dec) { return isFinite(n) ? n.toFixed(dec === undefined ? 1 : dec) + "%" : "-"; };
  L.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };

  // Small seeded random generator (mulberry32). Same seed gives the same numbers.
  L.rng = function (seed) {
    var a = (seed || 1) >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // Made-up daily candles. Returns [{o,h,l,c,v}]. Never real market data.
  L.fakeCandles = function (n, seed, start, vol) {
    var r = L.rng(seed || 7), px = start || 100, out = [];
    vol = vol || 0.012;
    for (var i = 0; i < n; i++) {
      var o = px, drift = (r() - 0.48) * 2 * vol * px;
      var c = Math.max(1, o + drift);
      var h = Math.max(o, c) + r() * vol * px * 0.8;
      var l = Math.min(o, c) - r() * vol * px * 0.8;
      out.push({ o: +o.toFixed(2), h: +h.toFixed(2), l: +Math.max(0.5, l).toFixed(2), c: +c.toFixed(2), v: Math.round(8000 + r() * 12000) });
      px = c;
    }
    return out;
  };

  // A titled box. Returns {box, body, title}. Appended to host.
  L.box = function (host, title, hint) {
    var box = L.el("div", "cft-box cft-demo");
    var t = L.el("div", "cft-box-title", title);
    box.appendChild(t);
    if (hint) box.appendChild(L.el("div", "cft-hint", hint));
    var body = L.el("div", "cft-demo-body");
    box.appendChild(body);
    host.appendChild(box);
    return { box: box, body: body, title: t };
  };

  // A slider with a live value. opts: {label,min,max,step,value,fmt,onInput}
  L.slider = function (parent, o) {
    var wrap = L.el("label", "cft-field cft-slider");
    var top = L.el("span", "cft-field-label");
    var name = L.el("span", null, o.label);
    var val = L.el("span", "cft-slider-val");
    top.appendChild(name); top.appendChild(val);
    var i = L.el("input");
    i.type = "range"; i.min = o.min; i.max = o.max; i.step = o.step || 1; i.value = o.value;
    function show() { val.textContent = o.fmt ? o.fmt(+i.value) : i.value; }
    i.addEventListener("input", function () { show(); if (o.onInput) o.onInput(+i.value); });
    wrap.appendChild(top); wrap.appendChild(i);
    parent.appendChild(wrap);
    show();
    return { el: wrap, input: i, get: function () { return +i.value; }, set: function (v) { i.value = v; show(); } };
  };
  // A number box. opts: {label,value,step,onInput}
  L.numberField = function (parent, o) {
    var wrap = L.el("label", "cft-field");
    wrap.appendChild(L.el("span", "cft-field-label", o.label));
    var i = L.el("input", "cft-num");
    i.type = "number"; i.step = o.step || "any"; i.value = o.value;
    i.addEventListener("input", function () { if (o.onInput) o.onInput(L.num(i.value, 0)); });
    wrap.appendChild(i); parent.appendChild(wrap);
    return { el: wrap, input: i, get: function () { return L.num(i.value, 0); }, set: function (v) { i.value = v; } };
  };
  // A switch. opts: {label,value,onChange}
  L.toggle = function (parent, o) {
    var wrap = L.el("label", "cft-toggle");
    var i = L.el("input"); i.type = "checkbox"; i.checked = !!o.value;
    i.addEventListener("change", function () { if (o.onChange) o.onChange(i.checked); });
    wrap.appendChild(i); wrap.appendChild(L.el("span", null, " " + o.label));
    parent.appendChild(wrap);
    return { el: wrap, input: i, get: function () { return i.checked; }, set: function (v) { i.checked = !!v; } };
  };
  // A drop-down. opts: {label,options:[[value,text]],value,onChange}
  L.select = function (parent, o) {
    var wrap = L.el("label", "cft-field");
    wrap.appendChild(L.el("span", "cft-field-label", o.label));
    var s = L.el("select", "cft-num");
    o.options.forEach(function (op) {
      var e = L.el("option", null, op[1]); e.value = op[0]; s.appendChild(e);
    });
    s.value = o.value;
    s.addEventListener("change", function () { if (o.onChange) o.onChange(s.value); });
    wrap.appendChild(s); parent.appendChild(wrap);
    return { el: wrap, input: s, get: function () { return s.value; }, set: function (v) { s.value = v; } };
  };
  L.button = function (parent, text, onClick, cls) {
    var b = L.el("button", "cft-btn " + (cls || ""), text);
    b.type = "button";
    b.addEventListener("click", onClick);
    parent.appendChild(b);
    return b;
  };
  L.row = function (parent, cls) {
    var r = L.el("div", "cft-fields " + (cls || ""));
    parent.appendChild(r);
    return r;
  };
  L.note = function (parent, text, cls) {
    var n = L.el("p", "cft-note " + (cls || ""), text);
    parent.appendChild(n);
    return n;
  };
  // A table from rows [[label, value, strong?]]. Replaces the content of target.
  L.table = function (target, rows) {
    var t = L.el("table", "cft-table");
    rows.forEach(function (row) {
      var tr = L.el("tr", row[2] ? "cft-strong" : "");
      tr.appendChild(L.el("td", null, row[0]));
      tr.appendChild(L.el("td", "cft-val", row[1]));
      t.appendChild(tr);
    });
    target.appendChild(t);
    return t;
  };
  L.feedback = function (parent, ok, text) {
    var f = L.el("div", "cft-feedback " + (ok ? "cft-ok" : "cft-bad"), text);
    parent.appendChild(f);
    return f;
  };

  // Animation controller with a Play / Pause / Step / Reset bar.
  // opts: {interval (ms), total (steps, optional), step(i)->bool|void (return false to stop),
  //        reset(), onEnd(), autoplay:false}
  // Never starts by itself when the reader asks for reduced motion.
  L.anim = function (parent, o) {
    var timer = null, i = 0, speed = 1;
    var bar = L.el("div", "cft-btn-row cft-animbar");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bPlay = L.button(bar, "Play", toggle);
    var bStep = L.button(bar, "Step", function () { pause(); doStep(); });
    var bReset = L.button(bar, "Reset", function () { pause(); i = 0; if (o.reset) o.reset(); setLabel(); });
    var sel = L.el("select", "cft-num cft-speed");
    [["0.5", "Slow"], ["1", "Normal"], ["2", "Fast"]].forEach(function (s) {
      var e = L.el("option", null, s[1]); e.value = s[0]; sel.appendChild(e);
    });
    sel.value = "1";
    sel.addEventListener("change", function () { speed = +sel.value; if (timer) { pause(); play(); } });
    bar.appendChild(sel);
    var lab = L.el("span", "cft-hint cft-animlab");
    bar.appendChild(lab);
    parent.appendChild(bar);
    function setLabel() {
      lab.textContent = o.total ? "Step " + i + " of " + o.total : "Step " + i;
    }
    function doStep() {
      if (o.total && i >= o.total) { pause(); if (o.onEnd) o.onEnd(); return false; }
      var r = o.step(i);
      i++;
      setLabel();
      if (r === false || (o.total && i >= o.total)) { pause(); if (o.onEnd) o.onEnd(); return false; }
      return true;
    }
    function play() {
      if (timer) return;
      if (o.total && i >= o.total) { i = 0; if (o.reset) o.reset(); }
      bPlay.textContent = "Pause";
      timer = setInterval(doStep, (o.interval || 700) / speed);
    }
    function pause() {
      if (timer) { clearInterval(timer); timer = null; }
      bPlay.textContent = "Play";
    }
    function toggle() { if (timer) pause(); else play(); }
    setLabel();
    if (o.autoplay && !reduce) play();
    return {
      bar: bar, play: play, pause: pause, step: doStep,
      reset: function () { pause(); i = 0; if (o.reset) o.reset(); setLabel(); },
      index: function () { return i; },
      setIndex: function (n) { i = n; setLabel(); },
    };
  };

  // ---- SVG helpers ----
  // Creates a responsive SVG. Returns an object with helpers that all take plain numbers.
  L.svg = function (parent, w, h, cls) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("viewBox", "0 0 " + w + " " + h);
    s.setAttribute("class", "cft-svg " + (cls || ""));
    s.setAttribute("role", "img");
    parent.appendChild(s);
    function mk(tag, attrs, text) {
      var e = document.createElementNS(SVGNS, tag);
      Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text !== undefined) e.textContent = text;
      s.appendChild(e);
      return e;
    }
    return {
      svg: s, w: w, h: h, mk: mk,
      clear: function () { while (s.firstChild) s.removeChild(s.firstChild); },
      line: function (x1, y1, x2, y2, cls2, extra) {
        return mk("line", Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2, class: cls2 || "cft-ln" }, extra || {}));
      },
      rect: function (x, y, rw, rh, cls2, extra) {
        return mk("rect", Object.assign({ x: x, y: y, width: Math.max(0, rw), height: Math.max(0, rh), class: cls2 || "cft-rc" }, extra || {}));
      },
      circle: function (cx, cy, r, cls2) { return mk("circle", { cx: cx, cy: cy, r: r, class: cls2 || "cft-dot" }); },
      text: function (x, y, t, cls2, anchor) {
        return mk("text", { x: x, y: y, class: cls2 || "cft-tx", "text-anchor": anchor || "start" }, t);
      },
      path: function (pts, cls2) {
        if (!pts.length) return null;
        var d = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
        return mk("path", { d: d, class: cls2 || "cft-pl", fill: "none" });
      },
    };
  };
  // Linear scale: domain [d0,d1] -> range [r0,r1]
  L.scale = function (d0, d1, r0, r1) {
    var span = (d1 - d0) || 1;
    return function (v) { return r0 + ((v - d0) / span) * (r1 - r0); };
  };
  // Draws one candle. g = L.svg(...) result, x = centre, bw = body width, sy = y scale, cd = {o,h,l,c}
  L.candle = function (g, x, bw, sy, cd, extraCls) {
    var up = cd.c >= cd.o, cls = (up ? "cft-cup" : "cft-cdn") + (extraCls ? " " + extraCls : "");
    g.line(x, sy(cd.h), x, sy(cd.l), "cft-wick " + cls);
    var top = sy(Math.max(cd.o, cd.c)), bot = sy(Math.min(cd.o, cd.c));
    g.rect(x - bw / 2, top, bw, Math.max(1.5, bot - top), "cft-body " + cls);
  };
  // Min and max of a list of numbers, padded by a fraction.
  L.extent = function (arr, pad) {
    var lo = Math.min.apply(null, arr), hi = Math.max.apply(null, arr);
    var d = (hi - lo) * (pad === undefined ? 0.08 : pad) || 1;
    return [lo - d, hi + d];
  };
})();
