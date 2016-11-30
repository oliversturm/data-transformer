export SHELL=/bin/bash
export PATH := ./node_modules/.bin:$(PATH)

SRC = data-transformer.js
DIST = dist/data-transformer.js dist/data-transformer-browser.js
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

dist/data-transformer-browser.js: $(SRC) webpack.config.js
	mkdir -p $(@D)
	webpack

print-%: ; @echo $* = $($*)

publish: all
	@echo "MAKE SURE CHANGES HAVE BEEN PUSHED TO GITHUB."
	@echo "Current version from package.json:"
	grep --color "version" package.json
	@while [ -z "$$NEWVERSION" ]; do \
		read -p "Enter the new version: " NEWVERSION; \
	done ; \
	npm version $$NEWVERSION; \
	git push --tags && \
	npm publish && \
	s3-cli --region "eu-west-1" put -P dist/data-transformer-browser.min.js s3://data-transformer/$$NEWVERSION/data-transformer-browser.min.js

bowerreg: all
	bower register data-transformer git://github.com/oliversturm/data-transformer.git
