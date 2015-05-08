var gulp = require('gulp');
var exec = require('child_process').exec;

module.exports = function (settings) {

  gulp
    .task('serve', ['watch'], function (cb) {
      exec('NODE_PATH=. DEBUG=democracyos* node index.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      });
    })
}
