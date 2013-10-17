/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , t = require('t-component')
  , Citizen = mongoose.model('Citizen')
  , auth =   Citizen.authenticate()

  ;

/**
 * Lazy register SignUp Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


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
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: t(err.message) });
      return res.json(200);
    });
  })
});