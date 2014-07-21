.PHONY : all clean

all: validation.min.js validation-ExtJS.min.js

validation.min.js:
	./node_modules/.bin/uglifyjs -nc $< > $@

validation-ExtJS.min.js: validation-ExtJS.js
	./node_modules/.bin/uglifyjs -nc $< > $@

clean:
	rm validation.min.js
	rm validation-ExtJS.min.js
