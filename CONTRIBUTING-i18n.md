# Contributing a Marathi correction

English is the source of truth. The Marathi book is an overlay: it holds only the pages
that are translated. Everything else falls back to English with a notice.

## Fix a page

1. Find the English page in `mdbook/src/`. Its chapter id is in the `<!-- meta` block.
2. Edit the Marathi file at the same path under `mdbook/i18n/mr/content/`.
3. If the quiz changes, edit the `quiz.json` next to it. Keep every id, answer, option id
   and explanation key exactly the same as English.
4. Follow `docs/i18n/glossary-mr.md`. Use Western digits. Keep `Rs`, `NSE`, `BSE`, `SEBI`,
   `Kite`, `ETF` and `F&O` as written.
5. Run `make check BOOK_LANG=mr`. It compares structure, headings, components, numbers,
   URLs, quiz answers and completeness with English.
6. Preview it with the language dropdown: `make serve-i18n` (port 3002). It rebuilds and
   reloads when you save an overlay file. The single-language `make serve BOOK_LANG=mr`
   (port 3001) is still available, but it needs a restart after edits.
7. A maintainer reviews the page and runs `make i18n-stamp ID=T0.1 REVIEWER="Name"`.

## Add a new page

Copy the English file to the same path under `mdbook/i18n/mr/content/`, keep the meta id
and every component parameter except `caption`, then add a manifest entry. Drafts use
`"status": "draft"`; a maintainer changes it to `reviewed` with `make i18n-stamp`.

## Rules that are easy to miss

- Never add a translation for a lab page. Labs stay English in v1 and get a calm notice.
- Do not remove `[VERIFY` markers. The Marathi count may not be lower than English.
- Do not add `](#...)` links in translated chapters; translated heading ids change.
- No network calls, analytics or CDN fonts. The book works offline.
- A draft may be published with a notice. A reviewed page may not be published stale.
