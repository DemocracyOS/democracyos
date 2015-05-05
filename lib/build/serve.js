var gulp = require('gulp');
var exec = require('child_process').exec;

gulp
  .task('serve', function (cb) {
    exec('NODE_PATH=. DEBUG=democracyos* node index.js', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  })
