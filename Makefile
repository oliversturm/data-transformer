export SHELL=/bin/bash
export PATH := ./node_modules/.bin:$(PATH)

SRC = data-transformer.js
DIST = dist/data-transformer.js dist/data-transformer.min.js
TESTSRC = $(wildcard tests/*.js)
TESTLIB = $(TESTSRC:tests/%.js=tests/lib/%.js)

.PHONY: all test publish bowerreg

all: $(DIST) docs

docs: README.md

test: $(DIST) $(TESTLIB)
	mocha $(TESTLIB)

debugtest: $(DIST) $(TESTLIB)
	mocha --debug-brk $(TESTLIB)

README.md: README.template.md $(SRC)
	jsdoc2md -t README.template.md $(SRC) > README.md

tests/lib/%.js: tests/%.js .babelrc
	mkdir -p $(@D)
	babel $< -o $@

dist/data-transformer.js: $(SRC) .babelrc
	mkdir -p $(@D)
	babel -s true $< -o $@

dist/data-transformer.min.js: $(SRC) webpack.config.js
	mkdir -p $(@D)
	webpack

print-%: ; @echo $* = $($*)

publish: all
	npm publish

bowerreg: all
	bower register data-transformer git://github.com/oliversturm/data-transformer.git
