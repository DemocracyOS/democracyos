/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
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
      return res.json(200, { error: err.message });
    };
    if (!citizen) {
      return res.json(200, { error: info.message });
    };
    req.login(citizen, function(err) {
      if (err) return res.json(200, { error: err.message });
      return res.json(200);
    });
  })
});