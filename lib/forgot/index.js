/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Exports Application
 */

var app = module.exports = express();

app.get('/forgot', require('lib/layout'));
app.get('/forgot/reset/:id', require('lib/layout'));