/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var User = require('lib/models').User;
var utils = require('lib/utils');
var pluck = utils.pluck;
var log = require('debug')('democracyos:db-api:user');
var expose = utils.expose;

/**
 * Get all users
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list items found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all users.');

  User
  .find()
  .sort('-createdAt')
  .exec(function (err, users) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering all users %j', pluck(users, 'id'));
    fn(null, users);
  });
  return this;
};

/**
 * Get User for `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id User's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' single object created or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  log('Looking for User %s', id);

  User
  .findById(id)
  .exec(function (err, user) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering User %j', user);
    fn(null, user);
  });
  return this;
};

/**
 * Search `User` objects from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.search = function search(query, fn) {
  log('Searching for users matching %s', query);

  User
    .find({$text: {$search: query }}, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .limit(10)
    .exec(function(err, users) {
      if (err) {
        log('Found error: %j', err);
        return fn(err);
      }

      log('Found users %j for hash %s', pluck(users, 'id'), query);
      fn(null, users);
    });

  return this;
};

/**
 * Get `User` objects whose email has been validated
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.findEmailValidated = function findEmailValidated(fn) {
  log('Searching for email validated users matching');

  User.find({ emailValidated: true })
  .exec(function(err, users) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found %d email validated users', users.length)
    fn(null, users);
  });

  return this;
};


/**
 * Find `User` object by email
 *
 * @param {String} The email of the user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' the `User` object found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.getByEmail = function search(email, fn) {
  log('Searching for User with email %s', email);

  User.findOne({email: email})
  .select('firstName lastName fullName email avatar profilePictureUrl notifications emailValidated')
  .exec(function(err, user) {
    if (err) {
      return log('Found error: %j', err), fn(err);
    }

    if (!user) {
      return log('User not found for email %s', email), fn(null, false);
    };

    log('Found User %j for email %s', user.id, email)
    fn(null, user);
  });

  return this;
};

/**
 * Lookup `User`s objects by ids
 *
 * @param {Array} ids array to search by
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.lookup = function lookup(ids, fn) {
  log('Searching for users by ids %s', ids);

  User.find({ _id: { $in: ids }})
  .select('firstName lastName fullName email avatar profilePictureUrl notifications')
  .exec(function(err, users) {
    if (err) return log('Found error: %j', err), fn(err);

    log('Found users %j', pluck(users, 'id'));

    // Now the users list should be ordered
    // as requested by the ids order

    var list = [];
    ids.forEach(function (id) {
      var user = users.filter(function (c) {
        return c.id == id;
      })[0];
      if (user) list.push(user);
    });

    log('Delivering users %j', pluck(list, 'id'));
    fn(null, list);
  });

  return this;
};


/**
 * User interfaces functions.
 */

exports.expose = {};


/**
 * Expose user attributes to be used on a private manner.
 * e.g.: '/api/user/me' call from an authenticated user.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.confidential = function(user){
  return expose('id firstName lastName displayName email avatar staff notifications locale')(user);
}


/**
 * Expose user attributes to be used publicly.
 * e.g.: Search calls, users listings.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.ordinary = function(user){
  return expose('id fullName displayName avatar locale')(user);
}
