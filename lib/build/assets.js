var gulp = require('gulp');
var copy = require('./copy-assets');

module.exports = function (settings) {
  gulp
    .task('assets', ['public'], function () {
      gulp.src('./lib/**/assets/*')
        .pipe(copy(settings.public))
    })
}
