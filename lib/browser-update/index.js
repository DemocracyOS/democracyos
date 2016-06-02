/**
 * Module dependencies.
 */

var config = require('lib/config')
var jade = require('jade')
var path = require('path')
var resolve = path.resolve
var t = require('t-component')
var html = jade.renderFile(resolve(__dirname, 'index.jade'), { config: config, t: t })
var express = require('express')
var app = module.exports = express()
var bowser = require('bowser')

app.get('/browser-update', function (req, res, next) {
  res.send(200, html)
})

app.get('*', function (req, res, next) {
  // Check the user agent, and if is invalid, redirect to the page
  // for browser update.
  var userAgent = bowser.browser._detect(req.headers['user-agent'])
  if (userAgent.msie && userAgent.version <= 9) {
    res.redirect(302, '/browser-update')
  } else {
    next()
  }
})
