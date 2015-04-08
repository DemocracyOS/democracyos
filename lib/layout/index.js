/**
 * Module dependencies.
 */

var config = require('lib/config');
var translations = require('lib/translations');
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');
var log = require('debug')('democracyos:layout');

module.exports = function (req, res) {
  var client = {};

  config.client.forEach(function(k) {
    client[k] = config[k];
  });

  log('Rendering locale: %s', req.locale);
  var trans = translations[req.locale];
  res.render(html, { config: config, client: client, translations: trans, locale: req.locale });
};
