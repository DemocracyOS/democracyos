var config = require('lib/config');
var notifier = require('notifier-client')(config.notifications);
var utils = require('lib/utils');
var t = require('t-component');
var log = require('debug')('democracyos:notifications');

exports.makeSafe = function makeSafe(fn, errorHandler) {
  if ('function' === typeof fn) throw new Error('Attempted to make safe something that isn\'t a function');

  return function () {
    try {
      return fn.apply(this, arguments);
    } catch(err) {
      if ('function' === typeof errorHandler) return errorHandler(err);
      else throw err;
    }
  };
};

var originalSend = notifier.send.bind(notifier);

notifier.send = function sendWrapper (callback) {

  log('Attempting to send wrapped notification');
  originalSend(function (err, res) {
    if (err && err.code == 'ECONNREFUSED') {

      log('Unable to send notification - Error: %j', err);
      err.message = t('notifications.error.connection-refused');
    }

    callback(err, res);
  });
};

module.exports = notifier;