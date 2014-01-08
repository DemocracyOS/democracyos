/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var passportLocalMongoose = require('passport-local-mongoose');
var gravatar = require('mongoose-gravatar');
var regexps = require('lib/regexps');

/**
 * Define `Citizen` Schema
 */

var CitizenSchema = new Schema({
	  firstName: { type: String }
	, lastName:  { type: String }
	, username:  { type: String }
  , avatar:    { type: String }
  , email:     { type: String, lowercase: true, trim: true, match: regexps.email } // main email
  , emailValidated: { type: Boolean, default: false }
	, profiles:  {
        facebook: { type: Object }
      , twitter:  { type: Object }
    }
	, createdAt: { type: Date, default: Date.now }
	, updatedAt: { type: Date }
});

/**
 * Define Schema Indexes for MongoDB
 */

CitizenSchema.index({ createdAt: -1 });
CitizenSchema.index({ firstName: 1, lastName: 1 });

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for 
 * proper JSON API response
 */

CitizenSchema.set('toObject', { getters: true });
CitizenSchema.set('toJSON', { getters: true });

CitizenSchema.options.toObject.transform =
CitizenSchema.options.toJSON.transform = function(doc, ret, options) {
  // remove the hasn and salt of every document before returning the result
  delete ret.hash;
  delete ret.salt;
}

/**
 * -- Model's Plugin Extensions
 */

CitizenSchema.plugin(gravatar, { default: "mm" });

CitizenSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  userExistsError: 'Ya existe un ciudadano con el correo electrónico %s'
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

CitizenSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
});

/**
 * Set `fullName` from `String` param splitting
 * and calling firstName as first value and lastName
 * as the concatenation of the rest values
 *
 * @param {String} name
 * @return {Citizen}
 * @api public
 */

CitizenSchema.virtual('fullName').set(function(name) {
  var split = name.split(' ');
  if(split.length) {
    this.firstName = split.shift();
    this.lastName = split.join(' ');
  }

  return this;
});

/**
 * Find `Citizen` by its email
 * 
 * @param {String} email
 * @return {Error} err
 * @return {Citizen} citizen
 * @api public
 */

CitizenSchema.statics.findByEmail = function(email, cb) {
  return this.findOne({ email: email })
    .exec(cb);
}

/**
 * Find `Citizen` by social provider id
 * 
 * @param {String|Number} id
 * @param {String} social
 * @return {Error} err
 * @return {Citizen} citizen
 * @api public
 */

CitizenSchema.statics.findByProvider = function(profile, cb) {
  var path = 'profiles.'.concat(profile.provider).concat('.id');
  var query = {};
  query[path] = profile.id;
  return this.findOne(query)
    .exec(cb);
}

/**
 * Expose `Citizen` Model
 */

module.exports = mongoose.model('Citizen', CitizenSchema);
