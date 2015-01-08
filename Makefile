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
	@DEBUG=$(DEBUG) node ./bin/dos install --config
	@echo "Updating config settings..."
	@DEBUG=$(DEBUG) node ./bin/dos-config
	@echo "Done.\n"
	@echo "Compiling components to ./public..."
	@DEBUG=$(DEBUG) node ./bin/dos build --watch &
	@echo "Done.\n"

clean:
	@echo "Removing dependencies, components and built assets."
	@rm -rf node_modules components public
	@echo "Done.\n"


.PHONY: clean