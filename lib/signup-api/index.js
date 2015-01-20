/**
 * Module dependencies.
 */

var express = require('express');
var signup = require('./lib/signup');
var config = require('lib/config');
var useExternalAuthPages = config['authPages'].useExternal;

/**
 * Exports Application
 */

var app = module.exports = express();

if (useExternalAuthPages) return;

/**
 * Define routes for SignUp module
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

  signup.doSignUp(req.body, meta, function (err, citizen) {
    if (err) {
      return res.json(200, { error: err.message });
    };
    return res.json(200);
  })
});

app.post('/validate', function(req, res, next) {
  signup.emailValidate(req.body, function (err, citizen) {
    if (err) {
      return res.json(200, { error: err.message });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: err.message });
      return res.json(200);
    });
  })
});

app.post('/resend-validation-email', function(req, res, next) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  };

  signup.resendValidationEmail(req.body, meta, function (err, citizen) {
    if (err) {
      return res.json(200, { error: err.message });
    };
    return res.json(200);
  })
});
