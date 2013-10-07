# Config module

## Server
### Development
Populate `development.json` from `sample.json` for development configuration at `./config/` directory relative to this project's root path.
### Test
Populate `testing.json` from `sample.json` for testing configuration at `./config/` directory relative to this project's root path.
### Production
Populate `production.json` from `sample.json` for production configuration at `./config/` directory relative to this project's root path.

## Client
Client side config file is built dynamically from `./config/*.json` file. It will only expose config vars copied from `client` list at the very same `./config/*.json` file.

The application launch will fail if client side config is not compiled. Make sure to install it befor run:

### Install
You should run `./bin/dos-build` from this project's root path in order to compile client side config file from application's config specs at `./config/*.json`