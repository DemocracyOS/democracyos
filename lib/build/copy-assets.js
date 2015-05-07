var gulp = require('gulp');

module.exports = function (dir) {
  return gulp.dest(function (file) {
    var fullPath = file.history[0];
    var relativePath = fullPath.replace(file.base, '');
    var relativeDest = relativePath.replace(/\/assets/, '');
    var dest = dir + relativeDest;
    console.log(dest);
    return dest;
  });
};
