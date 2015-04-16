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

      stylus(string)
        .set('compress', options.compress)
        .render(function(err, css){
          if (err) return done(err);
          file.string = css;
          done();
        });
    });
  }
}