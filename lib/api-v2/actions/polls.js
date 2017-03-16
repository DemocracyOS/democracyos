const express = require('express')
const validate = require('../validate')
const middlewares = require('../middlewares')
const api = require('../db-api')

const app = module.exports = express()

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
