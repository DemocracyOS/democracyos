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
 * Search `Citizen` objects from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizens' list of `Citizen` objects found or `undefined`
 * @return {Module} `citizen` module
 * @api public
 */

exports.search = function search(query, fn) {
  var hashQuery = new RegExp('.*' + query + '.*','i');

  log('Searching for Citizens matching %s', hashQuery);


  Citizen.find()
  .or([{firstName: hashQuery}, {lastName: hashQuery}])
  .select('firstName lastName fullName avatar')
  .exec(function(err, citizens) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found Citizens %j for hash %s', citizens, hashQuery)
    fn(null, citizens);
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