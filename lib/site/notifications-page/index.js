/**
 * Module Dependencies
 */

var express = require('express')
var app = module.exports = express()
var visibility = require('lib/visibility')

app.get('/notifications', visibility, require('lib/site/layout'))
