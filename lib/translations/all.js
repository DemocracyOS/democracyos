/**
 * Module Dependencies
 */

var config = require('lib/config')
var available = config.availableLocales

var translations = {}

available.forEach(function (locale) {
  translations[locale] = require('./lib/' + locale)
})

// Show original translation on locale name
available.forEach(function (locale) {
  var key = 'settings.locale.' + locale
  var original = translations[locale][key]
  if (!original) return

  available.forEach(function (_locale) {
    if (locale === _locale) return
    var current = translations[_locale][key] ? ' / ' + translations[_locale][key] : ''
    translations[_locale][key] = original + current
  })
})

module.exports = translations
