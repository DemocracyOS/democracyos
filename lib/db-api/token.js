/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Token = mongoose.model('Token')
  , log = require('debug')('db-api:token');


/**
 * Get single token from ObjectId or HexString
 *
 * @param {Mixed} id ObjectId or HexString for token
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object found or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for token %j', id)
  token.findById(id, function (err, token) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering token %j', token);
    fn(null, token);
  })
  return this;
};

/**
 * Create password reset Token for a citizen
 *
 * @param {Object} citizen object for which the
 * password reset Token is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object created or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.createPasswordResetToken = function createPasswordResetToken(citizen, fn) {
  log('Creating new password reset token for citizen %j', citizen);
  var passwordResetToken = new Token({
    user : citizen,
    scope : 'password-reset'
  })
  passwordResetToken.save(function (err, saved) {
    if (err) {
	    log('Found error %j', err);
	    fn(err);
      return;
    };

    log('Delivering password reset token %j', saved);
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