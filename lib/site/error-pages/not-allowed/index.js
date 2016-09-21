var express = require('express')
var app = module.exports = express()

app.get('/401', require('lib/site/layout'))
