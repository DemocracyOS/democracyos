/**
 * Module dependencies.
 */

var express = require('express')
  , t = require('t-component')
  , account = require('./lib/account')
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
  var citizen = req.user;
  account.updateCitizen(citizen, req.body, function (err) {
    if (err) {
      return res.json(200, { error: t(err.message) });
    };
    return res.json(200);
  })
});