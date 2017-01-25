const api = require('../db-api')

exports.findWithId = function findWithId (req, res, next, id) {
  api.topics.find({_id: id})
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

exports.findByTopicId = function findByTopicId (req, res, next) {
  exports.findWithId(req, res, next, req.query.topicId)
}

exports.findFromComment = function findFromComment (req, res, next) {
  exports.findWithId(req, res, next, req.comment.reference)
}

exports.findByBodyTopicId = function findByBodyTopicId (req, res, next) {
  exports.findWithId(req, res, next, req.body.topicId)
}

exports.findAllFromForum = function findAllFromForum (req, res, next) {
  const id = req.forum.id
  api.topics.find({forum: id})
    .exec()
    .then((topics) => {
      if (!topics) {
        const err = new Error(`Topics from Forum ${id} not found.`)
        err.status = 404
        err.code = 'TOPICS_NOT_FOUND'
        return next(err)
      }

      req.topics = topics

      next()
    })
    .catch(next)
}
