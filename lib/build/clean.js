var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');

module.exports = function (settings) {

  gulp
    .task('clean', function (done) {
      del([settings.public, './node_modules'], function (err, paths) {
        paths.forEach(function (path) {
          util.log(util.colors.magenta('delete'), path);
        });

        done(err);
      });
    })
}
