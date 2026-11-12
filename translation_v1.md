# Capital-First Trading — Multi-Language Plan (translation_v1)

Status: reviewed against the repo on 2026-11-12 and revised. Nothing is built yet.
English is the source of truth in `mdbook/src/`. Marathi comes first; other languages
follow the same pattern.

## Decisions already made with the maintainer

- **Scope for v1:** chapters + quizzes. Labs (web components), demos and the forward-test
  tool stay English. (Exception found in review: the quiz *buttons and feedback* are
  English strings inside `mdbook/theme/components.js`, so they are in v1 scope. See
  mechanism 11.)
- **Missing translations:** fall back to English. The book is always complete.
- **Site layout:** one site, language subpaths. English at `/`, Marathi at `/mr/`.
- **Workflow:** LLM-drafted, human-reviewed against a fixed glossary.

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
  i18n/mr/                   # Marathi overlay: only translated files, same relative paths
    00-start-here/01-what-trading-is-and-is-not/{index.md,quiz.json}
    manifest.json            # per chapter: source hashes, status draft|reviewed, reviewer, date
    strings.json             # UI strings: quiz buttons/feedback, banners, track names, switcher
    book.toml                # language = "mr", translated title/description only
  book.toml                  # English config
  theme/                     # shared; add lang-switch.js/css and a Devanagari font stack
tools/build/
  assemble_lang.mjs          # NEW: builds .build/<lang>/ (see mechanism 2)
  gen_summary.py             # --lang, --out; track/labs page text comes from strings.json
  gen_sw.mjs                 # --lang, per-language cache prefix, exclude other-language folders
  deploy.sh                  # builds EN at root and MR at /mr/ into .pages-build/
tools/check/
  check_chapters.py          # --lang, --root; parity checks against English (mechanism 4)
  i18n_status.py             # NEW: covered / stale / draft counts
docs/i18n/glossary-mr.md     # fixed term translations and style rules
```

The assembled folder is a full mdBook root, not just a `src/`:
`.build/mr/{book.toml, src/, theme/}`. mdBook reads `theme/` and the `additional-js/css`
paths in `book.toml` relative to the book root, so `theme/` (including generated
`theme/dist/labs.js`) is linked or copied in, and generated files under `src/labs/`
(downloads, `bt-worker.js`) come along with the English copy.

## Key mechanisms

1. **Chapter IDs are the cross-language key.** Every chapter has `id: T0.1` in its
   `<!-- meta` block and quizzes use `T0.1-q1`. Overlay files must keep the same ids and
   the same folder slugs. URLs stay English slugs on purpose, so links never break.

2. **Assembly with a build-time fallback notice.** `assemble_lang.mjs` copies `src/` to
   `.build/mr/src/`, overlays `i18n/mr/`, and for every page that is still English it
   *inserts a short notice into the page itself* ("Not yet translated. Showing English.").
   Doing it at build time (not by fetching a status file in the browser) keeps pages
   self-contained, makes the notice work with no script, and keeps it consistent in
   search. Drafts that are not yet human-reviewed get a different quiet notice
   ("Draft translation, not yet reviewed. English is the reference."). The tool fails the
   build if an overlay file has no English counterpart (renamed or removed chapter).

3. **Per-language generated pages.** `gen_summary.py` currently writes into `src/`
   (SUMMARY.md plus generated track and labs index pages, with English sentences inside
   the script). It gets `--lang` and `--out` and reads track names and sentences from
   `strings.json`. Titles come from overlay front matter when translated, from English
   when not.

4. **Checker per language, with parity against English.** `check_chapters.py --lang mr`
   keeps today's structure checks and adds checks that catch what an LLM gets wrong:
   - same `id`; headings in the same order and count (translated heading text is
     allowed; see the heading decision below);
   - same sequence of `<!-- component: ... -->` markers and the standing-disclaimer marker;
   - **numbers, URLs and dates are identical to English** (multiset compare of digit
     sequences, rupee amounts and URLs, with Western digits mandatory);
   - quiz parity: same question ids, types, option ids, correct answers and numeric
     answers; only text fields may differ;
   - banned-phrase scan with a Marathi list (assured-return and risk-free wording) as well
     as the English list;
   - `[VERIFY` count not lower than English.
   Staleness is a **warning**, not a failure: `manifest.json` stores the SHA-1 of the
   English chapter and quiz at translation time; `make i18n-status` lists translations
   whose English source changed afterwards. `make i18n-stamp ID=T0.1` records a new hash
   after a human re-check. (Hashes live in the manifest, not in `quiz.json`, which has no
   front matter.)

5. **Build, test, deploy per language.** The Makefile variable is **`BOOK_LANG`**
   (default `en`), not `LANG`: `LANG` is a standard shell variable (`en_US.UTF-8`), and
   make imports environment variables, so `LANG ?= en` would silently pick up the wrong
   value. Targets: `make build BOOK_LANG=mr`, `make serve BOOK_LANG=mr` (port 3001),
   `make check BOOK_LANG=mr`, `make e2e BOOK_LANG=mr` (`.e2e-book-mr`, port 4174). Deploy
   builds both. All manual, no CI.

6. **GitHub Pages layout.** English at `/`, Marathi at `/mr/`, one `gh-pages` push. The
   root service worker must not cache the Marathi build twice (see 8). `.pages-build/` is
   built English first, then `mdbook build -d .pages-build/mr` from the assembled root.

7. **Language switcher.** `theme/lang-switch.js` shows "English | मराठी" in the menu bar.
   Path mapping works from the page's own location (relative hop up or down one level,
   found from the script URL the way `register-sw.js` does it), not from a hard-coded
   base path. Locally the two languages run on different ports, so the switcher is hidden
   under `make serve` unless both are running; on Pages it always works because every
   English page has a Marathi page (translated or fallback).

8. **Service workers must not collide.** Today `gen_sw.mjs` names caches `cft-<hash>` and
   deletes every `cft-*` it does not own, so two languages on one origin would wipe each
   other. Changes:
   - prefixes `cft-en-<hash>` and `cft-mr-<hash>`; each worker deletes only its own prefix;
   - the English `gen_sw` walk **excludes `mr/`** (otherwise the whole Marathi book lands
     in the English cache list), and the English fetch handler returns early for `/mr/`;
   - `/mr/sw.js` has the narrower scope `/mr/`, so Marathi pages are controlled by it.
     `register-sw.js` resolves `../sw.js` from its own script URL, so it already points to
     `/mr/sw.js` on Marathi pages with no change.
   - Size: the English book is about 13 MB (search index 3.4 MB, mermaid 2.5 MB). A reader
     who uses both languages caches roughly twice that. Accepted; measure after Phase 0.

9. **Devanagari rendering, offline-safe.** No CDN fonts. Use a system Devanagari stack
   (`Noto Sans Devanagari`, `Nirmala UI`, `Devanagari Sangam MN`, then `system-ui`) and a
   taller line height (about 1.7) so vowel marks do not collide. Optionally bundle one open
   font later. Headings, tables and the 44px / 16px / no-horizontal-scroll rules stay;
   Devanagari is wider, so the Marathi e2e run is where overflow shows up.

10. **Quizzes** are overlay `quiz.json` files with the same ids. Quiz fetch paths do not
    change.

11. **Quiz and chapter UI strings (new in review).** `components.js` hard-codes "Check",
    "Correct.", "Not quite.", "Correct options: ..." and similar; some demo files do too.
    Phase 0 moves the quiz-block strings into a small dictionary chosen by
    `<html lang>`, with English as the default. Other demos stay English in v1. mdBook's
    own chrome (search box placeholder, "Toggle sidebar") also stays English; we say so
    in the Marathi front page.

12. **English is authoritative.** The standing disclaimer and every dated fact are
    translated, but each Marathi page links to the English page, and the notice on the
    Marathi front page says English governs if the two ever differ.

## Translation workflow (LLM-drafted, human-reviewed)

1. Write `docs/i18n/glossary-mr.md` first. Rules to include: Rs and paise stay as written;
   **Western digits only** (so every number matches the calculators and quizzes);
   keep NSE, BSE, SEBI, Kite, ETF and similar names in Latin script; keep lab button and
   field names in English with a Marathi explanation in brackets (the labs stay English);
   plain, short sentences like the English book; never write "assured", "sure" or
   "risk-free" wording that the English book bans.
2. For each chapter: an LLM drafts from the English file plus the glossary (per project
   practice, large prose goes to Haiku 5.5 subagents; the pilot checks that its Marathi is
   good enough, and the pilot decides the model for the rest). The draft is saved as the
   overlay with `status: draft` in `manifest.json`.
3. A Marathi reader reviews it in the built page and fixes it, then the chapter is marked
   `reviewed` with a name and date. Unreviewed drafts may be published only with the draft
   notice from mechanism 2.
4. `make check BOOK_LANG=mr` must pass.
5. Order: pilot one chapter, then track 00 to 10. Spot-check at least 1 in 5 chapters of
   each track even after the pilot, because errors vary by topic (derivatives and tax are
   the highest risk).

## Phases

- **Phase 0, skeleton (no translation):** `assemble_lang.mjs`; parameterised summary, sw,
  check and Makefile; deploy with two outputs; language switcher; service-worker prefix
  fix; quiz string dictionary; `i18n_status.py`; `.gitignore` (`.build/`, `.e2e-book-mr/`)
  and `AGENTS.md` updates. **Acceptance:** with no overlay, the English build tree is
  identical to today's (same file list and file hashes except the generated `sw.js`
  version); the Marathi build with an empty overlay is the English book, every page
  marked as fallback, no dead links; unit tests for the assembler (fallback, overlay,
  orphan overlay file, id mismatch).
- **Phase 1, Marathi pilot:** glossary, one chapter (`T0.1`) and its quiz, full
  `make check BOOK_LANG=mr`, a small `tests/e2e/mr.spec.ts` (switcher, fallback notice,
  draft notice, quiz feedback in Marathi, no horizontal scroll or tap-target problems on
  desktop and phone, offline load of `/mr/`), human review, and a search test (the stock
  mdBook search tokenises Devanagari plainly, so check that Marathi words are found).
- **Phase 2, rollout:** tracks 00 to 10, a few chapters at a time. `/mr/` goes live after
  Phase 1 passes, with fallback and draft notices doing their job.
- **Phase 3, interactive text:** labs and demo strings into dictionaries; Marathi labs;
  e2e parameterised on language.
- **Phase 4, next language:** `make i18n-new BOOK_LANG=<code>` scaffolds an overlay.

## Explicit non-goals (v1)

- Translating web-component labs, other demos, or forward-test script output.
- Machine translation without human review for anything marked `reviewed`.
- Separate repos or branches per language, CI, or a CMS.
- Translating `data/facts` or `data/rates` source documents (they stay English; chapters
  cite them with Marathi explanations).
- Localising mdBook's own interface text.

## Decisions (recommended defaults, maintainer to confirm)

1. **Headings:** translate them. Checked by order and count against English, so the
   structure rules still hold. Anchor links inside chapters use file paths, so nothing
   breaks.
2. **Fallback notice:** a quiet notice at the top of every English-fallback page, added at
   build time. It is the honest signal; a hidden badge could mislead readers.
3. **Publishing:** go live at `/mr/` after the pilot, with fallback and draft notices.
4. **Labs UI stays English in v1:** confirmed by the maintainer; quiz UI strings are the
   one addition.
5. **Reviewer:** still open. Who reviews Marathi (glossary and chapters)? Without a named
   reviewer nothing can move past `draft`.
6. **Digits:** Western digits (0 to 9) everywhere. Recommended so numbers match the
   calculators, quizzes and the number-parity check.

## What changed after review

| Finding | Change |
|---|---|
| `LANG` is a standard environment variable, so `make ... LANG=mr` defaults break | Renamed to `BOOK_LANG` |
| Assembly built only `src/`, but mdBook needs `book.toml` and `theme/` at the book root | Assemble a full root (`.build/mr/`) |
| `gen_summary.py` writes generated files into `src/` and holds English sentences | `--lang`, `--out`, strings from `strings.json` |
| Root service worker would cache `/mr/` and walk its files | Exclude `mr/`, skip `/mr/` in fetch, per-language prefixes |
| Runtime fetch of `i18n.json` for the fallback notice | Notice inserted at build time |
| Quiz buttons and feedback are English in `components.js` | Quiz strings added to v1 scope |
| Checks did not catch LLM number or answer drift | Parity checks: numbers, URLs, quiz ids and answers, component markers |
| "Human-reviewed" was not recorded anywhere | `manifest.json` with status, reviewer, date, and a draft notice |
| Hash for stale detection had no home for `quiz.json` | Hashes kept in the manifest |
| Switcher assumed a fixed base path; local serve uses two ports | Relative mapping; hidden locally unless both run |
| Paths said `theme/`; the real path is `mdbook/theme/` | Fixed |
| Phase 0 could change the English deploy silently | Acceptance: identical English output, plus assembler unit tests |
| Marathi e2e was vague | A small dedicated spec, not the English suite |
| Devanagari digits, line height, search quality, size, English-authoritative notice not covered | Added (mechanisms 8, 9, 12, workflow, Phase 1) |
| Process note about the plan directory | Removed |
