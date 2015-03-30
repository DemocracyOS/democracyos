/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var WhitelistedUser = mongoose.model('WhitelistedUser');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:whitelisted-user');

module.exports = function (email, fn) {
  WhitelistedUser.findByEmail(email, function (err, user) {
    if (err) return log('Found error %s', err), fn(err);

    return fn(null, user);
  });
}

/**
 * Creates law
 *
 * @param {Object} data to create law
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'law' item created or `undefined`
 * @return {Module} `law` module
 * @api public
 */

module.exports.create = function create(data, fn) {
  log('Creating new whitelisted user %j', data);
  var user = new WhitelistedUser(data);
  user.save(onsave);

  function onsave(err) {
    if (err) return log('Found error %s', err), fn(err);

    log('Saved whitelisted user %s', user.id);
    fn(null, user);
  }

  return this;
};
