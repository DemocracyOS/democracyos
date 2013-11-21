/*
 * Module dependencies
 */
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , utils = require('lib/utils')
  , log = require('debug')('democracyos:auth:strategy')
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
   * Citizen model
   */

  var Citizen = mongoose.model('Citizen');

  /**
   * Passport Serialization of logged
   * Citizen to Session from request
   */

  passport.serializeUser(function(citizen, done) {
    done(null, citizen._id);
  });

  /**
   * Passport Deserialization of logged
   * Citizen by Session into request
   */

  passport.deserializeUser(function(citizenId, done) {
    Citizen
    .findById(citizenId)
    .exec(function(err, citizen) {
      done(null, citizen);
    });
  });

  /**
   * Register Local Strategy
   */

  passport.use(new LocalStrategy(Citizen.authenticate()));
}