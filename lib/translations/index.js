/**
 * Module dependencies.
 */

var en = require('./lib/en');
var es = require('./lib/es');

module.exports.help = function(t) {
  // English
  t.en = en;

  // Spanish
  t.es = es;
}