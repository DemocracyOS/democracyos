var express = require('express')
var app = module.exports = express()

app.get('/forgot', require('lib/site/layout'))
