.PHONY: serve build check summary clean

summary:
	python3 tools/build/gen_summary.py

check:
	python3 tools/check/check_chapters.py

build: summary
	cd mdbook && mdbook build

# Live-reloading local server at http://localhost:3000
serve: summary
	cd mdbook && mdbook serve --open

clean:
	rm -rf mdbook/book
