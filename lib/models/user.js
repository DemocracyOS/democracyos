/**
 * Module dependencies.
 */

var config = require('lib/config');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var gravatar = require('mongoose-gravatar');
var regexps = require('lib/regexps');
var normalizeEmail = require('lib/normalize-email');
var Schema = mongoose.Schema;

/**
 * Define `User` Schema
 */

var UserSchema = new Schema({
    firstName: { type: String }
  , lastName:  { type: String }
  , username:  { type: String }
  , locale:    { type: String, enum: config.availableLocales }
  , email:     { type: String, lowercase: true, trim: true, match: regexps.email } // main email
  , emailValidated: { type: Boolean, default: false }
  , profiles:  {
        facebook: { type: Object }
      , twitter:  { type: Object }
    }
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
  , profilePictureUrl: { type: String }
  , disabledAt: { type: Date }
  , notifications: {
    replies: { type: Boolean, default: true },
    'new-topic': { type: Boolean, default: true }
  }
});

/**
 * Define Schema Indexes for MongoDB
 */

UserSchema.index({createdAt: -1});
UserSchema.index({firstName: 1, lastName: 1});
UserSchema.index({email: 1});
UserSchema.index({'notifications.replies': 1});
UserSchema.index({'notifications.new-topic': 1});
UserSchema.index({firstName: 'text', lastName: 'text', email: 'text'});


/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

UserSchema.set('toObject', { getters: true });
UserSchema.set('toJSON', { getters: true });

UserSchema.options.toObject.transform =
UserSchema.options.toJSON.transform = function(doc, ret) {
  // remove the hasn and salt of every document before returning the result
  delete ret.hash;
  delete ret.salt;
};

/**
 * -- Model's Plugin Extensions
 */

UserSchema.plugin(gravatar, { default: 'mm', secure: true });

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  userExistsError: 'There is already a user using %s'
});

/**
 * -- Model's API Extension
 */

/**
 * Get `fullName` from `firstName` and `lastName`
 *
 * @return {String} fullName
 * @api public
 */

UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

/**
 * Get `displayName` from `firstName`, `lastName` and `<email>` if `config.publicEmails` === true
 *
 * @return {String} fullName
 * @api public
 */

UserSchema.virtual('displayName').get(function() {
  var displayName = this.fullName;

  if (config.publicEmails && config.visibility == 'hidden' && this.email) {
    displayName += ' <' + this.email + '>';
  }

  return displayName;
});

/**
 * Get `staff` check from configured staff array
 *
 * @return {Boolean} staff
 * @api public
 */

UserSchema.virtual('staff').get(function() {
  var staff = config.staff || [];
  return !!~staff.indexOf(this.email);
});

UserSchema.virtual('avatar').get(function() {
  return this.profilePictureUrl
    ? this.profilePictureUrl
    : this.gravatar({ default: 'mm', secure: true });
});

UserSchema.pre('save', function (next) {
  this.email = normalizeEmail(this.email);
  next();
});

/**
 * Find `User` by its email
 *
 * @param {String} email
 * @return {Error} err
 * @return {User} user
 * @api public
 */

UserSchema.statics.findByEmail = function(email, cb) {
  return this.findOne({ email: normalizeEmail(email) })
    .exec(cb);
};

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
  var path = 'profiles.'.concat(profile.provider).concat('.id');
  var query = {};
  query[path] = profile.id;
  return this.findOne(query)
    .exec(cb);
};

/**
 * Expose `User` Model
 */

module.exports = function initialize(conn) {
  return conn.model('User', UserSchema);
};
