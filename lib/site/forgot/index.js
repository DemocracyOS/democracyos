/**
 * Module dependencies.
 */

var express = require('express')

/**
 * Exports Application
 */

var app = module.exports = express()

app.get('/forgot', require('lib/site/layout'))
app.get('/forgot/:id', require('lib/site/layout'))
