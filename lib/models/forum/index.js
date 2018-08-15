var mongoose = require('mongoose')
var regexps = require('lib/regexps')
var getIdString = require('lib/utils').getIdString
var reservedNames = require('./reserved-names')
var roles = require('./roles')
var visibilities = require('./visibilities')
var topicsAttrs = require('./topics-attrs')

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

/**
 * Permission Schema
 */

var PermissionSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: roles,
    required: true,
    default: 'collaborator'
  }
})

/**
 * Forum Schema
 */

var ForumSchema = new Schema({
  name: {
    type: String,
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
      validator: function (summary) {
        summary = summary || ''
        return summary.length < 300
      },
      message: 'validators.max-length.plural'
    }
  },
  coverUrl: { type: String },
  owner: { type: ObjectId, required: true, ref: 'User' },
  visibility: {
    type: String,
    enum: visibilities,
    default: 'public'
  },
  permissions: [PermissionSchema],
  createdAt: { type: Date, default: Date.now },
  extra: Schema.Types.Mixed,
  deletedAt: { type: Date },
  initialTags: []
})

ForumSchema.plugin(topicsAttrs)

ForumSchema.index({ id: -1, deletedAt: -1 })
ForumSchema.index({ name: 1 })
ForumSchema.index({ owner: -1, deletedAt: -1 })
ForumSchema.index({ name: -1, deletedAt: -1 })
ForumSchema.index({ title: 'text' })

ForumSchema.pre('save', validateNameUniqueness)

function validateNameUniqueness (next) {
  var self = this
  this.constructor
    .where({ deletedAt: null, name: this.name })
    .exec(function (err, forums) {
      if (err) return next(err)
      if (forums.length === 1 && self._id.equals(forums[0]._id)) return next()
      if (forums.length) return next(new Error('Name already taken.'))
      next()
    })
}

ForumSchema.path('name').validate(function (val) {
  return !~reservedNames.indexOf(val)
}, 'Reserved name')

ForumSchema.statics.nameIsValid = function (name) {
  if (!regexps.forum.name.test(name)) return false
  if (~reservedNames.indexOf(name)) return false
  return true
}

ForumSchema.methods.delete = function (cb) {
  this.deletedAt = new Date()
  this.save(cb)
}

ForumSchema.methods.isOwner = function (user) {
  if (!user) return false
  return getIdString(this.owner) === getIdString(user)
}

/**
 * Function to check if user has a role on the forum
 * @param user - Any valid user id
 * @param role - The rest of the params are strings of roles
 * @return Boolean
 */
ForumSchema.methods.hasRole = function (user /* ,...role */) {
  if (!user) return false

  var permission = this.getPermission(user)
  if (!permission) return false

  var role = [].slice.call(arguments, 1)
  if (!role.length) return true

  // Check if roles are correctly written
  role.forEach((r) => {
    if (!~roles.indexOf(r)) throw new Error('Invalid role name "' + r + '".')
  })

  return !!~role.indexOf(permission.role)
}

/**
 * Function to check if the forum has an specific visibility
 * @param String visibility
 * @return Boolean
 */
ForumSchema.methods.hasVisibility = function (/* ...visibility */) {
  var visibility = [].slice.call(arguments, 0)

  // Check if visibilities are correctly written
  visibility.forEach((v) => {
    if (!~visibilities.indexOf(v)) {
      throw new Error('Invalid visibility name "' + v + '".')
    }
  })

  return visibility.some((v) => v === this.visibility)
}

ForumSchema.methods.getPermission = function (user) {
  var userId = getIdString(user)
  return this.permissions.find((p) => getIdString(p.user) === userId)
}

ForumSchema.methods.grantPermission = function (user, role, cb) {
  if (this.isOwner(user)) {
    const err = new Error('The forum owner cannot be given another role.')
    err.code = 'FORUM_OWNER_CANT_HAVE_ANOTHER_ROLE'
    err.translation = 'admin-permissions.error.forum.owner.cant.have.another.role'
    return cb(err)
  }

  var permission = this.getPermission(user)

  if (permission) {
    permission.set('role', role)
  } else {
    this.permissions.push({
      user: user,
      role: role
    })
  }

  this.save(cb)
}

ForumSchema.methods.revokePermission = function (user, role, cb) {
  var userId = getIdString(user)
  var permission = this.permissions.find((p) => getIdString(p.user) === userId)

  if (!permission) {
    const err = new Error('User not found.')
    err.code = 'USER_NOT_FOUND'
    err.translation = 'admin-permissions.error.user.not.found'
    return cb(err)
  }

  if (permission.role !== role) {
    const err = new Error('The user doesnt have that permission.')
    err.code = 'USER_DONT_HAVE_PERMISSION'
    err.translation = 'admin-permissions.error.user.dont.have.permission'
    return cb(err)
  }

  permission.remove()

  this.save(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

ForumSchema.set('toObject', { getters: true })
ForumSchema.set('toJSON', { getters: true })

module.exports = function initialize (conn) {
  return conn.model('Forum', ForumSchema)
}
