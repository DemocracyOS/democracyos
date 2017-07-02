/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:db-api:token')
var Token = require('lib/models').Token

/**
 * Get single token from ObjectId or HexString
 *
 * @param {Mixed} id ObjectId or HexString for token
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object found or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for token %j', id)
  Token.findById(id, function (err, token) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering token %j', token)
    fn(null, token)
  })
  return this
}

/**
 * Create password reset Token for a user
 *
 * @param {Object} user object for which the
 * password reset Token is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object created or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.createPasswordResetToken = function createPasswordResetToken (user, meta, fn) {
  log('Creating new password reset token for user %j', user)
  return createToken(user, meta, 'password-reset', fn)
}

/**
 * Create email validation Token for a user
 *
 * @param {Object} user object for which the
 * email validation Token is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object created or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.createEmailValidationToken = function createEmailValidationToken (user, meta, fn) {
  log('Creating new email validation token for user %j', user)
  return createToken(user, meta, 'email-validation', fn)
}

/**
 * Creates a Token in db by first
 * deleting all tokens for specified
 * `user` at the mentioned `scope`
 *
 * @param {User} user
 * @param {Object} meta
 * @param {String} scope
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' the `Token` object modified or `undefined`
 * @api private
 */

function createToken (user, meta, scope, fn) {
  log('Removing all tokens for user %j', user)
  Token.remove({ user: user._id, scope: scope }, function (err) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }
    log('Creating new token for user %j, meta %j, scope %s', user, meta, scope)
    var token = new Token({
      user: user,
      scope: scope,
      meta: meta
    })

    token.save(function (err, saved) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering token %j', saved)
      fn(null, saved)
    })
  })
  return this
}
