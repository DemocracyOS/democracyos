/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:forgotpassword')
var t = require('t-component')
var api = require('lib/db-api')
var config = require('lib/config')
var utils = require('lib/utils')
var notifier = require('democracyos-notifier')
var normalizeEmail = require('lib/normalize-email')
var User = require('lib/models').User

/**
 * Creates a forgot password token and sends it to the user by email
 *
 * @param {String} email Email of the user who forgot his/her password
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */

exports.createToken = function createToken (email, meta, callback) {
  log('Password reset token creation requested for email "%s", checking user exists', email)

  if (arguments.length === 2) {
    callback = meta
    meta = {}
  }

  email = normalizeEmail(email)

  User.findByEmail(email, function (err, user) {
    if (err) return callback(err)
    if (!user) return callback(new Error(t('common.no-user-for-email') + ' ' + email))
    if (!user.emailValidated) {
      var error = new Error('forgot.error.email-not-valid')
      error.status = 'notvalidated'
      return callback(error)
    }

    log('Valid reset token creation requested for user [%s]', user.id)

    api.token.createPasswordResetToken(user, meta, function (err, token) {
      if (err) return callback(err)

      var eventName = 'forgot-password'

      var resetUrl = utils.buildUrl(config, { pathname: '/forgot/reset/' + token.id })

      notifier.now(eventName, { to: user.email, resetUrl }).then((data) => {
        log('Notification for event %s to user %j delivered', eventName, user)
        callback(null, data)
      })
      .catch((err) => {
        log('Error when sending notification for event %s to user %j', event, user, err)
        callback(err)
      })
    })
  })
}

/**
 * Verify the token is valid
 *
 * @param {String} token Token id to be validated
 * @param {Function} callback Callback accepting `err` and Token
 * @api public
 */

exports.verifyToken = function verifyToken (tokenId, callback) {
  log('token validation requested. token : [%s]', tokenId)
  api.token.get(tokenId, function (err, token) {
    log('Token.findById result err : [%j] token : [%j]', err, token)
    if (err) return callback(err)
    if (!token) {
      return callback(new Error('No token for id ' + tokenId))
    }
    return callback(null, token)
  })
}

/**
 * Resets user password if a valid token is provided
 *
 * @param {Object} formData contains password and token
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */

exports.resetPassword = function resetPassowrd (formData, callback) {
  log('password reset requested. token : [%s]', formData.token)
  exports.verifyToken(formData.token, function (err, token) {
    if (err) return callback(err)
    log('password reset requested. token : [%s]. token verified', formData.token)
    api.user.get(token.user, function (err, user) {
      if (err) return callback(err)
      log('about to reset password. user : [%s].', user.id)
      user.setPassword(formData.password, function (err) {
        if (err) return callback(err)
        log('password reseted, but user not saved yet. user : [%s].', user.id)
        user.save(function (err) {
          if (err) return callback(err)
          log('Saved user [%s]', user.id)
          token.remove(function (err) {
            if (err) return callback(err)
            log('Token removed [%j]', token)
            return callback(err, user)
          })
        })
      })
    })
  })
}
