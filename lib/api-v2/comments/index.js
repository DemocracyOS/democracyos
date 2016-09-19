var express = require('express')
var debug = require('debug')
var validate = require('../validate')
var middlewares = require('../middlewares')
var api = require('../db-api')

var log = debug('democracyos:api:comments')

var app = module.exports = express()

app.get('/comments', validate({
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
middlewares.forums.privileges('canView'),
function getComments (req, res, next) {
  log('GET /api/comments')

  Promise.all([
    api.comments.list(req.query),
    api.comments.listCount(req.query)
  ]).catch((err) => {
    log('GET /api/comments ERROR', err)
    next(new Error('Server error.'))
  }).then((results) => {
    res.json({
      status: 200,
      count: results[1],
      page: req.query.page,
      limit: req.query.limit,
      comments: results[0]
    })
  })
})
