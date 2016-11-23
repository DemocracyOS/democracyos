var express = require('express')

var app = module.exports = express()

app.get('/forgot/reset/:id', require('lib/site/layout'))
