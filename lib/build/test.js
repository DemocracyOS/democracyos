const gulp = require('gulp')
const jasmine = require('gulp-jasmine')
const mongoose = require('mongoose')

gulp.task('test', () => {
  const stream = gulp.src('test/**/*.js')
    .pipe(jasmine())

  stream.on('end', () => {
    // Some tests may require an active db connection.
    // If connection is not closed, the task process won't exit.
    // We perform the disconnection after all tests are done.
    mongoose.disconnect()
  })

  return stream
})
