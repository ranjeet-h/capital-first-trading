# Capital-First Trading — Multi-Language Plan (translation_v1)

Status: revised twice (repo review 2026-11-12, then a second review of seams). Nothing is
built yet. English is the source of truth in `mdbook/src/`. Marathi comes first; other
languages follow the same pattern.

## Decisions already made with the maintainer

- **Scope for v1:** chapters, quizzes, the front page, generated pages, and **every
  reader-facing string produced by shared theme code** (see the string inventory in
  mechanism 11). Labs (web components), other demos and the forward-test tool stay English.
- **Missing translations:** fall back to English. The book is always complete.
- **Site layout:** one site, language subpaths. English at the site root, Marathi in an
  `mr/` folder below it. On GitHub Pages that is `/capital-first-trading/` and
  `/capital-first-trading/mr/`. **No code may hard-code `/mr/`** (mechanism 6).
- **Workflow:** LLM-drafted, human-reviewed against a fixed glossary.
- **Reviewer:** the maintainer reviews the glossary and chapters. Readers then send
  corrections and the translation improves gradually; that is why the book is open source.
- **Status levels (one definition, used everywhere):** `draft` (LLM output, not read by the
  maintainer), `reviewed` (maintainer read and fixed it), `confirmed` (a reader correction
  was checked and merged, or a second reader verified it), `stale` (the English source
  changed after the translation was stamped). The 1-in-5 spot check is **extra QA on
  top of** the maintainer's pass for risky topics, not a replacement for reviewing.

## Core approach

English stays the **only hand-edited source**. Each other language is an **overlay**:
files that mirror the English tree and contain only what is translated. At build time a
per-language book is assembled (English copy + overlay on top) and built with mdBook.
mdBook has no usable i18n plugin, so we do not rely on one. Untranslated pages are the
English copy with a visible notice, so Marathi can ship early and fill in gradually.

## Target structure

```
mdbook/
  src/                       # English, unchanged, canonical
  i18n/mr/
    content/                 # overlay of src/: only translated files, same relative paths
      index.md               # front page (translated or fallback)
      00-start-here/01-what-trading-is-and-is-not/{index.md,quiz.json}
    manifest.json            # per page: source hashes (SHA-256), status, reviewer, date
    strings.json             # all UI strings, with templates (mechanism 11)
    book.toml                # FULL config (mdBook does not merge TOML), see below
    manifest.webmanifest     # translated PWA name/description
  book.toml                  # English config
  theme/                     # shared; adds lang-switch.js/css, i18n.js (generated), Devanagari fonts
tools/build/
  assemble_lang.mjs          # NEW: builds .build/<lang>/ (mechanism 2)
  gen_i18n_js.mjs            # NEW: compiles strings.json into theme/i18n.js (mechanism 11)
  gen_summary.py             # --lang, --out; sentences from strings.json
  gen_sw.mjs                 # --lang, prefix, scope-relative checks, exclude other-language folders
  deploy.sh                  # builds EN at root and MR in mr/ into .pages-build/
tools/check/
  check_chapters.py          # --lang, --root; parity + completeness (mechanisms 4, 5)
  i18n_status.py             # NEW: translated / reviewed / confirmed / stale / fallback counts
tools/i18n/
  extract_terms.py           # NEW: glossary seed from the English book
tests/i18n/                  # assembler and parity unit tests (vitest include is extended)
docs/i18n/{glossary-mr.md, CONTRIBUTORS.md}
CONTRIBUTING-i18n.md
```

**Layout rule.** `i18n/mr/content/` maps to `.build/mr/src/`. `manifest.json`,
`strings.json` and `manifest.webmanifest` are metadata and are never copied into `src/`.
`i18n/mr/book.toml` is the **whole** Marathi config (copied from English, then
`language`, `title`, `description` changed). It keeps `additional-js`, `additional-css`,
`head.hbs`, search and every other setting, because mdBook does not merge partial TOML.
`check` fails if the two configs differ in anything but the translated keys.

The assembled folder is a full mdBook root: `.build/mr/{book.toml, src/, theme/}`.
`theme/` (including generated `theme/dist/labs.js` and `theme/i18n.js`) is copied in, and
generated files under `src/labs/` (downloads, `bt-worker.js`) come along with the English
copy.

## Key mechanisms

1. **Chapter IDs are the cross-language key.** Every chapter has `id: T0.1` in its
   `<!-- meta` block and quizzes use `T0.1-q1`. Overlay files keep the same ids and the
   same folder slugs. URLs stay English slugs on purpose, so links never break.

2. **Assembly with per-page language status.** `assemble_lang.mjs` copies `src/` to
   `.build/mr/src/`, overlays `i18n/mr/content/`, and gives **every page and every quiz a
   status** from the manifest: `translated`, `draft`, `stale` or `fallback`. Labs pages
   get a fifth kind, `english-only` (never planned for translation). It then:
   - inserts a **notice into the page** at build time: fallback ("Not yet translated.
     Showing English."), draft ("Draft translation, not yet reviewed. English is the
     reference."), stale ("The English page has changed. This translation may be out of
     date."), and for labs a separate, calmer "This tool is in English for now.";
   - wraps fallback and english-only body content in `<div lang="en">` and writes
     `data-page-lang` / `data-quiz-lang` on the page (`mr` or `en`). This is the **per-page
     language**: it drives which strings the shared JS uses (mechanism 11) and lets screen
     readers pronounce English text correctly. `<html lang>` is never used to decide;
   - fails the build on an overlay file with no English counterpart or a mismatched `id`;
   - adds `<meta name="robots" content="noindex">` to fallback and draft pages (they
     duplicate English), and `hreflang` alternate links between each English page and its
     Marathi page when the Marathi page is translated.

3. **Per-language generated pages.** `gen_summary.py` gets `--lang` and `--out`. Track
   landing pages and `labs/index.md` are **strings-only**: sentences come from
   `strings.json`, titles from overlay front matter when translated, else English. The
   labs index is translated (it is navigation); the labs themselves stay English with the
   `english-only` notice. The front page `index.md` is a first-class page: it has a
   manifest entry, status and parity checks, and goes into Phase 1.

4. **Parity checks against English** (`check_chapters.py --lang mr`). Keep today's
   structure checks and add:
   - same `id`; the H1 equals the `title` in the meta block; all other meta fields
     (`page_type`, `prerequisites`, `labs`, `estimated_minutes`) identical to English;
   - **real heading parsing**: only line-start `^#{2,3} ` lines, ignoring fenced code
     blocks, compared by order and count; translated text allowed;
   - same sequence of `<!-- component: ... -->` markers, and **all component parameters
     identical except `caption`** (a translated `src` or `passPct` would break the quiz);
   - **numbers, URLs and dates identical** (multiset compare of digit sequences, rupee
     amounts and URLs; Western digits mandatory);
   - quiz parity: preserve `id`, `type`, `answer`, `tolerance`, `unit`, `concepts`,
     `difficulty`, `reviewAfterDays`, option ids and order, question order and explanation
     keys. Only `prompt`, option text, `explanation` and `solution` text may differ;
   - Marathi banned-phrase list (assured-return and risk-free wording) plus the English one;
   - `[VERIFY` count not lower than English;
   - glossary consistency (see quality plan), with allowlists for code, URLs and
     boilerplate so it does not produce noise.
   Hash: **SHA-256**, the same as `gen_sw.mjs`. The comparison logic starts from
   `tools/check/compare_to_head.py`, which already has the right key list.

5. **Completeness gate (catches silently dropped content).** Parity of numbers and ids is
   not enough, because an LLM can drop a paragraph with no number in it. The checker also
   compares, per page: paragraph count, list-item count, table-row count and blockquote
   count (each within a small stated tolerance, default exact for tables and lists);
   fenced code and Mermaid blocks equal except their label text; and a Marathi to
   English word-count ratio inside a sane band (flag, not fail, outside it). `## Limits and
   common mistakes` and `## Remember` must match item for item. Mermaid labels are
   translated by rule: node text may change, node ids, arrows and structure may not.

6. **Paths, build, test and deploy per language.**
   - The Makefile variable is **`BOOK_LANG`** (default `en`), not `LANG` (a standard shell
     variable that make imports).
   - Targets: `make build|serve|check|e2e BOOK_LANG=mr`, `make i18n-status`,
     `make i18n-stamp ID=T0.1`, `make i18n-new BOOK_LANG=<code>`; all in `.PHONY`.
     `make clean` removes `.build/`, `.e2e-book-mr/` and `.e2e-combined/`.
   - **No absolute `/mr/` anywhere.** Everything is relative to the site root derived from
     the script or service-worker location (`new URL("mr/", self.registration.scope)`).
     Reason: Pages serves the site under `/capital-first-trading/`, and locally the
     Marathi book is its own root.
   - **Combined fixture.** The assembled single-language roots are for editing. All
     deploy-shape tests (switcher, service-worker scope, offline) run against a **combined
     fixture** built the same way as `deploy.sh`: English at `/`, Marathi at `/mr/`,
     served as `.e2e-combined/` on its own port. `deploy.sh` builds the same tree into
     `.pages-build/`.
   - `make serve BOOK_LANG=mr` serves `.build/mr` (port 3001). Because it does not watch
     `mdbook/i18n/mr/`, the target runs a small watcher that re-assembles on change (or,
     if that proves flaky, documents a restart). Never kill the user's `mdbook serve`.

7. **Language switcher.** `theme/lang-switch.js` shows "English | मराठी" in the menu bar.
   It derives the two language roots from its own script URL, swaps the root prefix and
   keeps the rest of the URL (deep pages, `index.html`, the root page, query string and
   hash). It is hidden on `localhost` / `127.0.0.1` single-language serves (decided by a
   build flag written into `theme/i18n.js`, never by probing the network), and visible on
   the combined fixture and on Pages.

8. **Service workers must not collide.**
   - Cache prefixes `cft-en-<hash>` and `cft-mr-<hash>`; each worker deletes only its own
     prefix. A **one-time cleanup** in the new English worker also deletes the old
     `cft-<hash>` (unprefixed) caches so existing readers do not keep a stale 13 MB copy.
   - The English `gen_sw` walk **excludes `mr/`**; the English fetch handler returns early
     for any URL under `new URL("mr/", self.registration.scope)` (scope-relative, so it
     works under `/capital-first-trading/`). The Marathi worker never caches English paths.
   - `mr/sw.js` has the narrower scope `mr/`. `register-sw.js` resolves `../sw.js` from its
     own script URL, so it already points at the right file; do not change that.
   - Size: two full books are about 26 MB. After Phase 0, measure quota and eviction on a
     real phone. If a problem shows, do not cache the search index twice (share it) or
     cache only what the reader opens.

9. **Devanagari rendering, offline-safe.** No CDN fonts. System stack (`Noto Sans
   Devanagari`, `Nirmala UI`, `Devanagari Sangam MN`, then `system-ui`), line height about
   1.7. Optionally bundle one open font later. Headings, tables and the 16px /
   no-horizontal-scroll rules stay. Devanagari heading ids in mdBook are tested in Phase 1.
   Because translated headings change heading ids, **no `](#...)` anchors are used in
   chapters** (there are none today); if one is ever added it must use an explicit id.

10. **Quizzes** are overlay `quiz.json` files with the same ids and fetch paths. `q.unit`
    stays in the same language as the prompt and the numeric check never reads the unit
    text. `q.type` labels (scenario, mcq, numeric...) come from the dictionary, and a
    "Q1" prefix has a Marathi form.

11. **Full UI-string inventory, not quiz-only.** The inventory is built in Phase 0 by
    searching the shared theme code and CSS for reader-visible text, then every item gets a
    key in `strings.json`:
    - **Standing disclaimer** and its pass-mark note (`components.js`, generated in JS, so
      translating the Markdown marker cannot change it). **This is first**, a safety
      message, and ships with Phase 1 at the latest;
    - `[VERIFY` chips and their tooltip: decision, the label is translated, the checked
      fact text itself stays as written in the chapter;
    - quiz: raw type labels, placeholders ("Enter a number"), "Expected ...", "Correct
      option(s)", "Pass mark ...", "Not checked yet", "Check", "Reset quiz", "Correct.",
      "Not quite.", loading and error messages;
    - CSS-added navigation text ("Previous", "Next", from `components.css`): moved into the
      dictionary through a `data-` attribute or generated CSS, not left as a CSS `content`
      literal;
    - Mermaid container `aria-label` (`mermaid-init.js` currently says "Agentic AI
      engineering diagram" for every diagram, which is wrong in English too): fixed to use
      each diagram's own caption in both languages;
    - switcher, notices, correction link, track names, labs index sentences, PWA name.
    Delivery: `gen_i18n_js.mjs` compiles `strings.json` into one `theme/i18n.js` per built
    book (shared `components.js` cannot read the overlay file at runtime and no network
    call is allowed). Messages that carry numbers are **templates with named slots** ("{n}
    of {total} correct ({pct}%)", pass and fail sentences, plural forms where needed).
    Numbers are formatted by hand, **never `Intl.NumberFormat("mr-IN")`**, so digits stay
    Western. The JS picks strings from the page's `data-page-lang` / `data-quiz-lang`,
    with English as default.
    **Digit input:** quiz number fields normalise Devanagari and Arabic-Indic digits to
    Western before `parseFloat`; stored answers stay Western.
    mdBook's own chrome (search placeholder, "Toggle sidebar") stays English, said so on the
    Marathi front page.

12. **English is authoritative.** The disclaimer and every dated fact are translated, but
    each Marathi page links to the English page, and the notice on the Marathi front page
    says English governs if the two ever differ. The PWA manifest carries the translated
    name and description for the Marathi book.

13. **Stale translations cannot look reviewed.** A change in the English source after a
    stamp turns that page to `stale` automatically (the build recomputes SHA-256), and the
    stale notice shows. `make deploy` **refuses** to publish while any `reviewed` or
    `confirmed` page is stale unless `ALLOW_STALE=1` is passed on purpose.
    `make i18n-stamp ID=T0.1` requires a reviewer name and date and updates both the
    chapter hash and the quiz hash.

## Translation workflow (LLM-drafted, human-reviewed)

1. Write `docs/i18n/glossary-mr.md` first. Rules: Rs and paise stay as written; **Western
   digits only**; keep NSE, BSE, SEBI, Kite, ETF and similar names in Latin script; keep
   lab button and field names in English with a Marathi explanation in brackets; plain,
   short sentences like the English book; never write "assured", "sure" or "risk-free"
   wording that the English book bans.
2. For each chapter: an LLM drafts from the English file plus the glossary (per project
   practice, large prose goes to Haiku 5.5 subagents; the pilot checks that its Marathi is
   good enough and decides the model for the rest). Saved as the overlay with
   `status: draft`.
3. The maintainer reads it in the built page and fixes it, then it is stamped `reviewed`
   with a name and date. Drafts may be published any time with the draft notice. Reader
   corrections later are small pull requests or issues.
4. `make check BOOK_LANG=mr` must pass.
5. Order: pilot one chapter, then tracks 00 to 10. Risky topics (derivatives, tax, costs,
   leverage) get a second look even after the pilot.

## What makes the translation good (quality plan)

1. **A real glossary, built from the book.** `tools/i18n/extract_terms.py` lists every bold
   term, heading word and repeated phrase with the chapter ids where it appears. The
   first glossary is drafted from that list, then the maintainer fixes it once. About 150
   to 250 terms. Each entry has the Marathi form, whether the English word is kept in
   brackets on first use, and a note on when not to use it. Changes to the glossary go
   through a pull request and trigger a re-check of the pages that use the term.
2. **Plain Marathi for every reader.** Easy words, short sentences. Use what Marathi
   readers really say about markets; where traders say the English word (stop-loss, demat,
   margin, ETF), keep it as the glossary says. One term, one translation, everywhere.
3. **Consistency check.** Flags a glossary term whose approved Marathi form is missing, and
   known wrong variants (the "do not use" list). Code, URLs and repeated boilerplate are
   allowlisted so it does not cry wolf.
4. **Two passes.** Pass 1 drafts. Pass 2 is a separate LLM check that reads the Marathi
   *without* the English and summarises it back in English; the diff against the original
   goes to the maintainer, so meaning drift ("can lose" becoming "will lose") stands out.
   Pass 2 is a review aid; the **gates are the mechanical checks** (mechanisms 4, 5, 13).
5. **Risk-weighted review order.** Track 0 and the front page first, then costs, tax,
   leverage, F&O and loss figures, then quiz explanations, then the rest.
6. **Examples that work in Marathi.** Keep Indian names, rupee amounts and tickers; swap
   English-only idioms for Marathi ones. Quiz prompts keep the same facts and the same one
   correct answer.
7. **Readable on a phone.** Marathi is longer than English. The Marathi e2e run checks
   tables and the quiz layout for overflow at phone width. **Tap targets:** the current
   quiz buttons are 36px (`components.css`), below the 44px rule. Phase 0 raises quiz
   controls to 44px in both languages, so the rule is the same everywhere and the Marathi
   e2e can enforce it.

## Reader feedback loop (open source, no network from the book)

- **"Suggest a correction" link on every Marathi page**, added by the theme. It is an
  ordinary link the reader chooses to click, not a network call from the book. It opens a
  new GitHub issue from a template. The link uses the **canonical public page URL** (a
  value in `book.toml`/`theme/i18n.js`), never the page's own `localhost` address, and it
  carries the chapter id and language. The page says the link needs internet and the book
  itself works offline.
- **Issue template and label** `translation-mr`: chapter, the sentence, better wording,
  and wrong / unclear / awkward.
- **`CONTRIBUTING-i18n.md`:** to fix a chapter, edit its overlay `index.md` and, when the
  quiz changes, its `quiz.json`; follow the glossary; `make check BOOK_LANG=mr` must pass.
- **Credits:** `docs/i18n/CONTRIBUTORS.md`.
- **Public status page** in the Marathi book, "How much is translated", generated from the
  manifest: translated, reviewed, confirmed, stale, fallback.
- **Triage:** corrections are batched; after merging, `make i18n-stamp` marks the page and
  `make deploy` publishes.

## Phases

- **Phase 0, skeleton (no translation):** `assemble_lang.mjs`; per-page status and notices;
  parameterised `gen_summary`, `gen_sw`, `check_chapters` and Makefile; `gen_i18n_js.mjs`
  and the UI-string inventory with the disclaimer, `[VERIFY` chip, quiz and navigation
  strings moved into the dictionary; Devanagari digit normalisation; quiz controls to
  44px; Mermaid aria-label fix; full overlay `book.toml` rule; service-worker prefixes and
  one-time cleanup; switcher; combined fixture and `deploy.sh`; `i18n_status.py`;
  vitest include for `tests/i18n/`; separate Playwright config/project/webServer for the
  combined fixture; `.gitignore` and `AGENTS.md` updates.
  **Acceptance (replaces "identical hashes"):** with no overlay, the English build has
  the same URLs, the same `<main>` content and the same visible body text as today. An
  explicit allowlist covers the expected differences: the switcher script and CSS tags,
  `i18n.js`, the `sw.js` content and cache prefix, the new quiz control size and the
  fixed Mermaid label. The Marathi build with an empty overlay is the English book,
  every page marked fallback with `lang="en"` wrapping and no dead links. Assembler unit
  tests: fallback, overlay, orphan file, id mismatch, stale status, labs `english-only`.
- **Phase 1, Marathi pilot:** `extract_terms.py` and the glossary draft, the maintainer's
  glossary pass, issue template and `CONTRIBUTING-i18n.md`, correction link, translated
  disclaimer and quiz strings, the **front page**, PWA manifest strings, one chapter
  (`T0.1`) and its quiz; full `make check BOOK_LANG=mr`; `tests/e2e/mr.spec.ts` on the
  combined fixture (switcher on deep pages, fallback / draft / stale / labs notices, per
  page language, quiz in Marathi, Devanagari digits typed into a numeric question, no
  horizontal scroll, 44px taps, 16px inputs on desktop and phone, offline load under the
  `mr/` scope); Devanagari heading ids; a search test.
- **Phase 2, rollout:** tracks 00 to 10, a few chapters at a time. Publish `mr/` after
  Phase 1 passes, with notices doing their job and noindex on fallback/draft pages.
- **Phase 3, interactive text:** labs and demo strings into dictionaries; Marathi labs;
  e2e parameterised on language.
- **Phase 4, next language:** `make i18n-new BOOK_LANG=<code>` scaffolds an overlay.

## Explicit non-goals (v1)

- Translating web-component labs, other demos or forward-test script output.
- Machine translation without human review for anything marked `reviewed`.
- Separate repos or branches per language, CI, or a CMS.
- Translating `data/facts` or `data/rates` source documents (they stay English; chapters
  cite them with Marathi explanations).
- Localising mdBook's own interface text.

## Decisions (recommended defaults; maintainer to confirm)

1. **Headings:** translate them; checked by order and count (real heading parsing).
2. **Fallback notice:** quiet, build-time, with a separate calmer notice for labs.
3. **Publishing:** go live at `mr/` after the pilot.
4. **Labs UI stays English in v1**; shared theme strings (disclaimer, quiz, navigation,
   chips) are in scope.
5. **Reviewer:** the maintainer; levels `draft` / `reviewed` / `confirmed` / `stale`.
6. **Digits:** Western digits everywhere in content; Devanagari digits accepted as quiz
   input only.
7. **`[VERIFY` chip:** label translated, fact text as written in the chapter.
8. **Stale policy:** deploy refuses stale reviewed pages unless `ALLOW_STALE=1`.

## What changed after each review

| Finding | Change |
|---|---|
| `LANG` is a shell variable | `BOOK_LANG` |
| mdBook needs `book.toml` and `theme/` at the root | Assemble a full root |
| `gen_summary.py` writes into `src/` | `--lang`, `--out`, strings from `strings.json` |
| Root service worker would cache `mr/` | Exclude it, scope-relative skip, per-language prefixes |
| Runtime fetch for the notice | Build-time notice |
| Checks missed number and answer drift | Parity checks |
| "Reviewed" not recorded | Manifest with status, reviewer, date |
| Phase 0 "identical hashes" contradicted the switcher | Acceptance by URLs, `<main>` content and visible text, with an allowlist |
| Absolute `/mr/` breaks on Pages and in local builds | Scope-relative paths; combined fixture for deploy-shape tests |
| String scope was quiz-only | Full inventory; disclaimer, chips, nav, Mermaid label, digits |
| `<html lang>` is one value per book | Per-page language: `data-page-lang`, `lang="en"` wrapping |
| No completeness check | Paragraph, list, table, code and Mermaid counts; word ratio |
| Stale translation could ship as reviewed | Auto `stale`, notice, deploy refusal |
| Front page, PWA manifest, labs index outside the model | In scope; labs get `english-only` notice |
| Reviewer and status enum inconsistent | One definition at the top |
| Overlay mixed content and metadata; partial `book.toml` | `content/` split; full config, diff-checked |
| `strings.json` could not reach shared JS | Compiled into `theme/i18n.js`; templates; hand-formatted digits |
| Anchor rationale wrong | No `#` anchors; Devanagari ids tested |
| Quiz tap targets are 36px | Raised to 44px in both languages |
| Old `cft-*` caches would never be deleted | One-time cleanup |
| SEO and accessibility of fallback pages | noindex, hreflang, `lang="en"` wrapping |
| Switcher on deep pages, localhost | Root swap from script URL; build flag |
| Test harness underspecified | `tests/i18n/`, vitest include, separate Playwright config |
| Hash and enum mismatches, missing Makefile entries | SHA-256; `.PHONY`; `clean` |
