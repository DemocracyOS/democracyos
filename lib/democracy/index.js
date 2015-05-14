/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

/**
 * GET Add democracy form
 */

app.use('/democracies/new', require('lib/layout'));
