var merge = require('mout/object/merge')
var deepFillIn = require('mout/object/deepFillIn')
var config = require('lib/config')
var log = require('debug')('democracyos:translations')
var missing = require('./missing')
var translations = require('./all')
var baseLocale = require('./base-locale')

var available = config.availableLocales

// Throw a Warning if there are missing translations
Object.keys(missing).forEach(function (locale) {
  log("Warning: Missing translation keys on '" + locale + "':")
  missing[locale].forEach(function (key) {
    log('  - %s', key)
  })
})

var configTranslation = baseLocale !== config.locale ? translations[config.locale] : {}
var baseTranslation = merge(translations[baseLocale], configTranslation)

available.forEach(function (locale) {
  var translation = merge(baseTranslation, translations[locale])
  module.exports[locale] = translation
})

module.exports.help = function (t) {
  deepFillIn(t, translations)
}
