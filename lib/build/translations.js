var log = require('debug')('democracyos:build:translations');

module.exports = function(options) {
  options = options || {};
  var locale = options.locale || 'en';

  return function translations(file, done) {
    if (file.path !== 'lib/' + locale + '.json') return done();
    log('Processing ' + file.path);
    file.read(function (err, string) {
      if (err) return done(err);
      try {
        JSON.parse(string);
      } catch (err) {
        done(new Error('"' + file.filename + '" is invalid JSON'));
        return;
      }
      file.string = string;
      file.define = true;
      done();
    })
  };
};