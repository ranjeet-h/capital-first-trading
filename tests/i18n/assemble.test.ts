import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildStatusMap, htmlPathForSource, isLabPage, noticeKey, overlayProblems,
  pageLanguage, pageStatus, sha256, validateConfig,
} from "../../tools/build/assemble_lang.mjs";
import { relativeRoot } from "../../tools/build/gen_i18n_js.mjs";
import { processHtml, t as translate } from "../../tools/build/postprocess_lang.mjs";
import { fileList, workerSource } from "../../tools/build/gen_sw.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "cft-i18n-"));
  const en = join(root, "en");
  const overlay = join(root, "overlay");
  mkdirSync(join(en, "00-start-here", "01-a"), { recursive: true });
  mkdirSync(join(en, "labs"), { recursive: true });
  mkdirSync(join(overlay, "00-start-here", "01-a"), { recursive: true });
  const page = "<!-- meta\nid: T0.1\ntitle: A\npage_type: Concept\nprerequisites: []\nlabs: []\nestimated_minutes: 25\n-->\n\n# A\n\nText.\n";
  writeFileSync(join(en, "00-start-here", "01-a", "index.md"), page);
  writeFileSync(join(en, "00-start-here", "01-a", "quiz.json"), JSON.stringify([{ id: "T0.1-q1", type: "mcq", prompt: "x", options: [{ id: "a", text: "a" }], answer: "a", concepts: [], difficulty: 1, reviewAfterDays: 3, explanations: {} }]));
  writeFileSync(join(en, "labs", "cost.md"), "# Cost\n");
  writeFileSync(join(en, "index.md"), "# Home\n");
  writeFileSync(join(overlay, "00-start-here", "01-a", "index.md"), page.replace("title: A", "title: अ"));
  writeFileSync(join(overlay, "00-start-here", "01-a", "quiz.json"), JSON.stringify([{ id: "T0.1-q1", type: "mcq", prompt: "क", options: [{ id: "a", text: "अ" }], answer: "a", concepts: [], difficulty: 1, reviewAfterDays: 3, explanations: {} }]));
  return { root, en, overlay };
}

describe("assembler statuses", () => {
  it("falls back when there is no overlay", () => {
    expect(pageStatus({ overlayExists: false, entry: undefined, englishHash: "x" })).toBe("fallback");
  });

  it("uses the declared status and turns a changed source stale", () => {
    expect(pageStatus({ overlayExists: true, entry: { status: "draft", sourceSha256: "x" }, englishHash: "x" })).toBe("draft");
    expect(pageStatus({ overlayExists: true, entry: { status: "reviewed", sourceSha256: "old" }, englishHash: "new" })).toBe("stale");
  });

  it("has one notice and page-language rule", () => {
    expect(noticeKey("fallback", "mr")).toBe("notice.fallback");
    expect(noticeKey("draft", "mr")).toBe("notice.draft");
    expect(noticeKey("reviewed", "mr")).toBeNull();
    expect(noticeKey("english-only", "mr", true)).toBe("notice.labs");
    expect(pageLanguage("mr", "fallback")).toBe("en");
    expect(pageLanguage("mr", "draft")).toBe("mr");
    expect(pageLanguage("mr", "draft", true)).toBe("en");
  });

  it("treats lab pages as English-only and generated pages as translated", () => {
    const { en, overlay } = fixture();
    const hash = sha256(readFileSync(join(en, "00-start-here", "01-a", "index.md")));
    const map = buildStatusMap({
      lang: "mr",
      englishRoot: en,
      overlayRoot: overlay,
      manifest: { pages: { "00-start-here/01-a/index.md": { status: "draft", sourceSha256: hash, quiz: { status: "draft", sourceSha256: sha256(readFileSync(join(en, "00-start-here", "01-a", "quiz.json"))) } } } },
    });
    expect(isLabPage("labs/cost.md")).toBe(true);
    expect(map["labs/cost.md"].page.status).toBe("english-only");
    expect(map["labs/cost.md"].page.lang).toBe("en");
    expect(map["labs/cost.md"].page.notice).toBe("notice.labs");
  });

  it("finds orphan overlay files and id mismatches", () => {
    const { en, overlay } = fixture();
    writeFileSync(join(overlay, "orphan.md"), "# Orphan\n");
    const problems = overlayProblems({ lang: "mr", overlayRoot: overlay, englishRoot: en, manifest: { pages: { "00-start-here/01-a/index.md": { status: "draft" } } } });
    expect(problems.some((p) => p.includes("orphan.md"))).toBe(true);
    writeFileSync(join(overlay, "00-start-here/01-a/index.md"), "<!-- meta\nid: T9.9\ntitle: A\n-->\n");
    const problems2 = overlayProblems({ lang: "mr", overlayRoot: overlay, englishRoot: en, manifest: { pages: { "00-start-here/01-a/index.md": { status: "draft" } } } });
    expect(problems2.some((p) => p.includes("id"))).toBe(true);
  });

  it("keeps translated config keys only", () => {
    expect(validateConfig("[book]\ntitle = \"A\"\nlanguage = \"en\"\nsrc = \"src\"\n", "[book]\ntitle = \"अ\"\nlanguage = \"mr\"\nsrc = \"src\"\n", "mr")).toEqual([]);
    expect(validateConfig("[book]\ntitle = \"A\"\nsrc = \"src\"\n", "[book]\ntitle = \"अ\"\nsrc = \"other\"\n", "mr").length).toBe(1);
  });

  it("maps source files to HTML and computes relative language roots", () => {
    expect(htmlPathForSource("index.md")).toBe("index.html");
    expect(htmlPathForSource("a/index.md")).toBe("a/index.html");
    expect(htmlPathForSource("labs/cost.md")).toBe("labs/cost.html");
    expect(relativeRoot("mr/", "")).toBe("../");
    expect(relativeRoot("", "mr/")).toBe("mr/");
  });
});

describe("post-build step", () => {
  const strings = {
    ui: {
      nav: { previous: "मागील", next: "पुढील" },
      correction: { url: "https://x/", link: "दुरुस्ती", note: "इंटरनेट" },
      notice: { fallback: "इंग्रजी", draft: "मसुदा" },
    },
  };
  const html = "<html><head><title>x</title></head><body><main><p>Hello</p><a class=\"mobile-nav-chapters previous\" href=\"x\">p</a></main></body></html>";

  it("adds a fallback notice, wraps English and marks noindex", () => {
    const out = processHtml(html, { lang: "mr", rel: "a/index.md", status: { page: { status: "fallback", lang: "en", notice: "notice.fallback" }, quiz: null }, site: "single", strings, currentRoot: "/tmp/site" });
    expect(out).toContain('data-page-lang="en"');
    expect(out).toContain('lang="en"');
    expect(out).toContain("इंग्रजी");
    expect(out).toContain('name="robots"');
    expect(out).toContain('data-label="मागील"');
  });

  it("does not wrap a translated page", () => {
    const out = processHtml(html, { lang: "mr", rel: "a/index.md", status: { page: { status: "draft", lang: "mr", notice: "notice.draft" }, quiz: { status: "draft", lang: "mr" } }, site: "single", strings, currentRoot: "/tmp/site" });
    expect(out).toContain('data-page-lang="mr"');
    expect(out).not.toContain('lang="en"');
    expect(out).toContain("मसुदा");
  });

  it("reads flat dotted keys inside ui as well as nested keys", () => {
    const flat = {
      ui: {
        "correction.link": "दुरुस्ती",
        "correction.url": "https://x/",
        "correction.note": "इंटरनेट",
      },
      notice: { draft: "मसुदा" },
    };
    expect(translate(flat, "ui.correction.link")).toBe("दुरुस्ती");
    expect(translate(flat, "ui.notice.draft")).toBe("ui.notice.draft");
    expect(translate(flat, "notice.draft")).toBe("मसुदा");
    expect(translate(flat, "ui.correction.url", {})).toBe("https://x/");
  });
});

describe("service worker", () => {
  it("uses a language prefix and excludes the other language folder", () => {
    const src = workerSource({ version: "abc", urls: ["index.html"], lang: "en", exclude: "mr" });
    expect(src).toContain('const LANG = "en"');
    expect(src).toContain('const PREFIX = "cft-" + LANG + "-"');
    expect(src).toContain('const CACHE = PREFIX + "abc"');
    expect(src).toContain('const EXCLUDE = "mr/"');
    expect(src).toContain("OLD_UNPREFIXED");
  });

  it("lists files but not the worker or print page", () => {
    const root = mkdtempSync(join(tmpdir(), "cft-sw-"));
    mkdirSync(join(root, "mr"), { recursive: true });
    writeFileSync(join(root, "index.html"), "x");
    writeFileSync(join(root, "sw.js"), "x");
    writeFileSync(join(root, "print.html"), "x");
    writeFileSync(join(root, "mr", "index.html"), "x");
    expect(fileList(root, { exclude: ["mr"] })).toEqual(["index.html"]);
    rmSync(root, { recursive: true, force: true });
  });
});
