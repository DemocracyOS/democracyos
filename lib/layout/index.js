var path = require('path');
var config = require('lib/config');
var clientConfig = require('lib/config/client');
var translations = require('lib/translations');
var api = require('lib/db-api');

var html = path.resolve(__dirname, 'index.jade');

module.exports = function layout (req, res, next) {
  setDefaultForum(req, res, renderLayout.bind(renderLayout, req, res, next));
};

function renderLayout (req, res) {
  var locale = req.locale;

  res.render(html, {
    config: config,
    client: clientConfig,
    locale: locale,
    defaultForum: req.defaultForum,
    translations: translations[locale]
  });
}

var defaultForum = config.defaultForum;
function setDefaultForum (req, res, next) {
  if (config.multiForum) return next();

  if (defaultForum) {
    req.defaultForum = defaultForum;
    return next();
  }

  api.forum.findDefaultForum(function (err, forum) {
    if (err) return next(err);
    if (!forum) return next(null);
    defaultForum = forum.name;
    req.defaultForum = defaultForum;
    return next();
  });
}
