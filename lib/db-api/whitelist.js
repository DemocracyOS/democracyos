/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Whitelist = mongoose.model('Whitelist');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:whitelist');

/**
 * Get all whitelist
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'whitelist' list whitelists found or `undefined`
 * @return {Module} `whitelist` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all whitelists')

  Whitelist
  .find({  })
  .select('id type value')
  .exec(function (err, whitelist) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering whitelist %j', pluck(whitelist, 'id'));
    fn(null, whitelist);
  });

  return this;
};

/**
 * Search whitelists from query
 *
 * @param {Object} query filter
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'whitelists' list of whitelists objects found or `undefined`
 * @return {Module} `whitelist` module
 * @api public
 */

exports.search = function search(query, fn) {
  log('Searching for whitelists matching %j', query);

  Whitelist
    .find(query, function(err, whitelists) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found whitelists %j for %j', pluck(whitelists, 'id'), query);
    fn(null, whitelists);
  });

  return this;
};

/**
 * Creates whitelist
 *
 * @param {Object} data to create whitelist
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'whitelist' whitelist created or `undefined`
 * @return {Module} `whitelist` module
 * @api public
 */

exports.create = function create(data, fn) {
  log('Creating new whitelist %j', data);
  var whitelist = new Whitelist(data);
  whitelist.save(onsave);

  function onsave(err) {
    if (err) return log('Found error %s', err), fn(err);

    log('Saved whitelist %s', whitelist.id);
    fn(null, whitelist);
  }

  return this;
};
