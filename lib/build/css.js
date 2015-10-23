var gulp = require('gulp');
var settings = require('./settings');
var stylint = require('gulp-stylint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');
var gulpif = require('gulp-if');
var Log = require('./log');
var livereload = require('gulp-livereload');

module.exports = {

  build: function () {
    var log = Log('css:build');

    var c = gulp.src(settings.stylEntryPoint)
      .pipe(gulpif(settings.sourcemaps, sourcemaps.init()))
      .pipe(stylus())
      .pipe(gulpif(settings.sourcemaps, sourcemaps.write()))
      .pipe(concat('app.css'))
      .pipe(gulpif(settings.minify, minify()))
      .pipe(gulp.dest(settings.public));

    if (settings.livereload) c = c.pipe(livereload({ start: true }));
    return c;
  },

  lint: function () {
    return gulp.src('./lib/**/*.styl')
      .pipe(stylint());
  },

  watch: function () {
    return gulp.watch(['lib/**/*.styl'], ['css:build']);
  }

};
