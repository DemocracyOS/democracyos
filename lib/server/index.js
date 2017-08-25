const notifier = require('democracyos-notifier')
const log = require('debug')('democracyos:server')
const config = require('lib/config')
const app = require('lib/boot')
const serverFactory = require('lib/server-factory')

module.exports = function listen (opts, callback) {
  if (!callback) callback = () => {}

  const servers = serverFactory(app, opts)

  function startWebServer () {
    return Promise.all(servers.map((server) => {
      return new Promise((resolve, reject) => {
        server.listen(function (err) {
          if (err) return reject(err)
          log('Server started at port %s.', server.port)
          resolve()
        })
      })
    }))
  }

  function startNotificationsService (cb) {
    notifier.config.set({
      mongoUrl: config.mongoUrl,
      organizationName: config.notifications.mailer.name,
      organizationEmail: config.notifications.mailer.email,
      mailer: config.notifications.mailer,
      nodemailer: config.notifications.nodemailer,
      defaultLocale: config.locale,
      availableLocales: config.availableLocales
    })

    return notifier[config.notifications.url ? 'init' : 'start']()
  }

  return Promise.all([
    startWebServer(),
    startNotificationsService()
  ])
  .then(() => {
    callback()
  })
  .catch(callback)
}
