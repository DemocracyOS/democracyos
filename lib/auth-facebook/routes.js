/**
 * Module dependencies.
 */

var api = require('lib/db-api');
var config = require('lib/config');
var express = require('express');
var jwt = require('lib/jwt');
var passport = require('passport');
var log = require('debug')('democracyos:auth:facebook:routes');
var User = require('lib/models').User;
var fbSignedParser = require('fb-signed-parser');

/**
 * Expose auth app
 */

var app = module.exports = express();

/*
 * Facebook Auth routes
 */

app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: config.auth.facebook.permissions
  })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id);
    var token = jwt.encodeToken(api.user.expose.confidential(req.user), config.jwtSecret);
    return res.cookie('token', token.token, { expires: new Date(token.expires), httpOnly: true }).redirect('/');
  }
);

app.post('/auth/facebook/deauthorize', function(req, res) {
  log('Parsing call to "/auth/facebook/deauthorize".');

  res.send(200);

  var signedRequest = req.params.signed_request;

  if (!signedRequest) return log('"signed_request" param not found.');

  var data = fbSignedParser.parse(signedRequest, config.auth.facebook.clientSecret);

  if (!data || !data.user || !data.user.id) {
    return log('Invalid "signed_request" data: ', data);
  }

  setTimeout(function(){
    deauthorizeUser(data.user.id)
  }, 0);
});

function deauthorizeUser(userFacebookId) {
  log('Deauthorizing user with facebook id "%s".', userFacebookId);

  var profile = {
    id: userFacebookId,
    provider: 'facebook'
  };

  User.findByProvider(profile, function (err, user) {
    if (err) {
      return log('Error looking for user with facebook id "%s".', userFacebookId);
    }

    if (!user) {
      return log('User with facebook id "%s" not found.', userFacebookId);
    }

    user.set('profiles.facebook.deauthorized', true);

    return user.save(function(err){
      if (err) return log(err);
      log('Facebook login for user "%s" deauthorized.', user.id);
    });
  });
}
