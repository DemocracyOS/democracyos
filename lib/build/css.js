var gulp = require('gulp')
var settings = require('./settings')
var stylint = require('gulp-stylint')
var stylus = require('gulp-stylus')
var concat = require('gulp-concat-css')
var minify = require('gulp-minify-css')
var sourcemaps = require('gulp-sourcemaps')
var gulpif = require('gulp-if')

module.exports = {
  build: function () {
    var bundles = settings.entries.map(function (entry) {
      var c = gulp.src('./lib/' + entry + '/boot/boot.styl')
        .pipe(gulpif(settings.sourcemaps, sourcemaps.init()))
        .pipe(stylus())
        .pipe(gulpif(settings.sourcemaps, sourcemaps.write()))
        .pipe(concat(entry + '.css'))
        .pipe(gulpif(settings.minify, minify()))
        .pipe(gulp.dest(settings.public))
      return c
    })

    return Promise.all(bundles)
  },

  lint: function () {
    return gulp.src('./lib/**/*.styl')
      .pipe(stylint())
  },

  watch: function () {
    return gulp.watch(['lib/**/*.styl'], ['css:build'])
  }

}
