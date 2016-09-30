var express = require('express')
var api = require('lib/db-api')
var utils = require('lib/utils')
var accepts = require('lib/accepts')
var restrict = utils.restrict
var expose = utils.expose
var log = require('debug')('democracyos:topic')
var config = require('lib/config')
var notifier = require('lib/notifications').notifier
var forumMiddlewares = require('lib/middlewares/forum-middlewares')
var privileges = forumMiddlewares.privileges
var migrateTopic = require('lib/migrations/topic')

var app = module.exports = express()

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'))

var topicListKeys = [
  'id topicId title mediaTitle status open closed public draft deleted forum',
  'tag participants voted createdAt updatedAt closingAt coverUrl',
  'publishedAt deletedAt votable clauseTruncationText links author authorUrl'
].join(' ')

var topicKeys = [
  topicListKeys,
  'summary clauses source state upvotes downvotes abstentions'
].join(' ')

function exposeTopic (topicDoc, user, keys) {
  if (!keys) keys = topicKeys

  var topic = topicDoc.toJSON()
  topic.voted = topicDoc.votedBy(user)

  return expose(keys)(topic)
}

app.param('id', function (req, res, next, id) {
  api.topic.searchOne(id, function (err, topic) {
    if (err) {
      log('Error fetching topic: %s', err)
      return next()
    }

    if (!topic) return res.status(404).send()

    req.topic = topic

    if (!topic.forum) return next()

    api.forum.findById(topic.forum, function (_err, forum) {
      if (_err || !forum) return _handleError(_err, req, res)
      req.forum = forum
      next()
    })
  })
})

app.get('/topic/all',
  forumMiddlewares.findForumById,
  privileges('canView'),
  function (req, res, next) {
    if (req.query.draft) {
      privileges('canChangeTopics')(req, res, next)
    } else {
      next()
    }
  },
  function (req, res) {
    log('Request /topic/all')

    api.topic.all({
      forum: req.forum
    }, function (err, topics) {
      if (err) return _handleError(err, req, res)

      topics = topics.filter(function (topic) {
        if (topic.public) return true
        if (req.query.draft && topic.draft) return true
        return false
      })

      log('Serving topics.')

      res.json(topics.map(function (topicDoc) {
        return exposeTopic(topicDoc, req.user, topicListKeys)
      }))
    })
  }
)

app.get('/topic/:id', privileges('canView'), function (req, res) {
  log('Request GET /topic/%s', req.params.id)

  migrateTopic(req.topic, function (_err, topicMigrated) {
    if (_err) return _handleError(_err, req, res)
    log('Serving topic %s', topicMigrated.id)
    res.json(exposeTopic(topicMigrated, req.user))
  })
})

// TODO: Change endpoint -- move to comment-api
app.get('/topic/:id/sidecomments', privileges('canView'), function (req, res) {
  log('Requesting /topic/%s/sidecomments', req.params.id)
  api.comment.getSideComments(req.params.id, null, function (err, comments) {
    if (err) return _handleError(err, req, res)
    log("Serving topic %s body's comments.", req.params.id)

    var keys = [
      'id text createdAt editedAt context reference',
      'author.id author.fullName author.displayName author.avatar',
      'flags upvotes downvotes votes replies.length'
    ].join(' ')

    res.json(comments.map(expose(keys)))
  })
})

app.get('/topic/:id/comments', privileges('canView'), function (req, res) {
  log('Request /topic/%s/comments', req.params.id)

  var sort = ''
  if (~['-score', '-createdAt', 'createdAt'].indexOf(req.query.sort)) {
    sort = req.query.sort
  } else {
    sort = '-score'
  }

  var paging = {
    page: req.query.page || 0,
    limit: req.query.limit || 0,
    sort: sort,
    exclude_user: req.query.exclude_user || null
  }

  api.topic.comments(req.params.id, paging, function (err, comments) {
    if (err) return _handleError(err, req, res)

    if (!req.query.count) {
      log('Serving topic %s comments.', req.params.id)

      var keys = [
        'id text createdAt editedAt context reference',
        'author.id author.fullName author.displayName author.avatar',
        'flags upvotes downvotes votes replies.length'
      ].join(' ')

      res.json(comments.map(expose(keys)))
    } else {
      log('Serving topic %s comments count: %d', req.params.id, comments.length)

      res.json(comments.length)
    }
  })
})

app.get('/topic/:id/my-comments', restrict, privileges('canView'), function (req, res) {
  log('Request /topic/%s/my-comments', req.params.id)

  api.topic.userComments(req.params.id, req.user.id, function (err, comments) {
    if (err) return _handleError(err, req, res)

    log('Serving topic %s comments for user %s', req.params.id, req.user.id)

    var keys = [
      'id text createdAt editedAt context reference',
      'author.id author.fullName author.displayName author.avatar',
      'flags upvotes downvotes votes replies.length'
    ].join(' ')

    res.json(comments.map(expose(keys)))
  })
})

app.post('/topic/:id/comment',
  restrict,
  privileges('canVoteAndComment'),
  function (req, res) {
    log('Request /topic/%s/comment %j', req.params.id, req.body.comment)

    var comment = {
      text: req.body.text,
      context: req.body.context || 'topic',
      reference: req.params.id,
      topicId: req.body.topicId,
      author: req.user.id
    }

    api.topic.comment(comment, function (err, commentDoc) {
      if (err) return _handleError(err, req, res)

      var keys = [
        'id text',
        'author.id author.fullName author.displayName author.avatar',
        'upvotes downvotes flags',
        'createdAt replies context reference'
      ].join(' ')

      res.json(200, expose(keys)(commentDoc))
    })
  }
)

app.post('/topic/:id/vote',
  restrict,
  privileges('canVoteAndComment'),
  function (req, res) {
    log('Request /topic/%s/vote', req.param('id'))

    api.topic
      .vote(
        req.param('id'),
        req.user,
        req.param('value'),
        function (err, topic) {
          if (err) return _handleError(err, req, res)

          var eventName = 'topic-voted'

          notifier.notify(eventName)
            .withData({ topic: topic.id, user: req.user.id, vote: req.param('value') })
            .send(function (err, data) {
              if (err) {
                log('Error when sending notification for event %s', eventName)
              } else {
                log('Successfully notified voting of topic %s', topic.id)
              }
            })

          res.json(exposeTopic(topic, req.user))
        }
    )
  }
)

app.post('/topic/create',
  restrict,
  forumMiddlewares.findForumById,
  privileges('canChangeTopics'),
  function (req, res, next) {
    log('Request /topic/create %j', req.body)

    req.body.forum = req.forum
    api.topic.create(req.body, function (err, topic) {
      if (err) return next(err)
      res.json(exposeTopic(topic, req.user))
    })
  }
)

app.post('/topic/:id', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request POST /topic/%s', req.params.id)

  api.topic.update(req.params.id, req.body, function (err, topic) {
    if (err) return _handleError(err, req, res)
    log('Serving topic %s', topic.id)
    res.json(exposeTopic(topic, req.user))
  })
})

app.post('/topic/:id/link', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request POST /topic/%s/link', req.params.id)

  var link = req.body.link
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res)

    var linkDoc = link && link.id
      ? topicDoc.links.id(link.id)
      : topicDoc.links.create()

    linkDoc.update(link)
    if (linkDoc.isNew) topicDoc.links.push(linkDoc)

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res)

      res.json(200, expose('id text url')(linkDoc))
    })
  })
})

app.delete('/topic/:id/link', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request DELETE /topic/%s/link', req.params.id)

  var link = req.body.link
  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res)

    topicDoc.links.remove(link)
    log('removed link %s from topic %s', link, topicDoc.id)

    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res)

      res.json(200)
    })
  })
})

app.post('/topic/:id/publish', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request POST /topic/%s/publish', req.params.id)

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res)

    topic.publishedAt = new Date()
    topic.save(function (err, saved) {
      if (err) return _handleError(err, req, res)
      log('publish topic %s at %s', topic.id, topic.publishedAt)

      var eventName = 'topic-published'

      var topicUrl = utils.buildUrl(config, { pathname: '/topic/' + topic.id })

      var data = {
        topic: { mediaTitle: topic.mediaTitle, id: topic.id },
        url: topicUrl
      }

      if (config.deploymentId) {
        data.deploymentId = config.deploymentId
      }

      if (!config.multiForum) {
        notifier.notify(eventName)
          .withData(data)
          .send(function (notifyErr) {
            if (notifyErr) {
              log('Error when sending notification for event %s', eventName)
            } else {
              log('Successfully notified publishing of topic %s', topic.id)
            }
          })
      }
    })

    res.json(exposeTopic(topic, req.user))
  })
})

app.post('/topic/:id/unpublish', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request POST /topic/%s/unpublish', req.params.id)

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res)

    topicDoc.publishedAt = null
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res)
      log('unpublished topic %s', topicDoc.id)
      res.json(exposeTopic(topicDoc, req.user))
    })
  })
})

app.delete('/topic/:id', restrict, privileges('canChangeTopics'), function (req, res) {
  log('Request DEL /topic/%s', req.params.id)

  api.topic.get(req.params.id, function (err, topicDoc) {
    if (err) return _handleError(err, req, res)

    topicDoc.deletedAt = new Date()
    topicDoc.save(function (err, saved) {
      if (err) return _handleError(err, req, res)
      log('deleted topic %s', topicDoc.id)
      res.json(200)
    })
  })
})

function _handleError (err, req, res) {
  log('Error found: %s', err)
  var error = err
  if (err.errors && err.errors.text) error = err.errors.text
  if (error.type) error = error.type

  res.json(400, { error: error })
}
