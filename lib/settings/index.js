/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var restrict = utils.restrict;
var log = require('debug')('democracyos:settings');

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
      return res.json(500, { error: err.message });
    };
    return res.json(200);
  })
});

app.post('/profile', restrict, function(req, res, next) {
  var citizen = req.user;
  log('Updating citizen %s profile', citizen.id);

  citizen.firstName = req.body.firstName;
  citizen.lastName = req.body.lastName;
  citizen.email = req.body.email;

  if (citizen.isModified('email')) {
    log('Citizen must validate new email');
    citizen.emailValidated = false;
  };

  citizen.save(function(err) {
    if (err) return res.send(500);
    res.send(200);
  });
});

app.post('/password', restrict, function(req, res, nex) {
  var citizen = req.user;
  var current = req.body.current_password;
  var password = req.body.password;
  log('Updating citizen %s password', citizen.id);

  // !!:  Use of passport-local-mongoose plugin method
  // `authenticate`
  citizen.authenticate(current, function(err, authenticated, message) {
    if (err) return res.send(500, err.message);
    if (!authenticated) return res.send(403, "Current password is invalid");

    citizen.setPassword(password, function(err) {
      if (err) return res.send(500, err.message);

      citizen.save(function(err) {
        if (err) return res.send(500, err.message);
        res.send(200);
      });
    });
  });
});