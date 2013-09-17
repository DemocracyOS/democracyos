/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , PasswordResetToken = mongoose.model('PasswordResetToken')
  , log = require('debug')('db-api:password-reset-token');


/**
 * Get single passwordResetToken from ObjectId or HexString
 *
 * @param {Mixed} id ObjectId or HexString for PasswordResetToken
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'passwordResetToken' single passwordResetToken object found or `undefined`
 * @return {Module} `passwordResetToken` module
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for passwordResetToken %j', id)
  PasswordResetToken.findById(id, function (err, passwordResetToken) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering passwordResetToken %j', passwordResetToken);
    fn(null, passwordResetToken)
  })
  return this;
};

/**
 * Create PasswordResetToken from `passwordResetToken` descriptor
 *
 * @param {Object} citizen object for which the
 * PasswordResetToken is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'passwordResetToken' single passwordResetToken object found or `undefined`
 * @return {Module} `passwordResetToken` module
 * @api public
 */

exports.create = function create(citizen, fn) {
  log('Creating new passwordResetToken for citizen %j', citizen);
  var passwordResetToken = new PasswordResetToken({
    user : citizen
  })
  passwordResetToken.save(function (err, saved) {
    if (err) {
	    log('Found error %j', err);
	    fn(err);
      return;
    };

    log('Delivering passwordResetToken %j', saved);
    fn(null, saved);
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
  return source.map(function(item) { return item[prop]; });
}