var config = require('lib/config');
var notifier = require('notifier-client')(config.notifications);
var t = require('t-component');
var log = require('debug')('democracyos:notifications');

var originalSend = notifier.send.bind(notifier);

notifier.send = function sendWrapper (callback) {
  originalSend(function (err, res) {
    if (err && err.code == 'ECONNREFUSED') {

      log('Unable connect to the notifier server - Error: %j', err);
      err.message = t('notifications.error.connection-refused');
    }

    callback(err, res);
  });
};

module.exports = notifier;