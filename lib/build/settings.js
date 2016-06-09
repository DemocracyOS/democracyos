var argv = require('yargs').argv
var production = process.env.NODE_ENV === 'production' || argv.production

var settings = {}
settings.public = './public/'
settings.clientEntryPoint = './lib/boot/boot.js'
settings.stylEntryPoint = './lib/boot/boot.styl'
settings.verbose = !!argv.verbose
settings.sourcemaps = !production && argv.sourcemaps
settings.minify = !production && argv.minify
settings.production = production
settings.livereload = !production && argv.livereload

module.exports = settings
