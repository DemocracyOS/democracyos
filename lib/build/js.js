var gulp = require('gulp');
var util = require('gulp-util');
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

var opts = {
  debug: settings.debug,
  extensions: ['.md', '.markdown'],
  cache: {},
  packageCache: {}
};

function bundle(b) {
  return b
    .add(settings.clientEntryPoint)
    .bundle()
    .on('error', function (err) {
      util.log(util.colors.red('error'), err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(!settings.debug, uglify()))
    .on('file', function (file, id) {
      if (settings.verbose) util.log(util.colors.cyan('file'), file);
    })
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
    var w = watchify(browserify(opts));

    w.transform(babel)
    .transform(markdown);

    w.on('update', function (ids) {
      util.log(util.colors.cyan('watch'), ids.join('\n'));
      return w.bundle();
    });

    w.on('log', function (msg) {
      util.log(util.colors.cyan('watch'), msg);
    });

    w.on('error', function (err) {
      console.log('my error: %s', err);
    })

    return bundle(w);
  }

};
