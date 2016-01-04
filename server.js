/**
 * Module Dependencies
 */

import api from 'api'
import 'colors'
import config from 'config'
import debug from 'debug'
import express from 'express'
import site from 'site'
import { connect as modelsConnect } from 'lib/models'

const app = express()
const log = debug('democracyos')
const PORT = process.env.PORT || config.publicPort

app
  .use('/api', api)
  .use('/', site)


modelsConnect
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
