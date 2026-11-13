#!/bin/sh
# Builds the combined site and publishes it to the gh-pages branch (GitHub Pages).
# No CI: run `make deploy` yourself.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/.pages-build"
cd "$ROOT"

if [ -n "$(git status --porcelain)" ] && [ "${ALLOW_DIRTY:-0}" != "1" ]; then
  echo "Working tree is not clean. Commit first, or set ALLOW_DIRTY=1 to publish it on purpose." >&2
  exit 1
fi

if ! python3 tools/check/i18n_status.py --lang mr --check-stale; then
  if [ "${ALLOW_STALE:-0}" != "1" ]; then
    echo "A reviewed Marathi page is stale. Review it and run make i18n-stamp, or set ALLOW_STALE=1 on purpose." >&2
    exit 1
  fi
fi

node tools/build/build_combined.mjs --out "$OUT"

REMOTE="$(git remote get-url origin)"
SRC="$(git rev-parse --short HEAD)"
cd "$OUT"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" -c user.email="$(git -C "$ROOT" config user.email)" commit -q -m "Publish book from $SRC"
git push -q -f "$REMOTE" gh-pages
echo "Published. Site: https://ranjeet-h.github.io/capital-first-trading/"
