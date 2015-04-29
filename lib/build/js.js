var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');

gulp
  .task('javascript', ['js:build', 'js:lint'])

  .task('js:lint', function () {
    gulp.src('./lib/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  })

  .task('js:build', ['public'], function () {
    var production = false;
    var b = browserify({ entries: './lib/boot/boot.js', debug: !production });
    b = b
      .transform(babelify)
      .bundle()
      .pipe(source('app.js'))
      .pipe(buffer());

    if (!production) b = b.pipe(sourcemaps.init({ loadMaps: true }))
    if (production) b = b.pipe(uglify());
    if (!production) b = b.pipe(sourcemaps.write('./'))

    b.pipe(gulp.dest('./public/'));
  })
