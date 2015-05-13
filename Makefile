#
# DemocracyOS Makefile
#

ifndef DEBUG
  DEBUG="democracyos*"
endif

ifndef NODE_ENV
  NODE_ENV="development"
endif

GULP="./node_modules/.bin/gulp"

run: packages
	@NODE_PATH=. DEBUG=$(DEBUG) $(GULP) serve

packages:
	@echo "Installing dependencies..."
	@npm install

clean:
	@echo "Removing dependencies, components and built assets."
	@rm -rf node_modules components public
	@echo "Done.\n"

.PHONY: clean
