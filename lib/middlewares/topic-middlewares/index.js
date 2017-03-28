const log = require('debug')('democracyos:topic:middleware')
const api = require('lib/db-api')
const privileges = require('lib/privileges/topic')

exports.findTopic = function findForum (req, res, next) {
  api.topic.searchOne(req.params.id, function (err, topic) {
    if (err) {
      log('Error fetching topic: %s', err)
      return res.status(400).send()
    }

    if (!topic) return res.status(404).send()

    req.topic = topic
    next()
  })
}

exports.privileges = function privilegesMiddlewareGenerator (privilege) {
  if (!privileges[privilege]) throw new Error('Wrong topi privilege name.')

  return function privilegesMiddleware (req, res, next) {
    var forum = req.forum
    var user = req.user
    var topic = req.topic

    if (!forum || !topic) {
      log('Couldn\'t find forum or topic.')
      return res.status(404).send()
    }

    if (privileges[privilege](forum, user, topic)) return next()

    log(`User tried to make a restricted action. User: ${user && user._id} Forum: ${forum.name} Topic: ${topic.id} Privilege: ${privilege}`)
    return res.status(401).send()
  }
}
