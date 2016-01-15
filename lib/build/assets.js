var gulp = require('gulp')
var settings = require('./settings')
var copy = require('./copy-assets')

module.exports = function () {
  return gulp.src('./lib/**/assets/*')
    .pipe(copy(settings.public, { verbose: settings.verbose }))
}
