const User = require('../db-api/user')
const mailer = require('../../main/mailer')
const { log } = require('../../main/logger')

module.exports = {
  find: ({ id, email, emailToken, provider } = {}) => {
    let query = {}

    if (id) {
      query = { id }
    } else if (email) {
      query = { email: email }
    } else if (emailToken) {
      query = { emailToken: emailToken }
    } else if (provider) {
      query = { [`${provider.name}.id`]: provider.id }
    }

    return User.get(query)
  },
  insert: User.create,
  update: (user) => User.update(user._id, user),
  remove: User.remove,
  serialize: (user) => {
    if (user.id) {
      return Promise.resolve(user.id)
    } else if (user._id) {
      return Promise.resolve(user._id)
    } else {
      return Promise.reject(new Error('Unable to serialise user'))
    }
  },
  deserialize: (id) => {
    return User.get({ id })
      .then(({
        _id,
        name,
        email,
        emailVerified
      }) => Promise.resolve({
        id: _id,
        name,
        email,
        emailVerified
      }))
  },
  sendSignInEmail: async ({
    email = null,
    url = null
  } = {}) => {
    try {
      await mailer.send({ email, url })
    } catch (err) {
      log.error('Error sending email to ' + email, err)
    }
    if (process.env.NODE_ENV === 'development') {
      log.debug('Generated sign in link ' + url + ' for ' + email)
    }
  }
}
