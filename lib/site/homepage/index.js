/**
 * Module dependencies.
 */

var express = require('express')
var app = module.exports = express()
var visibility = require('lib/visibility')

app.get('/', visibility, require('lib/site/layout'))
