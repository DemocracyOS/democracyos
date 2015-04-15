/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express();
var config = require('lib/config');

function redirect(req, res, next) {
  res.redirect(config('signin url'));
}

if (config('signin url')) {
  app.get('/signin', redirect);
}

app.get('/signin', require('lib/layout'));
app.get('/signin/:token', require('lib/layout'));
