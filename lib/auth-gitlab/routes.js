/**
 * Module dependencies.
 */

var config = require('lib/config');
var express = require('express');
var passport = require('passport');
var log = require('debug')('democracyos:auth:gitlab:routes');
var User = require('lib/models').User;
var fbSignedParser = require('fb-signed-parser');
var jwt = require('lib/jwt');

/**
 * Expose auth app
 */

var app = module.exports = express();

/*
 * Facebook Auth routes
 */

app.get('/auth/gitlab',
  passport.authenticate('gitlab')
);

app.get('/images/gitlabLogo.png', function(req, res) {
  res.sendFile('./gitlabLogo.png');
});

app.get('/auth/gitlab/callback',
  passport.authenticate('gitlab', { failureRedirect: '/' }),
  function(req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id);
    jwt.setUserOnCookie(req.user, res);
    return res.redirect('/');
  }
);
