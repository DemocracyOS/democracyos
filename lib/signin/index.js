/**
 * Module dependencies.
 */

var config = require('lib/config');
var express = require('express');

var app = module.exports = express();

if (config.facebookSignin) {
  return app.get('/signin', function (req, res) {
    res.redirect('/auth/facebook');
  });
}

function redirect(req, res) {
  res.redirect(config.signinUrl);
}

if (config.signinUrl) app.get('/signin', redirect);

app.get('/signin', require('lib/layout'));
app.get('/signin/:token', require('lib/layout'));
