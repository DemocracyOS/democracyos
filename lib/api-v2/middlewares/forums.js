var debug = require('debug')
var api = require('../db-api')
var privileges = require('lib/middlewares/forum-middlewares').privileges

var log = debug('democracyos:api:middlewares:forum')

module.exports.privileges = privileges

module.exports.findFromTopic = function findFromTopic (req, res, next) {
  var id = req.topic.forum

  api.forums.find({_id: id})
    .findOne()
    .exec((err, forum) => {
      if (err) {
        log('ERROR forums.findFromTopic', err)
        next(new Error('Server error finding forum.'))
        return
      }

      if (!forum) {
        var nextErr = new Error(`Forum ${id} not found.`)
        nextErr.status = 404
        nextErr.code = 'FORUM_NOT_FOUND'
        log(`Forum ${id} not found.`, err)
        next(nextErr)
        return
      }

      req.forum = forum

      next()
    })
}
