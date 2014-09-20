/**
 * Module dependencies.
 */

var stylus = require('stylus');

module.exports = function (options) {
  options = options || {};

  return function plugin(file, done) {
    if (file.extension !== 'styl') return done();
    file.read(function (err, string) {
      if (err) return done(err);

      var renderer = stylus(string);
      file.extension = 'css';
      renderer.render(function (err, css) {
        if(err) {
          done(err);
        } else {
          file.string = css;
          done();
        }
      });
    });
  }
}