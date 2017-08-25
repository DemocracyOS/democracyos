var locale = require('locale')
var log = require('debug')('democracyos:l10n')
var config = require('lib/config')

locale.Locale.default = config.locale
var available = new locale.Locales(config.availableLocales)

function requestLocale (req) {
  if (!req.headers['accept-language']) return locale.Locale.default
  var loc = new locale.Locales(req.headers['accept-language'])
  return loc.best(available).toString()
}

function middleware (req, res, next) {
  var best

  if (config.enforceLocale) {
    log('Using application locale')
    best = locale.Locale.default
  } else if (req.user && req.user.locale) {
    log('Using user configured locale')
    best = req.user.locale
  } else {
    log('Inferring user locale from HTTP header accept-language: %s', req.headers['accept-language'])
    best = requestLocale(req)
  }

  log('Setting locale: %s', best)
  req.locale = best
  next()
}

module.exports = {
  requestLocale: requestLocale,
  middleware: middleware
}
