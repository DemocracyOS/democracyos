const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose')

/**
 * Wrap passport-local-mongoose plugin to allow the update of
 * the passwords digestAlgorithm, from old `sha1` to a more secure `sha512`
 */

module.exports = function authMongoose (schema, options) {
  const digestAlgorithm = 'sha512'

  schema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
      AttemptTooSoonError: 'signin.errors.attempt-too-soon',
      TooManyAttemptsError: 'signin.errors.too-many-attempts',
      IncorrectPasswordError: 'signin.errors.incorrect-password',
      IncorrectUsernameError: 'signin.errors.incorrect-username'
    },
    selectFields: '+digestAlgorithm',
    digestAlgorithm: digestAlgorithm,
    limitAttempts: true,
    maxAttempts: 50
  })

  schema.add({
    digestAlgorithm: { type: String, select: false }
  })

  /**
   * Override .setPassword to also save `digestAlgorithm` key
   */

  const originalSetPassword = schema.methods.setPassword

  schema.methods.setPassword = function setPassword (pass, cb) {
    return originalSetPassword.call(this, pass, (err) => {
      if (err) return cb(err)
      this.set('digestAlgorithm', digestAlgorithm)
      cb(null, this)
    })
  }

  /**
   * Override .authenticate to migrate the password when needed
   */

  const originalAuthenticate = schema.methods.authenticate

  schema.methods.authenticate = function verifyUserDigestAlgorithm (pass, cb) {
    const user = this
    const userDigestAlgorithm = user.get('digestAlgorithm')

    if (userDigestAlgorithm === digestAlgorithm) {
      return originalAuthenticate.call(user, pass, cb)
    }

    // Migrate old sha1 password to a new one with sha256
    if (!userDigestAlgorithm) {
      const sha1User = new Sha1User({
        hash: user.get('hash'),
        salt: user.get('salt')
      })

      return sha1User.authenticate(pass, (err, passed, msg) => {
        if (err) return cb(err)

        if (passed === false) return cb(null, passed, msg)

        return user.setPassword(pass, (err, user) => {
          if (err) return cb(err)

          user.save((err, user) => {
            if (err) return cb(err)
            originalAuthenticate.call(user, pass, cb)
          })
        })
      })
    }

    return cb(null, false, {
      message: 'signin.errors.must-reset-password'
    })
  }
}

/**
 * Use a temporary dummy model for old passwords verification
 */

const Sha1UserSchema = new mongoose.Schema()

Sha1UserSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    AttemptTooSoonError: 'signin.errors.attempt-too-soon',
    TooManyAttemptsError: 'signin.errors.too-many-attempts',
    IncorrectPasswordError: 'signin.errors.incorrect-password',
    IncorrectUsernameError: 'signin.errors.incorrect-username'
  },
  digestAlgorithm: 'sha1',
  limitAttempts: false
})

const Sha1User = mongoose.model('Sha1User', Sha1UserSchema)
