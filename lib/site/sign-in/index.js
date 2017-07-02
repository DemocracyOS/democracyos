/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')

var app = module.exports = express()

function redirect (req, res) {
  res.redirect(config.signinUrl)
}

if (config.signinUrl) app.get('/signin', redirect)

app.get('/signin', require('lib/site/layout'))
app.get('/signin/:token', require('lib/site/layout'))
