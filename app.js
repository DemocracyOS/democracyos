const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const paginate = require('express-paginate')
const logger = require('./logger')
const app = express()

// Apply middlewares
app.use(helmet())
app.use(express.json())
app.use(compression())
app.use(logger.middleware)

// Apply paginate middleware to API routes
app.use('/api/v1.0',
  function (req, res, next) {
    // set default or minimum is 10
    if (req.query.limit <= 10) req.query.limit = 10
    next()
  },
  paginate.middleware(10, 50)
)

// API routes
app.use('/api/v1.0',
  require('./users/api')
  // require('./cms/api'),
  // require('./reactions/api')
)

module.exports = app
