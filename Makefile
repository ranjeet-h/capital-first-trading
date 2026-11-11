.PHONY: e2e serve build check summary clean js test

js:
	node tools/build/bundle.mjs

test:
	npx vitest run

summary:
	python3 tools/build/gen_summary.py

check:
	python3 tools/check/check_chapters.py

build: summary js
	cd mdbook && mdbook build
	node tools/build/gen_sw.mjs

# Browser tests run on their own copy of the book, so a running `make serve` cannot disturb them.
e2e: summary js
	rm -rf .e2e-book
	cd mdbook && mdbook build -d $(CURDIR)/.e2e-book
	node tools/build/gen_sw.mjs .e2e-book
	npx playwright test

# Live-reloading local server at http://localhost:3000
serve: summary js
	cd mdbook && mdbook serve --open

clean:
	rm -rf mdbook/book
