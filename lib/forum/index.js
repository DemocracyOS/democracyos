var express = require('express');
var forumRouter = require('lib/forum-router');
var middlewares = require('./middlewares');

var app = module.exports = express();

/**
 * GET Add democracy form
 */

app.get('/forums/new', require('lib/layout'));

/**
 * GET Forum Show
 */

app.get(forumRouter('/'), middlewares.restrictPermissionsChange, require('lib/layout'));
