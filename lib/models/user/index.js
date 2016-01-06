import gravatar from 'mongoose-gravatar'
import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import UserSchema from './schema'
import config from 'config'

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

UserSchema.set('toObject', { getters: true })
UserSchema.set('toJSON', { getters: true })

UserSchema.options.toObject.transform =
UserSchema.options.toJSON.transform = function(doc, ret, options) {
  // remove the hash and salt of every document before returning the result
  delete ret.hash
  delete ret.salt
}

/**
 * -- Model's Plugin Extensions
 */

UserSchema.plugin(gravatar, { default: 'mm', secure: true })

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  userExistsError: 'There is already a user using %s'
})

/**
 * Define Schema Indexes for MongoDB
 */

UserSchema.index({ createdAt: -1 })
UserSchema.index({ firstName: 1, lastName: 1 })
UserSchema.index({ email: 1 })

/**
 * Get `fullName` from `firstName` and `lastName`
 *
 * @return {String} fullName
 * @api public
 */

UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})

/**
 * Get `staff` check from configured staff array
 *
 * @return {Boolean} staff
 * @api public
 */

UserSchema.virtual('staff').get(function() {
  var staff = config.staff || []
  return !!~staff.indexOf(this.email)
})

UserSchema.virtual('avatar').get(function() {
  return this.profilePictureUrl
    ? this.profilePictureUrl
    : this.gravatar({ default: 'mm', secure: true })
})

/**
 * Find `User` by its email
 *
 * @param {String} email
 * @return {Error} err
 * @return {User} user
 * @api public
 */

UserSchema.statics.findByEmail = function(email, cb) {
  return this.findOne({ email: email }).exec(cb)
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

UserSchema.statics.findByProvider = function(profile, cb) {
  const path = 'profiles.'.concat(profile.provider).concat('.id')
  let query = {}
  query[path] = profile.id
  return this.findOne(query).exec(cb)
}

export default mongoose.model('User', UserSchema)
