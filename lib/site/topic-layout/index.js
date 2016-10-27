var express = require('express')
var urlBuilder = require('lib/url-builder')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.get(urlBuilder.for('site.topic'), visibility, require('lib/site/layout'))
