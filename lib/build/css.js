const gulp = require('gulp')
const stylint = require('gulp-stylint')
const stylus = require('gulp-stylus')
const concat = require('gulp-concat-css')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const gulpif = require('gulp-if')
const settings = require('./settings')

module.exports = function buildCss (entries) {
  return {
    build: function () {
      const bundles = Object.keys(entries).map(function (key) {
        const c = gulp.src(entries[key])
          .pipe(gulpif(settings.sourcemaps, sourcemaps.init()))
          .pipe(stylus({ path: ['.', '../../'] }))
          .pipe(gulpif(settings.sourcemaps, sourcemaps.write()))
          .pipe(concat(key))
          .pipe(gulpif(settings.minify, cleanCSS({
            level: { 2: { all: false, removeDuplicateRules: true } }
          })))
          .pipe(gulpif(settings.minify, autoprefixer()))
          .pipe(gulp.dest(settings.public))

        return c
      })

      return Promise.all(bundles)
    },

    lint: function () {
      return gulp.src('./*/**/*.styl').pipe(stylint())
    },

    watch: function () {
      return gulp.watch(['./{lib,ext}/**/*.styl'], ['css:build'])
    }
  }
}
