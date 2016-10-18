/**
 * Module dependencies.
 */

var async = require('async')
var config = require('lib/config')
var app = require('lib/boot')
var serverFactory = require('lib/server-factory')
var notifier = require('democracyos-notifier')
var notifications = require('lib/notifications').notifier
var log = require('debug')('democracyos:server')

module.exports = function listen (opts, callback) {
  callback = callback || noop

  var servers = serverFactory(app, opts)

  if (notifications.embedded()) {
    // Start web servers alongside the notifications server
    async.parallel([
      startWebServer,
      startNotificationsService
    ], callback)
  } else {
    // Just start the regular web server
    startWebServer(callback)
  }

  function startWebServer (cb) {
    servers.forEach(function (s) {
      s.listen(function (err) {
        log('Server started at port %s.', s.port)

        cb(err)
      })
    })
  }

  function startNotificationsService (cb) {
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
        return cb(err)
      }

      log('Embedded notifier started.')

      cb()
    })
  }
}

function noop () {}
