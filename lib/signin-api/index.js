/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var t = require('t-component');
var User = require('lib/models').User;
var config = require('lib/config');
var moment = require('moment');
var jwt = require('lib/jwt');
var log = require('debug')('democracyos:signin');
var api = require('lib/db-api');

var auth = User.authenticate();

/**
 * Exports Application
 */

var app = module.exports = express();

if (config['authPages'].signinUrl) return;

/**
 * Define routes for SignUp module
 */

app.post('/', function(req, res, next) {
  auth(req.body.email, req.body.password, function (err, user, info) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    if (!user) {
      return res.json(200, { error: t(info.message) });
    };
    if (!user.emailValidated) {
      return res.json(200, { error: t('signin.error.email-not-valid') });
    };
    if (user.disabledAt) {
      return res.json(200, { error: t('signin.account-disabled') });
    };
    req.login(user, function(err) {
      if (err) return res.json(200, { error: t(err.message) });
      var token = jwt.encodeToken(user, config('secret'));
      token.user = api.user.expose.confidential(user);
      return res.json(200, token);
    });
  })
});