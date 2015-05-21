var gulp = require('gulp');
var settings = require('./settings');
var util = require('gulp-util');
var mkdirp = require('mkdirp');

function create (name, cb) {
  if (settings.verbose) util.log(util.colors.cyan('mkdirp'), name);
  mkdirp(settings.public, cb);
}

module.exports = function (done) {
  create(settings.public, done);
}
