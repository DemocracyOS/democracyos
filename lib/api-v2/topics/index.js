const debug = require('debug')
const express = require('express')
const notifier = require('lib/notifications').notifier
const validate = require('../validate')
const middlewares = require('../middlewares')
const api = require('../db-api')

const log = debug('democracyos:api:topic')

const app = module.exports = express.Router()

app.get('/topics',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    limit: { // disable pagination until is implemented on front-end
      type: 'integer',
      default: 500,
      minimum: 1,
      maximum: 500,
      description: 'amount of results per page'
    },
    forum: {
      type: 'string',
      required: true,
      format: 'mongo-object-id',
      description: 'id of the Forum to fetch topics from'
    },
    sort: {
      type: 'string',
      enum: ['createdAt', '-createdAt', 'participantsCount', '-participantsCount'],
      default: '-createdAt'
    },
    tag: {
      type: 'string'
    },
    draft: {
      type: 'string',
      enum: ['true']
    }
  })
}),
middlewares.forums.findFromQuery,
middlewares.forums.privileges.canView,
function (req, res, next) {
  if (req.query.draft) {
    middlewares.forums.privileges.canChangeTopics(req, res, next)
  } else {
    next()
  }
},
function getTopics (req, res, next) {
  Promise.all([
    api.topics.list({
      user: req.user,
      forum: req.forum,
      limit: req.query.limit,
      page: req.query.page,
      tag: req.query.tag,
      sort: req.query.sort,
      draft: !!req.query.draft
    }),
    req.query.limit
    // api.topics.listCount(req.query)
  ]).then((results) => {
    res.json({
      status: 200,
      pagination: {
        count: results[1],
        page: req.query.page,
        pageCount: Math.ceil(results[1] / req.query.limit) || 1,
        limit: req.query.limit
      },
      results: {
        topics: results[0]
      }
    })
  }).catch(next)
})

app.get('/topics/:id',
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canView,
function getTopic (req, res, next) {
  api.topics.get({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics',
middlewares.users.restrict,
middlewares.forums.findFromBody,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.parseUpdateableKeys,
middlewares.topics.autoPublish,
function postTopics (req, res, next) {
  api.topics.create({
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.put('/topics/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canEdit,
middlewares.topics.parseUpdateableKeys,
middlewares.topics.autoPublish,
function putTopics (req, res, next) {
  api.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.delete('/topics/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canDelete,
function deleteTopics (req, res, next) {
  log('Request DEL /topic/%s', req.params.id)

  api.topics.destroy({ id: req.params.id })
    .then(() => {
      res.json({ status: 200 })
    }).catch(next)
})

app.post('/topics/:id/vote',
middlewares.users.restrict,
validate({
  payload: {
    value: {
      type: 'string',
      enum: ['positive', 'negative', 'neutral'],
      required: true
    }
  }
}),
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canVoteAndComment,
function postTopicVote (req, res, next) {
  api.topics.vote({
    id: req.params.id,
    user: req.user,
    forum: req.forum,
    value: req.body.value
  }).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/poll',
middlewares.users.restrict,
validate({
  payload: {
    value: {
      type: 'string',
      required: true
    }
  }
}),
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canVoteAndComment,
function postTopicPoll (req, res, next) {
  api.topics.poll({
    id: req.params.id,
    user: req.user,
    forum: req.forum,
    value: req.body.value
  }).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/cause',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canVoteAndComment,
function postTopicSupport (req, res, next) {
  api.topics.support({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})
