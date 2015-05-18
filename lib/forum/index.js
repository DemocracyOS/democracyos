/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

/**
 * GET Add democracy form
 */

app.use('/forums/new', require('lib/layout'));
