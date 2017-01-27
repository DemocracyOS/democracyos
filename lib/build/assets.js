var gulp = require('gulp')
var settings = require('./settings')
var copy = require('./copy-assets')

module.exports = function (srcStr) {
  return function () {
    return gulp.src(srcStr)
      .pipe(copy(settings.public, { verbose: settings.verbose }))
  }
}
