
var t = require('t');
var request = require('request');

module.exports.supported = require('./supported');

module.exports.change = function (newLocale, cb) {
  // To show language change instantly, I have to do a window.location
  // Just changing t.lang doesn't seems to be working :-(
  // This implies a change in the behavior of the app, which is no longer showing a message after saving changes,
  // now is redirecting to /.
  window.location = '/';
  // request
  // .get('/lib/translations/lib/' + newLocale + '.json')
  // .end(function(err, res) {
  //   if (err) return cb(err);
  //   var translations = res.body;
  //   t[newLocale] = translations;
  //   t.lang(newLocale);
  // })
};