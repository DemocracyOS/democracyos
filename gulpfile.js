var exec = require('child_process').exec;
var gulp = require('gulp');
var mkdirp = require('mkdirp');

require('./lib/build/js');
require('./lib/build/css');

gulp
  .task('serve', function (cb) {
    exec('NODE_PATH=. DEBUG=democracyos* node index.js', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  })
  .task('public', function () {
    mkdirp('./public');
  })
  // .task('watch', function () {
  //   gulp.watch(['lib/**/*.js, lib/**/*.jade'], ['javascript'])
  // })
  .task('build', ['javascript', 'css'])
  .task('default', ['serve'])