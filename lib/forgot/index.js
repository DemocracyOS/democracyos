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

module.exports.api = app = express();

module.exports.middleware = function (app) {
  app.get('/forgot', require('lib/layout'));
  app.get('/forgot/reset/:id', require('lib/layout'));
}

/**
 * Define routes for Forgot Password module
 */

app.post('/', function(req, res, next) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  };

  forgotpassword.createToken(req.body.email, meta, function (err) {
    if (err) {
      return res.json(500, { error: err.message });
    };

    return res.json(200);
  })
});

app.post('/verify', function(req, res, next) {
  forgotpassword.verifyToken(req.body.token, function (err) {
    if (err) {
      return res.json(500, { error: err.message });
    };

    return res.json(200);
  })
});

app.post('/reset', function(req, res, next) {
  forgotpassword.resetPassword(req.body, function (err, citizen) {
    if (err) {
      return res.json(500, { error: err.message });
    };

    req.login(citizen, function(err) {
      if (err) return res.json(500, { error: err.message });

      return res.json(200);
    });
  });
});