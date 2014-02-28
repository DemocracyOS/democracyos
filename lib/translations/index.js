/**
 * Module dependencies.
 */

var en = require('./lib/en');
var es = require('./lib/es');
var ca = require('./lib/ca');

module.exports.help = function(t) {
  // English
  t.en = en;

  // Spanish
  t.es = es;

  // Català
  t.ca = ca;
}