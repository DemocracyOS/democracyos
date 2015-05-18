var gulp = require('gulp');
var util = require('gulp-util');
var mkdirp = require('mkdirp');

module.exports = function (settings) {

  function create (name, cb) {
    if (settings.verbose) util.log(util.colors.cyan('mkdirp'), name);
    mkdirp(settings.public, cb);
  }

  gulp
    .task('public', function (done) {
      create(settings.public, done);
    })
}
