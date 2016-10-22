const express = require('express')
const validate = require('../validate')
const middlewares = require('../middlewares')
const api = require('../db-api')

const app = module.exports = express()

app.get('/comments',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    topicId: {
      type: 'string',
      required: true,
      format: 'mongo-object-id',
      description: 'id of the Topic to fetch comments from'
    },
    sort: {
      enum: ['score', '-score', 'createdAt', '-createdAt'],
      default: '-score'
    }
  })
}),
middlewares.topics.findByTopicId,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canView,
function getComments (req, res, next) {
  Promise.all([
    api.comments.list(req.query),
    api.comments.listCount(req.query)
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
        comments: results[0]
      }
    })
  }).catch(next)
})

app.post('/comments/:id/vote',
middlewares.users.restrict,
validate({
  payload: {
    type: {
      enum: ['positive', 'negative'],
      required: true
    }
  }
}),
middlewares.comments.findById,
middlewares.topics.findFromComment,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canVoteAndComment,
function postCommentsVote (req, res, next) {
  api.comments.vote({
    id: req.query.id,
    user: req.user,
    type: req.query.type
  }).then((comment) => {
    res.json({
      status: 200,
      results: {
        comment: comment
      }
    })
  }).catch(next)
})
