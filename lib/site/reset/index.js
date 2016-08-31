var express = require('express')
var app = module.exports = express()

app.get('/forgot/:id', require('lib/site/layout'))
