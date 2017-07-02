/**
 * Module dependencies.
 */

var NotifierClient = require('notifier-client')
var log = require('debug')('democracyos:notifications')
var config = require('lib/config')
var api = require('lib/db-api')

function embedded () {
  // basically, if it's not an empty string (the default)
  return !config.notifications.url
}

exports.embedded = embedded

if (embedded()) {
  exports.notifier = new NotifierClient({
    notifier: require('democracyos-notifier')
  })
} else {
  exports.notifier = new NotifierClient({
    url: config.notifications.url,
    token: config.notifications.token
  })
}

var send = exports.notifier.send.bind(exports.notifier)

var notify = (event) => {
  return new Promise((resolve, reject) => {
    send(event, (err, data) => {
      if (err) {
        // May fail for jobs not defined in notifier.
        // Don't reject. If fails, the `then` function must be executed.
        log('notifier failed to send notification: %s', err)
      }

      return resolve(data)
    })
  })
}

exports.notifier.send = function (cb) {
  Promise.all([
    notify(this.event),
    api.notification.create(this.event)
  ])
    .then((data) => cb(null, data))
    .catch((err) => cb(err))
}
