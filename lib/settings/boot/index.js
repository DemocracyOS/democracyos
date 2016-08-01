var express = require('express')
var app = module.exports = express()

app.use(require('lib/settings/settings'))
app.use(require('lib/settings/forum-new'))
