(function () {
  "use strict";

  // Finds <!-- component: name | key: value ... --> comments in the rendered chapter
  // and replaces them with a live quiz (quiz-block) or a labelled placeholder box.

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
    box.appendChild(el("div", "cft-box-title", "Interactive component: " + c.name));
    var cap = c.params.filter(function (p) { return p[0] === "caption"; })[0];
    if (cap) box.appendChild(el("p", "cft-caption", cap[1]));
    var rest = c.params.filter(function (p) { return p[0] !== "caption"; });
    if (rest.length) {
      box.appendChild(el("div", "cft-params",
        "Planned inputs: " + rest.map(function (p) { return p[0] + " = " + p[1]; }).join(", ")));
    }
    box.appendChild(el("div", "cft-note", "Not built yet. It arrives in a later milestone."));
    return box;
  }

  function addFeedback(box, ok, lines) {
    var old = box.querySelector(".cft-feedback");
    if (old) old.remove();
    var f = el("div", "cft-feedback " + (ok ? "cft-ok" : "cft-bad"));
    f.appendChild(el("strong", null, ok ? "Correct. " : "Not quite. "));
    lines.forEach(function (l) { f.appendChild(el("div", null, l)); });
    box.appendChild(f);
  }

  function renderQuestion(q, n) {
    var box = el("div", "cft-q");
    var head = el("div", "cft-q-head");
    head.appendChild(el("span", "cft-q-n", "Q" + n));
    head.appendChild(el("span", "cft-q-type", q.type));
    box.appendChild(head);
    box.appendChild(el("p", "cft-q-prompt", q.prompt));

    var getAnswer;
    var name = "q-" + q.id + "-" + Math.random().toString(36).slice(2, 7);

    if (q.type === "numeric") {
      var inp = el("input", "cft-num");
      inp.type = "text";
      inp.setAttribute("inputmode", "decimal");
      inp.placeholder = "Your answer" + (q.unit ? " (" + q.unit + ")" : "");
      box.appendChild(inp);
      getAnswer = function () { return inp.value.trim(); };
    } else if (q.type === "order") {
      box.appendChild(el("p", "cft-hint", "Type the option letters in the correct order, e.g. b, a, c."));
      var list = el("ul", "cft-opts");
      (q.options || []).forEach(function (o) {
        list.appendChild(el("li", null, o.id + ") " + o.text));
      });
      box.appendChild(list);
      var oinp = el("input", "cft-num");
      oinp.type = "text";
      oinp.placeholder = "e.g. b, a, c";
      box.appendChild(oinp);
      getAnswer = function () {
        return oinp.value.split(/[\s,]+/).filter(Boolean).map(function (s) { return s.toLowerCase(); });
      };
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
    }

    var btn = el("button", "cft-btn", "Check");
    btn.type = "button";
    btn.addEventListener("click", function () {
      var a = getAnswer();
      var ok, lines = [];
      if (q.type === "numeric") {
        var v = parseFloat(String(a).replace(/[,\s]/g, ""));
        if (isNaN(v)) { addFeedback(box, false, ["Enter a number."]); return; }
        ok = Math.abs(v - q.answer) <= (q.tolerance || 0);
        if (!ok) lines.push("Expected " + q.answer + (q.unit ? " " + q.unit : "") + ".");
        if (q.solution) lines.push(q.solution);
      } else if (q.type === "order") {
        ok = a.length === q.answer.length && a.every(function (x, i) { return x === q.answer[i]; });
        if (!ok) lines.push("Correct order: " + q.answer.join(", ") + ".");
      } else if (q.type === "multi") {
        var want = q.answer.slice().sort().join(",");
        ok = a.slice().sort().join(",") === want;
        if (!ok) {
          lines.push("Correct options: " + q.answer.join(", ") + ".");
          a.forEach(function (id) {
            if (q.answer.indexOf(id) < 0 && q.explanations && q.explanations[id]) {
              lines.push(id + ": " + q.explanations[id]);
            }
          });
        }
      } else {
        if (a === undefined) { addFeedback(box, false, ["Pick an option."]); return; }
        ok = a === q.answer;
        if (!ok) {
          if (q.explanations && q.explanations[a]) lines.push(q.explanations[a]);
          lines.push("Correct option: " + q.answer + ".");
        }
      }
      addFeedback(box, ok, lines);
    });
    box.appendChild(btn);
    return box;
  }

  function renderQuiz(c, host) {
    var src = (c.params.filter(function (p) { return p[0] === "src"; })[0] || [0, "quiz.json"])[1];
    var box = el("div", "cft-box cft-quiz");
    box.appendChild(el("div", "cft-box-title", "Quiz"));
    var status = el("p", "cft-hint", "Loading quiz...");
    box.appendChild(status);
    host.parentNode.replaceChild(box, host);
    var base = location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "");
    fetch(base + src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (qs) {
      status.remove();
      qs.forEach(function (q, i) { box.appendChild(renderQuestion(q, i + 1)); });
    }).catch(function () {
      status.textContent = "Could not load " + src + ". Run the book with `mdbook serve` (a local web server); opening the HTML file directly blocks loading.";
    });
  }

  function init() {
    var root = document.querySelector("main") || document.body;
    commentNodes(root).forEach(function (n) {
      var t = n.nodeValue.trim();
      var host = el("div", "cft-host");
      if (/^component:/.test(t)) {
        var c = parseComponent(t);
        n.parentNode.insertBefore(host, n);
        if (c.name === "quiz-block") renderQuiz(c, host);
        else host.appendChild(placeholder(c));
      } else if (/^standing-disclaimer/.test(t)) {
        n.parentNode.insertBefore(host, n);
        var d = el("div", "cft-box cft-disclaimer",
          "Education only. Not investment advice. Standing disclaimer wording is pending owner approval.");
        host.appendChild(d);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
