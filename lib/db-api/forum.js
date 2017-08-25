var pick = require('mout/object/pick')
var Log = require('debug')
var models = require('lib/models')
var pluck = require('lib/utils').pluck
var log = new Log('democracyos:db-api:forum')
var Forum = models.Forum

exports.all = function all (options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = undefined
  }

  log('Looking for all forums.')

  var query = Forum
    .find({ deletedAt: null })
    .populate('owner')
    .sort('-createdAt')

  if (options) {
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.owner) query.find({ owner: options.owner })

    if (options['privileges.canChangeTopics']) {
      query.find({
        $or: [
          { owner: options['privileges.canChangeTopics'] },
          {
            permissions: {
              $elemMatch: { user: options['privileges.canChangeTopics'] }
            }
          }
        ]
      })
    }
  }

  if (!options || (!options.owner && !options['privileges.canChangeTopics'])) {
    query.find({ visibility: { $ne: 'private' } })
  }

  query.exec(function (err, forums) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering forums %j', pluck(forums, 'id'))
    fn(null, forums)
  })

  return this
}

exports.create = function create (data, fn) {
  log('Creating new forum.')

  var forum = new Forum(data)
  forum.save(onsave)

  function onsave (err) {
    if (err) {
      log('Found error: %s', err)
      return fn(err)
    }

    log('Saved forum with id %s', forum.id)
    fn(null, forum)
  }
}

exports.update = function update (forum, data, fn) {
  var attrs = pick(data, ['visibility'])
  forum.set(attrs)
  return forum.save(fn)
}

exports.del = function del (forum, fn) {
  log('Deleting forum %s', forum.name)
  forum.delete(function (err) {
    if (err) log('Found error: %s', err)
    return fn(err)
  })
}

exports.findOneByOwner = function findOneByOwner (owner, fn) {
  log('Searching forum of owner %j', owner)

  Forum
    .where({ owner: owner, deletedAt: null })
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      if (forum) log("Found forum '%s' of %j", forum.name, owner)
      else log('Not Found forum of %j', owner)

      fn(null, forum)
    })

  return this
}

exports.findByOwner = function findByOwner (owner, fn) {
  log('Searching forums of owner %j', owner)

  Forum
    .where({ owner: owner, deletedAt: null })
    .populate('owner')
    .find(function (err, forums) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      fn(null, forums)
    })

  return this
}

exports.findById = function findById (id, fn) {
  log('Searching for forum with id %s', id)

  Forum
    .where({ deletedAt: null, _id: id })
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      } else if (!forum) {
        log('No forum found with id %s', id)
        return fn()
      }

      log('Found forum %s', forum.id)
      fn(null, forum)
    })

  return this
}

exports.findOneByName = function findOneByName (name, fn) {
  log('Searching for forum with name %s', name)

  var query = { deletedAt: null }

  if (name) query.name = name

  Forum
    .where(query)
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      } else if (!forum) {
        log('No forum found with name %s', name)
        return fn()
      }

      log('Forum coverurl %s', forum.coverUrl)
      log('Found forum %s', forum.name)
      fn(null, forum)
    })

  return this
}

exports.nameIsValid = function nameIsValid (name) {
  return Forum.nameIsValid(name)
}

exports.getPermissions = function getPermissions (id, fn) {
  log('Searching for permissions of forum with id %s', id)

  Forum
    .where({ deletedAt: null, _id: id })
    .select('permissions')
    .populate('permissions.user')
    .findOne((err, forum) => {
      return fn(err, forum.permissions.toObject())
    })
}

exports.grantPermission = function grantPermission (forumId, user, role) {
  log('Granting permissions as role %s to user %s of forum with id %s', role, user, forumId)
  return new Promise((resolve, reject) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return reject(findError)

      forum.grantPermission(user, role, (saveError) => {
        if (saveError) return reject(saveError)
        return resolve(forum)
      })
    })
  })
}

exports.revokePermission = function revokePermission (forumId, user, role) {
  log(`Revoking permissions to ${user} on forum ${forumId}.`)

  return new Promise((resolve, reject) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return reject(findError)
      forum.revokePermission(user, role, (revokeError) => {
        if (revokeError) return reject(revokeError)
        log(`Permissions revoked to ${user} on forum ${forumId}.`)
        return resolve(forum)
      })
    })
  })
}

exports.exists = function exists (name, fn) {
  name = normalize(name)
  Forum
    .find({ deletedAt: null, name: name })
    .limit(1)
    .exec(function (err, forum) {
      return fn(err, !!(forum && forum.length))
    })
}

function normalize (str) {
  return str.trim().toLowerCase()
}
