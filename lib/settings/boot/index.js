var express = require('express')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.all('*', visibility)

app.use('/settings', require('lib/api/settings-api'))

app.use(require('lib/settings/settings'))
app.use(require('lib/settings/forum-new'))
