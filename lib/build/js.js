var gulp = require('gulp');
var util = require('gulp-util');
var browserify = require('browserify');
var babel = require('babelify');
var markdown = require('markdownify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var watchify = require('watchify');

module.exports = function (settings) {

  var opts = {
    extensions: ['.md', '.markdown'],
    debug: settings.debug,
    cache: {},
    packageCache: {}
  };

  function bundle(b) {
    var w = b
      .add(settings.clientEntryPoint)
      .bundle()
      .on('error', function (err) {
        util.log(util.colors.red('error'), err.toString());
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(buffer());

    if (settings.verbose) w.on('file', function (file, id) { util.log(util.colors.cyan('file'), file) });
    if (!settings.debug) w = w.pipe(uglify());
    return w.pipe(gulp.dest(settings.public));
  }

  /*
   * Define tasks
   */

  return {
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

}
