var gulp = require('gulp');
var settings = require('./settings');
var browserify = require('browserify');
var babel = require('babelify');
var markdown = require('markdownify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var watchify = require('watchify');
var gulpif = require('gulp-if');
var Log = require('./log');
var livereload = require('gulp-livereload');

var opts = {
  debug: settings.sourcemaps,
  extensions: ['.md', '.markdown'],
  cache: {},
  packageCache: {}
};

function bundle(b) {
  var log = Log('js:build');

  var b = b
    .add(settings.clientEntryPoint)
    .on('file', function (file, id) {
      log.debug(file);
    })
    .bundle()
    .on('error', function (err) {
      log.error(err.toString());
      this.emit('end');
      process.exit(1);
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(settings.minify, uglify()))
    .pipe(gulp.dest(settings.public));

  if (settings.livereload) b = b.pipe(livereload({ start: true }));
  return b;
}

/*
 * Define tasks
 */

module.exports = {

  lint: function () {
    return gulp.src('./lib/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  },

  build: function () {
    return bundle(browserify(opts)
    .transform(babel)
    .transform(markdown));
  },

  watch: function () {
    var log = Log('watch');
    var w = watchify(browserify(opts));

    w.on('update', function (ids) {
      log.info(ids.join('\n'));
      w = w.bundle()
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulpif(settings.minify, uglify()))
      .pipe(gulp.dest(settings.public));

      if (settings.livereload) w = w.pipe(livereload({ start: true }));
      return w;
    });

    w.on('log', function (msg) {
      log.info(msg);
    });

    w.transform(babel)
    .transform(markdown);

    return bundle(w);
  }

};
