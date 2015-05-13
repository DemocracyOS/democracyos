var gulp = require('gulp');
var mkdirp = require('mkdirp');

module.exports = function (settings) {

  gulp
    .task('public', function () {
      mkdirp(settings.public);
    })
}
