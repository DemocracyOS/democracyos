var argv = require('yargs').argv;
var production = 'production' === process.env.NODE_ENV || argv.production;

var settings = {};
settings.public = './public/';
settings.clientEntryPoint = './lib/boot/boot.js';
settings.verbose = !!argv.verbose;
settings.sourcemaps = !production && argv.sourcemaps;
settings.minify = !production && argv.minify;
settings.production = production;

module.exports = settings;
