/**
 * Module dependencies.
 */

var config = require('lib/config');
var Notifier = require('notifier-client');
var t = require('t-component');
var log = require('debug')('democracyos:notifications');

var originalSend = Notifier.prototype.send;

Notifier.prototype.send = function sendWrapper (callback) {
  originalSend.call(this, function (err, res) {
    if (err && err.code == 'ECONNREFUSED') {

      log('Unable connect to the notifier server - Error: %j', err);
      err = t('notifications.error.connection-refused');
    }

    callback(err, res);
  });
};

module.exports = new Notifier(config.notifications);