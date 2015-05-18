var fs = require('fs');
var path = require('path');
var config = require('lib/config');
var log = require('debug')('democracyos:translations');
var defaultTranslations = require('./lib/'+config.locale);

var locales = fs.readdirSync(path.resolve(__dirname, 'lib')).map(function(v){
  return v.replace('.json', '');
});

locales.forEach(function(locale){
  var translations = require('./lib/'+locale);

  module.exports[locale] = translations;

  if (config.locale === locale) return;

  // Fallback missing translations to config.locale
  Object.keys(defaultTranslations).forEach(function(k){
    if (translations[k]) return;
    log('Warning: Missing translation on \'' + locale + '\': ' + k);
    translations[k] = defaultTranslations[k];
  });
});

module.exports.help = function(t) {
  locales.forEach(function(locale){
    t[locale] = module.exports[locale];
  });
}
