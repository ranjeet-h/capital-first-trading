(function () {
  "use strict";

  // Finds <!-- component: name | key: value ... --> comments in the rendered chapter
  // and replaces them with a live quiz (quiz-block) or a labelled placeholder box.
  // Reader-facing text comes from theme/i18n.js, generated per built book.

  function T(key, vars) {
    // Quiz strings follow the quiz language; everything else follows the page language.
    // A fallback page in the Marathi book therefore shows English chrome, while the
    // build-time notice above it stays in Marathi.
    var lang = /^ui\.quiz\./.test(key) ? quizLang() : pageLang();
    if (window.CFT_T) return window.CFT_T(key, vars, lang);
    return key;
  }

  function pageLang() {
    var main = document.querySelector("main");
    return (main && main.getAttribute("data-page-lang")) ||
      document.documentElement.lang || "en";
  }

  function quizLang() {
    var main = document.querySelector("main");
    return (main && main.getAttribute("data-quiz-lang")) || pageLang();
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function commentNodes(root) {
    var out = [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT, null);
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  }

  function parseComponent(text) {
    var parts = text.replace(/^\s*component:\s*/, "").split("|");
    var name = parts.shift().trim();
    var params = [];
    parts.forEach(function (p) {
      var i = p.indexOf(":");
      if (i > -1) params.push([p.slice(0, i).trim(), p.slice(i + 1).trim()]);
    });
    return { name: name, params: params };
  }

  function placeholder(c) {
    var box = el("div", "cft-box cft-placeholder");
    box.appendChild(el("div", "cft-box-title", T("ui.placeholder.title", { name: c.name })));
    var cap = c.params.filter(function (p) { return p[0] === "caption"; })[0];
    if (cap) box.appendChild(el("p", "cft-caption", cap[1]));
    var rest = c.params.filter(function (p) { return p[0] !== "caption"; });
    if (rest.length) {
      box.appendChild(el("div", "cft-params",
        T("ui.placeholder.inputs", {
          inputs: rest.map(function (p) { return p[0] + " = " + p[1]; }).join(", "),
        })));
    }
    box.appendChild(el("div", "cft-note", T("ui.placeholder.soon")));
    return box;
  }

  // Uses the shared fallback box from demos.js when it exists, else the built-in one.
  function showFallback(c, host, shared) {
    var done = false;
    if (typeof shared === "function") {
      try { shared(c, host); done = true; } catch (e) { host.textContent = ""; }
    }
    if (!done) host.appendChild(placeholder(c));
  }

  function addFeedback(box, ok, lines, noLabel) {
    var old = box.querySelector(".cft-feedback");
    if (old) old.remove();
    var f = el("div", "cft-feedback " + (ok ? "cft-ok" : "cft-bad"));
    if (!noLabel) f.appendChild(el("strong", null, ok ? T("ui.quiz.correct") + " " : T("ui.quiz.notQuite") + " "));
    lines.forEach(function (l) { f.appendChild(el("div", null, l)); });
    box.appendChild(f);
  }

  function normalizeDigits(value) {
    return String(value)
      .replace(/[\u0966-\u096F]/g, function (d) { return String(d.charCodeAt(0) - 0x0966); })
      .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
  }

  function typeLabel(type) {
    var label = T("ui.quiz.type." + type);
    return label === "ui.quiz.type." + type ? type : label;
  }

  // Builds one question. Returns {box, check, reset, result}.
  // result() is true (checked and right), false (checked and wrong) or null (not checked yet).
  // onChange is called whenever the result changes, so the quiz can update its score.
  function renderQuestion(q, n, onChange) {
    var box = el("div", "cft-q");
    var head = el("div", "cft-q-head");
    head.appendChild(el("span", "cft-q-n", T("ui.quiz.qPrefix", { n: n })));
    head.appendChild(el("span", "cft-q-type", typeLabel(q.type)));
    box.appendChild(head);
    box.appendChild(el("p", "cft-q-prompt", q.prompt));

    var getAnswer, clearInputs;
    var result = null;
    var name = "q-" + q.id + "-" + Math.random().toString(36).slice(2, 7);

    function clearFeedback() {
      var old = box.querySelector(".cft-feedback");
      if (old) old.remove();
    }
    // The reader changed an answer after a check. The old result no longer
    // matches what is on screen, so drop it and ask for a new check.
    function stale() {
      var had = result !== null;
      clearFeedback();
      result = null;
      if (had && onChange) onChange();
    }
    function setResult(ok, lines) {
      result = ok;
      addFeedback(box, ok, lines);
      if (onChange) onChange();
    }
    function notChecked(msg) {
      var had = result !== null;
      result = null;
      addFeedback(box, false, [msg], true);
      if (had && onChange) onChange();
    }

    if (q.type === "numeric") {
      var inp = el("input", "cft-num");
      inp.type = "text";
      inp.setAttribute("inputmode", "decimal");
      inp.placeholder = T("ui.quiz.numeric.placeholder") + (q.unit ? " (" + q.unit + ")" : "");
      inp.addEventListener("input", stale);
      box.appendChild(inp);
      getAnswer = function () { return inp.value.trim(); };
      clearInputs = function () { inp.value = ""; };
    } else if (q.type === "order") {
      box.appendChild(el("p", "cft-hint", T("ui.quiz.order.hint")));
      var list = el("ul", "cft-opts");
      (q.options || []).forEach(function (o) {
        list.appendChild(el("li", null, o.id + ") " + o.text));
      });
      box.appendChild(list);
      var oinp = el("input", "cft-num");
      oinp.type = "text";
      oinp.placeholder = T("ui.quiz.order.placeholder");
      oinp.addEventListener("input", stale);
      box.appendChild(oinp);
      getAnswer = function () {
        return oinp.value.split(/[\s,]+/).filter(Boolean).map(function (s) { return s.toLowerCase(); });
      };
      clearInputs = function () { oinp.value = ""; };
    } else {
      var multi = q.type === "multi";
      var inputs = [];
      var ul = el("div", "cft-opts");
      (q.options || []).forEach(function (o) {
        var lab = el("label", "cft-opt");
        var i = el("input");
        i.type = multi ? "checkbox" : "radio";
        i.name = name;
        i.value = o.id;
        i.addEventListener("change", stale);
        inputs.push(i);
        lab.appendChild(i);
        lab.appendChild(el("span", null, " " + o.text));
        ul.appendChild(lab);
      });
      box.appendChild(ul);
      getAnswer = function () {
        var sel = inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
        return multi ? sel : sel[0];
      };
      clearInputs = function () { inputs.forEach(function (i) { i.checked = false; }); };
    }

    function check() {
      var a = getAnswer();
      var ok, lines = [];
      clearFeedback();
      if (q.type === "numeric") {
        var v = parseFloat(normalizeDigits(String(a)).replace(/[,\s]/g, ""));
        if (isNaN(v)) { notChecked(T("ui.quiz.enterNumber")); return; }
        ok = Math.abs(v - q.answer) <= (q.tolerance || 0);
        if (!ok) lines.push(T("ui.quiz.expected", { answer: q.answer, unit: q.unit ? " " + q.unit : "" }));
        if (q.solution) lines.push(q.solution);
      } else if (q.type === "order") {
        if (!a.length) { notChecked(T("ui.quiz.typeLetters")); return; }
        ok = a.length === q.answer.length && a.every(function (x, i) { return x === q.answer[i]; });
        if (!ok) lines.push(T("ui.quiz.correctOrder", { answer: q.answer.join(", ") }));
      } else if (q.type === "multi") {
        if (!a.length) { notChecked(T("ui.quiz.pickAtLeastOne")); return; }
        var want = q.answer.slice().sort().join(",");
        ok = a.slice().sort().join(",") === want;
        if (!ok) {
          lines.push(T("ui.quiz.correctOptions", { answer: q.answer.join(", ") }));
          a.forEach(function (id) {
            if (q.answer.indexOf(id) < 0 && q.explanations && q.explanations[id]) {
              lines.push(id + ": " + q.explanations[id]);
            }
          });
        }
      } else {
        if (a === undefined) { notChecked(T("ui.quiz.pickOne")); return; }
        ok = a === q.answer;
        if (!ok) {
          if (q.explanations && q.explanations[a]) lines.push(q.explanations[a]);
          lines.push(T("ui.quiz.correctOption", { answer: q.answer }));
        }
      }
      setResult(ok, lines);
    }

    function reset() {
      clearInputs();
      clearFeedback();
      result = null;
    }

    var btn = el("button", "cft-btn", T("ui.quiz.check"));
    btn.type = "button";
    btn.addEventListener("click", check);
    box.appendChild(btn);
    return { box: box, check: check, reset: reset, result: function () { return result; } };
  }

  function renderQuiz(c, host) {
    var src = (c.params.filter(function (p) { return p[0] === "src"; })[0] || [0, "quiz.json"])[1];
    var passParam = c.params.filter(function (p) { return p[0] === "passPct"; })[0];
    var passPct = passParam ? parseFloat(passParam[1]) : NaN;
    var hasPass = !isNaN(passPct);
    var box = el("div", "cft-box cft-quiz");
    // The page wrapper already carries the language when both match. Mark the quiz only
    // when it differs, as on a translated page whose quiz still falls back to English.
    if (quizLang() !== pageLang()) box.setAttribute("lang", quizLang());
    box.appendChild(el("div", "cft-box-title", T("ui.quiz.title")));
    var status = el("p", "cft-hint", T("ui.quiz.loading"));
    box.appendChild(status);
    host.parentNode.replaceChild(box, host);
    var base = location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "");
    fetch(base + src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (qs) {
      status.remove();
      var items = [];

      if (quizLang() === "en" && pageLang() !== "en") {
        box.appendChild(el("p", "cft-hint cft-quiz-lang-note", T("ui.notice.quizFallback")));
      }

      // Score panel, shown above the questions.
      var panel = el("div", "cft-score");
      var scoreLine = el("p", "cft-score-line");
      scoreLine.setAttribute("aria-live", "polite");
      var passNote = hasPass ? el("p", "cft-hint",
        T("ui.quiz.passMark", { pct: passPct })) : null;
      var passLine = hasPass ? el("p", "cft-pass-line") : null;
      var bar = el("div", "cft-btn-row");
      var checkAll = el("button", "cft-btn", T("ui.quiz.checkAll"));
      checkAll.type = "button";
      checkAll.addEventListener("click", function () {
        items.forEach(function (it) { it.check(); });
      });
      var resetBtn = el("button", "cft-btn cft-btn-reset", T("ui.quiz.reset"));
      resetBtn.type = "button";
      resetBtn.addEventListener("click", function () {
        items.forEach(function (it) { it.reset(); });
        update();
      });
      bar.appendChild(checkAll);
      bar.appendChild(resetBtn);
      panel.appendChild(scoreLine);
      if (passNote) panel.appendChild(passNote);
      if (passLine) panel.appendChild(passLine);
      panel.appendChild(bar);
      box.appendChild(panel);

      function update() {
        var total = items.length, right = 0, done = 0;
        items.forEach(function (it) {
          var r = it.result();
          if (r !== null) { done++; if (r) right++; }
        });
        var p = total ? Math.round(right / total * 100) : 0;
        if (!done) {
          scoreLine.textContent = T(total === 1 ? "ui.quiz.notChecked.one" : "ui.quiz.notChecked.other", { total: total });
        } else {
          scoreLine.textContent = T("ui.quiz.score", { right: right, total: total, pct: p }) +
            (done < total ? " " + T("ui.quiz.checkedSoFar", { done: done, total: total }) : "");
        }
        if (passLine) {
          passLine.className = "cft-pass-line";
          if (done < total) {
            passLine.textContent = T(total === 1 ? "ui.quiz.checkAllPass.one" : "ui.quiz.checkAllPass.other", { total: total });
          } else if (p >= passPct) {
            passLine.textContent = T("ui.quiz.pass", { pct: passPct });
            passLine.className = "cft-pass-line cft-pass-yes";
          } else {
            passLine.textContent = T("ui.quiz.fail", { pct: passPct });
            passLine.className = "cft-pass-line cft-pass-no";
          }
        }
      }

      qs.forEach(function (q, i) {
        var it = renderQuestion(q, i + 1, update);
        items.push(it);
        box.appendChild(it.box);
      });
      update();
    }).catch(function () {
      status.textContent = T("ui.quiz.loadError", { src: src });
    });
  }

  function markNavLabels() {
    // The build writes labels for readers without JavaScript. Set them here as well so
    // local `mdbook serve` pages (which skip the build step) and fallback pages use the
    // same language as the page itself.
    [["previous", "ui.nav.previous"], ["next", "ui.nav.next"]].forEach(function (pair) {
      document.querySelectorAll(".mobile-nav-chapters." + pair[0]).forEach(function (a) {
        a.setAttribute("data-label", T(pair[1]));
      });
    });
  }

  function init() {
    markNavLabels();
    markVerify();
    var root = document.querySelector("main") || document.body;
    commentNodes(root).forEach(function (n) {
      var t = n.nodeValue.trim();
      var host = el("div", "cft-host");
      if (/^component:/.test(t)) {
        var c = parseComponent(t);
        n.parentNode.insertBefore(host, n);
        if (c.name === "quiz-block") renderQuiz(c, host);
        else {
          var demos = window.CFT_DEMOS || {};
          var demo = demos[c.name];
          var pr = {};
          c.params.forEach(function (x) { pr[x[0]] = x[1]; });
          try {
            if (demo) demo(pr, host);
            else showFallback(c, host, demos.__fallback);
          } catch (e) {
            // A demo that fails halfway must not leave a broken box behind.
            host.textContent = "";
            showFallback(c, host, demos.__fallback);
          }
          // Print the caption only when the demo or the placeholder has not already done so.
          var cap = pr.caption;
          if (cap && host.textContent.indexOf(cap) < 0) host.appendChild(el("p", "cft-caption", cap));
        }
      } else if (/^standing-disclaimer/.test(t)) {
        n.parentNode.insertBefore(host, n);
        var d = el("div", "cft-box cft-disclaimer", T("ui.disclaimer"));
        host.appendChild(d);
      }
    });
  }

  function markVerify() {
    var root = document.querySelector("main") || document.body;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (w.nextNode()) if (/\[VERIFY:/.test(w.currentNode.nodeValue)) nodes.push(w.currentNode);
    nodes.forEach(function (n) {
      var frag = document.createDocumentFragment();
      var parts = n.nodeValue.split(/(\[VERIFY:[^\]]*\])/);
      parts.forEach(function (p) {
        var m = p.match(/^\[VERIFY:\s*([^\]]*)\]$/);
        if (m) {
          var s = el("span", "cft-verify", T("ui.verify.label") + m[1]);
          s.title = T("ui.verify.title");
          frag.appendChild(s);
        } else if (p) frag.appendChild(document.createTextNode(p));
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
