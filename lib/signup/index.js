/**
 * Module dependencies.
 */

var express = require('express')
  , mailer = require('lib/mailer')
  , path = require('path')
  , registration = require('lib/registration')
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
  registration.local(req.body, function (err, citizen) {
    if (err) {
      return res.json(200, { error: err.message });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: err.message });
      return res.json(200);
    });
  })
});