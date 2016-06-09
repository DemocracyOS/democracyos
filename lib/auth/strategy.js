/*
 * Module dependencies
 */
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('lib/models').User

/**
 * Expose AuthStrategy
 */

module.exports = AuthStrategy

/**
 * Register Auth Strategies for app
 */

function AuthStrategy () {
  /**
   * Passport Serialization of logged
   * User to Session from request
   */

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  /**
   * Passport Deserialization of logged
   * User by Session into request
   */

  passport.deserializeUser(function (userId, done) {
    User
      .findById(userId)
      .exec(done)
  })

  /**
   * Register Local Strategy
   */

  passport.use(new LocalStrategy(User.authenticate()))
}
