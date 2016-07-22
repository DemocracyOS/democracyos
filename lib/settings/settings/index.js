/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')

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
  app.get('/settings', redirect)
  app.get('/settings/:path', redirect)
}

app.get('/settings', require('lib/settings/layout'))
app.get('/settings/profile', require('lib/settings/layout'))
app.get('/settings/password', require('lib/settings/layout'))
app.get('/settings/notifications', require('lib/settings/layout'))
app.get('/settings/forums', require('lib/settings/layout'))
