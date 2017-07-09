const utils = require('democracyos-notifier/lib/utils')
const mailer = require('democracyos-notifier/lib/mailer')
const template = require('./template')

const jobName = 'welcome-email'
const subject = 'Bienvenido al portal de participación de la ciudad de Rosario'

module.exports = function welcomeEmail (notifier) {
  const { db, agenda } = notifier
  const users = db.get('users')

  agenda.define(jobName, { priority: 'high' }, welcomeEmailJob)
  agenda.define('signup', { priority: 'high' }, welcomeEmailJob)
  agenda.define('resend-validation', { priority: 'high' }, welcomeEmailJob)

  function welcomeEmailJob (job, done) {
    const data = job.attrs.data

    users.findOne({ email: data.to }).then((user) => {
      if (!user) throw new Error(`User not found for email "${data.to}"`)

      const html = template({
        userName: user.firstName,
        validateUrl: data.validateUrl
      })

      return mailer.send({
        to: utils.emailAddress(user),
        subject,
        html
      })
    }).then(() => { done() }).catch(done)
  }
}
