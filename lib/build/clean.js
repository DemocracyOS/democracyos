var gulp = require('gulp');
var settings = require('./settings');
var util = require('gulp-util');
var del = require('del');

module.exports = function (done) {
  del([settings.public, './node_modules'], function (err, paths) {
    paths.forEach(function (path) {
      util.log(util.colors.magenta('delete'), path);
    });

    done(err);
  });
}
