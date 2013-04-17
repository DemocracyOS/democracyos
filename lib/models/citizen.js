/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , passportLocalMongoose = require('passport-local-mongoose')

/**
 * Define `Citizen` Schema
 */

var CitizenSchema = new Schema({
	  firstName: { type: String }
	, lastName:  { type: String }
	, username:  { type: String }
  , email:     { type: String }
	, address:   { type: String }
	, hometown:  { type: String }
	, location:  { type: String }
	, profiles:  {
        facebook: { type: Object }
      , twitter:  {type: Object }
    }
	, createdAt: { type: Date, default: Date.now }
	, updatedAt: { type: Date }
});

/**
 * Define Schema Indexes for MongoDB
 */

CitizenSchema.index({ firstName:1, lastName:1 });


/**
 * -- Model's Plugin Extensions
 */

/**
 * Attach PassportJS Local Mongoose helpers
 */

CitizenSchema.plugin( passportLocalMongoose, { usernameField: 'email' } );

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
  return this.findOne({ email: email})
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

CitizenSchema.statics.findByProvider = function(sid, provider, cb) {
  var path = 'profiles.'.concat(provider).concat('.id');
  var query = {};
  query[path] = parseInt(sid, 10);
  return this.findOne(query)
    .exec(cb);
}

/**
 * Expose `Citizen` Model
 */

module.exports = mongoose.model('Citizen', CitizenSchema);
