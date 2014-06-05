/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();

app.get('/signup', require('lib/layout'));
app.get('/signup/validate/:token', require('lib/layout'));
app.get('/signup/validated', require('lib/layout'));
app.get('/signup/resend-validation-email', require('lib/layout'));