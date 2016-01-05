import { Topic } from 'lib/models'
import { Router } from 'express'
import { accepts } from 'lib/utils'

const app = new Router()

app.use(accepts('application/json'))

app.get('/', (req, res) => {
  Topic
    .find()
    .then((topics) => {
      res.send(topics)
    })
})

export default app
