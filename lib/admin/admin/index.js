/**
 * Module dependencies.
 */

var express = require('express')
var urlBuilder = require('lib/url-builder')
var visibility = require('lib/visibility')

/**
 * Exports Application
 */

var app = module.exports = express()

app.use(urlBuilder.for('admin.wild'), visibility)
app.get(urlBuilder.for('admin'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.topics'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.topics.id'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.topics.create'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.tags'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.tags.id'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.tags.create'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.users'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.users.create'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.users.id'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.permissions'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.comments'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.tags-moderation'), require('lib/admin/layout'))
app.get(urlBuilder.for('admin.forum.edit'), require('lib/admin/layout'))
