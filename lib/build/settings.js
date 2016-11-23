var argv = require('yargs').argv
var production = process.env.NODE_ENV === 'production' || argv.production

var settings = {}
settings.public = './public/'
settings.verbose = !!argv.verbose
settings.sourcemaps = !production && argv.sourcemaps
settings.minify = production || argv.minify
settings.production = production

module.exports = settings
