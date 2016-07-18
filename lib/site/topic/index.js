/**
 * Module dependencies.
 */

var express = require('express')
var forumRouter = require('lib/forum-router')

/**
 * Exports Application
 */

var app = module.exports = express()

app.get(forumRouter('/topic/:id'), require('lib/layout'))
