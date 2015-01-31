/**
 * Module dependencies.
 */

var ca = require('./lib/ca');
var de = require('./lib/de');
var en = require('./lib/en');
var es = require('./lib/es');
var fr = require('./lib/fr');
var fi = require('./lib/fi');
var gl = require('./lib/gl');
var it = require('./lib/it');
var nl = require('./lib/nl');
var pt = require('./lib/pt');
var ru = require('./lib/ru');
var sv = require('./lib/sv');
var uk = require('./lib/uk');

module.exports.help = function(t) {

  // Catalan
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

  // Galician
  t.gl = gl;

  // Italian
  t.it = it;

  // Dutch
  t.nl = nl;

  // Portuguese
  t.pt = pt;

  // Russian
  t.ru = ru;

  // Swedish
  t.sv = sv;

  // Ukranian
  t.uk = uk;
}
