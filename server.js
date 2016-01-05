import api from 'api'
import config from 'config'
import debug from 'debug'
import express from 'express'
import site from 'site'
import { ready as modelsReady } from 'lib/models'
import nowww from 'nowww'

const app = express()
const log = debug('democracyos')
const PORT = process.env.PORT || config.publicPort

app
  .use(nowww())
  .use('/api', api)
  .use('/', site)

modelsReady()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) return log(`❌ Failed to start DemocracyOS due to error: ${err}`)
      log(`🚀 App started at port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
