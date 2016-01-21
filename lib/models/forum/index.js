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
var reservedNames = require('./reserved-names');
var roles = require('./roles');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


/**
 * Permission Schema
 */

var PermissionSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: roles,
    required: true,
    default: 'collaborator'
  }
});

/**
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
  summary: {
    type: String,
    trim: true,
    validate: {
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
  permissions: [PermissionSchema],
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

ForumSchema.methods.isOwner = function (user) {
  return getIdString(this.owner) === getIdString(user);
};

ForumSchema.methods.hasRole = function (role, user) {
  var userId = getIdString(user);
  return !!this.permissions.find(p => {
    return getIdString(p.user) === userId && p.role === role;
  });
};

ForumSchema.methods.grantPermission = function (user, role, cb) {
  if (this.isOwner(user)) {
    return cb(new Error('The forum owner cannot be given another role.'));
  }

  this.permissions.push({
    user: user,
    role: role
  });

  this.save(cb);
};

ForumSchema.methods.revokePermission = function (user, cb) {
  var userId = getIdString(user);
  var permission = this.permissions.find(p => getIdString(p.user) === userId);

  if (!permission) return cb(new Error('User not found.'));

  permission.remove();

  this.save(cb);
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

function getIdString (id) {
  if (typeof id === 'string') return id;
  if (id instanceof mongoose.Types.ObjectId) return id.toString();
  if (typeof id === 'object' && id._id) return id._id.toString();
  if (typeof id === 'object' && typeof id.id === 'string') return id.id;
  throw new Error('Invalid id value');
}
