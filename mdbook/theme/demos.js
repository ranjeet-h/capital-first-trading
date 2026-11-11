(function () {
  "use strict";

  // Interactive demos. Each demo is registered as CFT_DEMOS[name](params, host).
  // All numbers are practice numbers. Nothing here places an order or gives advice.

  var D = (window.CFT_DEMOS = window.CFT_DEMOS || {});

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function num(v, d) {
    var n = parseFloat(v);
    return isNaN(n) ? d : n;
  }
  function inr(n, dec) {
    if (!isFinite(n)) return "-";
    var s = Math.abs(n).toLocaleString("en-IN", {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec === undefined ? 2 : dec,
    });
    return (n < 0 ? "-" : "") + "Rs " + s;
  }
  function pct(n, dec) {
    return isFinite(n) ? n.toFixed(dec === undefined ? 1 : dec) + "%" : "-";
  }

  // Builds a demo box: input fields on top, results (table, bars, notes) below.
  // spec: { title, fields:[{key,label,value,step,text}], compute(vals)->{rows,bars,notes,warn}, buttons? }
  function build(host, spec) {
    var box = el("div", "cft-box cft-demo");
    box.appendChild(el("div", "cft-box-title", spec.title));
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
      if (r.rows) {
        var t = el("table", "cft-table");
        r.rows.forEach(function (row) {
          var tr = el("tr", row[2] ? "cft-strong" : "");
          tr.appendChild(el("td", null, row[0]));
          tr.appendChild(el("td", "cft-val", row[1]));
          t.appendChild(tr);
        });
        out.appendChild(t);
      }
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
      if (r.extra) r.extra(out);
    }
    draw();
    return { draw: draw, inputs: inputs, box: box };
  }

  function P(p, k, d) { return p[k] !== undefined ? num(p[k], d) : d; }

  // ---------- position size ----------
  D["position-size-viz"] = function (p, host) {
    build(host, {
      title: "Position size calculator (practice numbers)",
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
          bars: [
            { label: "Risk limit", value: raw, text: raw + " shares", hi: shares === raw },
            { label: "Cash limit", value: cash, text: cash + " shares", hi: shares === cash && shares !== raw },
            { label: "One-stock limit", value: conc, text: conc + " shares", hi: shares === conc && shares !== raw },
          ],
          notes: ["The smallest limit decides. Here it is " + bind + ". Costs and slippage are not included."],
        };
      },
    });
  };

  // ---------- stop-loss, gaps and circuits ----------
  D["sl-trigger-sim"] = function (p, host) {
    if (p.prevClose !== undefined) {
      build(host, {
        title: "Price band and stop-loss (practice numbers)",
        fields: [
          { key: "prev", label: "Yesterday's close (Rs)", value: P(p, "prevClose", 400) },
          { key: "band", label: "Price band (%)", value: P(p, "bandPct", 10), step: 0.5 },
          { key: "qty", label: "Shares you hold", value: P(p, "qty", 100) },
          { key: "stop", label: "Your stop-loss (Rs)", value: P(p, "stop", 0) },
        ],
        compute: function (v) {
          if (v.prev <= 0) return { warn: "Enter yesterday's close." };
          var low = v.prev * (1 - v.band / 100);
          var high = v.prev * (1 + v.band / 100);
          var rows = [
            ["Lowest price allowed today", inr(low)],
            ["Highest price allowed today", inr(high)],
            ["Most the price can fall from yesterday's close", inr((v.prev - low) * v.qty) + " on " + v.qty + " shares"],
          ];
          var notes = ["If a stock is locked at its lower price limit, there may be no buyers. Your sell order can wait without filling."];
          if (v.stop > 0) {
            if (v.stop > low) {
              rows.push(["Stop is above the lower limit by", inr(v.stop - low) + " per share"]);
              rows.push(["Extra loss if you can only exit at the lower limit", inr((v.stop - low) * v.qty), true]);
              notes.push("The stop is what you planned. The lower limit is where you might really be stuck.");
            } else {
              notes.push("This stop is at or below the lower limit, so it cannot trigger today.");
            }
          }
          return { rows: rows, notes: notes };
        },
      });
      return;
    }
    build(host, {
      title: "Stop-loss and an overnight gap (practice numbers)",
      fields: [
        { key: "capital", label: "Capital (Rs)", value: P(p, "capital", 50000) },
        { key: "riskPct", label: "Risk per trade (%)", value: P(p, "riskPct", 1), step: 0.1 },
        { key: "entry", label: "Entry price (Rs)", value: P(p, "entry", 250) },
        { key: "stop", label: "Stop-loss (Rs)", value: P(p, "stop", 240) },
        { key: "open", label: "Next day's opening price (Rs)", value: P(p, "open", 232) },
        { key: "slip", label: "Extra slippage per share (Rs)", value: P(p, "slippage", 0) },
      ],
      compute: function (v) {
        var rps = v.entry - v.stop;
        if (rps <= 0) return { warn: "For a buy, the stop must be below the entry price." };
        var budget = (v.capital * v.riskPct) / 100;
        var qty = Math.floor(budget / rps);
        var planned = qty * rps;
        var fill = Math.min(v.open, v.stop) - v.slip;
        var actual = qty * (v.entry - fill);
        return {
          rows: [
            ["Shares (risk budget / risk per share)", qty + ""],
            ["Planned loss if the stop fills exactly", inr(planned)],
            ["Where your sell order really fills", inr(fill)],
            ["Actual loss", inr(actual), true],
            ["Actual loss compared with planned", planned > 0 ? (actual / planned).toFixed(2) + " x" : "-"],
            ["Actual loss as % of capital", pct((actual * 100) / v.capital, 2)],
          ],
          bars: [
            { label: "Planned loss", value: planned, text: inr(planned) },
            { label: "Actual loss", value: actual, text: inr(actual), hi: actual > planned },
          ],
          notes: [
            v.open < v.stop
              ? "The price opened below your stop, so the stop turned into a sell order at the opening price or worse."
              : "The price did not gap below the stop, so the fill is at the stop (less any slippage).",
          ],
        };
      },
    });
  };

  // ---------- drawdown and compounding ----------
  D["drawdown-compounding"] = function (p, host) {
    if (p.path !== undefined) {
      build(host, {
        title: "Equity path and the peak so far (practice numbers)",
        fields: [{ key: "path", label: "Account value after each step (Rs, comma separated)", value: p.path, text: true }],
        compute: function (v) {
          var pts = v.path.split(",").map(function (s) { return num(s, NaN); }).filter(function (x) { return !isNaN(x); });
          if (pts.length < 2) return { warn: "Enter at least two numbers separated by commas." };
          var peak = pts[0], rows = [], worst = 0;
          pts.forEach(function (x, i) {
            peak = Math.max(peak, x);
            var dd = ((peak - x) * 100) / peak;
            worst = Math.max(worst, dd);
            rows.push(["Step " + (i + 1) + ": " + inr(x) + " (peak " + inr(peak) + ")", pct(dd) + " below peak"]);
          });
          rows.push(["Deepest drop from a peak", pct(worst), true]);
          return { rows: rows, notes: ["The peak so far is called the high-water mark. A drawdown is how far you are below it."] };
        },
      });
      return;
    }
    if (p.sequence !== undefined) {
      build(host, {
        title: "Same results, different bet size (practice numbers)",
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
            var eq = v.cap, peak = eq, low = eq, worst = 0;
            for (var i = 0; i < seq.length; i++) {
              eq += seq[i] === "W" ? R * v.winR : -R;
              peak = Math.max(peak, eq);
              low = Math.min(low, eq);
              worst = Math.max(worst, ((peak - eq) * 100) / peak);
            }
            return { end: eq, low: low, dd: worst };
          }
          var A = run(v.a), B = run(v.b);
          var wins = seq.split("W").length - 1;
          return {
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
          };
        },
      });
      return;
    }
    build(host, {
      title: "How much gain you need to recover a loss (practice numbers)",
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
        return {
          rows: rows,
          bars: [
            { label: "Loss", value: v.loss, text: pct(v.loss) },
            { label: "Gain needed", value: Math.min(need, 400), text: pct(need), hi: true },
          ],
          notes: ["Gains are measured on a smaller base, so the climb back is always steeper than the fall."],
        };
      },
    });
  };

  // ---------- streaks ----------
  D["streak-sim"] = function (p, host) {
    if (p.losingDays !== undefined) {
      build(host, {
        title: "A run of losing days (practice numbers)",
        fields: [
          { key: "cap", label: "Capital (Rs)", value: P(p, "capital", 50000) },
          { key: "r", label: "Loss each day (% of capital left)", value: P(p, "riskPct", 1), step: 0.1 },
          { key: "n", label: "Losing days in a row", value: P(p, "losingDays", 5) },
        ],
        compute: function (v) {
          var f = 1 - v.r / 100;
          function lost(n) { return v.cap * (1 - Math.pow(f, n)); }
          var rows = [[v.n + " losing days: capital lost", inr(lost(v.n)) + " (" + pct((lost(v.n) * 100) / v.cap, 2) + ")", true]];
          [5, 10, 15].forEach(function (n) { rows.push(["After " + n + " losing days", inr(lost(n))]); });
          return { rows: rows, notes: ["Each day loses a share of what is left, so the loss grows a little slower than a straight line."] };
        },
      });
      return;
    }
    var host2 = el("div");
    host.appendChild(host2);
    var seed = 0;
    var demo = build(host2, {
      title: "Losing streaks in a run of trades (practice numbers)",
      fields: [
        { key: "w", label: "Win rate (%)", value: P(p, "winRate", 50) },
        { key: "n", label: "Number of trades", value: 100 },
        { key: "k", label: "Streak length to look at", value: 3 },
      ],
      compute: function (v, redraw, out) {
        var w = v.w / 100;
        if (w < 0 || w > 1) return { warn: "Win rate must be between 0 and 100." };
        var n = Math.min(Math.max(Math.floor(v.n), 1), 2000);
        var best = 0, cur = 0, wins = 0, line = "";
        for (var i = 0; i < n; i++) {
          var win = Math.random() < w;
          if (win) { wins++; cur = 0; } else { cur++; best = Math.max(best, cur); }
          if (i < 60) line += win ? "W" : "L";
        }
        var rows = [
          ["Wins / losses in this run", wins + " / " + (n - wins)],
          ["Longest losing streak in this run", best + "", true],
          ["Chance of " + v.k + " losses in a row (next " + v.k + " trades)", pct(Math.pow(1 - w, v.k) * 100, 2)],
        ];
        return {
          rows: rows,
          notes: ["First trades: " + line + (n > 60 ? "..." : ""), "Each press of 'Run again' is a new random run. Real markets can cluster losses even more than this."],
          extra: function (o) {
            var b = el("button", "cft-btn", "Run again");
            b.type = "button";
            b.addEventListener("click", redraw);
            o.appendChild(b);
          },
        };
      },
    });
    void seed; void demo;
  };

  // ---------- leverage ----------
  D["leverage-demo"] = function (p, host) {
    build(host, {
      title: "Leverage: theory only (practice numbers)",
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
        return { rows: rows, notes: notes };
      },
    });
  };

  // ---------- capital allocation ----------
  D["capital-allocation-planner"] = function (p, host) {
    if (p.path !== undefined) {
      build(host, {
        title: "Withdrawal threshold check (practice numbers)",
        fields: [
          { key: "path", label: "Account value after each step (Rs, comma separated)", value: p.path, text: true },
          { key: "th", label: "Withdrawal threshold (Rs)", value: P(p, "threshold", 60000) },
        ],
        compute: function (v) {
          var pts = v.path.split(",").map(function (s) { return num(s, NaN); }).filter(function (x) { return !isNaN(x); });
          if (pts.length < 1) return { warn: "Enter numbers separated by commas." };
          var peak = Math.max.apply(null, pts), last = pts[pts.length - 1];
          return {
            rows: [
              ["Highest value so far (high-water mark)", inr(peak)],
              ["Latest value", inr(last)],
              ["Below the high-water mark by", inr(peak - last)],
              ["Threshold reached?", peak >= v.th ? "Yes, at some point" : "No. Short by " + inr(v.th - peak), true],
            ],
            notes: ["A common rule is to take money out only when the account is at a new high, never while it is in a drawdown."],
          };
        },
      });
      return;
    }
    build(host, {
      title: "Where does your money sit? (practice numbers)",
      fields: [
        { key: "sav", label: "Total savings (Rs)", value: P(p, "savings", 400000) },
        { key: "tc", label: "Trading capital (Rs)", value: P(p, "tradingCapital", 50000) },
        { key: "cut", label: "Cut size after losing (%)", value: P(p, "cutPct", 10) },
        { key: "stop", label: "Stop trading after losing (%)", value: P(p, "stopPct", 20) },
        { key: "risk", label: "Risk per trade (%)", value: P(p, "riskPct", 1), step: 0.1 },
      ],
      compute: function (v) {
        if (v.tc > v.sav) return { warn: "Trading capital cannot be more than your savings." };
        var untouched = v.sav - v.tc;
        return {
          rows: [
            ["Money you never trade with", inr(untouched)],
            ["Trading capital as % of savings", pct((v.tc * 100) / v.sav)],
            ["Account value where you cut your size", inr(v.tc * (1 - v.cut / 100))],
            ["Account value where you stop and review", inr(v.tc * (1 - v.stop / 100))],
            ["Rs at risk on one trade", inr((v.tc * v.risk) / 100), true],
          ],
          bars: [
            { label: "Untouched", value: untouched, text: inr(untouched) },
            { label: "Trading", value: v.tc, text: inr(v.tc), hi: true },
          ],
        };
      },
    });
  };

  // ---------- risk limits ----------
  D["risk-limit-simulator"] = function (p, host) {
    var state = { day: 0, week: 0, month: 0, trades: 0 };
    var ui;
    ui = build(host, {
      title: "Risk limit ladder (practice numbers)",
      fields: [
        { key: "cap", label: "Capital (Rs)", value: P(p, "capital", 50000) },
        { key: "pt", label: "Per trade (%)", value: P(p, "perTradePct", 1), step: 0.1 },
        { key: "d", label: "Per day (%)", value: P(p, "dailyPct", 2), step: 0.1 },
        { key: "w", label: "Per week (%)", value: P(p, "weeklyPct", 4), step: 0.1 },
        { key: "m", label: "Per month (%)", value: P(p, "monthlyPct", 8), step: 0.1 },
        { key: "mt", label: "Max trades per day", value: P(p, "maxTradesPerDay", 2) },
        { key: "loss", label: "Loss on each losing trade (Rs)", value: p.lossPerTrade !== undefined ? P(p, "lossPerTrade", 0) : (P(p, "capital", 50000) * P(p, "perTradePct", 1)) / 100 },
      ],
      compute: function (v) {
        var L = { d: (v.cap * v.d) / 100, w: (v.cap * v.w) / 100, m: (v.cap * v.m) / 100 };
        var status = "You can keep trading by your rules.";
        var stop = false;
        if (state.month >= L.m) { status = "STOP: monthly limit reached. No more trades this month."; stop = true; }
        else if (state.week >= L.w) { status = "STOP: weekly limit reached. No more trades this week."; stop = true; }
        else if (state.day >= L.d) { status = "STOP: daily limit reached. No more trades today."; stop = true; }
        else if (state.trades >= v.mt) { status = "STOP: you used all your trades for today."; stop = true; }
        return {
          rows: [
            ["Most you accept to lose on one trade", inr((v.cap * v.pt) / 100)],
            ["Today: lost / limit", inr(state.day) + " / " + inr(L.d)],
            ["This week: lost / limit", inr(state.week) + " / " + inr(L.w)],
            ["This month: lost / limit", inr(state.month) + " / " + inr(L.m)],
            ["Trades today / max", state.trades + " / " + v.mt],
            ["Status", status, true],
          ],
          bars: [
            { label: "Day", value: Math.min(state.day / L.d, 1) * 100, text: pct((state.day * 100) / L.d, 0), hi: state.day >= L.d },
            { label: "Week", value: Math.min(state.week / L.w, 1) * 100, text: pct((state.week * 100) / L.w, 0), hi: state.week >= L.w },
            { label: "Month", value: Math.min(state.month / L.m, 1) * 100, text: pct((state.month * 100) / L.m, 0), hi: state.month >= L.m },
          ],
          extra: function (o) {
            var row = el("div", "cft-btn-row");
            function btn(t, fn) {
              var b = el("button", "cft-btn", t);
              b.type = "button";
              b.addEventListener("click", fn);
              row.appendChild(b);
            }
            btn("Take a losing trade", function () {
              if (stop) return;
              var loss = num(ui.inputs.loss.value, 0);
              state.day += loss; state.week += loss; state.month += loss; state.trades++;
              ui.draw();
            });
            btn("New day", function () { state.day = 0; state.trades = 0; ui.draw(); });
            btn("Reset all", function () { state.day = state.week = state.month = state.trades = 0; ui.draw(); });
            o.appendChild(row);
          },
        };
      },
    });
  };

  // ---------- order book ----------
  D["order-book-sim"] = function (p, host) {
    if (p.ask !== undefined) {
      var levels = String(p.ask).split(",").map(function (s) {
        var a = s.trim().split("x");
        return { price: num(a[0], 0), qty: num(a[1], 0) };
      }).filter(function (l) { return l.price > 0 && l.qty > 0; });
      build(host, {
        title: "A market buy walks up the sellers (practice numbers)",
        fields: [{ key: "q", label: "Shares you want to buy at market", value: P(p, "market_buy_qty", 250) }],
        compute: function (v) {
          var left = v.q, cost = 0, rows = [], last = 0;
          levels.forEach(function (l) {
            if (left <= 0) return;
            var take = Math.min(left, l.qty);
            rows.push(["Buy " + take + " at " + inr(l.price) + " (" + l.qty + " were on offer)", inr(take * l.price)]);
            cost += take * l.price; left -= take; last = l.price;
          });
          var got = v.q - left;
          if (got <= 0) return { warn: "Enter a quantity above zero." };
          rows.push(["Shares bought / total paid", got + " / " + inr(cost), true]);
          rows.push(["Average price per share", inr(cost / got, 2)]);
          rows.push(["Last traded price", inr(last)]);
          return { rows: rows, notes: left > 0 ? [left + " shares could not be filled: no more sellers in this list."] : ["Your big order used up cheap sellers first, so the price you pay rises."] };
        },
      });
      return;
    }
    build(host, {
      title: "The gap between buyers and sellers (practice numbers)",
      fields: [
        { key: "bid", label: "Best buyer price (bid, Rs)", value: P(p, "bestBid", 249.5), step: 0.05 },
        { key: "ask", label: "Best seller price (ask, Rs)", value: P(p, "bestAsk", 250.5), step: 0.05 },
        { key: "q", label: "Shares", value: P(p, "qty", 40) },
      ],
      compute: function (v) {
        if (v.ask < v.bid) return { warn: "The ask must be at or above the bid." };
        var spread = v.ask - v.bid;
        return {
          rows: [
            ["Spread (ask - bid)", inr(spread, 2)],
            ["Spread as % of the middle price", pct((spread * 100) / ((v.ask + v.bid) / 2), 2)],
            ["Buy at ask, sell right back at bid", inr(v.ask * v.q, 2) + " paid, " + inr(v.bid * v.q, 2) + " received"],
            ["Lost to the spread on a round trip", inr(spread * v.q, 2), true],
          ],
          notes: ["If the price does not move at all, you still lose the spread. Brokerage and taxes come on top."],
        };
      },
    });
  };

  // ---------- order flow ----------
  D["order-flow-sim"] = function (p, host) {
    var text = {
      trader: "You decide and enter the order in your trading app.",
      broker: "Your broker checks that you have the money and sends the order to the exchange.",
      exchange: "The exchange matches your order with a seller at an agreed price.",
      clearing: "The clearing house makes sure both sides do their part: money from the buyer, shares from the seller.",
      depository: "The depository records the shares in your demat account.",
    };
    var steps = String(p.steps || "trader, broker, exchange, clearing, depository").split(",").map(function (s) { return s.trim(); });
    var i = 0;
    var box = el("div", "cft-box cft-demo");
    box.appendChild(el("div", "cft-box-title", "Follow one order: buy " + P(p, "quantity", 20) + " shares at " + inr(P(p, "price", 250)) + " (practice)"));
    var body = el("div", "cft-out");
    var row = el("div", "cft-btn-row");
    function draw() {
      body.textContent = "";
      steps.forEach(function (s, k) {
        var line = el("div", "cft-step" + (k === i ? " cft-step-on" : k < i ? " cft-step-done" : ""));
        line.appendChild(el("strong", null, (k + 1) + ". " + s.charAt(0).toUpperCase() + s.slice(1) + ": "));
        line.appendChild(document.createTextNode(k <= i ? text[s] || "" : ""));
        body.appendChild(line);
      });
    }
    function btn(t, fn) {
      var b = el("button", "cft-btn", t);
      b.type = "button";
      b.addEventListener("click", fn);
      row.appendChild(b);
    }
    btn("Back", function () { i = Math.max(0, i - 1); draw(); });
    btn("Next step", function () { i = Math.min(steps.length - 1, i + 1); draw(); });
    box.appendChild(body);
    box.appendChild(row);
    host.appendChild(box);
    draw();
  };

  // ---------- costs ----------
  D["lab-costs"] = function (p, host) {
    build(host, {
      title: "Trade cost walk-through (DUMMY rates, not your broker's)",
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
        return {
          rows: [
            ["Buy leg: percentage + fixed", inr(prop, 2) + " + " + inr(v.fixed, 2) + " = " + inr(buy, 2)],
            ["Sell leg: percentage + fixed + depository fee", inr(prop, 2) + " + " + inr(v.fixed, 2) + " + " + inr(v.dp, 2) + " = " + inr(sell, 2)],
            ["Total cost of buying and selling", inr(total, 2), true],
            ["As % of the trade value", pct((total * 100) / v.tv, 2)],
            ["The price must move this much just to break even", pct((total * 100) / v.tv, 2)],
          ],
          notes: ["Change the trade value: the fixed fees stay the same in rupees, so small trades pay a bigger share. Look up your broker's real charges before relying on any figure."],
        };
      },
    });
  };

  // ---------- gate check ----------
  D["gate-check"] = function (p, host) {
    var box = el("div", "cft-box cft-demo");
    box.appendChild(el("div", "cft-box-title", "Gate " + (p.gate || "") + " check"));
    box.appendChild(el("p", null, "Passing this check shows you know the money math. It does not show that you will make money, and it never means you should start trading with real money."));
    host.appendChild(box);
  };

  // ---------- spot the mistake (expectancy) ----------
  D["spot-the-mistake"] = function (p, host) {
    build(host, {
      title: "A system that wins often (practice numbers)",
      fields: [
        { key: "wins", label: "Number of wins", value: P(p, "wins", 9) },
        { key: "ws", label: "Rs won each time", value: P(p, "winSize", 300) },
        { key: "loss", label: "Number of losses", value: P(p, "losses", 1) },
        { key: "ls", label: "Rs lost each time", value: P(p, "lossSize", 4000) },
      ],
      compute: function (v) {
        var n = v.wins + v.loss;
        if (n <= 0) return { warn: "Enter at least one trade." };
        var net = v.wins * v.ws - v.loss * v.ls;
        return {
          rows: [
            ["Win rate", pct((v.wins * 100) / n, 0)],
            ["Total won", inr(v.wins * v.ws)],
            ["Total lost", inr(v.loss * v.ls)],
            ["Net result over " + n + " trades", inr(net), true],
            ["Average per trade (expectancy)", inr(net / n, 2)],
          ],
          notes: [net < 0 ? "A high win rate can still lose money when the losses are much bigger than the wins." : "Here the system is ahead. Change the numbers to see where it turns negative."],
        };
      },
    });
  };

  // ---------- generic fallback ----------
  D.__fallback = function (c, host) {
    var box = el("div", "cft-box cft-placeholder");
    box.appendChild(el("div", "cft-box-title", "Interactive demo: " + c.name));
    box.appendChild(el("div", "cft-note", "Coming soon."));
    host.appendChild(box);
  };
})();
