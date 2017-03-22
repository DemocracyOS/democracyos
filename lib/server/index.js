/**
 * Module dependencies.
 */

var notifier = require('democracyos-notifier')
var log = require('debug')('democracyos:server')
var config = require('lib/config')
var app = require('lib/boot')
var serverFactory = require('lib/server-factory')
var notifications = require('lib/notifications').notifier

module.exports = function listen (opts, callback) {
  callback = callback || noop

  var servers = serverFactory(app, opts)

  Promise.all([
    startWebServer(),
    startNotificationsService()
  ]).then(() => {
    callback()
  }).catch(callback)

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
    if (!notifications.embedded()) return true

    return new Promise((resolve, reject) => {
      var opts = {
        mongoUrl: config.mongoUrl,
        organizationName: config.notifications.mailer.name,
        organizationEmail: config.notifications.mailer.email,
        mailer: config.notifications.mailer,
        nodemailer: config.notifications.nodemailer,
        defaultLocale: config.locale,
        availableLocales: config.availableLocales
      }

      log('Starting embedded notifier...')
      notifier(opts, function (err) {
        if (err) {
          log('Unexpected error while starting embedded notifier', err)
          return reject(err)
        }

        log('Embedded notifier started.')

        resolve()
      })
    })
  }
}

function noop () {}
