var express = require('express')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.use(require('lib/site/signin'))
app.use(require('lib/site/signup'))
app.use(require('lib/site/forgot'))

app.all('*', visibility)
app.use(require('lib/site/help'))
app.use(require('lib/site/homepage'))
app.use(require('lib/site/topic'))
app.use(require('lib/site/notifications-page'))
app.use(require('lib/site/forum-new'))
