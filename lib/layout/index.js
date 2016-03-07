/**
 * Module dependencies.
 */

var config = require('lib/config');
var clientConfig = require('lib/config/client');
var translations = require('lib/translations');
var findDefaultForum = require('lib/forum-middlewares').findDefaultForum;
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');

module.exports = function layout (req, res, next) {
  findDefaultForum(req, res, renderLayout.bind(renderLayout, req, res, next));
};

function renderLayout (req, res) {
  var locale = req.locale;

  res.render(html, {
    config: config,
    client: clientConfig,
    locale: locale,
    defaultForum: config.multiForum ? null : req.forum && req.forum.name,
    translations: translations[locale]
  });
}
