.PHONY: serve build check summary clean js test

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

# Live-reloading local server at http://localhost:3000
serve: summary js
	cd mdbook && mdbook serve --open

clean:
	rm -rf mdbook/book
