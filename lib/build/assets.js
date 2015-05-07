var gulp = require('gulp');
var copyAssets = require('./copy-assets');

gulp
  .task('assets', ['public'], function () {
    gulp.src('./lib/**/assets/*')
      .pipe(copyAssets('./public/'));
  })
