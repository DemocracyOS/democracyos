var gulp = require('gulp');
var copy = require('./copy-assets');

module.exports = function (settings) {
  gulp
    .task('assets', ['public'], function () {
      return gulp.src('./lib/**/assets/*')
        .pipe(copy(settings.public, { verbose: settings.verbose }));
    })
}
