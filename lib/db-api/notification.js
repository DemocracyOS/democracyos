/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');
var log = require('debug')('democracyos:db-api:notification');
var utils = require('lib/utils');
var pluck = utils.pluck;

/**
 * Get all notifications
 *
 * @param {User} user to get notifications from
 * @return {Module} `notification` module
 * @api public
 */

exports.all = function all(user) {
  return new Promise(function(resolve, reject) {
    Notification
      .find({ user: user })
      .populate('user comment relatedUser topic')
      .exec()
      .then(function (notifications) {
        resolve(notifications);
      })
      .then(null, function (err) {
        reject(err);
      })
  });
}