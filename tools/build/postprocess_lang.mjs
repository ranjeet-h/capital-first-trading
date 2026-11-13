// After mdBook builds: add per-page language metadata, build-time notices, noindex and
// hreflang links. The work is done here, not at runtime, so a page still reads correctly
// with JavaScript off and the book stays offline.
//
// Usage (single language):
//   node tools/build/postprocess_lang.mjs --root .build/mr/book --lang mr \
//     --status .build/mr/i18n-status.json --strings mdbook/i18n/mr/strings.json
// Usage (combined fixture): add --site combined --other-root <other book root>
//   --other-status <other i18n-status.json>
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { loadStrings } from "./gen_i18n_js.mjs";

export function t(strings, key, vars) {
  let value = strings;
  const parts = key.split(".");
  for (let i = 0; i < parts.length; i++) {
    if (value == null) break;
    const rest = parts.slice(i).join(".");
    if (typeof value === "object" && Object.prototype.hasOwnProperty.call(value, rest)) {
      value = value[rest];
      break;
    }
    value = value[parts[i]];
  }
  if (typeof value !== "string") value = key;
  if (!vars) return value;
  return value.replace(/\{([a-zA-Z0-9_]+)\}/g, (all, name) => (
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : all
  ));
}

export function htmlPathForSource(rel) {
  if (rel === "index.md") return "index.html";
  if (rel.endsWith("/index.md")) return rel.slice(0, -"index.md".length) + "index.html";
  return rel.replace(/\.md$/, ".html");
}

export function sourcePathForHtml(rel) {
  if (rel === "index.html") return "index.md";
  if (rel.endsWith("/index.html")) return rel.slice(0, -"index.html".length) + "index.md";
  return rel.replace(/\.html$/, ".md");
}

export function isNoindex(status) {
  return ["fallback", "draft", "stale", "english-only"].includes(status);
}

export function shouldLinkAlternate(status) {
  return !["fallback", "english-only", undefined, null].includes(status);
}

function setAttr(tag, name, value) {
  const attr = `${name}="${value}"`;
  const re = new RegExp(`\\s${name}="[^"]*"`);
  if (re.test(tag)) return tag.replace(re, ` ${attr}`);
  return tag.replace(/>$/, ` ${attr}>`);
}

export function addHead(html, tag) {
  if (html.includes(tag)) return html;
  return html.replace(/<\/head>/i, `        ${tag}\n    </head>`);
}

export function relativeHref(fromFile, toFile) {
  const rel = relative(dirname(fromFile), toFile).split(sep).join("/");
  return rel || toFile.split(sep).pop();
}

export function processHtml(html, {
  lang, rel, status, otherStatus = null, otherRoot = null, currentRoot, site = "single", strings,
}) {
  if (!status) return html;
  const page = status.page;
  if (!page) return html;
  const quizLang = status.quiz?.lang || page.lang;
  const mainRe = /<main(\s[^>]*)?>/i;
  const match = html.match(mainRe);
  if (!match) return html;
  let mainTag = match[0];
  mainTag = setAttr(mainTag, "data-page-lang", page.lang);
  mainTag = setAttr(mainTag, "data-quiz-lang", quizLang);
  html = html.replace(mainRe, mainTag);

  let inner = "";
  const noticeKey = page.notice;
  if (noticeKey) {
    const text = t(strings, `ui.${noticeKey}`);
    inner += `\n<div class="cft-lang-notice cft-lang-notice-${page.status}${page.lab ? " cft-lang-notice-labs" : ""}" role="note">${escapeHtml(text)}</div>`;
  }
  if (page.lang === "en" && lang !== "en") {
    inner += `\n<div lang="en" class="cft-lang-en">`;
  }

  const mainClose = html.lastIndexOf("</main>");
  if (mainClose < 0) return html;
  let before = html.slice(0, match.index + mainTag.length);
  let body = html.slice(match.index + mainTag.length, mainClose);
  const after = html.slice(mainClose);
  if (inner) body = inner + body;
  if (page.lang === "en" && lang !== "en") body += "\n</div>";
  html = before + body + after;

  if (isNoindex(page.status)) {
    html = addHead(html, `<meta name="robots" content="noindex">`);
  }

  if (site === "combined" && otherStatus && shouldLinkAlternate(page.status)) {
    const otherPage = otherStatus.page;
    if (otherPage && shouldLinkAlternate(otherPage.status)) {
      const thisHtml = htmlPathForSource(rel);
      const otherHtml = htmlPathForSource(rel);
      const thisFile = join(currentRoot, thisHtml);
      const otherFile = join(otherRoot, otherHtml);
      const href = relativeHref(thisFile, otherFile);
      const otherLang = otherPage.lang === lang ? (lang === "en" ? "mr" : "en") : otherPage.lang;
      const tags = [
        `<link rel="alternate" hreflang="${otherLang}" href="${escapeHtml(href)}">`,
        `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(relativeHref(thisFile, thisFile))}">`,
        `<link rel="alternate" hreflang="x-default" href="${escapeHtml(lang === "en" ? relativeHref(thisFile, thisFile) : href)}">`,
      ];
      for (const tag of tags) html = addHead(html, tag);
    }
  }

  // CSS cannot translate a content string. The label travels as data for the shared
  // stylesheet, so one rule works in every language.
  html = html.replace(/<a\b([^>]*\bclass="([^"]*\bmobile-nav-chapters\b[^"]*)")/g, (all, attrs, cls) => {
    if (/\bdata-label="/.test(attrs)) return all;
    const label = /\bprevious\b/.test(cls) ? t(strings, "ui.nav.previous") : t(strings, "ui.nav.next");
    return `<a${attrs} data-label="${escapeHtml(label)}"`;
  });

  // A small correction link on translated pages. The link itself needs internet; the
  // page says so, and the book still works offline.
  if (lang !== "en" && !page.generated && !["fallback", "english-only"].includes(page.status)) {
    const url = t(strings, "ui.correction.url");
    const id = page.id || rel;
    const title = encodeURIComponent(`[${lang}] ${id}`);
    const bodyText = encodeURIComponent(`Page: ${htmlPathForSource(rel)}\n\nWhat is wrong (sentence and better wording):\n`);
    const href = `${url}&title=${title}&body=${bodyText}`;
    const footer = `\n<footer class="cft-correction"><a href="${escapeHtml(href)}" rel="noopener">${escapeHtml(t(strings, "ui.correction.link"))}</a> <span>${escapeHtml(t(strings, "ui.correction.note"))}</span></footer>`;
    html = html.replace(/<\/main>/i, `${footer}\n</main>`);
  }

  return html;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function walkHtml(root, base = root, skip = []) {
  const out = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) {
      if (skip.includes(name)) continue;
      out.push(...walkHtml(path, base, skip));
    } else if (name.endsWith(".html")) {
      out.push(relative(base, path).split(sep).join("/"));
    }
  }
  return out.sort();
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function parseArgs(argv) {
  const args = { lang: "en", site: "single", skip: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") args.root = argv[++i];
    else if (a === "--lang") args.lang = argv[++i];
    else if (a === "--status") args.status = argv[++i];
    else if (a === "--strings") args.strings = argv[++i];
    else if (a === "--site") args.site = argv[++i];
    else if (a === "--other-root") args.otherRoot = argv[++i];
    else if (a === "--other-status") args.otherStatus = argv[++i];
    else if (a === "--skip") args.skip.push(argv[++i]);
    else if (a.startsWith("--")) throw new Error(`Unknown argument ${a}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.root) throw new Error("--root is required");
  const root = resolve(args.root);
  const strings = args.strings ? readJson(args.strings) : loadStrings(args.lang);
  const statusMap = args.status && existsSync(args.status) ? readJson(args.status) : null;
  const otherStatus = args.otherStatus && existsSync(args.otherStatus) ? readJson(args.otherStatus) : null;
  const defaultEnglish = { page: { status: "english", lang: "en" }, quiz: null };
  const otherRoot = args.otherRoot ? resolve(args.otherRoot) : null;
  const skip = args.site === "combined" && args.lang === "en" ? [...new Set([...args.skip, "mr"])] : args.skip;

  let changed = 0;
  for (const rel of walkHtml(root, root, skip)) {
    if (rel === "404.html" || rel === "print.html") continue;
    const source = sourcePathForHtml(rel);
    const status = statusMap ? statusMap[source] : (args.lang === "en" ? defaultEnglish : null);
    if (!status) continue;
    const path = join(root, rel);
    const before = readFileSync(path, "utf8");
    const after = processHtml(before, {
      lang: args.lang,
      rel: source,
      status,
      otherStatus: otherStatus?.[source],
      otherRoot,
      currentRoot: root,
      site: args.site,
      strings,
    });
    if (after !== before) {
      writeFileSync(path, after);
      changed++;
    }
  }
  console.log(`postprocessed ${changed} ${args.lang} pages`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try { main(); } catch (err) { console.error(err.message); process.exit(1); }
}
