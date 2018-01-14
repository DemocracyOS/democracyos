const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const logger = require('./logger')
const app = express()

// Apply middlewares
app.use(helmet())
app.use(express.json())
app.use(compression())
app.use(logger.middleware)

// API routes
app.use('/api/v1.0',
  require('./users/api')
  // require('./cms/api'),
  // require('./reactions/api')
)

module.exports = app
