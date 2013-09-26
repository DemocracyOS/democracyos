# Local Config

## Development settings
1. Copy `sample.json` to either `development.json` or `production.json`
2. Fill the file with data.
3. Run `make` from application's root directory.

## Production settings
1. Copy `sample.json` to either `development.json` or `production.json`
2. Fill the file with data.
3. Run one of the following commands from application's root directory:
  * One step run:`NODE_ENV=production make` everytime you want to start the app
  * Two step run:
    1. Only once `export NODE_ENV=production`
    2. From then on, just `make`

## Machine environment variables
Check documentation over [lib/config](https://github.com/DemocracyOS/app/tree/development/lib/config) module.
