const mongoose = require('mongoose')
const gravatar = require('mongoose-gravatar')
const authMongoose = require('lib/auth/mongoose')
const config = require('lib/config')
const regexps = require('lib/regexps')
const normalizeEmail = require('lib/normalize-email')

const Schema = mongoose.Schema

/**
 * Define `User` Schema
 */

const UserSchema = new Schema({
  firstName: { type: String, maxlength: 100 },
  lastName: { type: String, maxlength: 100 },
  username: { type: String, maxlength: 100 },
  locale: { type: String, enum: config.availableLocales },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: regexps.email,
    maxlength: 200
  },
  emailValidated: { type: Boolean, default: false },
  profiles: {
    facebook: { type: Object },
    twitter: { type: Object },
    custom: { type: Object },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  profilePictureUrl: { type: String },
  disabledAt: { type: Date },
  notifications: {
    replies: { type: Boolean, default: true },
    'new-topic': { type: Boolean, default: false }
  },
  badge: { type: String, maxlength: 50 },
  extra: Schema.Types.Mixed
})

/**
 * Define Schema Indexes for MongoDB
 */

UserSchema.index({ createdAt: -1 })
UserSchema.index({ firstName: 1, lastName: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ 'notifications.replies': 1 })
UserSchema.index({ 'notifications.new-topic': 1 })
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' })

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

UserSchema.set('toObject', { getters: true })
UserSchema.set('toJSON', { getters: true })

UserSchema.options.toObject.transform =
  UserSchema.options.toJSON.transform = function (doc, ret) {
    // remove the hasn and salt of every document before returning the result
    delete ret.hash
    delete ret.salt
  }

/**
 * -- Model's Plugin Extensions
 */

UserSchema.plugin(gravatar, { default: 'mm', secure: true })

UserSchema.plugin(authMongoose)

/**
 * -- Model's API Extension
 */

/**
 * Get `fullName` from `firstName` and `lastName`
 *
 * @return {String} fullName
 * @api public
 */

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

/**
 * Get `displayName` from `firstName`, `lastName` and `<email>` if `config.publicEmails` === true
 *
 * @return {String} fullName
 * @api public
 */

UserSchema.virtual('displayName').get(function () {
  let displayName = this.fullName

  if (config.publicEmails && config.visibility === 'hidden' && this.email) {
    displayName += ' <' + this.email + '>'
  }

  return displayName
})

/**
 * Get `staff` check from configured staff array
 *
 * @return {Boolean} staff
 * @api public
 */

UserSchema.virtual('staff').get(function () {
  const staff = config.staff || []
  return staff.includes(this.email)
})

UserSchema.virtual('avatar').get(function () {
  return this.profilePictureUrl
    ? this.profilePictureUrl
    : this.gravatar({ default: 'mm', secure: true })
})

UserSchema.pre('save', function (next) {
  this.email = normalizeEmail(this.email)
  next()
})

/**
 * Find `User` by its email
 *
 * @param {String} email
 * @return {Error} err
 * @return {User} user
 * @api public
 */

UserSchema.statics.findByEmail = function (email, cb) {
  return this.findOne({ email: normalizeEmail(email) }).exec(cb)
}

/**
 * Find `User` by social provider id
 *
 * @param {String|Number} id
 * @param {String} social
 * @return {Error} err
 * @return {User} user
 * @api public
 */

UserSchema.statics.findByProvider = function (profile, cb) {
  const path = 'profiles.'.concat(profile.provider).concat('.id')
  const query = {}

  query[path] = profile.id

  return this.findOne(query).exec(cb)
}

/**
 * Expose `User` Model
 */

module.exports = function initialize (conn) {
  return conn.model('User', UserSchema)
}
