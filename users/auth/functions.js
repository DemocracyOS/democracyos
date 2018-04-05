const User = require('../db-api/user')
const mailer = require('../../main/mailer')
const { log } = require('../../main/logger')
const { ADMIN_EMAIL } = require('../../main/config')

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
  insert: async (user) => {
    if (ADMIN_EMAIL !== null) {
      user.email === ADMIN_EMAIL ? user.role = 'admin' : user.role = 'user'
    } else {
      const users = await User.list({ page: 1, limit: 10 })
      users.total === 0 ? user.role = 'admin' : user.role = 'user'
    }
    return User.create(user)
  },
  update: (user) => User.update({ id: user.id, user }),
  remove: (id) => User.remove(id),
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
      .then((user) => {
        if (!user) return Promise.resolve(null)
        return Promise.resolve({
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          firstLogin: user.firstLogin,
          role: user.role
        })
      })
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
    log.debug('Generated sign in link ' + url + ' for ' + email)
  }
}
