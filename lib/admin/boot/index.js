var express = require('express')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.all('*', visibility)
app.use(require('lib/admin/admin'))
