/**
 * Module dependencies.
 */

var express = require('express')
  , t = require('t-component')
  , account = require('./lib/account')
  ;

/**
 * Exports Application
 */

var app = module.exports = express();


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

app.post('/profile', function(req, res, next) {
  console.log(req.body);
  res.send(200);
});