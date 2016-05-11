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

run: build
	@echo "Launching..."
	@$(GULP) serve

build: packages
	@echo "Building..."
	@$(GULP) build

packages:
	@echo "Installing dependencies..."
	@npm install

docker:
	@echo "Starting DemocracyoOS docker development environment..."
	@docker-compose up app

clean:
	@echo "Removing dependencies, components and built assets..."
	@rm -rf node_modules components public
	@echo "Done.\n"

.PHONY: clean docker
