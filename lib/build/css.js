var gulp = require('gulp');
var settings = require('./settings');
var stylint = require('gulp-stylint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');
var gulpif = require('gulp-if');

function css (opts) {
  opts = opts || {};
  var t = gulp.src('./lib/boot/boot.styl')
    .pipe(gulpif(opts.sourcemaps, sourcemaps.init()))
    .pipe(stylus())
    .pipe(gulpif(opts.sourcemaps, sourcemaps.write()))
    .pipe(concat('app.css'))
    .pipe(gulpif(opts.minify, minify()))
    .pipe(gulp.dest(settings.public));
}

module.exports = {

  build: function () {
    return css({ sourcemaps: settings.debug, minify: !settings.debug });
  },

  lint: function () {
    return gulp.src('./lib/**/*.styl')
      .pipe(stylint());
  },

  watch: function () {
    return gulp.watch(['lib/**/*.styl'], ['css:build']);
  }

};
