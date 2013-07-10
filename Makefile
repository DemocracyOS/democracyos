# 
# pdr-app Makefile
# 

run: packages
	@echo "Starting application..."
	@NODE_PATH=. node app.js

packages:
	@echo "Installing dependencies..."
	@npm install
	@echo "Done.\n"
	@echo "Installing components..."
	@./node_modules/component/bin/component install
	@echo "Done.\n"

clean:
	@echo "Removing dependencies and components."
	@rm -rf node_modules components
	@echo "Done.\n"


.PHONY: clean