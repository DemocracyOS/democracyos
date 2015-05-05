var gulp = require('gulp');

require('./lib/build/js');
require('./lib/build/css');
require('./lib/build/public');
require('./lib/build/serve');

gulp
  // .task('watch', function () {
  //   gulp.watch(['lib/**/*.js, lib/**/*.jade'], ['javascript'])
  // })
  .task('build', ['javascript', 'css'])
  .task('default', ['build', 'serve'])