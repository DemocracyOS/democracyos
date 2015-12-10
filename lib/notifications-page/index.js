/**
 * Module Dependencies
 */

var express = require('express');
var app = module.exports = express();

app.get('/notifications', require('lib/layout'));
