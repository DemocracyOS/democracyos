var gulp = require('gulp')
var settings = require('./settings')
var stylint = require('gulp-stylint')
var stylus = require('gulp-stylus')
var concat = require('gulp-concat-css')
var minify = require('gulp-minify-css')
var sourcemaps = require('gulp-sourcemaps')
var gulpif = require('gulp-if')

module.exports = function (entries) {
  return {
    build: function () {
      var bundles = entries.map(function (file) {
        var c = gulp.src(file[0])
          .pipe(gulpif(settings.sourcemaps, sourcemaps.init()))
          .pipe(stylus())
          .pipe(gulpif(settings.sourcemaps, sourcemaps.write()))
          .pipe(concat(file[1]))
          .pipe(gulpif(settings.minify, minify()))
          .pipe(gulp.dest(settings.public))
        return c
      })

      return Promise.all(bundles)
    },

    lint: function () {
      return gulp.src('./*/**/*.styl')
        .pipe(stylint())
    },

    watch: function () {
      return gulp.watch(['./*/**/*.styl'], ['css:build'])
    }

  }
}
