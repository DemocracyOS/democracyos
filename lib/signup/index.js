/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var config = require('lib/config');

if (config['authPages'].signupUrl) return;

app.get('/signup', require('lib/layout'));
app.get('/signup/validate/:token', require('lib/layout'));
app.get('/signup/validated', require('lib/layout'));
app.get('/signup/resend-validation-email', require('lib/layout'));