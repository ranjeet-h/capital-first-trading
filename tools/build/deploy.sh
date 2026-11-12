#!/bin/sh
# Builds the book and publishes it to the gh-pages branch (GitHub Pages). No CI: run `make deploy` yourself.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/.pages-build"
cd "$ROOT"
python3 tools/build/gen_summary.py
node tools/build/bundle.mjs
rm -rf "$OUT"
(cd mdbook && mdbook build -d "$OUT")
node tools/build/gen_sw.mjs "$OUT"
touch "$OUT/.nojekyll"
REMOTE="$(git remote get-url origin)"
SRC="$(git rev-parse --short HEAD)"
cd "$OUT"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" -c user.email="$(git -C "$ROOT" config user.email)" commit -q -m "Publish book from $SRC"
git push -q -f "$REMOTE" gh-pages
echo "Published. Site: https://ranjeet-h.github.io/capital-first-trading/"
