/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var visibility = require('lib/visibility')

/**
 * Exports Application
 */

var app = module.exports = express()

function redirect (req, res) {
  var path = req.params.path || ''
  var url = config.settingsUrl + (path ? '/' + path : '')
  res.redirect(url)
}

if (config.settingsUrl) {
  app.get('/settings', visibility, redirect)
  app.get('/settings/:section', visibility, redirect)
} else {
  app.get('/settings', visibility, require('lib/settings/layout'))
  app.get('/settings/:section', visibility, require('lib/settings/layout'))
}
