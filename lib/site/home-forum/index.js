var express = require('express')
var forumRouter = require('lib/forum-router')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.get(forumRouter(), visibility, require('lib/site/layout'))
