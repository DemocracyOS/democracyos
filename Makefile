# 
# pdr-app Makefile
# 

run: install
	@echo "Starting application..."
	@NODE_PATH=lib \
		node app.js

install:
	@echo "Install dependencies..."
	@npm install

clean:
	@echo "Removing 'node_modules' path..."
	@rm -rf node_modules

.PHONY: clean