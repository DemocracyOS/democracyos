const ObjectID = require('mongoose').Types.ObjectId
const privileges = require('lib/privileges/forum')
const Topic = require('lib/models').Topic
const config = require('lib/config')
const api = require('../db-api')

exports.privileges = Object.keys(privileges).reduce((middles, privilege) => {
  function middleware (req, res, next) {
    if (privileges[privilege](req.forum, req.user)) return next()

    const err = new Error('User doesn\'t have enough privileges on forum.')
    err.status = 403
    err.code = 'LACK_PRIVILEGES'

    next(err)
  }

  middles[privilege] = middleware
  return middles
}, {})

function findWithId (id, req, res, next) {
  api.forums.find({ _id: id })
    .findOne()
    .exec()
    .then((forum) => {
      if (!forum) return next(new Error404(id))

      req.forum = forum

      next()
    })
    .catch(next)
}

exports.findById = function findById (req, res, next) {
  return findWithId(req.params.id, req, res, next)
}

exports.findFromBody = function findFromBody (req, res, next) {
  return findWithId(req.body.forum, req, res, next)
}

exports.findFromQuery = function findFromBody (req, res, next) {
  return findWithId(req.query.forum, req, res, next)
}

exports.findFromTopic = function findFromTopic (req, res, next) {
  return findWithId(req.topic.forum, req, res, next)
}

exports.findByName = function findByName (req, res, next) {
  const name = config.multiForum ? req.query.forum : config.defaultForum

  api.forums.find({ name: name })
    .findOne()
    .exec()
    .then((forum) => {
      if (!forum) return next(new Error404(name))

      req.forum = forum

      next()
    })
    .catch(next)
}

exports.findTags = function findTags (req, res, next) {
  const id = req.forum.id

  Topic.aggregate([
    { $match: { forum: new ObjectID(id), deletedAt: null } },
    { $unwind: '$tags' },
    { '$group': { '_id': '$tags', 'count': { '$sum': 1 } } },
    { '$sort': { 'count': -1 } }
  ], function (err, result) {
    if (err) return next()
    req.tags = result.map((t) => ({ tag: t._id, count: t.count }))
    next()
  })
}

class Error404 extends Error {
  constructor (id) {
    super(`Forum ${id} not found.`)

    this.status = 404
    this.code = 'FORUM_NOT_FOUND'
  }
}
