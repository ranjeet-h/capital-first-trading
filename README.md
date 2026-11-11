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
- `mdbook/theme/components.js` / `.css`: renders quizzes and labelled placeholders for `<!-- component: ... -->` comments.
- `mdbook/theme/mermaid*.js`: diagrams.
- `tools/check/`: chapter checker. `tools/build/`: SUMMARY generator.

Chapters are drafts until each passes review (`Last content review` line) and every `[VERIFY]` is resolved.
