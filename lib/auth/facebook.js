/**
 * Module dependencies.
 */

var api = require('lib/db-api');
var config = require('lib/config');
var express = require('express');
var jwt = require('lib/jwt');
var passport = require('passport');
var log = require('debug')('democracyos:auth:facebook');

/**
 * Expose auth app
 */

var app = module.exports = express();

/*
 * Facebook Auth routes
 */

app.get('/auth/facebook'
  , passport.authenticate('facebook', {
    scope: [ 'email', 'user_birthday', 'user_location', 'user_photos' ]
  })
);

app.get('/auth/facebook/callback'
  , passport.authenticate('facebook', { failureRedirect: '/' })
  , function(req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id);
    var token = jwt.encodeToken(api.user.expose.confidential(req.user), config.secret);
    return res.cookie('token', token.token, { expires: new Date(token.expires) }).redirect('/');
  }
);