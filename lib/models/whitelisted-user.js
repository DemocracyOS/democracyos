/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var regexps = require('lib/regexps');

var Schema = mongoose.Schema;

/**
 * Define `User` Schema
 */

var WhitelistedUserSchema = new Schema({
  email: { type: String, lowercase: true, trim: true, match: regexps.email, index: true }
});


/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

 WhitelistedUserSchema.set('toObject', { getters: true });
 WhitelistedUserSchema.set('toJSON', { getters: true });

/**
 * Find `User` by its email
 *
 * @param {String} email
 * @return {Error} err
 * @return {User} user
 * @api public
 */

 WhitelistedUserSchema.statics.findByEmail = function(email, cb) {
  return this.findOne({ email: email })
    .exec(cb);
}

/**
 * Expose `User` Model
 */

module.exports = function initialize(conn) {
  return conn.model('WhitelistedUser', WhitelistedUserSchema);
};
