import { Topic } from 'lib/models'
import { Router } from 'express'

const app = new Router()

app.get('/', (req, res) => {
  Topic
    .find()
    .then((topics) => {
      res.send(topics)
    })
})

export default app
