# 
# pdr-app Makefile
# 

run: packages components
	@echo "Starting application..."
	@NODE_PATH=. node app.js

packages:
	@echo "Installing dependencies..."
	@npm install
	@echo "Done.\n"

components:
	@echo "Installing components..."
	@component install
	@echo "Done.\n"

clean:
	@echo "Removing dependencies and components."
	@rm -rf node_modules components
	@echo "Done.\n"


.PHONY: clean