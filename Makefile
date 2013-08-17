# 
# pdr-app Makefile
# 

run: packages
	@echo "Starting application..."
	@NODE_PATH=. node index.js

packages:
	@echo "Installing dependencies..."
	@npm install
	@echo "Done.\n"
	@echo "Installing components..."
	@./bin/dos-install
	@echo "Compiling components to ./public..."
	@./bin/dos-build
	@echo "Done.\n"

clean:
	@echo "Removing dependencies and components."
	@rm -rf node_modules components
	@echo "Done.\n"


.PHONY: clean