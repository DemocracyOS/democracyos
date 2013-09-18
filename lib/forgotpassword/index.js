/**
 * Module dependencies.
 */

var express = require('express')
  , mailer = require('lib/mailer')
  , path = require('path')
  , forgotpassword = require('./lib/forgotpassword')
  ;

/**
 * Lazy register Forgot Password Application
 */

var app;

/**
 * Exports Application
 */

module.exports = app = express();


/**
 * Define routes for Forgot Password module
 */

app.post('/', function(req, res, next) {
  forgotpassword.createToken(req.body.email, function (err) {
    if (err) {
      return res.json(500, { error: err.message });
    };

    return res.json(200);
  })
});