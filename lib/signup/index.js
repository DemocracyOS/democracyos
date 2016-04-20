/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var config = require('lib/config');
var authFacebookRestrict = require('lib/auth-facebook/middlewares').restrict;
var authGoogleRestrict = require('lib/auth-google/middlewares').restrict;

function redirect(req, res) {
  var path = req.params.path || '';
  var url = config.signupUrl + (path ? '/' + path : '');
  res.redirect(url);
}

if (config.signupUrl) {
  app.get('/signup', redirect);
  app.get('/signup/:path', redirect);
}

app.get('/signup', require('lib/layout'));
app.get('/signup/validate/:token', authFacebookRestrict, authGoogleRestrict, require('lib/layout'));
app.get('/signup/validated', authFacebookRestrict, authGoogleRestrict, require('lib/layout'));
app.get('/signup/resend-validation-email', authFacebookRestrict, authGoogleRestrict, require('lib/layout'));
