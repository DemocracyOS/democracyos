const express = require('express')
const validate = require('../validate')
const middlewares = require('../middlewares')
const api = require('../db-api')

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
    page: {
      type: 'integer',
      default: 1,
      minimum: 1,
      description: 'number of page'
    },
    forum: {
      type: 'string',
      required: true,
      format: 'mongo-object-id',
      description: 'id of the Forum to fetch topics from'
    },
    sort: {
      type: 'string',
      enum: ['createdAt', '-createdAt', 'action.count', '-action.count'],
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
    req.query.limit,
    api.topics.listCount(req.forum)
  ]).then((results) => {
    res.status(200).json({
      status: 200,
      pagination: {
        count: results[2],
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

app.post('/topics/tags',
  middlewares.users.restrict,
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canChangeTopics,
  (req, res, next) => {
    api.topics.updateTags({
      forum: req.forum,
      oldTags: req.body.oldTags,
      newTags: req.body.newTags
    })
      .then((result) => res.status(200).end())
      .catch(next)
  })

app.get('/topics/tags',
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canView,
  (req, res, next) => {
    api.topics.getTags({
      forum: req.forum,
      sort: req.query.sort,
      limit: req.query.limit,
      page: req.query.page
    })
      .then((result) => res.status(200).json(result))
      .catch(next)
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
    res.status(200).json({
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
  if (req.keysToUpdate['action.method'] === 'poll' || req.keysToUpdate['action.method'] === 'hierarchy') {
    req.keysToUpdate['action.options'] = req.body['action.options']
  }

  api.topics.create({
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then((topic) => {
    res.status(200).json({
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
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/publish',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canPublishTopics,
middlewares.topics.privileges.canEdit,
function publishTopic (req, res, next) {
  api.topics.publish({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/unpublish',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canPublishTopics,
middlewares.topics.privileges.canEdit,
function unpublishTopic (req, res, next) {
  api.topics.unpublish({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.status(200).json({
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
  api.topics.destroy({ id: req.params.id })
    .then(() => res.status(200).json({ status: 200 }))
    .catch(next)
})

app.post('/topics/:id/vote',
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
middlewares.topics.privileges.canVote,
function postTopicVote (req, res, next) {
  api.topics.vote({
    id: req.params.id,
    user: req.user,
    forum: req.forum,
    value: req.body.value
  }).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch((err) => {
    if (err.code === 'ALREADY_VOTED' || err.code === 11000) {
      return next({ status: 400, code: 'ALREADY_VOTED' })
    }

    next(err)
  })
})
