const express = require('express')
const middlewares = require('lib/api-v2/middlewares')

const app = module.exports = express()

app.post('/topics',
middlewares.users.restrict,
middlewares.forums.findFromBody,
function postTopics (req, res, next) {
  if (req.forum.name === 'ideas') {
    req.body['action.method'] = 'cause'
  }
  next()
})
