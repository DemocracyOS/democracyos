var express = require('express')
var forumRouter = require('lib/forum-router')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.get(forumRouter('/topic/:id'), visibility, require('lib/site/layout'))
