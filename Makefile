.PHONY: all clean

all: validation.min.js

validation.min.js: validation.js
	./node_modules/.bin/uglifyjs -nc $< > $@

clean:
	rm validation.min.js
