// Local preview of the combined book: English at / and Marathi at /mr/, with the same
// language dropdown as the published site. It rebuilds when source, theme or translation
// files change, then asks the browser to reload.
//
//   make serve-i18n
//   node tools/build/serve_combined.mjs --port 3002
//
// This is a development server only. It is not used by `make build` or `make deploy`.
import { createServer } from "node:http";
import { appendFileSync, existsSync, rmSync, statSync, watch, watchFile, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./assemble_lang.mjs";

const OUT = join(ROOT, ".dev-combined");
const WORK = join(ROOT, ".build", "dev");
const BUILD = join(ROOT, "tools", "build", "build_combined.mjs");

const RELOAD_SNIPPET = `
// Development preview only. This is added after the combined build; it is never deployed.
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (items) {
      items.forEach(function (item) { item.unregister(); });
    });
  }
  if (window.caches) {
    caches.keys().then(function (keys) {
      keys.forEach(function (key) { caches.delete(key); });
    });
  }
  if (!("EventSource" in window)) return;
  var script = document.currentScript;
  if (!script || !script.src) return;
  var source = new EventSource(new URL("../__dev/events", script.src));
  source.onmessage = function (event) {
    if (event.data === "reload") location.reload();
  };
})();
`;

// A page loaded by this server must never keep an old service worker. The real workers
// are replaced with one that unregisters itself, so a previous preview session cannot
// hide a translation change behind its cache.
const DEV_WORKER = `self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (event) {
  event.waitUntil(self.registration.unregister());
});
`;

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const clients = new Set();
let timer = null;
let building = false;
let pending = false;

function buildAll() {
  const result = spawnSync(process.execPath, [BUILD, "--out", OUT, "--work", WORK], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error("combined build failed");

  appendFileSync(join(OUT, "theme", "i18n.js"), RELOAD_SNIPPET);
  appendFileSync(join(OUT, "mr", "theme", "i18n.js"), RELOAD_SNIPPET);
  writeFileSync(join(OUT, "sw.js"), DEV_WORKER);
  writeFileSync(join(OUT, "mr", "sw.js"), DEV_WORKER);
}

function notify() {
  for (const response of clients) {
    try { response.write("data: reload\n\n"); } catch (err) { clients.delete(response); }
  }
}

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(function () {
    timer = null;
    if (building) { pending = true; return; }
    building = true;
    console.log("change detected; rebuilding the preview...");
    try {
      buildAll();
      console.log("preview rebuilt");
      notify();
    } catch (err) {
      console.error(err.message);
    } finally {
      building = false;
      if (pending) { pending = false; schedule(); }
    }
  }, 350);
}

function ignored(dir, rel) {
  rel = rel.split(sep).join("/");
  if (rel.endsWith(".DS_Store")) return true;
  if (dir === "src") {
    return rel === "SUMMARY.md" || rel === "labs/index.md" ||
      rel === "labs/bt-worker.js" || rel.startsWith("labs/downloads/");
  }
  if (dir === "theme") return rel === "i18n.js" || rel.startsWith("dist/");
  return false;
}

function watchTree(name) {
  const dir = join(ROOT, "mdbook", name);
  if (!existsSync(dir)) return;
  watch(dir, { recursive: true }, function (event, file) {
    if (file && ignored(name, String(file))) return;
    schedule();
  });
}

function contentType(file) {
  return MIME[extname(file).toLowerCase()] || "application/octet-stream";
}

async function sendFile(response, file, status = 200) {
  try {
    const body = await readFile(file);
    response.writeHead(status, {
      "Content-Type": contentType(file),
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch (err) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Could not read the preview file.");
  }
}

function events(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-store",
    "Connection": "keep-alive",
  });
  response.write("retry: 1000\n\n");
  clients.add(response);
  request.on("close", function () { clients.delete(response); });
}

function serverFor(port) {
  return createServer(async function (request, response) {
    let url;
    try {
      url = new URL(request.url, "http://localhost");
    } catch (err) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request.");
      return;
    }

    if (url.pathname === "/__dev/events" || url.pathname.endsWith("/__dev/events")) {
      events(request, response);
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch (err) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request.");
      return;
    }

    let file = resolve(OUT, "." + pathname);
    if (file !== OUT && !file.startsWith(OUT + sep)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not allowed.");
      return;
    }

    let info;
    try {
      info = statSync(file);
    } catch (err) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found.");
      return;
    }

    if (info.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: url.pathname + "/" });
        response.end();
        return;
      }
      file = join(file, "index.html");
      try {
        info = statSync(file);
      } catch (err) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found.");
        return;
      }
    }

    await sendFile(response, file);
  }).listen(port, "127.0.0.1");
}

function main() {
  const args = process.argv.slice(2);
  let port = Number(process.env.PREVIEW_PORT || 3002);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port") port = Number(args[++i]);
    else if (args[i].startsWith("--")) throw new Error(`Unknown argument ${args[i]}`);
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("invalid port");

  buildAll();
  watchTree("src");
  watchTree("theme");
  watchTree("i18n");
  watchFile(join(ROOT, "mdbook", "book.toml"), { interval: 500 }, schedule);

  const server = serverFor(port);
  server.on("error", function (err) {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} is busy. Try: make serve-i18n PREVIEW_PORT=3003`);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });
  server.on("listening", function () {
    console.log(`Combined preview: http://localhost:${port}/`);
    console.log(`Marathi:          http://localhost:${port}/mr/`);
    console.log("Watching mdbook/src, mdbook/theme and mdbook/i18n.");
  });
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
