import { Router } from 'express'
import pckg from 'package.json'
import topicApi from './topic-api'

const app = new Router()

/**
 * API version
 */

app.get('/', (req, res) => res.send(`DemocracyOS v${pckg.version}`))

/**
 * Topic API
 */

app.use('/topic', topicApi)

export default app
