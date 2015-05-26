var config = require('lib/config');
var supported = require('./supported');
var locale = require('locale');
var jwt = require('lib/jwt');
var log = require('debug')('democracyos:l10n');

module.exports.supported = supported;

module.exports.middleware = function (req, res, next) {
  var best;
  var supported = new locale.Locales(module.exports.supported);

  if (req.user && req.user.locale) {
    log('Using user configured locale');
    best = (new locale.Locales(req.user.locale)).best(supported).toString();
  } else if (req.headers["accept-language"]) {
    log('Inferring user locale from HTTP header accept-language: %s', req.headers["accept-language"]);
    best = (new locale.Locales(req.headers["accept-language"])).best(supported).toString();
  } else {
    log('Defaulting to environment variable locale');
    best = config.locale;
  }

  log('Setting locale: %s', best);
  req.locale = best;
  next();
};
