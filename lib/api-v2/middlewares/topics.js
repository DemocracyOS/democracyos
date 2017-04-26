const privileges = require('lib/privileges/topic')
const api = require('../db-api')

exports.privileges = Object.keys(privileges).reduce((middles, privilege) => {
  function middleware (req, res, next) {
    if (privileges[privilege](req.forum, req.user, req.topic)) return next()

    const err = new Error('User doesn\'t have enough privileges on topic.')
    err.status = 403
    err.code = 'LACK_PRIVILEGES'

    next(err)
  }

  middles[privilege] = middleware
  return middles
}, {})

function findWithId (req, res, next, id) {
  api.topics.find({ _id: id })
    .findOne()
    .exec()
    .then((topic) => {
      if (!topic) {
        const err = new Error(`Topic ${id} not found.`)
        err.status = 404
        err.code = 'TOPIC_NOT_FOUND'
        return next(err)
      }

      req.topic = topic

      next()
    })
    .catch(next)
}

exports.findById = function findById (req, res, next) {
  findWithId(req, res, next, req.params.id)
}

exports.findByTopicId = function findByTopicId (req, res, next) {
  findWithId(req, res, next, req.query.topicId)
}

exports.findFromComment = function findFromComment (req, res, next) {
  findWithId(req, res, next, req.comment.reference)
}

exports.findByBodyTopicId = function findByBodyTopicId (req, res, next) {
  findWithId(req, res, next, req.body.topicId)
}
