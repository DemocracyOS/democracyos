/**
 * Module dependencies.
 */

var express = require('express')
var forumRouter = require('lib/forum-router')
var visibility = require('lib/visibility')

/**
 * Exports Application
 */

var app = module.exports = express()

app.use('*', visibility)

app.get(forumRouter('/admin'), require('lib/admin/layout'))
app.get(forumRouter('/admin/topics'), require('lib/admin/layout'))
app.get(forumRouter('/admin/topics/:id'), require('lib/admin/layout'))
app.get(forumRouter('/admin/topics/create'), require('lib/admin/layout'))
app.get(forumRouter('/admin/tags'), require('lib/admin/layout'))
app.get(forumRouter('/admin/tags/:id'), require('lib/admin/layout'))
app.get(forumRouter('/admin/tags/create'), require('lib/admin/layout'))
app.get(forumRouter('/admin/users'), require('lib/admin/layout'))
app.get(forumRouter('/admin/users/create'), require('lib/admin/layout'))
app.get(forumRouter('/admin/users/:id'), require('lib/admin/layout'))
app.get(forumRouter('/admin/permissions'), require('lib/admin/layout'))
