/**
 * Module dependencies.
 */

var express = require('express')
var app = module.exports = express()
var config = require('lib/config')

function redirect (req, res) {
  var path = req.params.path || ''
  var url = config.signupUrl + (path ? '/' + path : '')
  res.redirect(url)
}

if (config.signupUrl) {
  app.get('/signup', redirect)
  app.get('/signup/:path', redirect)
}

app.get('/signup', require('lib/site/layout'))
app.get('/signup/validate/:token', require('lib/site/layout'))
app.get('/signup/resend-validation-email', require('lib/site/layout'))
