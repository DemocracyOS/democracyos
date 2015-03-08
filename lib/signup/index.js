/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var config = require('lib/config');

function redirect(req, res, next) {
  var path = req.params.path || '';
  var url = config('signup url') + (path ? '/' + path : '');
  res.redirect(url);
}

if (config('signup url')) {
  app.get('/signup', redirect);
  app.get('/signup/:path', redirect);
};

app.get('/signup', require('lib/layout'));
app.get('/signup/validate/:token', require('lib/layout'));
app.get('/signup/validated', require('lib/layout'));
app.get('/signup/resend-validation-email', require('lib/layout'));
