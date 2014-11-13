/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Citizen = mongoose.model('Citizen');
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:citizen');

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

    log('Delivering all citizens %j', pluck(citizens, 'id'));
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
  log('Looking for Citizen %s', id);

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
  .select('firstName lastName fullName email profilePictureUrl')
  .exec(function(err, citizens) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found Citizens %j for hash %s', pluck(citizens, 'id'), hashQuery)
    fn(null, citizens);
  });

  return this;
};

/**
 * Get `Citizen` objects whose email has been validated
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizens' list of `Citizen` objects found or `undefined`
 * @return {Module} `citizen` module
 * @api public
 */

exports.findEmailValidated = function findEmailValidated(fn) {
  log('Searching for email validated Citizens matching');

  Citizen.find({ emailValidated: true })
  .exec(function(err, citizens) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found %d email validated Citizens', citizens.length)
    fn(null, citizens);
  });

  return this;
};


/**
 * Find `Citizen` object by email
 *
 * @param {String} The email of the citizen
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizen' the `Citizen` object found or `undefined`
 * @return {Module} `citizen` module
 * @api public
 */

exports.getByEmail = function search(email, fn) {
  log('Searching for Citizen with email %s', email);

  Citizen.findOne({email : email})
.select('firstName lastName fullName email profilePictureUrl')
  .exec(function(err, citizen) {
    if (err) {
      return log('Found error: %j', err), fn(err);
    }

    if (!citizen) {
      return log('Citizen not found for email %s', email), fn(null, false);
    };

    log('Found Citizen %j for email %s', citizen.id, email)
    fn(null, citizen);
  });

  return this;
};

/**
 * Lookup `Citizen`s objects by ids
 *
 * @param {Array} ids array to search by
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'citizens' list of `Citizen` objects found or `undefined`
 * @return {Module} `citizen` module
 * @api public
 */

exports.lookup = function lookup(ids, fn) {
  log('Searching for Citizens by ids %s', ids);

  Citizen.find({ _id: { $in: ids }})
  .select('firstName lastName fullName email profilePictureUrl')
  .exec(function(err, citizens) {
    if (err) return log('Found error: %j', err), fn(err);

    log('Found Citizens %j', pluck(citizens, 'id'));

    // Now the citizens list should be ordered
    // as requested by the ids order

    var list = [];
    ids.forEach(function (id) {
      var citizen = citizens.filter(function (c) {
        return c.id == id;
      })[0];
      if (citizen) list.push(citizen);
    });

    log('Delivering Citizens %j', pluck(list, 'id'));
    fn(null, list);
  });

  return this;
};