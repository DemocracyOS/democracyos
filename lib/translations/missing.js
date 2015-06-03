var translations = require('./all');
var available = require('./available');
var baseLocale = require('./base-locale');

var baseTranslation = translations[baseLocale];
var baseKeys = Object.keys(baseTranslation);

var missing = module.exports = {};

available.forEach(function(locale){
  if (baseLocale === locale) return;

  var translation = translations[locale];
  var missingKeys = [];

  baseKeys.forEach(function(key){
    if (!translation[key]) missingKeys.push(key);
  });

  if (missingKeys.length) missing[locale] = missingKeys;
});
