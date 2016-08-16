var Topic = require('lib/models').Topic

var log = require('debug')('democracyos:api:topics:middlewares')

module.exports.findByTopicId = function findByTopicId (req, res, next) {
  var id = req.query.topicId
  Topic.findDefault({_id: id})
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
