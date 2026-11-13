# AGENTS.md

Guide for AI coding agents working in this repo. Read this first, then README.md and PLAN.md.

## What this project is

Capital-First Trading is an offline, local-only study book for the Indian stock market, aimed at people who trade through Zerodha Kite. It is written in plain English.

- The book is built with mdBook plus plain JavaScript demos.
- The three tools (cost calculator, position size calculator, trade journal) are TypeScript web components, bundled by esbuild into one file.
- There is no server and no accounts. The journal lives in the browser's IndexedDB. Backups are files the user controls.
- There is no CI. All checks run by hand with `make`.

## Commands

Run these from the repo root.

- `make serve`: builds the summary and JS bundle, then starts `mdbook serve --open` (live reload, default port 3000).
- `make build`: builds the static site into `mdbook/book/` and writes `sw.js` (offline cache list).
- `make test`: runs the unit tests with Vitest (`packages/*/test/**/*.test.ts` and `tests/i18n/**/*.test.ts`).
- `make e2e`: builds a separate copy of the book into `.e2e-book/`, then runs Playwright against it on port 4173, on desktop and phone projects.
- `make check`: runs `tools/check/check_chapters.py` on every chapter and quiz (structure, disclaimer, banned phrases, quiz JSON).
- `make build BOOK_LANG=mr`: assembles `.build/mr/` (English source + Marathi overlay), builds it, and post-processes per-page status.
- `make check BOOK_LANG=mr`: parity, completeness and glossary checks against English.
- `make serve BOOK_LANG=mr`: serves the assembled Marathi book on port 3001. Restart after overlay edits.
- `make serve-i18n`: builds the combined preview (English at `/`, Marathi at `/mr/`) on port 3002, shows the language dropdown, and rebuilds when source or overlay files change.
- `make e2e BOOK_LANG=mr`: builds the combined site (English at `/`, Marathi at `/mr/`) into `.e2e-combined/` and runs `tests/e2e/mr.spec.ts` on port 4174.
- `make i18n-status`, `make i18n-stamp ID=T0.1 REVIEWER="Name"`, and `make i18n-new BOOK_LANG=hi` manage translation state.
- `make deploy`: builds into `.pages-build/` and force-pushes it to the `gh-pages` branch. Run by hand only.
- `npm run typecheck`: runs `tsc --noEmit` over `packages/*/src`, `packages/*/test` and `data`.
- `make js`: bundles `packages/ui` into `mdbook/theme/dist/labs.js`.
- `make summary`: regenerates `mdbook/src/SUMMARY.md` and `mdbook/src/labs/index.md`.

## Layout

- `mdbook/src/<track>/<chapter>/`: chapter `index.md` and `quiz.json`. Tracks are `00-start-here` to `10-graduation-gates`.
- `mdbook/src/labs/`: lab pages (`cost-calculator.md`, `position-size-calculator.md`, `journal.md`) and the generated `index.md`.
- `mdbook/src/SUMMARY.md`: generated. Do not edit by hand.
- `mdbook/theme/`: CSS, demo scripts, offline loader (`register-sw.js`). `dist/` is generated.
- `mdbook/book.toml`: mdBook config.
- `packages/core/src/`: pure TypeScript logic (costs, sizing, journal, stats, store, backup, console import). Tests in `packages/core/test/`.
- `packages/ui/src/`: the web components for the three labs.
- `data/rates/`: Zerodha charge rates, with source and verification date.
- `data/facts/`: checked facts (including the single-source NSE holiday list used by the forward script), each with `sourceUrl`, `verifiedOn` and `reviewEveryDays`.
- `tests/e2e/`: Playwright specs (`labs`, `journal`, `offline`).
- `tools/build/`: `gen_summary.py`, `gen_sw.mjs`, `bundle.mjs` (also builds the Forward test page downloads into `mdbook/src/labs/downloads/` and the strategy tester's `mdbook/src/labs/bt-worker.js`, both git-ignored), `deploy.sh`.
- `tools/forward-test/`: the forward-test script (`cli.ts`, `main.ts`), a sample, and a README. The book page offers the bundled script as a download.
- `tools/check/`: `check_chapters.py`, `i18n_status.py`, and two other check scripts.
- `tools/build/`: `assemble_lang.mjs` (overlay + full mdBook root), `gen_i18n_js.mjs` (strings into `theme/i18n.js`), `postprocess_lang.mjs` (per-page language, notices, noindex, hreflang), `build_combined.mjs`, `serve_combined.mjs` (local combined preview), `gen_summary.py`, `gen_sw.mjs`, `deploy.sh`.
- `tools/i18n/`: `extract_terms.py`, `stamp.py`, `new_language.py`.
- `mdbook/i18n/`: English UI strings plus `mr/` metadata, manifest and `content/` overlay.
- `tests/i18n/`: assembler, parity and post-build unit tests.
- `docs/i18n/`: Marathi glossary, contributors and translation notes. `docs/` also holds design notes and screenshots.
- `CONTRIBUTING-i18n.md`: how to fix or add a translated page.

## Hard rules

- **Money is integer paise.** Inside the code, every amount is a whole number of paise. Rupee text is converted once at the edge (see `rupeesToPaise` in `console-import.ts`). Never use floats for money.
- **No network calls from the book or the labs.** Do not add `fetch` to external URLs, analytics, fonts from CDNs, or anything else that leaves the device. Local `fetch` of the book's own files is fine.
- **Reader-facing text is plain English.** Use easy words and short sentences that a young reader or an older reader can follow. Do not put internal IDs, file names, task names or process notes in what the reader sees.
- **Every dated fact needs a source and a review date.** Put it in `data/facts/` or `data/rates/` with `sourceUrl`/`source`, `verifiedOn` and `reviewEveryDays`.
- **Labs need Playwright e2e on desktop and phone.** Tests must check that there is no horizontal scroll, that tap targets are at least 44px, and that inputs are at least 16px (see `tests/e2e/labs.spec.ts` and `journal.spec.ts`).
- **Modes are never blended.** The journal modes are `paper`, `live`, `forward`, `backtest` and `kite_demo`. Filter by mode before computing any statistic (see `stats.ts`).
- **Imports never delete data.** Merge by record, keep the newer `updated_at`, and write tombstones (`deleted: true`) rather than removing records.
- **No CI.** Do not add GitHub Actions or any other hosted pipeline.

## Chapter rules (enforced by `make check`)

- Each chapter `index.md` starts with a `<!-- meta` front matter block with an `id:` line.
- Each chapter has these headings: `## Hook`, `## The idea`, `## See it`, `## Worked example`, `## Try it`, `### Guided exercise`, `### Independent exercise`, `## Quiz`, `## Paper task`, `## Limits and common mistakes`, `## Remember`, `## Sources and verification`.
- Each chapter has the `<!-- standing-disclaimer -->` marker and a `quiz.json` next to it.
- Demo markers (`<!-- component: name`) must use a name the checker knows. Add new demos to `demos*.js` first.
- Words such as "guaranteed", "sure profit", "easy money", "good trade" and "risk-free" are banned unless negated.
- `[VERIFY` markers are counted and reported. Remove them only after the fact is checked.

## Workflow

- Write unit tests first for core logic in `packages/core`, then the code.
- Before committing, run `npm run typecheck`, `make test`, `make e2e` and `make check`. All must pass.
- Commit only when the user asks.
- Never kill a running `mdbook serve`. The user may be reading the live book. `make e2e` uses its own `.e2e-book/` copy so it does not disturb it.

## Gotchas

- mdBook sets 1rem = 10px. Lab CSS therefore sets its own base size: `.lab` uses `font-size: 1.6rem` (see `mdbook/theme/labs.css`). Use `em` inside labs.
- `mdbook/src/SUMMARY.md` and `mdbook/src/labs/index.md` are generated by `tools/build/gen_summary.py`. To change the "Coming soon" list, edit `labs.upcoming` in `mdbook/i18n/strings.en.json` and `mdbook/i18n/<lang>/strings.json`, not the output. Run `make summary` after changing a lab page.
- `mdbook/book/sw.js` is generated by `tools/build/gen_sw.mjs`, which lists every built file for the offline cache. Do not edit it. It is rebuilt on every `make build` and `make e2e`.
- `mdbook/theme/dist/` is generated by esbuild and is git-ignored. Run `make js` after changing `packages/ui`.
- The e2e run serves `.e2e-book/` with `python3 -m http.server 4173`. If port 4173 is busy, the Playwright web server is reused when it answers, so stop the old server first.
- Quizzes load JSON with `fetch`, which browsers block on `file://`. Always test through `make serve` or a server, not by opening HTML files directly.
- `.e2e-book/`, `.pages-build/`, `mdbook/book/`, `mdbook/theme/dist/`, `node_modules/` and `test-results/` are generated and git-ignored. Do not commit them.
- Lab behaviour is specified in `LABS.md`. Read the lab's section there before changing its formulas, outputs or acceptance criteria.
- `make check` prints a line per chapter with its word count, `[VERIFY` count and quiz count. Fix any line that is not `OK`.
