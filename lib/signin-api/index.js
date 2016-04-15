/**
 * Module dependencies.
 */

var express = require('express');
var t = require('t-component');
var User = require('lib/models').User;
var config = require('lib/config');
var jwt = require('lib/jwt');
var log = require('debug')('democracyos:signin');
var api = require('lib/db-api');
var normalizeEmail = require('lib/normalize-email');
var authFacebookRestrict = require('lib/auth-facebook/middlewares').restrict;
var authGoogleRestrict = require('lib/auth-google/middlewares').restrict;

var auth = User.authenticate();

/**
 * Exports Application
 */

var app = module.exports = express();

if (config.signinUrl) return;

/**
 * Define routes for SignIn module
 */

app.post('/', authFacebookRestrict, authGoogleRestrict, function(req, res, next) {
  var email = normalizeEmail(req.body.email);

  if (config.usersWhitelist && !~config.staff.indexOf(email)) {
    api.whitelist.search({ value: email }, function (err, whitelists) {
      if (!whitelists.length) {
        return res.send(403, { error: 'signup.whitelist.email' });
      }
      signin(req, res, next);
    });

    return;
  }

  signin(req, res, next);
});

function signin(req, res, next) {
  var email = normalizeEmail(req.body.email);
  auth(email, req.body.password, function (err, user, info) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    }
    if (!user) {
      return res.json(200, { error: t(info.message) });
    }
    if (!user.emailValidated) {
      return res.json(200, { error: t('signin.error.email-not-valid') });
    }
    if (user.disabledAt) {
      return res.json(200, { error: t('signin.account-disabled') });
    }

    return jwt.signin(user, req, res);
  });
}

app.delete('/', function(req, res, next) {
  return res.clearCookie('token').send(200);
});

app.delete('/', function(req, res, next) {
  return res.clearCookie('token').send(200);
});
