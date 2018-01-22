const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const logger = require('./logger')
const routes = require('./routes')
const app = express()

// Apply middlewares
app.use(helmet())
app.use(express.json())
app.use(compression())
app.use(logger.middleware)

// Apply routes
app.use(routes)

module.exports = app
