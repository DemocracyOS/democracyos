var gulp = require('gulp');
var settings = require('./settings');
var stylint = require('gulp-stylint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');

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

module.exports = {

  build: function () {
    return css({ sourcemaps: true, minify: false });
  },

  dist: function () {
    return css({ sourcemaps: false, minify: true });
  },

  lint: function () {
    return gulp.src('./lib/**/*.styl')
      .pipe(stylint());
  },

  watch: function () {
    return gulp.watch(['lib/**/*.styl'], ['css:build']);
  }

};
