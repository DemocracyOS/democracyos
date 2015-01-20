/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var t = require('t-component');
var User = require('lib/models').User;
var auth = User.authenticate();
var moment = require('moment');
var jwt = require('jwt-simple');
var log = require('debug')('democracyos:signin');

/**
 * Exports Application
 */

var app = module.exports = express();


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
      return res.json(200, { error: t("signin.error.email-not-valid") });
    };
    if (user.disabledAt) {
      return res.json(200, { error: t("This account has been disabled") });
    };
    req.login(user, function(err) {
      if (err) return res.json(200, { error: t(err.message) });

      var expires = moment().add(7, 'days').valueOf();
      var token = jwt.encode({
        iss: user.email,
        exp: expires
      }, app.get('jwtTokenSecret'));

      return res.json(200, {
        token : token,
        expires: expires,
        user: user.toJSON()
      });
    });
  })
});