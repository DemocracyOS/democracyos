#
# DemocracyOS Makefile
#

ifndef DEBUG
  DEBUG="democracyos*"
endif

ifndef NODE_ENV
  NODE_ENV="development"
endif

run: packages
	@echo "Starting application..."
	@NODE_PATH=. DEBUG=$(DEBUG) node index.js

packages:
	@echo "Installing dependencies..."
	@npm install
	@echo "Done.\n"
	@echo "Installing components..."
	@node ./bin/dos-install --config
	@echo "Updating config settings..."
	@node ./bin/dos-config
	@echo "Done.\n"
	@echo "Compiling components to ./public..."
	@node ./bin/dos-build
	@echo "Done.\n"

clean:
	@echo "Removing dependencies, components and built assets."
	@rm -rf node_modules components public
	@echo "Done.\n"


.PHONY: clean