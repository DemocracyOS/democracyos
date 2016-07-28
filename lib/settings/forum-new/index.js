var express = require('express')
var forumRouter = require('lib/forum-router')

var app = module.exports = express()
var visibility = require('lib/visibility')

/**
 * GET Add democracy form
 */

app.get('/forums/new', visibility, require('lib/settings/layout'))

/**
 * GET Forum Show
 */

app.get(forumRouter(), visibility, require('lib/settings/layout'))
