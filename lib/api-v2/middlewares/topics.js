var debug = require('debug')
var api = require('../db-api')

var log = debug('democracyos:api:middlewares:topics')

module.exports.findByTopicId = function findByTopicId (req, res, next) {
  var id = req.query.topicId

  api.topics.find({_id: id})
    .findOne()
    .exec((err, topic) => {
      if (err) {
        log('ERROR topics.findByTopicId', err)
        next(new Error('Server error finding topic.'))
        return
      }

      if (!topic) {
        var nextErr = new Error(`Topic ${id} not found.`)
        nextErr.status = 404
        nextErr.code = 'TOPIC_NOT_FOUND'
        log(`Topic ${id} not found.`, err)
        next(nextErr)
        return
      }

      req.topic = topic

      next()
    })
}
