import { Router } from 'express'
import pckg from 'package.json'
import topicApi from './topic-api'
import parser from 'body-parser'

const app = new Router()

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

/**
 * API version
 */

app.get('/', (req, res) => res.send(`DemocracyOS v${pckg.version}`))

/**
 * Topic API
 */

app.use('/topic', topicApi)

export default app
