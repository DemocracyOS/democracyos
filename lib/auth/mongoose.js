const passportLocalMongoose = require('passport-local-mongoose')

/**
 * Wrap passport-local-mongoose plugin to allow the migration of
 * the passwords salt, from sha1 to sha512
 */

module.exports = function authMongoose (schema, options) {
  schema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
      AttemptTooSoonError: 'signin.errors.attempt-too-soon',
      TooManyAttemptsError: 'signin.errors.too-many-attempts',
      IncorrectPasswordError: 'signin.errors.incorrect-password',
      IncorrectUsernameError: 'signin.errors.incorrect-username'
    },
    digestAlgorithm: 'sha1',
    maxAttempts: 100
  })
}
