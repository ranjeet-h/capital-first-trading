// Makes the whole book work with no network after the first visit.
(function () {
  if (!("serviceWorker" in navigator)) return;
  var here = document.currentScript && document.currentScript.src;
  if (!here) return;
  var sw = new URL("../sw.js", here).href;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(sw).catch(function () { /* offline mode is a bonus; the book still works online */ });
  });
})();
