.PHONY : all clean validation.js

all: validation.min.js validation-ExtJS.min.js

validation.js: lib/validation.js.tpl lib/tld.js
	node lib/tld.js > $@

validation.min.js: validation.js
	uglifyjs -nc $< > $@

validation-ExtJS.min.js: validation-ExtJS.js
	uglifyjs -nc $< > $@

clean:
	rm validation.min.js
	rm validation-ExtJS.min.js
