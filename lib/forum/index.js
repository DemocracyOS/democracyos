var express = require('express');
var forumRouter = require('lib/forum-router');

var app = module.exports = express();

/**
 * GET Add democracy form
 */

app.get('/forums/new', require('lib/layout'));

/**
 * GET Forum Show
 */

app.get(forumRouter('/'), require('lib/layout'));
