export SHELL=/bin/bash
export PATH := ./node_modules/.bin:$(PATH)

SRC = data-transformer.js
DIST = dist/data-transformer.js
TESTSRC = $(wildcard tests/*.js)
TESTLIB = $(TESTSRC:tests/%.js=tests/lib/%.js)

.PHONY: all test

all: $(DIST)

test: $(DIST) $(TESTLIB)
	mocha $(TESTLIB)

debugtest: $(DIST) $(TESTLIB)
	mocha --debug-brk $(TESTLIB)

tests/lib/%.js: tests/%.js .babelrc
	mkdir -p $(@D)
	babel $< -o $@

dist/data-transformer.js: data-transformer.js .babelrc webpack.config.js
	mkdir -p $(@D)
	babel $< -o $@
	webpack

print-%: ; @echo $* = $($*)

