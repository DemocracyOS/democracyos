var gulp = require('gulp')
var settings = require('./settings')
var stylint = require('gulp-stylint')
var pleeease = require('gulp-pleeease')

var entries = [
  ['./lib/boot/boot.styl', 'lala.css'],
  ['./lib/**/*.styl', 'all.css']
  // [settings.stylEntryPoint, 'lalala.css']
]

module.exports = {
  build: function () {
    var files = entries.map(function (file) {
      return gulp.src(file[0])
        .pipe(pleeease({
          out: file[1],
          stylus: {
            'include css': true,
            'line-numbers': !settings.minify,
            sourcemap: settings.sourcemaps
          },
          mqpacker: true,
          minifier: settings.minify,
          sourcemaps: settings.sourcemaps
        }))
        .pipe(gulp.dest('public'))
    })

    return Promise.all(files)
  },

  lint: function () {
    return gulp.src('./lib/**/*.styl')
      .pipe(stylint())
  },

  watch: function () {
    return gulp.watch(['lib/**/*.styl'], ['css:build'])
  }

}
