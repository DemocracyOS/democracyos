import debug from 'debug'
import { Topic } from 'lib/models'
import { Router } from 'express'
import { accepts, expose, pluck, handleError } from 'lib/utils'

const app = new Router()
const log = debug('democracyos:topic-api')

// app.use(accepts('application/json'))

app.get('/', (req, res) => {
  Topic
    .find()
    .then((topics) => {
      res.send(topics)
    })
})

app.get('/:id', function (req, res) {
  Topic
    .findById(req.params.id)
    .then((topic) => {
      res.json(topic.toJSON())
    })
    .catch((err) => {
      handleError(err, req, res)
    })
})

app.get('/:id/participants', (req, res) => {
  Topic
    .findById(req.params.id)
    .populate('participants', 'id firstName lastName avatar')
    .select('participants')
    .then((topic) => {
      if (!topic) return res.status(404).send()

      const { participants } = topic
      log('Found %j participants for topic %s', pluck(participants), req.params.id)
      res.json(participants)
    })
    .catch((err) => {
      handleError(err, req, res)
    })
})

export default app
