var gulp = require('gulp');
var copyAssets = require('./copy-assets');

gulp
  .task('assets', ['public'], function () {
    gulp.src('./lib/**/assets/**', { nodir: true })
      .pipe(copyAssets('./public/'));
  })
