# Capital-First Trading

Offline study book (mdBook) plus labs for learning Indian-market trading with capital protection first. See `PLAN.md` (scope and decisions), `LABS.md` (lab specs) and `curriculum/` (chapter specs).

## Run the book locally

Needs [mdBook](https://rust-lang.github.io/mdBook/) (`cargo install mdbook`, tested with 0.4.52) and Python 3.

```sh
make serve     # regenerates SUMMARY.md, serves at http://localhost:3000 and opens the browser
make build     # static build into mdbook/book/
make check     # structural checks on all chapters and quiz.json files
```

Without make: `python3 tools/build/gen_summary.py && cd mdbook && mdbook serve --open`.

Use `serve` (not a double-clicked HTML file): quizzes load `quiz.json` with `fetch`, which browsers block on `file://`.

## Layout

- `mdbook/src/<track>/<NN-slug>/index.md` and `quiz.json`: chapters. `SUMMARY.md` is generated; do not edit it by hand.
- `mdbook/theme/components.js` / `.css`: renders quizzes (with score and reset) and the `<!-- component: ... -->` demos.
- `mdbook/theme/cft-lib.js`, `cft-anim.css`: shared helpers for the animated demos.
- `mdbook/theme/demos*.js`: all interactive demos, split by topic (charts, indicators, Kite click paths, testing, F&O and markets, money and psychology).
- `mdbook/theme/mermaid*.js`: diagrams.
- `data/facts/*.json`: facts checked against official sources on 11 Nov 2026, each with a source link and a review window. Rules change, so recheck before relying on them.
- `docs/kite-ui-research.md`: research notes on how Kite works, used for the Kite chapters.
- `tools/check/`: `check_chapters.py` (structure), `smoke_demos.py` (opens every page in headless Chrome; run `make build` first).

## Status

- All 99 chapters (11 tracks) are written, each with a quiz and at least one interactive demo.
- The book works offline: no outside links, fonts or scripts.
- Still to build, after the book: the journal app, the labs, and the installable offline shell.
