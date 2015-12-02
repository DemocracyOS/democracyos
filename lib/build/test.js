const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('test', () => {
  return gulp.src('test/api/forum/index.js')
    .pipe(jasmine())
})
