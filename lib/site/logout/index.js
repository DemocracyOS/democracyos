var express = require('express')

var app = module.exports = express()

app.get('/logout', require('lib/site/layout'))
