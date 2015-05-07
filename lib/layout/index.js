/**
 * Module dependencies.
 */

var config = require('lib/config');
var clientConfig = require('lib/config/client');
var translations = require('lib/translations');
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');
var log = require('debug')('democracyos:layout');

module.exports = function (req, res) {
  var locale = req.locale;

  res.render(html, {
    config: config,
    client: clientConfig,
    locale: locale,
    translations: translations[locale]
  });
};
