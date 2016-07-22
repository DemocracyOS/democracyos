var gulp = require('gulp')
var settings = require('./settings')
var browserify = require('browserify')
var babel = require('babelify')
var markdown = require('markdownify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gulpEslint = require('gulp-eslint')
var watchify = require('watchify')
var gulpif = require('gulp-if')
var Log = require('./log')
var livereload = require('gulp-livereload')

var opts = {
  debug: settings.sourcemaps,
  extensions: ['.md', '.markdown'],
  cache: {},
  packageCache: {}
}

function bundle (b, entry) {
  var log = Log('js:build')

  return b
    .add('./lib/' + entry + '/boot/boot.js')
    .on('file', function (file, id) {
      log.debug(file)
    })
    .bundle()
    .on('error', function (err) {
      log.error(err.toString())
      this.emit('end')
      process.exit(1)
    })
    .pipe(source(entry + '.js'))
    .pipe(buffer())
    .pipe(gulpif(settings.minify, uglify()))
    .pipe(gulp.dest(settings.public))
}

/*
 * Define tasks
 */

module.exports = {
  lint: function () {
    return gulp.src('./lib/**/*.js')
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
  },

  build: function () {
    var bundles = settings.entries.map(function (entry) {
      return bundle(browserify(opts)
        .transform(babel)
        .transform(markdown), entry)
    })

    return Promise.all(bundles)
  },

  watch: function () {
    var log = Log('watch')
    var w = watchify(browserify(opts), { ignoreWatch: true })

    w.on('update', function (ids) {
      log.info(ids.join('\n'))
      // lint(ids, log) // Weird error, commenting for now.

      return w.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpif(settings.minify, uglify()))
        .pipe(gulp.dest(settings.public))
        .pipe(livereload({ start: true, quiet: true }))
    })

    w.on('log', function (msg) {
      log.info(msg)
    })

    w.transform(babel)
      .transform(markdown)

    return bundle(w)
  }

}
