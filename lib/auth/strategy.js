/*
 * Module dependencies
 */
var config = require('lib/config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var utils = require('lib/utils');
var log = require('debug')('democracyos:auth:strategy');
var User = require('lib/models').User;
var registration = require('lib/registration');

/**
 * Expose AuthStrategy
 */

module.exports = AuthStrategy;

/**
 * Register Auth Strategies for app
 */

function AuthStrategy (app) {

  /**
   * Passport Serialization of logged
   * User to Session from request
   */

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  /**
   * Passport Deserialization of logged
   * User by Session into request
   */

  passport.deserializeUser(function(userId, done) {
    User
    .findById(userId)
    .exec(function(err, user) {
      done(null, user);
    });
  });

  /**
   * Register Local Strategy
   */

  passport.use(new LocalStrategy(User.authenticate()));
}

/**
 * Register Facebook Strategy
 */

if (config.auth.facebook.clientID) {
  passport.use(
    new FacebookStrategy({
      clientID: config.auth.facebook.clientID,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: config.auth.facebook.callback,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findByProvider(profile, function (err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }

        registration.facebook(profile, accessToken, function(err, user) {
          return done(err, user);
        });
      });
    })
  );
}
