# 
# pdr-app Makefile
# 

run: packages
	@echo "Starting application..."
	@NODE_PATH=. node app.js

packages:
	@echo "Installing dependencies..."
	@npm install 2>&1 | grep -v "npm WARN"
#	@echo "Done.\n"
#	@echo "Installing components..."
#	@./node_modules/component/bin/component install
#	@echo "Compiling components to ./public..."
#	@./bin/demenred build
	@echo "Done.\n"

clean:
	@echo "Removing dependencies and components."
	@rm -rf node_modules components
	@echo "Done.\n"


.PHONY: clean