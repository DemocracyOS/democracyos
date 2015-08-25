/**
 * Module dependencies.
 */

var config = require('lib/config')
var NotifierClient = require('notifier-client')

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
