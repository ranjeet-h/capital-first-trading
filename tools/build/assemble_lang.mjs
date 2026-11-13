// Assembles a language book: a full mdBook root made of the English source plus a
// per-language overlay, with a status for every page and quiz.
//
// The exported helpers are pure and are covered by tests/i18n/assemble.test.ts.
// The CLI at the bottom does the copying and calls the existing summary generator.
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { compileI18n, loadStrings } from "./gen_i18n_js.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, "..", "..");
export const ENGLISH_SRC = join(ROOT, "mdbook", "src");
export const I18N_DIR = join(ROOT, "mdbook", "i18n");

export const PAGE_STATUSES = new Set(["fallback", "draft", "reviewed", "confirmed", "stale"]);
export const STALE_STATUSES = new Set(["reviewed", "confirmed"]);

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function fileSha256(path) {
  return sha256(readFileSync(path));
}

function posix(path) {
  return path.split(sep).join("/");
}

export function walkFiles(root, base = root) {
  const out = [];
  if (!existsSync(root)) return out;
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) out.push(...walkFiles(path, base));
    else out.push(posix(relative(base, path)));
  }
  return out.sort();
}

export function isLabPage(rel) {
  return /^labs\/[^/]+\.md$/.test(rel) && rel !== "labs/index.md";
}

export function isGeneratedPage(rel) {
  return rel === "SUMMARY.md" || rel === "labs/index.md" || /^\d\d-[^/]+\/index\.md$/.test(rel);
}

export function isContentPage(rel) {
  return rel.endsWith(".md") && rel !== "SUMMARY.md";
}

export function readManifest(lang, i18nDir = I18N_DIR) {
  if (lang === "en") return { pages: {} };
  const path = join(i18nDir, lang, "manifest.json");
  if (!existsSync(path)) return { pages: {} };
  const data = JSON.parse(readFileSync(path, "utf8"));
  return { pages: {}, ...data };
}

export function parseMetaId(text) {
  const m = text.match(/^<!-- meta\r?\n([\s\S]*?)-->/);
  if (!m) return null;
  const id = m[1].match(/^\s*id:\s*(.+?)\s*$/m);
  return id ? id[1] : null;
}

export function parseQuizIds(text) {
  try {
    const quiz = JSON.parse(text);
    return Array.isArray(quiz) ? quiz.map((q) => q.id) : [];
  } catch {
    return [];
  }
}

export function pageStatus({ overlayExists, entry, englishHash, declared = null }) {
  if (!overlayExists) return "fallback";
  if (!entry) throw new Error("overlay has no manifest entry");
  const status = declared ?? entry.status;
  if (!PAGE_STATUSES.has(status)) throw new Error(`unknown status ${status}`);
  if (entry.sourceSha256 && entry.sourceSha256 !== englishHash) return "stale";
  return status;
}

export function noticeKey(status, lang, lab = false) {
  if (lang === "en") return null;
  if (lab) return "notice.labs";
  if (status === "fallback") return "notice.fallback";
  if (status === "draft") return "notice.draft";
  if (status === "stale") return "notice.stale";
  return null;
}

export function pageLanguage(lang, status, lab = false) {
  if (lang === "en") return "en";
  if (lab || status === "fallback") return "en";
  return lang;
}

export function validateConfig(englishToml, langToml, lang) {
  if (lang === "en") return [];
  const allowed = /^(language|title|description)\s*=/;
  const clean = (text) => text.split(/\r?\n/).filter((line) => !allowed.test(line.trim())).join("\n").trim();
  const a = clean(englishToml);
  const b = clean(langToml);
  if (a === b) return [];
  // A short diff is more useful than a boolean when a translator edits the wrong file.
  const al = a.split("\n");
  const bl = b.split("\n");
  const at = al.findIndex((line, i) => line !== bl[i]);
  return [`book.toml differs from English at line ${at + 1}: ${JSON.stringify(al[at] ?? "")} != ${JSON.stringify(bl[at] ?? "")}`];
}

export function overlayProblems({ lang, overlayRoot, englishRoot, manifest }) {
  const problems = [];
  const pages = manifest.pages || {};
  const files = walkFiles(overlayRoot);
  const overlay = new Set(files);
  for (const rel of files) {
    if (rel === "manifest.json" || rel === "strings.json") continue;
    const english = join(englishRoot, rel);
    if (!existsSync(english)) {
      problems.push(`overlay file has no English counterpart: ${rel}`);
      continue;
    }
    if (isLabPage(rel)) problems.push(`lab pages are English-only in v1: ${rel}`);
    const owner = rel.endsWith("quiz.json") ? rel.replace(/quiz\.json$/, "index.md") : rel;
    if (!pages[owner]) problems.push(`overlay file has no manifest entry: ${rel}`);
    else if (rel.endsWith("quiz.json") && !pages[owner].quiz) problems.push(`overlay quiz has no manifest quiz entry: ${rel}`);
    if (rel.endsWith(".md")) {
      const expected = parseMetaId(readFileSync(english, "utf8"));
      // The front page and other unnumbered pages have no meta block, so there is no id
      // to compare. Chapters always have one.
      if (expected !== null) {
        const id = parseMetaId(readFileSync(join(overlayRoot, rel), "utf8"));
        if (!id || id !== expected) problems.push(`${rel}: id ${JSON.stringify(id)} does not match ${JSON.stringify(expected)}`);
      }
    } else if (rel.endsWith("quiz.json")) {
      const ids = parseQuizIds(readFileSync(join(overlayRoot, rel), "utf8"));
      const expected = parseQuizIds(readFileSync(english, "utf8"));
      if (JSON.stringify(ids) !== JSON.stringify(expected)) problems.push(`${rel}: quiz ids differ from English`);
    }
  }
  for (const [rel, entry] of Object.entries(pages)) {
    if (!isContentPage(rel)) continue;
    if (!overlay.has(rel) && entry.status !== "fallback") {
      problems.push(`manifest entry has no overlay file: ${rel}`);
    }
    if (entry.quiz && entry.quiz.status !== "fallback") {
      const quiz = rel.replace(/index\.md$/, "quiz.json");
      if (!overlay.has(quiz)) problems.push(`manifest quiz entry has no overlay file: ${quiz}`);
    }
  }
  return problems;
}

// Builds the status map that the post-build step writes into every HTML page.
// rel is relative to mdbook/src and uses forward slashes.
/** @returns {Record<string, any>} */
export function buildStatusMap({ lang, manifest, englishRoot, overlayRoot }) {
  /** @type {Record<string, any>} */
  const map = {};
  for (const rel of walkFiles(englishRoot)) {
    if (!isContentPage(rel)) continue;
    const englishPath = join(englishRoot, rel);
    const englishHash = fileSha256(englishPath);
    const overlayPath = join(overlayRoot, rel);
    const overlayExists = existsSync(overlayPath);
    const entry = manifest.pages?.[rel];
    const id = parseMetaId(readFileSync(englishPath, "utf8"));

    if (lang === "en") {
      map[rel] = { page: { status: "english", lang: "en", id }, quiz: null };
      continue;
    }

    if (isGeneratedPage(rel) && !isLabPage(rel)) {
      map[rel] = { page: { status: "translated", lang, generated: true, id }, quiz: null };
      continue;
    }

    if (isLabPage(rel)) {
      map[rel] = {
        page: {
          status: "english-only",
          lang: "en",
          lab: true,
          id,
          notice: noticeKey("english-only", lang, true),
        },
        quiz: null,
      };
      continue;
    }

    let status;
    try {
      status = pageStatus({ overlayExists, entry, englishHash });
    } catch (err) {
      throw new Error(`${rel}: ${err.message}`);
    }
    const quizRel = rel === "index.md" ? "quiz.json" : rel.replace(/index\.md$/, "quiz.json");
    let quiz = null;
    if (existsSync(join(englishRoot, quizRel))) {
      const quizOverlay = existsSync(join(overlayRoot, quizRel));
      let quizStatus = "fallback";
      if (quizOverlay) {
        if (!entry?.quiz) throw new Error(`${quizRel}: overlay has no manifest quiz entry`);
        quizStatus = pageStatus({
          overlayExists: true,
          entry: entry.quiz,
          englishHash: fileSha256(join(englishRoot, quizRel)),
        });
      }
      quiz = { status: quizStatus, lang: quizStatus === "fallback" ? "en" : lang };
    }
    map[rel] = {
      page: {
        status,
        lang: pageLanguage(lang, status, false),
        notice: noticeKey(status, lang, false),
        lab: false,
        id,
      },
      quiz,
    };
  }
  return map;
}

export function htmlPathForSource(rel) {
  if (rel === "index.md") return "index.html";
  if (rel.endsWith("/index.md")) return rel.slice(0, -"index.md".length) + "index.html";
  return rel.replace(/\.md$/, ".html");
}

export function loadLanguageStrings(lang) {
  return loadStrings(lang);
}

export function assemble({ lang, out, site = "single", i18nDir = I18N_DIR, englishSrc = ENGLISH_SRC }) {
  if (!lang) throw new Error("--lang is required");
  if (!out) throw new Error("--out is required");
  out = resolve(out);
  const strings = loadStrings(lang);
  const langDir = join(i18nDir, lang);
  const overlayRoot = join(langDir, "content");
  const manifest = readManifest(lang, i18nDir);
  const bookToml = lang === "en" ? join(ROOT, "mdbook", "book.toml") : join(langDir, "book.toml");

  if (lang !== "en") {
    const problems = overlayProblems({ lang, overlayRoot, englishRoot: englishSrc, manifest });
    if (problems.length) throw new Error(`overlay problems:\n  ${problems.join("\n  ")}`);
    const configProblems = validateConfig(
      readFileSync(join(ROOT, "mdbook", "book.toml"), "utf8"),
      readFileSync(join(langDir, "book.toml"), "utf8"),
      lang,
    );
    if (configProblems.length) throw new Error(configProblems.join("\n"));
  }

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(englishSrc, join(out, "src"), { recursive: true });
  cpSync(join(ROOT, "mdbook", "theme"), join(out, "theme"), { recursive: true });

  if (lang !== "en") cpSync(overlayRoot, join(out, "src"), { recursive: true });
  cpSync(bookToml, join(out, "book.toml"));

  const manifestSrc = join(langDir, "manifest.webmanifest");
  if (existsSync(manifestSrc)) cpSync(manifestSrc, join(out, "src", "manifest.webmanifest"));

  writeFileSync(join(out, "theme", "i18n.js"), compileI18n({ lang, site }));

  const statusMap = buildStatusMap({ lang, manifest, englishRoot: englishSrc, overlayRoot: lang === "en" ? join(out, ".no-overlay") : overlayRoot });
  writeFileSync(join(out, "i18n-status.json"), JSON.stringify(statusMap, null, 2));

  const summary = spawnSync("python3", [
    join(ROOT, "tools", "build", "gen_summary.py"),
    "--lang", lang,
    "--src", join(out, "src"),
    "--strings", lang === "en" ? join(i18nDir, "strings.en.json") : join(langDir, "strings.json"),
  ], { stdio: "inherit" });
  if (summary.status !== 0) throw new Error("gen_summary.py failed");

  return { out, statusMap };
}

function parseArgs(argv) {
  const args = { lang: "en", out: null, site: "single" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--lang") args.lang = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--site") args.site = argv[++i];
    else if (a.startsWith("--")) throw new Error(`Unknown argument ${a}`);
  }
  if (!args.out) args.out = join(ROOT, ".build", args.lang);
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = assemble(args);
  console.log(`assembled ${args.lang} -> ${relative(ROOT, result.out)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(); } catch (err) { console.error(err.message); process.exit(1); }
}
