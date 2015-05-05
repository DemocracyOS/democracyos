/**
 * Module dependencies.
 */

var express = require('express');
var config = require('lib/config');

var app = module.exports = express();

if (config.facebookSignin) {
  return app.get('/signup', function (req, res) {
    res.redirect('/auth/facebook');
  });
}

function redirect(req, res, next) {
  var path = req.params.path || '';
  var url = config.signupUrl + (path ? '/' + path : '');
  res.redirect(url);
}

if (config.signupUrl) {
  app.get('/signup', redirect);
  app.get('/signup/:path', redirect);
};

app.get('/signup', require('lib/layout'));
app.get('/signup/validate/:token', require('lib/layout'));
app.get('/signup/validated', require('lib/layout'));
app.get('/signup/resend-validation-email', require('lib/layout'));
