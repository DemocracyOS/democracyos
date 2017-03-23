const merge = require('mout/object/merge')
const deepFillIn = require('mout/object/deepFillIn')
const config = require('lib/config')
const translations = require('./all')
const baseLocale = require('./base-locale')

const available = config.availableLocales

const configTranslation = baseLocale !== config.locale
  ? translations[config.locale] : {}
const baseTranslation = merge(translations[baseLocale], configTranslation)

available.forEach(function (locale) {
  module.exports[locale] = merge(baseTranslation, translations[locale])
})

module.exports.help = function (t) {
  deepFillIn(t, translations)
}
