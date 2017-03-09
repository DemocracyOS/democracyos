#
# DemocracyOS Makefile
#

ifndef DEBUG
  DEBUG="democracyos*"
endif

ifndef NODE_ENV
  NODE_ENV="development"
endif

run: build
	@echo "Launching..."
	@DEBUG=$(DEBUG) npm run start

build: packages
	@echo "Building..."
	@npm run build

packages:
	@echo "Installing dependencies..."
	@npm install

docker:
	@echo "Starting DemocracyoOS docker development environment..."
	@docker-compose up app

clean:
	@echo "Removing dependencies, components and built assets..."
	@rm -rf node_modules public
	@echo "Done.\n"

.PHONY: clean docker
