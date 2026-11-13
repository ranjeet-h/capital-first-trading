// Language switcher. The two roots come from the generated theme/i18n.js and from this
// script's own URL, never from a hard-coded "/mr/" path. That keeps the same code working
// at the site root, under /capital-first-trading/ on Pages, and in the combined test copy.
(function () {
  "use strict";
  var data = window.CFT_I18N;
  if (!data || !data.showSwitcher) return;
  var script = document.currentScript;

  function rootOf(url) {
    return new URL("../", url);
  }

  function hrefFor(other) {
    if (!script || !script.src) return null;
    var own = rootOf(script.src);
    var target = new URL(other.root, own);
    var path = location.pathname;
    if (path.indexOf(own.pathname) !== 0) return null;
    var tail = path.slice(own.pathname.length);
    return target.pathname + tail + location.search + location.hash;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function add() {
    var bar = document.querySelector(".right-buttons");
    if (!bar) return;
    var box = el("div", "cft-lang-switch");
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", window.CFT_T("ui.switcher.label", null, data.lang));
    var current = el("span", "cft-lang-current", data.name || data.lang);
    current.setAttribute("aria-current", "true");
    box.appendChild(current);
    (data.other || []).forEach(function (other) {
      var href = hrefFor(other);
      if (!href) return;
      box.appendChild(el("span", "cft-lang-sep", "|"));
      var a = el("a", "cft-lang-link", other.name || other.code);
      a.href = href;
      a.hreflang = other.code;
      a.setAttribute("aria-label", window.CFT_T("ui.switcher.label", null, data.lang) + ": " + (other.name || other.code));
      box.appendChild(a);
    });
    bar.insertBefore(box, bar.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add);
  else add();
})();
