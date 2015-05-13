var gulp = require('gulp');
var util = require('gulp-util');
var rm = require('rimraf');

function del (file) {
  util.log(util.colors.red('delete: '), file);
  // FIXME: Find a better way to chain all delete operations.
  // Maybe using promises?
  rm(file, function () {});
}

module.exports = function (settings) {

  gulp
    .task('clean', function (cb) {
      del(settings.public);
      del('./node_modules');
      cb(); // FIXME: This ensures 'task finished' message shows up
    })
}