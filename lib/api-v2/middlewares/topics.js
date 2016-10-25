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

exports.findByBodyReference = function findByBodyReference (req, res, next) {
  exports.findWithId(req, res, next, req.body.reference)
}
