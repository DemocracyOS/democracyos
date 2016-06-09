/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

var Schema = mongoose.Schema

/**
 * Define `User` Schema
 */

var WhitelistSchema = new Schema({
  type: { type: String, enum: [ 'email' ], required: true, default: 'email' },
  value: { type: String, lowercase: true, trim: true, index: true }
})

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

WhitelistSchema.set('toObject', { getters: true })
WhitelistSchema.set('toJSON', { getters: true })

/**
 * Find `User` by its value
 *
 * @param {String} value
 * @return {Error} err
 * @return {User} user
 * @api public
 */

WhitelistSchema.statics.findByValue = function (value, cb) {
  return this.findOne({ value: value })
    .exec(cb)
}

/**
 * Expose `User` Model
 */

module.exports = function initialize (conn) {
  return conn.model('Whitelist', WhitelistSchema)
}
