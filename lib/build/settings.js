var argv = require('yargs').argv;

module.exports = {
  public: './public/',
  clientEntryPoint: './lib/boot/boot.js',
  verbose: argv.verbose,
  debug: !argv.production
};
