var express = require('express')
var utils = require('lib/utils')
var forumMiddlewares = require('lib/middlewares/forum-middlewares')
var privileges = forumMiddlewares.privileges

var log = require('debug')('democracyos:api:comments')

var app = module.exports = express()

var keys = [
  'id text createdAt editedAt context reference',
  'author.id author.fullName author.displayName author.avatar',
  'flags upvotes downvotes votes replies.length'
].join(' ')

function findTopicByTopicId (req, res, next) {
  if (!req.query.topic) {
    return res.json(400, {error: 'Missing "topic" parameter.'})
  }

  var topicId = req.query.topic

  api.topic.get(topicId, function (err, topic) {
    if (err) {
      log('Error fetching topic of comment: %s', err)
      return res.status(500).send()
    }

    if (!topic) {
      log('Topic not found: %s', topicId)
      return res.json(400, {error: 'Topic not found.'})
    }

    req.topic = topic

    next()
  })
}

function findForum (req, res, next) {
  if (!req.topic) {
    log('Missing "req.topic".')
    return res.status(500).send()
  }

  if (!req.topic.forum) {
    log('Error finding forum of topic: %s', req.topic._id, req.topic.forum)
    return res.status(500).send()
  }

  api.forum.findById(req.topic.forum, function (_err, forum) {
    if (_err) return _handleError(_err, req, res)
    if (!forum) return res.status(500).send()
    req.forum = forum
    next()
  })
}

app.param('id', function (req, res, next, id) {
  api.comment.getById(id, function (err, comment) {
    if (err) {
      log('Error fetching comment: %s', err)
      return res.status(404).send()
    }

    if (!comment) return res.status(404).send()

    req.comment = comment

    var topicId = comment.topicId || comment.reference

    if (!topicId) {
      log('Error getting topicId of comment: %s', id)
      return res.status(500).send()
    }

    api.topic.get(topicId, function (topicErr, topic) {
      if (topicErr) {
        log('Error fetching topic of comment: %s', topicErr)
        return res.status(500).send()
      }

      if (!topic) {
        log('Error finding topic of comment: %s', id, topicId)
        return res.status(500).send()
      }

      req.topic = topic

      next()
    })
  })
}, findForum)

app.get('/comments', findTopicByTopicId, findForum, privileges('canView'), function (req, res) {
  log('Request /comments')

  var sort = ''
  if (~['-score', '-createdAt', 'createdAt'].indexOf(req.query.sort)) {
    sort = req.query.sort
  } else {
    sort = '-score'
  }

  var paging = {
    page: req.query.page || 0,
    limit: req.query.limit || 0,
    sort: sort
  }

  api.topic.comments(req.topic._id, paging, function (err, comments) {
    if (err) return _handleError(err, req, res)

    if (req.query.count) {
      log('Serving topic %s comments count: %d', req.topic._id, comments.length)
      return res.json(comments.length)
    }

    log('Serving comments of topic %s.', req.topic._id)
    res.json(comments.map(utils.expose(keys)))
  })
})

function _handleError (err, req, res) {
  log('Error found: %j', err)
  res.json({ error: err })
}
