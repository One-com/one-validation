.PHONY: all clean

all: validation.min.js

validation.min.js:
	./node_modules/.bin/uglifyjs -nc $< > $@

clean:
	rm validation.min.js
