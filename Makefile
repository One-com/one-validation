.PHONY : all clean

all: validation.min.js validation-ExtJS.min.js

validation.min.js: validation.js
	uglifyjs -nc $< > $@

validation-ExtJS.min.js: validation-ExtJS.js
	uglifyjs -nc $< > $@

clean:
	rm validation.min.js
	rm validation-ExtJS.min.js
