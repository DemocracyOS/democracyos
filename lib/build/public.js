var gulp = require('gulp');
var mkdirp = require('mkdirp');

gulp
  .task('public', function () {
    mkdirp('./public');
  })
