/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:signup')
var utils = require('lib/utils')
var api = require('lib/db-api')
var t = require('t-component')
var config = require('lib/config')
var notifier = require('democracyos-notifier')
var SignupStrategy = require('lib/signup-strategy')
var emailWhitelisting = require('lib/whitelist-strategy-email')()
var normalizeEmail = require('lib/normalize-email')
var User = require('lib/models').User

/**
 * Signups a user
 *
 * @param {Object} profile object with local signup data
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */

exports.doSignUp = function doSignUp (profile, meta, callback) {
  profile.email = normalizeEmail(profile.email)
  var user = new User(profile)

  log('new user [%s] from Local signup [%s]', user.id, profile.email)

  user.reference = profile.reference

  // Override validation mechanism for development environments
  if (config.env === 'development') user.emailValidated = true

  var strategy = new SignupStrategy().use(emailWhitelisting)

  strategy.signup(user, function (err) {
    if (err) return callback(err)

    User.register(user, profile.password, function (err, user) {
      if (err) return callback(err)
      log('Saved user [%s]', user.id)
      sendValidationEmail(user, 'signup', meta, callback)
    })
  })
}

/**
 * Validates user email if a valid token is provided
 *
 * @param {Object} formData contains token
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */

exports.emailValidate = function emailValidate (formData, callback) {
  log('email validate requested. token : [%s]', formData.token)
  var tokenId = formData.token
  api.token.get(tokenId, function (err, token) {
    log('Token.findById result err : [%j] token : [%j]', err, token)
    if (err) return callback(err)
    if (!token) {
      return callback(new Error('No token for id ' + tokenId))
    }

    log('email validate requested. token : [%s]. token verified', formData.token)
    api.user.get(token.user, function (err, user) {
      if (err) return callback(err)
      log('about email validate. user : [%s].', user.id)
      user.emailValidated = true
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
}

/**
 * Sends a new validation email to a user
 *
 * @param {Object} profile object with the email address
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */
exports.resendValidationEmail = function resendValidationEmail (profile, meta, callback) {
  log('Resend validation email to [%s] requested', profile.email)

  api.user.getByEmail(profile.email, function (err, user) {
    if (err) return callback(err)
    if (!user) return callback(new Error(t('common.no-user-for-email')))
    if (user.emailValidated) {
      return callback(new Error(t('signup.user-already-validated')))
    }
    log('Resend validation email to user [%j] requested', user)
    sendValidationEmail(user, 'resend-validation', meta, callback)
  })
}

/**
 * Creates a token and sends a validation email to a user
 *
 * @param {Object} user to send the email to
 * @param {String} name of the event that causes the validation email to be sent
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 */
function sendValidationEmail (user, event, meta, callback) {
  api.token.createEmailValidationToken(user, meta, function (err, token) {
    if (err) return callback(err)

    var validateUrl = utils.buildUrl(config, {
      pathname: '/signup/validate/' + token.id,
      query: (user.reference ? { reference: user.reference } : null)
    })

    notifier.now('welcome-email', { validateUrl: validateUrl, to: user.email }).then((data) => {
      log('Notification for event %s to user %j delivered', event, user)
      callback(null, data)
    })
    .catch((err) => {
      log('Error when sending notification for event %s to user %j', event, user)
      callback(err)
    })

  })
}
