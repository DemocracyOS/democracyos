var gulp = require('gulp');
var util = require('gulp-util');
var browserify = require('browserify');
var babel = require('babelify');
var markdown = require('markdownify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');

module.exports = function (settings) {

  function bundle (opts) {
    opts = opts || {};
    var b = browserify({
      extensions: ['.md', '.markdown'],
      debug: opts.debug
    });

    if (settings.verbose) b.on('file', function (file, id) { util.log(util.colors.cyan('file'), file) });

    b = b.transform(babel)
      .transform(markdown)
      .add(settings.clientEntryPoint)
      .bundle()
      .on('error', function (err) {
        util.log(util.colors.red('error'), err);
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(buffer());

    return b;
  }

  /*
   * Define tasks
   */

  gulp
    .task('js:lint', function () {
      return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    })

    .task('js:build', ['public'], function () {
      return bundle({ debug: true })
        .pipe(gulp.dest(settings.public));
    })

    .task('js:dist', ['public'], function () {
      return bundle({ debug: false })
        .pipe(uglify())
        .pipe(gulp.dest(settings.public))
    })
}
