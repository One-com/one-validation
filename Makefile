.PHONY : all clean

all: validation.min.js validation-ExtJS.min.js

validation.js: lib/one/validation.js
	cp $< $@

validation-ExtJS.js: lib/one/validation-ExtJS.js
	cp $< $@

validation.min.js: validation.js
	uglifyjs -nc $< > $@

validation-ExtJS.min.js: validation-ExtJS.js
	uglifyjs -nc $< > $@

clean:
	rm validation*.js
