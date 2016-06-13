var log = require('debug')('democracyos:config')
var crypto = require('crypto')
var normalizeEmail = require('../normalize-email/normalize-email')
var path = require('path')
var env = process.env
var config = require('democracyos-config')({ path: path.join(__dirname, '../../config') })
if (!config.jwtSecret || config.jwtSecret === 'Generate a secret token and paste it here.') {
  var token = crypto.randomBytes(32).toString('hex')
  log('Should set a unique token for your app on the "jwtSecret" key of the configuration. Here\'s one just for you: "' + token + '".\n')
}
config.env = env
config.staff = config.staff.map(function (email) {
  return normalizeEmail(email, {
    allowEmailAliases: config.allowEmailAliases
  })
})

config.mongoUrl = env.MONGO_URL || env.MONGODB_URI || config.mongoUrl

if (!env.NOTIFICATIONS_MAILER_SERVICE) {
  if (env.SENDGRID_USERNAME && env.SENDGRID_PASSWORD) {
    config.notifications = {
      mailer: {
        service: 'sendgrid',
        auth: {
          user: env.SENDGRID_USERNAME,
          pass: env.SENDGRID_PASSWORD
        },
        name: config.notifications.mailer.name,
        email: config.notifications.mailer.email
      }
    }
  }
}

module.exports = config
