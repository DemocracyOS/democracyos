/**
 * Module dependencies.
 */

var en = require('./en');
var es = require('./es');

module.exports.help = function(t) {
  // Load Spanish translations
  t.es = es;

  // Load English translations
  t.en = en;
}