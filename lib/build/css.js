var gulp = require('gulp');
var stylint = require('gulp-stylint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat-css');
var minify = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');

gulp
  .task('css:build', function () {
    var production = false;
    var t = gulp.src('./lib/**/*.styl')
    if (!production) t = t.pipe(sourcemaps.init());
    t = t.pipe(stylus())
    if (!production) t = t.pipe(sourcemaps.write());
    // t = t.pipe(addsrc('./node_modules/**/*.css'))
    t= t.pipe(concat('app.css'));

    if (production) t = t.pipe(minify());
    t.pipe(gulp.dest('./public/'));

  })
  .task('css:lint', function () {
    gulp.src('./lib/**/*.styl')
      .pipe(stylint());
  })
  .task('css', ['css:build', 'css:lint'])
