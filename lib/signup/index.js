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
    req.login(citizen, function(err) {
      console.log(err);
      if (err) return res.json(400, err);
      return res.json(200);
    });
  })
});