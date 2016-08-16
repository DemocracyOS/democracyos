var express = require('express')
var Comment = require('lib/models').Comment
var validate = require('../validate')
var paginationSchema = require('../validate/pagination-schema')
var topicsMiddlewares = require('../topics/middlewares')
var forumsMiddlewares = require('../forums/middlewares')
var fields = require('./fields')

var log = require('debug')('democracyos:api:comments')

var app = module.exports = express()

app.get('/comments', validate({
  query: Object.assign({}, paginationSchema, {
    topicId: {
      type: 'string',
      required: true,
      format: 'mongo-object-id',
      description: 'id of the Topic to fetch comments from'
    },
    sort: {
      enum: ['score', '-score', '-createdAt', 'createdAt'],
      default: '-score'
    }
  })
}),
topicsMiddlewares.findByTopicId,
forumsMiddlewares.findFromTopic,
function getComments (req, res, next) {
  log('GET /api/comments')

  var query = () => Comment.findDefault()
    .where({reference: req.query.topicId})
    .populate('author')
    .limit(req.query.limit)
    .skip(req.query.page * req.query.limit)

  Promise.all([
    query()
      .select(fields.ordinary.select)
      .sort(req.query.sort)
      .exec(),
    query()
      .count()
      .exec()
  ]).catch((err) => {
    log('GET /api/comments ERROR', err)
    next(new Error('Server error.'))
  }).then((results) => {
    res.json({
      status: 200,
      count: results[1],
      page: req.query.page,
      limit: req.query.limit,
      comments: results[0].map(fields.ordinary.expose)
    })
  })
})
