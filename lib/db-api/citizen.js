/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Citizen = mongoose.model('Citizen')
  , log = require('debug')('db-api:citizen');

/**
 * Get all citizens
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizens' list items found or `undefined`
 * @return {Module} `citizen` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all citizens.');

  Citizen
  .find()
  .sort('-createdAt')
  .exec(function (err, citizens) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering all citizens %j', mapByProperty(citizens, 'id'));
    fn(null, citizens);
  });
  return this;
}

/**
 * Get Citizen for `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Citizen's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizen' single object created or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  log('Loking for Citizen %s', id);

  Citizen
  .findById(id)
  .exec(function (err, citizen) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering Citizen %j', citizen);
    fn(null, citizen);
  });
  return this;
};

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function (item) { return item[property]; });
}