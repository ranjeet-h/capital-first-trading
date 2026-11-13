(function () {
  "use strict";

  function currentTheme() {
    return document.documentElement.classList.contains("navy")
      ? "dark"
      : "default";
  }

  function T(key, vars) {
    var main = document.querySelector("main");
    var lang = (main && main.getAttribute("data-page-lang")) ||
      document.documentElement.lang || "en";
    return window.CFT_T ? window.CFT_T(key, vars, lang) : "Diagram";
  }

  // Each diagram gets its own accessible name. Prefer a nearby "Figure ..." or
  // "Diagram ..." caption; otherwise use the heading above it.
  function labelFor(container) {
    var next = container.nextElementSibling;
    if (next && /^(figure|diagram|चित्र)/i.test(next.textContent.trim())) {
      return T("ui.mermaid.aria.caption", { caption: next.textContent.trim() });
    }
    var node = container.previousElementSibling;
    while (node) {
      if (/^H[1-6]$/.test(node.tagName)) {
        return T("ui.mermaid.aria.caption", { caption: node.textContent.trim() });
      }
      node = node.previousElementSibling;
    }
    return T("ui.mermaid.aria");
  }

  function renderMermaid() {
    if (!window.mermaid) {
      return;
    }

    var blocks = Array.from(
      document.querySelectorAll("pre > code.language-mermaid")
    );

    if (blocks.length === 0) {
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: currentTheme(),
    });

    blocks.forEach(function (code, index) {
      var container = document.createElement("div");
      container.className = "mermaid-diagram";
      container.setAttribute("role", "img");
      container.setAttribute("aria-label", labelFor(code.parentElement));
      container.textContent = code.textContent;
      container.dataset.mermaidSource = code.textContent;
      code.parentElement.replaceWith(container);
      container.dataset.mermaidId = "diagram-" + index;
    });

    window.mermaid.run({
      querySelector: ".mermaid-diagram",
    });
  }

  function rerenderForTheme() {
    var diagrams = Array.from(document.querySelectorAll(".mermaid-diagram"));
    if (diagrams.length === 0) {
      return;
    }

    diagrams.forEach(function (diagram) {
      diagram.textContent = diagram.dataset.mermaidSource;
    });

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: currentTheme(),
    });
    window.mermaid.run({
      querySelector: ".mermaid-diagram",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaid);
  } else {
    renderMermaid();
  }

  new MutationObserver(rerenderForTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
