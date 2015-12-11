const gulp = require('gulp');
const jasmine = require('gulp-jasmine');

gulp.task('test', () => {
  return gulp.src('test/**/*.js')
    .pipe(jasmine())
})
