/*
 * Module dependencies
 */
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , utils = require('lib/utils')
  , log = require('debug')('democracyos:auth:strategy')
  , User = require('lib/models').User
  ;

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