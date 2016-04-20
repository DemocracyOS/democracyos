/**
 * Module dependencies.
 */

var config = require('lib/config');
var express = require('express');
var passport = require('passport');
var log = require('debug')('democracyos:auth:google:routes');
var User = require('lib/models').User;
var fbSignedParser = require('fb-signed-parser');
var jwt = require('lib/jwt');

/**
 * Expose auth app
 */

var app = module.exports = express();

/*
 * Google Auth routes
 */

app.get('/auth/google',
  passport.authenticate('google', {
    scope: config.auth.google.permissions
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id);
    jwt.setUserOnCookie(req.user, res);
    return res.redirect('/');
  }
);

app.post('/auth/google/deauthorize', function(req, res) {
  log('Parsing call to "/auth/google/deauthorize".');

  res.send(200);

  var signedRequest = req.params.signed_request;

  if (!signedRequest) return log('"signed_request" param not found.');

  var data = fbSignedParser.parse(signedRequest, config.auth.google.clientSecret);

  if (!data || !data.user || !data.user.id) {
    return log('Invalid "signed_request" data: ', data);
  }

  setTimeout(function(){
    deauthorizeUser(data.user.id)
  }, 0);
});

function deauthorizeUser(userGoogleId) {
  log('Deauthorizing user with google id "%s".', userGoogleId);

  var profile = {
    id: userGoogleId,
    provider: 'google'
  };

  User.findByProvider(profile, function (err, user) {
    if (err) {
      return log('Error looking for user with google id "%s".', userGoogleId);
    }

    if (!user) {
      return log('User with google id "%s" not found.', userGoogleId);
    }

    user.set('profiles.google.deauthorized', true);

    return user.save(function(err){
      if (err) return log(err);
      log('Google login for user "%s" deauthorized.', user.id);
    });
  });
}
