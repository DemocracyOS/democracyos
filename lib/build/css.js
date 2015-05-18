var gulp = require('gulp');
var stylint = require('gulp-stylint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');

module.exports = function (settings) {

  function css (opts) {
    opts = opts || {};
    var t = gulp.src('./lib/boot/boot.styl')
    if (opts.sourcemaps) t = t.pipe(sourcemaps.init());
    t = t.pipe(stylus())
    if (opts.sourcemaps) t = t.pipe(sourcemaps.write());
    t = t.pipe(concat('app.css'));

    if (opts.minify) t = t.pipe(minify());
    return t.pipe(gulp.dest(settings.public));
  }

  gulp
    .task('css:build', function () {
      return css({ sourcemaps: true, minify: false });
    })

    .task('css:dist', function () {
      return css({ sourcemaps: false, minify: true });
    })

    .task('css:lint', function () {
      return gulp.src('./lib/**/*.styl')
        .pipe(stylint());
    })

    .task('css', ['css:build', 'css:lint'])
}
