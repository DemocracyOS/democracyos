/**
 * Module dependencies.
 */

var api = require('lib/db-api').whitelist
var config = require('lib/config')
var t = require('t-component')

function EmailWhitelist (opts) {
  return function (user) {
    return function (done) {
      if (!config.usersWhitelist) return done()
      if (~config.staff.indexOf(user.email)) return done()

      api.search({ type: 'email', value: user.email }, function (err, emails) {
        if (err) return done(err)

        if (emails.length) {
          return done()
        } else {
          return done(new Error(t('signup.whitelist.email', { email: user.email })))
        }
      })
    }
  }
}

module.exports = EmailWhitelist
