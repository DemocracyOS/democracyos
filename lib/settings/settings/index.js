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
  app.get('/settings/:path', visibility, redirect)
}

app.get('/settings', visibility, require('lib/settings/layout'))
app.get('/settings/profile', visibility, require('lib/settings/layout'))
app.get('/settings/password', visibility, require('lib/settings/layout'))
app.get('/settings/notifications', visibility, require('lib/settings/layout'))
app.get('/settings/forums', visibility, require('lib/settings/layout'))
