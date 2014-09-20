/**
 * Module dependencies.
 */

var ca = require('./lib/ca');
var de = require('./lib/de');
var en = require('./lib/en');
var es = require('./lib/es');
var fr = require('./lib/fr');
var fi = require('./lib/fi');
var it = require('./lib/it');
var nl = require('./lib/nl');
var pt = require('./lib/pt');

module.exports.help = function(t) {

  // Català
  t.ca = ca;

  // German
  t.de = de;

  // English
  t.en = en;

  // Spanish
  t.es = es;

  // French
  t.fr = fr;

  // Finnish
  t.fi = fi;

  // Italian
  t.it = it;

  // Dutch
  t.nl = nl;

  // Portuguese
  t.pt = pt;
}
