/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var t = require('t-component');
var Citizen = mongoose.model('Citizen');
var auth =   Citizen.authenticate();

/**
 * Exports Application
 */

var app = module.exports = express();


/**
 * Define routes for SignUp module
 */

app.post('/', function(req, res, next) {
  auth(req.body.email, req.body.password, function (err, citizen, info) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    if (!citizen) {
      return res.json(200, { error: t(info.message) });
    };
    if (!citizen.emailValidated) {
      return res.json(200, { error: t("Email not validated") });
    };
    if (citizen.disabledAt) {
      return res.json(200, { error: t("This account has been disabled") });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: t(err.message) });
      return res.json(200);
    });
  })
});