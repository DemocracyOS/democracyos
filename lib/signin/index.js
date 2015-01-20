/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

app.get('/signin', require('lib/layout'));
app.get('/signin/:token', require('lib/layout'));