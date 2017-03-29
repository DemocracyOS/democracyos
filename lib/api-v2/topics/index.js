const debug = require('debug')
const express = require('express')
const notifier = require('lib/notifications').notifier
const validate = require('../validate')
const middlewares = require('../middlewares')
const api = require('../db-api')

var log = debug('democracyos:vote')

const app = module.exports = express.Router()

app.put('/topics/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canChangeTopics,
middlewares.topics.privileges.canEdit,
function putTopics (req, res, next) {
  return res.json({
    status: 200,
    results: {
      topic: req.topic
    }
  })

  // api.topics.edit({
  //   id: req.params.id,
  //   user: req.user,
  //   attrs: req.body.topic
  // }).then((topic) => {
  //   res.json({
  //     status: 200,
  //     results: {
  //       topic: topic
  //     }
  //   })
  // }).catch(next)
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
    value: req.body.value
  }).then((topic) => {
    notifier.notify('topic-voted')
      .withData({ topic: topic.id, user: req.user.id, vote: req.body.value })
      .send(function (err, data) {
        if (err) {
          log('Error when sending notification for event topic-voted')
        } else {
          log('Successfully notified voting of topic %s', topic.id)
        }
      })

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
    value: req.body.value
  }).then((topic) => {
    notifier.notify('topic-voted')
      .withData({ topic: topic.id, user: req.user.id, vote: req.body.value })
      .send(function (err, data) {
        if (err) {
          log('Error when sending notification for event topic-voted')
        } else {
          log('Successfully notified voting of topic %s', topic.id)
        }
      })

    res.json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})
