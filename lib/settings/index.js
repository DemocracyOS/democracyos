/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Exports Application
 */

var app = module.exports = express();

app.get('/settings', require('lib/layout'));
app.get('/settings/profile', require('lib/layout'));
app.get('/settings/password', require('lib/layout'));
app.get('/settings/notifications', require('lib/layout'));