var path = require('path')
var express = require('express')
var config = require('lib/config')
var clientConfig = require('lib/config/client')
var translations = require('lib/translations')
var setDefaultForum = require('lib/middlewares/forum-middlewares').setDefaultForum

var defaultHtml = path.resolve(__dirname, 'index.jade')

module.exports = function layout (template) {
  if (!template) template = defaultHtml

  var router = express.Router()

  router.use(setDefaultForum, renderLayout(template))

  return router
}

function renderLayout (template) {
  return function _renderLayout (req, res) {
    var locale = req.locale

    res.render(template, {
      config: config,
      client: clientConfig,
      locale: locale,
      defaultForum: req.defaultForum,
      translations: translations[locale]
    })
  }
}
