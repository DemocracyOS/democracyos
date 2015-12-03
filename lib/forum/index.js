var express = require('express');
var forumRouter = require('lib/forum-router');
var middlewares = require('../forum-middlewares');
var private = middlewares.private;
var forum = middlewares.forum;

var app = module.exports = express();

/**
 * GET Add democracy form
 */

app.get('/forums/new', require('lib/layout'));

/**
 * GET Forum Show
 */

app.get(forumRouter('/'), forum, private, require('lib/layout'));
