/**
 * Module dependencies.
 */

var express = require('express');
var utils = require('lib/utils');
var restrict = utils.restrict;
var log = require('debug')('democracyos:settings');
var t = require('t-component');

/**
 * Exports Application
 */

var app = module.exports = express();

app.post('/profile', restrict, function(req, res, next) {
  var citizen = req.user;
  log('Updating citizen %s profile', citizen.id);

  citizen.firstName = req.body.firstName;
  citizen.lastName = req.body.lastName;
  citizen.profilePictureUrl = req.body.profilePictureUrl;
  // Temporarily disable email submission, until we fix the whole flow
  // Also check  ./settings-profile/view.js
  // Fixes https://github.com/DemocracyOS/app/issues/223
  // citizen.email = req.body.email;

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
  // `authenticate` to check if user's current password is Ok.
  citizen.authenticate(current, function(err, authenticated, message) {
    if (err) return res.send(500, err.message);
    if (!authenticated) return res.send(403, t('Current password is invalid'));

    citizen.setPassword(password, function(err) {
      if (err) return res.send(500, err.message);

      citizen.save(function(err) {
        if (err) return res.send(500, err.message);
        res.send(200);
      });
    });
  });
});

app.post('/notifications', restrict, function(req, res, nex) {
  log('Updating notifications settings with these new ones %j', req.body);
  var notifications = {};
  notifications.replies = !!req.body.replies;
  notifications['new-topic'] = !!req.body['new-topic'];
  var citizen = req.user;
  citizen.notifications = notifications;
  citizen.save(function (err) {
    if (err) return res.send(500);
    res.send(200);
  });
});