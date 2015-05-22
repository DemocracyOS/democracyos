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

var opts = {
  debug: settings.sourcemaps,
  extensions: ['.md', '.markdown'],
  cache: {},
  packageCache: {}
};

function bundle(b) {
  var log = Log('js:build');
  log.info(settings.minify ? 'Bundling minified' : 'Bundling not minified');
  log.info(settings.sourcemaps ? 'Bundling with sourcemaps' : 'Bundling without sourcemaps');

  return b
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

    w.transform(babel)
    .transform(markdown);

    w.on('update', function (ids) {
      log.info(ids.join('\n'));
      return w.bundle();
    });

    w.on('log', function (msg) {
      log.info(msg);
    });

    return bundle(w);
  }

};
