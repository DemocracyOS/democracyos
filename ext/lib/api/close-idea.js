const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const api = require('lib/api-v2/db-api')

const app = module.exports = express()

app.delete('/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canChangeTopics,
function postTopics (req, res, next) {
  api.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, {
    closingAt: Date.now()
  }).then((topic) => {
    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})
