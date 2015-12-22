/**
* Extend module's NODE_PATH
* HACK: temporary solution
*/

require('node-path')(module);

/**
* Module dependencies.
*/

var mongoose = require('mongoose');
var regexps = require('lib/regexps');
var reservedNames = require('./forum-reserved-names');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
 * Forum Schema
 */

var ForumSchema = new Schema({
  name: {
    type: String,
    index: true,
    required: true,
    trim: true,
    lowercase: true,
    match: regexps.forum.name
  },
  title: { type: String, required: true, trim: true },
  summary: { type: String, trim: true, validate: {
      validator: function(summary) {
        summary = summary || '';
        return summary.length < 300;
      },
      message: 'validators.max-length.plural'
    }
  },
  imageUrl: { type: String },
  owner: { type: ObjectId, required: true, ref: 'User' },
  private: { type: Boolean, default: false },
  closed: { type: Boolean, default: false },
  permissions: {
    admins: [{ type: ObjectId, ref: 'User' }],
    collaborators: [{ type: ObjectId, ref: 'User' }]
  },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

ForumSchema.index({ id: -1, deletedAt: -1 });
ForumSchema.index({ owner: -1, deletedAt: -1 });
ForumSchema.index({ name: -1, deletedAt: -1 });

ForumSchema.pre('save', validateNameUniqueness);

function validateNameUniqueness (next) {
  var self = this;
  this.constructor
  .where({ deletedAt: null, name: this.name })
  .exec(function(err, forums) {
    if (err) return next(err);
    if (1 === forums.length && self._id.equals(forums[0]._id)) return next();
    if (forums.length) return next(new Error('Name already taken.'));
    next();
  });
}

ForumSchema.path('name').validate(function(val){
  return !~reservedNames.indexOf(val);
}, 'Reserved name');

ForumSchema.statics.nameIsValid = function (name) {
  if (!regexps.forum.name.test(name)) return false;
  if (~reservedNames.indexOf(name)) return false;
  return true;
};

ForumSchema.methods.delete = function (cb) {
  this.deletedAt = new Date();
  this.save(cb);
};

ForumSchema.methods.isAdmin = function (user) {
  var ownerId = this.owner instanceof ObjectId ? this.owner : this.owner._id;
  var userId = 'string' === typeof user ? user : user._id;
  return ownerId.equals(userId);
};

ForumSchema.methods.hasRole = function (role, user) {
  return this.permissions && this.permissions[role] && this.permissions[role].indexOf(user.id) >= 0;
};

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

ForumSchema.set('toObject', { getters: true });
ForumSchema.set('toJSON', { getters: true });

module.exports = function initialize(conn) {
  return conn.model('Forum', ForumSchema);
};
