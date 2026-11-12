// The Labs section in the side menu starts closed on every page, including lab pages.
// mdBook opens the section of the page you are on; this closes Labs again, once, after it does.
(function () {
  var done = false;
  function collapseLabs() {
    if (done) return;
    var items = document.querySelectorAll("li.chapter-item");
    for (var i = 0; i < items.length; i++) {
      var a = items[i].querySelector(":scope > a, :scope > span > a");
      if (a && /(^|\/)labs\/index\.html$/.test(a.getAttribute("href") || "")) { items[i].classList.remove("expanded"); done = true; return; }
    }
  }
  function run() { collapseLabs(); setTimeout(collapseLabs, 50); setTimeout(collapseLabs, 300); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
