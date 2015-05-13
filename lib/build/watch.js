var gulp = require('gulp');

module.exports = function (settings) {

  gulp
    .task('watch', function () {
      gulp.watch(['lib/**/*.js', 'lib/**/*.jade'], ['js:build']);
      gulp.watch(['lib/**/*.styl'], ['css:build']);
    })
}
