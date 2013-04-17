# 
# pdr-app Makefile
# 

run: install
	@NODE_PATH=lib \
		node app.js

install:
	@npm install

clean:
	@rm -rf node_modules

.PHONY: clean